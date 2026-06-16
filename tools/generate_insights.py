#!/usr/bin/env python3
"""
SYMETA — insight build script
==============================
Regenerates ``assets/js/insights.js`` with REAL Claude Sonnet 4.6 output,
keeping the exact shape the front-end expects:

    window.SYMETA_INSIGHTS = { generatedAt, model, people, teams, portfolio }

Insights are generated at *build time* and baked into the static site, which
(a) matches the product spec — "cached, runs once per data view" — and
(b) keeps the API key server-side so it is never shipped to the browser.

Usage
-----
    pip install -r requirements.txt
    cp .env.example .env            # add ANTHROPIC_API_KEY
    python generate_insights.py            # generate + write insights.js
    python generate_insights.py --dry-run  # print the prompts only, no API calls
    python generate_insights.py --only maya,alpha   # regenerate a subset

The dataset is read from ../data/demo_data.json (the machine-readable mirror of
assets/js/data.js).
"""
from __future__ import annotations
import argparse, json, os, sys, datetime, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "demo_data.json"
OUT = ROOT / "assets" / "js" / "insights.js"
MODEL = "claude-sonnet-4-6"

SYSTEM = """You are SYMETA's assessment interpreter. SYMETA measures entrepreneurial human
capital through the SENSE assessment (24 bipolar traits across Working, Thinking, Social and
Grit styles, plus motivational Drivers) which rolls up into the 12 Gears of Entrepreneurship,
organised in 4 levers:
  - Thinking: Vision, Strategy, Resourcefulness
  - Operating: Execution, Innovation, Decision Making
  - Relating: Collaboration, Direction, Influence
  - Adapting: Vitality, Resilience, Persisting
Gear scores run 0-100 (benchmark bands ~45-70; <40 is a liability, >=75 a strength). Team
Health is measured on the ABC model (Alliance, Balance, Coordination) on a 1-5 scale.

Voice: concise, evidence-grounded, developmental (never deterministic about performance or
worth). Speak to founders. This report is about behaviour and growth, not a verdict.
Return STRICT JSON only — no prose outside the JSON, no markdown fences."""


def load():
    if not DATA.exists():
        sys.exit(f"Dataset not found at {DATA}. Run:\n  node -e \"global.window={{}};"
                 "require('./assets/js/data.js');require('fs').writeFileSync("
                 "'data/demo_data.json',JSON.stringify(window.SYMETA,null,2))\"")
    return json.loads(DATA.read_text(encoding="utf-8"))


def person_prompt(d, pid):
    p = d["people"][pid]
    team = next(t for t in d["teams"] if t["id"] == p["teamId"])
    return f"""Founder: {p['name']} — {p['role']} at {team['name']} ({team['tagline']}).

Gear scores (0-100): {json.dumps(p['pillars'])}
Previous assessment:   {json.dumps(p['prev'])}
Traits (0=left pole, 100=right pole): {json.dumps(p['traits'])}
Drivers (0-100): {json.dumps(p['drivers'])}

Produce JSON with this exact schema:
{{
  "overall": "2-3 sentence read of this founder",
  "cornerstones": {{"cognition":"1-2 sentences", "action":"...", "relational":"...", "motivational":"..."}},  // the 4 levers: Thinking / Operating / Relating / Adapting (keys are internal ids)
  "pillars": {{ "<gearId>": {{"summary":"1-2 sentences", "actions":["...","..."]}} }},  // only the 2-4 most notable gears (strengths + liabilities); keys are gear ids
  "styles": {{"working":"...", "thinking":"...", "social":"...", "grit":"..."}},
  "drivers": "1-2 sentences on what energises them, flag low work-life balance if relevant"
}}"""


def team_prompt(d, tid):
    t = next(x for x in d["teams"] if x["id"] == tid)
    members = {mid: d["people"][mid]["pillars"] for mid in t["memberIds"]}
    th = d["teamHealthData"][tid]["components"]
    return f"""Team: {t['name']} ({t['tagline']}, {t['stage']} stage), {len(t['memberIds'])} founders.

Member gear scores: {json.dumps(members)}
Team Health by quarter (Alliance/Balance/Coordination, 1-5): {json.dumps(th)}

Produce JSON with this exact schema:
{{
  "overall": "3-4 sentence team read",
  "composition": "how balanced/complementary the composition is",
  "complementary": "where members complement each other",
  "conflicts": "conflict / balance / composition watch-items and risks",
  "teamHealth": {{"overall":"...", "alliance":"...", "balance":"...", "coordination":"..."}},
  "nextSteps": ["action 1", "action 2", "action 3"]
}}"""


def portfolio_prompt(d):
    pillar_ids = [p["id"] for p in d["meta"]["pillars"]]
    summ = {}
    for t in d["teams"]:
        members = t["memberIds"]
        summ[t["name"]] = {
            k: round(sum(d["people"][m]["pillars"][k] for m in members) / len(members))
            for k in pillar_ids
        }
    return f"""Cohort: {d['portfolio']['name']} — comparing teams {list(summ.keys())}.

Team-average gear scores: {json.dumps(summ)}

Produce JSON with this exact schema:
{{
  "overall": "3-4 sentence cross-team read",
  "comparison": "how the teams differ and what that implies for coaching/capital attention",
  "recommendations": ["rec 1", "rec 2", "rec 3"]
}}"""


def call(client, prompt):
    msg = client.messages.create(
        model=MODEL, max_tokens=1500, system=SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    )
    text = "".join(b.text for b in msg.content if b.type == "text").strip()
    if text.startswith("```"):
        text = text.strip("`").split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(text)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="print prompts, do not call the API")
    ap.add_argument("--only", default="", help="comma-separated person/team ids to regenerate")
    args = ap.parse_args()
    only = set(filter(None, args.only.split(",")))

    d = load()
    prompts = {"people": {pid: person_prompt(d, pid) for pid in d["people"]},
               "teams": {t["id"]: team_prompt(d, t["id"]) for t in d["teams"]},
               "portfolio": portfolio_prompt(d)}

    if args.dry_run:
        for pid, pr in prompts["people"].items():
            print(f"\n===== PERSON {pid} =====\n{pr}")
        for tid, pr in prompts["teams"].items():
            print(f"\n===== TEAM {tid} =====\n{pr}")
        print(f"\n===== PORTFOLIO =====\n{prompts['portfolio']}")
        return

    try:
        from dotenv import load_dotenv; load_dotenv()
    except ImportError:
        pass
    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("Set ANTHROPIC_API_KEY (e.g. in tools/.env).")
    import anthropic
    client = anthropic.Anthropic()

    result = {"generatedAt": datetime.date.today().isoformat(), "model": MODEL,
              "people": {}, "teams": {}, "portfolio": {}}
    for pid, pr in prompts["people"].items():
        if only and pid not in only:
            continue
        print(f"· generating person: {pid}")
        result["people"][pid] = call(client, pr)
    for tid, pr in prompts["teams"].items():
        if only and tid not in only:
            continue
        print(f"· generating team: {tid}")
        result["teams"][tid] = call(client, pr)
    if not only or "portfolio" in only:
        print("· generating portfolio")
        result["portfolio"] = call(client, prompts["portfolio"])

    banner = ("/* AUTO-GENERATED by tools/generate_insights.py — do not edit by hand.\n"
              f"   model: {MODEL}  ·  generated: {result['generatedAt']} */\n")
    OUT.write_text(banner + "window.SYMETA_INSIGHTS = " + json.dumps(result, indent=2, ensure_ascii=False) + ";\n",
                   encoding="utf-8")
    print(f"\nWrote {OUT}")


if __name__ == "__main__":
    main()

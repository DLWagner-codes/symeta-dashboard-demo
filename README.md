# SYMETA — Demo Dashboard

An interactive, **dependency-free** demo of SYMETA's entrepreneurial human-capital
dashboards. It ships with pre-loaded (synthetic) data for **6 founders across 2 startups**
and renders **Tier 1 / Tier 2 / Tier 3** views over the **12 Gears of Entrepreneurship**
and the **Team Health (ABC)** assessment, with cached AI-style insights at every level.

> This is a demo. All names and scores are fictional and hand-crafted to illustrate the
> product — they are **not** real assessment results. No proprietary scoring logic or
> confidential assessment items are included.

---

## What's in the demo

| Tier | View | Highlights |
|------|------|-----------|
| **Tier 1** | Individual | 12-Gears polar wheel with benchmark bands, drill-down to human-capital traits (bipolar plots) and drivers, longitudinal progress, cached AI insight at the overall / lever / gear level, resource library, CSV + print-to-PDF. |
| **Tier 2** | Team | Team-averaged wheel with **drag-and-drop** member composition (instant recompute), individual overlays, complementary-strengths & conflict/balance insights, **Team Health (ABC)** grouped columns with construct drill-down. |
| **Tier 3** | Portfolio | Compares both startups across a cohort: capability index KPIs, grouped per-team cards (Gears + Team Health), and a portfolio-level cross-team read with recommendations. |

The two teams are deliberately contrasted:

- **Northwind** — a healthy, complementary 4-person team (each lever has a clear owner).
- **Lumen Health** — two overlapping co-founders (both strong in Thinking/Vitality, both
  thin in Execution/Collaboration) → a classic co-founder-misalignment story.

### The framework
- **12 Gears** in **4 levers**: Thinking (Vision, Strategy, Resourcefulness),
  Operating (Execution, Innovation, Decision Making), Relating (Collaboration, Direction,
  Influence), Adapting (Vitality, Resilience, Persisting).
- **SENSE human-capital traits** (Working / Thinking / Social / Grit styles) + 6 Drivers.
- **Team Health ABC**: Alliance, Balance, Coordination (3 constructs each), 1–5 scale by quarter.

---

## Run locally

No build step. Any static server works:

```bash
python -m http.server 5500
# then open http://localhost:5500
```

(Opening `index.html` directly from disk also works — all data is embedded in JS, so there
are no `fetch`/CORS issues.)

---

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**, branch
   `main`, folder `/ (root)`.
3. Your demo will be live at `https://<user>.github.io/<repo>/`.

---

## Project structure

```
index.html                 # app shell (top bar, sidebar, mount point)
assets/
  css/tokens.css           # SYMETA brand design tokens (light + dark)
  css/app.css              # layout & components
  js/data.js               # the demo dataset (window.SYMETA)
  js/insights.js           # cached insights (window.SYMETA_INSIGHTS)
  js/charts.js             # dependency-free SVG charts (polar/grouped/line)
  js/app.js                # hash router + tier 1/2/3 views + interactions
data/demo_data.json        # machine-readable mirror of the dataset (for tooling)
tools/generate_insights.py # build script: regenerate insights.js with real Sonnet 4.6
```

---

## AI insights

The insight text in `assets/js/insights.js` is currently **hand-authored** in the voice and
structure that Claude (Sonnet 4.6) produces for SYMETA, and is **cached** — matching the
product spec ("runs once per data view, until the underlying data changes").

To regenerate it with **real Claude Sonnet 4.6** output:

```bash
cd tools
pip install -r requirements.txt
cp .env.example .env          # add your ANTHROPIC_API_KEY
python generate_insights.py   # reads ../data/demo_data.json, writes ../assets/js/insights.js
```

The model id is `claude-sonnet-4-6`. Because GitHub Pages is static, insights are baked in
at build time rather than called live in the browser (no API key is ever shipped).

---

## Roadmap → functional version (goal 2)

This demo is the front-end foundation for the functional product, which will:
- ingest up to ~10 users of real assessment data at a time,
- assign the correct tier view automatically,
- generate insights live via the Claude API behind a small server/serverless proxy
  (so the API key stays server-side),
- add accounts, consent/permission boundaries, and assessment intake.

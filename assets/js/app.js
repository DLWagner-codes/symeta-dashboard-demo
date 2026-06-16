/* ============================================================
   SYMETA — demo application
   Hash router + tier 1/2/3 views, all client-side, no deps.
   ============================================================ */
(function () {
  'use strict';
  const D = window.SYMETA, I = window.SYMETA_INSIGHTS, CH = window.SYMETA_CHARTS;
  const $ = (s, r = document) => r.querySelector(s);
  const pById = {}, csById = {};
  D.meta.pillars.forEach(p => pById[p.id] = p);
  D.meta.cornerstones.forEach(c => csById[c.id] = c);

  /* ---------------- helpers ---------------- */
  const avg = a => a.reduce((s, x) => s + x, 0) / a.length;
  const round = n => Math.round(n);
  function teamAverage(ids) {
    const out = {};
    D.meta.pillars.forEach(p => { out[p.id] = round(avg(ids.map(id => D.people[id].pillars[p.id]))); });
    return out;
  }
  function cornerstoneScore(scores, csId) {
    const ps = D.meta.pillars.filter(p => p.cornerstone === csId);
    return round(avg(ps.map(p => scores[p.id])));
  }
  function statusOf(score) {
    if (score >= 75) return { k: 'strength', t: 'Strength' };
    if (score < 40) return { k: 'liability', t: 'Liability' };
    if (score < 50) return { k: 'watch', t: 'Watch' };
    return { k: 'inrange', t: 'In range' };
  }
  function pillarInsight(personId, pid) {
    const pi = I.people[personId];
    if (pi && pi.pillars && pi.pillars[pid]) return pi.pillars[pid];
    const score = D.people[personId].pillars[pid];
    const b = D.meta.benchmarks[pid];
    const st = statusOf(score);
    return { summary: `Scored ${score} — ${st.t.toLowerCase()} relative to the benchmark range (${b[0]}–${b[1]}).`, actions: [] };
  }
  function download(name, text, type) {
    const blob = new Blob([text], { type: type || 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function csv(rows) { return rows.map(r => r.map(c => (/[",\n]/.test(String(c)) ? '"' + String(c).replace(/"/g, '""') + '"' : c)).join(',')).join('\n'); }
  function cssVar(v) {
    if (!v) return v;
    const m = /^var\((--[^)]+)\)$/.exec(String(v).trim());
    const name = m ? m[1] : v;
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || v;
  }

  /* ---------------- icons ---------------- */
  const ico = {
    add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 20c0-2 .5-3 2-3.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c1 1 1 2 1 3h6c0-1 0-2 1-3a7 7 0 0 0-4-12z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M12 3l1.8 4.8L18 9.6l-4.2 1.8L12 16l-1.8-4.6L6 9.6l4.2-1.8z"/></svg>',
  };

  /* ---------------- shell: sidebar ---------------- */
  function renderSidebar() {
    const theme = document.documentElement.getAttribute('data-theme');
    $('#sidebar').innerHTML = `
      <a class="ico" href="#/" title="Add (demo)">${ico.add}</a>
      <a class="ico" href="#/" title="Notifications">${ico.bell}<span class="badge">2</span></a>
      <a class="ico" href="#/" title="Assessments">${ico.clip}</a>
      <a class="ico" href="#/" title="Teams">${ico.team}</a>
      <a class="ico" href="#/" title="InsightsAI">${ico.chat}</a>
      <a class="ico" href="#/" title="Develop">${ico.bulb}</a>
      <div class="spacer"></div>
      <button class="theme-toggle" id="themeBtn" title="Toggle light/dark">${theme === 'dark' ? ico.sun : ico.moon}</button>`;
    $('#themeBtn').onclick = () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('symeta-theme', next);
      renderSidebar(); render(); // re-render so canvas-free SVG picks up new vars
    };
  }

  function setHeader(welcome, tier) {
    $('#welcome').textContent = welcome;
    $('#tierpill').textContent = tier;
  }

  /* ---------------- card helper ---------------- */
  function card(tab, body, opts) {
    opts = opts || {};
    return `<section class="card ${opts.cls || ''}">
      <div class="card-head"><span class="tab">${tab}</span>${opts.sub ? `<span class="muted" style="font-size:12px">${opts.sub}</span>` : ''}
        <div class="ctrl">${opts.ctrl || ''}<span class="gear" title="Card settings (demo)">${ico.gear}</span></div></div>
      <div class="card-body">${body}</div></section>`;
  }

  function insightBox(title, html, cached) {
    return `<div class="insight"><h5>${ico.spark} ${title}${cached !== false ? '<span class="cached">cached · runs once per data view</span>' : ''}</h5>${html}</div>`;
  }
  function actionsList(actions) {
    return actions && actions.length ? `<ul>${actions.map(a => `<li>${a}</li>`).join('')}</ul>` : '';
  }

  /* ---------------- pillar list (grouped by cornerstone) ---------------- */
  function pillarList(scores, prev, sel, clickAttr) {
    return `<div class="pillar-list">` + D.meta.cornerstones.map(cs => {
      const ps = D.meta.pillars.filter(p => p.cornerstone === cs.id);
      return `<div class="group"><h4><span class="dot" style="background:${cs.color}"></span>${cs.name}</h4>` +
        ps.map(p => {
          const v = scores[p.id];
          let delta = '';
          if (prev) {
            const d = v - prev[p.id];
            const cls = d > 0 ? 'up' : d < 0 ? 'down' : 'flat';
            delta = `<span class="delta ${cls}">${d > 0 ? '▲' : d < 0 ? '▼' : '—'}${d !== 0 ? Math.abs(d) : ''}</span>`;
          }
          return `<div class="row ${sel === p.id ? 'sel' : ''}" ${clickAttr ? `data-${clickAttr}="${p.id}" style="cursor:pointer"` : ''}>
            <span class="name">${p.name}</span><span><span class="val" style="color:${p.color}">${v}</span>${delta}</span></div>`;
        }).join('') + `</div>`;
    }).join('') + `</div>`;
  }

  /* ---------------- traits (bipolar) ---------------- */
  function traitsBlock(person) {
    return D.meta.traitGroups.map(g => `
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <strong style="font-size:13.5px">${g.name}</strong>
          <span class="muted" style="font-size:11.5px;max-width:60%;text-align:right">${g.blurb}</span>
        </div>
        ${g.traits.map(t => {
          const v = person.traits[t.id];
          return `<div class="trait"><div class="ends"><span>${t.left}</span><span>${t.right}</span></div>
            <div class="track"><span class="mid"></span><span class="pin" style="left:${v}%;background:${person.color}"></span></div></div>`;
        }).join('')}
      </div>`).join('');
  }
  function driversBlock(person) {
    const ds = D.meta.drivers.map(d => ({ d, v: person.drivers[d.id] })).sort((a, b) => b.v - a.v);
    return `<div class="drivers">${ds.map((x, i) => `
      <div class="driver"><span class="rank">${i + 1}</span><span class="lbl">${x.d.name}</span>
      <span class="bar"><span style="width:${x.v}%"></span></span></div>`).join('')}</div>`;
  }

  /* ---------------- resource library ---------------- */
  function resourceCard(filterTags) {
    const items = D.resources;
    const body = `
      <input class="res-search" id="resSearch" placeholder="Search guides, templates and modules…" />
      <div id="resList">${items.map(resRow).join('')}</div>
      <div class="muted" style="font-size:11.5px;margin-top:8px">Links are placeholders — in the live product these files are managed from the SYMETA back-end and gated per module.</div>`;
    return card('Resource Library', body, { cls: 'col-5' });
  }
  function resRow(r) {
    return `<div class="res" data-text="${(r.title + ' ' + r.desc + ' ' + r.tag).toLowerCase()}">
      <div class="ricon">${ico.doc}</div>
      <div><div class="title">${r.title}</div><div class="desc">${r.desc}</div><span class="tag">${r.tag}</span></div>
      <a class="btn" href="${r.href}">${ico.dl} Open</a></div>`;
  }
  function wireResourceSearch() {
    const s = $('#resSearch'); if (!s) return;
    s.oninput = () => {
      const q = s.value.toLowerCase();
      $('#resList').querySelectorAll('.res').forEach(el => {
        el.style.display = el.dataset.text.includes(q) ? '' : 'none';
      });
    };
  }

  /* =====================================================================
     TIER 1 — individual
     ===================================================================== */
  const t1 = { personId: 'maya', tab: 'gears', sel: null, selCs: null, showPrev: false };

  function viewTier1(personId) {
    if (personId) t1.personId = personId;
    const person = D.people[t1.personId];
    const team = D.teams.find(t => t.id === person.teamId);
    setHeader(`Welcome, ${person.name.split(' ')[0]}!`, 'Tier 1 · Individual');

    // persona switcher
    const personas = Object.keys(D.people).map(id =>
      `<button class="${id === t1.personId ? 'on' : ''}" data-person="${id}">${D.people[id].name.split(' ')[0]}</button>`).join('');

    const overallIndex = round(avg(D.meta.pillars.map(p => person.pillars[p.id])));

    let head = `<div class="page-head">
      <div><h1>${person.name} <span class="muted" style="font-weight:500;font-size:15px">· ${person.role}</span></h1>
        <div class="sub">${team.name} — ${team.tagline} · SENSE assessment · ${D.meta.asOf}</div></div>
      <div class="actions">
        <div class="seg">${personas}</div>
        <button class="btn" id="csvBtn">${ico.dl} CSV</button>
        <button class="btn" id="pdfBtn">${ico.print} PDF</button>
      </div></div>`;

    let body = `<div class="grid">`;

    // ---- 12 Gears card ----
    const subtabs = `<div class="subtabs">
      ${['gears:12 Gears', 'human:Human Capital', 'drivers:Drivers', 'progress:Progress'].map(s => {
        const [k, lab] = s.split(':');
        return `<button class="${t1.tab === k ? 'on' : ''}" data-tab="${k}">${lab}</button>`;
      }).join('')}</div>`;

    let gearsBody = subtabs;
    if (t1.tab === 'gears') {
      const wheel = CH.polarGears({
        pillars: D.meta.pillars, cornerstones: D.meta.cornerstones,
        series: [{ id: 'me', color: person.color, scores: person.pillars, kind: 'wedge' }],
        benchmarks: D.meta.benchmarks, selected: t1.sel || t1.selCs, size: 440, interactive: true,
      });
      const side = sidePanel(person);
      gearsBody += `<div class="gears-wrap">
        <div>${pillarList(person.pillars, t1.showPrev ? person.prev : null, t1.sel, 'pillar')}</div>
        <div>${wheel}<div class="legend"><span class="it"><span class="sw" style="background:var(--text-mute);opacity:.3"></span>Benchmark range</span>
          <span class="muted" style="font-size:11.5px">Click a pillar or cornerstone for its cached insight</span></div></div>
        <div>${side}</div></div>`;
    } else if (t1.tab === 'human') {
      gearsBody += `<div style="display:grid;grid-template-columns:1fr 320px;gap:18px">
        <div>${traitsBlock(person)}</div>
        <div>${insightBox('Human Capital — Styles', `
          <p><strong>Working.</strong> ${I.people[t1.personId].styles.working}</p>
          <p><strong>Thinking.</strong> ${I.people[t1.personId].styles.thinking}</p>
          <p><strong>Social.</strong> ${I.people[t1.personId].styles.social}</p>
          <p><strong>Grit.</strong> ${I.people[t1.personId].styles.grit}</p>`)}</div></div>`;
    } else if (t1.tab === 'drivers') {
      gearsBody += `<div style="display:grid;grid-template-columns:1fr 320px;gap:18px">
        <div>${driversBlock(person)}</div>
        <div>${insightBox('Drivers', `<p>${I.people[t1.personId].drivers}</p>`)}</div></div>`;
    } else if (t1.tab === 'progress') {
      const series = [{ name: person.name.split(' ')[0], color: person.color, values: person.trend }];
      gearsBody += `<div style="display:grid;grid-template-columns:1fr 320px;gap:18px">
        <div>${CH.trendLine({ xLabels: D.meta.trendDates, series, min: 40, max: 100, width: 560, height: 280 })}
          <div class="muted" style="font-size:12px;margin-top:6px">Overall capability index across assessments. Toggle pillar deltas with the button.</div></div>
        <div>${insightBox('Change over time', `<p>Current overall index <strong>${overallIndex}</strong>. ${person.trend[5] >= person.trend[0]
          ? 'Trajectory is positive across the last six administrations.'
          : 'Trajectory has softened recently — see the Motivational cornerstone insight.'}</p>`)}
          <button class="btn" id="prevToggle" style="margin-top:10px">${t1.showPrev ? 'Hide' : 'Show'} pillar deltas vs last assessment</button></div></div>`;
    }
    body += card('Individual Overview', gearsBody, { cls: 'col-7', sub: `Overall index ${overallIndex}` });

    // ---- Resource library ----
    body += resourceCard();
    body += `</div>`;

    $('#view').innerHTML = head + `<div class="tier-note">${ico.spark} Tier 1 shows one founder’s SENSE profile: the 12 Pillars wheel, the underlying human-capital traits, drivers, and change over time — each level carries a cached AI insight.</div>` + body;
    wireTier1();
  }

  function sidePanel(person) {
    if (t1.selCs) {
      const cs = csById[t1.selCs];
      const score = cornerstoneScore(person.pillars, cs.id);
      return insightBox(`${cs.name} · ${score}`, `<p class="muted" style="margin-top:0">${cs.blurb}</p><p>${I.people[t1.personId].cornerstones[cs.id]}</p>
        <button class="btn" data-clear="1" style="margin-top:6px">Back to overview</button>`);
    }
    if (t1.sel) {
      const p = pById[t1.sel], score = person.pillars[p.id], b = D.meta.benchmarks[p.id], st = statusOf(score);
      const ins = pillarInsight(t1.personId, p.id);
      return insightBox(`${p.name} · ${score}`,
        `<div style="display:flex;gap:8px;align-items:center;margin:-2px 0 8px"><span class="pill ${st.k}">${st.t}</span>
           <span class="muted" style="font-size:11.5px">benchmark ${b[0]}–${b[1]} · ${csById[p.cornerstone].name}</span></div>
         <p class="muted" style="margin-top:0">${p.blurb}</p><p>${ins.summary}</p>${actionsList(ins.actions)}
         <button class="btn" data-clear="1" style="margin-top:6px">Back to overview</button>`);
    }
    return insightBox('Overall', `<p>${I.people[t1.personId].overall}</p>`);
  }

  function wireTier1() {
    $('#view').querySelectorAll('[data-person]').forEach(b => b.onclick = () => { t1.sel = null; t1.selCs = null; location.hash = '#/tier1/' + b.dataset.person; });
    $('#view').querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { t1.tab = b.dataset.tab; viewTier1(); });
    $('#view').querySelectorAll('[data-pillar]').forEach(b => b.onclick = () => { t1.sel = b.dataset.pillar; t1.selCs = null; viewTier1(); });
    $('#view').querySelectorAll('.gear-wedge,.gear-label').forEach(b => b.addEventListener('click', () => { t1.sel = b.dataset.pillar; t1.selCs = null; viewTier1(); }));
    $('#view').querySelectorAll('.gear-arc').forEach(b => b.addEventListener('click', () => { t1.selCs = b.dataset.cornerstone; t1.sel = null; viewTier1(); }));
    const clr = $('#view').querySelector('[data-clear]'); if (clr) clr.onclick = () => { t1.sel = null; t1.selCs = null; viewTier1(); };
    const pt = $('#prevToggle'); if (pt) pt.onclick = () => { t1.showPrev = !t1.showPrev; t1.tab = 'gears'; viewTier1(); };
    const cb = $('#csvBtn'); if (cb) cb.onclick = () => exportPersonCSV(t1.personId);
    const pb = $('#pdfBtn'); if (pb) pb.onclick = () => window.print();
    wireResourceSearch();
  }
  function exportPersonCSV(id) {
    const p = D.people[id];
    const rows = [['Pillar', 'Cornerstone', 'Score', 'Prev', 'Benchmark low', 'Benchmark high', 'Status']];
    D.meta.pillars.forEach(pl => rows.push([pl.name, csById[pl.cornerstone].name, p.pillars[pl.id], p.prev[pl.id], D.meta.benchmarks[pl.id][0], D.meta.benchmarks[pl.id][1], statusOf(p.pillars[pl.id]).t]));
    rows.push([]); rows.push(['Trait', 'Value (0=left,100=right)']);
    D.meta.traitGroups.forEach(g => g.traits.forEach(t => rows.push([`${t.left}–${t.right}`, p.traits[t.id]])));
    download(`symeta_${id}_pillars.csv`, csv(rows), 'text/csv');
  }

  /* =====================================================================
     TIER 2 — team
     ===================================================================== */
  const t2 = { teamId: 'alpha', active: null, sel: null, selCs: null, overlay: false, thComp: null };

  function viewTier2(teamId) {
    if (teamId && teamId !== t2.teamId) { t2.teamId = teamId; t2.active = null; t2.sel = null; t2.selCs = null; t2.thComp = null; }
    const team = D.teams.find(t => t.id === t2.teamId);
    if (!t2.active) t2.active = team.memberIds.slice();
    setHeader(`Team — ${team.name}`, 'Tier 2 · Team');

    const teamSel = D.teams.map(t => `<button class="${t.id === t2.teamId ? 'on' : ''}" data-team="${t.id}">${t.name}</button>`).join('');
    const scores = teamAverage(t2.active);
    const idx = round(avg(D.meta.pillars.map(p => scores[p.id])));

    let head = `<div class="page-head">
      <div><h1>${team.name} <span class="muted" style="font-weight:500;font-size:15px">· ${team.tagline}</span></h1>
        <div class="sub">${team.stage} stage · ${t2.active.length} member team · averaged SENSE profile</div></div>
      <div class="actions"><div class="seg">${teamSel}</div>
        <button class="btn" id="csvBtn">${ico.dl} CSV</button>
        <button class="btn" id="pdfBtn">${ico.print} PDF</button></div></div>`;

    // team builder: active chips + candidate bench
    const bench = team.memberIds.filter(id => !t2.active.includes(id));
    const activeChips = t2.active.map(id => chip(id, true)).join('');
    const benchList = bench.length ? bench.map(id => candRow(id)).join('') :
      `<div class="muted" style="font-size:12.5px">All members are in the team. Drag a chip here to compare without them.</div>`;

    const wheel = CH.polarGears({
      pillars: D.meta.pillars, cornerstones: D.meta.cornerstones,
      series: [{ id: 'avg', color: team.color, scores, kind: 'wedge' }].concat(
        t2.overlay ? t2.active.map(id => ({ id, color: D.people[id].color, scores: D.people[id].pillars, kind: 'line' })) : []),
      benchmarks: D.meta.benchmarks, selected: t2.sel || t2.selCs, size: 440, interactive: true,
    });

    const gearsBody = `<div class="member-chips">${activeChips}
        <button class="btn" id="overlayBtn" style="margin-left:auto">${t2.overlay ? 'Hide' : 'Show'} individuals</button></div>
      <div class="team-builder">
        <div class="gears-wrap" style="grid-template-columns:230px 1fr">
          <div>${pillarList(scores, null, t2.sel, 'pillar')}</div>
          <div>${wheel}<div class="legend">
            <span class="it"><span class="sw" style="background:var(--text-mute);opacity:.3"></span>Benchmark</span>
            ${t2.overlay ? t2.active.map(id => `<span class="it"><span class="sw" style="background:${D.people[id].color}"></span>${D.people[id].name.split(' ')[0]}</span>`).join('') : '<span class="muted" style="font-size:11.5px">Drag members out to re-compute instantly</span>'}
          </div></div>
        </div>
        <div class="panel" id="bench"><h4>Bench / Candidates</h4>${benchList}
          <div class="muted" style="font-size:11.5px;margin-top:10px">Drag chips between the team and the bench to model different compositions. Averages update instantly.</div></div>
      </div>
      ${teamSidePanel(scores)}`;

    let body = `<div class="grid">`;
    body += card('Team Overview', gearsBody, { cls: 'col-12', sub: `Overall index ${idx}` });
    body += teamHealthCard();
    body += resourceCard();
    body += `</div>`;

    $('#view').innerHTML = head + `<div class="tier-note">${ico.spark} Tier 2 averages the team across the 12 Pillars, lets you drag members in and out to test composition, and adds the Team Health (ABC) assessment with its own cached insights.</div>` + body;
    wireTier2();
  }

  function chip(id, removable) {
    const p = D.people[id];
    return `<span class="chip" draggable="true" data-id="${id}"><span class="role" style="background:${p.color}">${p.roleAbbr}</span>${p.name}${removable ? ` <span class="x" data-remove="${id}" title="Move to bench">✕</span>` : ''}</span>`;
  }
  function candRow(id) {
    const p = D.people[id];
    return `<div class="cand" draggable="true" data-id="${id}"><span style="display:flex;align-items:center;gap:8px"><span class="av" style="background:${p.color}">${p.initials}</span>${p.name}</span><button class="btn" data-add="${id}" style="padding:4px 10px">Add</button></div>`;
  }

  function teamSidePanel(scores) {
    const ti = I.teams[t2.teamId];
    if (t2.selCs) {
      const cs = csById[t2.selCs], sc = cornerstoneScore(scores, cs.id);
      return `<div style="margin-top:16px">${insightBox(`${cs.name} · team avg ${sc}`, `<p>${ti.composition}</p>
        <button class="btn" data-clear="1" style="margin-top:6px">Back</button>`)}</div>`;
    }
    if (t2.sel) {
      const p = pById[t2.sel], sc = scores[p.id];
      const contrib = t2.active.map(id => `${D.people[id].name.split(' ')[0]} ${D.people[id].pillars[p.id]}`).join(' · ');
      return `<div style="margin-top:16px">${insightBox(`${p.name} · team avg ${sc}`, `<p class="muted" style="margin-top:0">${p.blurb}</p>
        <p><strong>By member:</strong> ${contrib}</p>
        <button class="btn" data-clear="1" style="margin-top:6px">Back</button>`)}</div>`;
    }
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px">
      ${insightBox('Team composition', `<p>${ti.overall}</p><p><strong>Complementary strengths.</strong> ${ti.complementary}</p>`)}
      ${insightBox('Conflict & balance watch-items', `<p>${ti.conflicts}</p>`)}</div>`;
  }

  function teamHealthCard() {
    const th = D.meta.teamHealth, data = D.teamHealthData[t2.teamId];
    const ti = I.teams[t2.teamId].teamHealth;
    let chart, caption, drillInsight;
    if (t2.thComp) {
      const comp = th.components.find(c => c.id === t2.thComp);
      chart = CH.groupedColumns({
        groups: th.quarters, max: 5, width: 560, height: 280,
        series: comp.constructs.map((c, i) => ({ name: c.name, color: shade(comp.color, i), values: data.constructs[c.id] })),
      });
      caption = `${comp.name} — its three constructs over time`;
      drillInsight = insightBox(`${comp.name}`, `<p>${ti[comp.id]}</p>
        <div class="muted" style="font-size:11.5px;margin-top:6px">Sample item — “${comp.constructs[0].sample}”</div>
        <button class="btn" data-thclear="1" style="margin-top:8px">Back to ABC</button>`);
    } else {
      chart = CH.groupedColumns({
        groups: th.quarters, max: 5, width: 560, height: 280,
        series: th.components.map(c => ({ name: c.name, color: cssVar(c.color), values: data.components[c.id] })),
      });
      caption = 'Alliance · Balance · Coordination across quarters (1–5). Click a component to drill into its constructs.';
      drillInsight = insightBox('Team Health', `<p>${ti.overall}</p>`);
    }
    const compBtns = th.components.map(c => `<button class="btn ${t2.thComp === c.id ? 'primary' : ''}" data-thcomp="${c.id}" style="padding:5px 11px">${c.name} ${round(data.components[c.id][3] * 10) / 10}</button>`).join(' ');
    const body = `<div style="display:grid;grid-template-columns:1fr 320px;gap:18px">
      <div>${chart}<div class="muted" style="font-size:12px;margin-top:6px">${caption}</div>
        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">${compBtns}</div></div>
      <div>${drillInsight}</div></div>`;
    return card('Team Health', body, { cls: 'col-7', sub: 'ABC pulse' });
  }
  // simple lightening for construct shades
  function shade(varRef, i) { const base = cssVar(varRef); return i === 0 ? base : i === 1 ? base + 'cc' : base + '99'; }

  function wireTier2() {
    $('#view').querySelectorAll('[data-team]').forEach(b => b.onclick = () => location.hash = '#/tier2/' + b.dataset.team);
    $('#view').querySelectorAll('[data-pillar]').forEach(b => b.onclick = () => { t2.sel = b.dataset.pillar; t2.selCs = null; viewTier2(); });
    $('#view').querySelectorAll('.gear-wedge,.gear-label').forEach(b => b.addEventListener('click', () => { t2.sel = b.dataset.pillar; t2.selCs = null; viewTier2(); }));
    $('#view').querySelectorAll('.gear-arc').forEach(b => b.addEventListener('click', () => { t2.selCs = b.dataset.cornerstone; t2.sel = null; viewTier2(); }));
    const clr = $('#view').querySelector('[data-clear]'); if (clr) clr.onclick = () => { t2.sel = null; t2.selCs = null; viewTier2(); };
    const ov = $('#overlayBtn'); if (ov) ov.onclick = () => { t2.overlay = !t2.overlay; viewTier2(); };
    $('#view').querySelectorAll('[data-remove]').forEach(b => b.onclick = (e) => { e.stopPropagation(); t2.active = t2.active.filter(x => x !== b.dataset.remove); if (!t2.active.length) t2.active = [b.dataset.remove]; viewTier2(); });
    $('#view').querySelectorAll('[data-add]').forEach(b => b.onclick = () => { if (!t2.active.includes(b.dataset.add)) t2.active.push(b.dataset.add); viewTier2(); });
    $('#view').querySelectorAll('[data-thcomp]').forEach(b => b.onclick = () => { t2.thComp = b.dataset.thcomp; viewTier2(); });
    const thc = $('#view').querySelector('[data-thclear]'); if (thc) thc.onclick = () => { t2.thComp = null; viewTier2(); };
    const cb = $('#csvBtn'); if (cb) cb.onclick = () => exportTeamCSV();
    const pb = $('#pdfBtn'); if (pb) pb.onclick = () => window.print();
    wireDragDrop();
    wireResourceSearch();
  }

  function wireDragDrop() {
    let dragId = null;
    $('#view').querySelectorAll('[draggable="true"]').forEach(el => {
      el.addEventListener('dragstart', e => { dragId = el.dataset.id; e.dataTransfer.effectAllowed = 'move'; el.classList.add('ghost'); });
      el.addEventListener('dragend', () => { el.classList.remove('ghost'); });
    });
    const bench = $('#bench'), wheelZone = $('#view').querySelector('.gears-wrap');
    [['bench', bench, false], ['team', wheelZone, true]].forEach(([k, zone, toTeam]) => {
      if (!zone) return;
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dropping'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('dropping'));
      zone.addEventListener('drop', e => {
        e.preventDefault(); zone.classList.remove('dropping'); if (!dragId) return;
        if (toTeam) { if (!t2.active.includes(dragId)) t2.active.push(dragId); }
        else { t2.active = t2.active.filter(x => x !== dragId); if (!t2.active.length) t2.active = [dragId]; }
        dragId = null; viewTier2();
      });
    });
  }
  function exportTeamCSV() {
    const rows = [['Member', 'Role'].concat(D.meta.pillars.map(p => p.name))];
    t2.active.forEach(id => rows.push([D.people[id].name, D.people[id].roleAbbr].concat(D.meta.pillars.map(p => D.people[id].pillars[p.id]))));
    const sc = teamAverage(t2.active);
    rows.push(['TEAM AVERAGE', ''].concat(D.meta.pillars.map(p => sc[p.id])));
    rows.push([]); rows.push(['Team Health (latest)', 'Score'].concat(D.meta.teamHealth.quarters));
    D.meta.teamHealth.components.forEach(c => rows.push([c.name, '', ...D.teamHealthData[t2.teamId].components[c.id]]));
    download(`symeta_${t2.teamId}_team.csv`, csv(rows), 'text/csv');
  }

  /* =====================================================================
     TIER 3 — portfolio (across both teams)
     ===================================================================== */
  function viewTier3() {
    setHeader(`Portfolio — ${D.portfolio.name}`, 'Tier 3 · Multi-team');
    const teams = D.portfolio.teamIds.map(id => D.teams.find(t => t.id === id));

    let head = `<div class="page-head">
      <div><h1>${D.portfolio.name}</h1><div class="sub">${teams.length} teams · ${teams.reduce((n, t) => n + t.memberIds.length, 0)} founders · cross-team human-capital analytics</div></div>
      <div class="actions"><button class="btn" id="csvBtn">${ico.dl} CSV</button><button class="btn" id="pdfBtn">${ico.print} PDF</button></div></div>`;

    // KPI row
    const kpis = teams.map(t => {
      const sc = teamAverage(t.memberIds), idx = round(avg(D.meta.pillars.map(p => sc[p.id])));
      const th = D.teamHealthData[t.id].components, thAvg = round(avg(['alliance', 'balance', 'coordination'].map(k => th[k][3])) * 10) / 10;
      return `<div class="kpi"><div class="l">${t.name}</div><div class="v" style="color:${t.color}">${idx}</div>
        <div class="muted" style="font-size:11.5px">capability index · Team Health ${thAvg}/5 · ${t.memberIds.length} founders</div></div>`;
    }).join('');

    // grouped cards per team (12 gears + team health side by side)
    const teamCards = teams.map(t => {
      const sc = teamAverage(t.memberIds);
      const wheel = CH.polarGears({
        pillars: D.meta.pillars, cornerstones: D.meta.cornerstones,
        series: [{ id: t.id, color: t.color, scores: sc, kind: 'wedge' }],
        benchmarks: D.meta.benchmarks, size: 340, interactive: false, showLabels: true,
      });
      const data = D.teamHealthData[t.id];
      const thChart = CH.groupedColumns({
        groups: D.meta.teamHealth.quarters, max: 5, width: 360, height: 220,
        series: D.meta.teamHealth.components.map(c => ({ name: c.name, color: cssVar(c.color), values: data.components[c.id] })),
      });
      const ti = I.teams[t.id];
      const body = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:center">
          <div>${wheel}</div>
          <div>${thChart}<div class="muted" style="font-size:11.5px;margin-top:4px">Team Health (ABC) · 1–5</div></div>
        </div>
        ${insightBox(`${t.name} — read`, `<p>${ti.overall}</p>`)}`;
      return card(`${t.name}`, body, { cls: 'col-6', sub: `${t.tagline} · ${t.stage}` });
    }).join('');

    const portfolioInsight = card('Portfolio Insight', `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        ${insightBox('Cross-team read', `<p>${I.portfolio.overall}</p><p>${I.portfolio.comparison}</p>`)}
        ${insightBox('Recommended actions', actionsList(I.portfolio.recommendations))}
      </div>`, { cls: 'col-12' });

    const body = `<div class="kpi-row" style="margin-bottom:18px">${kpis}</div>
      <div class="grid">${teamCards}${portfolioInsight}</div>`;

    $('#view').innerHTML = head + `<div class="tier-note">${ico.spark} Tier 3 compares whole teams across the cohort. Cards for the same team (12 Pillars + Team Health) are grouped, with a portfolio-level cached insight that contrasts the two startups.</div>` + body;
    const cb = $('#csvBtn'); if (cb) cb.onclick = exportPortfolioCSV;
    const pb = $('#pdfBtn'); if (pb) pb.onclick = () => window.print();
  }
  function exportPortfolioCSV() {
    const rows = [['Team', 'Capability index'].concat(D.meta.pillars.map(p => p.name)).concat(['Alliance', 'Balance', 'Coordination'])];
    D.portfolio.teamIds.forEach(id => {
      const t = D.teams.find(x => x.id === id), sc = teamAverage(t.memberIds), th = D.teamHealthData[id].components;
      const idx = round(avg(D.meta.pillars.map(p => sc[p.id])));
      rows.push([t.name, idx, ...D.meta.pillars.map(p => sc[p.id]), th.alliance[3], th.balance[3], th.coordination[3]]);
    });
    download('symeta_portfolio.csv', csv(rows), 'text/csv');
  }

  /* =====================================================================
     LANDING
     ===================================================================== */
  function viewLanding() {
    setHeader('Welcome to the SYMETA demo', 'Demo');
    const people = Object.values(D.people);
    const t1cards = Object.keys(D.people).map(id => {
      const p = D.people[id], idx = round(avg(D.meta.pillars.map(pl => p.pillars[pl.id])));
      return `<a class="cand" href="#/tier1/${id}" style="text-decoration:none;color:inherit">
        <span style="display:flex;align-items:center;gap:10px"><span class="av" style="background:${p.color}">${p.initials}</span>
          <span><div style="font-weight:700">${p.name}</div><div class="muted" style="font-size:11.5px">${p.role} · ${D.teams.find(t => t.id === p.teamId).name}</div></span></span>
        <span class="val" style="font-weight:800;color:${p.color}">${idx}</span></a>`;
    }).join('');
    const t2cards = D.teams.map(t => `<a class="cand" href="#/tier2/${t.id}" style="text-decoration:none;color:inherit">
        <span><div style="font-weight:700">${t.name}</div><div class="muted" style="font-size:11.5px">${t.tagline} · ${t.memberIds.length} founders · ${t.stage}</div></span>
        <span class="btn primary" style="padding:5px 12px">Open</span></a>`).join('');

    const body = `<div class="grid">
      ${card('Tier 1 · Individual', `<p class="muted" style="margin-top:0">One founder’s SENSE profile — 12 Pillars wheel, human-capital traits, drivers and progress.</p>${t1cards}`, { cls: 'col-4' })}
      ${card('Tier 2 · Team', `<p class="muted" style="margin-top:0">A team’s averaged profile with drag-and-drop composition and the Team Health (ABC) pulse.</p>${t2cards}
        <div class="muted" style="font-size:11.5px;margin-top:10px">Northwind = healthy, complementary 4-person team. Lumen = two overlapping co-founders (alignment risk).</div>`, { cls: 'col-4' })}
      ${card('Tier 3 · Portfolio', `<p class="muted" style="margin-top:0">Compare both startups across the cohort with a portfolio-level read.</p>
        <a class="cand" href="#/tier3" style="text-decoration:none;color:inherit"><span><div style="font-weight:700">${D.portfolio.name}</div><div class="muted" style="font-size:11.5px">${D.portfolio.teamIds.length} teams</div></span><span class="btn primary" style="padding:5px 12px">Open</span></a>`, { cls: 'col-4' })}
    </div>`;

    const intro = `<div class="page-head"><div><h1>SYMETA — interactive demo</h1>
      <div class="sub">Pre-loaded data for 6 founders across 2 startups · 12 Pillars of Entrepreneurship + Team Health · cached AI insights</div></div></div>`;
    $('#view').innerHTML = intro + body;
  }

  /* =====================================================================
     ROUTER
     ===================================================================== */
  function render() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/').filter(Boolean);
    $('#sidebar') && document.querySelectorAll('.sidebar .ico').forEach(a => a.classList.remove('active'));
    if (parts[0] === 'tier1') return viewTier1(parts[1]);
    if (parts[0] === 'tier2') return viewTier2(parts[1]);
    if (parts[0] === 'tier3') return viewTier3();
    return viewLanding();
  }

  /* ---------------- boot ---------------- */
  document.documentElement.setAttribute('data-theme', localStorage.getItem('symeta-theme') || 'light');
  renderSidebar();
  window.addEventListener('hashchange', render);
  render();
})();

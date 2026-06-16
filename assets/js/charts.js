/* ============================================================
   SYMETA — dependency-free SVG charts
   All functions return an SVG/HTML string. The app wires click
   handlers via data-* attributes after injecting the markup.
   ============================================================ */
window.SYMETA_CHARTS = (function () {
  const NS = 'http://www.w3.org/2000/svg';

  /* angle: 0 = top, increasing clockwise */
  function pt(cx, cy, r, deg) {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
  }
  const f = (n) => Math.round(n * 100) / 100;

  function sector(cx, cy, a0, a1, rIn, rOut) {
    const [x0o, y0o] = pt(cx, cy, rOut, a0);
    const [x1o, y1o] = pt(cx, cy, rOut, a1);
    const [x0i, y0i] = pt(cx, cy, rIn, a0);
    const [x1i, y1i] = pt(cx, cy, rIn, a1);
    const large = a1 - a0 > 180 ? 1 : 0;
    if (rIn <= 0.01) {
      return `M ${f(cx)} ${f(cy)} L ${f(x0o)} ${f(y0o)} A ${f(rOut)} ${f(rOut)} 0 ${large} 1 ${f(x1o)} ${f(y1o)} Z`;
    }
    return `M ${f(x0i)} ${f(y0i)} L ${f(x0o)} ${f(y0o)} A ${f(rOut)} ${f(rOut)} 0 ${large} 1 ${f(x1o)} ${f(y1o)} ` +
           `L ${f(x1i)} ${f(y1i)} A ${f(rIn)} ${f(rIn)} 0 ${large} 0 ${f(x0i)} ${f(y0i)} Z`;
  }

  /* ---------------- Polar "12 gears" wheel ----------------
     opts = {
       pillars, cornerstones,            // meta
       series: [{id,label,color,scores,kind:'wedge'|'line',opacity}],
       benchmarks,                       // {pillarId:[low,high]} optional band
       selected,                         // pillarId or cornerstoneId to highlight
       size, interactive, showLabels
     } */
  function polarGears(opts) {
    const pillars = opts.pillars;
    const size = opts.size || 460;
    const cx = size / 2, cy = size / 2;
    const maxR = size * 0.37;
    const labelR = maxR + 18;
    const n = pillars.length;       // 12
    const step = 360 / n;           // 30°
    const gap = 1.6;                // degrees between wedges
    const r = (v) => (Math.max(0, Math.min(100, v)) / 100) * maxR;

    let g = '';

    // grid rings
    [25, 50, 75, 100].forEach((lvl) => {
      g += `<circle cx="${cx}" cy="${cy}" r="${f(r(lvl))}" fill="none" stroke="var(--border-strong)" stroke-width="1" ${lvl === 100 ? '' : 'stroke-dasharray="2 4"'} opacity="${lvl === 100 ? .7 : .5}"/>`;
      if (lvl < 100) g += `<text x="${cx + 3}" y="${f(cy - r(lvl) + 3)}" font-size="9" fill="var(--text-mute)">${lvl}</text>`;
    });
    // spokes
    for (let i = 0; i < n; i++) {
      const [x, y] = pt(cx, cy, maxR, i * step);
      g += `<line x1="${cx}" y1="${cy}" x2="${f(x)}" y2="${f(y)}" stroke="var(--border)" stroke-width="1" opacity=".6"/>`;
    }

    // benchmark band per wedge
    if (opts.benchmarks) {
      for (let i = 0; i < n; i++) {
        const b = opts.benchmarks[pillars[i].id];
        if (!b) continue;
        const a0 = i * step - step / 2 + gap, a1 = i * step + step / 2 - gap;
        g += `<path d="${sector(cx, cy, a0, a1, r(b[0]), r(b[1]))}" fill="var(--text-mute)" opacity=".16"/>`;
      }
    }

    // wedge series (filled) — usually the primary / average
    (opts.series || []).filter(s => s.kind !== 'line').forEach((s) => {
      for (let i = 0; i < n; i++) {
        const p = pillars[i];
        const v = s.scores[p.id]; if (v == null) continue;
        const a0 = i * step - step / 2 + gap, a1 = i * step + step / 2 - gap;
        const dimmed = opts.selected && opts.selected !== p.id && opts.selected !== p.cornerstone;
        g += `<path d="${sector(cx, cy, a0, a1, 0, r(v))}" fill="${p.color}" opacity="${dimmed ? .28 : (s.opacity ?? .92)}" ` +
             `${opts.interactive ? `class="gear-wedge" data-pillar="${p.id}" style="cursor:pointer"` : ''}>` +
             `<title>${p.name}: ${v}</title></path>`;
      }
    });

    // line series (member overlays) — radar polygons
    (opts.series || []).filter(s => s.kind === 'line').forEach((s) => {
      const poly = pillars.map((p, i) => {
        const [x, y] = pt(cx, cy, r(s.scores[p.id] ?? 0), i * step);
        return `${f(x)},${f(y)}`;
      }).join(' ');
      g += `<polygon points="${poly}" fill="${s.color}" fill-opacity=".06" stroke="${s.color}" stroke-width="2" opacity=".9"/>`;
      pillars.forEach((p, i) => {
        const [x, y] = pt(cx, cy, r(s.scores[p.id] ?? 0), i * step);
        g += `<circle cx="${f(x)}" cy="${f(y)}" r="2.6" fill="${s.color}"/>`;
      });
    });

    // outer cornerstone arcs (group of 3 wedges)
    if (opts.cornerstones) {
      opts.cornerstones.forEach((cs) => {
        const idx = pillars.map((p, i) => (p.cornerstone === cs.id ? i : -1)).filter(i => i >= 0);
        if (!idx.length) return;
        const a0 = Math.min(...idx) * step - step / 2 + gap;
        const a1 = Math.max(...idx) * step + step / 2 - gap;
        const ro = maxR + 7, ri = maxR + 3;
        const sel = opts.selected === cs.id;
        g += `<path d="${sector(cx, cy, a0, a1, ri, ro)}" fill="${cs.color}" opacity="${sel ? 1 : .8}" ` +
             `${opts.interactive ? `class="gear-arc" data-cornerstone="${cs.id}" style="cursor:pointer"` : ''}>` +
             `<title>${cs.name}</title></path>`;
      });
    }

    // labels
    if (opts.showLabels !== false) {
      for (let i = 0; i < n; i++) {
        const p = pillars[i];
        const a = i * step;
        const [x, y] = pt(cx, cy, labelR, a);
        const anchor = Math.abs(a % 360) < 1 || Math.abs((a % 360) - 180) < 1 ? 'middle' : (a % 360) < 180 ? 'start' : 'end';
        g += `<text x="${f(x)}" y="${f(y)}" font-size="10.5" font-weight="600" fill="var(--text-soft)" ` +
             `text-anchor="${anchor}" dominant-baseline="middle" ` +
             `${opts.interactive ? `class="gear-label" data-pillar="${p.id}" style="cursor:pointer"` : ''}>${p.name}</text>`;
      }
    }

    return `<svg viewBox="0 0 ${size} ${size}" width="100%" style="max-width:${size}px;display:block;margin:auto" xmlns="${NS}">${g}</svg>`;
  }

  /* ---------------- Grouped column chart (Team Health) ----------------
     opts = { groups:[xLabels], series:[{name,color,values:[]}], max, height, width, yLabel } */
  function groupedColumns(opts) {
    const W = opts.width || 560, H = opts.height || 300;
    const m = { t: 16, r: 14, b: 42, l: 34 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const max = opts.max || 5;
    const groups = opts.groups, series = opts.series;
    const gw = iw / groups.length;
    const bw = Math.min(26, (gw * 0.74) / series.length);
    const y = (v) => m.t + ih - (v / max) * ih;
    let g = '';

    // gridlines
    for (let v = 0; v <= max; v++) {
      g += `<line x1="${m.l}" y1="${f(y(v))}" x2="${W - m.r}" y2="${f(y(v))}" stroke="var(--border)" stroke-width="1" opacity=".6"/>`;
      g += `<text x="${m.l - 6}" y="${f(y(v) + 3)}" font-size="9" fill="var(--text-mute)" text-anchor="end">${v}</text>`;
    }
    groups.forEach((grp, gi) => {
      const gx = m.l + gi * gw;
      const groupInner = bw * series.length + (series.length - 1) * 4;
      const start = gx + (gw - groupInner) / 2;
      series.forEach((s, si) => {
        const v = s.values[gi]; if (v == null) return;
        const x = start + si * (bw + 4);
        const h = (v / max) * ih;
        g += `<rect x="${f(x)}" y="${f(m.t + ih - h)}" width="${f(bw)}" height="${f(h)}" rx="3" fill="${s.color}">` +
             `<title>${s.name} · ${grp}: ${v}</title></rect>`;
      });
      g += `<text x="${f(gx + gw / 2)}" y="${H - m.b + 16}" font-size="10" fill="var(--text-soft)" text-anchor="middle">${grp}</text>`;
    });
    // legend
    let lx = m.l;
    const legend = series.map((s) => {
      const item = `<g transform="translate(${f(lx)},${H - 12})"><rect width="10" height="10" rx="2" y="-9" fill="${s.color}"/><text x="14" y="0" font-size="10" fill="var(--text-soft)">${s.name}</text></g>`;
      lx += 16 + s.name.length * 6.2;
      return item;
    }).join('');

    return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px" xmlns="${NS}">${g}${legend}</svg>`;
  }

  /* ---------------- Line / trend chart ----------------
     opts = { xLabels, series:[{name,color,values}], min, max, height, width } */
  function trendLine(opts) {
    const W = opts.width || 560, H = opts.height || 280;
    const m = { t: 14, r: 90, b: 34, l: 34 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const min = opts.min ?? 0, max = opts.max ?? 100;
    const xs = opts.xLabels;
    const x = (i) => m.l + (xs.length === 1 ? iw / 2 : (i / (xs.length - 1)) * iw);
    const y = (v) => m.t + ih - ((v - min) / (max - min)) * ih;
    let g = '';

    const ticks = 4;
    for (let t = 0; t <= ticks; t++) {
      const v = min + (t / ticks) * (max - min);
      g += `<line x1="${m.l}" y1="${f(y(v))}" x2="${W - m.r}" y2="${f(y(v))}" stroke="var(--border)" stroke-width="1" opacity=".55"/>`;
      g += `<text x="${m.l - 6}" y="${f(y(v) + 3)}" font-size="9" fill="var(--text-mute)" text-anchor="end">${Math.round(v)}</text>`;
    }
    xs.forEach((lab, i) => {
      g += `<text x="${f(x(i))}" y="${H - m.b + 16}" font-size="9.5" fill="var(--text-soft)" text-anchor="middle">${lab}</text>`;
    });
    opts.series.forEach((s) => {
      const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${f(x(i))} ${f(y(v))}`).join(' ');
      g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
      s.values.forEach((v, i) => { g += `<circle cx="${f(x(i))}" cy="${f(y(v))}" r="3" fill="${s.color}"><title>${s.name} ${xs[i]}: ${v}</title></circle>`; });
      const ly = y(s.values[s.values.length - 1]);
      g += `<text x="${W - m.r + 8}" y="${f(ly + 3)}" font-size="10" font-weight="600" fill="${s.color}">${s.name}</text>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px" xmlns="${NS}">${g}</svg>`;
  }

  /* ---------------- tiny donut (gauge) ---------------- */
  function donut(value, max, color, label) {
    const sz = 120, cx = sz / 2, cy = sz / 2, rad = 46, c = 2 * Math.PI * rad;
    const frac = Math.max(0, Math.min(1, value / max));
    return `<svg viewBox="0 0 ${sz} ${sz}" width="120" xmlns="${NS}">
      <circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="var(--surface-3)" stroke-width="12"/>
      <circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
        stroke-dasharray="${f(c)}" stroke-dashoffset="${f(c * (1 - frac))}" transform="rotate(-90 ${cx} ${cy})"/>
      <text x="${cx}" y="${cy - 2}" font-size="22" font-weight="800" fill="var(--text)" text-anchor="middle">${value}</text>
      <text x="${cx}" y="${cy + 16}" font-size="9" fill="var(--text-mute)" text-anchor="middle">${label || ''}</text>
    </svg>`;
  }

  return { polarGears, groupedColumns, trendLine, donut };
})();

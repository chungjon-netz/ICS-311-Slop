// ======================= MIDTERM 4 CRIB SHEET PAGE =======================
// MT4_CRIB_MD is injected by build.py from MT4-Crib-Sheet.md (the single source of truth).
// A small Markdown renderer turns it into a standalone page (#mt4-crib), and a
// card on the Midterm 4 overview links to it.
const cribSlug = s => 'crib-' + s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function cribInline(s){
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^\w*])\*(?!\s)([^*\n]+?)\*(?!\w)/g, '$1<i>$2</i>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}
function cribList(lines){
  // lines: [{ind, ord, text}] → nested <ul>/<ol>
  let i = 0;
  const level = ind => {
    const ord = lines[i].ord; let out = '';
    while (i < lines.length && lines[i].ind >= ind){
      if (lines[i].ind > ind){ out = out.replace(/<\/li>$/, '') + level(lines[i].ind) + '</li>'; continue; }
      out += `<li>${cribInline(lines[i].text)}</li>`; i++;
    }
    return ord ? `<ol>${out}</ol>` : `<ul>${out}</ul>`;
  };
  return level(lines[0].ind);
}
function cribRender(md){
  const L = md.replace(/\r/g, '').split('\n'), out = [];
  const row = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  for (let i = 0; i < L.length;){
    const l = L[i];
    if (!l.trim()){ i++; continue; }
    if (/^```/.test(l)){ const buf = []; i++; while (i < L.length && !/^```/.test(L[i])) buf.push(L[i++]); i++; out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); continue; }
    let m = l.match(/^(#{1,3})\s+(.*)/);
    if (m){ out.push({h: m[1].length, html: cribInline(m[2])}); i++; continue; }
    if (/^---+\s*$/.test(l)){ i++; continue; }
    if (/^>/.test(l)){ const buf = []; while (i < L.length && /^>/.test(L[i])) buf.push(L[i++].replace(/^>\s?/, '')); out.push(`<div class="callout cyan">${cribInline(buf.join(' '))}</div>`); continue; }
    if (/^\|/.test(l) && L[i + 1] && /^\|[\s:|-]+\|?\s*$/.test(L[i + 1])){
      const head = row(l); i += 2; const body = [];
      while (i < L.length && /^\|/.test(L[i])) body.push(row(L[i++]));
      out.push(`<div class="crib-tw"><table class="tbl"><tr>${head.map(c => `<th>${cribInline(c)}</th>`).join('')}</tr>${body.map(r => `<tr>${r.map(c => `<td>${cribInline(c)}</td>`).join('')}</tr>`).join('')}</table></div>`);
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(l)){
      const items = [];
      while (i < L.length && L[i].trim() && !/^(```|#{1,3}\s|>|\|)/.test(L[i])){
        const lm = L[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)/);
        if (lm) items.push({ind: lm[1].length, ord: /\d/.test(lm[2]), text: lm[3]});
        else if (items.length) items[items.length - 1].text += ' ' + L[i].trim();
        i++;
      }
      out.push(cribList(items)); continue;
    }
    const buf = [];
    while (i < L.length && L[i].trim() && !/^(#{1,3}\s|```|>|\||\s*([-*]|\d+\.)\s)/.test(L[i])) buf.push(L[i++].trim());
    out.push(`<p>${cribInline(buf.join(' '))}</p>`);
  }
  // group into: title (h1), intro, then one card per h2 section
  let title = '', intro = '', secs = [], cur = null;
  out.forEach(b => {
    if (typeof b === 'string'){ if (cur) cur.body += b; else intro += b; return; }
    if (b.h === 1) title = b.html;
    else if (b.h === 2) secs.push(cur = {title: b.html, id: cribSlug(b.html), body: ''});
    else if (cur) cur.body += `<h3>${b.html}</h3>`; else intro += `<h3>${b.html}</h3>`;
  });
  return {title, intro, secs};
}
(function mountCrib(){
  if (typeof MT4_CRIB_MD === 'undefined') return;
  const C = cribRender(MT4_CRIB_MD), g = GROUPS.find(x => x.id === 'mt4');
  document.getElementById('page-videos').insertAdjacentHTML('beforebegin',
    `<section class="page hidden crib" id="page-mt4-crib">
    <div class="row" style="gap:8px"><a class="eyebrow" href="#mt4" style="color:${g.color};border-color:${g.color}55;background:${g.color}14">${g.icon} Midterm 4 · ${g.date}</a><span class="eyebrow">📝 Crib sheet</span></div>
    <h1>📝 Midterm 4 <span class="grad">Crib Sheet</span></h1>
    <p class="lead">Every MT4 topic on one page: running times, pseudocode, proofs, worked traces, and step-by-step ways to work through a problem you haven't seen before. Coverage: <b>${g.covers}</b>.</p>
    <div class="row"><a class="btn" href="#mt4">← Midterm 4 overview</a><button class="btn primary" data-practice="mt4">🎯 Practice Midterm 4: 10 random questions</button><button class="btn ghost" data-crib-all="open">⊞ Expand all</button><button class="btn ghost" data-crib-all="close">⊟ Collapse all</button></div>
    ${C.intro}
    <div class="card crib-toc"><h3 style="margin-top:0">📑 Contents</h3><div class="crib-toc-grid">${C.secs.map(s => `<a href="javascript:void 0" data-jump="${s.id}">${s.title}</a>`).join('')}</div></div>
    ${C.secs.map(s => `<details class="card crib-sec" id="${s.id}" open><summary><h2>${s.title}</h2></summary><div class="crib-body">${s.body}</div><div class="crib-top"><a href="javascript:void 0" data-jump="page-mt4-crib">↑ Back to top</a></div></details>`).join('')}
    </section>`);
  const pg = document.getElementById('page-mt4-crib');
  pg.addEventListener('click', e => {
    const j = e.target.closest('[data-jump]');
    if (j){ e.preventDefault(); const t = document.getElementById(j.dataset.jump); if (t.tagName === 'DETAILS') t.open = true; t.scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
    const a = e.target.closest('[data-crib-all]');
    if (a) pg.querySelectorAll('details.crib-sec').forEach(d => d.open = a.dataset.cribAll === 'open');
  });
  // ---- container on the Midterm 4 overview ----
  const ov = document.querySelector('#page-mt4 > .row');
  if (ov) ov.insertAdjacentHTML('afterend', `<div class="card crib-link" style="margin-top:18px;border-color:${g.color}66">
    <div class="row" style="justify-content:space-between;gap:12px"><h2 style="margin:0">📝 Midterm 4 Crib Sheet</h2><span class="pill" style="color:${g.color}">${C.secs.length} sections</span></div>
    <p class="stat-label" style="margin:10px 0 12px">One page for the whole exam: master running-time table, every algorithm's pseudocode and proofs, worked traces, a decision tree for choosing an algorithm, and a map of practice problems.</p>
    <div class="chips">${C.secs.map(s => `<span class="pill">${s.title}</span>`).join(' ')}</div>
    <div class="row" style="margin-top:14px"><a class="btn primary" href="#mt4-crib">📝 Open the crib sheet →</a></div></div>`);
})();

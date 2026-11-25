// ======================= MIDTERM CRIB SHEET PAGES =======================
// CRIB_MD = {mt1: '…', …} is injected by build.py from MT<n>-Crib-Sheet.md (the
// single source of truth). A small Markdown renderer turns each sheet into a
// standalone page (#mt<n>-crib), and a card on that midterm's overview links to it.
const cribSlug = (pre, s) => pre + '-' + s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function cribRender(md, pre){
  // group cribBlocks() output into: title (h1), intro, then one card per h2 section
  let title = '', intro = '', secs = [], cur = null;
  cribBlocks(md).forEach(b => {
    if (typeof b === 'string'){ if (cur) cur.body += b; else intro += b; return; }
    if (b.h === 1) title = b.html;
    else if (b.h === 2) secs.push(cur = {title: b.html, id: cribSlug(pre, b.html), body: ''});
    else if (cur) cur.body += `<h3>${b.html}</h3>`; else intro += `<h3>${b.html}</h3>`;
  });
  return {title, intro, secs};
}
const cribPdf = g => `pdf/${g.name.replace('Midterm ', 'MT')}-Crib-Sheet.pdf`;
const cribDl = (g, cls) => `<a class="btn ${cls}" href="${cribPdf(g)}" download="ICS311-${g.name.replace('Midterm ', 'MT')}-Crib-Sheet.pdf">⬇️ Download printable PDF (2 pages)</a>`;
function mountCrib(g){
  const C = cribRender(CRIB_MD[g.id], g.id), pid = `page-${g.id}-crib`, tag = g.name.replace('Midterm ', 'MT');
  document.getElementById('page-videos').insertAdjacentHTML('beforebegin',
    `<section class="page hidden crib" id="${pid}">
    <div class="row" style="gap:8px"><a class="eyebrow" href="#${g.id}" style="color:${g.color};border-color:${g.color}55;background:${g.color}14">${g.icon} ${g.name} · ${g.date}</a><span class="eyebrow">📝 Crib sheet</span></div>
    <h1>📝 ${g.name} <span class="grad">Crib Sheet</span></h1>
    <p class="lead">Every ${tag} topic on one page: running times, pseudocode, lemmas and loop invariants, worked traces, and step-by-step ways to work through a problem you haven't seen before. Coverage: <b>${g.covers}</b>.</p>
    <div class="row"><a class="btn" href="#${g.id}">← ${g.name} overview</a><button class="btn primary" data-practice="${g.id}">🎯 Practice ${g.name}: 10 random questions</button>${cribDl(g, '')}<button class="btn ghost" data-crib-all="open">⊞ Expand all</button><button class="btn ghost" data-crib-all="close">⊟ Collapse all</button></div>
    ${C.intro}
    <div class="card crib-toc"><h3 style="margin-top:0">📑 Contents</h3><div class="crib-toc-grid">${C.secs.map(s => `<a href="javascript:void 0" data-jump="${s.id}">${s.title}</a>`).join('')}</div></div>
    ${C.secs.map(s => `<details class="card crib-sec" id="${s.id}" open><summary><h2>${s.title}</h2></summary><div class="crib-body">${s.body}</div><div class="crib-top"><a href="javascript:void 0" data-jump="${pid}">↑ Back to top</a></div></details>`).join('')}
    </section>`);
  const pg = document.getElementById(pid);
  pg.addEventListener('click', e => {
    const j = e.target.closest('[data-jump]');
    if (j){ e.preventDefault(); const t = document.getElementById(j.dataset.jump); if (t.tagName === 'DETAILS') t.open = true; t.scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
    const a = e.target.closest('[data-crib-all]');
    if (a) pg.querySelectorAll('details.crib-sec').forEach(d => d.open = a.dataset.cribAll === 'open');
  });
  // ---- container on the midterm's overview ----
  const ov = document.querySelector(`#page-${g.id} > .row`);
  if (ov) ov.insertAdjacentHTML('afterend', `<div class="card crib-link" style="margin-top:18px;border-color:${g.color}66">
    <div class="row" style="justify-content:space-between;gap:12px"><h2 style="margin:0">📝 ${g.name} Crib Sheet</h2><span class="pill" style="color:${g.color}">${C.secs.length} sections</span></div>
    <p class="stat-label" style="margin:10px 0 12px">One page for the whole exam: master running-time table, every algorithm's pseudocode, every lemma and loop invariant with its proof idea, worked traces, a decision tree for attacking new problems, and a map of practice problems.</p>
    <div class="chips">${C.secs.map(s => `<span class="pill">${s.title}</span>`).join(' ')}</div>
    <div class="row" style="margin-top:14px"><a class="btn primary" href="#${g.id}-crib">📝 Open the crib sheet →</a>${cribDl(g, '')}</div></div>`);
}
if (typeof CRIB_MD !== 'undefined') GROUPS.filter(g => CRIB_MD[g.id]).forEach(mountCrib);

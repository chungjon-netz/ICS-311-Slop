// ======================= MIDTERM CRIB SHEET PAGES =======================
// CRIB_MD = {mt1: '…', …} is injected by build.py from MT<n>-Crib-Sheet.md (the
// single source of truth). Each sheet becomes a standalone page (#mt<n>-crib) laid
// out as numbered section modules, each split into a grid of tiles (one per ###
// heading). If CRIB_GUIDE[id] exists (crib-guide-mt4.js), a separate plain-language
// guide page (#mt<n>-crib-guide) breaks the sheet down section by section.
const cribSlug = (pre, s) => pre + '-' + s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// a tile is wide when its table has 4+ columns or its code has long lines; full width at 6+ columns
function cribTileSize(html){
  const cols = Math.max(0, ...[...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => (m[1].match(/<t[hd]>/g) || []).length));
  const code = Math.max(0, ...[...html.matchAll(/<pre><code>([\s\S]*?)<\/code><\/pre>/g)].flatMap(m => m[1].split('\n').map(l => l.replace(/&\w+;/g, '_').length)));
  return cols >= 6 ? 'full' : cols >= 4 || code > 62 || html.length > 5200 ? 'wide' : '';
}
function cribRender(md, pre){
  // title (h1), intro, then sections (h2) made of tiles (h3)
  let title = '', intro = '', secs = [], cur = null;
  const tile = () => cur.tiles[cur.tiles.length - 1];
  cribBlocks(md).forEach(b => {
    if (typeof b === 'string'){
      if (!cur){ intro += b; return; }
      if (!cur.tiles.length) cur.tiles.push({title: '', body: ''});
      tile().body += b; return;
    }
    if (b.h === 1) title = b.html;
    else if (b.h === 2){ const m = b.html.match(/^(\d+)\.\s*(.*)$/); secs.push(cur = {num: m ? m[1].padStart(2, '0') : String(secs.length).padStart(2, '0'), title: m ? m[2] : b.html, id: cribSlug(pre, b.html), tiles: []}); }
    else if (cur) cur.tiles.push({title: b.html, body: ''});
    else intro += `<h3>${b.html}</h3>`;
  });
  secs.forEach(s => s.tiles.forEach(t => t.size = cribTileSize(t.body)));
  return {title, intro, secs};
}
const cribTag = g => g.name.replace('Midterm ', 'MT');
const cribPdf = g => `pdf/${cribTag(g)}-Crib-Sheet.pdf`;
const cribDl = (g, cls) => `<a class="btn ${cls}" href="${cribPdf(g)}" download="ICS311-${cribTag(g)}-Crib-Sheet.pdf">Download the 2-page PDF</a>`;
const cribHead = (g, kicker, title, sub, meta, actions) => `<header class="cx-head">
    <div class="cx-kicker"><a href="#${g.id}">ICS 311 · ${g.name}</a><span>/</span>${kicker}</div>
    <h1>${title}</h1><p class="cx-sub">${sub}</p>
    <dl class="cx-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <div class="cx-actions">${actions}</div></header>`;
function cribJumpHandler(pg){
  pg.addEventListener('click', e => {
    const j = e.target.closest('[data-jump]');
    if (j){ e.preventDefault(); const t = document.getElementById(j.dataset.jump); if (t.tagName === 'DETAILS') t.open = true; t.scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
    const a = e.target.closest('[data-crib-all]');
    if (a) pg.querySelectorAll('details.cx-sec').forEach(d => d.open = a.dataset.cribAll === 'open');
    const o = e.target.closest('[data-crib-open]');   // guide → crib sheet section
    if (o){ e.preventDefault(); location.hash = o.dataset.page; setTimeout(() => { const t = document.getElementById(o.dataset.cribOpen); if (t){ t.open = true; t.scrollIntoView({behavior: 'smooth', block: 'start'}); } }, 80); }
  });
}
function mountCrib(g){
  const C = cribRender(CRIB_MD[g.id], g.id), pid = `page-${g.id}-crib`, tag = cribTag(g), guide = typeof CRIB_GUIDE !== 'undefined' && CRIB_GUIDE[g.id];
  const nTiles = C.secs.reduce((s, x) => s + x.tiles.length, 0);
  document.getElementById('page-videos').insertAdjacentHTML('beforebegin',
    `<section class="page hidden crib cx" id="${pid}" style="--gc:${g.color}">
    ${cribHead(g, 'Crib sheet', `${g.name} crib sheet`, `Every ${tag} topic in one place: running times, pseudocode, lemmas and loop invariants, worked traces, and a way into problems you haven't seen before.`,
      [['Exam', g.date], ['Coverage', g.covers], ['Contents', `${C.secs.length} sections · ${nTiles} modules`], ['Print', `<a href="${cribPdf(g)}" download="ICS311-${tag}-Crib-Sheet.pdf">2-page PDF ↓</a>`]],
      `<a class="btn" href="#${g.id}">← Overview</a>${guide ? `<a class="btn" href="#${g.id}-crib-guide">Read the guide</a>` : ''}<button class="btn" data-practice="${g.id}">Practice ${tag}</button>${cribDl(g, 'primary')}<span class="cx-spacer"></span><button class="cx-link" data-crib-all="open">Expand all</button><button class="cx-link" data-crib-all="close">Collapse all</button>`)}
    <div class="cx-note">${C.intro}</div>
    <nav class="cx-index" aria-label="Sections">${C.secs.map(s => `<a href="javascript:void 0" data-jump="${s.id}"><span class="cx-no">${s.num}</span><span>${s.title}</span><span class="cx-n">${s.tiles.length}</span></a>`).join('')}</nav>
    ${C.secs.map(s => `<details class="cx-sec" id="${s.id}" open><summary><span class="cx-no">${s.num}</span><h2>${s.title}</h2><span class="cx-n">${s.tiles.length} module${s.tiles.length === 1 ? '' : 's'}</span></summary>
      <div class="cx-grid">${s.tiles.map(t => `<article class="cx-tile ${t.size}">${t.title ? `<h3>${t.title}</h3>` : ''}${t.body}</article>`).join('')}</div>
      <a class="cx-top" href="javascript:void 0" data-jump="${pid}">Back to top ↑</a></details>`).join('')}
    </section>`);
  cribJumpHandler(document.getElementById(pid));
  if (guide) mountCribGuide(g, C, guide);
  // ---- container on the midterm's overview ----
  const ov = document.querySelector(`#page-${g.id} > .row`);
  if (ov) ov.insertAdjacentHTML('afterend', `<div class="card crib-link" style="margin-top:18px;border-color:${g.color}66">
    <div class="row" style="justify-content:space-between;gap:12px"><h2 style="margin:0">${g.name} crib sheet</h2><span class="pill" style="color:${g.color}">${C.secs.length} sections · ${nTiles} modules</span></div>
    <p class="stat-label" style="margin:10px 0 12px">One page for the whole exam: master running-time table, every algorithm's pseudocode, every lemma and loop invariant with its proof idea, worked traces, a decision tree for attacking new problems, and a map of practice problems.</p>
    <div class="chips">${C.secs.map(s => `<span class="pill">${s.num} · ${s.title}</span>`).join(' ')}</div>
    <div class="row" style="margin-top:14px"><a class="btn primary" href="#${g.id}-crib">Open the crib sheet →</a>${guide ? `<a class="btn" href="#${g.id}-crib-guide">Read the guide (dummy notes)</a>` : ''}${cribDl(g, '')}</div></div>`);
}
function mountCribGuide(g, C, G){
  const pid = `page-${g.id}-crib-guide`;
  document.getElementById('page-videos').insertAdjacentHTML('beforebegin',
    `<section class="page hidden crib cx" id="${pid}" style="--gc:${g.color}">
    ${cribHead(g, 'Crib sheet guide', `How to read the ${g.name} crib sheet`, G.intro,
      [['For', 'first read-through, or when a section feels dense'], ['Format', 'what it holds · when to use it · dummy note'], ['Sections', C.secs.length]],
      `<a class="btn" href="#${g.id}-crib">← Back to the crib sheet</a>${cribDl(g, '')}`)}
    <div class="cx-note">${G.how}</div>
    <div class="cx-grid cx-guide">${C.secs.map((s, i) => { const x = G.secs[i] || {}; return `<article class="cx-tile">
      <div class="cx-gh"><span class="cx-no">${s.num}</span><h3>${s.title}</h3></div>
      <p><b>What it holds.</b> ${x.what || ''}</p><p><b>Use it when</b> ${x.when || ''}</p>
      <div class="cx-dummy"><span>Dummy note</span>${x.kid || ''}</div>
      <a class="cx-link" href="javascript:void 0" data-page="${g.id}-crib" data-crib-open="${s.id}">Open section ${s.num} in the crib sheet →</a></article>`; }).join('')}</div>
    </section>`);
  cribJumpHandler(document.getElementById(pid));
}
if (typeof CRIB_MD !== 'undefined') GROUPS.filter(g => CRIB_MD[g.id]).forEach(mountCrib);

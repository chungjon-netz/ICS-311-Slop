// ======================= COURSE ENGINE: MIDTERM GROUPS, PAGES, NAV =======================
const GROUPS = [
 {id:'mt1', name:'Midterm 1', icon:'1️⃣', color:'#60a5fa', date:'Wed 09/09 · Week 3', covers:'Topics 1–4, 7', topics:['t01','t03','t02','t07'], note:'Week 3 Monday (09/07) is the Labor Day holiday, so no topic is excluded.'},
 {id:'mt2', name:'Midterm 2', icon:'2️⃣', color:'#fb7185', date:'Wed 10/07 · Week 7', covers:'Topics 5, 6, 8, 9, 11', topics:['t09','t08','t11','t05a','t05b','t06'], excluded:'t10a'},
 {id:'mt3', name:'Midterm 3', icon:'3️⃣', color:'#22c55e', date:'Wed 10/28 · Week 10', covers:'Topics 10, 12', topics:['t10a','t10b','t12s','t12a','t12b'], excluded:'t13'},
 {id:'after', name:'After Midterm 3', icon:'🚀', color:'#a78bfa', date:'Week 10 onward', covers:'Topics 13, 14, 16, 17 and Fibonacci heaps', topics:['t13','t14a','t14b','ds','mst','kruskal','prim','fib']}
];
const TMETA = {};
COURSE.forEach(t => {
  TOPICS[t.id] = {name: t.short, icon: t.icon, color: t.color, blurb: t.blurb};
  t.mc.forEach(([q, a, ds, ex]) => MC.push({topic: t.id, q, options: [a, ...ds], answer: 0, explain: ex}));
  DIAGRAMS[t.id] = t.diagram; ELI5[t.id] = t.eli5; TMETA[t.id] = t;
});
[['ds','#16','Topic 16'],['mst','#17A','Topic 17A'],['kruskal','#17B','Topic 17B'],['prim','#17C','Topic 17C'],['fib','Ch 19','CLRS supplement']].forEach(([id, num, when]) =>
  TMETA[id] = {id, num, when, short: TOPICS[id].name, icon: TOPICS[id].icon, color: TOPICS[id].color, blurb: TOPICS[id].blurb});
const EXIST_VIDS = {mst: [['Mx-dvvSE4Qc', '17A · Minimum Spanning Trees']], kruskal: [['1BnpXYm7LKY', '17B · MST: Kruskal']], prim: [['qegY0R78QMQ', '17C · MST: Prim']]};

const ytLite = (id, title, start, end) => `<div class="vcard"><div class="video lite" data-yt="${id}" data-start="${start || ''}" data-end="${end || ''}" title="${esc(title)}"><img loading="lazy" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt=""><span class="play">▶</span></div><div class="vt">${title}</div></div>`;
document.addEventListener('click', e => {
  const v = e.target.closest('.video.lite');
  if (v){ const p = new URLSearchParams({autoplay: 1, rel: 0}); if (v.dataset.start) p.set('start', v.dataset.start); if (v.dataset.end) p.set('end', v.dataset.end);
    v.classList.remove('lite'); v.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.dataset.yt}?${p}" title="${v.title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; return; }
  const b = e.target.closest('[data-practice]'); if (b) startPractice(b.dataset.practice);
});

function topicPage(t){
  const g = GROUPS.find(x => x.topics.includes(t.id));
  const res = [`<span class="res">📖 <b>Reading:</b> ${t.reading}</span>`, `<span class="res">📝 <b>Lecture notes:</b> ${t.notes || 'none for this topic'}</span>`,
    `<span class="res">🎬 <b>Screencasts:</b> ${t.videos.length ? [...new Set(t.videos.map(v => v[1].split(' · ')[0]))].join(', ') : 'none'}</span>`];
  (t.extra || []).forEach(([l, u]) => res.push(`<a class="res link" href="${u}" target="_blank" rel="noopener">🔗 ${l} ↗</a>`));
  return `<section class="page hidden" id="page-${t.id}">
  <div class="row" style="gap:8px"><span class="eyebrow" style="color:${t.color};border-color:${t.color}55;background:${t.color}14">${t.when} · Topic ${t.num}</span>${g.id !== 'after' ? `<a class="eyebrow mt-tag" href="#${g.id}">📝 Core concept for ${g.name}</a>` : ''}</div>
  <h1>${t.title} <span class="grad">${t.grad}</span></h1>
  <p class="lead">${t.lead}</p>
  <div class="row res-row">${res.join('')}</div>
  ${t.warn ? `<div class="callout" style="border-color:var(--warn);background:rgba(251,191,36,.08)">⏰ ${t.warn}</div>` : ''}
  ${t.html}
  <h2>🎬 Screencasts</h2>
  ${t.videos.length ? `<div class="vgrid">${t.videos.map(v => ytLite(...v)).join('')}</div>` : '<p class="stat-label">No course screencasts for this topic. Use the reading and any extra video below.</p>'}
  ${(t.mit || []).length ? `<h3>Additional screencasts (MIT 6.046J)</h3><div class="vgrid">${t.mit.map(v => ytLite(...v)).join('')}</div>` : ''}
  ${t.prereq.length ? `<h2>📚 Prerequisite review</h2><div class="chips">${t.prereq.map(p => `<span class="chip">${p}</span>`).join('')}</div>` : ''}
  <h2>🧠 Practice this topic</h2>
  <div class="card qa" data-topic="${t.id}"></div>
</section>`;
}
function groupPage(g){
  const ex = g.excluded && TMETA[g.excluded], after = g.id === 'after';
  return `<section class="page hidden" id="page-${g.id}">
  <span class="eyebrow" style="color:${g.color};border-color:${g.color}55;background:${g.color}14">${g.icon} ${after ? 'Topics after the last midterm' : 'Exam'} · ${g.date}</span>
  <h1>${g.name} <span class="grad">${after ? 'Topics' : 'Core Concepts'}</span></h1>
  <p class="lead">${after ? 'Everything taught from the Monday of Midterm 3 week onward: greedy algorithms, graphs, disjoint sets, minimum spanning trees and Fibonacci heaps.' : `Every topic taught before the week of ${g.name}. Official exam coverage: <b>${g.covers}</b>.`}</p>
  <div class="row"><button class="btn primary" data-practice="${g.id}">🎯 Practice ${g.name}: 10 random questions</button><a class="btn" href="#${g.topics[0]}">📘 Start with ${TMETA[g.topics[0]].short}</a></div>
  ${ex ? `<div class="callout">Not on this exam: <b>Topic ${ex.num} ${ex.short}</b>, taught ${ex.when.split(' · ')[1]} (the Monday of exam week). It counts toward the next exam.</div>` : g.note ? `<div class="callout cyan">${g.note}</div>` : ''}
  <h2>${after ? 'Topics' : 'Core concepts'}</h2>
  <div class="grid g3 group-cards" data-group="${g.id}"></div>
</section>`;
}
function topicCard(id){
  const t = TMETA[id], s = store.byTopic[id], pct = s && s.a ? Math.round(100 * s.c / s.a) : 0;
  const nQ = MC.filter(q => q.topic === id).length, nG = GEN.filter(q => q.topic === id).length, nC = CODE.filter(q => q.topic === id).length;
  return `<div class="card topic-card" onclick="location.hash='${id}'"><div class="row" style="justify-content:space-between"><div class="ic" style="background:${t.color}22">${t.icon}</div><span class="tnum" style="color:${t.color}">${t.num}</span></div><h3>${t.short}</h3><p>${t.blurb}</p>
    <div class="row" style="gap:6px"><span class="pill mc">${nQ} MC${nG ? ` + ${nG} generator${nG > 1 ? 's' : ''}` : ''}</span>${nC ? `<span class="pill code">${nC} pseudocode</span>` : ''}</div>
    <div class="bar"><span style="width:${pct}%"></span></div><div class="stat-label" style="font-size:.75rem;margin-top:4px">${s ? `${s.a} answered · ${pct}% avg` : 'Not started'}</div></div>`;
}

// ---- diagrams & simple-mode text for overview pages ----
GROUPS.forEach(g => {
  const ts = g.topics.map(id => TMETA[id]), after = g.id === 'after';
  DIAGRAMS[g.id] = () => { const per = 4, rows = Math.ceil(ts.length / per); let s = '';
    ts.forEach((t, i) => { const x = 20 + (i % per) * 170, y = 30 + Math.floor(i / per) * 80; s += D.box(x, y, 150, 54, t.num, t.color, t.short.length > 21 ? t.short.slice(0, 20) + '…' : t.short); if (i % per < per - 1 && i < ts.length - 1) s += D.arrow(x + 150, y + 27, x + 167, y + 27, 'mut', 2); });
    const ey = 30 + (rows - 1) * 40;
    if (!after) s += D.arrow(690, ey + 27, 712, ey + 27, 'warn', 3) + D.box(715, ey, 150, 54, g.name, C.warn, g.date.split(' · ')[0]);
    return fig(D.svg(after ? 700 : 880, 50 + rows * 80, s), after ? 'Topics covered after Midterm 3, in the order they are taught.' : `Everything taught before exam week feeds into ${g.name} (${g.covers}).`, after ? 'These are the newest lessons, in order.' : `Learn these boxes, in order, to be ready for ${g.name}!`); };
  ELI5[g.id] = {title: after ? 'What comes after Midterm 3?' : `What do I need for ${g.name}?`, pts: ts.map(t => `${t.icon} <b>${t.short}</b>: ${(ELI5[t.id] || {}).title || t.blurb}`)};
});
DIAGRAMS.home = () => fig(D.svg(780, 170, D.text(390, 26, 'the semester at a glance', 13, C.txt, 'middle', 700) +
  GROUPS.map((g, i) => D.box(20 + i * 190, 50, 165, 70, g.name, g.color, g.date.split(' · ')[0]) + (i < 3 ? D.arrow(185 + i * 190, 85, 207 + i * 190, 85, 'mut', 2.5) : '')).join('') +
  D.text(390, 152, 'each exam covers the topics taught before its exam week', 12, C.mut)),
  'Topics are grouped by the midterm they prepare you for. Use the sidebar groups or the cards below.', 'The school year is split into 4 chunks. Each chunk ends with a big test (except the last one, so far).');
ELI5.home = {title: 'What is this site?', pts: ['📚 It is a study buddy for ICS 311, the class about <b>algorithms</b> (smart recipes for computers).', '🗂️ The lessons are sorted into piles, one pile for each big test (midterm).', '🎬 Every lesson has notes, pictures, videos, and practice questions.', '🧒 Keep this switch on to see a simple explanation at the top of every page.']};

// ---- render pages & nav ----
document.getElementById('page-videos').insertAdjacentHTML('beforebegin', GROUPS.map(g => groupPage(g) + g.topics.filter(id => COURSE.some(t => t.id === id)).map(id => topicPage(TMETA[id])).join('')).join(''));
function buildNav(){
  const link = id => { const t = TMETA[id]; return `<a href="#${id}" data-page="${id}"><span class="dot" style="background:${t.color}"></span><span class="nnum">${t.num}</span><span class="nlabel">${t.short}</span></a>`; };
  document.getElementById('nav').innerHTML = `<a href="#home" data-page="home"><span class="dot" style="background:#e5e7eb"></span>Overview</a>` +
    GROUPS.map(g => `<details class="nav-group" data-group="${g.id}"><summary><span>${g.icon} ${g.name}</span><span class="gdate">${g.date.split(' · ')[0]}</span></summary><a href="#${g.id}" data-page="${g.id}" class="gover"><span class="dot" style="background:${g.color}"></span>${g.id === 'after' ? 'Overview' : 'Exam overview'}</a>${g.topics.map(link).join('')}</details>`).join('') +
    `<div class="nav-label">Watch &amp; Practice</div><a href="#videos" data-page="videos"><span class="dot" style="background:#f87171"></span>All screencasts</a><a href="#practice" data-page="practice"><span class="dot" style="background:linear-gradient(135deg,#8b5cf6,#22d3ee)"></span>Practice Arena</a>`;
}
buildNav();

function renderHome(){
  const all = Object.values(store.byTopic), a = all.reduce((s, t) => s + t.a, 0), c = all.reduce((s, t) => s + t.c, 0), codes = Object.values(store.code);
  const hs = document.getElementById('home-stats');
  if (hs) hs.innerHTML = [[a, 'Questions answered'], [a ? Math.round(100 * c / a) + '%' : '—', 'Average score'], [`${codes.length}/${CODE.length}`, 'Pseudocode challenges attempted'], [codes.length ? Math.round(codes.reduce((x, y) => x + y, 0) / codes.length) + '%' : '—', 'Best pseudocode avg']]
    .map(([v, l]) => `<div class="card"><div class="stat grad">${v}</div><div class="stat-label">${l}</div></div>`).join('');
  const tc = document.getElementById('topic-cards');
  if (tc) tc.innerHTML = GROUPS.map(g => `<div class="home-group"><div class="hg-head"><h3>${g.icon} ${g.name}</h3><span class="pill">${g.date}</span>${g.id !== 'after' ? `<span class="pill">${g.covers}</span>` : ''}<a class="btn sm ghost" href="#${g.id}">Overview →</a></div><div class="grid g3">${g.topics.map(topicCard).join('')}</div></div>`).join('');
  document.querySelectorAll('.group-cards[data-group]').forEach(el => { el.innerHTML = GROUPS.find(x => x.id === el.dataset.group).topics.map(topicCard).join(''); });
}
function renderVideos(){
  document.getElementById('video-grid').innerHTML = GROUPS.map(g => `<h2>${g.icon} ${g.name} <span class="pill">${g.date}</span></h2>` + g.topics.map(id => {
    const t = TMETA[id], vids = t.videos ? [...t.videos, ...(t.mit || [])] : (EXIST_VIDS[id] || []);
    if (!vids.length) return '';
    return `<div class="card vtopic"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${t.icon} Topic ${t.num} · ${t.short}</h3><a class="btn sm" href="#${id}">📘 Notes</a></div><div class="vgrid">${vids.map(v => ytLite(...v)).join('')}</div></div>`;
  }).join('')).join('');
}
function renderPractice(preset){
  const root = document.getElementById('practice-root'), cfg = {mode: 'mixed', n: 10}, sel = new Set(preset || Object.keys(TOPICS));
  root.innerHTML = `<div class="card fade" style="margin-top:20px">
    <h3 style="margin-top:0">Quick presets</h3><div class="row" id="p-presets"><button class="btn sm" data-g="all">All topics</button>${GROUPS.map(g => `<button class="btn sm" data-g="${g.id}">${g.icon} ${g.name}</button>`).join('')}</div>
    <h3>Topics</h3>${GROUPS.map(g => `<div class="pgroup"><div class="pg-head"><b>${g.icon} ${g.name}</b> <span class="stat-label">· ${g.date}</span></div><div class="row">${g.topics.map(id => `<label class="chk"><input type="checkbox" value="${id}" ${sel.has(id) ? 'checked' : ''}> ${TMETA[id].icon} ${TMETA[id].num} ${TMETA[id].short}</label>`).join('')}</div></div>`).join('')}
    <h3>Question type</h3><div class="seg" id="p-mode">${[['mixed', 'Mixed'], ['mc', 'Multiple choice only'], ['code', 'Pseudocode only']].map(([k, l]) => `<button data-m="${k}" class="${k === 'mixed' ? 'on' : ''}">${l}</button>`).join('')}</div>
    <h3>Length</h3><div class="seg" id="p-n">${[5, 10, 15, 20].map(n => `<button data-n="${n}" class="${n === 10 ? 'on' : ''}">${n} questions</button>`).join('')}</div>
    <div style="margin-top:22px"><button class="btn primary" id="p-start">🚀 Start practice</button></div></div>`;
  root.querySelectorAll('#p-presets button').forEach(b => b.onclick = () => { const g = GROUPS.find(x => x.id === b.dataset.g); root.querySelectorAll('.chk input').forEach(i => i.checked = !g || g.topics.includes(i.value)); });
  root.querySelectorAll('#p-mode button').forEach(b => b.onclick = () => { cfg.mode = b.dataset.m; root.querySelectorAll('#p-mode button').forEach(x => x.classList.toggle('on', x === b)); });
  root.querySelectorAll('#p-n button').forEach(b => b.onclick = () => { cfg.n = +b.dataset.n; root.querySelectorAll('#p-n button').forEach(x => x.classList.toggle('on', x === b)); });
  root.querySelector('#p-start').onclick = () => {
    cfg.topics = [...root.querySelectorAll('.chk input:checked')].map(i => i.value);
    if (!cfg.topics.length) { toast('Pick at least one topic'); return; }
    runQuiz(root, cfg);
  };
}
function startPractice(groupId){
  const g = GROUPS.find(x => x.id === groupId); location.hash = 'practice';
  renderPractice(g.topics); runQuiz(document.getElementById('practice-root'), {topics: g.topics, mode: 'mixed', n: 10});
}
DIAGRAMS.videos = () => fig(D.svg(780, 150, GROUPS.map((g, i) => { const n = g.topics.reduce((s, id) => s + ((TMETA[id].videos || EXIST_VIDS[id] || []).length + (TMETA[id].mit || []).length), 0);
  return D.box(20 + i * 190, 30, 165, 70, g.name, g.color, n + ' videos') + (i < 3 ? D.arrow(185 + i * 190, 65, 207 + i * 190, 65, 'mut', 2.5) : ''); }).join('') + D.text(390, 135, 'click any thumbnail to play it in place', 12, C.mut)),
  'Screencasts are grouped by the midterm they prepare you for, in teaching order.', 'Pick your test, then watch the videos from left to right.');
ELI5.videos = {title: 'Watching the videos', pts: ['🎬 Every lesson has short videos from the teacher. They are sorted by which big test they help with.', '▶️ Tap a picture to play the video right on the page.', '✂️ Some videos only play the part your schedule says to watch.', '💡 Tip: pause and try to guess the next step before the teacher shows it!']};

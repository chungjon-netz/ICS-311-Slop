// ======================= COURSE ENGINE: MIDTERM GROUPS, PAGES, NAV =======================
const GROUPS = [
 {id:'mt1', name:'Midterm 1', icon:'1️⃣', color:'#60a5fa', date:'Wed 09/09 · Week 3', covers:'Topics 1–4, 7', topics:['t01','t03','t02','t07'], note:'Week 3 Monday (09/07) is the Labor Day holiday, so no topic is excluded.'},
 {id:'mt2', name:'Midterm 2', icon:'2️⃣', color:'#fb7185', date:'Wed 10/07 · Week 7', covers:'Topics 5, 6, 8, 9, 11', topics:['t09','t08','t11','t05a','t05b','t06'], excluded:'t10a'},
 {id:'mt3', name:'Midterm 3', icon:'3️⃣', color:'#22c55e', date:'Wed 10/28 · Week 10', covers:'Topics 10, 12', topics:['t10a','t10b','t12s','t12a','t12b'], excluded:'t13'},
 {id:'mt4', name:'Midterm 4', icon:'4️⃣', color:'#a78bfa', date:'Wed 11/25 · Week 14', covers:'Topics 13, 14, 16–19', topics:['t13','t14a','t14b','ds','mst','kruskal','prim','fib','t18','t19'], excluded:'t20'},
 {id:'final', name:'Final Exam', icon:'🎓', color:'#f59e0b', date:'Fri 9:45–11:45am · Finals week', covers:'Cumulative: Topics 1–14, 16–20, 22, 24 &amp; 25', topics:['t20','t24','t25','t22'], final:true, note:'The final is cumulative. These are the topics taught after Midterm 4 (Wed 12/09 is the course review). Use “Practice the whole course” to drill everything.'}
];
const TMETA = {};
COURSE.forEach(t => {
  TOPICS[t.id] = {name: t.short, icon: t.icon, color: t.color, blurb: t.blurb};
  t.mc.forEach(([q, a, ds, ex]) => MC.push({topic: t.id, q, options: [a, ...ds], answer: 0, explain: ex}));
  DIAGRAMS[t.id] = t.diagram; ELI5[t.id] = t.eli5; TMETA[t.id] = t;
});
[['ds','#16','Topic 16'],['mst','#17A','Topic 17A'],['kruskal','#17B','Topic 17B'],['prim','#17C','Topic 17C'],['fib','Ch 19','CLRS supplement']].forEach(([id, num, when]) =>
  TMETA[id] = {id, num, when, short: TOPICS[id].name, icon: TOPICS[id].icon, color: TOPICS[id].color, blurb: TOPICS[id].blurb});
const EXIST_VIDS = {mst: [['Mx-dvvSE4Qc', '17A · Minimum Spanning Trees'], ['FPEMBWg_WlY', 'MIT Lecture 16 (from 23:26)', 1406]], kruskal: [['1BnpXYm7LKY', '17B · MST: Kruskal']], prim: [['qegY0R78QMQ', '17C · MST: Prim']]};

const ytLite = (id, title, start, end) => `<div class="vcard"><div class="video lite" data-yt="${id}" data-start="${start || ''}" data-end="${end || ''}" title="${esc(title)}"><img loading="lazy" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt=""><span class="play">▶</span></div><div class="vt">${title}</div></div>`;
const pkey = x => x.replace(/&amp;/g, '&').toLowerCase().replace(/[^a-z0-9]/g, '');
const prereqChip = p => { const u = SCHED.prereq[pkey(p)]; return u ? `<a class="chip link" href="${u}" target="_blank" rel="noopener">📄 ${p} ↗</a>` : `<span class="chip">${p}</span>`; };
document.addEventListener('click', e => {
  const v = e.target.closest('.video.lite');
  if (v){ const p = new URLSearchParams({autoplay: 1, rel: 0}); if (v.dataset.start) p.set('start', v.dataset.start); if (v.dataset.end) p.set('end', v.dataset.end);
    v.classList.remove('lite'); v.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.dataset.yt}?${p}" title="${v.title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; return; }
  const b = e.target.closest('[data-practice]'); if (b) startPractice(b.dataset.practice);
});

function topicPage(t){
  const g = GROUPS.find(x => x.topics.includes(t.id));
  const res = [`<span class="res">📖 <b>Reading:</b> ${t.reading}</span>`, `<span class="res">📝 <b>Lecture notes:</b> ${t.notes ? t.notes.split(', ').map(n => SCHED.notes[n] ? `<a href="${SCHED.notes[n]}" target="_blank" rel="noopener">${n} ↗</a>` : n).join(', ') : 'none for this topic'}</span>`,
    `<span class="res">🎬 <b>Screencasts:</b> ${t.videos.length ? [...new Set(t.videos.map(v => v[1].split(' · ')[0]))].join(', ') : 'none'}</span>`];
  (t.extra || []).forEach(([l, u]) => res.push(`<a class="res link" href="${u}" target="_blank" rel="noopener">🔗 ${l} ↗</a>`));
  return `<section class="page hidden" id="page-${t.id}">
  <div class="row" style="gap:8px"><span class="eyebrow" style="color:${t.color};border-color:${t.color}55;background:${t.color}14">${t.when} · Topic ${t.num}</span><a class="eyebrow mt-tag" href="#${g.id}">📝 ${g.final ? 'New topic for the Final Exam' : 'Core concept for ' + g.name}</a></div>
  <h1>${t.title} <span class="grad">${t.grad}</span></h1>
  <p class="lead">${t.lead}</p>
  <div class="row res-row">${res.join('')}</div>
  ${t.warn ? `<div class="callout" style="border-color:var(--warn);background:rgba(251,191,36,.08)">⏰ ${t.warn}</div>` : ''}
  ${learnBlock(t.id)}
  ${t.html}
  <h2>🎬 Screencasts</h2>
  ${t.videos.length ? `<div class="vgrid">${t.videos.map(v => ytLite(...v)).join('')}</div>` : '<p class="stat-label">No course screencasts for this topic. Use the reading and any extra video below.</p>'}
  ${(t.mit || []).length ? `<h3>Additional screencasts (MIT 6.046J)</h3><div class="vgrid">${t.mit.map(v => ytLite(...v)).join('')}</div>` : ''}
  ${t.prereq.length ? `<h2>📚 Prerequisite review</h2><div class="chips">${t.prereq.map(prereqChip).join('')}</div>` : ''}
  <h2>🧠 Practice this topic</h2>
  <div class="card qa" data-topic="${t.id}"></div>
</section>`;
}
function groupPage(g){
  const ex = g.excluded && TMETA[g.excluded], fin = !!g.final;
  return `<section class="page hidden" id="page-${g.id}">
  <span class="eyebrow" style="color:${g.color};border-color:${g.color}55;background:${g.color}14">${g.icon} ${fin ? 'Final exam' : 'Exam'} · ${g.date}</span>
  <h1>${g.name} <span class="grad">${fin ? 'New Topics' : 'Core Concepts'}</span></h1>
  <p class="lead">${fin ? 'Cumulative final on <b>all topics (1–14, 16–20, 22, 24 &amp; 25)</b>. Below are the topics taught after Midterm 4; every earlier topic is in the Midterm 1–4 tabs.' : `Every topic taught before the week of ${g.name}. Official exam coverage: <b>${g.covers}</b>.`}</p>
  <div class="row">${fin ? '<button class="btn primary" data-practice="all">🎓 Practice the whole course: 10 random questions</button>' : ''}<button class="btn ${fin ? '' : 'primary'}" data-practice="${g.id}">🎯 Practice ${fin ? 'the new topics' : g.name + ': 10 random questions'}</button><a class="btn" href="#${g.topics[0]}">📘 Start with ${TMETA[g.topics[0]].short}</a></div>
  ${ex ? `<div class="callout">Not on this exam: <b>Topic ${ex.num} ${ex.short}</b>, taught ${ex.when.split(' · ')[1]} (the Monday of exam week). It counts toward the next exam.</div>` : ''}${g.note ? `<div class="callout cyan">${g.note}</div>` : ''}
  ${reviewBlock(g)}
  <h2>${fin ? 'New topics for the final' : 'Core concepts'}</h2>
  <div class="grid g3 group-cards" data-group="${g.id}"></div>
</section>`;
}

function learnBlock(id){
  const L = LEARN[id]; if (!L) return '';
  return `<div class="learn card"><div class="learn-head"><h2 style="margin:0">🎯 Learn it on purpose</h2><span class="pill">core concepts</span></div>
  ${L.goal ? `<p class="learn-goal"><b>Goal:</b> ${L.goal}</p>` : ''}
  <div class="grid g2"><div><h3>🔑 Key ideas to own</h3><ol class="keys">${L.key.map(k => `<li>${k}</li>`).join('')}</ol></div>
  <div><h3>⚠️ Common mistakes</h3><ul class="clean">${L.mistakes.map(m => `<li>${m}</li>`).join('')}</ul></div></div>
  <h3>🧠 Check yourself <span class="stat-label" style="font-weight:400">· answer out loud or on paper before you peek</span></h3>
  <div class="prompts">${L.prompts.map(([q, a], i) => `<details class="prompt"><summary><span class="pn">${i + 1}</span>${q}</summary><div class="pa">${a}</div></details>`).join('')}</div>
  <p class="habit">📌 <b>Study habit:</b> ${L.habit || 'Close the page, write the key ideas from memory, then compare. Re-test yourself tomorrow and again in 3 days.'}</p></div>`;
}
function reviewBlock(g){
  const R = REVIEW[g.id]; if (!R) return '';
  return `<h2>🔗 Review: how each topic feeds into the next</h2>
  <div class="chain">${R.chain.map(([id, txt], i) => `<div class="chain-step"><a class="chain-node" href="#${id}" style="border-color:${TMETA[id].color}"><span class="tnum" style="color:${TMETA[id].color}">${TMETA[id].num}</span> ${TMETA[id].short}</a><div class="chain-txt">${txt}</div>${i < R.chain.length - 1 ? '<div class="chain-arrow">↓</div>' : ''}</div>`).join('')}</div>
  <div class="grid g2"><div class="card"><h3>✅ Can you…</h3><ul class="clean checklist">${R.checklist.map(x => `<li><label><input type="checkbox"> ${x}</label></li>`).join('')}</ul></div>
  <div class="card"><h3>🗓️ Review plan</h3><ol>${R.plan.map(x => `<li>${x}</li>`).join('')}</ol></div></div>`;
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
  const ts = g.topics.map(id => TMETA[id]), after = false;
  DIAGRAMS[g.id] = () => { const per = 4, rows = Math.ceil(ts.length / per); let s = '';
    ts.forEach((t, i) => { const x = 20 + (i % per) * 170, y = 30 + Math.floor(i / per) * 80; s += D.box(x, y, 150, 54, t.num, t.color, t.short.length > 21 ? t.short.slice(0, 20) + '…' : t.short); if (i % per < per - 1 && i < ts.length - 1) s += D.arrow(x + 150, y + 27, x + 167, y + 27, 'mut', 2); });
    const ey = 30 + (rows - 1) * 40;
    if (!after) s += D.arrow(690, ey + 27, 712, ey + 27, 'warn', 3) + D.box(715, ey, 150, 54, g.name, C.warn, g.date.split(' · ')[0]);
    return fig(D.svg(after ? 700 : 880, 50 + rows * 80, s), after ? 'Topics covered after Midterm 3, in the order they are taught.' : `Everything taught before exam week feeds into ${g.name} (${g.covers}).`, after ? 'These are the newest lessons, in order.' : `Learn these boxes, in order, to be ready for ${g.name}!`); };
  ELI5[g.id] = {title: g.final ? 'What is new for the final exam?' : `What do I need for ${g.name}?`, pts: ts.map(t => `${t.icon} <b>${t.short}</b>: ${(ELI5[t.id] || {}).title || t.blurb}`)};
});
DIAGRAMS.home = () => fig(D.svg(780, 170, D.text(390, 26, 'the semester at a glance', 13, C.txt, 'middle', 700) +
  GROUPS.map((g, i) => D.box(20 + i * 152, 50, 135, 70, g.name, g.color, g.date.split(' · ')[0]) + (i < GROUPS.length - 1 ? D.arrow(155 + i * 152, 85, 170 + i * 152, 85, 'mut', 2.5) : '')).join('') +
  D.text(390, 152, 'each exam covers the topics taught before its exam week', 12, C.mut)),
  'Topics are grouped by the midterm they prepare you for. Use the sidebar groups or the cards below.', 'The semester is split into 5 chunks. Each one ends with a big test: four midterms and the final.');
ELI5.home = {title: 'What is this site?', pts: ['📚 It is a study buddy for ICS 311, the class about <b>algorithms</b> (smart recipes for computers).', '🗂️ The lessons are sorted into piles, one pile for each big test (midterm).', '🎬 Every lesson has notes, pictures, videos, and practice questions.', '🧒 Keep this switch on to see a simple explanation at the top of every page.']};

// ---- course-site links for the Topic 16–17 pages ----
['ds','mst','kruskal','prim','fib'].forEach(id => {
  const pg = document.getElementById('page-' + id), lead = pg && pg.querySelector(':scope > p.lead'); if (!lead) return;
  const n = id === 'ds' || id === 'fib' ? 'Topic 16' : 'Topic 17';
  lead.insertAdjacentHTML('afterend', `<div class="row res-row"><span class="res">📅 <b>Week 12 · Mon 11/09</b></span><span class="res">📖 <b>Reading:</b> ${id === 'fib' ? 'Fibonacci heaps are not in the CLRS 4e print book (they were Ch. 19 in the 3rd edition)' : 'CLRS 19.1, 19.3 &amp; 21; Lemmas 19.11–19.13, Theorem 19.14'}</span><span class="res">📝 <b>Lecture notes:</b> <a href="${SCHED.notes[n]}" target="_blank" rel="noopener">${n} ↗</a>${n === 'Topic 16' ? ' (skip the linked-list representation: the forest is much better)' : ''}</span><span class="res">🎬 <b>Screencasts:</b> 17A, 17B, 17C</span></div>`);
  if (id === 'ds') pg.querySelector('.qa').insertAdjacentHTML('beforebegin', '<div class="callout cyan">📌 <b>About the assigned lemmas:</b> in CLRS 4e, Lemmas 19.11–19.13 and Theorem 19.14 (Section 19.4) are the amortized analysis of union by rank with path compression. MAKE-SET costs O(1) amortized (19.11), LINK and FIND-SET cost O(α(n)) amortized (19.12–19.13), so m operations take O(m α(n)) (Theorem 19.14). The course notes say you only need the result, not the proof.</div>');
  if (id === 'mst') pg.querySelector('.qa').insertAdjacentHTML('beforebegin', `<h2>🎬 Additional screencast</h2><div class="vgrid">${ytLite('FPEMBWg_WlY', 'MIT Lecture 16 (from 23:26)', 1406)}</div><h2>📚 Prerequisite review</h2><div class="chips">${['ICS 241 Ch 11.4: Spanning Trees', 'ICS 241 Ch 11.5: Minimum Spanning Trees'].map(prereqChip).join('')}</div>`);
});

['ds','mst','kruskal','prim','fib'].forEach(id => { const pg = document.getElementById('page-' + id), rr = pg && pg.querySelector(':scope > .res-row'); if (rr) rr.insertAdjacentHTML('afterend', learnBlock(id)); });
// ---- render pages & nav ----
document.getElementById('page-videos').insertAdjacentHTML('beforebegin', GROUPS.map(g => groupPage(g) + g.topics.filter(id => COURSE.some(t => t.id === id)).map(id => topicPage(TMETA[id])).join('')).join(''));
const YEAR = 2026;
const WEEK_OF_STATIC = {ds: 12, mst: 12, kruskal: 12, prim: 12, fib: 12};
const weekOf = id => WEEK_OF_STATIC[id] || +((TMETA[id].when || '').match(/Week (\d+)/) || [])[1];
const mdDate = md => { const [m, d] = md.split('/').map(Number); return new Date(YEAR, m - 1, d); };
const WEEK_START = n => new Date(YEAR, 7, 24 + 7 * (n - 1));
const weekNum = d => Math.floor(Math.round((d - WEEK_START(1)) / 864e5) / 7) + 1;
const fmtD = d => d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
const weekRange = n => { const st = WEEK_START(n), e = new Date(YEAR, st.getMonth(), st.getDate() + 4); return `${fmtD(st)}–${st.getMonth() === e.getMonth() ? e.getDate() : fmtD(e)}`; };
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const groupWeeks = g => { const W = []; g.topics.forEach(id => { const w = weekOf(id); let o = W.find(x => x.w === w); if (!o) W.push(o = {w, ids: []}); o.ids.push(id); }); return W.sort((a, b) => a.w - b.w); };
const CAL_EVENTS = (() => {
  const ev = [], lec = (id, md) => ev.push({d: mdDate(md), type: 'lecture', id, label: TMETA[id].num, title: TMETA[id].short, color: TMETA[id].color});
  COURSE.forEach(t => { const m = (t.when || '').match(/\d\d\/\d\d/); if (m) lec(t.id, m[0]); });
  ['ds', 'mst', 'kruskal', 'prim'].forEach(id => lec(id, '11/09'));
  [['09/07', 'Labor Day'], ['11/11', 'Veterans Day']].forEach(([md, n]) => ev.push({d: mdDate(md), type: 'holiday', label: 'Off', title: n + ' (no class)', color: '#94a3b8'}));
  [['09/09', 'mt1'], ['10/07', 'mt2'], ['10/28', 'mt3'], ['11/25', 'mt4']].forEach(([md, id]) => { const g = GROUPS.find(x => x.id === id); ev.push({d: mdDate(md), type: 'exam', id, label: 'MT' + id.slice(2), title: `${g.name} · ${g.covers}`, color: '#ef4444'}); });
  ev.push({d: mdDate('12/09'), type: 'review', id: 'final', label: 'Review', title: 'Course review', color: '#f59e0b'});
  ev.push({d: mdDate('12/18'), type: 'exam', id: 'final', label: 'Final', title: 'Final exam 9:45–11:45am · cumulative', color: '#ef4444'});
  return ev.sort((a, b) => a.d - b.d);
})();
function calHTML(){
  const today = new Date(), chip = e => `<a class="cal-ev ${e.type}" href="#${e.id || 'home'}" title="${e.title}" style="--c:${e.color}">${e.label}</a>`;
  const month = m => {
    const first = new Date(YEAR, m, 1), days = new Date(YEAR, m + 1, 0).getDate(); let cells = '<div class="cal-d empty"></div>'.repeat((first.getDay() + 6) % 7);
    for (let d = 1; d <= days; d++) {
      const dt = new Date(YEAR, m, d), evs = CAL_EVENTS.filter(e => sameDay(e.d, dt));
      cells += `<div class="cal-d${dt.getDay() % 6 === 0 ? ' wkend' : ''}${sameDay(dt, today) ? ' today' : ''}"><span class="cal-n">${d}</span>${evs.slice(0, 3).map(chip).join('')}${evs.length > 3 ? `<span class="cal-more" title="${evs.slice(3).map(e => e.title).join(', ')}">+${evs.length - 3}</span>` : ''}</div>`;
    }
    return `<div class="cal-m"><div class="cal-mh">${first.toLocaleDateString('en-US', {month: 'long'})} ${YEAR}</div><div class="cal-g">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(x => `<div class="cal-w">${x}</div>`).join('')}${cells}</div></div>`;
  };
  return `<div class="cal-months">${[7, 8, 9, 10, 11].map(month).join('')}</div>`;
}
function timelineHTML(){
  const today = new Date(); let out = '', lastW = 0, marked = false;
  CAL_EVENTS.forEach(e => {
    const w = weekNum(e.d), past = e.d < today && !sameDay(e.d, today);
    if (!marked && !past) { out += `<div class="tl-today"><span>Today · ${fmtD(today)}</span></div>`; marked = true; }
    if (w !== lastW) { out += `<div class="tl-week">${w > 16 ? 'Finals week' : 'Week ' + w}<span>${weekRange(w)}</span></div>`; lastW = w; }
    out += `<a class="tl-ev ${e.type}${past ? ' past' : ''}" href="#${e.id || 'home'}" style="--c:${e.color}"><span class="tl-date">${e.d.toLocaleDateString('en-US', {weekday: 'short', month: '2-digit', day: '2-digit'})}</span><span class="tl-dot"></span><span class="tl-label">${e.label}</span><span class="tl-title">${e.title}</span></a>`;
  });
  return `<div class="tl">${out}</div>`;
}
function renderCalendar(){
  const el = document.getElementById('home-cal'); if (!el) return;
  let view = 'cal'; try { view = localStorage.getItem('ics311-calview') || 'cal'; } catch (e) {}
  el.innerHTML = `<div class="row" style="justify-content:space-between"><h2 style="margin:0">📅 Semester ${view === 'cal' ? 'calendar' : 'timeline'}</h2><div class="seg" id="cal-seg"><button data-v="cal" class="${view === 'cal' ? 'on' : ''}">🗓️ Calendar</button><button data-v="tl" class="${view === 'tl' ? 'on' : ''}">🕒 Timeline</button></div></div>
    <div class="cal-legend"><span class="cal-ev lecture" style="--c:#8b5cf6">#9</span>Lecture topic<span class="cal-ev exam" style="--c:#ef4444">MT</span>Exam<span class="cal-ev review" style="--c:#f59e0b">Review</span>Course review<span class="cal-ev holiday" style="--c:#94a3b8">Off</span>No class · click any event to open it</div>
    ${view === 'cal' ? calHTML() : timelineHTML()}`;
  el.querySelectorAll('#cal-seg button').forEach(b => b.onclick = () => { try { localStorage.setItem('ics311-calview', b.dataset.v); } catch (e) {} renderCalendar(); });
}
const NAV_SHORT = {t01:'Intro & Data Structures', t09:'Heaps & PQs', t11:'2-3-4 & RB Trees', t10a:'Selection & Order Stats', t10b:'Lower Bounds & Sorts', t13:'Greedy & Huffman', t18:'Single-Source Paths', t25:'Approximation Algs'};
function buildNav(){
  const link = id => { const t = TMETA[id]; return `<a href="#${id}" data-page="${id}"><span class="dot" style="background:${t.color}"></span><span class="nnum">${t.num}</span><span class="nlabel" title="${t.short}">${NAV_SHORT[id] || t.short}</span></a>`; };
  const cw = weekNum(new Date());
  document.getElementById('nav').innerHTML = `<a href="#home" data-page="home"><span class="dot" style="background:#e5e7eb"></span>Overview</a>` +
    GROUPS.map(g => `<div class="nav-head" style="--c:${g.color}"><span>${g.icon} ${g.name}</span><span class="gdate">${g.date.split(' · ')[0].replace(/–[\d:]+(am|pm)$/i, '$1')}</span></div><a href="#${g.id}" data-page="${g.id}" class="gover"><span class="dot" style="background:${g.color}"></span>${g.final ? 'Final exam overview' : 'Exam overview'}</a>` +
      groupWeeks(g).map(o => `<details class="nav-group nav-week" data-week="${o.w}"${o.w === cw ? ' open' : ''}><summary><span>Week ${o.w}</span><span class="gdate">${weekRange(o.w)}</span></summary>${o.ids.map(link).join('')}</details>`).join('')).join('') +
    `<div class="nav-label">Watch &amp; Practice</div><a href="#videos" data-page="videos"><span class="dot" style="background:#f87171"></span>All screencasts</a><a href="#practice" data-page="practice"><span class="dot" style="background:linear-gradient(135deg,#8b5cf6,#22d3ee)"></span>Practice Arena</a>`;
}
buildNav();

function renderHome(){
  const all = Object.values(store.byTopic), a = all.reduce((s, t) => s + t.a, 0), c = all.reduce((s, t) => s + t.c, 0), codes = Object.values(store.code);
  const hs = document.getElementById('home-stats');
  if (hs) hs.innerHTML = [[a, 'Questions answered'], [a ? Math.round(100 * c / a) + '%' : '—', 'Average score'], [`${codes.length}/${CODE.length + PS_CODE.length}`, 'Pseudocode challenges attempted'], [codes.length ? Math.round(codes.reduce((x, y) => x + y, 0) / codes.length) + '%' : '—', 'Best pseudocode avg']]
    .map(([v, l]) => `<div class="card"><div class="stat grad">${v}</div><div class="stat-label">${l}</div></div>`).join('');
  const tc = document.getElementById('topic-cards');
  if (tc) tc.innerHTML = GROUPS.map(g => {
    const W = groupWeeks(g), ew = +(g.date.match(/Week (\d+)/) || [])[1];
    if (ew && !W.some(o => o.w === ew)) W.push({w: ew, ids: []});
    W.sort((x, y) => x.w - y.w);
    return `<div class="home-group"><div class="hg-head"><h3>${g.icon} ${g.name}</h3><span class="pill">${g.date}</span><span class="pill">${g.covers}</span><a class="btn sm ghost" href="#${g.id}">Overview →</a></div>` + W.map(o => {
      const evs = CAL_EVENTS.filter(e => e.type !== 'lecture' && weekNum(e.d) === o.w);
      return `<div class="wk-head"><b>📅 Week ${o.w}</b><span class="stat-label">${weekRange(o.w)}</span>${evs.map(e => `<span class="pill" style="color:${e.color}">${e.d.toLocaleDateString('en-US', {weekday: 'short'})} ${fmtD(e.d)} · ${e.title}</span>`).join('')}</div>` + (o.ids.length ? `<div class="grid g3">${o.ids.map(topicCard).join('')}</div>` : `<p class="wk-empty">No new ${g.name} topics this week.</p>`);
    }).join('') + '</div>';
  }).join('');
  renderCalendar();
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
  const topics = groupId === 'all' ? Object.keys(TOPICS) : GROUPS.find(x => x.id === groupId).topics; location.hash = 'practice';
  renderPractice(topics); runQuiz(document.getElementById('practice-root'), {topics, mode: 'mixed', n: 10});
}
DIAGRAMS.videos = () => fig(D.svg(780, 150, GROUPS.map((g, i) => { const n = g.topics.reduce((s, id) => s + ((TMETA[id].videos || EXIST_VIDS[id] || []).length + (TMETA[id].mit || []).length), 0);
  return D.box(20 + i * 152, 30, 135, 70, g.name, g.color, n + ' videos') + (i < GROUPS.length - 1 ? D.arrow(155 + i * 152, 65, 170 + i * 152, 65, 'mut', 2.5) : ''); }).join('') + D.text(390, 135, 'click any thumbnail to play it in place', 12, C.mut)),
  'Screencasts are grouped by the midterm they prepare you for, in teaching order.', 'Pick your test, then watch the videos from left to right.');
ELI5.videos = {title: 'Watching the videos', pts: ['🎬 Every lesson has short videos from the teacher. They are sorted by which big test they help with.', '▶️ Tap a picture to play the video right on the page.', '✂️ Some videos only play the part your schedule says to watch.', '💡 Tip: pause and try to guess the next step before the teacher shows it!']};

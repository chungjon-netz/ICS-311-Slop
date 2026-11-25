// ======================= LEARNING PATH PAGES (#mt<n>-learn) =======================
// Renders LEARN_MT4 (learn-mt4-units.js) as a guided lecture: lessons with dummy
// notes, exact screencast sections (learn-chapters.js), visualizers and quick
// checks, plus a generated pseudocode unit test (learn-mt4-gen.js) after each unit.
const lrnTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
// [videoId, fromChapter?, toChapter?] → {id, start, end, label}, using the real YouTube chapters
function lrnClip([id, from, to]){
  const [tag, , len, ch] = LEARN_CH[id] || [id, '', 0, []];
  const i = from ? ch.findIndex(c => c[1] === from) : -1, j = to ? ch.findIndex(c => c[1] === to) : i;
  if (i < 0) return {id, start: 0, end: 0, label: `${tag} · full video${len ? ` (${lrnTime(len)})` : ''}`, ok: !from};
  const start = ch[i][0], end = j + 1 < ch.length ? ch[j + 1][0] : len;
  return {id, start, end, label: `${tag} · ${from}${to && to !== from ? ' → ' + to : ''} (${lrnTime(start)}–${lrnTime(end)})`, ok: j >= 0};
}
const lrnClips = (specs, cap) => specs && specs.length ? `<div class="lrn-clips"><div class="stat-label">${cap}</div><div class="vgrid">${specs.map(lrnClip).map(c => ytLite(c.id, c.label, c.start || '', c.end || '')).join('')}</div></div>` : '';
const lrnCheckId = (u, i) => `${u.id}-${i + 1}`;
function lrnCheckHTML(u, i, [q, opts, why]){
  const order = shuffle(opts.map((_, k) => k));
  return `<div class="lrn-check" data-k="${lrnCheckId(u, i)}" data-topic="${u.topics[0]}" data-ans="${order.indexOf(0)}" data-why="${esc(why)}">
    <div class="lrn-q"><span class="pill">✅ Knowledge check</span> ${q}</div>
    <div class="opts">${order.map((k, n) => `<button class="opt" data-i="${n}"><span class="k">${'ABCD'[n]}</span><span>${opts[k]}</span></button>`).join('')}</div><div class="lrn-why"></div></div>`;
}
function lrnUnitHTML(u, n){
  const notes = SCHED.notes[u.notes], vids = new Set(u.lessons.flatMap(l => (l.clips || []).map(c => c[0])));
  const chips = u.topics.map(id => TMETA[id] ? `<a class="pill" href="#${id}" style="color:${TMETA[id].color}">${TMETA[id].num || ''} ${TMETA[id].short}</a>` : '').join(' ');
  return `<details class="card lrn-unit" id="lrn-${u.id}" open><summary><h2><span class="lrn-num">Unit ${n}</span> ${u.title}</h2><span class="pill lrn-uprog" data-u="${u.id}"></span></summary>
    <div class="row lrn-res">${chips}<span class="pill">📖 ${u.reading}</span>${notes ? `<a class="pill" href="${notes}" target="_blank" rel="noopener">📝 ${u.notes} lecture notes ↗</a>` : ''}<span class="pill">🎬 ${vids.size ? vids.size + ' screencast' + (vids.size > 1 ? 's' : '') + ', split into sections' : 'no course screencast; use the notes'}</span></div>
    ${u.lessons.map((l, i) => `<div class="lrn-lesson" id="lrn-${u.id}-${i + 1}">
      <h3><span class="lrn-num">${n}.${i + 1}</span> ${l.h}</h3>
      <div class="lrn-body">${l.body}</div>
      <div class="lrn-dummy"><span class="lrn-dummy-tag">🧒 Dummy note</span> ${l.kid}</div>
      ${lrnClips(l.clips, '🎬 Watch the matching screencast section')}
      ${l.viz && VIZ[l.viz] ? `<div class="lrn-viz"><div class="stat-label">🔬 ${VIZ[l.viz].title}${VIZ[l.viz].hint ? ' · ' + VIZ[l.viz].hint : ''}</div><div class="card"><div class="stepper" data-viz="${l.viz}"></div></div></div>` : ''}
      ${l.check ? lrnCheckHTML(u, i, l.check) : ''}</div>`).join('')}
    ${lrnClips(u.extra, '🎓 Extra video lectures (MIT 6.046J, the sections that match this unit)')}
    <div class="card lrn-test" data-u="${u.id}"><div class="row" style="justify-content:space-between;gap:10px"><h3 style="margin:0">✍️ Unit ${n} test · write pseudocode for a generated problem</h3><button class="btn sm lrn-new">🎲 New generated problem</button></div>
      <p class="stat-label" style="margin:6px 0 0">Each problem modifies an algorithm from this unit (an early exit, extra memory, a faster data structure). Graded like the Practice Arena: Correctness 40% · Modularity 30% · Efficiency 30%. Score 90%+ to pass the unit.</p><div class="lrn-test-body"></div></div>
  </details>`;
}
const lrnTestIds = u => LEARN_GEN[u.id].map(f => f().id);
const lrnPassed = u => lrnTestIds(u).some(id => (store.code[id] || 0) >= 90);
function lrnProgress(gid){
  const units = LEARN_PATHS[gid], st = lrnStates[gid]; let done = 0, total = 0, passed = 0;
  units.forEach(u => {
    const ks = u.lessons.map((l, i) => l.check ? lrnCheckId(u, i) : null).filter(Boolean), ok = ks.filter(k => st.checks[k]).length, pass = lrnPassed(u);
    done += ok; total += ks.length; passed += pass;
    document.querySelectorAll(`.lrn-uprog[data-u="${u.id}"]`).forEach(el => { el.textContent = `${ok}/${ks.length} checks · test ${pass ? 'passed ✓' : 'not passed'}`; el.style.color = pass && ok === ks.length ? 'var(--good)' : ''; });
  });
  const pct = Math.round(100 * (done + passed * 3) / (total + units.length * 3));
  document.querySelectorAll(`#page-${gid}-learn .lrn-prog`).forEach(el => el.innerHTML = `<div class="row" style="justify-content:space-between"><b>Your progress: ${pct}%</b><span class="stat-label">${done}/${total} knowledge checks correct · ${passed}/${units.length} unit tests passed</span></div><div class="meter" style="margin-top:8px"><span style="width:${pct}%;background:var(--good)"></span></div>`);
}
function lrnMountTest(box, u, gid){
  const body = box.querySelector('.lrn-test-body');
  const gen = () => { const fs = LEARN_GEN[u.id], last = box.dataset.last; let f = pick(fs);
    if (fs.length > 1) while (f().id === last) f = pick(fs);
    const q = f(); box.dataset.last = q.id;
    renderQuestion(body, {kind: 'code', topic: q.topic, q, generated: true}, () => { lrnProgress(gid); renderHome(); }); };
  box.querySelector('.lrn-new').onclick = gen;
  gen();
}
function mountLearnPath(g, units){
  const gid = g.id, tag = g.name.replace('Midterm ', 'MT'), nL = units.reduce((s, u) => s + u.lessons.length, 0), st = lrnStates[gid];
  document.getElementById('page-videos').insertAdjacentHTML('beforebegin', `<section class="page hidden learn-page" id="page-${gid}-learn">
    <div class="row" style="gap:8px"><a class="eyebrow" href="#${gid}" style="color:${g.color};border-color:${g.color}55;background:${g.color}14">${g.icon} ${g.name} · ${g.date}</a><span class="eyebrow">🎓 Learning path</span></div>
    <h1>🎓 ${g.name} <span class="grad">Learning Path</span></h1>
    <p class="lead">A guided lecture through every ${tag} topic: ${units.length} units and ${nL} lessons. Each lesson gives a detailed explanation, a dummy note in plain language, the exact screencast sections that cover it, and a quick knowledge check. Each unit ends with a generated pseudocode problem that modifies the algorithm you just learned.</p>
    <div class="row"><a class="btn" href="#${gid}">← ${g.name} overview</a><a class="btn" href="#${gid}-crib">📝 Crib sheet</a><button class="btn primary" data-practice="${gid}">🎯 Practice ${g.name}</button><button class="btn ghost" data-lrn-all="open">⊞ Expand all</button><button class="btn ghost" data-lrn-all="close">⊟ Collapse all</button></div>
    <div class="card lrn-prog" style="margin-top:16px"></div>
    <div class="callout cyan"><b>How to use it:</b> read the lesson, then watch only the screencast section listed under it (clips start and stop at the right chapter; videos without chapter markers play in full). Answer the knowledge check before moving on. Finish each unit by writing the generated pseudocode problem from memory, and use 🎲 for a new variant until you can score 90%+.</div>
    <div class="card"><h3 style="margin-top:0">📑 Units</h3><div class="crib-toc-grid">${units.map((u, i) => `<a href="javascript:void 0" data-jump="lrn-${u.id}">Unit ${i + 1} · ${u.title}</a>`).join('')}</div></div>
    ${units.map((u, i) => lrnUnitHTML(u, i + 1)).join('')}
    <div class="card lrn-prog" style="margin-top:16px"></div></section>`);
  const pg = document.getElementById(`page-${gid}-learn`);
  pg.addEventListener('click', e => {
    const j = e.target.closest('[data-jump]');
    if (j){ const t = document.getElementById(j.dataset.jump); if (t.tagName === 'DETAILS') t.open = true; t.scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
    const a = e.target.closest('[data-lrn-all]');
    if (a){ pg.querySelectorAll('details.lrn-unit').forEach(d => d.open = a.dataset.lrnAll === 'open'); return; }
    const b = e.target.closest('.lrn-check .opt'); if (!b) return;
    const box = b.closest('.lrn-check'); if (box.dataset.done) return; box.dataset.done = 1;
    const ans = +box.dataset.ans, ok = +b.dataset.i === ans;
    box.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.i === ans) x.classList.add('correct'); });
    if (!ok) b.classList.add('wrong');
    box.querySelector('.lrn-why').innerHTML = `<div class="explain ${ok ? 'good' : 'bad'} fade"><b>${ok ? '✓ Correct!' : '✗ Not quite.'}</b> ${box.dataset.why}${ok ? '' : ' <span class="stat-label">Reread the lesson above, then try the 🎯 practice quiz.</span>'}</div>`;
    if (ok){ st.checks[box.dataset.k] = 1; lrnSave(gid); }
    record(box.dataset.topic, ok ? 1 : 0); lrnProgress(gid);
  });
  units.forEach(u => lrnMountTest(pg.querySelector(`.lrn-test[data-u="${u.id}"]`), u, gid));
  const nav = document.querySelector(`#nav a.gover[href="#${gid}"]`);
  if (nav) nav.insertAdjacentHTML('afterend', `<a href="#${gid}-learn" data-page="${gid}-learn" class="gover"><span class="dot" style="background:linear-gradient(135deg,${g.color},#22d3ee)"></span>🎓 Learning path</a>`);
  const ov = document.querySelector(`#page-${gid} .crib-link`) || document.querySelector(`#page-${gid} > .row`);
  if (ov) ov.insertAdjacentHTML('afterend', `<div class="card crib-link" style="margin-top:18px;border-color:${g.color}66">
    <div class="row" style="justify-content:space-between;gap:12px"><h2 style="margin:0">🎓 ${g.name} Learning Path</h2><span class="pill" style="color:${g.color}">${units.length} units · ${nL} lessons</span></div>
    <p class="stat-label" style="margin:10px 0 12px">Learn every ${tag} topic in order: detailed lessons with dummy notes, the exact screencast sections and MIT lectures, knowledge checks between lessons, and a generated pseudocode test after every unit.</p>
    <div class="chips">${units.map((u, i) => `<span class="pill">Unit ${i + 1} · ${u.title}</span>`).join(' ')}</div>
    <div class="row" style="margin-top:14px"><a class="btn primary" href="#${gid}-learn">🎓 Start the learning path →</a></div></div>`);
  setTimeout(() => lrnProgress(gid), 0);   // `store` (app.js) is initialized after this file runs
}
const LEARN_PATHS = {};
[['mt1', 'LEARN_MT1'], ['mt2', 'LEARN_MT2'], ['mt3', 'LEARN_MT3'], ['mt4', 'LEARN_MT4']].forEach(([id, v]) => { try { LEARN_PATHS[id] = eval(v); } catch (e) {} });
const lrnStates = {};
const lrnSave = gid => { try { localStorage.setItem('ics311-learn-' + gid, JSON.stringify(lrnStates[gid])); } catch (e) {} };
GROUPS.filter(g => LEARN_PATHS[g.id]).forEach(g => {
  try { lrnStates[g.id] = JSON.parse(localStorage.getItem('ics311-learn-' + g.id)) || {}; } catch (e) { lrnStates[g.id] = {}; }
  lrnStates[g.id].checks = lrnStates[g.id].checks || {};
  mountLearnPath(g, LEARN_PATHS[g.id]);
});

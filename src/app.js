// ======================= STATE =======================
const STORE_KEY = 'mstlab-v1';
const store = (() => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } })();
store.byTopic = store.byTopic || {}; store.code = store.code || {};
const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {} };
function record(topic, frac, codeId){
  const t = store.byTopic[topic] = store.byTopic[topic] || {a: 0, c: 0};
  t.a++; t.c += frac;
  if (codeId) store.code[codeId] = Math.max(store.code[codeId] || 0, Math.round(frac * 100));
  save(); renderHome();
}
function toast(msg){ const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1800); }

// ======================= QUESTION FACTORY =======================
const recent = [];
function nextQuestion(topics, mode){
  topics = [].concat(topics);
  const mcPool = MC.filter(q => topics.includes(q.topic)).map((q, i) => ({src: q, id: 'mc' + MC.indexOf(q)}));
  const genPool = GEN.filter(g => topics.includes(g.topic)).map(g => ({gen: g, id: 'gen' + GEN.indexOf(g)}));
  const codePool = CODE.filter(q => topics.includes(q.topic)).map(q => ({code: q, id: q.id}));
  let kind = mode === 'mc' ? 'mc' : mode === 'code' ? 'code' : (Math.random() < 0.3 && codePool.length ? 'code' : 'mc');
  if (kind === 'code' && !codePool.length) kind = 'mc';
  let pool = kind === 'code' ? codePool : (genPool.length && Math.random() < 0.4 ? genPool : mcPool);
  const fresh = pool.filter(p => !recent.includes(p.id) || p.gen);
  const choice = pick(fresh.length ? fresh : pool);
  recent.push(choice.id); if (recent.length > 25) recent.shift();
  if (choice.code) return {kind: 'code', topic: choice.code.topic, q: choice.code};
  const base = choice.gen ? {topic: choice.gen.topic, ...choice.gen.gen()} : {...choice.src};
  const idx = shuffle(base.options.map((_, i) => i));
  return {kind: 'mc', topic: base.topic, q: base.q, graph: base.graph, explain: base.explain, generated: !!choice.gen,
    options: idx.map(i => base.options[i]), answer: idx.indexOf(base.answer)};
}

// ======================= RENDERERS =======================
function renderQuestion(el, inst, onDone){
  const T = TOPICS[inst.topic];
  const tag = `<div class="row" style="gap:6px"><span class="pill ${inst.kind}">${inst.kind === 'mc' ? 'Multiple choice' : 'Pseudocode'}</span><span class="pill" style="color:${T.color}">${T.icon} ${T.name}</span>${inst.generated ? '<span class="pill">🎲 generated</span>' : ''}</div>`;
  if (inst.kind === 'mc'){
    el.innerHTML = `<div class="fade">${tag}<div class="question">${inst.q}</div>${inst.graph ? `<div class="q-graph">${inst.graph}</div>` : ''}
      <div class="opts">${inst.options.map((o, i) => `<button class="opt" data-i="${i}"><span class="k">${'ABCD'[i]}</span><span>${o}</span></button>`).join('')}</div><div class="explain-slot"></div></div>`;
    el.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      const i = +b.dataset.i, ok = i === inst.answer;
      el.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.i === inst.answer) x.classList.add('correct'); });
      if (!ok) b.classList.add('wrong');
      el.querySelector('.explain-slot').innerHTML = `<div class="explain ${ok ? 'good' : 'bad'} fade"><b>${ok ? '✓ Correct!' : '✗ Not quite.'}</b> ${inst.explain}</div>`;
      record(inst.topic, ok ? 1 : 0);
      onDone && onDone(ok ? 1 : 0);
    });
  } else {
    const q = inst.q;
    el.innerHTML = `<div class="fade">${tag}<h3 style="margin-top:12px">${q.title}</h3><div class="question">${q.prompt}</div>
      <div class="callout cyan" style="font-size:.86rem;margin-top:0">Graded on <b>Correctness</b> (40%) · <b>Modularity</b> (30%) · <b>Efficiency</b> (30%). Any reasonable pseudocode style works: CLRS, Python-like, or C-like. Use <code>NAME(args)</code> headers with indented bodies.</div>
      <div class="editor-wrap"><div class="editor-bar"><span class="dots"><span style="background:#f87171"></span><span style="background:#fbbf24"></span><span style="background:#34d399"></span></span><span>pseudocode · Tab = 4 spaces</span></div>
      <textarea class="code" spellcheck="false">${esc(q.starter)}</textarea></div>
      <div class="row" style="margin-top:12px"><button class="btn primary submit">⚡ Submit for grading</button><button class="btn hintbtn">💡 Hint</button><button class="btn ghost reset">↺ Reset</button></div>
      <div class="hint-slot"></div><div class="result-slot"></div></div>`;
    const ta = el.querySelector('textarea');
    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab'){ e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); }
      if (e.key === 'Enter'){ const s = ta.selectionStart; const line = ta.value.slice(0, s).split('\n').pop(); const ind = line.match(/^\s*/)[0] + (/[:{]\s*$/.test(line) ? '    ' : ''); if (ind){ e.preventDefault(); ta.setRangeText('\n' + ind, s, ta.selectionEnd, 'end'); } }
    });
    let hintN = 0, recorded = false;
    el.querySelector('.reset').onclick = () => { ta.value = q.starter; el.querySelector('.result-slot').innerHTML = ''; };
    el.querySelector(".hintbtn").onclick = () => {
      const r = gradeCode(q, ta.value); const miss = r.fb.correctness.filter(x => !x.ok && x.hint);
      const h = miss[hintN % Math.max(1, miss.length)]; hintN++;
      el.querySelector('.hint-slot').innerHTML = `<div class="explain fade">💡 ${h ? `<b>${h.label}:</b> ${esc(h.hint)}` : 'Your answer already covers every correctness point. Now polish modularity and efficiency!'}</div>`;
    };
    el.querySelector('.submit').onclick = () => {
      if (ta.value.trim() === q.starter.trim()) { toast('Write some pseudocode first ✍️'); return; }
      const r = gradeCode(q, ta.value);
      el.querySelector('.result-slot').innerHTML = renderGrade(r, q);
      if (!recorded){ recorded = true; record(q.topic, r.overall / 100, q.id); onDone && onDone(r.overall / 100); }
      else if (r.overall / 100 > (store.code[q.id] || 0) / 100) { store.code[q.id] = r.overall; save(); }
    };
  }
}
function renderGrade(r, q){
  const col = v => v >= 8 ? 'var(--good)' : v >= 5 ? 'var(--warn)' : 'var(--bad)';
  const meter = (lbl, v, w) => `<div class="score"><div class="lbl">${lbl} <span style="opacity:.6">· ${w}</span></div><div class="val" style="color:${col(v)}">${v}<span style="font-size:.9rem;color:var(--dim)"> / 10</span></div><div class="meter"><span style="width:${v * 10}%;background:${col(v)}"></span></div></div>`;
  const list = items => `<ul class="fb">${items.map(x => `<li class="${x.ok ? 'ok' : x.pen ? 'pen' : 'no'}"><span class="m">${x.ok ? '✓' : x.pen ? '!' : x.bonus ? '○' : '✗'}</span><span>${esc(x.label)}${!x.ok && x.hint ? `<span class="hint">${esc(x.hint)}</span>` : ''}</span></li>`).join('')}</ul>`;
  const gcol = r.overall >= 80 ? 'var(--good)' : r.overall >= 60 ? 'var(--warn)' : 'var(--bad)';
  return `<div class="fade" style="margin-top:18px">
    <div class="overall"><div class="grade" style="color:${gcol}">${r.letter}</div><div><div style="font-size:1.4rem;font-weight:800">${r.overall}%</div><div class="stat-label">${r.overall >= 90 ? 'Excellent: clean, correct, and efficient.' : r.overall >= 70 ? 'Solid. Check the feedback below to tighten it up.' : 'Keep going. Use the feedback and hints to fill the gaps.'}</div></div></div>
    <div class="scores">${meter('Correctness', r.correctness, '40%')}${meter('Modularity', r.modularity, '30%')}${meter('Efficiency', r.efficiency, '30%')}</div>
    <div class="grid g3"><div><h3>Correctness</h3>${list(r.fb.correctness)}</div><div><h3>Modularity</h3>${list(r.fb.modularity)}</div><div><h3>Efficiency</h3>${list(r.fb.efficiency)}</div></div>
    <details class="model"><summary>Show model answer</summary><pre><code>${esc(q.model)}</code></pre></details>
    <p class="stat-label" style="margin-top:10px">Automated rubric grading looks for key algorithmic steps, structure, and complexity red flags. Compare with the model answer to self-check.</p></div>`;
}

// ======================= TOPIC Q&A WIDGETS =======================
function mountQA(el){
  const topic = el.dataset.topic; let mode = 'mixed';
  el.innerHTML = `<div class="qa-head"><h3>🧠 Topic Q&amp;A <span class="pill">random</span></h3>
    <div class="row"><div class="seg">${[['mixed', 'Mixed'], ['mc', 'Multiple choice'], ['code', 'Pseudocode']].map(([k, l]) => `<button data-m="${k}" class="${k === mode ? 'on' : ''}">${l}</button>`).join('')}</div>
    <button class="btn sm next">New question ↻</button></div></div><div class="body"></div><div class="row after" style="margin-top:14px"></div>`;
  const body = el.querySelector('.body'), after = el.querySelector('.after');
  const go = () => { after.innerHTML = ''; renderQuestion(body, nextQuestion(topic, mode), () => { after.innerHTML = '<button class="btn primary">Next question →</button>'; after.firstChild.onclick = go; }); };
  el.querySelectorAll('.seg button').forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b)); go(); });
  el.querySelector('.next').onclick = go;
  go();
}

// ======================= PRACTICE ARENA =======================
function renderPractice(){
  const root = document.getElementById('practice-root');
  const cfg = {topics: Object.keys(TOPICS), mode: 'mixed', n: 10};
  root.innerHTML = `<div class="card fade" style="margin-top:20px">
    <h3 style="margin-top:0">Topics</h3><div class="row">${Object.entries(TOPICS).map(([k, t]) => `<label class="chk"><input type="checkbox" value="${k}" checked> ${t.icon} ${t.name}</label>`).join('')}</div>
    <h3>Question type</h3><div class="seg" id="p-mode">${[['mixed', 'Mixed'], ['mc', 'Multiple choice only'], ['code', 'Pseudocode only']].map(([k, l]) => `<button data-m="${k}" class="${k === 'mixed' ? 'on' : ''}">${l}</button>`).join('')}</div>
    <h3>Length</h3><div class="seg" id="p-n">${[5, 10, 15, 20].map(n => `<button data-n="${n}" class="${n === 10 ? 'on' : ''}">${n} questions</button>`).join('')}</div>
    <div style="margin-top:22px"><button class="btn primary" id="p-start">🚀 Start practice</button></div></div>`;
  root.querySelectorAll('#p-mode button').forEach(b => b.onclick = () => { cfg.mode = b.dataset.m; root.querySelectorAll('#p-mode button').forEach(x => x.classList.toggle('on', x === b)); });
  root.querySelectorAll('#p-n button').forEach(b => b.onclick = () => { cfg.n = +b.dataset.n; root.querySelectorAll('#p-n button').forEach(x => x.classList.toggle('on', x === b)); });
  root.querySelector('#p-start').onclick = () => {
    cfg.topics = [...root.querySelectorAll('.chk input:checked')].map(i => i.value);
    if (!cfg.topics.length) { toast('Pick at least one topic'); return; }
    runQuiz(root, cfg);
  };
}
function runQuiz(root, cfg){
  const results = []; let i = 0;
  const step = () => {
    if (i >= cfg.n) return summary();
    const inst = nextQuestion(cfg.topics, cfg.mode);
    root.innerHTML = `<div class="card" style="margin-top:20px"><div class="row" style="justify-content:space-between"><b>Question ${i + 1} of ${cfg.n}</b><span class="stat-label">Score so far: ${results.length ? Math.round(100 * results.reduce((a, r) => a + r.s, 0) / results.length) : 0}%</span></div>
      <div class="progress"><span style="width:${100 * i / cfg.n}%"></span></div><div class="qbody"></div>
      <div class="row" style="margin-top:16px;justify-content:space-between"><button class="btn ghost sm quit">✕ End session</button><div class="nav-slot"><button class="btn sm skip">Skip →</button></div></div></div>`;
    const slot = root.querySelector('.nav-slot');
    root.querySelector('.quit').onclick = summary;
    root.querySelector('.skip').onclick = () => { results.push({inst, s: 0, skipped: true}); i++; step(); };
    renderQuestion(root.querySelector('.qbody'), inst, s => {
      results.push({inst, s}); i++;
      slot.innerHTML = `<button class="btn primary">${i >= cfg.n ? 'See results 🏁' : 'Next →'}</button>`;
      slot.firstChild.onclick = step;
    });
  };
  const summary = () => {
    const pct = results.length ? Math.round(100 * results.reduce((a, r) => a + r.s, 0) / results.length) : 0;
    const byT = {}; results.forEach(r => { const t = byT[r.inst.topic] = byT[r.inst.topic] || {n: 0, s: 0}; t.n++; t.s += r.s; });
    root.innerHTML = `<div class="card fade" style="margin-top:20px;text-align:center"><div style="font-size:3rem">${pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
      <h2 style="margin:6px 0">${pct}%</h2><p class="lead" style="margin:0 auto">${results.length} answered · ${results.filter(r => r.inst.kind === 'code').length} pseudocode · ${results.filter(r => r.skipped).length} skipped</p>
      <table class="tbl" style="max-width:520px;margin:18px auto"><tr><th>Topic</th><th>Questions</th><th>Score</th></tr>${Object.entries(byT).map(([k, v]) => `<tr><td>${TOPICS[k].icon} ${TOPICS[k].name}</td><td>${v.n}</td><td>${Math.round(100 * v.s / v.n)}%</td></tr>`).join('')}</table>
      <div class="row" style="justify-content:center"><button class="btn primary again">↻ New random set</button><button class="btn change">⚙ Change settings</button></div></div>`;
    root.querySelector('.again').onclick = () => runQuiz(root, cfg);
    root.querySelector('.change').onclick = renderPractice;
  };
  step();
}

// ======================= VISUALIZERS =======================
function mountKruskal(){
  const el = document.getElementById('viz-kruskal'); const {steps, total} = kruskalSteps(CLRS_GRAPH.nodes, CLRS_GRAPH.edges); let k = -1;
  const key = e => [e.u, e.v].sort().join();
  const draw = () => {
    const es = {};
    steps.slice(0, k + 1).forEach((s, j) => { es[key(s.edge)] = s.accepted ? 'mst' : 'rej'; });
    if (k >= 0) es[key(steps[k].edge)] = steps[k].accepted ? 'mst' : 'rej';
    const cur = steps[k];
    const g = {nodes: CLRS_GRAPH.nodes, edges: CLRS_GRAPH.edges};
    const accW = cur ? cur.accepted_so_far.reduce((a, e) => a + e.w, 0) : 0;
    el.innerHTML = `<div class="viz"><div>${renderGraph(g, {w: 500, h: 300, edgeState: es})}
      <div class="row" style="margin-top:10px"><button class="btn sm" data-a="reset">⏮ Reset</button><button class="btn sm" data-a="prev">◀ Prev</button><button class="btn primary sm" data-a="next">Next edge ▶</button><button class="btn sm" data-a="end">⏭ Finish</button></div></div>
      <div class="side"><p><b>Step ${k + 1} / ${steps.length}</b> · MST weight so far: <b>${accW}</b>${k === steps.length - 1 ? ` (final = ${total})` : ''}</p>
      <p>${cur ? (cur.accepted ? `✅ <b>(${cur.edge.u},${cur.edge.v})</b> w=${cur.edge.w} joins two different sets, so it is <span style="color:var(--good)">accepted</span>.` : `❌ <b>(${cur.edge.u},${cur.edge.v})</b> w=${cur.edge.w}: FIND-SET(${cur.edge.u}) = FIND-SET(${cur.edge.v}), so it is <span style="color:var(--bad)">rejected</span> (would form a cycle).`) : 'Every vertex starts in its own set. Edges are sorted by weight.'}</p>
      <p class="stat-label">Disjoint sets:</p><p style="font-family:var(--mono);font-size:.82rem">${(cur ? cur.sets : CLRS_GRAPH.nodes.map(n => [n.id])).map(s => `{${s.join(',')}}`).join(' ')}</p>
      <div class="log">${steps.map((s, j) => `<div class="${j === k ? 'cur' : ''}">${j <= k ? (s.accepted ? '<span class="acc">✓</span>' : '<span class="rej">✗</span>') : '·'} (${s.edge.u},${s.edge.v}) ${s.edge.w}</div>`).join('')}</div></div></div>`;
    el.querySelectorAll('button').forEach(b => b.onclick = () => { const a = b.dataset.a; k = a === 'reset' ? -1 : a === 'prev' ? Math.max(-1, k - 1) : a === 'next' ? Math.min(steps.length - 1, k + 1) : steps.length - 1; draw(); });
  };
  draw();
}
function mountPrim(){
  const el = document.getElementById('viz-prim'); let root = 'a', data, k;
  const key = (a, b) => [a, b].sort().join();
  const init = () => { data = primSteps(CLRS_GRAPH.nodes, CLRS_GRAPH.edges, root); k = 0; draw(); };
  const draw = () => {
    const s = data.steps[k]; const es = {}, ns = {}, lab = {};
    s.done.forEach(v => { ns[v] = 'in'; if (s.pi[v]) es[key(v, s.pi[v])] = 'mst'; });
    if (s.u) ns[s.u] = 'cur';
    CLRS_GRAPH.nodes.forEach(n => { if (!s.done.includes(n.id)) { lab[n.id] = s.key[n.id] === Infinity ? '∞' : s.key[n.id]; if (s.pi[n.id]) es[key(n.id, s.pi[n.id])] = 'cur'; } });
    const W = s.done.reduce((a, v) => a + (s.pi[v] ? s.key[v] : 0), 0);
    el.innerHTML = `<div class="viz"><div>${renderGraph(CLRS_GRAPH, {w: 500, h: 300, edgeState: es, nodeState: ns, nodeLabel: lab})}
      <div class="row" style="margin-top:10px"><label class="stat-label">Root <select id="prim-root" style="background:#111827;color:#fff;border:1px solid var(--border);border-radius:8px;padding:4px 8px">${CLRS_GRAPH.nodes.map(n => `<option ${n.id === root ? 'selected' : ''}>${n.id}</option>`).join('')}</select></label>
      <button class="btn sm" data-a="reset">⏮</button><button class="btn sm" data-a="prev">◀ Prev</button><button class="btn primary sm" data-a="next">EXTRACT-MIN ▶</button><button class="btn sm" data-a="end">⏭</button></div></div>
      <div class="side"><p><b>Step ${k} / ${data.steps.length - 1}</b> · tree weight: <b>${W}</b></p>
      <p>${s.u ? `Extracted <b>${s.u}</b>${s.pi[s.u] ? ` via edge (${s.pi[s.u]},${s.u}) w=${s.key[s.u]}` : ' (root)'}. ${s.updates.length ? 'Updated keys: ' + s.updates.map(x => `${x.v}: ${x.from === Infinity ? '∞' : x.from}→${x.to}`).join(', ') : 'No key updates.'}` : `All keys = ∞, then DECREASE-KEY(Q, ${root}, 0).`}</p>
      <p class="stat-label">Cyan numbers are current keys of vertices still in Q; yellow edges show tentative π pointers; green = tree.</p>
      <table class="tbl"><tr><th>v</th>${CLRS_GRAPH.nodes.map(n => `<th>${n.id}</th>`).join('')}</tr><tr><td>key</td>${CLRS_GRAPH.nodes.map(n => `<td>${s.key[n.id] === Infinity ? '∞' : s.key[n.id]}</td>`).join('')}</tr><tr><td>π</td>${CLRS_GRAPH.nodes.map(n => `<td>${s.pi[n.id] || '–'}</td>`).join('')}</tr></table>
      <p class="stat-label">Extraction order: ${s.done.join(' → ') || '—'}</p></div></div>`;
    el.querySelector('#prim-root').onchange = e => { root = e.target.value; init(); };
    el.querySelectorAll('button').forEach(b => b.onclick = () => { const a = b.dataset.a, L = data.steps.length - 1; k = a === 'reset' ? 0 : a === 'prev' ? Math.max(0, k - 1) : a === 'next' ? Math.min(L, k + 1) : L; draw(); });
  };
  init();
}

// ======================= HOME & VIDEOS =======================
function renderHome(){
  const all = Object.values(store.byTopic), a = all.reduce((s, t) => s + t.a, 0), c = all.reduce((s, t) => s + t.c, 0);
  const codes = Object.values(store.code);
  document.getElementById('home-stats').innerHTML = [
    [a, 'Questions answered'], [a ? Math.round(100 * c / a) + '%' : '—', 'Average score'],
    [codes.length ? `${codes.length}/${CODE.length}` : `0/${CODE.length}`, 'Pseudocode challenges attempted'],
    [codes.length ? Math.round(codes.reduce((x, y) => x + y, 0) / codes.length) + '%' : '—', 'Best pseudocode avg']
  ].map(([v, l]) => `<div class="card"><div class="stat grad">${v}</div><div class="stat-label">${l}</div></div>`).join('') +
  (a ? '' : '') ;
  document.getElementById('topic-cards').innerHTML = Object.entries(TOPICS).map(([k, t]) => {
    const s = store.byTopic[k]; const pct = s && s.a ? Math.round(100 * s.c / s.a) : 0;
    const nQ = MC.filter(q => q.topic === k).length, nG = GEN.filter(q => q.topic === k).length, nC = CODE.filter(q => q.topic === k).length;
    return `<div class="card topic-card" onclick="location.hash='${k}'"><div class="ic" style="background:${t.color}22">${t.icon}</div><h3>${t.name}</h3><p>${t.blurb}</p>
      <div class="row" style="gap:6px"><span class="pill mc">${nQ} MC + ${nG} generators</span><span class="pill code">${nC} pseudocode</span></div>
      <div class="bar"><span style="width:${pct}%"></span></div><div class="stat-label" style="font-size:.75rem;margin-top:4px">${s ? `${s.a} answered · ${pct}% avg` : 'Not started'}</div></div>`;
  }).join('');
}
const VIDEOS = [
  {id: 'Mx-dvvSE4Qc', title: 'Topic 17 A · Minimum Spanning Trees', topic: 'mst', pts: ['Spanning trees: BFS/DFS trees revisited', 'MST problem formulation & applications (circuits, networks)', 'Generic greedy algorithm & loop invariant', 'Cuts, light edges, and the Safe Edge Theorem proof']},
  {id: '1BnpXYm7LKY', title: "Topic 17 B · Kruskal's Algorithm", topic: 'kruskal', pts: ['Greedy: sort edges cheapest-first', 'Union-Find detects cycles (like CONNECTED-COMPONENTS)', 'Worked example on a US airline map (PVD, JFK, BWI, SFO, LAX…)', 'Analysis: O(E lg V); works on disconnected graphs']},
  {id: 'qegY0R78QMQ', title: "Topic 17 C · Prim's Algorithm", topic: 'prim', pts: ['Grow one tree from root r using parent pointers', 'Priority queue keyed by cheapest connecting edge', 'Worked example rooted at SFO; comparison with Dijkstra', 'Analysis: O(E lg V); O(E + V lg V) with Fibonacci heaps']}
];
function renderVideos(){
  document.getElementById('video-grid').innerHTML = VIDEOS.map(v => `<div class="card"><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}" title="${v.title}" allowfullscreen loading="lazy"></iframe></div>
    <h3>${v.title}</h3><ul class="clean">${v.pts.map(p => `<li>${p}</li>`).join('')}</ul>
    <div class="row"><a class="btn sm" href="#${v.topic}">📘 Read the notes</a><a class="btn sm" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">↗ YouTube</a></div></div>`).join('');
}

// ======================= ROUTER =======================
function route(){
  const page = (location.hash || '#home').slice(1);
  const id = document.getElementById('page-' + page) ? page : 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('hidden', p.id !== 'page-' + id));
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.dataset.page === id));
  document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
mountExtras(); renderHome(); renderVideos(); renderPractice(); mountKruskal(); mountPrim();
document.querySelectorAll('.qa[data-topic]').forEach(mountQA);
route();

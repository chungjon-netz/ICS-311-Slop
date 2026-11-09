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

// ======================= FEEDBACK & REVIEW HELPERS =======================
const PRAISE = [
  'You reasoned it through instead of guessing — that is exactly how it sticks.',
  'Correct! Now say the <i>why</i> out loud; teaching it to yourself is the best review there is.',
  'Nice work. Small consistent wins like this are what carry you to exam day.',
  'Clean answer. You earned it — keep the streak going.'
];
const MISS_TIPS = [
  'Slow down: eliminate the wrong options one at a time — most distractors fail on a single swapped detail.',
  'Cover the choices and re-derive the answer from the definition or theorem first, then match.',
  'Ask what each option <i>claims</i>. Wrong answers usually sound right but break one rule.',
  'Re-read the question carefully — half of these misses are a misread, not a misremembered fact.'
];
const NOTE_FOR = {ds:'Topic 16', mst:'Topic 17', kruskal:'Topic 17', prim:'Topic 17', fib:'Topic 16'};

// One concrete mini-example per topic — the "base case" to test any claim against.
const BASE_EXAMPLES = {
  t01:'Push a, b, c onto a stack, then pop twice: you get c, then b (LIFO). A queue would give a, then b (FIFO).',
  t02:'Binary search on [1,3,5,7,9] for 7: probe index 3 (5), discard the left half, probe index 4 → found in ⌈lg 5⌉ ≈ 3 steps.',
  t03:'At n = 1024: n = 1024, n lg n ≈ 10,240, n² ≈ 1,048,576, 2ⁿ is over 10³⁰⁰. Ordering growth rates is most of asymptotic analysis.',
  t07:'Merge sort on 8 elements: split to singles (3 levels), merge pairwise — each level costs Θ(n), so T(n) = 2T(n/2) + Θ(n) = Θ(n lg n).',
  t08:'Insert 5, 3, 8, 1 into a BST: search for 1 walks 5 → 3 → 1. In-order walk prints 1, 3, 5, 8 — sorted for free.',
  t09:'Max-heap array [16, 14, 10, 8, 2]: every parent ≥ its children. EXTRACT-MIN/EXTRACT-MAX removes the root, moves the last element up, and sifts it down — O(lg n).',
  t11:'Inserting into a full 2-3-4 node splits it and pushes the middle key up; red-black trees do the same dance with colors and rotations. Height stays ≤ 2 lg(n + 1).',
  t05a:'Interview candidates one by one and hire anyone better than all before: expected hires = 1 + 1/2 + 1/3 + … + 1/n ≈ ln n.',
  t05b:'Quicksort picks a random pivot; on average it splits near the middle, giving T(n) = 2T(n/2) + Θ(n) = Θ(n lg n) — no matter the input order.',
  t06:'Hash k = 37 into a table of size m = 13 with h(k) = k mod m: slot 11. If occupied, double hashing probes (11 + i·(1 + 37 mod 7)) mod 13.',
  t10a:'SELECT finds the k-th smallest without sorting: median-of-medians picks a good pivot, partitions, and recurses on one side — worst case still Θ(n).',
  t10b:'If keys are integers in [0, k], counting sort runs in Θ(n + k) — beat the n lg n comparison lower bound by not comparing at all.',
  t12s:'N-Queens: place one queen per row; when a column/diagonal clashes, undo the last choice and try the next — that undo is backtracking.',
  t12a:'Rod cutting: revenue[n] = max over cut i of (price[i] + revenue[n − i]); fill the table bottom-up instead of recomputing exponentially many cuts.',
  t12b:'LCS of "ABCBDAB" and "BDCABA" is "BCBA" (length 4) — the DP table fills cell by cell: match → diagonal + 1, else → max of up/left.',
  t13:'Huffman coding: repeatedly merge the two lowest-frequency symbols into a node; the deepest symbols get the longest codes, and frequent ones stay short.',
  t14a:'BFS from a source visits vertices in layers by edge count; DFS dives down one path first. BFS gives shortest paths in unweighted graphs.',
  t14b:'Topological sort orders a DAG so every edge points forward — Kahn\'s algorithm (repeatedly take in-degree-0 vertices) or DFS finish times both work.',
  t18:'Dijkstra on A→B (4), A→C (2), C→B (1): settle A, relax C (2) and B (4), then C improves B to 3. Keys only decrease via relaxation.',
  t19:'Floyd-Warshall: d[i][j] = min(d[i][j], d[i][k] + d[k][j]) for every intermediate k — Θ(V³) but trivially correct for dense graphs.',
  t20:'Ford-Fulkerson: keep finding an augmenting path in the residual graph and pushing its bottleneck capacity until no path remains — that flow is maximum.',
  t24:'Reduction example: to prove a problem NP-hard, transform a known NP-hard problem into it in polynomial time — e.g., reduce 3-SAT to CLIQUE.',
  t25:'Greedy vertex cover: repeatedly pick an uncovered edge\'s endpoint — you get a cover at most twice the optimum, a 2-approximation in polynomial time.',
  t22:'Brent\'s theorem: parallel time T₁ ≤ W/P + O(S) — total work W spread over P processors plus the longest dependency chain S.',
  ds:'MAKE-SET a, b, c; UNION(a,b); UNION(b,c); FIND-SET(a) and FIND-SET(c) return the same root — all three are now one set.',
  mst:'Three vertices a, b, c with edges ab = 1, bc = 2, ac = 3: the MST takes ab and bc for total 3 — the safe-edge theorem guarantees the cheapest crossing edge is safe.',
  kruskal:'Edges sorted: (a,b)=1 accept, (b,c)=2 accept, (a,c)=3 reject — FIND-SET(a) = FIND-SET(c) already, so it would close a cycle.',
  prim:'From root a with edges ab = 5, ac = 3, bc = 1: extract a, keys become b:5, c:3; extract c (key 3), then b drops to 1 via c. Tree weight = 4.',
  fib:'A degree-3 node must have children of degree ≥ 0, 1, 1 — cascading cuts keep that ordering, which is what forces size(x) ≥ F_{k+2} and D(n) = O(lg n).'
};
const DEDUCTION_MC = [
  'Pin down exactly what is being asked — a definition, a cost, or a behavior.',
  'Write the rule or theorem from memory, then test <b>each</b> option against it.',
  'Cross out options that swap one detail: order, which data structure, or best vs. worst case.',
  'Sanity-check the surviving option on a tiny example (n = 3 or a 3-vertex graph).'
];
const DEDUCTION_CODE = [
  'Plan first: in a comment, write what the procedure returns and its target running time.',
  'Fix the ✗ correctness items top to bottom — each hint names the exact missing step.',
  'Then check modularity: could a helper procedure make this cleaner?',
  'Then efficiency: look for nested scans, repeated work, or a better data structure.',
  'Compare with the model answer, then rewrite your version from memory and resubmit.'
];

function deductionBlock(kind, topic){
  const steps = kind === 'code' ? DEDUCTION_CODE : DEDUCTION_MC;
  const ex = BASE_EXAMPLES[topic];
  return `<div class="callout cyan" style="margin-top:10px;font-size:.9rem"><b>🧮 Base example:</b> ${ex || 'Take the smallest non-trivial case and trace it by hand — wrong answers usually break on it.'}<br><b>🔎 Process of deduction:</b><ol class="ded-steps">${steps.map(s => `<li>${s}</li>`).join('')}</ol></div>`;
}

function topicRefs(topicId){
  const t = TMETA[topicId]; if (!t) return '';
  const name = t.short || (TOPICS[topicId] || {}).name || topicId;
  const chips = [`<a class="chip link" href="#${topicId}">📘 ${t.num ? t.num + ' · ' : ''}${name}</a>`];
  const notes = (t.notes || '').split(',').map(x => x.trim()).filter(x => SCHED.notes[x]);
  const key = notes[0] || (NOTE_FOR[topicId] && SCHED.notes[NOTE_FOR[topicId]] ? NOTE_FOR[topicId] : null);
  if (key) chips.push(`<a class="chip link" href="${SCHED.notes[key]}" target="_blank" rel="noopener">📝 ${key} lecture notes ↗</a>`);
  return `<div class="row" style="gap:6px;margin-top:10px">${chips.join('')}</div>`;
}
function habitLine(score){
  if (score >= 0.9) return `<b>📌 Study habit:</b> ${pick(PRAISE)}`;
  if (score >= 0.5) return `<b>📌 Study habit:</b> You were close. Cover the feedback, fix the weak spots, and try to say the rule in your own words.`;
  return `<b>📌 Study habit:</b> Don't just read the answer — figure out <i>why</i> each wrong choice fails, review the linked notes, then retest yourself.`;
}
function postGrade(topic, score){
  const how = score >= 0.8
    ? 'Nice work — skim the ✗ items anyway; polishing those is what turns good into great.'
    : 'How to get there: fix the ✗ and ! items in the feedback above one at a time (each hint names the missing step), then compare with the model answer and submit once more from memory.';
  return `<div class="explain ${score >= 0.8 ? 'good' : ''} fade" style="margin-top:12px">${habitLine(score)}<div class="stat-label" style="margin-top:8px">${how}</div>${score < 0.8 ? deductionBlock('code', topic) : ''}${topicRefs(topic)}</div>`;
}

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
      const correctTxt = inst.options[inst.answer];
      el.querySelector('.explain-slot').innerHTML = `<div class="explain ${ok ? 'good' : 'bad'} fade">
        <b>${ok ? '✓ Correct!' : '✗ Not quite — the correct answer is: ' + correctTxt}</b>
        ${inst.explain ? `<div style="margin-top:6px">${inst.explain}</div>` : ''}
        ${ok ? '' : `<div class="stat-label" style="margin-top:8px">How to get there: ${pick(MISS_TIPS)}</div>`}
        ${ok ? '' : deductionBlock('mc', inst.topic)}
        ${habitLine(ok ? 1 : 0.2)}
        ${topicRefs(inst.topic)}
      </div>`;
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
      inst.grade = r;
      el.querySelector('.result-slot').innerHTML = renderGrade(r, q) + postGrade(inst.topic, r.overall / 100);
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
  const topics = (el.dataset.topics || el.dataset.topic || '').split(',').filter(Boolean); let mode = 'mixed';
  el.innerHTML = `<div class="qa-head"><h3>🧠 Topic Q&amp;A <span class="pill">random</span></h3>
    <div class="row"><div class="seg">${[['mixed', 'Mixed'], ['mc', 'Multiple choice'], ['code', 'Pseudocode']].map(([k, l]) => `<button data-m="${k}" class="${k === mode ? 'on' : ''}">${l}</button>`).join('')}</div>
    <button class="btn sm next">New question ↻</button></div></div><div class="body"></div><div class="row after" style="margin-top:14px"></div>`;
  const body = el.querySelector('.body'), after = el.querySelector('.after');
  const go = () => { after.innerHTML = ''; renderQuestion(body, nextQuestion(topics, mode), () => { after.innerHTML = '<button class="btn primary">Next question →</button>'; after.firstChild.onclick = go; }); };
  el.querySelectorAll('.seg button').forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b)); go(); });
  el.querySelector('.next').onclick = go;
  go();
}

// ======================= RESULTS REVIEW =======================
function reviewCard(r, i){
  const inst = r.inst, T = TOPICS[inst.topic] || {name: inst.topic, icon: '❓', color: '#888'};
  const isCode = inst.kind === 'code';
  const badge = r.retests ? `missed · retested ${Math.round(100 * (r.lastRetest || 0))}%` : (r.skipped ? 'skipped' : 'missed');
  const head = isCode
    ? `<div class="question" style="margin-top:10px">${inst.q.title}</div><div class="question" style="font-size:.9rem;color:var(--muted)">${inst.q.prompt}</div>`
    : `<div class="question" style="margin-top:10px">${inst.q}</div>${inst.graph ? `<div class="q-graph">${inst.graph}</div>` : ''}
       <div class="stat-label" style="margin-top:8px">✅ Correct answer: <b style="color:var(--good)">${inst.options[inst.answer]}</b></div>`;
  const deeper = isCode
    ? (inst.grade ? `<details class="model"><summary>Deeper explanation: grading feedback &amp; model answer</summary>${renderGrade(inst.grade, inst.q)}</details>` : `<details class="model"><summary>Deeper explanation: model answer</summary><pre><code>${esc(inst.q.model)}</code></pre></details>`)
    : '';
  return `<div class="card" style="margin:12px 0;padding:16px" data-rv="${i}">
    <div class="row" style="justify-content:space-between;gap:8px"><span class="pill ${isCode ? 'code' : 'mc'}">${isCode ? 'Pseudocode' : 'Multiple choice'}</span>
      <span class="pill" style="color:${T.color}">${T.icon} ${T.name}</span><span class="pill" style="color:var(--bad)">${badge}</span></div>
    ${head}${deeper}
    <div style="margin-top:8px">${topicRefs(inst.topic)}</div>
    <div class="rv-slot" style="margin-top:10px"></div>
    <div class="row" style="margin-top:8px"><button class="btn sm primary rv-btn">↻ Retest this question</button></div>
  </div>`;
}
function wireRetests(panel, missed){
  panel.querySelectorAll('.rv-btn').forEach(b => {
    b.onclick = () => {
      const card = b.closest('[data-rv]'), r = missed[+card.dataset.rv], slot = card.querySelector('.rv-slot');
      renderQuestion(slot, r.inst, s => {
        r.retests = (r.retests || 0) + 1; r.lastRetest = s;
        const badge = [...card.querySelectorAll('.pill')].find(p => /missed|skipped/.test(p.textContent));
        if (badge) badge.textContent = `missed · retested ${Math.round(s * 100)}%`;
        slot.insertAdjacentHTML('afterbegin', `<div class="explain ${s >= 1 ? 'good' : 'bad'} fade" style="margin-bottom:10px"><b>${s >= 1 ? '✓ Retest passed!' : '✗ Not yet — review the notes above and try again.'}</b> Score: ${Math.round(s * 100)}%</div>`);
      });
    };
  });
}

// ======================= PRACTICE ARENA =======================
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
    const missed = results.filter(r => r.s < 1);
    root.innerHTML = `<div class="card fade" style="margin-top:20px;text-align:center"><div style="font-size:3rem">${pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
      <h2 style="margin:6px 0">${pct}%</h2><p class="lead" style="margin:0 auto">${results.length} answered · ${results.filter(r => r.inst.kind === 'code').length} pseudocode · ${results.filter(r => r.skipped).length} skipped</p>
      <table class="tbl" style="max-width:520px;margin:18px auto"><tr><th>Topic</th><th>Questions</th><th>Score</th></tr>${Object.entries(byT).map(([k, v]) => `<tr><td>${TOPICS[k].icon} ${TOPICS[k].name}</td><td>${v.n}</td><td>${Math.round(100 * v.s / v.n)}%</td></tr>`).join('')}</table>
      <div class="row" style="justify-content:center"><button class="btn primary again">↻ New random set</button><button class="btn change">⚙ Change settings</button></div>
      ${missed.length ? `<div style="margin-top:22px;border-top:1px solid var(--border);padding-top:16px">
        <label class="eli5-toggle" style="margin:0 auto;max-width:600px;justify-content:center;cursor:pointer"><span class="eli5-text" style="align-items:center"><b>🔍 Review missed questions</b><small>${missed.length} missed/skipped · correct answers, deeper explanations &amp; retest</small></span><input type="checkbox" id="rv-sw"><span class="switch"></span></label>
        <div id="rv-panel" class="hidden" style="margin-top:14px;text-align:left"></div></div>`
      : '<p class="stat-label" style="margin-top:14px">No misses — flawless run! 🏆</p>'}</div>`;
    root.querySelector('.again').onclick = () => runQuiz(root, cfg);
    root.querySelector('.change').onclick = () => renderPractice(cfg.topics);
    const sw = root.querySelector('#rv-sw');
    if (sw){
      const panel = root.querySelector('#rv-panel');
      sw.onchange = () => {
        panel.classList.toggle('hidden', !sw.checked);
        if (sw.checked && !panel.dataset.filled){ panel.dataset.filled = '1'; panel.innerHTML = missed.map((r, i) => reviewCard(r, i)).join(''); wireRetests(panel, missed); }
      };
    }
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
// ======================= ROUTER =======================
function route(){
  const page = (location.hash || '#home').slice(1);
  const id = document.getElementById('page-' + page) ? page : 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('hidden', p.id !== 'page-' + id));
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.dataset.page === id));
  const act = document.querySelector('.nav a.active'); if (act && act.closest('details')) act.closest('details').open = true;
  document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
mountExtras(); renderHome(); renderVideos(); renderPractice(); mountKruskal(); mountPrim(); mountPS(); mountTheme();
document.querySelectorAll('.qa[data-topic], .qa[data-topics]').forEach(mountQA);
route();

function mountTheme(){
  const seg = document.getElementById('theme-seg');
  const set = t => { document.documentElement.dataset.theme = t; seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.theme === t)); try { localStorage.setItem('ics311-theme', t); } catch (e) {} };
  seg.querySelectorAll('button').forEach(b => b.onclick = () => set(b.dataset.theme));
  set(document.documentElement.dataset.theme || 'dark');
}

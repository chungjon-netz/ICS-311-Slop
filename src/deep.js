// ======================= STEP-THROUGH VISUALIZER ENGINE =======================
// VIZ[id] = {title, hint, code:[lines], opts:[{id,label,val,choices:[[v,label]],fresh}], input(opt), parse(str,opt)?, fmt(input)?, run(input,opt) -> [{svg,msg,line,side,tag}]}
const VIZ = {}, TOOLS = {}, DEEP = {};
const VZC = {cur: C.warn, done: C.good, good: C.good, bad: C.bad, cy: C.cy, acc: C.acc, pink: C.pink, mut: C.mut, warn: C.warn, dim: C.dim};
const vcol = k => VZC[k] || k || C.acc;
const VZ = {
  wrap: (w, h, body) => D.svg(w, h, body),
  cells(arr, o = {}){
    const {x = 10, y = 30, s = 40, hl = {}, fade = () => false, ptr = {}, base = 1, title, idx = true} = o;
    let g = title ? D.text(x, y - 10, title, 12, C.mut, 'start', 600) : '';
    arr.forEach((v, i) => {
      const col = vcol(hl[i]), X = x + i * s;
      g += `<rect x="${X + 2}" y="${y}" width="${s - 4}" height="${s - 4}" rx="7" fill="${col}${hl[i] ? '44' : '1a'}" stroke="${col}" stroke-width="${hl[i] ? 2.5 : 1.3}" opacity="${fade(i) ? .3 : 1}"/>` +
        D.text(X + s / 2 - 2 + 2, y + s / 2 + 3, v === null || v === undefined ? '' : v, s < 34 ? 12 : 14, fade(i) ? C.dim : '#fff', 'middle', 700);
      if (idx) g += D.text(X + s / 2, y + s + 9, i + base, 10, C.dim);
    });
    const at = {}; Object.entries(ptr).forEach(([n, i]) => { if (i == null || i < 0 || i > arr.length) return; (at[i] = at[i] || []).push(n); });
    Object.entries(at).forEach(([i, ns]) => { const X = x + i * s + s / 2; g += D.text(X, y + s + 24, '↑', 13, C.warn, 'middle', 700) + D.text(X, y + s + 38, ns.join(','), 11.5, C.warn, 'middle', 700); });
    return g;
  },
  bars(arr, o = {}){
    const {x = 10, y = 20, w = 500, h = 150, hl = {}, fade = () => false, ptr = {}, base = 1} = o;
    const mx = Math.max(1, ...arr.map(Math.abs)), bw = w / arr.length; let g = '';
    arr.forEach((v, i) => {
      const bh = Math.max(4, (h - 18) * v / mx), col = vcol(hl[i]), X = x + i * bw;
      g += `<rect x="${X + 3}" y="${y + h - bh}" width="${bw - 6}" height="${bh}" rx="5" fill="${col}${hl[i] ? 'aa' : '44'}" stroke="${col}" stroke-width="1.5" opacity="${fade(i) ? .3 : 1}"/>` +
        D.text(X + bw / 2, y + h - bh - 5, v, 12, '#fff', 'middle', 700) + D.text(X + bw / 2, y + h + 13, i + base, 10, C.dim);
    });
    const at = {}; Object.entries(ptr).forEach(([n, i]) => { if (i == null || i < 0 || i > arr.length) return; (at[i] = at[i] || []).push(n); });
    Object.entries(at).forEach(([i, ns]) => { const X = x + i * bw + bw / 2; g += D.text(X, y + h + 30, '↑ ' + ns.join(','), 11.5, C.warn, 'middle', 700); });
    return g;
  },
  // root: {k, l, r, c ('R'|'B'|color key), sub (label under)}; returns svg body
  tree(root, o = {}){
    const {x = 0, y = 30, w = 520, dy = 56, r = 17} = o; if (!root) return D.text(x + w / 2, y + 20, '(empty tree)', 12, C.dim);
    const list = []; const walk = (n, d) => { if (!n) return; walk(n.l, d + 1); list.push([n, d]); walk(n.r, d + 1); }; walk(root, 0);
    const dx = w / list.length, pos = new Map(); list.forEach(([n, d], i) => pos.set(n, [x + (i + .5) * dx, y + d * dy]));
    let e = '', v = '';
    list.forEach(([n]) => { const [px, py] = pos.get(n); [n.l, n.r].forEach(ch => { if (ch) { const [cx, cy] = pos.get(ch); e += D.line(px, py, cx, cy, ch.ec ? vcol(ch.ec) : C.dim, ch.ec ? 3.5 : 2.2); } });
      const red = n.c === 'R', blk = n.c === 'B';
      v += red ? `<circle cx="${px}" cy="${py}" r="${r}" fill="#7f1d1d" stroke="${n.hl ? C.warn : C.bad}" stroke-width="${n.hl ? 4 : 2.5}"/>` + D.text(px, py + 5, n.k, 13, '#fff', 'middle', 700)
        : blk ? `<circle cx="${px}" cy="${py}" r="${r}" fill="#0b0b0f" stroke="${n.hl ? C.warn : '#9ca3af'}" stroke-width="${n.hl ? 4 : 2.5}"/>` + D.text(px, py + 5, n.k, 13, '#fff', 'middle', 700)
        : D.node(px, py, n.k, vcol(n.c), r);
      if (n.sub !== undefined) v += D.text(px, py + r + 13, n.sub, 10.5, C.cy, 'middle', 600);
    });
    return e + v;
  },
  heap(arr, n, o = {}){
    const {hl = {}, fade = () => false} = o; const mk = i => i < n ? {k: arr[i], c: fade(i) ? 'dim' : hl[i] || 'acc', l: mk(2 * i + 1), r: mk(2 * i + 2)} : null;
    return VZ.tree(mk(0), o);
  },
  // g: {nodes:[{id,x,y}], edges:[{u,v,w}]}; o: {directed, es:{'u>v':state}, ns:{id:state}, lab:{id:text}, elab:{'u>v':text}, r}
  graph(g, o = {}){
    const {directed = true, es = {}, ns = {}, lab = {}, elab = {}, r = 17, sub = {}} = o; const P = {}; g.nodes.forEach(n => P[n.id] = n);
    const has = new Set(g.edges.map(e => e.u + '>' + e.v)); let s = '';
    g.edges.forEach(e => {
      const a = P[e.u], b = P[e.v], key = e.u + '>' + e.v, st = es[key] || (!directed && es[e.v + '>' + e.u]) || '';
      const col = st ? vcol(st) : 'rgba(255,255,255,.28)', wd = st ? 3.5 : 2;
      const dxl = b.x - a.x, dyl = b.y - a.y, L = Math.hypot(dxl, dyl) || 1, ux = dxl / L, uy = dyl / L;
      const bend = directed && has.has(e.v + '>' + e.u) ? 14 : 0, nx = -uy * bend, ny = ux * bend;
      const x1 = a.x + ux * r + nx * .4, y1 = a.y + uy * r + ny * .4, x2 = b.x - ux * (r + 3) + nx * .4, y2 = b.y - uy * (r + 3) + ny * .4;
      const mx = (a.x + b.x) / 2 + nx, my = (a.y + b.y) / 2 + ny;
      const mk = st === 'cur' || st === 'warn' ? 'warn' : st === 'good' || st === 'done' ? 'good' : st === 'bad' ? 'bad' : st === 'cy' ? 'cy' : st === 'acc' ? 'acc' : 'mut';
      s += `<path d="M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="${col}" stroke-width="${wd}" ${st === 'bad' ? 'stroke-dasharray="6 5"' : ''} ${directed ? `marker-end="url(#ar-${mk})"` : ''}/>`;
      const t = elab[key] !== undefined ? elab[key] : e.w;
      if (t !== undefined && t !== '') { const tw = String(t).length * 7 + 10; s += `<rect x="${mx - tw / 2}" y="${my - 10}" width="${tw}" height="19" rx="6" fill="#111827" stroke="${st ? col : 'rgba(255,255,255,.15)'}"/>` + D.text(mx, my + 4, t, 11, st ? col : '#cbd5e1', 'middle', 700); }
    });
    g.nodes.forEach(n => { const st = ns[n.id]; s += D.node(n.x, n.y, n.id, st ? vcol(st) : C.acc, r, st === 'done' ? '#065f46' : st === 'cur' ? '#78350f' : st === 'cy' ? '#164e63' : st === 'bad' ? '#7f1d1d' : '#1e1b4b');
      if (lab[n.id] !== undefined) s += D.text(n.x, n.y - r - 7, lab[n.id], 11.5, '#67e8f9', 'middle', 700);
      if (sub[n.id] !== undefined) s += D.text(n.x, n.y + r + 14, sub[n.id], 10.5, C.warn, 'middle', 600); });
    return s;
  },
  // M: 2D array; o: {x,y,cw,ch,rows,cols,hl:{'i,j':state},fmt}
  grid(M, o = {}){
    const {x = 40, y = 30, cw = 40, ch = 30, rows = [], cols = [], hl = {}, fmt = v => v, title} = o; let g = title ? D.text(x, y - 22, title, 12, C.mut, 'start', 600) : '';
    cols.forEach((c, j) => g += D.text(x + j * cw + cw / 2, y - 7, c, 11.5, C.cy, 'middle', 700));
    rows.forEach((rw, i) => g += D.text(x - 8, y + i * ch + ch / 2 + 4, rw, 11.5, C.cy, 'end', 700));
    M.forEach((row, i) => row.forEach((v, j) => { const st = hl[i + ',' + j], col = st ? vcol(st) : 'rgba(255,255,255,.14)';
      g += `<rect x="${x + j * cw + 1}" y="${y + i * ch + 1}" width="${cw - 2}" height="${ch - 2}" rx="5" fill="${st ? col + '40' : '#111827'}" stroke="${col}" stroke-width="${st ? 2 : 1}"/>` + D.text(x + j * cw + cw / 2, y + i * ch + ch / 2 + 4, v === undefined || v === null ? '' : fmt(v), cw < 34 ? 10.5 : 12, st ? '#fff' : '#cbd5e1', 'middle', 600); }));
    return g;
  }
};
const vzInf = v => v === Infinity ? '∞' : v === -Infinity ? '−∞' : v;
const vzTbl = (head, rows) => `<table class="tbl"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const vzArr = (s, lo = -99, hi = 999, max = 16) => { const a = s.split(/[\s,]+/).filter(Boolean).map(Number); if (!a.length || a.some(v => !Number.isInteger(v) || v < lo || v > hi)) throw new Error(`enter integers between ${lo} and ${hi}, separated by commas`); if (a.length > max) throw new Error(`use at most ${max} numbers`); return a; };
const vzRand = (n, lo, hi) => Array.from({length: n}, () => rnd(lo, hi));

function mountStepper(el){
  if (el.dataset.on) return; el.dataset.on = 1;
  const V = VIZ[el.dataset.viz]; if (!V) return; const opt = {}; (V.opts || []).forEach(o => opt[o.id] = o.val);
  let input = V.input(opt), frames = [], k = 0, timer = null;
  el.innerHTML = `<div class="viz stp"><div><div class="stp-cv"></div>
    <div class="row stp-ctl"><button class="btn sm" data-a="reset" title="Back to the start">⏮</button><button class="btn sm" data-a="prev">◀ Prev</button><button class="btn primary sm" data-a="next">Next ▶</button><button class="btn sm" data-a="play">▶ Play</button><button class="btn sm" data-a="end" title="Jump to the end">⏭</button></div>
    <div class="row stp-ctl">${(V.opts || []).map(o => `<label class="stat-label">${o.label} <select data-o="${o.id}">${o.choices.map(c => `<option value="${c[0]}" ${String(c[0]) === String(o.val) ? 'selected' : ''}>${c[1]}</option>`).join('')}</select></label>`).join('')}
    ${V.parse ? `<input class="stp-in" aria-label="Custom input" spellcheck="false"><button class="btn sm" data-a="use">Use input</button>` : ''}<button class="btn sm" data-a="rand">🎲 New example</button></div></div>
    <div class="side"><p class="stp-step"></p><p class="stp-msg"></p>${V.code ? '<pre class="stp-code"></pre>' : ''}<div class="stp-side"></div></div></div>`;
  const $ = s => el.querySelector(s);
  const show = () => { const f = frames[k] || {};
    $('.stp-cv').innerHTML = f.svg || ''; $('.stp-step').innerHTML = `<b>Step ${k + 1} / ${frames.length}</b>${f.tag ? ` · <span class="pill">${f.tag}</span>` : ''}`;
    $('.stp-msg').innerHTML = f.msg || ''; $('.stp-side').innerHTML = f.side || '';
    if (V.code) $('.stp-code').innerHTML = (typeof V.code === 'function' ? V.code(opt) : V.code).map((l, i) => `<div class="${f.line === i || (Array.isArray(f.line) && f.line.includes(i)) ? 'hl' : ''}">${esc(l) || ' '}</div>`).join('');
    $('[data-a=play]').textContent = timer ? '⏸ Pause' : '▶ Play'; };
  const run = () => { try { frames = V.run(input, opt); } catch (e) { frames = [{msg: '⚠️ ' + esc(e.message)}]; } if (!frames.length) frames = [{msg: 'Nothing to show.'}]; k = 0; if ($('.stp-in')) $('.stp-in').value = V.fmt ? V.fmt(input) : input.join(', '); show(); };
  const stop = () => { clearInterval(timer); timer = null; };
  el.addEventListener('click', e => { const b = e.target.closest('button[data-a]'); if (!b) return; const a = b.dataset.a;
    if (a === 'play'){ if (timer) stop(); else { if (k === frames.length - 1) k = 0; timer = setInterval(() => { if (!el.offsetParent || k >= frames.length - 1){ stop(); show(); return; } k++; show(); }, V.speed || 950); } show(); return; }
    stop();
    if (a === 'rand'){ input = V.input(opt); run(); return; }
    if (a === 'use'){ try { input = V.parse($('.stp-in').value.trim(), opt); } catch (err){ toast('⚠️ ' + err.message); return; } run(); return; }
    k = a === 'reset' ? 0 : a === 'prev' ? Math.max(0, k - 1) : a === 'next' ? Math.min(frames.length - 1, k + 1) : frames.length - 1; show(); });
  el.addEventListener('change', e => { const s = e.target.closest('select[data-o]'); if (!s) return; stop(); opt[s.dataset.o] = s.value; if ((V.opts.find(o => o.id === s.dataset.o) || {}).fresh) input = V.input(opt); run(); });
  run();
}
function mountDeep(page){
  if (!page) return;
  page.querySelectorAll('.stepper:not([data-on])').forEach(mountStepper);
  page.querySelectorAll('.tool:not([data-on])').forEach(el => { el.dataset.on = 1; const T = TOOLS[el.dataset.tool]; if (T) T(el); });
}
function deepBlock(id){
  const X = DEEP[id]; if (!X) return '';
  const cxHead = X.cxHead || ['Operation / algorithm', 'Best', 'Average', 'Worst', 'Extra space', 'Why'];
  return `${(X.viz || []).map(v => `<h2>🔬 ${VIZ[v].title}</h2>${VIZ[v].hint ? `<p class="stat-label">${VIZ[v].hint}</p>` : ''}<div class="card"><div class="stepper" data-viz="${v}"></div></div>`).join('')}
  ${(X.tools || []).map(([tid, title, hint]) => `<h2>🧮 ${title}</h2>${hint ? `<p class="stat-label">${hint}</p>` : ''}<div class="card"><div class="tool" data-tool="${tid}"></div></div>`).join('')}
  ${X.cx ? `<h2>⏱️ Time &amp; space complexity</h2><table class="tbl cx"><tr>${cxHead.map(h => `<th>${h}</th>`).join('')}</tr>${X.cx.map(r => `<tr>${r.map((c, i) => `<td>${i ? c : `<b>${c}</b>`}</td>`).join('')}</tr>`).join('')}</table>${X.cxNote ? `<p class="stat-label">${X.cxNote}</p>` : ''}` : ''}
  ${X.deep ? `<h2>🧭 Deeper dive</h2><div class="deep">${X.deep.map(([h, b]) => `<details class="card deep-item" open><summary><h3>${h}</h3></summary><div class="deep-body">${b}</div></details>`).join('')}</div>` : ''}`;
}

// ======================= DEEP DIVES · MIDTERM 1 =======================
// ---- t01: stack & circular queue ----
VIZ.stackq = {
  title: 'Step-through: stack and circular queue', hint: 'Numbers are PUSH / ENQUEUE, a dash (-) is POP / DEQUEUE. Watch the top, head and tail indices, including wrap-around, overflow and underflow.',
  opts: [{id: 'kind', label: 'Structure', val: 'queue', choices: [['stack', 'Stack (array)'], ['queue', 'Circular queue (array)']]}],
  code: o => o.kind === 'stack'
    ? ['PUSH(S, x)', '  if S.top == S.size  error "overflow"', '  S.top = S.top + 1', '  S[S.top] = x', '', 'POP(S)', '  if S.top == 0  error "underflow"', '  S.top = S.top - 1', '  return S[S.top + 1]']
    : ['ENQUEUE(Q, x)', '  Q[Q.tail] = x', '  if Q.tail == Q.size  Q.tail = 1', '  else Q.tail = Q.tail + 1', '', 'DEQUEUE(Q)', '  x = Q[Q.head]', '  if Q.head == Q.size  Q.head = 1', '  else Q.head = Q.head + 1', '  return x', '// empty: head == tail   full: head == tail + 1 (mod size)'],
  input: () => { const a = []; for (let i = 0; i < 11; i++) a.push(Math.random() < .62 ? String(rnd(1, 99)) : '-'); return a; },
  parse: s => { const a = s.split(/[\s,]+/).filter(Boolean); if (!a.length || a.length > 20 || a.some(x => x !== '-' && !/^\d{1,2}$/.test(x))) throw new Error('use numbers 0–99 and "-" (at most 20)'); return a; },
  run(ops, o){
    const N = 6, A = Array(N).fill(null), F = []; let top = 0, head = 1, tail = 1, cnt = 0;
    const draw = (hl = {}) => VZ.wrap(560, 150, o.kind === 'stack'
      ? VZ.cells(A, {x: 40, y: 40, s: 64, hl, fade: i => i >= top, ptr: top ? {top: top - 1} : {}, title: `S[1..${N}]   S.top = ${top}`})
      : VZ.cells(A, {x: 40, y: 40, s: 64, hl, fade: i => !(head <= tail ? (i + 1 >= head && i + 1 < tail) : (i + 1 >= head || i + 1 < tail)), ptr: {head: head - 1, tail: tail - 1}, title: `Q[1..${N}]   head = ${head}, tail = ${tail}, holds ${cnt} (max ${N - 1})`}));
    F.push({svg: draw(), msg: o.kind === 'stack' ? 'Empty stack: S.top = 0.' : `Empty queue: head = tail = 1. One slot always stays unused so "full" and "empty" look different.`});
    for (const op of ops){
      if (o.kind === 'stack'){
        if (op !== '-'){ if (top === N){ F.push({svg: draw(), msg: `PUSH(${op}): S.top = ${N} = size → <b style="color:var(--bad)">overflow</b>.`, line: 1, tag: 'error'}); continue; } A[top++] = +op; F.push({svg: draw({[top - 1]: 'good'}), msg: `PUSH(${op}): S.top becomes ${top}, S[${top}] = ${op}. O(1).`, line: [2, 3]}); }
        else { if (!top){ F.push({svg: draw(), msg: 'POP on an empty stack → <b style="color:var(--bad)">underflow</b>.', line: 6, tag: 'error'}); continue; } top--; F.push({svg: draw({[top]: 'bad'}), msg: `POP returns ${A[top]} (last in, first out). The value stays in the array but is no longer part of the stack. O(1).`, line: [7, 8]}); }
      } else {
        if (op !== '-'){ if (cnt === N - 1){ F.push({svg: draw(), msg: `ENQUEUE(${op}): head == tail + 1 (mod ${N}) → <b style="color:var(--bad)">overflow</b>.`, line: 10, tag: 'error'}); continue; }
          const at = tail; A[tail - 1] = +op; tail = tail === N ? 1 : tail + 1; cnt++; F.push({svg: draw({[at - 1]: 'good'}), msg: `ENQUEUE(${op}) writes Q[${at}], then tail moves to ${tail}${at === N ? ' (wrapped around to 1)' : ''}. O(1).`, line: [1, at === N ? 2 : 3]}); }
        else { if (!cnt){ F.push({svg: draw(), msg: 'DEQUEUE with head == tail → <b style="color:var(--bad)">underflow</b> (empty).', line: 10, tag: 'error'}); continue; }
          const at = head; head = head === N ? 1 : head + 1; cnt--; F.push({svg: draw({[at - 1]: 'bad'}), msg: `DEQUEUE returns Q[${at}] = ${A[at - 1]} (first in, first out); head moves to ${head}${at === N ? ' (wrapped)' : ''}. O(1).`, line: [6, at === N ? 7 : 8, 9]}); }
      }
    }
    F.push({svg: draw(), msg: `Done. Every operation was O(1): only an index and one array cell change.`, tag: 'done'});
    return F;
  }
};
DEEP.t01 = {
  viz: ['stackq'],
  cxHead: ['Operation', 'Unsorted array', 'Sorted array', 'Doubly linked list (+ sentinel)', 'Notes'],
  cx: [['Access k-th element', 'Θ(1)', 'Θ(1)', 'Θ(n)', 'arrays compute the address directly'], ['SEARCH(key)', 'Θ(n)', 'Θ(lg n) binary search', 'Θ(n)', 'lists can only walk'], ['INSERT', 'Θ(1) at end*', 'Θ(n) shift', 'Θ(1) given position', '*if there is spare capacity'], ['DELETE given pointer/index', 'Θ(n) shift (Θ(1) if order does not matter)', 'Θ(n)', 'Θ(1)', 'singly linked lists need the predecessor: Θ(n)'], ['MINIMUM / MAXIMUM', 'Θ(n)', 'Θ(1)', 'Θ(n)', ''], ['Stack PUSH / POP', 'Θ(1)', '—', 'Θ(1) at head', ''], ['Queue ENQUEUE / DEQUEUE', 'Θ(1) circular', '—', 'Θ(1) with tail pointer', '']],
  cxNote: 'No single structure is fast at everything. That is why the course keeps building new ones: heaps (Topic 9), BSTs (8, 11) and hash tables (6) each make a different set of dynamic-set operations fast.',
  deep: [
    ['Why growth rate beats hardware', `<p>Assume a machine doing 10<sup>9</sup> simple steps per second and an input of n = 10<sup>6</sup>:</p>${vzTbl(['Running time', 'Steps', 'Wall-clock time'], [['lg n', '≈ 20', '20 ns'], ['n', '10<sup>6</sup>', '1 ms'], ['n lg n', '≈ 2×10<sup>7</sup>', '20 ms'], ['n²', '10<sup>12</sup>', '≈ 17 minutes'], ['n³', '10<sup>18</sup>', '≈ 32 years'], ['2ⁿ', '10<sup>301 030</sup>', 'never']])}<p>A 1000× faster computer turns the n² algorithm's 17 minutes into 1 second, but the n lg n algorithm on the old machine is still faster. Choosing the algorithm matters more than buying hardware. This is why we measure cost in <b>steps as a function of n</b> (the RAM model) instead of seconds.</p>`],
    ['Circular-queue arithmetic', `<ul class="clean"><li>The array Q[1..n] is treated as a ring: after index n comes index 1.</li><li><b>Empty</b> when <code>head == tail</code>. <b>Full</b> when <code>head == tail + 1</code> (mod n). So the queue holds at most <b>n − 1</b> items; the spare slot is what tells "full" from "empty".</li><li>Alternative: store a count. Then all n slots can be used, at the cost of one more field to maintain.</li><li>A <b>deque</b> (double-ended queue) allows insert/delete at both ends, still O(1) each with the same wrap-around trick.</li></ul><pre><code>ENQUEUE(Q, x)                    DEQUEUE(Q)
  Q[Q.tail] = x                    x = Q[Q.head]
  Q.tail = (Q.tail mod n) + 1      Q.head = (Q.head mod n) + 1
                                   <span class="kw">return</span> x</code></pre>`],
    ['Sentinels remove the special cases', `<p>Without a sentinel, LIST-DELETE needs <code>if x.prev ≠ NIL</code> and <code>if x.next ≠ NIL</code> checks. With a dummy node <code>L.nil</code> that sits between the tail and the head, every real node always has a real neighbour on both sides:</p><pre><code><span class="fn">LIST-DELETE'</span>(x)                <span class="fn">LIST-INSERT'</span>(x, y)   <span class="cm">// insert x after y</span>
  x.prev.next = x.next             x.next = y.next
  x.next.prev = x.prev             x.prev = y
                                   y.next.prev = x
<span class="fn">LIST-SEARCH'</span>(L, k)               y.next = x
  L.nil.key = k        <span class="cm">// the search is guaranteed to stop</span>
  x = L.nil.next
  <span class="kw">while</span> x.key ≠ k
      x = x.next
  <span class="kw">if</span> x == L.nil <span class="kw">return</span> NIL <span class="kw">else return</span> x</code></pre><p>The asymptotic cost does not change: sentinels make code shorter and remove bug-prone boundary cases. Putting k into the sentinel saves one comparison per loop step in search.</p>`],
    ['Representing trees with any number of children', `<p>A binary tree node stores <code>p</code>, <code>left</code>, <code>right</code>. When a node can have any number of children, an array of child pointers wastes space. The <b>left-child, right-sibling</b> form uses exactly two pointers per node, O(n) space total:</p><ul class="clean"><li><code>x.left-child</code> points to x's leftmost child.</li><li><code>x.right-sibling</code> points to the next child of x's parent.</li></ul><pre><code><span class="fn">COUNT-CHILDREN</span>(x)
  c = 0;  y = x.left-child
  <span class="kw">while</span> y ≠ NIL
      c = c + 1;  y = y.right-sibling
  <span class="kw">return</span> c                  <span class="cm">// Θ(number of children)</span></code></pre><p>Trade-off: finding the i-th child is now Θ(i), not Θ(1).</p>`],
    ['ADTs: separating what from how', `<p>An <b>abstract data type</b> lists operations and their meaning (the specification). A <b>data structure</b> is one implementation of it. Keeping them separate means you can swap a slow implementation for a faster one without touching the code that uses it.</p><p>Example: a priority queue is an ADT (INSERT, MAXIMUM, EXTRACT-MAX). An unsorted list gives Θ(1) INSERT but Θ(n) EXTRACT-MAX; a binary heap (Topic 9) gives Θ(lg n) for both. The program using the priority queue does not change; only its speed does.</p>`],
    ['Proof warm-up: induction', `<p>Most correctness proofs in this course are induction in disguise (loop invariants are induction over loop iterations).</p><ol><li><b>Claim:</b> 1 + 2 + … + n = n(n + 1)/2.</li><li><b>Base:</b> n = 1: 1 = 1·2/2 ✓.</li><li><b>Step:</b> assume it holds for n − 1. Then 1 + … + n = (n − 1)n/2 + n = n(n + 1)/2 ✓.</li></ol><p><b>Strong induction</b> assumes the claim for <i>all</i> smaller values, which is what recursive algorithms need: "MERGE-SORT is correct on both halves, so it is correct on the whole".</p>`]
  ]
};

// ---- t03: growth of functions ----
VIZ.growth = {
  title: 'Step-through: watch the functions race', hint: 'Each step doubles (or multiplies by 10) the input size. Bars are on a log scale; the dashed line is 10⁹ steps ≈ 1 second.',
  opts: [{id: 'scale', label: 'n grows by', val: '2', choices: [['2', '×2 (1 → 1024)'], ['10', '×10 (1 → 10⁹)']]}],
  input: () => [],
  run(_, o){
    const ns = o.scale === '2' ? [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024] : [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
    const l10 = Math.log10, fac = n => n < 2 ? 0 : n <= 2000 ? Array.from({length: n - 1}, (_, i) => l10(i + 2)).reduce((a, b) => a + b, 0) : n * l10(n / Math.E) + .5 * l10(2 * Math.PI * n);
    const fns = [['lg n', n => n < 2 ? -1 : l10(Math.log2(n)), C.good], ['√n', n => .5 * l10(n), C.good], ['n', n => l10(n), C.cy], ['n lg n', n => n < 2 ? -1 : l10(n * Math.log2(n)), C.cy], ['n²', n => 2 * l10(n), C.warn], ['n³', n => 3 * l10(n), C.warn], ['2ⁿ', n => n * l10(2), C.bad], ['n!', n => fac(n), C.bad]];
    const show = lv => lv < 0 ? '0' : lv < 6 ? String(Math.round(10 ** lv * 10) / 10) : `10<sup>${lv < 1e4 ? lv.toFixed(1) : Math.round(lv).toLocaleString()}</sup>`;
    const sv = lv => lv < 6 ? show(lv) : `10^${lv < 1e4 ? lv.toFixed(1) : Math.round(lv).toLocaleString()}`;
    const tm = lv => { if (lv < 0) return '0'; const s = 10 ** (lv - 9); if (lv > 25) return lv > 300 ? 'longer than the universe has existed' : `≈ 10^${(lv - 9 - 7.5).toFixed(0)} years`; return s < 1e-6 ? (s * 1e9).toFixed(0) + ' ns' : s < 1e-3 ? (s * 1e6).toFixed(0) + ' µs' : s < 1 ? (s * 1e3).toFixed(0) + ' ms' : s < 60 ? s.toFixed(1) + ' s' : s < 3600 ? (s / 60).toFixed(1) + ' min' : s < 86400 ? (s / 3600).toFixed(1) + ' h' : s < 3.15e7 ? (s / 86400).toFixed(1) + ' days' : (s / 3.15e7).toPrecision(2) + ' years'; };
    return ns.map((n, k) => { const L = 15, H = 190, bw = 62; let g = `<line x1="20" x2="540" y1="${20 + H - H * 9 / L}" y2="${20 + H - H * 9 / L}" stroke="${C.warn}" stroke-dasharray="5 5"/>` + D.text(538, 14 + H - H * 9 / L, '10⁹ ≈ 1 s', 10.5, C.warn, 'end');
      fns.forEach(([name, f, col], i) => { const lv = f(n), h = Math.max(3, Math.min(1, Math.max(0, lv) / L) * H), X = 30 + i * (bw + 3); g += `<rect x="${X}" y="${20 + H - h}" width="${bw - 8}" height="${h}" rx="5" fill="${col}55" stroke="${col}"/>` + (lv > L ? D.text(X + bw / 2 - 4, 16, '↑ off chart', 10, C.bad) : D.text(X + bw / 2 - 4, 14 + H - h, sv(lv), 10, '#fff')) + D.text(X + bw / 2 - 4, H + 38, name, 12, col, 'middle', 700); });
      const lead = fns.filter(([, f]) => f(n) <= 9).map(x => x[0]);
      return {svg: VZ.wrap(560, 240, D.text(280, H + 60 > 240 ? 236 : H + 60, `n = ${n.toLocaleString()}`, 13, '#fff', 'middle', 700) + g), tag: `n = ${n.toLocaleString()}`,
        msg: k === 0 ? 'At n = 1 every function is tiny. Constants and lower-order terms would decide which is faster here, which is why asymptotics only talk about <b>large n</b>.' : `Feasible in about a second: <b>${lead.join(', ') || 'none'}</b>. ${n >= 64 && n <= 1024 ? 'Exponential and factorial time are already hopeless.' : n >= 1e6 ? 'Even n² is now out of reach for interactive use.' : ''}`,
        side: vzTbl(['f(n)', 'steps', 'time @10⁹/s'], fns.map(([name, f]) => [name, show(f(n)), tm(f(n))]))}; });
  }
};
DEEP.t03 = {
  viz: ['growth'],
  cxHead: ['Growth rate', 'Name', 'Typical algorithm', 'Doubling n multiplies time by'],
  cx: [['Θ(1)', 'constant', 'array access, PUSH', '1'], ['Θ(lg n)', 'logarithmic', 'binary search, heap insert', 'adds a constant'], ['Θ(n)', 'linear', 'linear search, counting sort (k = O(n))', '2'], ['Θ(n lg n)', 'linearithmic', 'merge sort, heapsort', '≈ 2 (slightly more)'], ['Θ(n²)', 'quadratic', 'insertion sort (worst)', '4'], ['Θ(n³)', 'cubic', 'Floyd-Warshall, naive matrix multiply', '8'], ['Θ(2ⁿ)', 'exponential', 'trying every subset', 'squares it'], ['Θ(n!)', 'factorial', 'trying every ordering', 'far worse']],
  deep: [
    ['Proving a bound straight from the definition', `<p><b>Claim:</b> f(n) = 3n² + 10n + 5 is Θ(n²). We need constants c₁, c₂, n₀ &gt; 0 with c₁n² ≤ f(n) ≤ c₂n² for all n ≥ n₀.</p><ul class="clean"><li><b>Lower:</b> 3n² ≤ 3n² + 10n + 5 for all n ≥ 1, so c₁ = 3 works.</li><li><b>Upper:</b> try c₂ = 4: 3n² + 10n + 5 ≤ 4n² ⇔ 10n + 5 ≤ n², true for n ≥ 11 (121 ≥ 115) but false at n = 10 (100 &lt; 105). So n₀ = 11.</li></ul><p><b>Disproving</b> uses contradiction. Is n² = O(n)? Suppose n² ≤ cn for all n ≥ n₀. Divide by n: n ≤ c for all large n, which fails for n = max(n₀, ⌈c⌉ + 1). So no.</p>`],
    ['The limit test (and L\'Hôpital)', `<p>Compute L = lim<sub>n→∞</sub> f(n)/g(n): L = 0 ⇒ f = o(g); 0 &lt; L &lt; ∞ ⇒ f = Θ(g); L = ∞ ⇒ f = ω(g). (If the limit does not exist, the test says nothing.)</p><ul class="clean"><li>lg n vs √n: by L'Hôpital, (1/(n ln 2)) / (1/(2√n)) = 2/(√n ln 2) → 0, so lg n = o(√n).</li><li>n<sup>100</sup> vs 1.01ⁿ: apply L'Hôpital 100 times; the top becomes a constant and the bottom still grows, so n<sup>100</sup> = o(1.01ⁿ). Any exponential with base &gt; 1 beats any polynomial.</li><li>2<sup>n+1</sup> vs 2ⁿ: ratio = 2, so Θ. But 2<sup>2n</sup> vs 2ⁿ: ratio = 2ⁿ → ∞, so 2<sup>2n</sup> ≠ O(2ⁿ). Constants in the <i>exponent</i> matter.</li></ul>`],
    ['Asymptotic notation inside equations', `<ul class="clean"><li>2n² + 3n + 1 = 2n² + Θ(n) means "there is some function in Θ(n) that makes this true". It hides lower-order terms you don't care about.</li><li>On the <b>left</b> side it means "for every function": 2n² + Θ(n) = Θ(n²) says every such function is Θ(n²).</li><li>The "=" is one-way: n = O(n²) is fine, O(n²) = n is not.</li><li><b>Trap:</b> "Σ<sub>i=1</sub><sup>n</sup> O(1) = O(1) because each term is constant" is wrong. There are n terms, so the sum is O(n). Hidden constants are fine; a hidden <i>n</i> is not.</li></ul>`],
    ['Logs, exponents and factorials toolkit', `${vzTbl(['Fact', 'Why it matters'], [['log<sub>a</sub> n = log<sub>b</sub> n / log<sub>b</sub> a', 'log base is a constant factor: we write lg n and drop the base'], ['a<sup>log<sub>b</sub> c</sup> = c<sup>log<sub>b</sub> a</sup>', 'turns 3<sup>lg n</sup> into n<sup>lg 3</sup> ≈ n<sup>1.585</sup> in recursion trees'], ['lg(n!) = Θ(n lg n)', 'the sorting lower bound (Topic 10B)'], ['n! = ω(2ⁿ), n! = o(nⁿ)', 'factorial sits between exponential and nⁿ'], ['lg* n ≤ 5 for every practical n', 'iterated log; α(n) in Union-Find grows even slower'], ['F<sub>i</sub> = (φ<sup>i</sup> − ψ<sup>i</sup>)/√5, φ ≈ 1.618', 'Fibonacci numbers grow exponentially: Θ(φ<sup>i</sup>)']])}`],
    ['Big-O is not "worst case"', `<p>O, Ω and Θ describe <b>functions</b>. Worst, best and average case are <b>which function</b> you are describing. Both choices are independent:</p><ul class="clean"><li>Insertion sort's worst-case time is Θ(n²); its best-case time is Θ(n).</li><li>So "insertion sort is O(n²)" is true for every input, "insertion sort is Ω(n)" is true for every input, but "insertion sort is Θ(n²)" is only true of the worst case.</li><li>Not every pair of functions is comparable: n and n<sup>1 + sin n</sup> keep crossing, so neither is O of the other.</li></ul>`]
  ]
};

// ---- t02: insertion sort ----
VIZ.isort = {
  title: 'Step-through: insertion sort with its loop invariant', hint: 'Green = the sorted prefix A[1..i−1] (the invariant). Yellow = key. Red = an element being compared and shifted right.',
  code: ['INSERTION-SORT(A, n)', '  for i = 2 to n', '      key = A[i]', '      j = i - 1', '      while j > 0 and A[j] > key', '          A[j + 1] = A[j]', '          j = j - 1', '      A[j + 1] = key'],
  opts: [{id: 'kind', label: 'Input', val: 'rand', fresh: true, choices: [['rand', 'Random'], ['sorted', 'Already sorted (best case)'], ['rev', 'Reverse sorted (worst case)']]}],
  input: o => { const a = vzRand(8, 1, 40); return o.kind === 'sorted' ? a.sort((x, y) => x - y) : o.kind === 'rev' ? a.sort((x, y) => y - x) : a; },
  parse: s => vzArr(s, 0, 99, 12),
  run(a){
    a = a.slice(); const n = a.length, F = []; let cmp = 0, sh = 0;
    const fr = (msg, line, hl, i, j, key) => F.push({msg, line, side: `<p class="stat-label">Comparisons: <b>${cmp}</b> · shifts: <b>${sh}</b> · n(n−1)/2 = ${n * (n - 1) / 2}</p>${key !== undefined ? `<p>key = <b style="color:var(--warn)">${key}</b></p>` : ''}`,
      svg: VZ.wrap(560, 220, VZ.bars(a, {x: 10, y: 20, w: 540, h: 150, hl, ptr: {...(i ? {i: i - 1} : {}), ...(j !== undefined && j > 0 ? {j: j - 1} : {})}}))});
    fr('Start. A[1..1] is trivially sorted, so the invariant holds before the first iteration (<b>initialization</b>).', 1, {0: 'good'});
    for (let i = 2; i <= n; i++){
      const key = a[i - 1]; let j = i - 1; const base = {}; for (let t = 0; t < i - 1; t++) base[t] = 'good';
      fr(`i = ${i}: take key = A[${i}] = ${key}. Invariant: A[1..${i - 1}] holds the original first ${i - 1} elements, sorted.`, 2, {...base, [i - 1]: 'cur'}, i, j, key);
      while (j > 0){ cmp++;
        if (a[j - 1] > key){ fr(`A[${j}] = ${a[j - 1]} > ${key}: shift it right.`, 4, {...base, [j - 1]: 'bad'}, i, j, key); a[j] = a[j - 1]; sh++; j--; fr(`A[${j + 2}] = A[${j + 1}]; j = ${j}.`, [5, 6], {...base, [j + 1]: 'bad', [j]: 'dim'}, i, j, key); }
        else { fr(`A[${j}] = ${a[j - 1]} ≤ ${key}: stop. Elements equal to key are never jumped over, so insertion sort is <b>stable</b>.`, 4, {...base, [j - 1]: 'cy'}, i, j, key); break; } }
      a[j] = key; const done = {}; for (let t = 0; t < i; t++) done[t] = 'good';
      fr(`Drop key into A[${j + 1}]. Now A[1..${i}] is sorted: the invariant is <b>maintained</b>.`, 7, {...done, [j]: 'cur'}, i, j, key);
    }
    const all = {}; a.forEach((_, t) => all[t] = 'good');
    fr(`Loop ended with i = n + 1, so the invariant says A[1..n] is sorted (<b>termination</b>). ${cmp} comparisons, ${sh} shifts. Shifts = number of <b>inversions</b> in the input.`, 1, all);
    return F;
  }
};
DEEP.t02 = {
  viz: ['isort'],
  cx: [['INSERTION-SORT', 'Θ(n) (sorted input)', 'Θ(n²)', 'Θ(n²) (reverse sorted)', 'Θ(1), in place', 'shifts = inversions: 0 best, n(n−1)/2 worst, n(n−1)/4 expected'], ['Linear search', 'Θ(1)', 'Θ(n)', 'Θ(n)', 'Θ(1)', 'expected ≈ n/2 probes if the key is present and equally likely anywhere'], ['Binary insertion sort', 'Θ(n lg n) compares', 'Θ(n²) moves', 'Θ(n²)', 'Θ(1)', 'binary search finds the spot faster, but shifting still costs Θ(i)']],
  deep: [
    ['Counting the cost line by line', `<p>Give each line a cost c<sub>k</sub> and count how often it runs. Let t<sub>i</sub> be the number of times the while test runs for a given i.</p>${vzTbl(['Line', 'Cost', 'Times'], [['for i = 2 to n', 'c₁', 'n'], ['key = A[i]', 'c₂', 'n − 1'], ['j = i − 1', 'c₄', 'n − 1'], ['while j &gt; 0 and A[j] &gt; key', 'c₅', 'Σ t<sub>i</sub>'], ['A[j + 1] = A[j]', 'c₆', 'Σ (t<sub>i</sub> − 1)'], ['j = j − 1', 'c₇', 'Σ (t<sub>i</sub> − 1)'], ['A[j + 1] = key', 'c₈', 'n − 1']])}<ul class="clean"><li><b>Best case</b> (sorted): t<sub>i</sub> = 1, so T(n) = an + b, <b>Θ(n)</b>.</li><li><b>Worst case</b> (reverse sorted): t<sub>i</sub> = i, Σ<sub>i=2</sub><sup>n</sup> i = n(n+1)/2 − 1, so T(n) = an² + bn + c, <b>Θ(n²)</b>.</li></ul>`],
    ['Writing your own loop invariant', `<p>A good invariant describes what the loop has accomplished <i>so far</i> and, combined with the exit condition, gives exactly what you want to prove.</p><pre><code><span class="fn">LINEAR-SEARCH</span>(A, n, x)
  <span class="kw">for</span> i = 1 <span class="kw">to</span> n          <span class="cm">// invariant: x is not in A[1..i-1]</span>
      <span class="kw">if</span> A[i] == x <span class="kw">return</span> i
  <span class="kw">return</span> NIL              <span class="cm">// i = n+1: x is not in A[1..n]</span></code></pre><ol><li><b>Initialization:</b> A[1..0] is empty, so x is not in it.</li><li><b>Maintenance:</b> if we did not return at i, A[i] ≠ x, so x is not in A[1..i].</li><li><b>Termination:</b> either we returned a correct index, or i = n + 1 and x is nowhere in A.</li></ol>`],
    ['Inversions explain the running time', `<p>An <b>inversion</b> is a pair i &lt; j with A[i] &gt; A[j]. Every shift in insertion sort fixes exactly one inversion, and nothing else does, so <b>shifts = inversions</b>.</p><ul class="clean"><li>Sorted input: 0 inversions → Θ(n).</li><li>Reverse sorted: all n(n−1)/2 pairs inverted → Θ(n²).</li><li>Random order: each pair is inverted with probability 1/2, so the expected count is n(n−1)/4 → still Θ(n²) on average (a preview of Topic 5A's indicator variables).</li><li>"Nearly sorted" inputs with O(n) inversions sort in Θ(n): insertion sort is the best choice for them, and many library sorts use it for small subarrays.</li></ul>`],
    ['What counts as one step (the RAM model)', `<ul class="clean"><li><b>Data manipulation:</b> assignment, arithmetic, comparison, array indexing.</li><li><b>Flow control:</b> if, loop test, call, return.</li><li><b>Miscellaneous:</b> allocating a variable, following a pointer.</li></ul><p>Each takes constant time. Instructions run one at a time, and memory access is constant time regardless of address. Things that are <i>not</i> one step: sorting, "find the minimum", or exponentiation with a non-constant exponent.</p><p><b>Why report the worst case?</b> It is a guarantee, it happens often (e.g. searching for a missing key), and the average case is frequently just as bad.</p>`],
    ['Problem formulation for sorting', `<p><b>Input:</b> a sequence ⟨a₁, …, aₙ⟩. <b>Output:</b> a permutation ⟨a′₁, …, a′ₙ⟩ with a′₁ ≤ a′₂ ≤ … ≤ a′ₙ. Two properties are often asked about:</p><ul class="clean"><li><b>In place:</b> only Θ(1) elements stored outside the array at once (insertion sort yes, merge sort no).</li><li><b>Stable:</b> equal keys keep their relative order (insertion sort yes, because it stops at A[j] ≤ key). Radix sort (Topic 10B) depends on a stable inner sort.</li></ul>`]
  ]
};

// ---- t07: merge sort + master theorem ----
VIZ.msort = {
  title: 'Step-through: merge sort (divide, conquer, combine)', hint: 'Cyan = the subarray of the current call; faded = outside it. During MERGE, green is the merged part and L and R appear below with their pointers.',
  code: ['MERGE-SORT(A, p, r)', '  if p >= r  return          // 0 or 1 element', '  q = ⌊(p + r) / 2⌋', '  MERGE-SORT(A, p, q)', '  MERGE-SORT(A, q + 1, r)', '  MERGE(A, p, q, r)', 'MERGE: copy A[p..q] into L, A[q+1..r] into R', '  while L and R both have elements left', '      move the smaller front (L wins ties) to A[k]', '  copy whatever is left of L or R into A'],
  input: () => vzRand(8, 1, 40), parse: s => vzArr(s, 0, 99, 12),
  run(a){
    a = a.slice(); const F = [], stack = []; let moves = 0;
    const fr = (msg, line, p, r, hl = {}, LR) => { const H = LR ? 330 : 230; let b = VZ.bars(a, {x: 10, y: 20, w: 540, h: 140, hl: Object.assign(Object.fromEntries(a.map((_, i) => [i, i >= p && i <= r ? 'cy' : ''])), hl), fade: i => i < p || i > r});
      if (LR){ const [L, R, i, j] = LR; b += VZ.cells(L, {x: 10, y: 225, s: 36, title: 'L', base: 1, hl: {[i]: 'cur'}, fade: t => t < i, ptr: {i}}) + VZ.cells(R, {x: 30 + (L.length + 1) * 36, y: 225, s: 36, title: 'R', base: 1, hl: {[j]: 'cur'}, fade: t => t < j, ptr: {j}}); }
      F.push({svg: VZ.wrap(560, H, b), msg, line, tag: `depth ${stack.length - 1}`, side: `<p class="stat-label">Call stack (top last):</p><p style="font-family:var(--mono);font-size:.8rem">${stack.map(([x, y]) => `MS(${x + 1},${y + 1})`).join(' → ')}</p><p class="stat-label">Element moves in MERGE so far: <b>${moves}</b></p>`}); };
    const ms = (p, r) => { stack.push([p, r]);
      if (p >= r){ fr(`MERGE-SORT(A, ${p + 1}, ${r + 1}): one element is already sorted. Base case.`, 1, p, r); stack.pop(); return; }
      const q = Math.floor((p + r) / 2); fr(`Divide A[${p + 1}..${r + 1}] at q = ${q + 1}.`, 2, p, r, {});
      ms(p, q); ms(q + 1, r);
      const L = a.slice(p, q + 1), R = a.slice(q + 1, r + 1); let i = 0, j = 0, k = p;
      fr(`Combine: copy A[${p + 1}..${q + 1}] into L and A[${q + 2}..${r + 1}] into R. Both halves are sorted.`, 6, p, r, {}, [L, R, 0, 0]);
      const g = () => Object.fromEntries(Array.from({length: k - p}, (_, t) => [p + t, 'good']));
      while (i < L.length && j < R.length){ const takeL = L[i] <= R[j]; a[k] = takeL ? L[i] : R[j]; const msg = `L[${i + 1}] = ${L[i]} ${takeL ? '≤' : '>'} R[${j + 1}] = ${R[j]}: copy ${a[k]} into A[${k + 1}].`; takeL ? i++ : j++; k++; moves++; fr(msg, 8, p, r, g(), [L, R, i, j]); }
      while (i < L.length){ a[k++] = L[i++]; moves++; } while (j < R.length){ a[k++] = R[j++]; moves++; }
      fr(`Copy the leftovers. A[${p + 1}..${r + 1}] is now sorted: MERGE did ${r - p + 1} moves, Θ(n) for this call.`, 9, p, r, g(), [L, R, i, j]);
      stack.pop(); };
    fr('Start: MERGE-SORT(A, 1, n).', 0, 0, a.length - 1); stack.push([0, a.length - 1]); stack.pop(); ms(0, a.length - 1);
    F.push({svg: VZ.wrap(560, 230, VZ.bars(a, {x: 10, y: 20, w: 540, h: 140, hl: Object.fromEntries(a.map((_, i) => [i, 'good']))})), msg: `Sorted. Each of the ⌈lg n⌉ = ${Math.ceil(Math.log2(a.length))} levels of recursion moves every element once: ${moves} moves ≈ n lg n.`, tag: 'done'});
    return F;
  }
};
TOOLS.master = el => {
  el.innerHTML = `<div class="row" style="font-family:var(--mono)">T(n) = <input data-k="a" value="2" aria-label="a"> T(n / <input data-k="b" value="2" aria-label="b">) + n^<input data-k="d" value="1" aria-label="d"> · lg^<input data-k="k" value="0" aria-label="k"> n <button class="btn primary sm" data-go>Solve</button></div>
  <div class="row" style="margin-top:8px">${[['merge sort', 2, 2, 1, 0], ['binary search', 1, 2, 0, 0], ['Strassen', 7, 2, 2, 0], ['9T(n/3)+n', 9, 3, 1, 0], ['3T(n/4)+n lg n', 3, 4, 1, 1], ['2T(n/2)+n lg n', 2, 2, 1, 1], ['2T(n/2)+n/lg n', 2, 2, 1, -1]].map(([l, ...v]) => `<button class="btn sm" data-p="${v}">${l}</button>`).join('')}</div><div class="tool-out"></div>`;
  const $ = k => el.querySelector(`[data-k=${k}]`), out = el.querySelector('.tool-out');
  const pw = (x, sym = 'n') => { const r = Math.round(x * 1000) / 1000; return r === 0 ? '1' : r === 1 ? sym : `${sym}<sup>${r}</sup>`; };
  const lgk = k => k === 0 ? '' : k === 1 ? ' lg n' : ` lg<sup>${k}</sup> n`;
  const solve = () => { const a = +$('a').value, b = +$('b').value, d = +$('d').value, k = +$('k').value;
    if (!(a > 0) || !(b > 1) || !(d >= 0) || !Number.isInteger(k)) { out.innerHTML = '<p class="stat-label">Need a &gt; 0, b &gt; 1, d ≥ 0 and an integer k.</p>'; return; }
    const w = Math.log(a) / Math.log(b), eps = 1e-9, f = `${pw(d)}${lgk(k)}`.replace(/^1 /, '');
    let cs, ans, why;
    if (d < w - eps){ cs = 'Case 1'; ans = `Θ(${pw(w)})`; why = `f(n) = ${f} is polynomially smaller than the watershed ${pw(w)} (by n<sup>${(Math.round((w - d) * 1000) / 1000)}</sup>). The leaves dominate.`; }
    else if (Math.abs(d - w) <= eps){ if (k >= 0){ cs = `Case 2 (k = ${k})`; ans = `Θ(${pw(w)}${lgk(k + 1)})`; why = `f(n) = Θ(watershed${k ? ` · lg<sup>${k}</sup> n` : ''}). Every level costs about the same and there are Θ(lg n) levels, adding one more lg factor.`; }
      else { cs = 'Gap: not covered'; ans = k === -1 ? `Θ(${pw(w)} lg lg n)` : `Θ(${pw(w)})`; why = `k &lt; 0 is outside case 2 and f is not polynomially smaller than the watershed, so the master theorem is silent. The answer shown comes from summing the recursion tree (or the Akra-Bazzi method).`; } }
    else { cs = 'Case 3'; ans = `Θ(${f})`; why = `f(n) is polynomially larger than the watershed ${pw(w)}. Regularity holds: a·f(n/b) ≈ (a / b<sup>d</sup>)·f(n) with a / b<sup>d</sup> = ${(a / b ** d).toFixed(3)} &lt; 1. The root dominates.`; }
    const ratio = a / b ** d;
    out.innerHTML = `<p>Watershed function: n<sup>log<sub>${b}</sub> ${a}</sup> = <b>${pw(w)}</b> · driving function f(n) = <b>${f || '1'}</b></p><p><span class="pill">${cs}</span> ⇒ <b style="font-size:1.1rem">T(n) = ${ans}</b></p><p class="stat-label">${why}</p>
    <p class="stat-label">Recursion tree: level i has a<sup>i</sup> = ${a}<sup>i</sup> nodes of size n/${b}<sup>i</sup>; ignoring the lg factor, each level costs (a / b<sup>d</sup>)<sup>i</sup> · n<sup>d</sup> = ${ratio.toFixed(3)}<sup>i</sup> · n<sup>d</sup> → ${ratio < 1 - eps ? 'shrinking geometric series (top level dominates)' : ratio > 1 + eps ? 'growing geometric series (bottom level dominates)' : 'equal cost on every level'}.</p>`; };
  el.addEventListener('click', e => { const p = e.target.closest('[data-p]'); if (p){ const [a, b, d, k] = p.dataset.p.split(','); $('a').value = a; $('b').value = b; $('d').value = d; $('k').value = k; solve(); } if (e.target.closest('[data-go]')) solve(); });
  solve();
};
DEEP.t07 = {
  viz: ['msort'], tools: [['master', 'Master theorem calculator (CLRS 4e form)', 'For T(n) = aT(n/b) + n<sup>d</sup> lg<sup>k</sup> n. Try the presets, then predict the case before pressing Solve.']],
  cx: [['MERGE-SORT', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n)', 'T(n) = 2T(n/2) + Θ(n), case 2'], ['MERGE (n elements)', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'each element is copied out and back once'], ['Binary search', 'Θ(1)', 'Θ(lg n)', 'Θ(lg n)', 'Θ(1) iterative', 'T(n) = T(n/2) + Θ(1)'], ['Max subarray (divide &amp; conquer)', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(lg n) stack', 'crossing subarray costs Θ(n)'], ['Strassen matrix multiply', 'Θ(n<sup>lg 7</sup>)', 'Θ(n<sup>lg 7</sup>)', 'Θ(n<sup>lg 7</sup>) ≈ n<sup>2.81</sup>', 'Θ(n²)', 'T(n) = 7T(n/2) + Θ(n²), case 1']],
  deep: [
    ['Why MERGE is correct: its loop invariant', `<p>At the start of each iteration that fills A[k]:</p><ul class="clean"><li>A[p..k−1] holds the k − p smallest elements of L and R, in sorted order;</li><li>L[i] and R[j] are the smallest elements of their arrays not yet copied back.</li></ul><p><b>Maintenance:</b> the smaller of L[i], R[j] is the smallest uncopied element overall, so placing it at A[k] keeps A[p..k] sorted. <b>Termination:</b> k = r + 1, so A[p..r] holds all r − p + 1 elements sorted. Using ≤ (take from L on ties) makes merge sort <b>stable</b>.</p>`],
    ['Recursion trees, worked twice', `<p><b>T(n) = 2T(n/2) + cn:</b> level i has 2<sup>i</sup> nodes each costing c·n/2<sup>i</sup>, so every level costs cn. There are lg n + 1 levels: total cn(lg n + 1) = Θ(n lg n).</p><p><b>T(n) = 3T(n/4) + cn²:</b> level i costs 3<sup>i</sup>·c(n/4<sup>i</sup>)² = (3/16)<sup>i</sup> cn². This is a decreasing geometric series, so the total is at most cn² / (1 − 3/16) = (16/13)cn² plus the leaves, Θ(n<sup>log₄3</sup>) = o(n²). Answer: Θ(n²). The root dominates.</p><p>Rule of thumb: equal levels → multiply by the number of levels; shrinking levels → the root wins; growing levels → the leaves win.</p>`],
    ['The master theorem as CLRS 4e states it', `<p>For T(n) = aT(n/b) + f(n), compare the <b>driving function</b> f(n) with the <b>watershed function</b> n<sup>log<sub>b</sub> a</sup>:</p><ol><li>f(n) = O(n<sup>log<sub>b</sub> a − ε</sup>) for some ε &gt; 0 ⇒ T(n) = Θ(n<sup>log<sub>b</sub> a</sup>).</li><li>f(n) = Θ(n<sup>log<sub>b</sub> a</sup> lg<sup>k</sup> n) for some k ≥ 0 ⇒ T(n) = Θ(n<sup>log<sub>b</sub> a</sup> lg<sup>k+1</sup> n).</li><li>f(n) = Ω(n<sup>log<sub>b</sub> a + ε</sup>) and a·f(n/b) ≤ c·f(n) for some c &lt; 1 ⇒ T(n) = Θ(f(n)).</li></ol><p>The 4e version of case 2 includes the lg<sup>k</sup> factor, so 2T(n/2) + n lg n = Θ(n lg² n) <i>is</i> covered (older editions called it a gap). A real gap: 2T(n/2) + n / lg n, which is Θ(n lg lg n) by other methods.</p>`],
    ['Substitution: the classic trap and the fix', `<p><b>Wrong:</b> "Guess T(n) = O(n) for T(n) = 2T(n/2) + n. Then T(n) ≤ 2c(n/2) + n = cn + n = O(n)." The hypothesis was T(n) ≤ cn, and cn + n is <i>not</i> ≤ cn. You must prove the exact form.</p><p><b>Fix by subtracting a lower-order term:</b> for T(n) = 2T(n/2) + 1, guessing T(n) ≤ cn gives cn + 1 (fails). Guess T(n) ≤ cn − d instead: 2(c n/2 − d) + 1 = cn − 2d + 1 ≤ cn − d whenever d ≥ 1. ✓</p>`],
    ['Maximum subarray by divide and conquer', `<p>Find the contiguous subarray with the largest sum (useful for "best time to buy and sell" on daily price changes). Split at the middle; the best subarray is either entirely left, entirely right, or <b>crosses the midpoint</b>.</p><pre><code><span class="fn">FIND-MAX-CROSSING</span>(A, low, mid, high)    <span class="cm">// Θ(n)</span>
  best left sum: scan i = mid down to low, keep the max of A[i..mid]
  best right sum: scan j = mid+1 up to high, keep the max of A[mid+1..j]
  <span class="kw">return</span> (i, j, left + right)</code></pre><p>T(n) = 2T(n/2) + Θ(n) = Θ(n lg n). Example: in ⟨13, −3, −25, 20, −3, −16, −23, <b>18, 20, −7, 12</b>, −5, −22, 15, −4, 7⟩ the answer is A[8..11] with sum 43. (A clever single scan, Kadane's algorithm, does it in Θ(n); D&amp;C is not always optimal.)</p>`]
  ]
};

// ======================= DEEP DIVES · MIDTERM 2 =======================
// ---- t09: heaps ----
VIZ.heap = {
  title: 'Step-through: BUILD-MAX-HEAP and HEAPSORT', hint: 'The tree and the array are the same data: A[i]\'s children are A[2i] and A[2i+1]. Yellow = node being heapified, red = child it is compared with, green = sorted tail.',
  code: ['MAX-HEAPIFY(A, i)', '  l = LEFT(i);  r = RIGHT(i)', '  largest = index of the max of A[i], A[l], A[r]', '  if largest ≠ i', '      exchange A[i] with A[largest]', '      MAX-HEAPIFY(A, largest)', 'BUILD-MAX-HEAP(A, n)', '  for i = ⌊n/2⌋ downto 1', '      MAX-HEAPIFY(A, i)', 'HEAPSORT(A, n)', '  BUILD-MAX-HEAP(A, n)', '  for i = n downto 2', '      exchange A[1] with A[i];  A.heap-size -= 1', '      MAX-HEAPIFY(A, 1)'],
  opts: [{id: 'mode', label: 'Run', val: 'sort', choices: [['build', 'BUILD-MAX-HEAP only'], ['sort', 'Full HEAPSORT']]}],
  input: () => vzRand(10, 1, 60), parse: s => vzArr(s, 0, 99, 15),
  run(a, o){
    a = a.slice(); const n = a.length, F = []; let hs = n, swaps = 0;
    const fr = (msg, line, hl = {}) => { const sorted = {}; for (let t = hs; t < n; t++) sorted[t] = 'good';
      F.push({msg, line, side: `<p class="stat-label">heap-size = <b>${hs}</b> · exchanges so far: <b>${swaps}</b></p>`,
        svg: VZ.wrap(560, 300, VZ.heap(a, hs, {hl: {...hl}, w: 540, x: 10, y: 28, dy: 46}) + VZ.cells(a, {x: 20, y: 222, s: Math.min(40, 520 / n), hl: {...sorted, ...hl}, fade: t => t >= hs && !hl[t]}))}); };
    const heapify = i => { const l = 2 * i + 1, r = 2 * i + 2; let lg = i; if (l < hs && a[l] > a[lg]) lg = l; if (r < hs && a[r] > a[lg]) lg = r;
      const hl = {[i]: 'cur'}; if (l < hs) hl[l] = 'bad'; if (r < hs) hl[r] = 'bad';
      fr(`MAX-HEAPIFY(A, ${i + 1}): compare A[${i + 1}] = ${a[i]} with its children${l < hs ? ` A[${l + 1}] = ${a[l]}` : ''}${r < hs ? `, A[${r + 1}] = ${a[r]}` : ''}${l >= hs ? ' (none: it is a leaf)' : ''}.`, [1, 2], hl);
      if (lg !== i){ [a[i], a[lg]] = [a[lg], a[i]]; swaps++; fr(`Largest is A[${lg + 1}]: exchange, then float down from position ${lg + 1}.`, [4, 5], {[i]: 'good', [lg]: 'cur'}); heapify(lg); }
      else fr(`A[${i + 1}] is ≥ its children: the max-heap property holds here, stop.`, 3, {[i]: 'cy'}); };
    fr(`Start with an arbitrary array (n = ${n}). Positions ⌊n/2⌋+1..n = ${Math.floor(n / 2) + 1}..${n} are leaves, which are already 1-element heaps.`, 6);
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--){ fr(`BUILD-MAX-HEAP: i = ${i + 1}. Invariant: every node after i is the root of a max-heap.`, 7, {[i]: 'cur'}); heapify(i); }
    fr(`Max-heap built with ${swaps} exchanges. The maximum, ${a[0]}, is at the root. Build costs O(n), not O(n lg n): most nodes are near the bottom and sink only a little.`, 8, {0: 'good'});
    if (o.mode === 'sort') for (let i = n - 1; i >= 1; i--){ [a[0], a[i]] = [a[i], a[0]]; swaps++; hs--; fr(`Move the max ${a[i]} to A[${i + 1}] and shrink the heap to size ${hs}.`, 12, {[i]: 'good', 0: 'cur'}); heapify(0); }
    if (o.mode === 'sort'){ hs = 0; fr(`Sorted in place: ${swaps} exchanges total. HEAPSORT is Θ(n lg n) in every case, Θ(1) extra space, not stable.`, 11); }
    return F;
  }
};
DEEP.t09 = {
  viz: ['heap'],
  cx: [['MAX-HEAPIFY', 'Θ(1)', 'O(lg n)', 'Θ(lg n)', 'Θ(1) iterative', 'floats down one path of height ⌊lg n⌋'], ['BUILD-MAX-HEAP', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'Θ(1)', 'Σ (nodes at height h)·O(h) = O(n Σ h/2<sup>h</sup>) = O(n)'], ['HEAPSORT', 'Θ(n lg n)*', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(1), in place', 'n − 1 extractions × O(lg n); not stable'], ['MAX-HEAP-INSERT', 'Θ(1)', 'O(lg n)', 'Θ(lg n)', 'Θ(1)', 'add at the end, then float up'], ['HEAP-MAXIMUM', 'Θ(1)', 'Θ(1)', 'Θ(1)', '—', 'it is A[1]'], ['HEAP-EXTRACT-MAX', 'Θ(lg n)', 'Θ(lg n)', 'Θ(lg n)', 'Θ(1)', 'move last to root, MAX-HEAPIFY'], ['HEAP-INCREASE-KEY', 'Θ(1)', 'O(lg n)', 'Θ(lg n)', 'Θ(1)', 'float up toward the root']],
  cxNote: '*With distinct keys, heapsort\'s best case is still Θ(n lg n).',
  deep: [
    ['Index arithmetic and the shape of a heap', `<ul class="clean"><li>PARENT(i) = ⌊i/2⌋, LEFT(i) = 2i, RIGHT(i) = 2i + 1 (1-indexed). With 0-indexing: (i−1)/2, 2i+1, 2i+2.</li><li>A heap is a <b>nearly complete</b> binary tree: every level is full except possibly the last, filled left to right. So its height is ⌊lg n⌋.</li><li>Leaves are exactly positions ⌊n/2⌋+1 … n. That is why BUILD-MAX-HEAP starts at ⌊n/2⌋.</li><li>A sorted (descending) array is a max-heap, but a max-heap is usually not sorted: siblings have no order.</li></ul>`],
    ['Why BUILD-MAX-HEAP is linear', `<p>A node at height h costs O(h) to heapify, and there are at most ⌈n / 2<sup>h+1</sup>⌉ nodes at height h. So the total is</p><p class="math" style="text-align:center">Σ<sub>h=0</sub><sup>⌊lg n⌋</sup> ⌈n / 2<sup>h+1</sup>⌉ · O(h) = O(n · Σ h / 2<sup>h</sup>) = O(n · 2) = O(n).</p><p>Intuition: half the nodes are leaves (cost 0), a quarter sink at most 1 level, an eighth at most 2… The few nodes that sink far are near the top. Inserting the n elements one at a time would cost Θ(n lg n) in the worst case instead.</p>`],
    ['Priority queues built on a heap', `<pre><code><span class="fn">MAX-HEAP-INSERT</span>(A, key, n)          <span class="fn">HEAP-INCREASE-KEY</span>(A, i, key)
  A.heap-size = A.heap-size + 1          <span class="kw">if</span> key &lt; A[i] <span class="kw">error</span>
  A[A.heap-size] = −∞                    A[i] = key
  HEAP-INCREASE-KEY(A, A.heap-size, key)  <span class="kw">while</span> i &gt; 1 and A[PARENT(i)] &lt; A[i]
                                             exchange A[i], A[PARENT(i)]
                                             i = PARENT(i)</code></pre><p>Uses later in the course: Huffman coding (Topic 13), Prim's MST and Dijkstra (min-priority queues with DECREASE-KEY, Topics 17–18), event-driven simulation and job scheduling. In practice you also keep a map from object to heap index so DECREASE-KEY can find its element in O(1).</p>`],
    ['Heapsort vs the other n lg n sorts', `${vzTbl(['', 'Heapsort', 'Merge sort', 'Quicksort (randomized)'], [['Worst case', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n²) (rare)'], ['Expected', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n lg n), small constants'], ['Extra space', 'Θ(1)', 'Θ(n)', 'Θ(lg n) expected stack'], ['Stable', 'no', 'yes', 'no'], ['Cache behaviour', 'poor (jumps around)', 'good (sequential)', 'very good']])}<p>Heapsort is the one that is both in place and guaranteed Θ(n lg n), which is why introsort falls back to it when quicksort recurses too deep.</p>`]
  ]
};

// ---- t08: binary search trees ----
const bstNode = (k, p = null) => ({k, l: null, r: null, p});
VIZ.bst = {
  title: 'Step-through: BST insert, search and delete', hint: 'Keys are inserted left to right. Then one key is searched for and one is deleted, covering whichever TREE-DELETE case applies.',
  code: ['TREE-INSERT(T, z)', '  y = NIL;  x = T.root', '  while x ≠ NIL:  y = x;  x = (z.key < x.key) ? x.left : x.right', '  z.p = y;  make z the root, y.left or y.right', 'TREE-SEARCH(x, k)', '  while x ≠ NIL and k ≠ x.key:  x = (k < x.key) ? x.left : x.right', '  return x', 'TREE-DELETE(T, z)', '  if z.left == NIL:  TRANSPLANT(T, z, z.right)', '  elseif z.right == NIL:  TRANSPLANT(T, z, z.left)', '  else y = TREE-MINIMUM(z.right)      // successor', '      if y ≠ z.right:  TRANSPLANT(T, y, y.right);  y.right = z.right', '      TRANSPLANT(T, z, y);  y.left = z.left'],
  opts: [{id: 'del', label: 'Delete', val: 'root', choices: [['root', 'the root'], ['rand', 'a random key']]}],
  input: () => shuffle(Array.from({length: 40}, (_, i) => i + 1)).slice(0, 9), parse: s => { const a = vzArr(s, 0, 99, 14); if (new Set(a).size !== a.length) throw new Error('keys must be distinct'); return a; },
  run(keys, o){
    let root = null; const F = [];
    const view = (hl = new Map()) => { const cp = n => n && {k: n.k, c: hl.get(n) || 'acc', l: cp(n.l), r: cp(n.r)}; return VZ.wrap(560, 300, VZ.tree(cp(root), {x: 10, w: 540, y: 30, dy: 52})); };
    const h = n => n ? 1 + Math.max(h(n.l), h(n.r)) : 0;
    const fr = (msg, line, hl) => F.push({msg, line, svg: view(hl), side: `<p class="stat-label">height = <b>${Math.max(0, h(root) - 1)}</b> · lg n ≈ ${Math.log2(Math.max(1, keys.length)).toFixed(1)}</p>`});
    fr('Empty tree. BST property: keys in x\'s left subtree ≤ x.key ≤ keys in its right subtree.', 0);
    for (const k of keys){ const z = bstNode(k); let y = null, x = root; const path = new Map();
      while (x){ y = x; path.set(x, 'cy'); x = k < x.k ? x.l : x.r; }
      z.p = y; if (!y) root = z; else if (k < y.k) y.l = z; else y.r = z; path.set(z, 'good');
      fr(`Insert ${k}: walk down ${path.size - 1} node${path.size === 2 ? '' : 's'} (cyan) and attach it as a new leaf. Cost O(h).`, [2, 3], path); }
    const target = pick(keys); { let x = root; const path = new Map(); while (x && x.k !== target){ path.set(x, 'cy'); x = target < x.k ? x.l : x.r; } path.set(x, 'cur'); fr(`TREE-SEARCH for ${target}: ${path.size} comparisons, following one root-to-node path.`, 5, path); }
    const mn = n => { while (n.l) n = n.l; return n; };
    { let x = root; const s = new Map(); while (x.l){ s.set(x, 'cy'); x = x.l; } s.set(x, 'cur'); fr(`TREE-MINIMUM: keep going left → ${x.k}. (Maximum: keep going right.)`, undefined, s); }
    const z = o.del === 'root' ? root : (() => { let want = pick(keys), x = root; while (x.k !== want) x = want < x.k ? x.l : x.r; return x; })();
    const tp = (u, v) => { if (!u.p) root = v; else if (u === u.p.l) u.p.l = v; else u.p.r = v; if (v) v.p = u.p; };
    if (!z.l){ fr(`Delete ${z.k}: it has no left child, so replace it by its right subtree.`, 8, new Map([[z, 'bad']])); tp(z, z.r); fr(`TRANSPLANT done.`, 8); }
    else if (!z.r){ fr(`Delete ${z.k}: it has no right child, so replace it by its left subtree.`, 9, new Map([[z, 'bad']])); tp(z, z.l); fr(`TRANSPLANT done.`, 9); }
    else { const y = mn(z.r); fr(`Delete ${z.k}: two children. Its successor y = ${y.k} is the minimum of the right subtree (it has no left child).`, 10, new Map([[z, 'bad'], [y, 'cur']]));
      if (y !== z.r){ tp(y, y.r); y.r = z.r; y.r.p = y; fr(`y is deeper than z.right: splice y out (its right child takes its place), then hang z's right subtree under y.`, 11, new Map([[z, 'bad'], [y, 'cur']])); }
      tp(z, y); y.l = z.l; y.l.p = y; fr(`y takes z's place and adopts z's left subtree. In-order order is preserved.`, 12, new Map([[y, 'good']])); }
    const ino = []; const walk = n => { if (n){ walk(n.l); ino.push(n.k); walk(n.r); } }; walk(root);
    fr(`In-order walk prints the keys in sorted order: ${ino.join(', ')}. Every operation here was O(h); a random insertion order keeps h ≈ O(lg n) in expectation, but sorted input makes h = n − 1.`, undefined);
    return F;
  }
};
DEEP.t08 = {
  viz: ['bst'],
  cx: [['SEARCH, MIN, MAX', 'Θ(1)', 'O(lg n)*', 'Θ(n)', 'Θ(1) iterative', 'one root-to-leaf path: O(h)'], ['SUCCESSOR / PREDECESSOR', 'Θ(1)', 'O(lg n)*', 'Θ(n)', 'Θ(1)', 'leftmost of right subtree, or first ancestor reached from the left'], ['INSERT', 'Θ(1)', 'O(lg n)*', 'Θ(n)', 'Θ(1)', 'search for the spot, attach a leaf'], ['DELETE', 'Θ(1)', 'O(lg n)*', 'Θ(n)', 'Θ(1)', 'TRANSPLANT is O(1); finding the successor is O(h)'], ['INORDER-TREE-WALK', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'Θ(h) stack', 'each node visited once'], ['Build by n inserts', 'Θ(n lg n)', 'Θ(n lg n)*', 'Θ(n²)', 'Θ(n)', 'sorted input gives a path']],
  cxNote: '*Expected height of a BST built from a random permutation is O(lg n). Balanced trees (Topic 11) guarantee O(lg n) in the worst case.',
  deep: [
    ['Successor without comparing keys', `<pre><code><span class="fn">TREE-SUCCESSOR</span>(x)
  <span class="kw">if</span> x.right ≠ NIL
      <span class="kw">return</span> TREE-MINIMUM(x.right)     <span class="cm">// leftmost node of the right subtree</span>
  y = x.p
  <span class="kw">while</span> y ≠ NIL and x == y.right       <span class="cm">// climb until we come up from a left child</span>
      x = y;  y = y.p
  <span class="kw">return</span> y</code></pre><p>It uses only the tree's shape, so it works even with duplicate keys. Calling MINIMUM then SUCCESSOR n − 1 times visits every node in Θ(n) total, since each edge is traversed at most twice.</p>`],
    ['The three delete cases, and why the successor', `<ol><li><b>No left child:</b> replace z by its right child (possibly NIL).</li><li><b>No right child:</b> replace z by its left child.</li><li><b>Two children:</b> the successor y is the smallest key larger than z, so putting it in z's place keeps everything on the left smaller and everything on the right larger. y has no left child, so removing it from its old spot is case 1.</li></ol><p>CLRS uses TRANSPLANT(T, u, v) to replace the subtree rooted at u with the one rooted at v, fixing the parent pointer. It does not touch v's children; the caller does that.</p>`],
    ['Height is everything', `<ul class="clean"><li>All operations are O(h). h ranges from ⌊lg n⌋ (perfectly balanced) to n − 1 (a path).</li><li>Inserting sorted keys builds a path, so the tree degenerates into a linked list with Θ(n) operations.</li><li>For a random permutation the expected height is O(lg n) (CLRS proves this with random variables like those in Topic 5A). But you rarely control insertion order, which motivates red-black trees (Topic 11).</li></ul>`],
    ['Tree walks', `${vzTbl(['Walk', 'Order', 'Use'], [['Inorder', 'left, node, right', 'prints keys sorted; Θ(n)'], ['Preorder', 'node, left, right', 'copying/serializing a tree'], ['Postorder', 'left, right, node', 'freeing memory, evaluating expression trees']])}<p>Proof that inorder is Θ(n): T(n) = T(k) + T(n − k − 1) + d; substitution with T(n) ≤ (c + d)n + c works for any split k.</p>`],
    ['BST vs heap', `<p>Both are binary trees with an ordering rule, but different ones. A heap only orders parent vs child (good for "give me the max"); a BST orders left vs right (good for search, successor, range queries, sorted output). Turning a heap into sorted order costs Θ(n lg n); a BST gives it with a Θ(n) walk.</p>`]
  ]
};

// ---- t05a: probabilistic analysis (hiring problem) ----
VIZ.hire = {
  title: 'Step-through: the hiring problem', hint: 'Candidates arrive in random order; we hire whenever someone beats the best so far. Expected hires = Hₙ = 1 + 1/2 + … + 1/n ≈ ln n.',
  code: ['HIRE-ASSISTANT(n)', '  best = 0            // dummy candidate 0 is worst', '  for i = 1 to n', '      interview candidate i', '      if candidate i is better than best', '          best = i', '          hire candidate i'],
  opts: [{id: 'n', label: 'n', val: '10', fresh: true, choices: [['6', '6'], ['10', '10'], ['14', '14']]}, {id: 'ord', label: 'Order', val: 'rand', fresh: true, choices: [['rand', 'random permutation'], ['inc', 'increasing (worst)'], ['dec', 'decreasing (best)']]}],
  input: o => { const n = +o.n, a = Array.from({length: n}, (_, i) => i + 1); return o.ord === 'inc' ? a : o.ord === 'dec' ? a.reverse() : shuffle(a); },
  parse: s => { const a = vzArr(s, 1, 99, 14); if (new Set(a).size !== a.length) throw new Error('ranks must be distinct'); return a; },
  run(a){
    const n = a.length, F = [], hired = {}; let best = -1, hires = 0; const H = Array.from({length: n}, (_, i) => 1 / (i + 1)).reduce((x, y) => x + y, 0);
    const fr = (msg, line, i) => F.push({msg, line, svg: VZ.wrap(560, 240, VZ.bars(a, {x: 10, y: 20, w: 540, h: 160, hl: {...hired, ...(i !== undefined ? {[i]: hired[i] ? 'good' : 'bad'} : {})}, fade: t => i !== undefined && t > i, ptr: i !== undefined ? {i} : {}})),
      side: `<p>Hires so far: <b>${hires}</b></p><p class="stat-label">E[hires] = H<sub>${n}</sub> = ${H.toFixed(2)} · worst case n = ${n} · best case 1</p><p class="stat-label">Candidate i is hired with probability 1/i: it must be the best of the first i.</p>`});
    fr('Bar height = quality rank. Each hire costs c<sub>h</sub> (expensive); each interview costs c<sub>i</sub>. Total cost O(c<sub>i</sub> n + c<sub>h</sub> m) where m = number of hires.', 1);
    a.forEach((v, i) => { if (best < 0 || v > a[best]){ best = i; hires++; hired[i] = 'good'; fr(`Candidate ${i + 1} (rank ${v}) beats everyone before: <b>hire</b>. P(this) = 1/${i + 1}.`, [4, 5, 6], i); } else fr(`Candidate ${i + 1} (rank ${v}) is worse than the best so far (${a[best]}): no hire.`, 4, i); });
    fr(`Done: ${hires} hire${hires > 1 ? 's' : ''}. Indicator variables: X = Σ X<sub>i</sub>, E[X] = Σ 1/i = H<sub>n</sub> = ln n + O(1) ≈ ${H.toFixed(2)}. Try a few random orders and compare.`, undefined);
    return F;
  }
};
DEEP.t05a = {
  viz: ['hire'],
  cxHead: ['Quantity', 'Value', 'Method'],
  cx: [['Hires, worst case', 'n', 'candidates arrive in increasing quality'], ['Hires, expected (random order)', 'Hₙ = ln n + O(1)', 'indicator X<sub>i</sub> = I{candidate i hired}, E[X<sub>i</sub>] = 1/i'], ['Hiring cost, expected', 'O(c<sub>h</sub> ln n)', 'versus O(c<sub>h</sub> n) worst case'], ['RANDOMIZE-IN-PLACE', 'Θ(n) time', 'swap A[i] with A[RANDOM(i, n)]: every permutation equally likely'], ['Birthday paradox', '≈ √(2n ln 2) people for a 50% match; ≈ 23 when n = 365', 'complement probability or indicator pairs'], ['Balls into bins (coupon collector)', '≈ n ln n tosses to fill all n bins', 'sum of geometric waiting times'], ['Longest streak of heads in n flips', 'Θ(lg n)', 'bound the probability of a streak of length ≥ k']],
  deep: [
    ['Indicator random variables: the one trick', `<p>For an event A, I{A} = 1 if A happens, 0 otherwise. Then <b>E[I{A}] = Pr{A}</b>. To count how many times something happens, write the count as a sum of indicators and use <b>linearity of expectation</b>, which holds even when the events are dependent:</p><p class="math" style="text-align:center">E[X] = E[Σ X<sub>i</sub>] = Σ E[X<sub>i</sub>] = Σ Pr{event i}</p><p>Example: expected number of fixed points of a random permutation. X<sub>i</sub> = I{π(i) = i}, Pr = 1/n, so E[X] = n · 1/n = 1, no matter how big n is.</p>`],
    ['Probabilistic analysis vs randomized algorithms', `<ul class="clean"><li><b>Probabilistic analysis</b> assumes the <i>input</i> is random (e.g. candidates in uniformly random order). The bound is only as good as that assumption.</li><li>A <b>randomized algorithm</b> makes its own random choices (shuffle first, or a random pivot). Now the expectation is over the algorithm's coins and holds for <b>every</b> input; no input is always bad.</li><li>That is why RANDOMIZED-HIRE-ASSISTANT shuffles first and randomized quicksort (Topic 5B) picks a random pivot.</li></ul>`],
    ['Shuffling correctly', `<pre><code><span class="fn">RANDOMIZE-IN-PLACE</span>(A, n)
  <span class="kw">for</span> i = 1 <span class="kw">to</span> n
      swap A[i] with A[RANDOM(i, n)]</code></pre><p><b>Invariant:</b> before iteration i, each possible (i−1)-permutation appears in A[1..i−1] with probability (n − i + 1)!/n!. At termination that is 1/n! for each full permutation. A common bug, RANDOM(1, n) instead of RANDOM(i, n), produces nⁿ equally likely outcomes, which is not divisible by n!, so some permutations must be more likely than others.</p>`],
    ['Harmonic numbers and logs', `<p>Hₙ = Σ<sub>k=1</sub><sup>n</sup> 1/k. Bounding the sum by integrals gives ln(n + 1) ≤ Hₙ ≤ ln n + 1, so Hₙ = Θ(lg n). This sum shows up again in randomized quicksort (Topic 5B) and in the expected depth of a random BST.</p>`]
  ]
};

// ---- t05b: randomized quicksort ----
VIZ.qsort = {
  title: 'Step-through: randomized quicksort (Lomuto partition)', hint: 'Yellow = pivot (randomly chosen, then swapped to the end). Cyan = region ≤ pivot (A[p..i]); red = region > pivot (A[i+1..j−1]); faded = not in this call.',
  code: ['RANDOMIZED-QUICKSORT(A, p, r)', '  if p < r', '      q = RANDOMIZED-PARTITION(A, p, r)', '      RANDOMIZED-QUICKSORT(A, p, q − 1)', '      RANDOMIZED-QUICKSORT(A, q + 1, r)', 'RANDOMIZED-PARTITION(A, p, r)', '  i = RANDOM(p, r);  exchange A[r] with A[i]', '  x = A[r];  i = p − 1', '  for j = p to r − 1', '      if A[j] ≤ x', '          i = i + 1;  exchange A[i] with A[j]', '  exchange A[i + 1] with A[r];  return i + 1'],
  opts: [{id: 'piv', label: 'Pivot', val: 'rand', choices: [['rand', 'random (randomized)'], ['last', 'always last (deterministic)']]}],
  input: () => vzRand(9, 1, 50), parse: s => vzArr(s, 0, 99, 12),
  run(a, o){
    a = a.slice(); const F = [], fixed = {}; let cmp = 0;
    const fr = (msg, line, p, r, hl = {}) => F.push({msg, line, side: `<p class="stat-label">Comparisons: <b>${cmp}</b> · worst case n(n−1)/2 = ${a.length * (a.length - 1) / 2} · expected ≈ 2n ln n = ${Math.round(2 * a.length * Math.log(a.length))}</p>`,
      svg: VZ.wrap(560, 230, VZ.bars(a, {x: 10, y: 20, w: 540, h: 150, hl: {...fixed, ...hl}, fade: t => (t < p || t > r) && !fixed[t]}))});
    const qs = (p, r) => { if (p > r) return; if (p === r){ fixed[p] = 'good'; fr(`A[${p + 1}] alone is in its final place.`, 1, p, r); return; }
      const pi = o.piv === 'rand' ? rnd(p, r) : r; fr(`Partition A[${p + 1}..${r + 1}]: pivot ${a[pi]} at position ${pi + 1}${pi !== r ? ', swap it to the end' : ''}.`, 6, p, r, {[pi]: 'cur'});
      [a[pi], a[r]] = [a[r], a[pi]]; const x = a[r]; let i = p - 1;
      for (let j = p; j < r; j++){ cmp++; const le = a[j] <= x; if (le){ i++; [a[i], a[j]] = [a[j], a[i]]; }
        const hl = {[r]: 'cur'}; for (let t = p; t <= i; t++) hl[t] = 'cy'; for (let t = i + 1; t <= j; t++) hl[t] = 'bad';
        fr(`j = ${j + 1}: A[j] = ${le ? a[i] : a[j]} ${le ? '≤' : '>'} ${x}${le ? ` → grow the ≤ region (i = ${i + 1}) and swap it in` : ' → leave it in the > region'}.`, le ? [9, 10] : 9, p, r, hl); }
      [a[i + 1], a[r]] = [a[r], a[i + 1]]; fixed[i + 1] = 'good';
      fr(`Put the pivot between the regions at q = ${i + 2}. It is now in its <b>final</b> position. Recurse on sizes ${i + 1 - p} and ${r - i - 1}.`, 11, p, r);
      qs(p, i); qs(i + 2, r); };
    fr('Start.', 0, 0, a.length - 1); qs(0, a.length - 1);
    fr(`Sorted with ${cmp} comparisons. Any two elements are compared at most once, only when one of them is the first pivot chosen from the range between them.`, undefined, 0, a.length - 1);
    return F;
  }
};
DEEP.t05b = {
  viz: ['qsort'],
  cx: [['RANDOMIZED-QUICKSORT', 'Θ(n lg n)', 'Θ(n lg n) expected', 'Θ(n²) (very unlikely)', 'Θ(lg n) expected stack', 'expected comparisons < 2n ln n ≈ 1.39 n lg n'], ['QUICKSORT, pivot = last', 'Θ(n lg n)', 'Θ(n lg n) on random input', 'Θ(n²) on sorted input', 'Θ(n) stack worst', 'sorted or reverse-sorted input always splits n−1 / 0'], ['PARTITION (n elements)', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'Θ(1)', 'exactly n − 1 comparisons'], ['Constant-ratio splits (e.g. 9:1)', 'Θ(n lg n)', '', '', '', 'recursion depth log<sub>10/9</sub> n = Θ(lg n)']],
  deep: [
    ['Expected comparisons: the indicator-variable proof', `<p>Rename the elements z₁ &lt; z₂ &lt; … &lt; zₙ by rank. z<sub>i</sub> and z<sub>j</sub> are compared iff one of them is the <b>first</b> pivot chosen from Z<sub>ij</sub> = {z<sub>i</sub>, …, z<sub>j</sub>}. If a pivot strictly between them comes first, they are split apart forever. Every element of Z<sub>ij</sub> is equally likely to be first, so</p><p class="math" style="text-align:center">Pr{z<sub>i</sub> compared with z<sub>j</sub>} = 2 / (j − i + 1)</p><p class="math" style="text-align:center">E[X] = Σ<sub>i&lt;j</sub> 2/(j − i + 1) &lt; Σ<sub>i</sub> Σ<sub>k=1</sub><sup>n</sup> 2/k = O(n lg n).</p><p>Running time is O(n + X), so the expected time is O(n lg n) on <b>every</b> input.</p>`],
    ['Worst and best splits by recurrence', `<ul class="clean"><li><b>Worst:</b> T(n) = T(n − 1) + Θ(n) = Θ(n²), when every pivot is the min or max.</li><li><b>Best:</b> T(n) = 2T(n/2) + Θ(n) = Θ(n lg n).</li><li><b>Any constant ratio</b>, even 99:1, gives Θ(n lg n): the recursion tree has depth log<sub>100/99</sub> n = Θ(lg n) and each level costs at most cn.</li><li>Alternating good and bad splits still gives Θ(n lg n): a bad split followed by a good one costs about the same as one good split.</li></ul>`],
    ['Equal keys and the three-way partition', `<p>With Lomuto partition, an array of all-equal keys puts everything in the ≤ side every time: Θ(n²) even with random pivots. A three-way partition into &lt; x, = x and &gt; x (Problem Set 5) recurses only on the strict sides, so all-equal input takes Θ(n).</p>`],
    ['Why quicksort wins in practice', `<p>It sorts in place, scans memory sequentially (cache friendly), and its inner loop is tiny. Libraries add small tweaks: insertion sort below ~16 elements, median-of-three pivots, recursing on the smaller side first to keep the stack O(lg n), and falling back to heapsort if recursion gets too deep (introsort).</p>`]
  ]
};

// ---- t06: hash tables ----
VIZ.hash = {
  title: 'Step-through: chaining vs open addressing', hint: 'Same keys, same table size m = 11. Left: chaining with h(k) = k mod 11. Right: open addressing with the probe sequence you choose.',
  code: o => ['CHAINED-HASH-INSERT(T, x)', '  insert x at the head of list T[h(x.key)]', '', 'HASH-INSERT(T, k)        // open addressing', '  for i = 0 to m − 1', `      q = ${o.probe === 'lin' ? '(h1(k) + i) mod m' : o.probe === 'quad' ? '(h1(k) + i + 3i²) mod m' : '(h1(k) + i·h2(k)) mod m'}`, '      if T[q] == NIL', '          T[q] = k;  return q', '  error "hash table overflow"', '', `h1(k) = k mod 11${o.probe === 'dbl' ? ',  h2(k) = 1 + (k mod 10)' : ''}`],
  opts: [{id: 'probe', label: 'Probing', val: 'lin', choices: [['lin', 'linear'], ['quad', 'quadratic (c₁=1, c₂=3)'], ['dbl', 'double hashing']]}],
  input: () => shuffle(Array.from({length: 99}, (_, i) => i + 1)).slice(0, 8), parse: s => { const a = vzArr(s, 0, 999, 10); if (new Set(a).size !== a.length) throw new Error('keys must be distinct'); return a; },
  run(keys, o){
    const m = 11, ch = Array.from({length: m}, () => []), oa = Array(m).fill(null), F = []; let probes = 0;
    const q = (k, i) => o.probe === 'lin' ? (k % m + i) % m : o.probe === 'quad' ? (k % m + i + 3 * i * i) % m : (k % m + i * (1 + k % 10)) % m;
    const draw = (hlC, hlO, tried = []) => { let g = D.text(10, 16, 'Chaining', 12, C.mut, 'start', 600) + D.text(330, 16, 'Open addressing', 12, C.mut, 'start', 600);
      for (let s = 0; s < m; s++){ const y = 26 + s * 25; g += D.text(22, y + 16, s, 11, C.dim, 'end') + `<rect x="28" y="${y}" width="26" height="21" rx="4" fill="${hlC === s ? C.warn + '44' : '#111827'}" stroke="${hlC === s ? C.warn : 'rgba(255,255,255,.18)'}"/>`;
        ch[s].forEach((k, t) => { const X = 64 + t * 52; g += D.line(X - 10, y + 10, X, y + 10, C.dim, 1.5) + `<rect x="${X}" y="${y}" width="42" height="21" rx="5" fill="${C.cy}22" stroke="${C.cy}"/>` + D.text(X + 21, y + 15, k, 11.5, '#fff', 'middle', 700); });
        const st = hlO === s ? 'good' : tried.includes(s) ? 'bad' : ''; g += D.text(342, y + 16, s, 11, C.dim, 'end') + `<rect x="348" y="${y}" width="60" height="21" rx="4" fill="${st ? vcol(st) + '44' : '#111827'}" stroke="${st ? vcol(st) : 'rgba(255,255,255,.18)'}"/>` + D.text(378, y + 15, oa[s] ?? '', 11.5, '#fff', 'middle', 700); }
      return VZ.wrap(560, 310, g); };
    const lens = () => `<p class="stat-label">n = ${keys.filter((_, i) => i < F.length).length}, m = 11, load factor α = n/m. Longest chain: <b>${Math.max(...ch.map(c => c.length))}</b> · total probes (open addressing): <b>${probes}</b></p>`;
    F.push({svg: draw(), msg: 'Empty tables, m = 11 slots each.', line: 0});
    keys.forEach((k, idx) => { const h = k % m; ch[h].unshift(k);
      const tried = []; let slot = null; for (let i = 0; i < m; i++){ const s = q(k, i); probes++; if (oa[s] === null){ oa[s] = k; slot = s; break; } tried.push(s); }
      F.push({svg: draw(h, slot, tried), line: [1, 5, 7], side: lens(), msg: `Insert ${k}: h(${k}) = ${h}. Chaining: prepend to list ${h} in O(1). Open addressing: ${tried.length ? `slot${tried.length > 1 ? 's' : ''} ${tried.join(', ')} taken (red), ` : ''}${slot === null ? 'no free slot found!' : `placed in slot ${slot} after ${tried.length + 1} probe${tried.length ? 's' : ''}`}. α = ${idx + 1}/11 = ${((idx + 1) / 11).toFixed(2)}.`}); });
    F.push({svg: draw(), side: lens(), tag: 'done', msg: `Expected cost with α = ${(keys.length / m).toFixed(2)}: chaining search Θ(1 + α); open addressing unsuccessful search ≤ 1/(1 − α) = ${(1 / (1 - keys.length / m)).toFixed(1)} probes. ${o.probe === 'lin' ? 'Notice the runs of occupied slots: linear probing suffers from primary clustering.' : ''}`});
    return F;
  }
};
DEEP.t06 = {
  viz: ['hash'],
  cx: [['Chaining: INSERT', 'Θ(1)', 'Θ(1)', 'Θ(1)', 'Θ(n + m)', 'prepend (assumes the key is not already present)'], ['Chaining: SEARCH', 'Θ(1)', 'Θ(1 + α)', 'Θ(n)', '', 'all keys in one chain'], ['Chaining: DELETE', 'Θ(1)', 'Θ(1)', 'Θ(1)', '', 'given a pointer, with doubly linked chains'], ['Open addressing: unsuccessful search / insert', 'Θ(1)', '≤ 1/(1 − α)', 'Θ(n)', 'Θ(m)', 'α must stay below 1'], ['Open addressing: successful search', 'Θ(1)', '≤ (1/α) ln(1/(1 − α))', 'Θ(n)', '', 'α = 0.5 → < 1.39 probes; α = 0.9 → < 2.56'], ['Direct-address table', 'Θ(1)', 'Θ(1)', 'Θ(1)', 'Θ(|U|)', 'only when the universe of keys is small']],
  cxNote: 'Averages assume independent uniform hashing (CLRS 4e terminology). With α = n/m kept constant (resize when it grows), every operation is expected O(1).',
  deep: [
    ['Choosing a hash function', `<ul class="clean"><li><b>Division:</b> h(k) = k mod m. Pick m prime and not close to a power of 2; m = 2<sup>p</sup> would just keep the low p bits.</li><li><b>Multiplication:</b> h(k) = ⌊m (kA mod 1)⌋ with 0 &lt; A &lt; 1 (Knuth suggests A ≈ (√5 − 1)/2). m can be a power of 2, and the computation is a multiply and a shift.</li><li><b>Random (universal) hashing:</b> choose h at random from a family where any two keys collide with probability ≤ 1/m. Then no fixed input is bad every time, the same idea as randomized quicksort.</li></ul>`],
    ['Why chaining search is Θ(1 + α)', `<p>Under independent uniform hashing each key lands in each of the m slots with probability 1/m, so the expected chain length is n/m = α. An unsuccessful search computes h (Θ(1)) and walks a whole chain (expected α). A successful search walks about half of a chain plus the element itself: 1 + α/2 − α/(2n) = Θ(1 + α). If m = Θ(n), α = O(1) and everything is constant time.</p>`],
    ['Probe sequences and clustering', `${vzTbl(['Probing', 'Sequence h(k, i)', 'Distinct sequences', 'Problem'], [['Linear', '(h₁(k) + i) mod m', 'm', 'primary clustering: long runs grow and merge'], ['Quadratic', '(h₁(k) + c₁i + c₂i²) mod m', 'm', 'secondary clustering: same h₁ ⇒ same sequence'], ['Double hashing', '(h₁(k) + i·h₂(k)) mod m', 'Θ(m²)', 'h₂(k) must be relatively prime to m']])}<p>Deleting in open addressing cannot just set a slot to NIL (it would cut probe sequences); mark it DELETED instead, which is why chaining is preferred when deletions are frequent.</p>`],
    ['Where the 1/(1 − α) bound comes from', `<p>In an unsuccessful search, the first probe hits an occupied slot with probability α, the second (given the first was occupied) with probability less than α again, and so on. The expected number of probes is at most 1 + α + α² + … = 1/(1 − α). Half full: ≤ 2 probes; 90% full: ≤ 10. That's why tables are resized (usually doubled) once α passes a threshold, giving O(1) amortized insertion.</p>`]
  ]
};

// ---- t11: red-black trees ----
VIZ.rbt = {
  title: 'Step-through: red-black insertion with RB-INSERT-FIXUP', hint: 'Red nodes are red, black nodes are grey. Yellow marks z, the node currently being fixed. Watch which case applies: recolor (1), rotate to straighten (2), rotate and recolor (3).',
  code: ['RB-INSERT(T, z)', '  insert z as in a BST;  z.color = RED', '  RB-INSERT-FIXUP(T, z)', 'RB-INSERT-FIXUP(T, z)', '  while z.p.color == RED', '      y = uncle of z', '      if y.color == RED                       // case 1', '          z.p, y = BLACK;  z.p.p = RED;  z = z.p.p', '      else if z is an "inner" grandchild      // case 2', '          z = z.p;  ROTATE(T, z) outward', '      else                                    // case 3', '          z.p = BLACK;  z.p.p = RED;  ROTATE(T, z.p.p)', '  T.root.color = BLACK'],
  opts: [{id: 'ord', label: 'Keys', val: 'rand', fresh: true, choices: [['rand', 'random'], ['inc', 'increasing 1..10 (kills a plain BST)']]}],
  input: o => o.ord === 'inc' ? Array.from({length: 10}, (_, i) => i + 1) : shuffle(Array.from({length: 40}, (_, i) => i + 1)).slice(0, 10),
  parse: s => { const a = vzArr(s, 0, 99, 14); if (new Set(a).size !== a.length) throw new Error('keys must be distinct'); return a; },
  run(keys){
    let root = null; const F = []; let rot = 0;
    const red = n => n && n.red;
    const view = cur => { const cp = n => n && {k: n.k, c: n === cur ? 'cur' : n.red ? 'bad' : 'dim', l: cp(n.l), r: cp(n.r)}; return VZ.wrap(560, 300, VZ.tree(cp(root), {x: 10, w: 540, y: 30, dy: 50})); };
    const ht = n => n ? 1 + Math.max(ht(n.l), ht(n.r)) : 0, bh = n => { let b = 0; while (n){ if (!n.red) b++; n = n.l; } return b; };
    const fr = (msg, line, cur) => F.push({msg, line, svg: view(cur), side: `<p class="stat-label">height = <b>${Math.max(0, ht(root) - 1)}</b> (bound 2 lg(n+1) = ${(2 * Math.log2(F.length ? keys.length + 1 : 1)).toFixed(1)}) · black-height = <b>${bh(root)}</b> · rotations: <b>${rot}</b></p>`});
    const rotate = (x, left) => { const y = left ? x.r : x.l; if (left){ x.r = y.l; if (y.l) y.l.p = x; } else { x.l = y.r; if (y.r) y.r.p = x; }
      y.p = x.p; if (!x.p) root = y; else if (x === x.p.l) x.p.l = y; else x.p.r = y; if (left) y.l = x; else y.r = x; x.p = y; rot++; };
    fr('Rules: every node is red or black, the root is black, a red node has black children, and every root-to-NIL path has the same number of black nodes.', 0);
    for (const k of keys){
      let z = {k, red: true, l: null, r: null, p: null}, y = null, x = root; while (x){ y = x; x = k < x.k ? x.l : x.r; }
      z.p = y; if (!y) root = z; else if (k < y.k) y.l = z; else y.r = z;
      fr(`Insert ${k} as a red leaf. ${red(z.p) ? 'Its parent is red too: a red-red violation.' : 'Its parent is black, so nothing is violated.'}`, 1, z);
      while (red(z.p)){ const g = z.p.p, pl = z.p === g.l, u = pl ? g.r : g.l;
        if (red(u)){ z.p.red = false; u.red = false; g.red = true; fr(`Case 1: uncle ${u.k} is red. Recolor parent and uncle black, grandparent ${g.k} red, and move z up two levels.`, [6, 7], g); z = g; }
        else { if (z === (pl ? z.p.r : z.p.l)){ z = z.p; rotate(z, pl); fr(`Case 2: uncle is black and z is an inner grandchild. Rotate ${pl ? 'left' : 'right'} at the parent to turn it into case 3.`, [8, 9], z); }
          z.p.red = false; g.red = true; rotate(g, !pl); fr(`Case 3: recolor the parent black and the grandparent red, then rotate ${pl ? 'right' : 'left'} at the grandparent. The loop ends.`, [10, 11], z); } }
      if (root.red){ root.red = false; fr('Color the root black (this can only increase every black-height by 1).', 12); }
    }
    fr(`Done: ${keys.length} keys, height ${ht(root) - 1}, ${rot} rotations. A plain BST with the same insertion order would have height ${(() => { let r = null; const H = n => n ? 1 + Math.max(H(n.l), H(n.r)) : 0; for (const k of keys){ const z = {k}; if (!r){ r = z; continue; } let x = r; for (;;){ const s = k < x.k ? 'l' : 'r'; if (!x[s]){ x[s] = z; break; } x = x[s]; } } return H(r) - 1; })()}.`, undefined);
    return F;
  }
};
DEEP.t11 = {
  viz: ['rbt'],
  cx: [['SEARCH / MIN / MAX / SUCC', 'Θ(1)', 'Θ(lg n)', 'Θ(lg n)', 'Θ(1)', 'height ≤ 2 lg(n + 1)'], ['RB-INSERT', 'Θ(lg n)', 'Θ(lg n)', 'Θ(lg n)', 'Θ(1)', 'O(lg n) recolorings, at most 2 rotations'], ['RB-DELETE', 'Θ(lg n)', 'Θ(lg n)', 'Θ(lg n)', 'Θ(1)', 'at most 3 rotations'], ['LEFT/RIGHT-ROTATE', 'Θ(1)', 'Θ(1)', 'Θ(1)', 'Θ(1)', 'changes a constant number of pointers'], ['2-3-4 tree search/insert/delete', 'Θ(lg n)', 'Θ(lg n)', 'Θ(lg n)', 'Θ(1)', 'all leaves at the same depth; node splits on the way down']],
  deep: [
    ['Why the height is at most 2 lg(n + 1)', `<ol><li>Let bh(x) be the number of black nodes on any path from x down to a NIL (not counting x). By induction, the subtree at x has at least 2<sup>bh(x)</sup> − 1 internal nodes.</li><li>Red nodes can't have red children, so at least half the nodes on any root-to-leaf path are black: bh(root) ≥ h/2.</li><li>So n ≥ 2<sup>h/2</sup> − 1, which gives h ≤ 2 lg(n + 1) (Lemma 13.1).</li></ol>`],
    ['Red-black trees are 2-3-4 trees in disguise', `<p>Merge every red node into its black parent. Each black node plus its red children becomes one node with 2, 3 or 4 children, and all leaves end up at the same depth (the black-height). So:</p><ul class="clean"><li>Case 1 (recolor) = splitting a full 4-node and pushing its middle key up.</li><li>Cases 2–3 (rotations) = rearranging a 3-node into a balanced 4-node.</li><li>Black-height = height of the 2-3-4 tree.</li></ul><p>This is the easiest way to remember why the fixup cases look the way they do.</p>`],
    ['Rotations preserve the BST property', `<pre><code>        x                         y
       / \\     LEFT-ROTATE(x)    / \\
      α   y    ───────────►     x   γ
         / \\   ◄───────────    / \\
        β   γ  RIGHT-ROTATE(y) α   β</code></pre><p>In-order is α x β y γ both before and after. Only three pointer pairs change, so a rotation is O(1). It moves one subtree up a level and another down a level.</p>`],
    ['Why the fixup loop terminates in O(lg n)', `<p>Only case 1 continues the loop, and it moves z up two levels each time, so it runs at most O(lg n) times. Cases 2 and 3 do at most two rotations and then the loop stops (z's parent becomes black). Insert therefore does O(lg n) recolorings but only O(1) structural changes, which matters when rotations are expensive (e.g. augmented trees).</p>`]
  ]
};

// ======================= DEEP DIVES · MIDTERM 3 =======================
// ---- t10a: selection ----
VIZ.rselect = {
  title: 'Step-through: RANDOMIZED-SELECT (find the i-th smallest)', hint: 'Like quicksort, but after partitioning it recurses into only the side that contains the answer. Faded = discarded for good.',
  code: ['RANDOMIZED-SELECT(A, p, r, i)', '  if p == r  return A[p]', '  q = RANDOMIZED-PARTITION(A, p, r)', '  k = q − p + 1              // pivot\'s rank in A[p..r]', '  if i == k  return A[q]', '  elseif i < k  return RANDOMIZED-SELECT(A, p, q − 1, i)', '  else  return RANDOMIZED-SELECT(A, q + 1, r, i − k)'],
  opts: [{id: 'i', label: 'Find', val: 'med', choices: [['min', 'minimum (i = 1)'], ['med', 'median'], ['max', 'maximum (i = n)']]}],
  input: () => vzRand(11, 1, 60), parse: s => vzArr(s, 0, 99, 14),
  run(a, o){
    a = a.slice(); const n = a.length, F = []; let cmp = 0; const want = o.i === 'min' ? 1 : o.i === 'max' ? n : Math.floor((n + 1) / 2);
    const fr = (msg, line, p, r, hl = {}) => F.push({msg, line, side: `<p>Looking for rank <b>${want}</b> of ${n} (overall) · comparisons: <b>${cmp}</b></p><p class="stat-label">Expected total comparisons < 4n = ${4 * n}; sorting would need about n lg n = ${Math.round(n * Math.log2(n))}.</p>`,
      svg: VZ.wrap(560, 230, VZ.bars(a, {x: 10, y: 20, w: 540, h: 150, hl, fade: t => t < p || t > r}))});
    let p = 0, r = n - 1, i = want; fr(`Find the ${want === 1 ? 'minimum' : want === n ? 'maximum' : 'median'} (i = ${want}).`, 0, p, r);
    for (;;){
      if (p === r){ fr(`Only one element left: the answer is ${a[p]}.`, 1, p, r, {[p]: 'good'}); break; }
      const pi = rnd(p, r); fr(`Random pivot ${a[pi]} from A[${p + 1}..${r + 1}].`, 2, p, r, {[pi]: 'cur'});
      [a[pi], a[r]] = [a[r], a[pi]]; const x = a[r]; let s = p - 1; for (let j = p; j < r; j++){ cmp++; if (a[j] <= x){ s++; [a[s], a[j]] = [a[j], a[s]]; } }
      [a[s + 1], a[r]] = [a[r], a[s + 1]]; const q = s + 1, k = q - p + 1; const hl = {[q]: 'cur'}; for (let t = p; t < q; t++) hl[t] = 'cy'; for (let t = q + 1; t <= r; t++) hl[t] = 'bad';
      fr(`After partition the pivot sits at position ${q + 1}, so it has rank k = ${k} in this subarray (cyan ≤ pivot, red > pivot).`, [2, 3], p, r, hl);
      if (i === k){ fr(`i = k = ${k}: the pivot ${a[q]} is the answer.`, 4, p, r, {[q]: 'good'}); break; }
      if (i < k){ fr(`i = ${i} < k = ${k}: the answer is on the left. Throw away the pivot and everything right of it.`, 5, p, r, hl); r = q - 1; }
      else { fr(`i = ${i} > k = ${k}: the answer is on the right, at rank ${i} − ${k} = ${i - k} there.`, 6, p, r, hl); p = q + 1; i -= k; }
    }
    return F;
  }
};
DEEP.t10a = {
  viz: ['rselect'],
  cx: [['MINIMUM or MAXIMUM', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'Θ(1)', 'exactly n − 1 comparisons, optimal'], ['MIN and MAX together', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'Θ(1)', 'process in pairs: at most 3⌊n/2⌋ comparisons'], ['RANDOMIZED-SELECT', 'Θ(n)', 'Θ(n) expected', 'Θ(n²)', 'Θ(1) iterative', 'like quicksort, but recurses on one side only'], ['SELECT (median of medians)', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'Θ(lg n) stack', 'T(n) ≤ T(n/5) + T(7n/10) + Θ(n)'], ['Sort then index', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n lg n)', 'depends on sort', 'simple but slower']],
  deep: [
    ['Why expected Θ(n): the geometric argument', `<p>Call a pivot <b>good</b> if it lands in the middle half (ranks n/4 to 3n/4). That happens with probability 1/2, and then the recursion keeps at most 3n/4 elements. So on average every two partitions shrink the problem by a factor of 3/4, and the total work is bounded by a geometric series:</p><p class="math" style="text-align:center">E[T(n)] ≤ 2cn (1 + 3/4 + (3/4)² + …) = 8cn = O(n).</p><p>Unlike quicksort, we only follow <i>one</i> branch, so the levels don't add up to n each; they shrink.</p>`],
    ['Worst-case linear: median of medians', `<ol><li>Split the n elements into groups of 5 and find each group's median (constant work per group).</li><li>Recursively SELECT the median x of those ⌈n/5⌉ medians.</li><li>Partition around x. At least about 3n/10 elements are ≤ x and at least 3n/10 are ≥ x, so either side has at most about 7n/10.</li><li>Recurse on the side holding the answer.</li></ol><p>T(n) ≤ T(n/5) + T(7n/10) + Θ(n). Since 1/5 + 7/10 = 9/10 &lt; 1, each level of the recursion tree costs a constant fraction less than the one above: T(n) = Θ(n). With groups of 3 the fractions add to 1 and you only get Θ(n lg n).</p>`],
    ['Simultaneous min and max', `<p>Naively, 2(n − 1) comparisons. Better: take elements two at a time, compare them with each other (1), the smaller with the current min (1) and the larger with the current max (1). That's 3 comparisons per 2 elements: 3⌊n/2⌋ total. A lower-bound argument shows ⌈3n/2⌉ − 2 is optimal.</p>`],
    ['Typical uses', `<ul class="clean"><li>Medians and percentiles of large data without sorting.</li><li>A guaranteed pivot for quicksort: use SELECT for the median and quicksort becomes Θ(n lg n) worst case (but slower in practice).</li><li>"k smallest elements": SELECT the k-th, then one pass collects everything ≤ it, Θ(n) total (Problem Set 6 style).</li></ul>`]
  ]
};

// ---- t10b: counting sort and radix sort ----
VIZ.csort = {
  title: 'Step-through: COUNTING-SORT', hint: 'Keys in 0..k. Count each key, turn the counts into prefix sums (C[v] = number of keys ≤ v), then place elements from right to left so equal keys keep their order.',
  code: ['COUNTING-SORT(A, n, k)', '  C[0..k] = 0', '  for j = 1 to n:  C[A[j]] = C[A[j]] + 1', '  for i = 1 to k:  C[i] = C[i] + C[i − 1]', '  for j = n downto 1', '      B[C[A[j]]] = A[j]', '      C[A[j]] = C[A[j]] − 1', '  return B'],
  input: () => vzRand(10, 0, 6), parse: s => vzArr(s, 0, 9, 12),
  run(a){
    const n = a.length, k = Math.max(...a), C = Array(k + 1).fill(0), B = Array(n).fill(null), F = [];
    const fr = (msg, line, hA = {}, hC = {}, hB = {}) => F.push({msg, line, svg: VZ.wrap(560, 270, VZ.cells(a, {x: 20, y: 30, s: 40, title: 'A (input)', hl: hA}) + VZ.cells(C, {x: 20, y: 120, s: 40, base: 0, title: `C[0..${k}]`, hl: hC}) + VZ.cells(B, {x: 20, y: 210, s: 40, title: 'B (output)', hl: hB}))});
    fr(`k = ${k}, so C has ${k + 1} counters, all 0.`, 1);
    a.forEach((v, j) => { C[v]++; fr(`A[${j + 1}] = ${v}: C[${v}] becomes ${C[v]}.`, 2, {[j]: 'cur'}, {[v]: 'cy'}); });
    for (let i = 1; i <= k; i++){ C[i] += C[i - 1]; fr(`Prefix sum: C[${i}] = ${C[i]} keys are ≤ ${i}.`, 3, {}, {[i]: 'cy', [i - 1]: 'dim'}); }
    for (let j = n - 1; j >= 0; j--){ const v = a[j]; B[C[v] - 1] = v; const pos = C[v]; C[v]--; fr(`A[${j + 1}] = ${v} goes to B[${pos}], then C[${v}] = ${C[v]}. Scanning right to left keeps equal keys in their original order (stable).`, [5, 6], {[j]: 'cur'}, {[v]: 'cy'}, {[pos - 1]: 'good'}); }
    fr(`Sorted with no comparisons at all: Θ(n + k) = Θ(${n} + ${k}).`, 7, {}, {}, Object.fromEntries(B.map((_, i) => [i, 'good'])));
    return F;
  }
};
VIZ.radix = {
  title: 'Step-through: RADIX-SORT (least significant digit first)', hint: 'Each pass is a stable sort on one digit. Yellow = the digit being sorted on this pass.',
  code: ['RADIX-SORT(A, n, d)', '  for i = 1 to d          // digit 1 = least significant', '      use a stable sort to sort A on digit i'],
  input: () => vzRand(8, 100, 999), parse: s => vzArr(s, 0, 999, 10),
  run(a){
    a = a.slice(); const F = [], d = String(Math.max(...a)).length;
    const show = (p, msg, line) => { let g = D.text(20, 18, p ? `after sorting on digit ${p}` : 'input', 12, C.mut, 'start', 600);
      a.forEach((v, t) => { const s = String(v).padStart(d, '0'), y = 30 + t * 28; [...s].forEach((ch, c) => { const isD = p && c === d - p, done = p && c > d - p; g += `<rect x="${200 + c * 30}" y="${y}" width="26" height="24" rx="5" fill="${isD ? C.warn + '44' : done ? C.good + '22' : '#111827'}" stroke="${isD ? C.warn : done ? C.good : 'rgba(255,255,255,.18)'}"/>` + D.text(213 + c * 30, y + 17, ch, 13, '#fff', 'middle', 700); }); });
      F.push({msg, line, svg: VZ.wrap(560, 40 + a.length * 28, g)}); };
    show(0, `${a.length} numbers with d = ${d} digits.`, 0);
    for (let p = 1; p <= d; p++){ const dig = v => Math.floor(v / 10 ** (p - 1)) % 10; const bk = Array.from({length: 10}, () => []); a.forEach(v => bk[dig(v)].push(v)); a = bk.flat();
      show(p, `Pass ${p}: stable sort on the ${['ones', 'tens', 'hundreds'][p - 1] || p + 'th'} digit. Ties keep the order from the previous pass, so the numbers are now sorted by their last ${p} digit${p > 1 ? 's' : ''}.`, 2); }
    F[F.length - 1].msg += ` Done: Θ(d(n + k)) = Θ(${d}·(${a.length} + 10)).`; return F;
  }
};
DEEP.t10b = {
  viz: ['csort', 'radix'],
  cx: [['Any comparison sort (lower bound)', 'Ω(n lg n)', 'Ω(n lg n)', 'Ω(n lg n)', '—', 'decision tree with n! leaves has height ≥ lg(n!)'], ['COUNTING-SORT', 'Θ(n + k)', 'Θ(n + k)', 'Θ(n + k)', 'Θ(n + k)', 'stable; linear when k = O(n)'], ['RADIX-SORT', 'Θ(d(n + k))', 'Θ(d(n + k))', 'Θ(d(n + k))', 'Θ(n + k)', 'b-bit keys, r-bit digits: Θ((b/r)(n + 2<sup>r</sup>)), best r ≈ lg n'], ['BUCKET-SORT', 'Θ(n)', 'Θ(n) expected', 'Θ(n²)', 'Θ(n)', 'assumes keys uniform on [0, 1)']],
  deep: [
    ['The decision-tree lower bound', `<p>Any comparison sort can be drawn as a binary tree: each internal node is a comparison a<sub>i</sub> ≤ a<sub>j</sub>, each leaf is an output permutation. To be correct on every input, all n! permutations must appear as leaves. A binary tree of height h has at most 2<sup>h</sup> leaves, so</p><p class="math" style="text-align:center">2<sup>h</sup> ≥ n! ⇒ h ≥ lg(n!) = Θ(n lg n)</p><p>(using lg(n!) ≥ lg((n/2)<sup>n/2</sup>) = (n/2) lg(n/2)). The height is the worst-case number of comparisons. So merge sort and heapsort are asymptotically optimal among comparison sorts.</p>`],
    ['How linear sorts escape the bound', `<p>They don't compare keys; they use keys as array indices or digits. That needs extra assumptions: small integer range (counting), fixed number of digits (radix), or a known distribution (bucket). Counting sort with k = n³ is Θ(n³), worse than merge sort, so the assumptions matter.</p>`],
    ['Why radix sort must go least significant first, with a stable sort', `<p>Claim: after pass i, the numbers are sorted by their last i digits. Proof by induction: pass i sorts by digit i; if two numbers have the same digit i, stability keeps them in the order of the previous pass, which by induction was sorted on the last i − 1 digits. Without stability (or going most significant first without recursion), earlier passes are undone.</p>`],
    ['Bucket sort in one paragraph', `<p>For n keys uniform on [0, 1): make n buckets, put A[i] into bucket ⌊n·A[i]⌋, insertion-sort each bucket, concatenate. Expected bucket size is 1 and E[n<sub>i</sub>²] = 2 − 1/n, so the expected time is Θ(n) + n·O(2 − 1/n) = Θ(n). If all keys fall in one bucket, it's insertion sort: Θ(n²).</p>`]
  ]
};

// ---- t12s: backtracking (n-queens) ----
VIZ.queens = {
  title: 'Step-through: n-queens by backtracking', hint: 'Place one queen per row. Try each column; if it conflicts with an earlier queen (red), try the next; if no column works, backtrack to the previous row.',
  code: ['PLACE-QUEENS(Q[1..n], r)', '  if r == n + 1:  print Q;  return true', '  for j = 1 to n', '      legal = true', '      for i = 1 to r − 1', '          if Q[i] == j or Q[i] == j + r − i or Q[i] == j − r + i', '              legal = false', '      if legal', '          Q[r] = j', '          if PLACE-QUEENS(Q, r + 1) return true', '  return false        // backtrack'],
  opts: [{id: 'n', label: 'n', val: '5', choices: [['4', '4'], ['5', '5'], ['6', '6']]}],
  input: () => [], run(_, o){
    const n = +o.n, Q = [], F = []; let tried = 0, backs = 0;
    const draw = (hl = {}) => { const M = Array.from({length: n}, (_, r) => Array.from({length: n}, (_, c) => Q[r] === c ? '♛' : '')); const H = {}; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if ((r + c) % 2) H[r + ',' + c] = 'rgba(255,255,255,.06)'; Q.forEach((c, r) => H[r + ',' + c] = 'acc'); Object.assign(H, hl);
      return VZ.wrap(560, 60 + n * 42, VZ.grid(M, {x: 150, y: 40, cw: 42, ch: 42, rows: M.map((_, i) => 'row ' + (i + 1)), cols: M.map((_, j) => j + 1), hl: H})); };
    const fr = (msg, line, hl) => F.push({msg, line, svg: draw(hl), side: `<p class="stat-label">Placements tried: <b>${tried}</b> · backtracks: <b>${backs}</b> · brute force would examine C(${n * n}, ${n}) = ${(() => { let x = 1; for (let i = 0; i < n; i++) x = x * (n * n - i) / (i + 1); return Math.round(x).toLocaleString(); })()} placements</p>`});
    fr(`Empty ${n}×${n} board. Queens may not share a row, column or diagonal.`, 0);
    const go = r => { if (r === n){ fr(`All ${n} rows filled: a solution! Q = [${Q.map(c => c + 1).join(', ')}].`, 1); return true; }
      for (let j = 0; j < n; j++){ tried++; const bad = Q.findIndex((c, i) => c === j || Math.abs(c - j) === r - i);
        if (bad >= 0){ fr(`Row ${r + 1}, column ${j + 1}: attacked by the queen in row ${bad + 1}.`, [5, 6], {[r + ',' + j]: 'bad', [bad + ',' + Q[bad]]: 'warn'}); continue; }
        Q[r] = j; fr(`Row ${r + 1}, column ${j + 1} is safe: place a queen and go to row ${r + 2}.`, [8, 9], {[r + ',' + j]: 'good'}); if (go(r + 1)) return true; Q.length = r; backs++;
        if (F.length > 260) return true; }
      fr(`No column works in row ${r + 1}: <b>backtrack</b> to row ${r} and move that queen.`, 10, Object.fromEntries(Array.from({length: n}, (_, j) => [r + ',' + j, 'bad']))); return false; };
    go(0); return F;
  }
};
DEEP.t12s = {
  viz: ['queens'],
  cxHead: ['Problem', 'Backtracking cost', 'Better approach', 'Notes'],
  cx: [['n-queens', 'O(n!) placements (far fewer with pruning)', '—', 'pruning by column/diagonal cuts the tree hugely'], ['Subset sum (n items, target T)', 'O(2ⁿ) subsets', 'DP in O(nT) (pseudo-polynomial)', 'each item: include it or not'], ['Text segmentation (n characters)', 'O(2ⁿ) splits', 'memoized/DP in O(n²) calls to IsWord', 'same suffixes recomputed repeatedly'], ['Longest increasing subsequence', 'O(2ⁿ)', 'DP in O(n²) (O(n lg n) with a clever search)', 'state = (index, last value taken)'], ['Permutations / TSP brute force', 'Θ(n!)', 'DP over subsets O(2ⁿ n²)', 'still exponential: TSP is NP-hard (Topic 24)']],
  deep: [
    ['The backtracking recipe', `<ol><li>Build a solution one decision at a time (a row's queen, include/exclude an item, where the next word ends).</li><li>At each step, try every option that is still legal.</li><li>Recurse; if the recursion fails, undo the choice and try the next one.</li><li>Prune: stop exploring a branch as soon as it can't lead to a valid solution.</li></ol><p>The recursion explores a <b>tree of partial solutions</b>. Its running time is (number of nodes) × (work per node), which is usually exponential. The art is in what each recursive call needs to know: e.g. subset sum needs only "index i and remaining target T".</p>`],
    ['Subset sum, written two ways', `<pre><code><span class="fn">SUBSET-SUM</span>(X[1..n], i, T)       <span class="cm">// is there a subset of X[i..n] summing to T?</span>
  <span class="kw">if</span> T == 0  <span class="kw">return</span> true
  <span class="kw">if</span> T &lt; 0 or i &gt; n  <span class="kw">return</span> false
  <span class="kw">return</span> SUBSET-SUM(X, i+1, T)          <span class="cm">// skip X[i]</span>
      or SUBSET-SUM(X, i+1, T − X[i])   <span class="cm">// take X[i]</span></code></pre><p>T(n) = 2T(n − 1) + O(1) = O(2ⁿ). But there are only n·T distinct (i, T) pairs, so remembering answers in a table (memoization) gives O(nT). That observation is the bridge to dynamic programming (Topic 12A).</p>`],
    ['When backtracking becomes dynamic programming', `<p>Draw the recursion tree. If the <b>same subproblem</b> (same arguments) appears many times, cache it. If the number of distinct subproblems is polynomial, the cached version is polynomial. n-queens doesn't simplify this way (each partial board is different), but subset sum, text segmentation and LIS do.</p>`]
  ]
};

// ---- t12a: rod cutting ----
const ROD_P = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
VIZ.rod = {
  title: 'Step-through: bottom-up rod cutting', hint: 'r[j] is the best revenue for a rod of length j. For each j, try every first piece i and reuse the already-computed r[j − i]. Prices are CLRS\'s example table.',
  code: ['BOTTOM-UP-CUT-ROD(p, n)', '  r[0] = 0', '  for j = 1 to n', '      q = −∞', '      for i = 1 to j', '          if q < p[i] + r[j − i]', '              q = p[i] + r[j − i];  s[j] = i', '      r[j] = q', '  return r and s'],
  opts: [{id: 'n', label: 'n', val: '8', choices: [['5', '5'], ['8', '8'], ['10', '10']]}],
  input: () => [], run(_, o){
    const n = +o.n, r = [0], s = [null], F = [];
    const fr = (msg, line, hl = {}) => F.push({msg, line, svg: VZ.wrap(560, 170, VZ.grid([ROD_P.slice(0, n + 1).map((v, i) => i ? v : ''), Array.from({length: n + 1}, (_, i) => r[i]), Array.from({length: n + 1}, (_, i) => s[i])], {x: 80, y: 40, cw: Math.min(42, 470 / (n + 1)), ch: 34, rows: ['price p', 'best r', 'first cut s'], cols: Array.from({length: n + 1}, (_, i) => i), hl}))});
    fr('r[0] = 0: an empty rod earns nothing.', 1, {'1,0': 'good'});
    for (let j = 1; j <= n; j++){ let q = -Infinity, bi = 0;
      for (let i = 1; i <= j; i++){ const v = ROD_P[i] + r[j - i]; const better = v > q; if (better){ q = v; bi = i; }
        fr(`j = ${j}, first piece i = ${i}: p[${i}] + r[${j - i}] = ${ROD_P[i]} + ${r[j - i]} = ${v}${better ? ' → new best' : ` (best stays ${q})`}.`, better ? [5, 6] : 5, {[`0,${i}`]: 'cy', [`1,${j - i}`]: 'cy', [`1,${j}`]: 'cur'}); }
      r[j] = q; s[j] = bi; fr(`r[${j}] = ${q}, first piece ${bi}.`, 7, {[`1,${j}`]: 'good', [`2,${j}`]: 'good'}); }
    const cuts = []; let m = n; while (m > 0){ cuts.push(s[m]); m -= s[m]; }
    fr(`Optimal revenue for length ${n}: ${r[n]}. Follow s to reconstruct the cuts: ${cuts.join(' + ')}. Θ(n²) time for the double loop, versus 2<sup>${n - 1}</sup> = ${2 ** (n - 1)} ways to cut.`, 8);
    return F;
  }
};
DEEP.t12a = {
  viz: ['rod'],
  cxHead: ['Problem', 'Subproblems', 'Choices each', 'Time', 'Space'],
  cx: [['Rod cutting', 'n (r[j])', 'j', 'Θ(n²)', 'Θ(n)'], ['Plain recursive CUT-ROD', '—', '—', 'Θ(2ⁿ)', 'Θ(n) stack'], ['Fibonacci (memoized)', 'n', '1', 'Θ(n)', 'Θ(n), or Θ(1) bottom-up'], ['Matrix-chain multiplication', 'Θ(n²) (i, j)', 'j − i', 'Θ(n³)', 'Θ(n²)'], ['0-1 knapsack (capacity W)', 'nW', '2', 'Θ(nW) (pseudo-polynomial)', 'Θ(nW)']],
  cxNote: 'Rule of thumb: DP time ≈ (number of subproblems) × (choices per subproblem).',
  deep: [
    ['The four steps of dynamic programming', `<ol><li><b>Characterize</b> the structure of an optimal solution (optimal substructure: an optimal solution contains optimal solutions to subproblems).</li><li><b>Recursively define</b> its value: r<sub>n</sub> = max<sub>1≤i≤n</sub>(p<sub>i</sub> + r<sub>n−i</sub>).</li><li><b>Compute</b> the values, top-down with memoization or bottom-up in an order where subproblems come first.</li><li><b>Construct</b> a solution from stored choices (the s array).</li></ol>`],
    ['Why plain recursion is exponential', `<p>CUT-ROD(n) calls CUT-ROD(n − i) for every i, so T(n) = 1 + Σ<sub>j=0</sub><sup>n−1</sup> T(j) = 2ⁿ. The recursion tree recomputes the same lengths over and over. With memoization each length is solved once, with j work: Θ(n²). The <b>subproblem graph</b> (one vertex per subproblem, edges to the ones it uses) has n + 1 vertices and Θ(n²) edges, which is exactly the running time.</p>`],
    ['Top-down vs bottom-up', `${vzTbl(['', 'Memoized (top-down)', 'Bottom-up'], [['Order', 'natural recursion, cache results', 'loop over subproblems in dependency order'], ['Solves', 'only subproblems actually needed', 'all subproblems'], ['Overhead', 'recursion calls', 'tight loops, better constants'], ['Space tricks', 'harder', 'easy to keep only the last row(s)']])}`],
    ['Greedy fails here', `<p>"Always cut the piece with the best price per inch" sounds reasonable. With prices p₁..p₄ = 1, 20, 33, 36, length 4: densities are 1, 10, 11, 9, so greedy takes length 3 first (33) plus length 1 (1) = 34. Two pieces of length 2 give 40. DP considers every first cut, so it finds 40. Topic 13 shows when greedy <i>is</i> safe.</p>`]
  ]
};

// ---- t12b: LCS ----
VIZ.lcs = {
  title: 'Step-through: LCS table and traceback', hint: 'c[i, j] = length of an LCS of X[1..i] and Y[1..j]. Match → diagonal + 1 (green). Otherwise copy the larger of up or left. Then follow the arrows back from the corner.',
  code: ['LCS-LENGTH(X, Y, m, n)', '  c[i, 0] = c[0, j] = 0', '  for i = 1 to m', '      for j = 1 to n', '          if X[i] == Y[j]', '              c[i, j] = c[i − 1, j − 1] + 1;  b[i, j] = "↖"', '          elseif c[i − 1, j] ≥ c[i, j − 1]', '              c[i, j] = c[i − 1, j];  b[i, j] = "↑"', '          else  c[i, j] = c[i, j − 1];  b[i, j] = "←"', 'PRINT-LCS: from (m, n) follow ↖ (output X[i]), ↑, ←'],
  input: () => { const r = n => Array.from({length: n}, () => 'ABCD'[rnd(0, 3)]).join(''); return [r(6), r(6)]; },
  parse: s => { const a = s.toUpperCase().split(/[\s,]+/).filter(Boolean); if (a.length !== 2 || a.some(x => !/^[A-Z]{1,8}$/.test(x))) throw new Error('enter two words of 1–8 letters, e.g. ABCBDAB, BDCABA'); return a; },
  fmt: a => a.join(', '),
  run([X, Y]){
    const m = X.length, n = Y.length, c = Array.from({length: m + 1}, () => Array(n + 1).fill(null)), b = Array.from({length: m + 1}, () => Array(n + 1).fill('')), F = [];
    for (let i = 0; i <= m; i++) c[i][0] = 0; for (let j = 0; j <= n; j++) c[0][j] = 0;
    const cw = Math.min(46, 420 / (n + 1));
    const fr = (msg, line, hl = {}) => F.push({msg, line, svg: VZ.wrap(560, 70 + (m + 1) * 34, VZ.grid(c.map((row, i) => row.map((v, j) => v === null ? '' : (b[i][j] ? b[i][j] + ' ' : '') + v)), {x: 90, y: 50, cw, ch: 34, rows: ['', ...X], cols: ['', ...Y], hl}))});
    fr(`X = ${X} (rows), Y = ${Y} (columns). Row 0 and column 0 are 0: an LCS with an empty string is empty.`, 1);
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++){
      if (X[i - 1] === Y[j - 1]){ c[i][j] = c[i - 1][j - 1] + 1; b[i][j] = '↖'; fr(`X[${i}] = Y[${j}] = ${X[i - 1]}: extend the diagonal, c = ${c[i][j]}.`, 5, {[i + ',' + j]: 'good', [(i - 1) + ',' + (j - 1)]: 'cy'}); }
      else if (c[i - 1][j] >= c[i][j - 1]){ c[i][j] = c[i - 1][j]; b[i][j] = '↑'; fr(`${X[i - 1]} ≠ ${Y[j - 1]}: take the max of up (${c[i - 1][j]}) and left (${c[i][j - 1]}) → up.`, 7, {[i + ',' + j]: 'cur', [(i - 1) + ',' + j]: 'cy'}); }
      else { c[i][j] = c[i][j - 1]; b[i][j] = '←'; fr(`${X[i - 1]} ≠ ${Y[j - 1]}: left (${c[i][j - 1]}) beats up (${c[i - 1][j]}).`, 8, {[i + ',' + j]: 'cur', [i + ',' + (j - 1)]: 'cy'}); }
    }
    const path = {}; let i = m, j = n, out = ''; while (i > 0 && j > 0){ path[i + ',' + j] = b[i][j] === '↖' ? 'good' : 'warn'; if (b[i][j] === '↖'){ out = X[i - 1] + out; i--; j--; } else if (b[i][j] === '↑') i--; else j--; }
    fr(`Traceback from (${m}, ${n}): every ↖ on the path is a matched letter. LCS = "${out || '(empty)'}", length ${c[m][n]}. Θ(mn) = Θ(${m * n}) time to fill, Θ(m + n) to trace back.`, 9, path);
    return F;
  }
};
DEEP.t12b = {
  viz: ['lcs'],
  cx: [['LCS-LENGTH', 'Θ(mn)', 'Θ(mn)', 'Θ(mn)', 'Θ(mn) (c and b tables)', 'one O(1) cell per (i, j)'], ['PRINT-LCS', 'Θ(m + n)', 'Θ(m + n)', 'Θ(m + n)', 'Θ(m + n) stack', 'each step decreases i or j'], ['Length only, two rows', 'Θ(mn)', 'Θ(mn)', 'Θ(mn)', 'Θ(min(m, n))', 'row i only needs row i − 1'], ['Brute force', 'Θ(n 2<sup>m</sup>)', '', '', '', '2<sup>m</sup> subsequences of X, each checked in Θ(n)']],
  deep: [
    ['Optimal substructure of an LCS', `<p>Let Z = z₁…z<sub>k</sub> be any LCS of X = x₁…x<sub>m</sub> and Y = y₁…y<sub>n</sub>.</p><ol><li>If x<sub>m</sub> = y<sub>n</sub>, then z<sub>k</sub> = x<sub>m</sub> and Z<sub>k−1</sub> is an LCS of X<sub>m−1</sub> and Y<sub>n−1</sub>.</li><li>If x<sub>m</sub> ≠ y<sub>n</sub> and z<sub>k</sub> ≠ x<sub>m</sub>, Z is an LCS of X<sub>m−1</sub> and Y.</li><li>If x<sub>m</sub> ≠ y<sub>n</sub> and z<sub>k</sub> ≠ y<sub>n</sub>, Z is an LCS of X and Y<sub>n−1</sub>.</li></ol><p>Each case is a cut-and-paste argument: if the smaller problem had a longer common subsequence, we could build a longer one for the whole problem. This gives the recurrence c[i, j] = c[i−1, j−1] + 1 on a match, else max(c[i−1, j], c[i, j−1]).</p>`],
    ['Subsequence vs substring', `<p>A <b>subsequence</b> keeps order but may skip letters (BCBA in ABCBDAB). A <b>substring</b> is contiguous. Longest common substring uses a different recurrence: L[i, j] = L[i−1, j−1] + 1 on a match, else 0, and the answer is the maximum entry, not the corner.</p>`],
    ['Related string DPs', `${vzTbl(['Problem', 'Recurrence idea', 'Time'], [['Edit distance', 'min of insert, delete, substitute (+0 if letters match)', 'Θ(mn)'], ['Longest palindromic subsequence', 'LCS of X and reverse(X), or a direct interval DP', 'Θ(n²)'], ['Almost-palindrome (Problem Set 7)', 'interval DP on deletions allowed', 'Θ(n²)'], ['diff / DNA alignment', 'LCS or edit distance with weights', 'Θ(mn)']])}`],
    ['Reading the table backwards', `<p>You don't actually need the b table: at (i, j), if x<sub>i</sub> = y<sub>j</sub> go diagonal, otherwise move to whichever of c[i−1, j], c[i, j−1] equals c[i, j]. When both are equal, either choice gives a (possibly different) LCS, so a pair of strings can have several LCSs of the same length.</p>`]
  ]
};

// ======================= DEEP DIVES · MIDTERM 4 =======================
const vzG = (pos, edges) => ({nodes: Object.entries(pos).map(([id, [x, y]]) => ({id, x, y})), edges: edges.map(([u, v, w]) => ({u, v, w}))});
const vzDT = (head, ids, cols) => vzTbl(['', ...ids], head.map((h, r) => [`<b>${h}</b>`, ...ids.map(id => cols[r](id))]));

// ---- t13: Huffman ----
VIZ.huff = {
  title: 'Step-through: building a Huffman code', hint: 'Repeatedly merge the two least frequent trees (a min-priority queue). Leaves show letter and frequency; internal nodes show the merged frequency. Left edge = 0, right edge = 1.',
  code: ['HUFFMAN(C)', '  n = |C|;  Q = C            // min-priority queue keyed on freq', '  for i = 1 to n − 1', '      allocate a new node z', '      x = EXTRACT-MIN(Q);  y = EXTRACT-MIN(Q)', '      z.left = x;  z.right = y;  z.freq = x.freq + y.freq', '      INSERT(Q, z)', '  return EXTRACT-MIN(Q)       // root of the code tree'],
  opts: [{id: 'src', label: 'Frequencies', val: 'clrs', fresh: true, choices: [['clrs', 'CLRS example (a:45 … f:5)'], ['rand', 'random']]}],
  input: o => o.src === 'clrs' ? [45, 13, 12, 16, 9, 5] : vzRand(6, 1, 40),
  parse: s => vzArr(s, 1, 99, 8),
  run(fr0){
    let id = 0; let Q = fr0.map((f, i) => ({k: 'abcdefgh'[i] + ':' + f, f, ch: 'abcdefgh'[i], id: id++})); const F = [];
    const leaves = t => t.l ? leaves(t.l) + leaves(t.r) : 1;
    const draw = hl => { const sorted = Q.slice().sort((a, b) => a.f - b.f), tot = sorted.reduce((s, t) => s + leaves(t), 0); let x = 10, g = '';
      sorted.forEach(t => { const w = 540 * leaves(t) / tot; const cp = n => n && {k: n.k, c: hl.has(n.id) ? hl.get(n.id) : n.l ? 'acc' : 'cy', l: cp(n.l), r: cp(n.r)}; g += VZ.tree(cp(t), {x, w, y: 30, dy: 44}); x += w; });
      return VZ.wrap(560, 300, g); };
    const fr = (msg, line, hl = new Map()) => F.push({msg, line, svg: draw(hl), side: `<p class="stat-label">Queue (by frequency): ${Q.slice().sort((a, b) => a.f - b.f).map(t => t.f).join(', ')}</p>`});
    fr(`Start: ${Q.length} single-letter trees in the priority queue.`, 1);
    while (Q.length > 1){ Q.sort((a, b) => a.f - b.f); const [x, y] = Q; fr(`EXTRACT-MIN twice: ${x.f} and ${y.f} are the two rarest.`, 4, new Map([[x.id, 'cur'], [y.id, 'cur']]));
      const z = {k: String(x.f + y.f), f: x.f + y.f, l: x, r: y, id: id++}; Q = Q.slice(2).concat(z); fr(`Merge them under a new node of frequency ${z.f} and insert it back.`, [5, 6], new Map([[z.id, 'good']])); }
    const codes = []; const walk = (t, c) => { if (!t.l){ codes.push([t.ch, t.f, c || '0']); return; } walk(t.l, c + '0'); walk(t.r, c + '1'); }; walk(Q[0], '');
    const bits = codes.reduce((s, [, f, c]) => s + f * c.length, 0), total = fr0.reduce((a, b) => a + b, 0), fixed = Math.ceil(Math.log2(fr0.length));
    F.push({svg: draw(new Map()), line: 7, tag: 'done', msg: `Done. Total cost B(T) = Σ freq × depth = ${bits} bits, versus ${total * fixed} with a fixed ${fixed}-bit code (${Math.round(100 - 100 * bits / (total * fixed))}% smaller).`,
      side: vzTbl(['char', 'freq', 'codeword'], codes.sort((a, b) => a[0] < b[0] ? -1 : 1).map(([c, f, w]) => [c, f, `<code>${w}</code>`]))});
    return F;
  }
};
DEEP.t13 = {
  viz: ['huff'],
  cx: [['HUFFMAN (binary heap)', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n)', 'n − 1 merges, each O(lg n) heap operations'], ['HUFFMAN (frequencies pre-sorted, two queues)', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'merged nodes come out in non-decreasing order'], ['Activity selection (sorted by finish)', 'Θ(n)', 'Θ(n)', 'Θ(n)', 'Θ(1)', 'one pass; Θ(n lg n) if you must sort first'], ['Fractional knapsack', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n lg n)', 'Θ(n)', 'sort by value/weight, take greedily'], ['0-1 knapsack', '—', '—', 'greedy fails', '', 'needs DP (Topic 12)']],
  deep: [
    ['Greedy-choice property + optimal substructure', `<p>A greedy algorithm is correct when (1) some optimal solution starts with the greedy choice and (2) after making it, what's left is a smaller instance of the same problem. The standard proof is an <b>exchange argument</b>: take any optimal solution, swap its first choice for the greedy one, and show it is no worse.</p><p><b>Activity selection:</b> let a<sub>m</sub> finish earliest. In an optimal set A, replace its earliest-finishing activity with a<sub>m</sub>; nothing overlaps because a<sub>m</sub> finishes no later. Same size, still optimal.</p>`],
    ['Why Huffman is optimal (sketch)', `<ol><li><b>Greedy choice:</b> there is an optimal tree in which the two least frequent characters x, y are siblings at the deepest level. Swapping them into the deepest positions can't increase Σ freq × depth, because the characters they displace are at least as frequent.</li><li><b>Optimal substructure:</b> replace x, y by one character z with freq x + y. If T′ is optimal for the smaller alphabet, expanding z back into x and y gives an optimal T, since B(T) = B(T′) + x.freq + y.freq.</li></ol>`],
    ['Prefix codes', `<p>No codeword is a prefix of another, so a bit string decodes unambiguously by walking from the root: 0 = left, 1 = right, output at a leaf, restart. An optimal prefix code is always a <b>full</b> binary tree (every internal node has 2 children), with |C| leaves and |C| − 1 internal nodes.</p>`],
    ['Where greedy fails', `${vzTbl(['Problem', 'Tempting greedy', 'Counterexample'], [['Coin change with coins 1, 3, 4', 'largest coin first', '6 = 4+1+1 (3 coins) vs 3+3 (2)'], ['0-1 knapsack', 'best value/weight first', 'W = 50; items (10 kg, $60), (20, $100), (30, $120): greedy $160, optimal $220'], ['Interval scheduling', 'shortest activity first', 'a short activity overlapping two long compatible ones']])}`]
  ]
};

// ---- t14a: BFS and DFS ----
const G14 = vzG({r: [60, 70], s: [200, 70], t: [340, 70], u: [480, 70], v: [60, 210], w: [200, 210], x: [340, 210], y: [480, 210]}, [['r', 's'], ['r', 'v'], ['s', 'w'], ['w', 't'], ['w', 'x'], ['t', 'x'], ['t', 'u'], ['x', 'u'], ['x', 'y'], ['u', 'y']]);
VIZ.bfsdfs = {
  title: 'Step-through: breadth-first and depth-first search', hint: 'BFS (undirected): labels are distances d from the source, the queue is on the right. DFS (edges directed as drawn left→right/top→bottom): labels are discovery/finish times; tree edges green, back edges red, forward cyan, cross yellow.',
  code: o => o.alg === 'bfs' ? ['BFS(G, s)', '  every u: color = WHITE, d = ∞, π = NIL', '  s.color = GRAY;  s.d = 0;  Q = ⟨s⟩', '  while Q ≠ ∅', '      u = DEQUEUE(Q)', '      for each v in G.Adj[u]', '          if v.color == WHITE', '              v.color = GRAY;  v.d = u.d + 1;  v.π = u', '              ENQUEUE(Q, v)', '      u.color = BLACK'] : ['DFS(G)', '  for each u: color = WHITE;  time = 0', '  for each u in G.V:  if u.color == WHITE  DFS-VISIT(G, u)', 'DFS-VISIT(G, u)', '  time += 1;  u.d = time;  u.color = GRAY', '  for each v in G.Adj[u]', '      if v.color == WHITE:  v.π = u;  DFS-VISIT(G, v)', '      (GRAY → back edge, BLACK → forward or cross)', '  u.color = BLACK;  time += 1;  u.f = time'],
  opts: [{id: 'alg', label: 'Algorithm', val: 'bfs', choices: [['bfs', 'BFS from s'], ['dfs', 'DFS (directed)']]}],
  input: () => G14.nodes.map(n => n.id), run(_, o){
    const ids = G14.nodes.map(n => n.id), adj = Object.fromEntries(ids.map(i => [i, []])), dir = o.alg === 'dfs';
    G14.edges.forEach(({u, v}) => { adj[u].push(v); if (!dir) adj[v].push(u); }); Object.values(adj).forEach(a => a.sort());
    const F = [], col = {}, ns = {}, es = {}, lab = {}; ids.forEach(i => col[i] = 'W');
    const fr = (msg, line, side, cur) => F.push({msg, line, side, svg: VZ.wrap(560, 280, VZ.graph(G14, {directed: dir, es: {...es, ...(cur ? {[cur]: 'cur'} : {})}, ns: {...ns}, lab: {...lab}}))});
    if (!dir){ const d = {}, pi = {}; ids.forEach(i => { d[i] = Infinity; lab[i] = '∞'; }); d.s = 0; lab.s = 0; ns.s = 'cy'; const Q = ['s'];
      const side = () => `<p>Queue: <b>⟨${Q.join(', ')}⟩</b></p>` + vzDT(['d', 'π'], ids, [i => vzInf(d[i]), i => pi[i] || '—']);
      fr('Start at s: d = 0, colored gray (discovered), enqueued.', 2, side());
      while (Q.length){ const u = Q.shift(); ns[u] = 'cur'; fr(`Dequeue ${u} (d = ${d[u]}). Scan its neighbors ${adj[u].join(', ')}.`, 4, side());
        for (const v of adj[u]){ if (d[v] === Infinity){ d[v] = d[u] + 1; pi[v] = u; lab[v] = d[v]; ns[v] = 'cy'; es[u + '>' + v] = 'good'; Q.push(v); fr(`${v} is white: d = ${d[v]}, π = ${u}, enqueue.`, [6, 7, 8], side(), u + '>' + v); } }
        ns[u] = 'done'; fr(`${u} is finished (black).`, 9, side()); }
      fr('BFS done. Green edges form the breadth-first tree; each d is the shortest number of edges from s. Every vertex and edge was handled once: Θ(V + E).', undefined, side());
    } else { let time = 0; const d = {}, f = {};
      const side = () => vzDT(['d', 'f'], ids, [i => d[i] || '', i => f[i] || '']) + '<p class="stat-label">Parenthesis theorem: the [d, f] intervals of any two vertices are nested or disjoint.</p>';
      const visit = u => { d[u] = ++time; col[u] = 'G'; ns[u] = 'cur'; lab[u] = d[u] + '/'; fr(`Discover ${u} at time ${time} (gray).`, 4, side());
        for (const v of adj[u]){ const k = u + '>' + v;
          if (col[v] === 'W'){ es[k] = 'good'; fr(`Edge ${u}→${v}: ${v} is white → tree edge, recurse.`, 6, side(), k); visit(v); ns[u] = 'cur'; }
          else { const t = col[v] === 'G' ? ['bad', 'back edge (to a gray ancestor: a cycle!)'] : d[u] < d[v] ? ['cy', 'forward edge (to a descendant)'] : ['warn', 'cross edge']; es[k] = t[0]; fr(`Edge ${u}→${v}: ${v} is ${col[v] === 'G' ? 'gray' : 'black'} → ${t[1]}.`, 7, side(), k); } }
        col[u] = 'B'; f[u] = ++time; ns[u] = 'done'; lab[u] = d[u] + '/' + f[u]; fr(`Finish ${u} at time ${time} (black).`, 8, side()); };
      fr('All vertices white. The outer loop starts a new tree from every vertex still white.', 1, side());
      ids.forEach(u => { if (col[u] === 'W') visit(u); });
      fr(`DFS done. ${Object.values(es).includes('bad') ? 'A back edge exists, so the graph has a cycle.' : 'No back edges: the graph is acyclic, so sorting by decreasing finish time gives a topological order.'} Θ(V + E).`, undefined, side()); }
    return F;
  }
};
DEEP.t14a = {
  viz: ['bfsdfs'],
  cx: [['BFS', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V) queue + colors', 'each vertex enqueued once, each list scanned once'], ['DFS', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V) stack', 'each vertex visited once, each edge examined once (twice undirected)'], ['Adjacency list: space', '', '', 'Θ(V + E)', '', 'best for sparse graphs'], ['Adjacency matrix: space', '', '', 'Θ(V²)', '', 'O(1) edge test; BFS/DFS become Θ(V²)'], ['Edge (u, v) present?', 'Θ(1) matrix', '', 'Θ(degree(u)) list', '', '']],
  deep: [
    ['BFS computes shortest paths (unweighted)', `<p>The queue holds vertices in non-decreasing order of d, and differs by at most 1 from front to back. So when v is first discovered from u, no shorter route can exist: v.d = δ(s, v), the fewest edges from s. Following π pointers back from v prints a shortest path in O(length). This fails as soon as edges have weights — that's Topic 18.</p>`],
    ['DFS edge types and what they tell you', `${vzTbl(['Edge (u, v)', 'v\'s color when explored', 'Meaning'], [['Tree', 'white', 'v discovered via this edge'], ['Back', 'gray', 'v is an ancestor ⇒ a cycle (directed)'], ['Forward', 'black, u.d &lt; v.d', 'v is a non-child descendant'], ['Cross', 'black, u.d &gt; v.d', 'between different subtrees or trees']])}<p>In an undirected graph every edge is a tree or back edge. <b>White-path theorem:</b> v becomes a descendant of u iff, when u is discovered, there is a path from u to v of all white vertices.</p>`],
    ['Representations, chosen by density', `<p>Adjacency lists: Θ(V + E) space, iterate a vertex's neighbors in Θ(degree). Adjacency matrix: Θ(V²) space, O(1) "is (u, v) an edge?". For a sparse graph (E ≈ V) the matrix wastes space and makes BFS Θ(V²); for a dense graph (E ≈ V²) both cost the same and the matrix is simpler. Problem Set 11's island-bridges problem is dense, so Θ(V²) Prim on a matrix is right there.</p>`],
    ['Classic uses', `<ul class="clean"><li>BFS: shortest unweighted paths, bipartite test (2-color by level; an edge inside a level means an odd cycle), number mazes.</li><li>DFS: cycle detection, topological sort, strongly connected components (Topic 14B), connected components, articulation points.</li></ul>`]
  ]
};

// ---- t14b: topological sort ----
const GDAG = vzG({A: [60, 60], B: [200, 60], C: [340, 60], D: [60, 200], E: [200, 200], F: [340, 200], G: [480, 200], H: [480, 60]}, [['A', 'B'], ['A', 'D'], ['B', 'C'], ['B', 'E'], ['D', 'E'], ['E', 'F'], ['C', 'F'], ['G', 'F'], ['H', 'C']]);
VIZ.topo = {
  title: 'Step-through: topological sort by DFS finishing times', hint: 'Run DFS; each time a vertex finishes, put it at the front of the list. 🎲 changes the order DFS tries vertices, which can give a different (still valid) order.',
  code: ['TOPOLOGICAL-SORT(G)', '  call DFS(G) to compute finish times v.f', '  as each vertex finishes, insert it onto the front of a linked list', '  return the linked list'],
  input: () => shuffle(GDAG.nodes.map(n => n.id)), fmt: a => a.join(' '), parse: s => { const a = s.toUpperCase().split(/[\s,]+/).filter(Boolean); if (a.length !== 8 || new Set(a).size !== 8 || a.some(x => !'ABCDEFGH'.includes(x))) throw new Error('enter A–H once each, in the order DFS should try them'); return a; },
  run(order){
    const adj = {}; order.forEach(i => adj[i] = []); GDAG.edges.forEach(({u, v}) => adj[u].push(v)); Object.values(adj).forEach(a => a.sort((x, y) => order.indexOf(x) - order.indexOf(y)));
    const F = [], ns = {}, es = {}, lab = {}, col = {}, L = []; let time = 0;
    const fr = (msg, line) => F.push({msg, line, svg: VZ.wrap(560, 270, VZ.graph(GDAG, {es: {...es}, ns: {...ns}, lab: {...lab}})), side: `<p>List: <b>${L.join(' → ') || '(empty)'}</b></p><p class="stat-label">DFS tries vertices in the order ${order.join(', ')}.</p>`});
    const visit = u => { col[u] = 1; ns[u] = 'cur'; lab[u] = ++time + '/'; fr(`Discover ${u}.`, 1); for (const v of adj[u]) if (!col[v]){ es[u + '>' + v] = 'good'; visit(v); ns[u] = 'cur'; }
      lab[u] += ++time; ns[u] = 'done'; L.unshift(u); fr(`${u} finishes at time ${time}: everything reachable from it is already in the list, so put ${u} in front.`, 2); };
    fr('A DAG: edges mean "must come before".', 0); order.forEach(u => { if (!col[u]) visit(u); });
    fr(`Topological order: ${L.join(', ')}. Every edge points left to right in this list. Θ(V + E).`, 3); return F;
  }
};
DEEP.t14b = {
  viz: ['topo'],
  cx: [['TOPOLOGICAL-SORT', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V)', 'one DFS plus O(1) per finish'], ['Kahn\'s algorithm (in-degree queue)', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V)', 'repeatedly remove a vertex with in-degree 0'], ['STRONGLY-CONNECTED-COMPONENTS', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V + E) for Gᵀ', 'DFS, transpose, DFS in decreasing f'], ['Transpose Gᵀ (adjacency lists)', 'Θ(V + E)', '', '', 'Θ(V + E)', '']],
  deep: [
    ['Why decreasing finish time works', `<p>Claim: for every edge (u, v) in a DAG, v.f &lt; u.f. When DFS explores (u, v), v can't be gray (that would be a back edge, i.e. a cycle). If v is white, it becomes u's descendant and finishes first. If v is black, it has already finished. Either way v.f &lt; u.f, so listing vertices by decreasing f puts u before v.</p>`],
    ['Strongly connected components in two DFS passes', `<ol><li>Run DFS on G to get finish times.</li><li>Build Gᵀ (every edge reversed). G and Gᵀ have the same SCCs.</li><li>Run DFS on Gᵀ, starting each new tree from the unvisited vertex with the largest finish time. Each tree is one SCC.</li></ol><p>Why: the component containing the latest-finishing vertex is a "source" in the component graph of G, so in Gᵀ no edges leave it, and the second DFS can't escape it. The component graph G<sup>SCC</sup> is always a DAG.</p>`],
    ['Uses', `<ul class="clean"><li>Scheduling tasks with prerequisites (course plans, build systems, spreadsheet recalculation).</li><li>DAG shortest paths in Θ(V + E) (Topic 18): relax edges in topological order.</li><li>Counting paths in a DAG with DP over the topological order.</li><li>SCCs: finding mutually reachable groups (e.g. web pages, deadlock detection, 2-SAT).</li></ul>`]
  ]
};

// ---- t18: single-source shortest paths ----
const GSP = {dij: [vzG({s: [60, 140], t: [230, 50], x: [430, 50], y: [230, 230], z: [430, 230]}, []), [['s', 't'], ['s', 'y'], ['t', 'x'], ['t', 'y'], ['y', 't'], ['y', 'x'], ['y', 'z'], ['x', 'z'], ['z', 'x'], ['z', 's']], [10, 5, 1, 2, 3, 9, 2, 4, 6, 7]],
  bf: [null, [['s', 't'], ['s', 'y'], ['t', 'x'], ['t', 'y'], ['t', 'z'], ['x', 't'], ['y', 'x'], ['y', 'z'], ['z', 's'], ['z', 'x']], [6, 7, 5, 8, -4, -2, -3, 9, 2, 7]]};
VIZ.sssp = {
  title: 'Step-through: Dijkstra and Bellman-Ford', hint: 'Labels above vertices are the estimates v.d; green edges are the current predecessor (π) edges. Dijkstra: green vertices are finished (in S). The default weights are CLRS\'s examples; 🎲 randomizes them.',
  code: o => o.alg === 'dij' ? ['DIJKSTRA(G, w, s)', '  INITIALIZE-SINGLE-SOURCE(G, s)', '  S = ∅;  Q = G.V              // min-priority queue on d', '  while Q ≠ ∅', '      u = EXTRACT-MIN(Q);  S = S ∪ {u}', '      for each v in G.Adj[u]', '          RELAX(u, v, w)        // DECREASE-KEY if d drops', 'RELAX(u, v, w):  if v.d > u.d + w(u, v)', '      v.d = u.d + w(u, v);  v.π = u'] : ['BELLMAN-FORD(G, w, s)', '  INITIALIZE-SINGLE-SOURCE(G, s)', '  for i = 1 to |G.V| − 1', '      for each edge (u, v) in G.E', '          RELAX(u, v, w)', '  for each edge (u, v) in G.E', '      if v.d > u.d + w(u, v)  return FALSE   // negative cycle', '  return TRUE'],
  opts: [{id: 'alg', label: 'Algorithm', val: 'dij', fresh: true, choices: [['dij', 'Dijkstra (w ≥ 0)'], ['bf', 'Bellman-Ford (negative edges)']]}],
  input: o => o.rnd ? GSP[o.alg][2].map(w => o.alg === 'dij' ? rnd(1, 10) : rnd(-3, 9)) : GSP[o.alg][2].slice(),
  run(W, o){ o.rnd = true;
    const E = GSP[o.alg][1].map(([u, v], i) => [u, v, W[i]]), G = {nodes: GSP.dij[0].nodes, edges: E.map(([u, v, w]) => ({u, v, w}))}, ids = G.nodes.map(n => n.id);
    const d = {}, pi = {}, ns = {}, F = []; ids.forEach(i => d[i] = Infinity); d.s = 0;
    const es = () => Object.fromEntries(ids.filter(v => pi[v]).map(v => [pi[v] + '>' + v, 'good']));
    const fr = (msg, line, cur, extra = '') => F.push({msg, line, svg: VZ.wrap(560, 280, VZ.graph(G, {es: {...es(), ...(cur ? {[cur]: 'cur'} : {})}, ns: {...ns}, lab: Object.fromEntries(ids.map(i => [i, vzInf(d[i])]))})), side: vzDT(['d', 'π'], ids, [i => vzInf(d[i]), i => pi[i] || '—']) + extra});
    const relax = (u, v, w, line) => { const k = u + '>' + v; if (d[u] + w < d[v]){ const old = d[v]; d[v] = d[u] + w; pi[v] = u; fr(`Relax ${u}→${v} (w = ${w}): ${vzInf(d[u])} + ${w} = ${d[v]} < ${vzInf(old)}, so update d and π.`, line, k); return true; } fr(`Relax ${u}→${v} (w = ${w}): ${vzInf(d[u])} + ${w} ${d[u] === Infinity ? '' : `= ${d[u] + w} `}is not better than ${vzInf(d[v])}.`, line, k); return false; };
    fr('Initialize: s.d = 0, every other d = ∞, π = NIL.', 1);
    if (o.alg === 'dij'){ const S = new Set();
      while (S.size < ids.length){ const u = ids.filter(i => !S.has(i)).sort((a, b) => d[a] - d[b])[0]; if (d[u] === Infinity) break; S.add(u); ns[u] = 'done';
        fr(`EXTRACT-MIN → ${u} with d = ${d[u]}. Its distance is now final.`, 4, null, `<p class="stat-label">Q = {${ids.filter(i => !S.has(i)).join(', ')}}</p>`);
        E.filter(e => e[0] === u).forEach(([a, b, w]) => relax(a, b, w, [6, 7, 8])); }
      fr('Done. Each vertex left the queue once; with a binary heap the total is O((V + E) lg V).', undefined);
    } else { const n = ids.length;
      for (let i = 1; i < n; i++){ let ch = 0; fr(`Pass ${i} of |V| − 1 = ${n - 1}: relax every edge once.`, 2); E.forEach(([u, v, w]) => { if (d[u] !== Infinity || i === 1) ch += relax(u, v, w, 4) ? 1 : 0; }); if (!ch){ fr(`Nothing changed in pass ${i}, so later passes would not change anything either.`, 2); break; } }
      const bad = E.find(([u, v, w]) => d[u] + w < d[v]);
      fr(bad ? `Check: ${bad[0]}→${bad[1]} can still be relaxed ⇒ a negative-weight cycle is reachable. Return FALSE.` : 'Final check: no edge can be relaxed, so there is no reachable negative cycle and every d is a true shortest distance. Θ(VE).', [5, 6, 7]); }
    return F;
  }
};
DEEP.t18 = {
  viz: ['sssp'],
  cx: [['BELLMAN-FORD', 'Θ(E) with early exit', 'Θ(VE)', 'Θ(VE)', 'Θ(V)', '|V| − 1 passes over all edges; detects negative cycles'], ['DAG-SHORTEST-PATHS', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V + E)', 'Θ(V)', 'relax edges in topological order; negative weights OK'], ['DIJKSTRA (binary heap)', 'O((V + E) lg V)', '', 'O((V + E) lg V)', 'Θ(V)', 'V EXTRACT-MINs + up to E DECREASE-KEYs'], ['DIJKSTRA (array, dense graphs)', 'Θ(V²)', '', 'Θ(V²)', 'Θ(V)', 'linear-scan minimum; best when E ≈ V²'], ['DIJKSTRA (Fibonacci heap)', 'O(V lg V + E)', '', 'O(V lg V + E)', 'Θ(V)', 'O(1) amortized DECREASE-KEY'], ['BFS (unit weights)', 'Θ(V + E)', '', 'Θ(V + E)', 'Θ(V)', 'Topic 14A']],
  deep: [
    ['Properties every algorithm relies on', `<ul class="clean"><li><b>Optimal substructure:</b> any subpath of a shortest path is a shortest path.</li><li><b>Triangle inequality:</b> δ(s, v) ≤ δ(s, u) + w(u, v).</li><li><b>Upper-bound property:</b> v.d ≥ δ(s, v) always, and once equal it never changes.</li><li><b>Path-relaxation property:</b> if the edges of a shortest path are relaxed in order (with anything else mixed in), the last vertex gets the right d. Bellman-Ford's |V| − 1 passes guarantee this because a shortest path has at most |V| − 1 edges.</li></ul>`],
    ['Why Dijkstra needs non-negative weights', `<p>Dijkstra finalizes u when it is the closest unfinished vertex, assuming no later path can come back cheaper. With a negative edge it can: s→a (2), s→b (3), b→a (−2). Dijkstra finalizes a with d = 2 but the true distance is 1. Adding a constant to every weight does not fix this, because it penalizes paths with more edges. Johnson's algorithm (Topic 19) reweights correctly using Bellman-Ford potentials.</p>`],
    ['Negative cycles', `<p>If a negative-weight cycle is reachable from s, distances to anything reachable from it are −∞ (go around once more). Bellman-Ford detects this with one extra pass. Unreachable negative cycles don't matter. Shortest paths are simple only when no negative cycles exist; then they have at most |V| − 1 edges.</p>`],
    ['DAG shortest paths, and longest paths', `<p>In a DAG, relax every vertex's outgoing edges in topological order: each edge once, Θ(V + E), even with negative weights. Negating weights gives longest paths in a DAG (critical-path scheduling, PERT charts). In general graphs longest simple path is NP-hard (Topic 24).</p>`]
  ]
};

// ---- t19: Floyd-Warshall ----
const FW_E = [[1, 2, 3], [1, 3, 8], [1, 5, -4], [2, 4, 1], [2, 5, 7], [3, 2, 4], [4, 1, 2], [4, 3, -5], [5, 4, 6]];
VIZ.fw = {
  title: 'Step-through: Floyd-Warshall', hint: 'D<sup>(k)</sup>[i, j] = shortest i→j distance using only intermediate vertices 1..k. Yellow = row k and column k (the only values used this round); green = an entry that just improved. Default graph is CLRS\'s 5-vertex example; 🎲 randomizes the weights.',
  code: ['FLOYD-WARSHALL(W, n)', '  D⁽⁰⁾ = W', '  for k = 1 to n', '      for i = 1 to n', '          for j = 1 to n', '              d[i, j] = min(d[i, j], d[i, k] + d[k, j])', '  return D⁽ⁿ⁾'],
  input: () => FW_E.map(e => e[2]), run(W){
    const n = 5, D = Array.from({length: n}, (_, i) => Array.from({length: n}, (_, j) => i === j ? 0 : Infinity)), F = [];
    FW_E.forEach(([u, v], i) => D[u - 1][v - 1] = W[i]);
    const idx = [1, 2, 3, 4, 5], fr = (msg, line, hl = {}, k) => F.push({msg, line, tag: k ? `k = ${k}` : '', svg: VZ.wrap(560, 260, VZ.grid(D.map(r => r.slice()), {x: 160, y: 50, cw: 56, ch: 36, rows: idx, cols: idx, fmt: vzInf, hl, title: k ? `D(${k})` : 'D(0) = W'}))});
    fr(`D(0) is the weight matrix: edges ${FW_E.map(([u, v], i) => `${u}→${v} (${W[i]})`).join(', ')}.`, 1);
    for (let k = 0; k < n; k++){ const base = {}; for (let t = 0; t < n; t++){ base[k + ',' + t] = 'warn'; base[t + ',' + k] = 'warn'; } const ch = {}; let msgs = [];
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (D[i][k] + D[k][j] < D[i][j]){ msgs.push(`d[${i + 1},${j + 1}]: ${vzInf(D[i][j])} → ${D[i][k] + D[k][j]}`); D[i][j] = D[i][k] + D[k][j]; ch[i + ',' + j] = 'good'; }
      fr(`k = ${k + 1}: allow paths through vertex ${k + 1}. ${msgs.length ? 'Improved ' + msgs.join('; ') + '.' : 'Nothing improves.'}`, [2, 5], {...base, ...ch}, k + 1); }
    const neg = D.some((r, i) => r[i] < 0);
    fr(neg ? 'A negative value on the diagonal means a negative-weight cycle.' : 'D(5) holds every shortest distance. Three nested loops: Θ(n³) time, Θ(n²) space (one matrix can be updated in place).', 6);
    return F;
  }
};
VIZ.fw.opts = [{id: 'w', label: 'Weights', val: 'clrs', fresh: true, choices: [['clrs', 'CLRS example'], ['rand', 'random non-negative']]}];
VIZ.fw.input = o => o.w === 'rand' ? FW_E.map(() => rnd(1, 9)) : FW_E.map(e => e[2]);
DEEP.t19 = {
  viz: ['fw'],
  cx: [['Run Dijkstra from every vertex (binary heap)', 'O(V(V + E) lg V)', '', 'O(VE lg V)', 'Θ(V²) output', 'non-negative weights only'], ['Run Bellman-Ford from every vertex', 'Θ(V²E)', '', 'Θ(V²E)', 'Θ(V²)', 'Θ(V⁴) on dense graphs'], ['Repeated squaring (min-plus products)', 'Θ(V³ lg V)', '', 'Θ(V³ lg V)', 'Θ(V²)', 'lg V "matrix multiplications"'], ['FLOYD-WARSHALL', 'Θ(V³)', 'Θ(V³)', 'Θ(V³)', 'Θ(V²)', 'negative edges OK, no negative cycles'], ['JOHNSON', 'O(VE lg V)', '', 'O(VE lg V)', 'Θ(V²)', 'Bellman-Ford once + Dijkstra V times; best for sparse graphs'], ['Transitive closure', 'Θ(V³)', '', 'Θ(V³)', 'Θ(V²) bits', 'Floyd-Warshall with OR/AND']],
  deep: [
    ['The Floyd-Warshall recurrence', `<p>Consider a shortest path from i to j whose intermediate vertices all lie in {1, …, k}. Either it doesn't use k (then it's d<sup>(k−1)</sup>[i, j]) or it uses k exactly once, splitting into i ⇝ k and k ⇝ j, each using only {1, …, k−1}:</p><p class="math" style="text-align:center">d<sup>(k)</sup>[i, j] = min(d<sup>(k−1)</sup>[i, j], d<sup>(k−1)</sup>[i, k] + d<sup>(k−1)</sup>[k, j])</p><p>Row k and column k don't change during round k (d[i, k] + d[k, k] = d[i, k] when d[k, k] = 0), which is why updating a single matrix in place is safe.</p>`],
    ['Recovering the paths', `<p>Keep a predecessor matrix Π: π[i, j] = the vertex before j on a shortest i→j path. Update it whenever the min picks the "through k" option: π[i, j] = π[k, j]. Print a path recursively from π, like PRINT-PATH for BFS. Alternatively store "next hop" values for routing tables.</p>`],
    ['Johnson\'s reweighting trick', `<ol><li>Add a new vertex s with 0-weight edges to every vertex; run Bellman-Ford from s to get h(v) = δ(s, v) (or detect a negative cycle).</li><li>Reweight: ŵ(u, v) = w(u, v) + h(u) − h(v). By the triangle inequality ŵ ≥ 0, and every u→v path changes by the same h(u) − h(v), so shortest paths are preserved.</li><li>Run Dijkstra from every vertex with ŵ, then convert back: δ(u, v) = δ̂(u, v) − h(u) + h(v).</li></ol>`],
    ['Which all-pairs algorithm to use', `${vzTbl(['Graph', 'Choose', 'Cost'], [['Dense, any weights (no negative cycles)', 'Floyd-Warshall', 'Θ(V³), tiny constants'], ['Sparse, non-negative', 'Dijkstra from each vertex', 'O(VE lg V)'], ['Sparse, some negative edges', 'Johnson', 'O(VE lg V)'], ['Unweighted', 'BFS from each vertex', 'Θ(V(V + E))']])}`]
  ]
};

// ======================= DEEP DIVES · FINAL =======================
// ---- t20: max flow ----
const GMF = {pos: {s: [50, 140], a: [200, 50], b: [200, 230], c: [380, 50], d: [380, 230], t: [520, 140]}, E: [['s', 'a', 16], ['s', 'b', 13], ['b', 'a', 4], ['a', 'c', 12], ['c', 'b', 9], ['b', 'd', 14], ['d', 'c', 7], ['c', 't', 20], ['d', 't', 4]]};
VIZ.flow = {
  title: 'Step-through: Edmonds-Karp (Ford-Fulkerson with BFS)', hint: 'Edge labels are flow/capacity. Each round, BFS finds a shortest augmenting path in the residual network (yellow), and we push its bottleneck amount. At the end, cyan vertices are the source side of a minimum cut (red edges). Default network is CLRS\'s example; 🎲 randomizes capacities.',
  code: ['FORD-FULKERSON(G, s, t)', '  for each edge (u, v):  (u, v).f = 0', '  while there is a path p from s to t in the residual network G_f', '      c_f(p) = min{ c_f(u, v) : (u, v) in p }     // bottleneck', '      for each edge (u, v) in p', '          if (u, v) ∈ E:  (u, v).f += c_f(p)        // push forward', '          else  (v, u).f −= c_f(p)                  // cancel flow', '// Edmonds-Karp: always pick p with BFS (fewest edges)'],
  input: o => o.rnd ? GMF.E.map(() => rnd(2, 16)) : GMF.E.map(e => e[2]),
  run(cap){ const o = arguments[1]; o.rnd = true;
    const E = GMF.E.map(([u, v], i) => ({u, v, c: cap[i], f: 0})), g = vzG(GMF.pos, E.map(e => [e.u, e.v])), F = []; let total = 0;
    const draw = (es = {}, ns = {}) => VZ.wrap(560, 280, VZ.graph(g, {es, ns, elab: Object.fromEntries(E.map(e => [e.u + '>' + e.v, e.f + '/' + e.c])), lab: {s: 'source', t: 'sink'}}));
    const side = () => `<p>|f| = <b>${total}</b></p><p class="stat-label">Residual capacity: forward c − f, backward f.</p>`;
    F.push({svg: draw(), side: side(), line: 1, msg: 'Start with zero flow everywhere.'});
    for (let round = 1; round < 40; round++){
      const prev = {s: null}, Q = ['s'];
      while (Q.length && !('t' in prev)){ const x = Q.shift(); for (const e of E){ if (e.u === x && e.c - e.f > 0 && !(e.v in prev)){ prev[e.v] = [e, 1]; Q.push(e.v); } if (e.v === x && e.f > 0 && !(e.u in prev)){ prev[e.u] = [e, -1]; Q.push(e.u); } } }
      if (!('t' in prev)){ const S = Object.keys(prev), ns = Object.fromEntries(S.map(v => [v, 'cy'])), es = {}; let cut = 0; E.forEach(e => { if (S.includes(e.u) && !S.includes(e.v)){ es[e.u + '>' + e.v] = 'bad'; cut += e.c; } });
        F.push({svg: draw(es, ns), side: side(), line: 2, tag: 'done', msg: `No augmenting path left, so the flow is maximum: |f| = ${total}. The vertices still reachable from s in G_f ({${S.join(', ')}}) form a cut whose red edges have total capacity ${cut} = |f|. Max-flow = min-cut.`}); break; }
      const path = []; let x = 't'; while (x !== 's'){ const [e, dir] = prev[x]; path.unshift([e, dir]); x = dir === 1 ? e.u : e.v; }
      const b = Math.min(...path.map(([e, dir]) => dir === 1 ? e.c - e.f : e.f)), es = Object.fromEntries(path.map(([e]) => [e.u + '>' + e.v, 'cur']));
      const names = ['s', ...path.map(([e, dir]) => dir === 1 ? e.v : e.u)];
      F.push({svg: draw(es), side: side(), line: [2, 3], msg: `Round ${round}: BFS finds ${names.join(' → ')} (${path.length} edges). Bottleneck c_f(p) = ${b}.${path.some(([, d]) => d < 0) ? ' It uses a backward residual edge, which cancels earlier flow.' : ''}`});
      path.forEach(([e, dir]) => e.f += dir * b); total += b;
      F.push({svg: draw(Object.fromEntries(path.map(([e]) => [e.u + '>' + e.v, 'good']))), side: side(), line: [4, 5, 6], msg: `Push ${b} along the path. |f| = ${total}.`});
    }
    return F;
  }
};
DEEP.t20 = {
  viz: ['flow'],
  cx: [['FORD-FULKERSON (integer capacities)', '', '', 'O(E · |f*|)', 'Θ(V + E)', 'each augmentation adds ≥ 1; each costs O(E)'], ['EDMONDS-KARP', '', '', 'O(VE²)', 'Θ(V + E)', 'O(VE) augmentations, each a BFS in O(E)'], ['Find a min cut from a max flow', 'Θ(V + E)', '', 'Θ(V + E)', '', 'BFS/DFS from s in G_f'], ['Maximum bipartite matching', '', '', 'O(VE)', 'Θ(V + E)', 'unit capacities: |f*| ≤ V/2']],
  deep: [
    ['Flow rules and the residual network', `<ul class="clean"><li><b>Capacity constraint:</b> 0 ≤ f(u, v) ≤ c(u, v).</li><li><b>Flow conservation:</b> at every vertex except s and t, flow in = flow out.</li><li><b>Residual capacity:</b> c<sub>f</sub>(u, v) = c(u, v) − f(u, v) for an edge of G, and c<sub>f</sub>(v, u) = f(u, v) for its reverse. The reverse edge lets a later path "undo" a poor earlier choice.</li><li>CLRS assumes no antiparallel edges; if both (u, v) and (v, u) exist, split one with a new vertex.</li></ul>`],
    ['Max-flow min-cut theorem', `<p>For a flow f these are equivalent: (1) f is a maximum flow; (2) G<sub>f</sub> has no augmenting path; (3) |f| = c(S, T) for some cut. The easy half: any flow's value equals the net flow across <i>any</i> cut, which is at most that cut's capacity. So when an augmenting-path search fails, the reachable set S gives a cut with c(S, T) = |f|, proving optimality.</p>`],
    ['Why the choice of path matters', `<p>With arbitrary paths and capacities like 1,000,000 around a middle edge of capacity 1, Ford-Fulkerson can alternate through the middle edge and take 2,000,000 augmentations. With irrational capacities it may not even terminate. Edmonds-Karp's BFS rule makes the shortest-path distance to each vertex in G<sub>f</sub> non-decreasing, and each edge can be critical at most O(V) times, giving O(VE) augmentations.</p>`],
    ['Reductions to max flow', `<ul class="clean"><li><b>Bipartite matching:</b> source → every left vertex, left → right edges, every right vertex → sink, all capacity 1. An integer max flow is a maximum matching (integrality theorem).</li><li><b>Multiple sources/sinks:</b> add a supersource and supersink with infinite-capacity edges.</li><li><b>Vertex capacities:</b> split v into v<sub>in</sub> → v<sub>out</sub> with that capacity.</li><li><b>Edge-disjoint paths:</b> unit capacities; max flow = number of disjoint s–t paths.</li></ul>`]
  ]
};

// ---- t24: 3-CNF-SAT ≤p CLIQUE ----
VIZ.sat2clique = {
  title: 'Step-through: the reduction 3-CNF-SAT ≤ₚ CLIQUE', hint: 'One vertex per literal, grouped by clause. Connect two literals when they are in different clauses and don\'t contradict each other. A k-clique (k = number of clauses) exists exactly when the formula is satisfiable.',
  code: ['REDUCE(φ = C₁ ∧ … ∧ C_k)', '  for each clause C_r = (l₁ ∨ l₂ ∨ l₃):  add vertices v_r1, v_r2, v_r3', '  add edge (v_ri, v_sj) if r ≠ s and l_ri is not the negation of l_sj', '  return ⟨G, k⟩', '// φ satisfiable ⇔ G has a clique of size k'],
  input: () => Array.from({length: 3}, () => shuffle([1, 2, 3]).map(v => Math.random() < .5 ? v : -v)),
  parse: s => { const cl = s.split(/[;|]/).map(c => c.trim()).filter(Boolean).map(c => c.split(/[\s,]+/).filter(Boolean).map(Number)); if (cl.length < 2 || cl.length > 3 || cl.some(c => c.length !== 3 || c.some(v => !v || Math.abs(v) > 3))) throw new Error('2–3 clauses separated by ";", each three literals from ±1..±3, e.g. 1 -2 3; -1 2 3; 1 2 -3'); return cl; },
  fmt: cl => cl.map(c => c.join(' ')).join('; '),
  run(cl){
    const k = cl.length, L = v => (v < 0 ? '¬' : '') + 'x' + Math.abs(v), fml = cl.map(c => '(' + c.map(L).join(' ∨ ') + ')').join(' ∧ ');
    const pos = {}, lit = {}; cl.forEach((c, r) => c.forEach((v, i) => { const id = (r + 1) + 'abc'[i]; lit[id] = v; const ang = (r / k) * 2 * Math.PI - Math.PI / 2 + (i - 1) * .42; pos[id] = [280 + 190 * Math.cos(ang), 150 + 100 * Math.sin(ang)]; }));
    const ids = Object.keys(pos), edges = []; ids.forEach((a, x) => ids.slice(x + 1).forEach(b => { if (a[0] !== b[0] && lit[a] !== -lit[b]) edges.push([a, b]); }));
    const F = [], lab = Object.fromEntries(ids.map(i => [i, L(lit[i])]));
    const fr = (shown, msg, line, ns = {}, es = {}) => F.push({msg, line, side: `<p style="font-family:var(--mono)">φ = ${fml}</p><p class="stat-label">k = ${k} · vertices: ${ids.length} · edges: ${shown.length}</p>`, svg: VZ.wrap(560, 280, VZ.graph(vzG(pos, shown), {directed: false, lab, ns, es}))});
    fr([], `Create 3 vertices per clause (labels show the literal). Vertex "2b" is clause 2, second literal.`, 1);
    for (let r = 1; r <= k; r++) for (let s = r + 1; s <= k; s++){ const add = edges.filter(([a, b]) => +a[0] === r && +b[0] === s); fr(edges.filter(([a, b]) => +a[0] < r || (+a[0] === r && +b[0] <= s)), `Connect clause ${r} to clause ${s}: ${add.length} edges (all pairs except contradictory ones like x1 / ¬x1).`, 2); }
    let clique = null; const by = r => ids.filter(i => +i[0] === r);
    const rec = (r, pick) => { if (clique) return; if (r > k){ clique = pick; return; } for (const v of by(r)) if (pick.every(u => lit[u] !== -lit[v])) rec(r + 1, [...pick, v]); }; rec(1, []);
    if (clique){ const ns = Object.fromEntries(clique.map(v => [v, 'good'])), es = {}; clique.forEach((a, x) => clique.slice(x + 1).forEach(b => es[a + '>' + b] = 'good')); const asg = {}; clique.forEach(v => asg[Math.abs(lit[v])] = lit[v] > 0);
      fr(edges, `A ${k}-clique: ${clique.map(v => lab[v]).join(', ')}, one literal per clause, no contradictions. Setting those literals true satisfies φ: ${[1, 2, 3].map(i => `x${i} = ${i in asg ? (asg[i] ? 'T' : 'F') : 'any'}`).join(', ')}.`, 4, ns, es); }
    else fr(edges, `No ${k}-clique exists, so φ is unsatisfiable (and vice versa).`, 4);
    fr(edges, `The construction takes O(k²) time, polynomial in the size of φ. Since 3-CNF-SAT is NP-complete and CLIQUE ∈ NP (a certificate is the clique, checked in O(k²)), CLIQUE is NP-complete.`, 3);
    return F;
  }
};
DEEP.t24 = {
  viz: ['sat2clique'],
  cxHead: ['Problem', 'Certificate', 'Verify in', 'NP-complete via'],
  cx: [['CIRCUIT-SAT', 'input wire values', 'O(circuit size)', 'first NP-complete problem (Theorem 34.7)'], ['SAT', 'truth assignment', 'O(|φ|)', 'CIRCUIT-SAT ≤ₚ SAT'], ['3-CNF-SAT', 'truth assignment', 'O(|φ|)', 'SAT ≤ₚ 3-CNF-SAT'], ['CLIQUE', 'the k vertices', 'O(k²)', '3-CNF-SAT ≤ₚ CLIQUE'], ['VERTEX-COVER', 'the cover', 'O(E)', 'CLIQUE ≤ₚ VERTEX-COVER (complement graph)'], ['HAM-CYCLE', 'the vertex order', 'O(V)', 'VERTEX-COVER ≤ₚ HAM-CYCLE'], ['TSP (decision)', 'the tour', 'O(V)', 'HAM-CYCLE ≤ₚ TSP'], ['SUBSET-SUM', 'the subset', 'O(n)', '3-CNF-SAT ≤ₚ SUBSET-SUM']],
  deep: [
    ['P, NP, NP-hard, NP-complete', `<ul class="clean"><li><b>P:</b> decision problems solvable in O(n<sup>k</sup>) time.</li><li><b>NP:</b> a "yes" answer has a certificate checkable in polynomial time. P ⊆ NP.</li><li><b>NP-hard:</b> every problem in NP reduces to it.</li><li><b>NP-complete:</b> NP-hard and in NP. If any NP-complete problem has a polynomial algorithm, then P = NP.</li></ul>`],
    ['How to prove a new problem B is NP-complete', `<ol><li>Show B ∈ NP: describe the certificate and a polynomial-time verifier.</li><li>Pick a known NP-complete A and give a polynomial-time f with x ∈ A ⇔ f(x) ∈ B.</li><li>Prove both directions of ⇔ and that f is polynomial.</li></ol><p><b>Direction matters:</b> reduce the known hard problem <i>to</i> the new one (A ≤ₚ B). Reducing B to a hard problem shows nothing about B's hardness.</p>`],
    ['Why the clique reduction is correct', `<p>(⇒) A satisfying assignment makes at least one literal per clause true; pick one per clause. Two true literals can't be x and ¬x, so all pairs are connected: a k-clique. (⇐) A k-clique has exactly one vertex per clause (same-clause vertices are never adjacent) and no contradictory pair, so setting those literals true is a consistent assignment satisfying every clause.</p>`],
    ['Decision vs optimization; easy look-alikes', `${vzTbl(['Easy (in P)', 'Hard (NP-complete)'], [['shortest simple path', 'longest simple path'], ['Euler tour (each edge once)', 'Hamiltonian cycle (each vertex once)'], ['2-CNF satisfiability', '3-CNF satisfiability'], ['MST', 'TSP']])}<p>NP-completeness is stated for decision problems ("is there a tour of cost ≤ k?"); the optimization version is at least as hard.</p>`]
  ]
};

// ---- t25: approximation ----
VIZ.avc = {
  title: 'Step-through: APPROX-VERTEX-COVER (2-approximation)', hint: 'Pick any remaining edge, put both endpoints in the cover, and delete every edge they touch. The picked edges form a matching, which is why the result is at most twice the optimum.',
  code: ['APPROX-VERTEX-COVER(G)', '  C = ∅;  E′ = G.E', '  while E′ ≠ ∅', '      let (u, v) be an arbitrary edge of E′', '      C = C ∪ {u, v}', '      remove from E′ every edge incident on u or v', '  return C'],
  input: () => { const n = 8, E = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.random() < .3) E.push([i, j]); for (let i = 0; i < n; i++) if (!E.some(e => e.includes(i))) E.push([i, (i + 1) % n].sort((a, b) => a - b)); return E; },
  run(E){
    const n = 8, ids = 'ABCDEFGH'.split(''), pos = Object.fromEntries(ids.map((id, i) => [id, [280 + 200 * Math.cos(i * Math.PI / 4 - Math.PI / 2), 140 + 115 * Math.sin(i * Math.PI / 4 - Math.PI / 2)]])), g = vzG(pos, E.map(([a, b]) => [ids[a], ids[b]]));
    let best = n; for (let m = 0; m < 1 << n; m++){ const c = m.toString(2).split('1').length - 1; if (c < best && E.every(([a, b]) => m >> a & 1 || m >> b & 1)) best = c; }
    const C = new Set(), alive = new Set(E.map((_, i) => i)), F = [], es = {}, ns = {};
    const fr = (msg, line, cur) => F.push({msg, line, side: `<p>Cover so far: <b>{${[...C].map(i => ids[i]).join(', ')}}</b> (${C.size})</p><p class="stat-label">Optimal cover size (brute force over 2<sup>8</sup> subsets): <b>${best}</b> · guarantee: ≤ ${2 * best}</p>`, svg: VZ.wrap(560, 280, VZ.graph(g, {directed: false, es: {...es, ...(cur ? {[cur]: 'cur'} : {})}, ns: {...ns}}))});
    fr(`${E.length} edges. Every edge needs at least one endpoint in the cover.`, 1);
    while (alive.size){ const i = [...alive][rnd(0, alive.size - 1)], [u, v] = E[i], k = ids[u] + '>' + ids[v];
      fr(`Pick edge ${ids[u]}–${ids[v]}.`, 3, k); C.add(u); C.add(v); ns[ids[u]] = ns[ids[v]] = 'good'; es[k] = 'good';
      const gone = [...alive].filter(j => E[j].includes(u) || E[j].includes(v)); gone.forEach(j => { alive.delete(j); if (j !== i) es[ids[E[j][0]] + '>' + ids[E[j][1]]] = 'bad'; });
      fr(`Add ${ids[u]} and ${ids[v]}; ${gone.length - 1} other edge${gone.length === 2 ? ' is' : 's are'} now covered (dashed).`, [4, 5]); }
    fr(`Cover of size ${C.size}; optimum is ${best} (ratio ${(C.size / best).toFixed(2)} ≤ 2). Green edges share no endpoints, and any cover must contain an endpoint of each, so OPT ≥ |picked edges| = |C| / 2. O(V + E) time.`, 6);
    return F;
  }
};
DEEP.t25 = {
  viz: ['avc'],
  cxHead: ['Problem', 'Algorithm', 'Ratio', 'Time'],
  cx: [['Vertex cover', 'APPROX-VERTEX-COVER (maximal matching)', '2', 'O(V + E)'], ['Metric TSP (triangle inequality)', 'MST + preorder walk (APPROX-TSP-TOUR)', '2', 'O(V²) on a complete graph'], ['General TSP', 'none possible unless P = NP', '—', '—'], ['Set cover', 'GREEDY-SET-COVER', 'H(max |S|) ≤ ln |X| + 1', 'polynomial'], ['MAX-3-CNF (random assignment)', 'set each variable true with prob. 1/2', '8/7 expected', 'O(n)'], ['Weighted vertex cover', 'LP relaxation + rounding x ≥ 1/2', '2', 'polynomial (LP)'], ['Subset sum (optimization)', 'FPTAS: trim lists by δ = ε/2n', '1 + ε', 'polynomial in n and 1/ε']],
  deep: [
    ['What a ratio bound means', `<p>An algorithm is a ρ(n)-approximation if its cost C satisfies max(C / C*, C* / C) ≤ ρ(n) on every input of size n, where C* is the optimum. For minimization: C ≤ ρ·C*. The proof always needs a <b>lower bound on OPT</b> you can compare against without knowing OPT (a matching for vertex cover, an MST for TSP).</p>`],
    ['Metric TSP in a factor of 2', `<ol><li>Compute an MST T (Topic 17). Removing one edge from an optimal tour gives a spanning tree, so c(T) ≤ c(H*).</li><li>A full walk around T visits every edge twice: cost 2c(T).</li><li>Shortcut repeated vertices (preorder order). By the triangle inequality shortcuts never increase cost: c(H) ≤ 2c(T) ≤ 2c(H*).</li></ol><p>Without the triangle inequality, a constant-factor approximation would let us solve HAM-CYCLE, so none exists unless P = NP.</p>`],
    ['Greedy set cover', `<p>Repeatedly pick the set covering the most still-uncovered elements. Charging each pick's cost of 1 equally to the elements it newly covers, an optimal solution's set S can be charged at most H(|S|) in total, giving ratio H(max |S|) = O(lg n). This is essentially the best possible in polynomial time.</p>`],
    ['Randomization and LP rounding', `<ul class="clean"><li><b>MAX-3-CNF:</b> each clause with 3 distinct literals is unsatisfied with probability 1/8, so the expected number satisfied is 7/8 of all clauses (indicator variables again, Topic 5A).</li><li><b>Weighted vertex cover:</b> solve the LP relaxation with 0 ≤ x(v) ≤ 1 and x(u) + x(v) ≥ 1; take every v with x(v) ≥ 1/2. Each edge is covered, and the weight is at most twice the LP value, which is ≤ OPT.</li></ul>`]
  ]
};

// ---- t22: parallel algorithms (greedy scheduler) ----
VIZ.sched = {
  title: 'Step-through: a greedy scheduler on a computation DAG', hint: 'Each vertex is a unit-time strand; an edge means "must finish first". Every step, a greedy scheduler runs as many ready strands as it has processors. Compare the steps taken with the bounds max(T₁/P, T∞) ≤ T_P ≤ T₁/P + T∞.',
  code: ['GREEDY-SCHEDULE(DAG, P)', '  while some strand is unfinished', '      R = strands whose predecessors are all finished', '      if |R| ≥ P:  run any P of them        // complete step', '      else  run all of R                    // incomplete step', '// complete steps ≤ T₁/P, incomplete steps ≤ T∞'],
  opts: [{id: 'P', label: 'Processors P', val: '2', choices: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']]}],
  input: () => { const L = [1, rnd(2, 3), rnd(3, 4), rnd(2, 4), rnd(1, 3), 1], N = []; L.forEach((c, l) => { for (let i = 0; i < c; i++) N.push({l, i, c}); });
    const E = []; N.forEach((v, j) => { if (!v.l) return; const prev = N.map((u, k) => [u, k]).filter(([u]) => u.l === v.l - 1); const ps = shuffle(prev).slice(0, rnd(1, Math.min(2, prev.length))); ps.forEach(([, k]) => E.push([k, j])); });
    N.forEach((v, k) => { if (v.l < 5 && !E.some(e => e[0] === k)){ const nx = N.map((u, j) => [u, j]).filter(([u]) => u.l === v.l + 1); E.push([k, pick(nx)[1]]); } }); return {N, E}; },
  run({N, E}, o){
    const P = +o.P, n = N.length, ids = N.map((_, i) => String(i + 1)), pos = Object.fromEntries(N.map((v, i) => [ids[i], [40 + v.l * 96, 140 + (v.i - (v.c - 1) / 2) * 62]])), g = vzG(pos, E.map(([a, b]) => [ids[a], ids[b]]));
    const depth = Array(n).fill(1); N.forEach((_, j) => E.filter(e => e[1] === j).forEach(([a]) => depth[j] = Math.max(depth[j], depth[a] + 1)));
    const T1 = n, Tinf = Math.max(...depth), done = new Set(), F = []; let step = 0, comp = 0, inc = 0;
    const ns = {}, fr = (msg, line, run = []) => F.push({msg, line, svg: VZ.wrap(560, 290, VZ.graph(g, {ns: {...ns, ...Object.fromEntries(run.map(i => [ids[i], 'cur']))}, sub: Object.fromEntries(N.map((_, i) => [ids[i], done.has(i) ? '' : '']))})),
      side: `<p>Work T₁ = <b>${T1}</b> · span T∞ = <b>${Tinf}</b> · parallelism T₁/T∞ = <b>${(T1 / Tinf).toFixed(2)}</b></p><p>Step <b>${step}</b> · complete steps ${comp} · incomplete steps ${inc}</p><p class="stat-label">Lower bound max(⌈T₁/P⌉, T∞) = ${Math.max(Math.ceil(T1 / P), Tinf)} · greedy upper bound T₁/P + T∞ = ${(T1 / P + Tinf).toFixed(1)}</p>`});
    fr(`${n} strands. The longest path has ${Tinf} strands (span), so even infinitely many processors need ${Tinf} steps.`, 0);
    while (done.size < n){ const R = ids.map((_, i) => i).filter(i => !done.has(i) && E.filter(e => e[1] === i).every(([a]) => done.has(a))); const run = R.slice(0, P); step++; if (R.length >= P) comp++; else inc++;
      run.forEach(i => { ns[ids[i]] = 'cy'; }); fr(`Step ${step}: ${R.length} ready (${R.map(i => ids[i]).join(', ')}). ${R.length >= P ? `Complete step: run ${P}.` : `Incomplete step: run all ${R.length}${P > 1 ? `, ${P - R.length} processor${P - R.length > 1 ? 's' : ''} idle` : ''}.`}`, R.length >= P ? 3 : 4, run);
      run.forEach(i => { done.add(i); ns[ids[i]] = 'done'; }); }
    fr(`Finished in T_P = ${step} steps with P = ${P}. ${step <= T1 / P + Tinf ? '✓' : '✗'} within T₁/P + T∞ = ${(T1 / P + Tinf).toFixed(1)}; speedup T₁/T_P = ${(T1 / step).toFixed(2)}.`, 5);
    return F;
  }
};
DEEP.t22 = {
  viz: ['sched'],
  cxHead: ['Algorithm', 'Work T₁', 'Span T∞', 'Parallelism T₁/T∞'],
  cx: [['P-FIB(n)', 'Θ(φⁿ)', 'Θ(n)', 'Θ(φⁿ / n)'], ['parallel for over n iterations (each O(1))', 'Θ(n)', 'Θ(lg n)', 'Θ(n / lg n)'], ['P-MAT-VEC (n × n)', 'Θ(n²)', 'Θ(n)', 'Θ(n)'], ['P-MATRIX-MULTIPLY (loops, serial inner sum)', 'Θ(n³)', 'Θ(n)', 'Θ(n²)'], ['P-MATRIX-MULTIPLY-RECURSIVE', 'Θ(n³)', 'Θ(lg² n)', 'Θ(n³ / lg² n)'], ['P-MERGE-SORT (parallel merge)', 'Θ(n lg n)', 'Θ(lg³ n)', 'Θ(n / lg² n)']],
  cxNote: 'Work law: T_P ≥ T₁/P. Span law: T_P ≥ T∞. Greedy scheduler: T_P ≤ T₁/P + T∞, so it is near-optimal whenever the parallelism is much larger than P (slackness).',
  deep: [
    ['Work, span, and how they combine', `<ul class="clean"><li><b>Work T₁:</b> total number of strands = running time on one processor.</li><li><b>Span T∞:</b> length of the longest path in the DAG = running time with unlimited processors.</li><li>Run A then B in series: work adds, span adds.</li><li>Spawn A and B in parallel: work adds, span is the <b>max</b>.</li></ul><p>P-FIB(n) spawns P-FIB(n−1) and calls P-FIB(n−2): T₁(n) = T₁(n−1) + T₁(n−2) + Θ(1) = Θ(φⁿ); T∞(n) = max(T∞(n−1), T∞(n−2)) + Θ(1) = Θ(n).</p>`],
    ['Why greedy scheduling is within 2× of optimal', `<p>Every step is <b>complete</b> (P strands run) or <b>incomplete</b> (all ready strands run). There are at most T₁/P complete steps, since each does P units of work. Each incomplete step runs every ready strand, which shortens the longest remaining path by 1, so there are at most T∞ of them. Hence T_P ≤ T₁/P + T∞ ≤ 2·max(T₁/P, T∞) ≤ 2·optimal.</p>`],
    ['Parallel loops and races', `<p><code>parallel for</code> is implemented by recursive halving of the range with spawns, adding Θ(lg n) span. A <b>determinacy race</b> happens when two logically parallel strands access the same location and at least one writes, e.g. both doing <code>x = x + 1</code>: the answer can be 1 instead of 2. Fix it by giving each strand its own output location (as P-MAT-VEC does with y[i]) or by restructuring into a reduction.</p>`],
    ['Speedup and parallelism', `<p>Speedup T₁/T_P is at most P (work law) and at most T₁/T∞ (span law). Adding processors beyond the parallelism T₁/T∞ cannot help. Rule of thumb: aim for parallelism at least ~10× the number of processors so the T∞ term is negligible.</p>`]
  ]
};


// ---------- utilities ----------
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function shuffle(a){ a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// ---------- graph algorithms ----------
function kruskalSteps(nodes, edges){
  const parent = {}, rank = {};
  nodes.forEach(n => { parent[n.id] = n.id; rank[n.id] = 0; });
  const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
  const sorted = edges.map((e, i) => ({...e, i})).sort((a, b) => a.w - b.w || a.i - b.i);
  const steps = []; const acc = []; let total = 0;
  for (const e of sorted){
    const ru = find(e.u), rv = find(e.v);
    const ok = ru !== rv;
    if (ok){
      if (rank[ru] > rank[rv]) parent[rv] = ru; else { parent[ru] = rv; if (rank[ru] === rank[rv]) rank[rv]++; }
      acc.push(e); total += e.w;
    }
    const sets = {};
    nodes.forEach(n => { const r = find(n.id); (sets[r] = sets[r] || []).push(n.id); });
    steps.push({edge: e, accepted: ok, accepted_so_far: acc.slice(), sets: Object.values(sets)});
  }
  return {steps, mst: acc, total, sorted};
}
function primSteps(nodes, edges, root){
  const key = {}, pi = {}, inQ = {};
  nodes.forEach(n => { key[n.id] = Infinity; pi[n.id] = null; inQ[n.id] = true; });
  key[root] = 0;
  const adj = {}; nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => { adj[e.u].push({v: e.v, w: e.w}); adj[e.v].push({v: e.u, w: e.w}); });
  const steps = [], order = []; let total = 0;
  steps.push({u: null, key: {...key}, pi: {...pi}, done: [], updates: []});
  while (Object.values(inQ).some(Boolean)){
    let u = null;
    nodes.forEach(n => { if (inQ[n.id] && (u === null || key[n.id] < key[u] || (key[n.id] === key[u] && n.id < u))) u = n.id; });
    if (key[u] === Infinity) break;
    inQ[u] = false; order.push(u); if (pi[u] !== null) total += key[u];
    const updates = [];
    for (const {v, w} of adj[u]) if (inQ[v] && w < key[v]){ updates.push({v, from: key[v], to: w}); key[v] = w; pi[v] = u; }
    steps.push({u, key: {...key}, pi: {...pi}, done: order.slice(), updates});
  }
  return {steps, order, total, pi};
}

// ---------- random graph ----------
function randomGraph(n = rnd(5, 6), extra = rnd(2, 4)){
  const ids = 'abcdefgh'.slice(0, n).split('');
  const R = 120, cx = 160, cy = 140, off = Math.random() * Math.PI;
  const nodes = ids.map((id, i) => ({id, x: cx + R * Math.cos(off + 2 * Math.PI * i / n), y: cy + R * Math.sin(off + 2 * Math.PI * i / n)}));
  const set = new Set(), edges = [];
  const add = (u, v) => { const k = [u, v].sort().join(); if (u === v || set.has(k)) return false; set.add(k); edges.push({u, v}); return true; };
  const order = shuffle(ids);
  for (let i = 1; i < n; i++) add(order[i], order[rnd(0, i - 1)]);
  let tries = 0; while (edges.length < n - 1 + extra && tries++ < 100) add(pick(ids), pick(ids));
  const ws = shuffle([...Array(19).keys()].map(x => x + 1));
  edges.forEach((e, i) => e.w = ws[i]);
  return {nodes, edges};
}

// ---------- SVG renderer ----------
function renderGraph(g, opt = {}){
  const W = opt.w || 320, H = opt.h || 280;
  const es = opt.edgeState || {}, ns = opt.nodeState || {}, lab = opt.nodeLabel || {};
  const pos = {}; g.nodes.forEach(n => pos[n.id] = n);
  const k = e => [e.u, e.v].sort().join();
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif">`;
  for (const e of g.edges){
    const a = pos[e.u], b = pos[e.v], st = es[k(e)] || '';
    const col = st === 'mst' ? '#34d399' : st === 'cur' ? '#fbbf24' : st === 'rej' ? '#f87171' : 'rgba(255,255,255,.22)';
    const wd = st === 'mst' || st === 'cur' ? 4 : 2;
    s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${col}" stroke-width="${wd}" ${st === 'rej' ? 'stroke-dasharray="6 5"' : ''} stroke-linecap="round"/>`;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    s += `<rect x="${mx - 12}" y="${my - 10}" width="24" height="19" rx="6" fill="#111827" stroke="${st ? col : 'rgba(255,255,255,.15)'}"/><text x="${mx}" y="${my + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="${st ? col : '#cbd5e1'}">${e.w}</text>`;
  }
  for (const n of g.nodes){
    const st = ns[n.id] || '';
    const fill = st === 'in' ? '#065f46' : st === 'cur' ? '#78350f' : '#1e1b4b';
    const stroke = st === 'in' ? '#34d399' : st === 'cur' ? '#fbbf24' : '#8b5cf6';
    s += `<circle cx="${n.x}" cy="${n.y}" r="17" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><text x="${n.x}" y="${n.y + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">${n.id}</text>`;
    if (lab[n.id] !== undefined) s += `<text x="${n.x}" y="${n.y - 24}" text-anchor="middle" font-size="11" font-weight="700" fill="#67e8f9">${lab[n.id]}</text>`;
  }
  return s + '</svg>';
}

// CLRS Figure 21.4 example graph
const CLRS_GRAPH = {
  nodes: [
    {id:'a', x:40, y:150}, {id:'b', x:130, y:60}, {id:'c', x:250, y:60}, {id:'d', x:370, y:60}, {id:'e', x:460, y:150},
    {id:'f', x:370, y:240}, {id:'g', x:250, y:240}, {id:'h', x:130, y:240}, {id:'i', x:200, y:150}],
  edges: [
    {u:'a',v:'b',w:4},{u:'a',v:'h',w:8},{u:'b',v:'c',w:8},{u:'b',v:'h',w:11},{u:'c',v:'d',w:7},{u:'c',v:'f',w:4},{u:'c',v:'i',w:2},
    {u:'d',v:'e',w:9},{u:'d',v:'f',w:14},{u:'e',v:'f',w:10},{u:'f',v:'g',w:2},{u:'g',v:'h',w:1},{u:'g',v:'i',w:6},{u:'h',v:'i',w:7}]
};

// ======================= DIAGRAM PRIMITIVES =======================
const C = {acc: '#8b5cf6', cy: '#22d3ee', good: '#34d399', bad: '#f87171', warn: '#fbbf24', pink: '#f472b6', txt: '#e5e7eb', mut: '#9ca3af', dim: '#4b5563', bg: '#0f1424'};
let dgN = 0;
const D = {
  svg: (w, h, body) => { const id = 'dg' + (++dgN); return `<svg viewBox="0 0 ${w} ${h}" class="dg" role="img"><defs>${['acc', 'cy', 'good', 'bad', 'mut', 'warn'].map(k => `<marker id="${id}-ar-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${C[k]}"/></marker>`).join('')}</defs>${body.replace(/url\(#ar-/g, `url(#${id}-ar-`)}</svg>`; },
  node: (x, y, l, col = C.acc, r = 17, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill || col + '33'}" stroke="${col}" stroke-width="2.5"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="${r > 14 ? 14 : 12}" font-weight="700" fill="#fff">${l}</text>`,
  line: (x1, y1, x2, y2, col = C.dim, w = 2.5, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`,
  arrow: (x1, y1, x2, y2, k = 'mut', w = 2.5, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C[k]}" stroke-width="${w}" marker-end="url(#ar-${k})" ${dash ? 'stroke-dasharray="6 5"' : ''}/>`,
  text: (x, y, s, size = 13, col = C.mut, anchor = 'middle', weight = 500) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${col}">${s}</text>`,
  box: (x, y, w, h, l, col = C.acc, sub) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${col}22" stroke="${col}" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 + (sub ? -3 : 5)}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">${l}</text>${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" font-size="11.5" fill="${C.mut}">${sub}</text>` : ''}`,
  diamond: (cx, cy, w, h, l, col = C.warn) => `<path d="M${cx} ${cy - h / 2}L${cx + w / 2} ${cy}L${cx} ${cy + h / 2}L${cx - w / 2} ${cy}Z" fill="${col}22" stroke="${col}" stroke-width="2"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13.5" font-weight="700" fill="#fff">${l}</text>`,
  wlabel: (x, y, w, col = C.mut) => `<rect x="${x - 12}" y="${y - 10}" width="24" height="19" rx="6" fill="#111827" stroke="${col}" stroke-width="1.2"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11.5" font-weight="700" fill="${col}">${w}</text>`
};
const fig = (svg, pro, kid) => `<figure class="fig">${svg}<figcaption><span class="pro-only">${pro}</span><span class="kid-only">${kid}</span></figcaption></figure>`;

// ======================= PAGE DIAGRAMS =======================
const DIAGRAMS = {
  home: () => fig(D.svg(720, 230,
      D.box(20, 30, 170, 58, 'Disjoint Sets', C.pink, 'Union-Find · Topic 16') +
      D.box(20, 140, 170, 58, 'Priority Queue', C.warn, 'binary / Fibonacci heap') +
      D.box(275, 85, 170, 58, 'Safe Edge Thm', C.acc, 'light edge across a cut') +
      D.box(530, 30, 170, 58, "Kruskal", C.good, 'grows a forest') +
      D.box(530, 140, 170, 58, "Prim", C.cy, 'grows one tree') +
      D.arrow(190, 59, 526, 59, 'good') + D.arrow(190, 169, 526, 169, 'cy') +
      D.arrow(445, 105, 526, 72, 'acc') + D.arrow(445, 124, 526, 156, 'acc') +
      D.text(358, 52, 'detects cycles', 11.5, C.good) + D.text(358, 190, 'finds the cheapest next edge', 11.5, C.cy) +
      D.text(360, 222, 'both → Minimum Spanning Tree in O(E lg V)', 12.5, C.txt)),
    'How the pieces fit: Union-Find powers Kruskal, a priority queue powers Prim, and the Safe Edge Theorem proves both correct.',
    'Two helpers (the group-tracker and the "cheapest-first" line) help two robots (Kruskal and Prim) build the cheapest set of roads.'),

  ds: () => `<div class="grid g2">` + fig(D.svg(400, 250,
      D.text(95, 22, 'Before FIND-SET(e)', 13, C.txt, 'middle', 700) +
      D.arrow(95, 177, 95, 162, 'mut') + D.arrow(95, 132, 95, 117, 'mut') + D.arrow(95, 87, 95, 72, 'mut') + D.arrow(95, 222, 95, 207, 'mut') +
      D.node(95, 55, 'a', C.warn) + D.node(95, 100, 'b') + D.node(95, 145, 'c') + D.node(95, 190, 'd') + D.node(95, 235, 'e', C.pink) +
      D.arrow(160, 145, 225, 145, 'cy', 3) + D.text(192, 133, 'compress', 11.5, C.cy) +
      D.text(310, 22, 'After', 13, C.txt, 'middle', 700) +
      [['b', 250], ['c', 290], ['d', 330], ['e', 370]].map(([l, x]) => D.arrow(x, 128, 310 + (x - 310) * .25, 88, 'good', 2)).join('') +
      D.node(310, 70, 'a', C.warn) + D.node(250, 145, 'b') + D.node(290, 145, 'c') + D.node(330, 145, 'd') + D.node(370, 145, 'e', C.pink) +
      D.text(310, 200, 'everyone points at the root', 11.5, C.good)),
    '<b>Path compression:</b> FIND-SET makes every node on the find path point directly at the representative (root).',
    'Instead of passing a note up a long line of kids, everyone learns where the team captain sits so next time they go straight there.') +
    fig(D.svg(400, 250,
      D.text(80, 22, 'rank 1', 12, C.cy) + D.node(80, 60, 'x', C.cy) + D.node(80, 125, 'p', C.cy, 14) + D.arrow(80, 109, 80, 79, 'mut', 2) +
      D.text(250, 22, 'rank 2', 12, C.warn) + D.node(250, 60, 'y', C.warn) + D.node(215, 125, 'q', C.warn, 14) + D.node(285, 125, 'r', C.warn, 14) + D.node(285, 185, 's', C.warn, 14) +
      D.arrow(222, 110, 240, 77, 'mut', 2) + D.arrow(278, 110, 260, 77, 'mut', 2) + D.arrow(285, 170, 285, 141, 'mut', 2) +
      `<path d="M98 52 Q 165 15 230 50" fill="none" stroke="${C.good}" stroke-width="3" stroke-dasharray="7 5" marker-end="url(#ar-good)"/>` +
      D.text(165, 22, 'LINK', 12, C.good, 'middle', 700) +
      D.text(200, 230, 'short tree goes under tall tree → height stays O(lg n)', 11.5, C.txt)),
    '<b>Union by rank:</b> the root with smaller rank becomes a child of the root with larger rank.',
    'When two teams join, the small team joins the big team, so the line to the captain never gets too long.') + `</div>`,

  mst: () => `<div class="grid g2">` + fig(D.svg(420, 260,
      `<rect x="15" y="30" width="170" height="210" rx="40" fill="${C.pink}14" stroke="${C.pink}" stroke-dasharray="6 5"/><rect x="235" y="30" width="170" height="210" rx="40" fill="${C.cy}12" stroke="${C.cy}" stroke-dasharray="6 5"/>` +
      D.text(100, 22, 'S', 14, C.pink, 'middle', 700) + D.text(320, 22, 'V − S', 14, C.cy, 'middle', 700) +
      D.line(70, 80, 130, 150, C.good, 4) + D.line(70, 80, 80, 200, C.dim) +
      D.line(130, 150, 290, 80, C.mut) + D.line(130, 150, 300, 200, C.good, 5) + D.line(80, 200, 300, 200, C.mut) + D.line(290, 80, 350, 150, C.dim) + D.line(350, 150, 300, 200, C.dim) +
      D.wlabel(215, 115, 8) + D.wlabel(215, 175, 2, C.good) + D.wlabel(190, 200, 6) +
      D.node(70, 80, 'a', C.pink) + D.node(130, 150, 'b', C.pink) + D.node(80, 200, 'c', C.pink) + D.node(290, 80, 'd', C.cy) + D.node(350, 150, 'e', C.cy) + D.node(300, 200, 'f', C.cy) +
      D.text(210, 255, 'green across the gap = light edge = safe', 11.5, C.good)),
    '<b>Cut (S, V − S):</b> three edges cross it (8, 2, 6). The lightest crossing edge (2) is a <b>safe edge</b>: some MST contains it.',
    'Draw a line splitting the towns into two teams. Of all the bridges that cross the line, the cheapest one is always a smart pick.') +
    fig(D.svg(420, 260,
      D.box(130, 15, 160, 46, 'A = ∅', C.mut) +
      D.diamond(210, 115, 230, 64, '|A| < |V| − 1 ?') +
      D.box(15, 185, 175, 56, 'Find a safe edge', C.acc, 'light edge across a cut') +
      D.box(250, 185, 155, 56, 'return A', C.good, 'it\'s an MST!') +
      D.arrow(210, 61, 210, 81) + D.arrow(150, 135, 110, 181, 'acc') + D.arrow(270, 135, 320, 181, 'good') +
      D.text(112, 158, 'yes', 12, C.acc) + D.text(312, 158, 'no', 12, C.good) +
      `<path d="M30 185 Q 0 115 92 115" fill="none" stroke="${C.acc}" stroke-width="2.5" marker-end="url(#ar-acc)"/>` + D.text(20, 100, 'add it', 12, C.acc, 'start')),
    '<b>Generic MST:</b> keep adding safe edges. Invariant: A is always a subset of some MST.',
    'Keep adding the "smart pick" bridge until every town is connected. Then stop!') + `</div>`,

  kruskal: () => `<div class="grid g2">` + fig(D.svg(420, 280,
      D.box(70, 10, 280, 46, 'Sort edges cheap → expensive', C.acc) +
      D.box(105, 80, 210, 42, 'Take next edge (u,v)', C.mut) +
      D.diamond(210, 165, 300, 66, 'FIND-SET(u) = FIND-SET(v)?') +
      D.box(10, 222, 165, 50, '✗ Skip it', C.bad, 'would make a cycle') +
      D.box(245, 222, 165, 50, '✓ Keep + UNION', C.good, 'joins two groups') +
      D.arrow(210, 56, 210, 76) + D.arrow(210, 122, 210, 132) + D.arrow(120, 180, 95, 218, 'bad') + D.arrow(300, 180, 325, 218, 'good') +
      D.text(95, 196, 'same', 12, C.bad) + D.text(330, 196, 'different', 12, C.good) +
      `<path d="M410 247 Q 418 100 319 101" fill="none" stroke="${C.mut}" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#ar-mut)"/>` +
      `<path d="M10 247 Q 2 100 101 101" fill="none" stroke="${C.mut}" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#ar-mut)"/>`),
    '<b>Kruskal loop:</b> each sorted edge is accepted only if its endpoints are in different Union-Find sets.',
    'Look at roads from cheapest to priciest. If a road connects two towns that are already linked, skip it. Otherwise build it!') +
    fig(D.svg(420, 280, (() => {
      const stage = (ox, oy, title, groups, edges) => D.text(ox + 60, oy - 8, title, 12, C.txt, 'middle', 700) +
        groups.map(([cx, cy, rx, ry, col]) => `<ellipse cx="${ox + cx}" cy="${oy + cy}" rx="${rx}" ry="${ry}" fill="${col}18" stroke="${col}" stroke-dasharray="4 4"/>`).join('') +
        edges.map(([x1, y1, x2, y2]) => D.line(ox + x1, oy + y1, ox + x2, oy + y2, C.good, 3.5)).join('') +
        [[20, 25, 'a'], [70, 25, 'b'], [20, 85, 'c'], [70, 85, 'd'], [110, 55, 'e']].map(([x, y, l]) => D.node(ox + x, oy + y, l, C.acc, 13)).join('');
      return stage(10, 30, '1 · 5 groups', [[20, 25, 18, 18, C.pink], [70, 25, 18, 18, C.cy], [20, 85, 18, 18, C.warn], [70, 85, 18, 18, C.good], [110, 55, 18, 18, C.acc]], []) +
        stage(150, 30, '2 · merge', [[45, 25, 45, 22, C.pink], [45, 85, 45, 22, C.warn], [110, 55, 18, 18, C.acc]], [[20, 25, 70, 25], [20, 85, 70, 85]]) +
        stage(290, 30, '3 · merge', [[60, 55, 66, 58, C.good]], [[20, 25, 70, 25], [20, 85, 70, 85], [70, 25, 110, 55], [20, 25, 20, 85]]) +
        D.text(210, 210, 'Groups (sets) merge until one tree remains', 12.5, C.txt) +
        D.text(210, 232, 'n vertices → exactly n − 1 accepted edges', 12, C.good) +
        D.arrow(140, 85, 155, 85, 'mut') + D.arrow(280, 85, 295, 85, 'mut');
    })()),
    '<b>Forest view:</b> Kruskal grows many small trees at once; every accepted edge merges two of them.',
    'Each town starts on its own little island team. Every new road merges two teams until everybody is one big team.') + `</div>`,

  prim: () => fig(D.svg(780, 230, (() => {
      const N = {r: [60, 70], b: [150, 40], c: [140, 140], d: [230, 110]}, E = [['r', 'b', 4], ['r', 'c', 2], ['b', 'd', 3], ['c', 'd', 5], ['b', 'c', 6]];
      const stage = (ox, title, inT, tree, pick) => D.text(ox + 145, 20, title, 13, C.txt, 'middle', 700) + E.map(([u, v, w]) => {
        const [x1, y1] = N[u], [x2, y2] = N[v], k = [u, v].sort().join(), isT = tree.includes(k), fr = inT.includes(u) !== inT.includes(v), pk = pick === k;
        return D.line(ox + x1, oy(y1), ox + x2, oy(y2), isT ? C.good : pk ? C.warn : fr ? C.cy : C.dim, isT || pk ? 4 : 2.5, fr && !pk ? 'stroke-dasharray="6 5"' : '') + D.wlabel(ox + (x1 + x2) / 2, oy((y1 + y2) / 2), w, isT ? C.good : pk ? C.warn : fr ? C.cy : C.mut);
      }).join('') + Object.entries(N).map(([l, [x, y]]) => D.node(ox + x, oy(y), l, inT.includes(l) ? C.good : C.mut, 16)).join('');
      const oy = y => y + 20;
      return stage(0, '1 · start at root r', ['r'], [], 'c,r') + stage(260, '2 · tree {r, c}', ['r', 'c'], ['c,r'], 'b,r') + stage(520, '3 · tree {r, c, b}', ['r', 'c', 'b'], ['c,r', 'b,r'], 'b,d') +
        D.text(390, 222, 'cyan dashed = edges leaving the tree (their weights are the keys)  ·  yellow = cheapest → EXTRACT-MIN adds it', 12, C.txt);
    })()),
    '<b>Prim:</b> one tree grows from the root. The priority queue always hands back the vertex with the cheapest edge into the tree.',
    'Start at one town. Look at all roads going out from your group, build the cheapest one, and repeat. Your group gets bigger one town at a time.'),

  fib: () => `<div class="grid g2">` + fig(D.svg(420, 260, (() => {
      const F = [1, 2, 3, 5, 8, 13, 21]; let s = '';
      F.forEach((v, k) => { const h = v * 7, x = 40 + k * 52; s += `<rect x="${x}" y="${215 - h}" width="34" height="${h}" rx="6" fill="${C.warn}" opacity="${.45 + k * .08}"/>` + D.text(x + 17, 208 - h, v, 12, C.txt, 'middle', 700) + D.text(x + 17, 235, 'k=' + k, 11.5, C.mut); });
      return s + D.line(30, 215, 400, 215, C.dim, 1.5) + D.text(210, 22, 'min nodes in a subtree whose root has degree k', 12.5, C.txt) + D.text(210, 254, 's_k ≥ F_(k+2) ≥ φ^k   →   k ≤ log_φ n', 12, C.warn, 'middle', 700);
    })()),
    '<b>Size grows like Fibonacci:</b> a degree-k node has ≥ F<sub>k+2</sub> ≥ φ<sup>k</sup> descendants, so D(n) ≤ ⌊log<sub>φ</sub> n⌋ = O(lg n).',
    'A node with lots of children must have a HUGE family behind it, growing like 1, 2, 3, 5, 8, 13… So no node can have too many children.') +
    fig(D.svg(420, 260,
      D.text(70, 22, '1 · lose a child', 12, C.txt, 'middle', 700) + D.node(70, 70, 'x', C.acc) + D.node(45, 140, '', C.dim, 12) + D.line(55, 128, 64, 87, C.dim) + D.line(85, 128, 76, 87, C.bad, 2.5, 'stroke-dasharray="4 4"') + D.text(102, 140, '✂', 18, C.bad) +
      `<circle cx="88" cy="55" r="7" fill="${C.warn}"/>` + D.text(70, 185, 'x becomes marked', 11.5, C.warn) +
      D.arrow(130, 90, 160, 90, 'mut') +
      D.text(210, 22, '2 · lose another', 12, C.txt, 'middle', 700) + D.node(210, 70, 'x', C.acc) + `<circle cx="228" cy="55" r="7" fill="${C.warn}"/>` + D.line(210, 87, 210, 128, C.bad, 2.5, 'stroke-dasharray="4 4"') + D.text(228, 115, '✂', 18, C.bad) + D.node(210, 140, '', C.dim, 12) +
      D.arrow(260, 90, 290, 90, 'mut') +
      D.text(350, 22, '3 · cascading cut', 12, C.txt, 'middle', 700) + D.box(300, 50, 100, 40, 'root list', C.good) + D.node(350, 140, 'x', C.acc) + D.arrow(350, 122, 350, 94, 'good') + D.text(350, 185, 'x cut, unmarked', 11.5, C.good) +
      D.text(210, 235, 'a node may lose at most ONE child before it is cut', 12.5, C.txt)),
    '<b>Mark bits + cascading cuts:</b> a non-root node is cut to the root list the second time it loses a child. That keeps subtrees "bushy."',
    'Rule: a parent can lose one kid and get a warning sticker. If it loses a second kid, it gets moved to the top row. This keeps families big.') + `</div>`,

  videos: () => fig(D.svg(720, 120,
      D.box(20, 30, 200, 60, 'A · MST basics', C.acc, 'cuts & safe edges') + D.box(260, 30, 200, 60, "B · Kruskal", C.good, 'sort + Union-Find') + D.box(500, 30, 200, 60, "C · Prim", C.cy, 'priority queue') +
      D.arrow(220, 60, 256, 60, 'mut', 3) + D.arrow(460, 60, 496, 60, 'mut', 3)),
    'Watch the screencasts in order. A gives the theory, then B and C apply it.',
    'Watch them in order: first the big idea, then robot #1 (Kruskal), then robot #2 (Prim).'),

  practice: () => fig(D.svg(720, 150,
      D.text(20, 22, 'How pseudocode is graded', 13, C.txt, 'start', 700) +
      `<rect x="20" y="40" width="${680 * .4}" height="40" rx="10" fill="${C.good}55" stroke="${C.good}"/><rect x="${20 + 680 * .4}" y="40" width="${680 * .3}" height="40" rx="10" fill="${C.acc}55" stroke="${C.acc}"/><rect x="${20 + 680 * .7}" y="40" width="${680 * .3}" height="40" rx="10" fill="${C.cy}55" stroke="${C.cy}"/>` +
      D.text(20 + 136, 66, 'Correctness 40%', 14, '#fff', 'middle', 700) + D.text(20 + 272 + 102, 66, 'Modularity 30%', 14, '#fff', 'middle', 700) + D.text(20 + 476 + 102, 66, 'Efficiency 30%', 14, '#fff', 'middle', 700) +
      D.text(156, 105, 'right steps, right answer', 12, C.mut) + D.text(394, 105, 'helper procedures, short & clear', 12, C.mut) + D.text(598, 105, 'no slow nested loops', 12, C.mut) +
      D.text(360, 138, 'A ≥ 90 · B ≥ 80 · C ≥ 70 · D ≥ 60', 12.5, C.warn)),
    'Each pseudocode answer gets three sub-scores combined into a letter grade.',
    'Your code gets three stars: does it work? Is it split into neat little pieces? Is it fast?')
};

// ======================= "DUMMY MODE" (ELI5) EXPLANATIONS =======================
const ELI5 = {
  home: {title: 'What is this site about?', pts: [
    '🏝️ Imagine a bunch of islands and you want to build bridges so you can walk from any island to any other.',
    '💰 Every bridge costs money. You want to spend the <b>least money</b> possible but still connect everybody.',
    '🌳 The cheapest set of bridges is called a <b>Minimum Spanning Tree</b> (MST). "Tree" just means no loops: no wasted bridges.',
    '🤖 You\'ll meet two "robots" that find it: <b>Kruskal</b> and <b>Prim</b>. They use helpers called <b>Disjoint Sets</b> and <b>heaps</b>.']},
  ds: {title: 'Disjoint Sets = sorting kids into teams', pts: [
    '👫 Every kid starts on their <b>own team</b> (MAKE-SET).',
    '🧢 Each team has a <b>captain</b>. To find out which team you\'re on, follow the arrows up to the captain (FIND-SET).',
    '🤝 UNION means "these two teams join together into one bigger team."',
    '📏 <b>Union by rank:</b> the shorter team joins under the taller team, so lines never get too long.',
    '⚡ <b>Path compression:</b> after you find your captain once, you remember them, so next time you go straight there.',
    '🚀 With both tricks, every question is answered almost instantly, even with millions of kids.']},
  mst: {title: 'MST = the cheapest way to connect everything', pts: [
    '🏘️ Towns are dots and roads are lines. Each road has a price tag (its <b>weight</b>).',
    '✅ A <b>spanning tree</b> connects every town using no loops. With n towns you always need exactly <b>n − 1</b> roads.',
    '✂️ A <b>cut</b> is like drawing a line that splits the towns into two teams.',
    '🌉 Roads that go across the line are <b>crossing edges</b>. The cheapest crossing road is called a <b>light edge</b>.',
    '🛡️ <b>Safe Edge Theorem:</b> that cheapest crossing road is always a safe pick. You will never regret choosing it!']},
  kruskal: {title: "Kruskal's robot: cheapest roads first", pts: [
    '📋 Put all the roads in a line from <b>cheapest</b> to <b>most expensive</b>.',
    '👀 Look at each road in order.',
    '🤔 Ask: "Are these two towns already connected?" (Same team? Use FIND-SET.)',
    '❌ If YES → skip it, because it would make a useless loop.',
    '✅ If NO → build it, and merge the two teams (UNION).',
    '🏁 Stop when every town is on one big team.']},
  prim: {title: "Prim's robot: grow one blob", pts: [
    '📍 Start at one town. That is your little blob.',
    '🔍 Look at every road that leaves your blob.',
    '💲 Build the <b>cheapest</b> one. Now the town at the other end joins your blob.',
    '🔁 Repeat! The blob grows one town at a time.',
    '📦 A <b>priority queue</b> is like a magic line where the cheapest choice always jumps to the front, so the robot doesn\'t have to search every time.',
    '🏁 When every town is in the blob, you\'re done.']},
  fib: {title: 'Fibonacci heaps: why no node gets too many kids', pts: [
    '🌲 A Fibonacci heap is a bunch of family trees. Each parent can have kids.',
    '🏷️ <b>Rule:</b> if a parent loses one kid, it gets a warning sticker (a <b>mark</b>). If it loses a second kid, it gets moved to the top row (a <b>cascading cut</b>).',
    '🐰 Because of this rule, a parent with k kids must have a family at least as big as the Fibonacci numbers: 1, 2, 3, 5, 8, 13, 21… which grow super fast!',
    '📉 So with n nodes, nobody can have more than about <b>log n</b> kids.',
    '⚡ That keeps the heap fast, and it makes Prim\'s robot even faster.']},
  videos: {title: 'Watching the videos', pts: [
    '🎬 <b>Video A:</b> what the "cheapest roads" problem is and why the cheapest crossing road is safe.',
    '🎬 <b>Video B:</b> Kruskal\'s robot with real airports (like SFO and JFK).',
    '🎬 <b>Video C:</b> Prim\'s robot growing its blob from San Francisco.',
    '💡 Tip: pause the video and try to guess the next road before the teacher picks it!']},
  practice: {title: 'How practice works', pts: [
    '🎲 Questions are picked at random, and some are even made up fresh each time with new graphs.',
    '🔘 <b>Multiple choice:</b> tap the answer you think is right.',
    '⌨️ <b>Pseudocode:</b> write step-by-step instructions like a recipe. You get three scores:',
    '⭐ Does it work? (Correctness) · ⭐ Is it split into neat little pieces? (Modularity) · ⭐ Is it fast? (Efficiency)',
    '💡 Stuck? Press <b>Hint</b>, and you can always peek at the model answer.']}
};

function mountExtras(){
  Object.keys(DIAGRAMS).forEach(id => {
    const page = document.getElementById('page-' + id); if (!page) return;
    const lead = page.querySelector(':scope > p.lead');
    let anchor = lead && lead.nextElementSibling && lead.nextElementSibling.classList.contains('row') ? lead.nextElementSibling : lead;
    const e = ELI5[id];
    const html = `<div class="eli5-box kid-only fade"><div class="eli5-head"><span class="eli5-badge">🧒 Simple mode</span><h3>${e.title}</h3></div><ul>${e.pts.map(p => `<li>${p}</li>`).join('')}</ul></div>
      <div class="card diagram-card"><div class="dg-head"><h3>🖼️ Picture it</h3><span class="pill">diagram</span></div>${DIAGRAMS[id]()}</div>`;
    if (anchor) anchor.insertAdjacentHTML('afterend', html); else page.insertAdjacentHTML('afterbegin', html);
  });
  const sw = document.getElementById('eli5-switch');
  const apply = on => { document.body.classList.toggle('eli5', on); sw.checked = on; };
  apply(!!store.eli5);
  sw.addEventListener('change', () => {
    store.eli5 = sw.checked; save(); apply(sw.checked);
    toast(sw.checked ? '🧒 Simple mode on: easy explanations added to every page' : 'Simple mode off');
    if (sw.checked) { const box = document.querySelector('.page:not(.hidden) .eli5-box'); box && box.scrollIntoView({behavior: 'smooth', block: 'center'}); }
  });
}

// ======================= PSEUDOCODE GRADER =======================
// Heuristic, rubric-based static analysis of free-form pseudocode.
const COMPOUNDS = ['make set','find set','extract min','decrease key','cascading cut','connected components','same component',
  'mst kruskal','mst prim','light edge','kruskal weight','prim mst edges','max degree','generic mst','min heap','root list','child list','in q'];
const CTRL = new Set(['if','elif','else','while','for','foreach','return','switch','until','repeat','do','print','and','or','not','then','in','case','loop']);

function normalize(src){
  let s = '\n' + src.toLowerCase() + '\n';
  s = s.replace(/\u2190|<-|:=/g, '=').replace(/\u2260|=\/=|<>/g, '!=').replace(/\u2264/g, '<=').replace(/\u2265/g, '>=')
       .replace(/\u221e|infinity|float\(\s*['"]inf['"]\s*\)|math\.inf/g, 'inf').replace(/\u2212|\u2013/g, '-')
       .replace(/\u222a/g, ' cup ').replace(/\u2205/g, '{}').replace(/\u03c0/g, 'pi').replace(/\u2209/g, ' not in ').replace(/\u2208/g, ' in ')
       .replace(/\bnot\s+equal(\s+to)?\b/g, '!=').replace(/\bis\s+not\b/g, '!=').replace(/\bequals?\b/g, '==')
       .replace(/\bheappop\b|\bpop_?min\b|\bremove_?min\b/g, 'extractmin').replace(/\bheappush\b/g, 'insert');
  for (const c of COMPOUNDS){
    const re = new RegExp('\\b' + c.split(' ').join('[\\s_\\-]?') + '\\b', 'g');
    s = s.replace(re, c.replace(/ /g, ''));
  }
  s = s.replace(/\bfind\s*\(/g, 'findset(').replace(/\bunite\s*\(/g, 'union(');
  return s;
}
const normName = n => n.toLowerCase().replace(/[\s_\-]/g, '');

function parse(src){
  const raw = src.replace(/\t/g, '    ').split('\n');
  const lines = raw.map((r, i) => ({i, raw: r, t: normalize(r).trim(), indent: r.match(/^\s*/)[0].length, blank: !r.trim()}));
  const headerRe = /^\s*(?:def|function|procedure|func|algorithm|proc|fn|sub|void|int|bool|boolean)?\s*([A-Za-z_][\w\-]*)\s*\(([^)]*)\)\s*(?::|\{|->[^\n]*|returns?\b[^\n]*)?\s*$/i;
  const kwRe = /^\s*(def|function|procedure|func|algorithm|proc|fn|sub)\b/i;
  const funcs = [];
  const nonBlank = lines.filter(l => !l.blank && !/^\s*(\/\/|#|\u25b9)/.test(l.raw));
  nonBlank.forEach((l, k) => {
    const code = l.raw.replace(/\s*(\/\/|#|\u25b9).*$/, ''); const m = code.match(headerRe); if (!m) return;
    const name = m[1]; if (CTRL.has(name.toLowerCase())) return;
    const next = nonBlank[k + 1];
    const opens = kwRe.test(code) || /[:{]\s*$/.test(code) || (next && next.indent > l.indent);
    if (!opens) return;
    funcs.push({name, norm: normName(name), start: l.i, indent: l.indent});
  });
  funcs.forEach((f, k) => {
    let end = lines.length;
    for (let j = f.start + 1; j < lines.length; j++){
      const L = lines[j]; if (L.blank) continue;
      if (L.indent <= f.indent && !/^\s*(\}|end\b)/i.test(L.raw)) { end = j; break; }
    }
    if (k + 1 < funcs.length) end = Math.min(end, funcs[k + 1].start);
    f.end = end;
    f.bodyLines = lines.slice(f.start + 1, end).filter(l => !l.blank);
    f.body = '\n' + f.bodyLines.map(l => l.t).join('\n') + '\n';
    f.len = f.bodyLines.length;
  });
  // loop & nesting depth via indentation stack
  const stack = []; let maxLoop = 0, maxNest = 0;
  for (const L of lines){
    if (L.blank) continue;
    while (stack.length && stack[stack.length - 1].indent >= L.indent) stack.pop();
    const owner = funcs.find(f => L.i > f.start && L.i < f.end);
    const anc = stack.filter(s => !owner || s.i > owner.start);
    L.loopDepth = anc.filter(s => s.loop).length;
    L.isLoop = /^\s*(for|foreach|while|repeat|loop|do)\b/.test(L.t);
    if (L.isLoop) maxLoop = Math.max(maxLoop, L.loopDepth + 1);
    if (owner) { maxNest = Math.max(maxNest, anc.length); owner.maxLoop = Math.max(owner.maxLoop || 0, L.isLoop ? L.loopDepth + 1 : 0); }
    stack.push({indent: L.indent, loop: L.isLoop, i: L.i});
  }
  const text = normalize(src);
  const headerIdx = new Set(funcs.map(f => f.start));
  const callText = normalize(raw.filter((_, i) => !headerIdx.has(i)).join('\n'));
  const findF = names => funcs.find(f => [].concat(names).some(n => f.norm === n || f.norm.includes(n)));
  return {
    src, text, lines, funcs, maxLoop, maxNest,
    body(names){ const f = findF(names); return f ? f.body : text; },
    fn: findF,
    hasFn(names){ return !!findF(names); },
    calls(name){ return new RegExp('\\b' + name + '\\s*\\(').test(callText); },
    count(re){ return (text.match(new RegExp(re.source, 'g' + re.flags.replace('g', ''))) || []).length; }
  };
}

// --- regex helpers on normalized text ---
const FIELD = (f) => `(?:\\w+\\.(?:${f})\\b|\\b(?:${f})\\s*\\[\\s*\\w+\\s*\\])`;
const PAR = FIELD('p|parent|pi');
const has = (s, ...res) => res.some(r => r.test(s));
const ADD_EDGE = /\b(\w+)\s*=\s*\1\s*(cup|\+|union\b|\|)|\.(add|append|push|insert)\s*\(|\b(add|append|insert|push)\b[^\n]*\b(to|into)\b/;
const EMPTY_INIT = /=\s*(\{\s*\}|\[\s*\]|empty\b|set\(\s*\)|list\(\s*\)|new\s+\w+|none\b|nil\b)/;
const FOR_VERT = /(for|foreach)[^\n]*\b(v|u|x|vertex|vertices|node|nodes|g\.v|v\[g\])\b[^\n]*\n[\s\S]{0,60}?makeset\s*\(|(for|foreach)[^\n]*makeset\s*\(/;
const FOR_EDGE = /(for|foreach)[^\n]*(edge|\(\s*\w+\s*,\s*\w+\s*\)|\.e\b|\be\b|\bg\.e\b|e\[g\])/;
const CMP_FIND = /findset\s*\([^)]*\)\s*!=\s*findset\s*\(|!\s*samecomponent|not\s+samecomponent|findset\s*\([^)]*\)\s*==\s*findset\s*\([^)]*\)[^\n]*(continue|skip)|(\w+)\s*!=\s*(\w+)[^\n]*$/m;

const CODE = [
 {id:'ds-forest', topic:'ds', title:'Disjoint-set forest with both heuristics',
  prompt:'Write pseudocode for <code>MAKE-SET(x)</code>, <code>FIND-SET(x)</code> with <b>path compression</b>, <code>LINK(x, y)</code> with <b>union by rank</b>, and <code>UNION(x, y)</code>. Each node has fields <code>p</code> (parent) and <code>rank</code>.',
  starter:'MAKE-SET(x)\n    \n\nFIND-SET(x)\n    \n\nLINK(x, y)\n    \n\nUNION(x, y)\n    \n',
  define:['makeset','findset','link','union'], call:['findset','link'], maxLoop:1,
  correctness:[
   {label:'MAKE-SET makes x its own parent', w:2, test:(t,P)=>has(P.body('makeset'), /(\w+)\.(?:p|parent)\s*=\s*\1\b(?!\.)/, /\b(?:p|parent)\s*\[\s*(\w+)\s*\]\s*=\s*\1\b(?!\s*[\[.])/), hint:'Set x.p = x so a singleton is its own representative.'},
   {label:'MAKE-SET initializes rank to 0', w:1, test:(t,P)=>/rank(\s*\[\s*\w+\s*\])?\s*=\s*0\b/.test(P.body('makeset')), hint:'x.rank = 0'},
   {label:'FIND-SET tests whether x is a root', w:1, test:(t,P)=>/^(?=[^\n]*(?:!=|==|\bis\b))(?=[^\n]*(?:\.p\b|\.parent\b|parent\s*\[|\bp\s*\[))[^\n]*$/m.test(P.body('findset')), hint:'Compare x with x.p (if x ≠ x.p …).'},
   {label:'FIND-SET compresses the path', w:3, test:(t,P)=>new RegExp(PAR + '\\s*=\\s*(?:findset\\s*\\(|root\\b|r\\b)').test(P.body('findset')), hint:'Assign x.p = FIND-SET(x.p) so nodes point straight at the root.'},
   {label:'FIND-SET returns the representative', w:1, test:(t,P)=>/\breturn\b/.test(P.body('findset')), hint:'Return x.p (or the root) at the end.'},
   {label:'LINK compares ranks', w:2, test:(t,P)=>/rank[^\n]*(?:>|<)/.test(P.body('link')), hint:'if x.rank > y.rank … else …'},
   {label:'LINK increments rank on a tie', w:2, test:(t,P)=>/rank[^\n]*(?:\+=\s*1|\+\s*1|\+\+)/.test(P.body('link')) && /rank[^\n]*==/.test(P.body('link')), hint:'if x.rank == y.rank then y.rank = y.rank + 1'},
   {label:'UNION links the two roots', w:2, test:(t,P)=>{const b=P.body('union'); return /link\s*\(\s*findset/.test(b) || ((b.match(/findset\s*\(/g)||[]).length>=2 && /link\s*\(|\.(p|parent)\s*=/.test(b));}, hint:'UNION(x, y) = LINK(FIND-SET(x), FIND-SET(y))'}
  ],
  efficiency:[
   {label:'Path compression (amortized near-O(1) finds)', w:5, test:(t,P)=>new RegExp(PAR + '\\s*=\\s*(?:findset\\s*\\(|root\\b|r\\b)').test(P.body('findset')), hint:'Without it, finds can cost O(lg n) each.'},
   {label:'Union by rank keeps trees shallow', w:5, test:(t,P)=>/rank[^\n]*(?:>|<)/.test(t), hint:'Attach the lower-rank root beneath the higher-rank root.'}
  ],
  penalties:[
   {label:'UNION/LINK loops over set members (linked-list style relabeling)', p:3, test:(t,P)=>/\b(for|while)\b/.test(P.body('union')) || (P.hasFn('link') && /\b(for|while)\b/.test(P.body('link'))), hint:'Linking two roots should be O(1).'}
  ],
  model:`MAKE-SET(x)
    x.p = x
    x.rank = 0

FIND-SET(x)                      // path compression
    if x ≠ x.p
        x.p = FIND-SET(x.p)
    return x.p

LINK(x, y)                       // union by rank
    if x.rank > y.rank
        y.p = x
    else
        x.p = y
        if x.rank == y.rank
            y.rank = y.rank + 1

UNION(x, y)
    LINK(FIND-SET(x), FIND-SET(y))`},

 {id:'ds-cc', topic:'ds', title:'Connected components with Union-Find',
  prompt:'Write <code>CONNECTED-COMPONENTS(G)</code> that uses the disjoint-set operations to group the vertices of an undirected graph, and <code>SAME-COMPONENT(u, v)</code> that answers whether two vertices are connected. Assume MAKE-SET, FIND-SET and UNION exist.',
  starter:'CONNECTED-COMPONENTS(G)\n    \n\nSAME-COMPONENT(u, v)\n    \n',
  define:['connectedcomponents','samecomponent'], call:['makeset','findset','union'], maxLoop:1,
  correctness:[
   {label:'MAKE-SET for every vertex', w:2, test:t=>FOR_VERT.test(t), hint:'for each vertex v ∈ G.V: MAKE-SET(v)'},
   {label:'Iterates over every edge', w:2, test:t=>FOR_EDGE.test(t), hint:'for each edge (u, v) ∈ G.E'},
   {label:'Only unions vertices in different sets', w:2, test:t=>/findset\s*\([^)]*\)\s*!=\s*findset\s*\(|not\s+samecomponent|!\s*samecomponent/.test(t), hint:'if FIND-SET(u) ≠ FIND-SET(v)'},
   {label:'Calls UNION', w:2, test:t=>/\bunion\s*\(/.test(t), hint:'UNION(u, v) merges the components.'},
   {label:'SAME-COMPONENT compares representatives', w:2, test:(t,P)=>/findset[\s\S]*==[\s\S]*findset|==/.test(P.body('samecomponent')) && /return/.test(P.body('samecomponent')), hint:'return FIND-SET(u) == FIND-SET(v)'}
  ],
  efficiency:[
   {label:'Uses Union-Find rather than a traversal per query', w:5, test:t=>/findset\s*\(/.test(t) && /\bunion\s*\(/.test(t), hint:'Union-Find handles dynamic edge additions without re-running DFS.'},
   {label:'SAME-COMPONENT is O(α(n)) with no loops', w:5, test:(t,P)=>P.hasFn('samecomponent') && !/\b(for|while)\b/.test(P.body('samecomponent')), hint:'Just two FIND-SETs and a comparison.'}
  ],
  penalties:[
   {label:'Runs BFS/DFS (unnecessary given Union-Find)', p:3, test:t=>/\b(bfs|dfs|breadth|depth)/.test(t), hint:'Use FIND-SET instead of a traversal.'}
  ],
  model:`CONNECTED-COMPONENTS(G)
    for each vertex v ∈ G.V
        MAKE-SET(v)
    for each edge (u, v) ∈ G.E
        if FIND-SET(u) ≠ FIND-SET(v)
            UNION(u, v)

SAME-COMPONENT(u, v)          // O(α(n)) query
    return FIND-SET(u) == FIND-SET(v)`},

 {id:'mst-cut', topic:'mst', title:'Cuts, respecting, and light edges',
  prompt:'Write three procedures: <code>CROSSES(u, v, S)</code> returns TRUE if edge (u,v) crosses the cut (S, V − S); <code>RESPECTS(A, S)</code> returns TRUE if no edge of A crosses the cut; and <code>LIGHT-EDGE(G, w, S)</code> returns a minimum-weight edge crossing the cut. Reuse your helpers.',
  starter:'CROSSES(u, v, S)\n    \n\nRESPECTS(A, S)\n    \n\nLIGHT-EDGE(G, w, S)\n    \n',
  define:['crosses','respects','lightedge'], call:['crosses'], maxLoop:1,
  correctness:[
   {label:'CROSSES checks exactly one endpoint is in S', w:3, test:(t,P)=>{const b=P.body('crosses'); return /\bin\s+s\b|s\.contains|\[s\]|s\[/.test(b) && /(not\s+in|!=|\bxor\b|\^|and\s+not|!\s*\(|not\s*\()/.test(b);}, hint:'return (u ∈ S) ≠ (v ∈ S)'},
   {label:'RESPECTS iterates over the edges of A', w:2, test:(t,P)=>/(for|foreach)[^\n]*\ba\b/.test(P.body('respects')), hint:'for each (u, v) ∈ A'},
   {label:'RESPECTS returns FALSE when an edge of A crosses', w:2, test:(t,P)=>{const b=P.body('respects'); return /crosses\s*\(/.test(b) && /return\s+(false|0|no)\b/.test(b);}, hint:'if CROSSES(u, v, S) return FALSE; return TRUE at the end.'},
   {label:'LIGHT-EDGE initializes the best weight to ∞', w:2, test:(t,P)=>/=\s*(inf\b|max_?(int|value)|null|nil|none)/.test(P.body('lightedge')), hint:'best = NIL, bestW = ∞'},
   {label:'LIGHT-EDGE only considers crossing edges', w:2, test:(t,P)=>{const b=P.body('lightedge'); return /\b(for|foreach)\b/.test(b) && /crosses\s*\(/.test(b);}, hint:'for each (u,v) ∈ G.E: if CROSSES(u, v, S) …'},
   {label:'LIGHT-EDGE compares weights', w:2, test:(t,P)=>/(w\s*\([^)]*\)|weight|\.w\b)[^\n]*<|<[^\n]*(w\s*\(|weight|\.w\b)/.test(P.body('lightedge')), hint:'if w(u, v) < bestW'},
   {label:'LIGHT-EDGE returns the edge', w:1, test:(t,P)=>/\breturn\b/.test(P.body('lightedge')), hint:'return best'}
  ],
  efficiency:[
   {label:'LIGHT-EDGE is a single O(E) pass', w:5, test:(t,P)=>{const f=P.fn('lightedge'); return !!f && (f.maxLoop||0) <= 1;}, hint:'One loop over E is enough.'},
   {label:'No sorting needed to find a minimum', w:5, test:(t,P)=>!/sort/.test(P.body('lightedge')), hint:'Sorting costs O(E lg E); a linear scan finds the min in O(E).'}
  ],
  penalties:[
   {label:'Nested loops inside LIGHT-EDGE', p:3, test:(t,P)=>{const f=P.fn('lightedge'); return !!f && (f.maxLoop||0) > 1;}, hint:'Avoid re-scanning edges or S for every edge; use set membership.'}
  ],
  model:`CROSSES(u, v, S)
    return (u ∈ S) ≠ (v ∈ S)          // exactly one endpoint in S

RESPECTS(A, S)
    for each edge (u, v) ∈ A
        if CROSSES(u, v, S)
            return FALSE
    return TRUE

LIGHT-EDGE(G, w, S)
    best = NIL
    bestW = ∞
    for each edge (u, v) ∈ G.E
        if CROSSES(u, v, S) and w(u, v) < bestW
            best = (u, v)
            bestW = w(u, v)
    return best`},

 {id:'kr-mst', topic:'kruskal', title:"Kruskal's algorithm",
  prompt:'Write <code>MST-KRUSKAL(G, w)</code> that returns the set of MST edges. Use the disjoint-set operations (MAKE-SET, FIND-SET, UNION). Bonus efficiency credit for stopping as soon as the tree is complete.',
  starter:'MST-KRUSKAL(G, w)\n    \n',
  define:['mstkruskal'], call:['makeset','findset','union'], maxLoop:1,
  correctness:[
   {label:'Initializes A to the empty set', w:1, test:t=>EMPTY_INIT.test(t), hint:'A = ∅'},
   {label:'MAKE-SET for every vertex', w:2, test:t=>FOR_VERT.test(t), hint:'for each vertex v ∈ G.V: MAKE-SET(v)'},
   {label:'Sorts edges by weight (non-decreasing)', w:2, test:t=>/sort/.test(t), hint:'sort G.E into non-decreasing order by w'},
   {label:'Iterates over edges in sorted order', w:1, test:t=>FOR_EDGE.test(t) || /(for|foreach)[^\n]*sort/.test(t), hint:'for each (u, v) in sorted order'},
   {label:'Checks endpoints are in different sets', w:2, test:t=>/findset\s*\([^)]*\)\s*!=\s*findset\s*\(/.test(t), hint:'if FIND-SET(u) ≠ FIND-SET(v)'},
   {label:'Adds the edge to A', w:1, test:t=>ADD_EDGE.test(t), hint:'A = A ∪ {(u, v)}'},
   {label:'UNIONs the two components', w:2, test:t=>/\bunion\s*\(/.test(t), hint:'UNION(u, v)'},
   {label:'Returns A', w:1, test:t=>/\breturn\b/.test(t), hint:'return A'}
  ],
  efficiency:[
   {label:'Sorts once, outside the main loop', w:3, test:(t,P)=>P.lines.some(l=>/sort/.test(l.t) && l.loopDepth===0) && P.count(/sort/)<=2, hint:'Sorting inside the loop multiplies the cost.'},
   {label:'Cycle detection via Union-Find (O(α(V)))', w:4, test:t=>/findset\s*\(/.test(t), hint:'Use FIND-SET instead of searching for a path.'},
   {label:'Early exit once |A| = |V| − 1', w:2, bonus:true, test:t=>/(\|\s*a\s*\||len\s*\(\s*a\s*\)|a\.(size|length|count)|\bcount\b|\bsize\b|\bedges\w*)[^\n]*(==|>=)[^\n]*-\s*1/.test(t), hint:'Bonus: break when the tree has |V| − 1 edges.'}
  ],
  penalties:[
   {label:'Detects cycles with DFS/BFS/path search (O(V) per edge)', p:4, test:t=>/\b(dfs|bfs|hascycle|createscycle|formscycle|haspath|pathexists|reachable)\b|has_?cycle|creates?_?cycle|has_?path/.test(t), hint:'FIND-SET is nearly O(1) amortized.'}
  ],
  model:`MST-KRUSKAL(G, w)
    A = ∅
    for each vertex v ∈ G.V
        MAKE-SET(v)
    sort G.E into non-decreasing order by weight w
    for each edge (u, v) ∈ G.E, taken in sorted order
        if FIND-SET(u) ≠ FIND-SET(v)
            A = A ∪ {(u, v)}
            UNION(u, v)
            if |A| == |G.V| - 1        // optional early exit
                break
    return A`},

 {id:'kr-weight', topic:'kruskal', title:'Kruskal: total weight or "disconnected"',
  prompt:'Write <code>KRUSKAL-WEIGHT(G, w)</code> that returns the total weight of a minimum spanning tree, or reports that G is <b>disconnected</b> (fewer than |V| − 1 edges could be added). Keep it modular, e.g. by calling a helper or MST-KRUSKAL.',
  starter:'KRUSKAL-WEIGHT(G, w)\n    \n',
  define:['kruskalweight'], call:['mstkruskal|findset','union|mstkruskal'], maxLoop:1,
  correctness:[
   {label:'Builds MST edges with Kruskal / Union-Find', w:3, test:t=>/mstkruskal\s*\(|kruskal\s*\(/.test(t) || (/findset/.test(t) && /\bunion\s*\(/.test(t) && /sort/.test(t)), hint:'Call MST-KRUSKAL(G, w) or inline the sort + FIND-SET/UNION loop.'},
   {label:'Accumulates the total weight', w:2, test:t=>/\+=|(\w+)\s*=\s*\1\s*\+|\bsum\s*\(/.test(t), hint:'total = total + w(u, v)'},
   {label:'Initializes the total to 0', w:1, test:t=>/=\s*0\b/.test(t) || /\bsum\s*\(/.test(t), hint:'total = 0'},
   {label:'Compares edge count with |V| − 1', w:2, test:t=>/-\s*1/.test(t) && /(<|!=|==|>=)/.test(t), hint:'if |A| < |V| − 1 → disconnected'},
   {label:'Reports disconnected / returns total', w:2, test:t=>/disconnect|not\s+connected|error|inf\b|nil|null|none|-1|false/.test(t) && /\breturn\b/.test(t), hint:'return "disconnected" (or ∞) otherwise return total.'}
  ],
  efficiency:[
   {label:'Single pass over sorted edges', w:5, test:(t,P)=>P.maxLoop<=1, hint:'Sum weights while accepting edges or in one pass afterwards.'},
   {label:'Uses Union-Find for cycle checks', w:5, test:t=>/findset|mstkruskal|kruskal\s*\(/.test(t), hint:''}
  ],
  penalties:[
   {label:'Runs BFS/DFS separately to test connectivity', p:2, test:t=>/\b(bfs|dfs)\b/.test(t), hint:'Kruskal already tells you: connected ⇔ |A| = |V| − 1.'}
  ],
  model:`KRUSKAL-WEIGHT(G, w)
    A = MST-KRUSKAL(G, w)
    if |A| < |G.V| - 1
        return "disconnected"          // spanning forest only
    return TOTAL-WEIGHT(A, w)

TOTAL-WEIGHT(A, w)
    total = 0
    for each edge (u, v) ∈ A
        total = total + w(u, v)
    return total`},

 {id:'pr-mst', topic:'prim', title:"Prim's algorithm",
  prompt:'Write <code>MST-PRIM(G, w, r)</code> using a min-priority queue Q with INSERT, EXTRACT-MIN and DECREASE-KEY. Each vertex has fields <code>key</code> and <code>π</code>.',
  starter:'MST-PRIM(G, w, r)\n    \n',
  define:['mstprim'], call:['extractmin','decreasekey'], maxLoop:2,
  correctness:[
   {label:'Initializes every key to ∞', w:2, test:t=>/key[^\n]*=\s*inf\b/.test(t), hint:'u.key = ∞ for each u'},
   {label:'Initializes every parent to NIL', w:1, test:t=>new RegExp(PAR + '\\s*=\\s*(nil|null|none|undefined|-1)\\b').test(t), hint:'u.π = NIL'},
   {label:'Root key set to 0', w:2, test:t=>/\br\.key\s*=\s*0\b|key\s*\[\s*r\s*\]\s*=\s*0\b|decreasekey\s*\([^)]*\br\s*,\s*0\s*\)/.test(t), hint:'DECREASE-KEY(Q, r, 0)'},
   {label:'Fills the priority queue', w:1, test:t=>/insert\s*\(|build\w*heap|priority|minheap|\bq\s*=\s*(g\.v|v\b|all|\{)/.test(t), hint:'INSERT(Q, u) for each vertex'},
   {label:'Loops while Q is non-empty', w:1, test:t=>/while[^\n]*(\bq\b|queue|heap)/.test(t), hint:'while Q ≠ ∅'},
   {label:'Extracts the minimum-key vertex', w:2, test:t=>/extractmin/.test(t), hint:'u = EXTRACT-MIN(Q)'},
   {label:'Scans the adjacency list of u', w:1, test:t=>/(for|foreach)[^\n]*(adj|neighbo)/.test(t), hint:'for each v ∈ G.Adj[u]'},
   {label:'Tests v ∈ Q and w(u,v) < v.key', w:2, test:t=>/(\bin\s+q\b|inq|inqueue|not\s+visited|!\s*visited|visited\s*\[[^\]]*\]\s*==\s*false)/.test(t) && /(w\s*\([^)]*\)|weight|\bwt\b)\s*<|<\s*\w+\.key|<\s*key/.test(t), hint:'if v ∈ Q and w(u, v) < v.key'},
   {label:'Updates π and the key', w:2, test:t=>new RegExp(PAR + '\\s*=\\s*u\\b').test(t) && /(decreasekey|key[^\n]*=\s*(w|weight))/.test(t), hint:'v.π = u; DECREASE-KEY(Q, v, w(u, v))'}
  ],
  efficiency:[
   {label:'Uses a min-priority queue (EXTRACT-MIN)', w:4, test:t=>/extractmin/.test(t), hint:'O(lg V) per extraction with a binary heap.'},
   {label:'Uses DECREASE-KEY instead of rebuilding the queue', w:4, test:t=>/decreasekey/.test(t), hint:'O(lg V) per update; O(1) amortized with a Fibonacci heap.'},
   {label:'O(1) "in Q" membership test (flag)', w:2, bonus:true, test:t=>/inq|inqueue|visited|intree|\.done\b/.test(t), hint:'Bonus: keep a boolean per vertex instead of searching the heap.'}
  ],
  penalties:[
   {label:'Linear scan over all vertices inside the main loop', p:4, test:(t,P)=>P.lines.some(l=>l.isLoop && l.loopDepth>=1 && !/adj|neighbo/.test(l.t)), hint:'An O(V) min-search per step makes Prim O(V²) (fine only for dense graphs).'},
   {label:'Sorts inside the loop', p:3, test:(t,P)=>P.lines.some(l=>/sort/.test(l.t) && l.loopDepth>=1), hint:'The heap already orders vertices by key.'}
  ],
  model:`MST-PRIM(G, w, r)
    Q = ∅
    for each vertex u ∈ G.V
        u.key = ∞
        u.π = NIL
        INSERT(Q, u)
    DECREASE-KEY(Q, r, 0)           // r.key = 0
    while Q ≠ ∅
        u = EXTRACT-MIN(Q)
        for each v ∈ G.Adj[u]
            if v ∈ Q and w(u, v) < v.key
                v.π = u
                DECREASE-KEY(Q, v, w(u, v))`},

 {id:'pr-edges', topic:'prim', title:'Recover the MST from π pointers',
  prompt:'After calling <code>MST-PRIM(G, w, r)</code>, every vertex has a parent pointer <code>π</code>. Write <code>PRIM-MST-EDGES(G, w, r)</code> that runs Prim, then returns the set of MST edges <b>and</b> its total weight.',
  starter:'PRIM-MST-EDGES(G, w, r)\n    \n',
  define:['primmstedges'], call:['mstprim'], maxLoop:1,
  correctness:[
   {label:'Calls MST-PRIM first', w:2, test:t=>/mstprim\s*\(/.test(t), hint:'MST-PRIM(G, w, r)'},
   {label:'Iterates over the vertices', w:2, test:t=>/(for|foreach)[^\n]*\b(v|u|vertex|vertices|g\.v|node)\b/.test(t), hint:'for each v ∈ G.V'},
   {label:'Skips the root / NIL parents', w:2, test:t=>/!=\s*(r|nil|null|none)\b|\bif[^\n]*(nil|null|none)\b|!=\s*nil/.test(t), hint:'if v ≠ r (equivalently v.π ≠ NIL)'},
   {label:'Adds edge (v, v.π)', w:2, test:t=>/\(\s*\w+\s*,\s*\w+\.(pi|p|parent)\s*\)|\(\s*\w+\.(pi|p|parent)\s*,\s*\w+\s*\)/.test(t), hint:'A = A ∪ {(v, v.π)}'},
   {label:'Accumulates the total weight', w:2, test:t=>/\+=|(\w+)\s*=\s*\1\s*\+/.test(t), hint:'total = total + w(v, v.π)  (or + v.key)'},
   {label:'Returns the edges and the weight', w:1, test:t=>/\breturn\b/.test(t), hint:'return (A, total)'}
  ],
  efficiency:[
   {label:'Single O(V) pass after Prim', w:5, test:(t,P)=>P.maxLoop<=1, hint:'Each vertex contributes at most one edge.'},
   {label:'Uses stored v.key or w(v, v.π) directly', w:5, test:t=>/\.key\b|w\s*\(\s*\w+\s*,\s*\w+\.(pi|p|parent)|w\s*\(\s*\w+\.(pi|p|parent)/.test(t), hint:'No need to search the edge list for the parent edge.'}
  ],
  penalties:[
   {label:'Searches the edge list for each vertex', p:3, test:(t,P)=>P.maxLoop>1, hint:'That makes it O(VE).'}
  ],
  model:`PRIM-MST-EDGES(G, w, r)
    MST-PRIM(G, w, r)
    A = ∅
    total = 0
    for each vertex v ∈ G.V
        if v.π ≠ NIL                 // every vertex except r
            A = A ∪ {(v, v.π)}
            total = total + v.key    // v.key == w(v, v.π)
    return (A, total)`},

 {id:'fib-cut', topic:'fib', title:'CUT and CASCADING-CUT',
  prompt:'Write <code>CUT(H, x, y)</code>, which moves child x of y to the root list of Fibonacci heap H, and <code>CASCADING-CUT(H, y)</code>, which handles marking and propagates cuts up the tree.',
  starter:'CUT(H, x, y)\n    \n\nCASCADING-CUT(H, y)\n    \n',
  define:['cut','cascadingcut'], call:['cut','cascadingcut'], maxLoop:0,
  correctness:[
   {label:"Removes x from y's child list", w:2, test:(t,P)=>/remove|delete|unlink|splice/.test(P.body('cut')), hint:"remove x from y's child list"},
   {label:'Decrements y.degree', w:2, test:t=>/degree[^\n]*(-=\s*1|-\s*1|--)/.test(t), hint:'y.degree = y.degree − 1'},
   {label:'Adds x to the root list', w:2, test:t=>/rootlist|root/.test(t) && /(add|insert|append|concat|splice|move|addto)/.test(t), hint:"add x to H's root list"},
   {label:'Clears x.p', w:1, test:t=>/\.(p|parent)\s*=\s*(nil|null|none)/.test(t), hint:'x.p = NIL'},
   {label:'Clears x.mark', w:1, test:(t,P)=>/mark\s*=\s*(false|0|no)\b/.test(P.body(['cut'])) || /mark\s*=\s*(false|0|no)\b/.test(t), hint:'x.mark = FALSE'},
   {label:"CASCADING-CUT reads y's parent and checks it is not NIL", w:2, test:(t,P)=>{const b=P.body('cascadingcut'); return /(\.p\b|\.parent\b)/.test(b) && /(nil|null|none)/.test(b);}, hint:'z = y.p; if z ≠ NIL'},
   {label:'Marks y if it was unmarked', w:2, test:(t,P)=>/mark\s*=\s*(true|1|yes)\b/.test(P.body('cascadingcut')), hint:'if y.mark == FALSE then y.mark = TRUE'},
   {label:'Otherwise cuts y and recurses on the parent', w:3, test:(t,P)=>{const b=P.body('cascadingcut'); return /\bcut\s*\(/.test(b) && (/cascadingcut\s*\(/.test(b) || /\bwhile\b/.test(b));}, hint:'else CUT(H, y, z); CASCADING-CUT(H, z)'}
  ],
  efficiency:[
   {label:'CUT is O(1), with no loops', w:5, test:(t,P)=>P.hasFn('cut') && !/\b(for|while)\b/.test(P.body('cut')), hint:'Doubly linked circular lists give O(1) splicing.'},
   {label:'CASCADING-CUT only walks up the parent chain', w:5, test:(t,P)=>!/\bfor\b/.test(P.body('cascadingcut')), hint:'No need to visit children or the root list.'}
  ],
  penalties:[
   {label:'Scans the root list or a child list', p:3, test:t=>/(for|foreach)[^\n]*(root|child)/.test(t), hint:'Use the doubly linked list pointers directly.'}
  ],
  model:`CUT(H, x, y)                  // O(1) splice
    remove x from the child list of y
    y.degree = y.degree - 1
    add x to the root list of H
    x.p = NIL
    x.mark = FALSE

CASCADING-CUT(H, y)
    z = y.p
    if z ≠ NIL
        if y.mark == FALSE
            y.mark = TRUE
        else
            CUT(H, y, z)
            CASCADING-CUT(H, z)`},

 {id:'fib-deg', topic:'fib', title:'Exact max-degree bound from Fibonacci numbers',
  prompt:'Lemma 19.12 says a degree-k node has at least F<sub>k+2</sub> nodes in its subtree. Write <code>MAX-DEGREE(n)</code> that returns the largest k with F<sub>k+2</sub> ≤ n, i.e. the largest degree possible in an n-node Fibonacci heap. Aim for O(lg n) time.',
  starter:'MAX-DEGREE(n)\n    \n',
  define:['maxdegree'], call:[], maxLoop:1,
  correctness:[
   {label:'Initializes consecutive Fibonacci values', w:2, test:t=>/(\w+)\s*,\s*(\w+)\s*=\s*[0-9]|\w+\s*=\s*[0-9]\b[\s\S]*\w+\s*=\s*[0-9]\b/.test(t) || /log/.test(t), hint:'a = 1 (F₂), b = 2 (F₃), k = 0'},
   {label:'Loops while the next Fibonacci number ≤ n', w:3, test:t=>/while[^\n]*(<=?\s*n\b|n\s*>=?)/.test(t) || (/log/.test(t) && /(phi|1\.618|sqrt\s*\(\s*5)/.test(t)), hint:'while F_{k+3} ≤ n: k = k + 1'},
   {label:'Advances the Fibonacci sequence (sum of previous two)', w:3, test:t=>/=\s*\w+\s*\+\s*\w+|,\s*\w+\s*\+\s*\w+/.test(t) || (/log/.test(t) && /(phi|1\.618|sqrt)/.test(t)), hint:'a, b = b, a + b'},
   {label:'Counts k', w:1, test:t=>/\+=\s*1|\+\s*1\b|\+\+/.test(t) || /floor/.test(t), hint:'k = k + 1'},
   {label:'Returns k', w:1, test:t=>/\breturn\b/.test(t), hint:'return k'}
  ],
  efficiency:[
   {label:'Iterative / closed form, not naive double recursion', w:5, test:t=>!/fib\w*\s*\(\s*\w+\s*-\s*1\s*\)\s*\+\s*fib\w*\s*\(/.test(t), hint:'Naive recursive Fibonacci is exponential.'},
   {label:'Does not recompute Fibonacci numbers from scratch each step', w:5, test:(t,P)=>P.maxLoop<=1, hint:'Carry the last two values forward: O(lg n) iterations total.'}
  ],
  penalties:[
   {label:'Naive recursive Fibonacci', p:4, test:t=>/fib\w*\s*\(\s*\w+\s*-\s*1\s*\)\s*\+\s*fib\w*\s*\(/.test(t), hint:'Exponential time.'}
  ],
  model:`MAX-DEGREE(n)              // largest k with F(k+2) <= n
    k = 0
    a = 1                       // F(k+2) = F(2)
    b = 2                       // F(k+3) = F(3)
    while b <= n
        a, b = b, a + b
        k = k + 1
    return k                    // O(lg n) iterations, since F grows like φ^k`}
];

function gradeCode(q, src){
  const P = parse(src), t = P.text;
  const nonEmpty = src.split('\n').filter(l => l.trim()).length;
  const fb = {correctness: [], modularity: [], efficiency: []};
  // ---- correctness ----
  let tot = 0, got = 0;
  for (const c of q.correctness){ tot += c.w; const ok = safe(() => c.test(t, P)); if (ok) got += c.w; fb.correctness.push({ok, label: c.label, hint: c.hint}); }
  let correctness = 10 * got / tot;
  const starterLines = (q.starter || '').split('\n').filter(l => l.trim()).length;
  if (nonEmpty - starterLines < 3) { correctness = Math.min(correctness, 2); fb.correctness.push({ok: false, pen: true, label: 'Answer is too short to be a complete solution'}); }
  // ---- modularity ----
  let mod = 0;
  const defs = q.define.filter(d => P.funcs.some(f => f.norm === d || f.norm.includes(d) || (d.includes(f.norm) && f.norm.length > 3)));
  const dScore = q.define.length ? 4 * defs.length / q.define.length : 4;
  mod += dScore;
  fb.modularity.push({ok: defs.length === q.define.length, label: `Defines the required procedures (${defs.length}/${q.define.length})`, hint: q.define.length ? 'Expected: ' + q.define.map(d => d.toUpperCase()).join(', ') + '. Use a header line like NAME(args) followed by an indented body.' : ''});
  const usedCalls = q.call.filter(c => c.split('|').some(x => P.calls(x)));
  const extraHelpers = P.funcs.filter(f => !q.define.some(d => f.norm.includes(d)) && P.calls(f.norm) );
  let cScore = q.call.length ? 2 * usedCalls.length / q.call.length : 2;
  if (extraHelpers.length) cScore = Math.min(2, cScore + 0.5);
  mod += cScore;
  fb.modularity.push({ok: cScore >= 1.99, label: `Reuses helper procedures/ADT operations (${usedCalls.length}/${q.call.length || 0}${extraHelpers.length ? `, +${extraHelpers.length} own helper${extraHelpers.length > 1 ? 's' : ''}` : ''})`, hint: q.call.length ? 'Call ' + q.call.map(c => c.split('|').join(' or ').toUpperCase()).join(', ') + ' rather than re-implementing them inline.' : ''});
  const longest = P.funcs.reduce((m, f) => Math.max(m, f.len), 0);
  const sizeOK = P.funcs.length > 0 && longest <= 20;
  mod += P.funcs.length === 0 ? 0 : longest <= 20 ? 2 : longest <= 30 ? 1 : 0;
  fb.modularity.push({ok: sizeOK, label: P.funcs.length ? `Procedures are short and focused (longest: ${longest} lines)` : 'No procedure headers detected', hint: P.funcs.length ? 'Split procedures longer than ~20 lines into helpers.' : 'Wrap your code in named procedures, e.g. MST-PRIM(G, w, r).'});
  const nestOK = P.maxNest <= 4;
  mod += nestOK ? 1 : 0;
  fb.modularity.push({ok: nestOK, label: `Nesting depth is manageable (${P.maxNest} level${P.maxNest === 1 ? '' : 's'})`, hint: 'Deep nesting (> 4) hurts readability; extract a helper.'});
  const goodNames = P.funcs.length > 0 && P.funcs.every(f => f.name.length >= 3);
  const commented = /(\/\/|#|\u25b9|\/\*|--\s)/.test(src);
  mod += (goodNames ? 0.5 : 0) + (commented ? 0.5 : 0);
  fb.modularity.push({ok: goodNames && commented, label: 'Descriptive names and at least one comment', hint: (goodNames ? '' : 'Use descriptive procedure names. ') + (commented ? '' : 'Add a brief comment (// …) explaining a key step.')});
  // ---- efficiency ----
  let et = 0, eg = 0;
  for (const c of q.efficiency){ const ok = safe(() => c.test(t, P)); if (!c.bonus) et += c.w; if (ok) eg += c.w; fb.efficiency.push({ok, label: c.label + (c.bonus ? ' (bonus)' : ''), hint: c.hint, bonus: c.bonus}); }
  let eff = et ? 10 * Math.min(eg, et) / et : 10;
  if (eg > et) eff = 10;
  for (const p of (q.penalties || [])){ if (safe(() => p.test(t, P))) { eff -= p.p; fb.efficiency.push({ok: false, pen: true, label: p.label + ` (−${p.p})`, hint: p.hint}); } }
  if (P.maxLoop > q.maxLoop + 0){ eff -= 2; fb.efficiency.push({ok: false, pen: true, label: `Loop nesting depth ${P.maxLoop} exceeds the expected ${q.maxLoop} (−2)`, hint: 'Extra nested loops usually mean a higher polynomial running time.'}); }
  if (correctness < 4) { mod = Math.min(mod, correctness + 3); eff = Math.min(eff, correctness + 2); fb.efficiency.push({ok: false, pen: true, label: 'Efficiency capped because the solution is largely incomplete'}); }
  const clamp = x => Math.max(0, Math.min(10, Math.round(x * 10) / 10));
  const r = {correctness: clamp(correctness), modularity: clamp(mod), efficiency: clamp(eff), fb};
  r.overall = Math.round((0.4 * r.correctness + 0.3 * r.modularity + 0.3 * r.efficiency) * 10);
  r.letter = r.overall >= 90 ? 'A' : r.overall >= 80 ? 'B' : r.overall >= 70 ? 'C' : r.overall >= 60 ? 'D' : 'F';
  return r;
}
function safe(f){ try { return !!f(); } catch (e) { return false; } }

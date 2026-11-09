// ======================= TOPICS =======================
const TOPICS = {
  ds:      {name: 'Disjoint Sets',          icon: '🧩', color: '#f472b6', blurb: 'Union-Find, union by rank, path compression, α(n).'},
  mst:     {name: 'MSTs & Safe Edges',      icon: '🌳', color: '#a78bfa', blurb: 'Cuts, light edges, the generic algorithm and its proof.'},
  kruskal: {name: "Kruskal's Algorithm",    icon: '🔗', color: '#34d399', blurb: 'Sort edges, merge components with Union-Find.'},
  prim:    {name: "Prim's Algorithm",       icon: '🌐', color: '#22d3ee', blurb: 'Grow one tree with a min-priority queue.'},
  fib:     {name: 'Fibonacci Heap Bounds',  icon: '🌀', color: '#fbbf24', blurb: 'Cascading cuts, the Fibonacci size bound, D(n) = O(lg n).'}
};

// ======================= MULTIPLE CHOICE =======================
const MC = [
 // ---- Disjoint sets ----
 {topic:'ds', q:'In the disjoint-set forest, what does FIND-SET(x) do when path compression is used?',
  options:['Makes every node on the path from x to the root point directly to the root','Swaps x with the root so x becomes the representative','Moves the root down to be a child of x','Increments the rank of every node on the path'], answer:0,
  explain:'Path compression re-points each node on the find path directly at the root, flattening the tree for future finds.'},
 {topic:'ds', q:'With union by rank, two roots of <b>equal</b> rank are linked. What happens to the ranks?',
  options:['One root is chosen as parent and its rank increases by 1','Both ranks increase by 1','Ranks are unchanged','The child\'s rank is set to 0'], answer:0,
  explain:'Equal ranks: pick one as the parent and increment its rank, since the tree height may have grown by one.'},
 {topic:'ds', q:'With union by rank, two roots of <b>unequal</b> rank are linked. Which statement is true?',
  options:['The lower-rank root becomes the child and no ranks change','The higher-rank root becomes the child','The new root\'s rank becomes the sum of both ranks','The new root\'s rank increases by 1'], answer:0,
  explain:'Attaching the shorter tree under the taller one cannot increase the taller tree\'s height bound, so ranks stay the same.'},
 {topic:'ds', q:'What is the running time of a sequence of m MAKE-SET, UNION and FIND-SET operations (n of them MAKE-SETs) using union by rank <i>and</i> path compression?',
  options:['O(m α(n))','O(m lg n)','O(m + n lg n)','O(mn)'], answer:0,
  explain:'Tarjan\'s analysis gives O(m α(n)); since α(n) ≤ 4 in practice, that is effectively O(1) amortized per operation.'},
 {topic:'ds', q:'Starting with n MAKE-SET operations, what is the maximum number of UNION operations that can actually merge sets?',
  options:['n − 1','n','n / 2','m − n'], answer:0, explain:'Each successful union reduces the number of sets by one; after n − 1 unions only one set remains.'},
 {topic:'ds', q:'With the linked-list representation and the <b>weighted-union heuristic</b>, a sequence of m operations on n elements takes:',
  options:['O(m + n lg n)','O(m α(n))','O(mn)','O(m lg m)'], answer:0,
  explain:'Each element\'s back-pointer is updated only when it\'s in the smaller list, and its set at least doubles each time, so at most lg n updates per element.'},
 {topic:'ds', q:'In the forest representation, the "rank" of a node is…',
  options:['An upper bound on the height of the node','The exact number of nodes in its subtree','Its depth from the root','The number of children it has'], answer:0,
  explain:'Rank is an upper bound on height; path compression can shrink height without updating rank.'},
 {topic:'ds', q:'How is the root (representative) of a tree identified in the disjoint-set forest?',
  options:['It is its own parent (x.p == x)','Its parent pointer is NIL','It has rank 0','It is the head of a linked list'], answer:0,
  explain:'MAKE-SET sets x.p = x, and roots keep pointing to themselves.'},
 {topic:'ds', q:'For connected components of a <b>static</b> undirected graph, which approach is faster than Union-Find?',
  options:['Depth-first search','Re-running Union-Find twice','Kruskal\'s algorithm','Bubble sort on the edges'], answer:0,
  explain:'DFS is linear for a static graph. Union-Find shines when edges are added dynamically, avoiding a full DFS re-run.'},
 {topic:'ds', q:'Without any heuristic, linked-list UNION that appends the longer list onto the shorter one can cost, for n MAKE-SETs and n UNIONs:',
  options:['O(n) amortized per operation','O(1) amortized per operation','O(lg n) amortized per operation','O(α(n)) amortized per operation'], answer:0,
  explain:'The total can be Θ(n²) pointer updates over 2n operations, i.e. O(n) amortized per operation.'},
 {topic:'ds', q:'In practice, what is the largest value of α(n) we would ever expect to encounter?',
  options:['4','16','lg n','64'], answer:0, explain:'α(n) ≤ 4 for any n up to A₄(1), which is astronomically larger than the number of atoms in the universe.'},
 {topic:'ds', q:'Why is the recursive FIND-SET with path compression <b>not</b> tail recursive?',
  options:['It updates x.p after the recursive call returns','It calls itself twice','It needs to know the rank of x','It returns NIL at the root'], answer:0,
  explain:'It makes a pass up to find the root and then updates each node as the recursion unwinds.'},

 // ---- MST ----
 {topic:'mst', q:'A cut (S, V − S) <b>respects</b> a set of edges A if…',
  options:['No edge in A crosses the cut','Every edge in A crosses the cut','A contains a light edge crossing the cut','S contains all endpoints of A and V − S is empty'], answer:0,
  explain:'Respecting means no edge of A has one endpoint in S and the other in V − S.'},
 {topic:'mst', q:'A <b>light edge</b> crossing a cut is…',
  options:['An edge of minimum weight among all edges crossing the cut','The lightest edge in the entire graph','Any edge in the MST','An edge with weight 0'], answer:0,
  explain:'It is minimum among crossing edges only, and there may be ties.'},
 {topic:'mst', q:'What loop invariant does GENERIC-MST maintain?',
  options:['A is a subset of some minimum spanning tree','A is always a spanning tree','A contains no light edges','|A| = |V| − 1'], answer:0,
  explain:'Initially A = ∅; adding only safe edges keeps A inside some MST.'},
 {topic:'mst', q:'Are minimum spanning trees unique?',
  options:['Not necessarily, since ties in edge weights can give several MSTs','Always','Never','Only for directed graphs'], answer:0,
  explain:'Equal-weight alternatives (like edges (e,f) and (c,e) in the notes\' example) can give different MSTs with the same total. Distinct weights guarantee uniqueness.'},
 {topic:'mst', q:'In the proof of the Safe Edge Theorem, if T doesn\'t contain (u,v), how is T′ built?',
  options:['Remove an edge (x,y) on T\'s u–v path that crosses the cut, then add (u,v)','Add (u,v) and remove the heaviest edge of T','Remove all edges crossing the cut and add (u,v)','Re-run Kruskal on T ∪ {(u,v)}'], answer:0,
  explain:'T′ = T − {(x,y)} ∪ {(u,v)}; since (u,v) is light, w(T′) ≤ w(T).'},
 {topic:'mst', q:'Why must the edge (x,y) removed in the Safe Edge proof <b>not</b> belong to A?',
  options:['Because the cut respects A, so no edge of A crosses it','Because (x,y) is heavier than every edge in A','Because A is empty','Because (x,y) forms a cycle with A'], answer:0,
  explain:'(x,y) crosses the cut, and edges of A never cross a cut that respects A.'},
 {topic:'mst', q:'Why is a minimum-cost subgraph connecting all vertices (with positive weights) always a tree?',
  options:['Any cycle contains an edge that could be removed to lower the cost while staying connected','Because graphs cannot contain cycles','Because DFS always produces trees','Because it has exactly |V| edges'], answer:0,
  explain:'Removing one edge of a cycle keeps connectivity and reduces total weight, so a minimum solution has no cycles.'},
 {topic:'mst', q:'If G is not connected, the MST problem generalizes to finding…',
  options:['A minimum spanning forest, one tree per connected component','A Hamiltonian path','The shortest path tree','Nothing, since the problem is undefined'], answer:0,
  explain:'We find T₁ … T_c for each of the c components.'},
 {topic:'mst', q:'The Safe Edge Corollary says a light edge connecting a component C of G_A = (V, A) to another component is safe. Which cut is used?',
  options:['(V_C, V − V_C)','(A, E − A)','({u}, V − {u}) for any vertex u','(V, ∅)'], answer:0,
  explain:'Set S = V_C. That cut respects A because C is a whole component.'},
 {topic:'mst', q:'How many times does GENERIC-MST\'s loop execute on a connected graph?',
  options:['|V| − 1','|E|','|V|','|E| − |V|'], answer:0, explain:'Each iteration adds one safe edge, and a spanning tree has |V| − 1 edges.'},

 // ---- Kruskal ----
 {topic:'kruskal', q:'Which data structure does Kruskal\'s algorithm use to decide whether an edge would create a cycle?',
  options:['Disjoint-set (Union-Find) forest','Min-priority queue keyed on vertices','Adjacency matrix with DFS','Stack'], answer:0,
  explain:'If FIND-SET(u) == FIND-SET(v), u and v are already connected, so the edge would form a cycle.'},
 {topic:'kruskal', q:'In what order does Kruskal\'s algorithm consider edges?',
  options:['Non-decreasing order of weight','Non-increasing order of weight','Breadth-first from a root','Order of the adjacency lists'], answer:0,
  explain:'Greedily cheapest first ("stingy").'},
 {topic:'kruskal', q:'What is the overall running time of Kruskal\'s algorithm with a good Union-Find implementation?',
  options:['O(E lg V)','O(V²)','O(E + V lg V)','O(E α(V)) without sorting'], answer:0,
  explain:'Sorting is O(E lg E) = O(E lg V), and it dominates the O(E α(V)) Union-Find work.'},
 {topic:'kruskal', q:'Which step dominates Kruskal\'s running time?',
  options:['Sorting the edges','The MAKE-SET loop','Initializing A','The UNION operations'], answer:0, explain:'O(E lg E) sorting dominates O((V + E) α(V)).'},
 {topic:'kruskal', q:'Why can O(E lg E) be rewritten as O(E lg V)?',
  options:['|E| ≤ |V|², so lg E ≤ 2 lg V','|E| = |V| − 1','lg E is always smaller than lg V','α(V) = lg V'], answer:0, explain:'lg |E| ≤ lg |V|² = 2 lg |V| = O(lg V).'},
 {topic:'kruskal', q:'What does Kruskal\'s algorithm produce on a graph with 3 connected components?',
  options:['A minimum spanning forest of 3 trees','An error','An MST of only the first component','A single tree with 3 cycles'], answer:0,
  explain:'Unlike Prim, Kruskal naturally works on disconnected graphs.'},
 {topic:'kruskal', q:'During Kruskal, the set of chosen edges A is always…',
  options:['A forest (possibly several trees)','A single connected tree','A cycle','Empty until the end'], answer:0,
  explain:'Kruskal can "hop" around the graph, growing several fragments that eventually merge.'},
 {topic:'kruskal', q:'Kruskal\'s algorithm has the same structure as which earlier algorithm?',
  options:['CONNECTED-COMPONENTS with Union-Find','Topological sort','Heap sort','Bellman-Ford'], answer:0,
  explain:'Both MAKE-SET every vertex and process edges with FIND-SET/UNION; Kruskal just sorts the edges first and records accepted edges.'},
 {topic:'kruskal', q:'Kruskal rejects edge (u,v) when…',
  options:['FIND-SET(u) == FIND-SET(v)','u.key < v.key','w(u,v) is larger than the previous edge','u and v are adjacent'], answer:0, explain:'Same representative ⇒ already connected ⇒ adding the edge forms a cycle.'},
 {topic:'kruskal', q:'Which safe-edge argument justifies Kruskal\'s choice?',
  options:['The Corollary: a light edge connecting two components of G_A is safe','The Fibonacci-heap degree lemma','The edge is the heaviest in a cycle','The edge is on a shortest path'], answer:0,
  explain:'The cheapest edge joining two different components is light for the cut around one of them.'},

 // ---- Prim ----
 {topic:'prim', q:'In MST-PRIM, what is the key of a vertex v still in the queue?',
  options:['Minimum weight of any edge connecting v to the tree so far (∞ if none)','Length of the shortest path from r to v','Number of neighbors of v','The rank of v\'s set'], answer:0,
  explain:'This is how EXTRACT-MIN finds a light edge crossing (V_A, V − V_A).'},
 {topic:'prim', q:'How are keys initialized in MST-PRIM?',
  options:['All ∞, then the root\'s key is decreased to 0','All 0','Each vertex gets its smallest incident edge weight','Root ∞, all others 0'], answer:0,
  explain:'Root key 0 guarantees r is extracted first.'},
 {topic:'prim', q:'Running time of MST-PRIM with a binary min-heap on a connected graph?',
  options:['O(E lg V)','O(V²)','O(E + V lg V)','O(E α(V))'], answer:0, explain:'O(V lg V) for extract-mins + O(E lg V) for decrease-keys = O(E lg V).'},
 {topic:'prim', q:'Running time of MST-PRIM with a Fibonacci heap?',
  options:['O(E + V lg V)','O(E lg V)','O(V lg E)','O(E²)'], answer:0, explain:'DECREASE-KEY becomes O(1) amortized, EXTRACT-MIN stays O(lg V).'},
 {topic:'prim', q:'What happens if MST-PRIM is run on a disconnected graph?',
  options:['It finds an MST only for the component containing r','It finds a minimum spanning forest','It loops forever','It returns the same result as Kruskal'], answer:0,
  explain:'Vertices in other components keep key ∞ and never get a parent.'},
 {topic:'prim', q:'At any time during MST-PRIM, the set A equals…',
  options:['{(v, v.π) : v ∈ V − {r} − Q}','{(v, v.π) : v ∈ Q}','All edges with finite key','The sorted edge list'], answer:0, explain:'Every extracted non-root vertex contributes its parent edge.'},
 {topic:'prim', q:'Can DECREASE-KEY be called on the same vertex v more than once?',
  options:['Yes, a cheaper connecting edge may be found before v is extracted','No, each vertex is updated at most once','Only for the root','Only if the graph has negative weights'], answer:0,
  explain:'In the notes\' example, a key is lowered from one finite value to another.'},
 {topic:'prim', q:'How does Prim\'s algorithm differ from Dijkstra\'s?',
  options:['Prim\'s key is a single edge weight; Dijkstra\'s key is total path distance from the source','Prim uses a stack; Dijkstra uses a queue','Prim requires sorted edges','There is no difference'], answer:0,
  explain:'Dijkstra updates keys with u.d + w(u,v); Prim uses only w(u,v).'},
 {topic:'prim', q:'The test inside Prim\'s inner loop is…',
  options:['v ∈ Q and w(u,v) < v.key','FIND-SET(u) ≠ FIND-SET(v)','v.π == NIL','w(u,v) > v.key'], answer:0, explain:'Only vertices not yet in the tree, reachable more cheaply, are updated.'},
 {topic:'prim', q:'Why is the total work of Prim\'s inner for-loop Θ(E) over the whole run?',
  options:['Aggregate analysis: each adjacency list is scanned once when its vertex is extracted','Each vertex has exactly 2 neighbors','The loop runs |V| times each','The heap has height lg E'], answer:0,
  explain:'Summed over all extracted vertices, the adjacency lists total Θ(E) entries.'},
 {topic:'prim', q:'Unlike Kruskal, the edge set A in Prim\'s algorithm is always…',
  options:['A single tree rooted at r','A forest of many trees','Sorted by weight','Empty until the queue is empty'], answer:0, explain:'Prim grows one tree outward from the root.'},

 // ---- Fib heaps ----
 {topic:'fib', q:'Child-degree lemma: if x has degree k with children y₁…y_k in link order, then for i ≥ 2…',
  options:['y_i.degree ≥ i − 2','y_i.degree ≥ i','y_i.degree ≤ i − 2','y_i.degree = i − 1'], answer:0,
  explain:'When linked, y_i had degree ≥ i − 1 and can lose at most one child before being cut.'},
 {topic:'fib', q:'The Fibonacci size lemma bounds the size of a subtree rooted at a degree-k node by…',
  options:['size(x) ≥ F_{k+2} ≥ φ^k','size(x) ≥ 2^k','size(x) ≤ F_k','size(x) ≥ k²'], answer:0, explain:'Minimum sizes satisfy a Fibonacci recurrence: s₀ = 1, s₁ = 2, …'},
 {topic:'fib', q:'Which identity drives the induction in the golden-ratio lemma (F_{k+2} ≥ φ^k)?',
  options:['φ² = φ + 1','φ = 2','F_k = 2F_{k−1}','φ · (1 − φ) = 1'], answer:0, explain:'φ^{k−1} + φ^{k−2} = φ^{k−2}(φ + 1) = φ^k.'},
 {topic:'fib', q:'The max-degree theorem gives the maximum degree of an n-node Fibonacci heap as…',
  options:['D(n) ≤ ⌊log_φ n⌋ = O(lg n)','D(n) ≤ √n','D(n) = n − 1','D(n) ≤ α(n)'], answer:0, explain:'n ≥ size(x) ≥ φ^k ⇒ k ≤ log_φ n.'},
 {topic:'fib', q:'What does a node\'s <code>mark</code> bit indicate?',
  options:['It has lost a child since it last became a child of another node','It is the minimum node','It has been extracted','It is in the root list'], answer:0, explain:'A second loss triggers a cut (cascading cut).'},
 {topic:'fib', q:'In CASCADING-CUT(H, y), what happens if y is already marked and has a parent z?',
  options:['y is cut from z and CASCADING-CUT(H, z) is called','y is unmarked and nothing else happens','z is deleted','y\'s degree is doubled'], answer:0, explain:'The cut propagates up the tree until an unmarked node (or a root) is reached.'},
 {topic:'fib', q:'Why must D(n) be O(lg n)?',
  options:['So FIB-HEAP-EXTRACT-MIN runs in O(lg n) amortized time','So INSERT is O(1)','So DECREASE-KEY is O(lg n)','So the heap uses O(n) space'], answer:0, explain:'Extract-min\'s consolidation cost depends on D(n).'},
 {topic:'fib', q:'In the Fibonacci size lemma, what are the base cases for s_k (the minimum size of a degree-k subtree)?',
  options:['s₀ = 1, s₁ = 2','s₀ = 0, s₁ = 1','s₀ = 1, s₁ = 1','s₀ = 2, s₁ = 3'], answer:0, explain:'A degree-0 node is just itself; a degree-1 node has at least one child.'},
 {topic:'fib', q:'φ, the golden ratio used in the degree bound, is approximately…',
  options:['1.618','2.718','1.414','3.142'], answer:0, explain:'φ = (1 + √5) / 2 ≈ 1.618.'},
 {topic:'fib', q:'What does CUT(H, x, y) do to x?',
  options:['Removes x from y\'s child list, adds it to the root list, sets x.p = NIL and x.mark = FALSE','Deletes x from the heap','Marks x and leaves it in place','Links x under the minimum node'], answer:0, explain:'Also decrements y.degree.'}
];

// ======================= GENERATED MC =======================
function makeOpts(correct, distractors){
  const uniq = [...new Set(distractors.map(String).filter(d => d !== String(correct)))].slice(0, 3);
  return {options: [String(correct), ...uniq], answer: 0};
}
const GEN = [
 {topic:'ds', gen(){
   const k = rnd(2, 6), n = 2 ** k;
   return {q:`Start with <b>${n}</b> singleton sets. Repeatedly UNION sets of equal size in pairs (round 1 pairs singletons, round 2 pairs the size-2 sets, …) until one set remains, using <b>union by rank</b>. What is the rank of the final root?`,
     ...makeOpts(k, [k + 1, n - 1, n / 2, k - 1, 2 * k]),
     explain:`Each round links two equal-rank roots, adding 1 to the rank, and there are lg ${n} = ${k} rounds. So rank = ${k}.`};
 }},
 {topic:'ds', gen(){
   const ids = 'abcdef'.split('');
   const p = {}, r = {}; ids.forEach(x => { p[x] = x; r[x] = 0; });
   const find = x => p[x] === x ? x : (p[x] = find(p[x]));
   const ops = [];
   const nOps = rnd(4, 5);
   for (let t = 0; t < nOps; t++){
     const pairs = [];
     ids.forEach(x => ids.forEach(y => { if (x < y && find(x) !== find(y)) pairs.push([x, y]); }));
     if (!pairs.length) break;
     const [x, y] = shuffle(pick(pairs));
     ops.push(`UNION(${x}, ${y})`);
     const a = find(x), b = find(y);
     if (r[a] > r[b]) p[b] = a; else { p[a] = b; if (r[a] === r[b]) r[b]++; }
   }
   const q = pick(ids), rep = find(q);
   return {q:`Using the CLRS code (<code>UNION(x,y) = LINK(FIND-SET(x), FIND-SET(y))</code>, and LINK makes <b>y</b> the parent when ranks tie), run these operations on singletons a–f:<pre><code>${ops.join('\n')}</code></pre>What does <code>FIND-SET(${q})</code> return, and what is that root's rank?`,
     ...makeOpts(`${rep}, rank ${r[rep]}`, shuffle(ids).flatMap(x => [`${x}, rank ${r[rep]}`, `${x}, rank ${r[rep] + 1}`, `${rep}, rank ${Math.max(0, r[rep] - 1)}`]).filter(s => s !== `${rep}, rank ${r[rep]}`).slice(0, 6)),
     explain:`Tracing LINK: on a tie the second argument's root becomes the parent and its rank goes up by one. ${q}'s representative ends up as ${rep} with rank ${r[rep]}.`};
 }},
 {topic:'mst', gen(){
   const v = rnd(6, 80);
   return {q:`A connected, weighted graph has <b>${v}</b> vertices and ${v + rnd(3, 40)} edges. How many edges are in any minimum spanning tree of it?`,
     ...makeOpts(v - 1, [v, v - 2, v + 1, Math.ceil(v / 2)]), explain:`Every spanning tree on |V| = ${v} vertices has |V| − 1 = ${v - 1} edges.`};
 }},
 {topic:'mst', gen(){
   let g, S, crossing;
   do {
     g = randomGraph(6, 4);
     S = shuffle(g.nodes.map(n => n.id)).slice(0, rnd(2, 3));
     crossing = g.edges.filter(e => S.includes(e.u) !== S.includes(e.v));
   } while (crossing.length < 3);
   const light = crossing.reduce((a, b) => a.w < b.w ? a : b);
   const lab = e => `(${e.u}, ${e.v}) w=${e.w}`;
   const nonCross = g.edges.filter(e => !crossing.includes(e)).sort((a, b) => a.w - b.w);
   const ds = shuffle(crossing.filter(e => e !== light)).slice(0, 2).map(lab);
   if (nonCross.length && nonCross[0].w < light.w) ds.unshift(lab(nonCross[0])); else if (nonCross.length) ds.push(lab(nonCross[0]));
   const ns = {}; S.forEach(x => ns[x] = 'in');
   return {q:`The green vertices form S = {${S.sort().join(', ')}}. Which edge is a <b>light edge</b> crossing the cut (S, V − S)?`,
     graph: renderGraph(g, {nodeState: ns}), ...makeOpts(lab(light), ds),
     explain:`Edges crossing the cut: ${crossing.map(lab).join(', ')}. The minimum is ${lab(light)}. Edges with both endpoints on one side don't count, even if lighter.`};
 }},
 {topic:'kruskal', gen(){
   const g = randomGraph(); const {total, mst} = kruskalSteps(g.nodes, g.edges);
   const naive = g.edges.map(e => e.w).sort((a, b) => a - b).slice(0, g.nodes.length - 1).reduce((a, b) => a + b, 0);
   return {q:'Run Kruskal\'s algorithm on this graph. What is the total weight of the minimum spanning tree?', graph: renderGraph(g),
     ...makeOpts(total, [naive, total + rnd(1, 3), total - rnd(1, 3), total + rnd(4, 7)]),
     explain:`Kruskal accepts ${mst.map(e => `(${e.u},${e.v})=${e.w}`).join(', ')} for a total of ${total}.${naive !== total ? ` (Just adding the ${g.nodes.length - 1} smallest weights gives ${naive}, but that would create a cycle.)` : ''}`};
 }},
 {topic:'kruskal', gen(){
   let g, steps, rej;
   do { g = randomGraph(6, 4); steps = kruskalSteps(g.nodes, g.edges).steps; rej = steps.find(s => !s.accepted); } while (!rej);
   const lab = e => `(${e.u}, ${e.v}) w=${e.w}`;
   const acc = steps.filter(s => s.accepted).map(s => lab(s.edge));
   return {q:'Kruskal scans edges in non-decreasing order. Which is the <b>first edge it rejects</b> because both endpoints are already in the same set?', graph: renderGraph(g),
     ...makeOpts(lab(rej.edge), shuffle(acc).slice(0, 4)),
     explain:`Accepted before it: ${steps.slice(0, steps.indexOf(rej)).map(s => lab(s.edge)).join(', ')}. At that point FIND-SET(${rej.edge.u}) == FIND-SET(${rej.edge.v}), so ${lab(rej.edge)} would form a cycle.`};
 }},
 {topic:'prim', gen(){
   const g = randomGraph(); const root = pick(g.nodes).id; const {order} = primSteps(g.nodes, g.edges, root);
   const rest = order.slice(1);
   const d = [];
   for (let t = 0; t < 8; t++) d.push([root, ...shuffle(rest)].join(' → '));
   const k = kruskalSteps(g.nodes, g.edges).mst; const kv = [root]; k.forEach(e => { if (!kv.includes(e.u)) kv.push(e.u); if (!kv.includes(e.v)) kv.push(e.v); });
   d.unshift(kv.join(' → '));
   return {q:`Run MST-PRIM with root <b>${root}</b>. In what order are vertices removed by EXTRACT-MIN?`, graph: renderGraph(g),
     ...makeOpts(order.join(' → '), d), explain:`Each step extracts the queue vertex with the smallest key (cheapest edge into the tree): ${order.join(' → ')}.`};
 }},
 {topic:'prim', gen(){
   const g = randomGraph(); const root = pick(g.nodes).id; const {total} = primSteps(g.nodes, g.edges, root);
   return {q:`Run MST-PRIM from root <b>${root}</b>. What is Σ v.key over all vertices once the queue is empty?`, graph: renderGraph(g),
     ...makeOpts(total, [total + rnd(1, 3), total - rnd(1, 3), total + rnd(4, 8), g.edges.reduce((a, e) => a + e.w, 0)]),
     explain:`The final keys are the weights of each vertex's MST parent edge (root = 0), so the sum is the MST weight, ${total}.`};
 }},
 {topic:'fib', gen(){
   const n = pick([10, 25, 50, 100, 500, 1000, 5000, 10000, 100000, 1000000]);
   const phi = (1 + Math.sqrt(5)) / 2, a = Math.floor(Math.log(n) / Math.log(phi));
   return {q:`By the max-degree theorem, what upper bound on D(n), the max degree of any node, holds for a Fibonacci heap with <b>n = ${n.toLocaleString()}</b> nodes?`,
     ...makeOpts(a, [Math.floor(Math.log2(n)), a + 2, Math.ceil(Math.sqrt(n)), a - 3, a + 1, a - 1]),
     explain:`D(n) ≤ ⌊log_φ n⌋ = ⌊ln ${n} / ln 1.618⌋ = ${a}.`};
 }},
 {topic:'fib', gen(){
   const k = rnd(2, 10); const F = [0, 1]; for (let i = 2; i <= k + 3; i++) F.push(F[i - 1] + F[i - 2]);
   return {q:`What is the minimum possible number of nodes in the subtree rooted at a Fibonacci-heap node of degree <b>k = ${k}</b>?`,
     ...makeOpts(F[k + 2], [F[k + 1], 2 ** k, F[k + 3], k + 1, k + 2, F[k + 2] + 1]), explain:`Fibonacci size lemma: size(x) ≥ F_{k+2} = F_${k + 2} = ${F[k + 2]}.`};
 }}
];

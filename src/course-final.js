// ======================= COURSE DATA · MIDTERM 4 & FINAL =======================
COURSE.push(
{id:'t18', num:'#18', short:'Single-Source Shortest Paths', title:'Single-Source', grad:'Shortest Paths', when:'Week 13 · Mon 11/16', icon:'🛣️', color:'#f43f5e',
 blurb:'Relaxation, Bellman-Ford, DAG shortest paths, Dijkstra.',
 lead:'Find the lightest path from a source s to every vertex. Every algorithm here is built from one operation, <b>RELAX</b>, applied in a different order.',
 reading:'CLRS Sections 22.1–22.3', notes:'Topic 18',
 videos:[['S7rzpWwICo8','18A · Shortest Paths'],['4Iy0RalrsXo','18B · Bellman-Ford and DAG Shortest Paths'],['0wfNtfhHlqE','18C · Dijkstra\'s Algorithm']],
 mit:[['xhG2DyCX3uA','MIT Lecture 17'],['Ttezuzs39nk','MIT Lecture 18 (until 36:20)',0,2180]],
 prereq:['ICS 241 Ch 10.6: Shortest-Path Problems'],
 html:`<h2>Relaxation</h2>
 <div class="grid g2"><pre><code><span class="fn">INITIALIZE-SINGLE-SOURCE</span>(G, s)
  <span class="kw">for each</span> vertex v ∈ G.V
      v.d = ∞;  v.π = NIL
  s.d = 0

<span class="fn">RELAX</span>(u, v, w)
  <span class="kw">if</span> v.d &gt; u.d + w(u, v)
      v.d = u.d + w(u, v)
      v.π = u</code></pre>
 <div class="card"><ul class="clean"><li>v.d is an <b>upper bound</b> on the true distance δ(s, v) and only ever decreases.</li><li><b>Optimal substructure:</b> any subpath of a shortest path is a shortest path.</li><li>Negative-weight edges are allowed by some algorithms, but a <b>negative-weight cycle</b> reachable from s makes distances undefined (−∞).</li><li>Shortest paths have no cycles, so they have at most |V| − 1 edges.</li></ul></div></div>
 <h2>Three algorithms</h2>
 <table class="tbl"><tr><th>Algorithm</th><th>Idea</th><th>Handles</th><th>Time</th></tr>
 <tr><td>Bellman-Ford</td><td>relax every edge, |V| − 1 times; one more pass detects negative cycles</td><td>negative edges, reports negative cycles</td><td>O(VE)</td></tr>
 <tr><td>DAG-SHORTEST-PATHS</td><td>topologically sort, then relax edges out of each vertex in that order</td><td>negative edges (no cycles exist)</td><td>Θ(V + E)</td></tr>
 <tr><td>Dijkstra</td><td>greedily EXTRACT-MIN the closest unfinished vertex, relax its edges</td><td><b>non-negative</b> weights only</td><td>O((V + E) lg V) binary heap; O(V lg V + E) Fibonacci heap</td></tr></table>
 <div class="callout cyan">Dijkstra looks like Prim's algorithm. The difference is the key: Prim uses the weight of one edge into the tree, Dijkstra uses the total distance from s.</div>`,
 eli5:{title:'Finding the fastest way home',pts:['🗺️ Every road has a travel time. You want the quickest route from your house to every other place.','✏️ Start by guessing "infinity" for every place, except 0 for home.','🔧 <b>Relax</b> a road: "If going through this road is faster than my current guess, update my guess!"','🚗 <b>Dijkstra</b> always finishes the closest unfinished place next, like ripples that spread by travel time.','⚠️ Dijkstra breaks if some road has a negative time (a time machine!). <b>Bellman-Ford</b> handles that.']},
 diagram:()=>fig(D.svg(720,200,
   D.arrow(150,100,282,100,'mut',3)+D.arrow(330,100,512,100,'warn',4)+D.wlabel(215,88,5)+D.wlabel(420,88,2,C.warn)+
   D.node(120,100,'s',C.good,26)+D.node(305,100,'u',C.cy,26)+D.node(540,100,'v',C.warn,26)+
   D.text(120,145,'s.d = 0',13,C.good,'middle',700)+D.text(305,145,'u.d = 5',13,C.cy,'middle',700)+D.text(540,145,'v.d = 9 → 7',13,C.warn,'middle',700)+
   D.text(360,30,'RELAX(u, v): is u.d + w(u, v) = 5 + 2 = 7 smaller than v.d = 9? Yes, so update v.d and v.π = u',12.5,C.txt)+
   D.text(360,185,'every shortest-path algorithm is just RELAX applied in a smart order',12,C.mut)),
  'Relaxing (u, v) lowers v.d when the path through u is shorter, and records u as v\'s predecessor.','Going through u gets to v in 7 minutes instead of 9, so we update our best guess for v.'),
 mc:[
  ['Which shortest-path algorithm requires all edge weights to be non-negative?','Dijkstra',['Bellman-Ford','DAG-SHORTEST-PATHS','Floyd-Warshall'],'Its greedy choice can fail with negative edges.'],
  ['Running time of Bellman-Ford:','O(VE)',['O(V + E)','O(E lg V)','O(V³) always'],'|V| − 1 passes over all |E| edges.'],
  ['How does Bellman-Ford detect a negative-weight cycle?','After |V| − 1 passes, some edge can still be relaxed',['The queue becomes empty','A vertex is extracted twice','The topological sort fails'],'If v.d > u.d + w(u, v) still holds, a negative cycle is reachable.'],
  ['Single-source shortest paths in a DAG take:','Θ(V + E)',['O(VE)','O(E lg V)','O(V²)'],'Topological sort, then one relaxation per edge.'],
  ['Dijkstra with a binary min-heap runs in:','O((V + E) lg V)',['O(V + E)','O(VE)','O(V³)'],'V EXTRACT-MINs and up to E DECREASE-KEYs, each O(lg V).'],
  ['RELAX(u, v, w) updates v when:','v.d > u.d + w(u, v)',['v.d < u.d + w(u, v)','u.d > v.d','w(u, v) < 0'],'The path through u is shorter than the best known.'],
  ['A shortest path in a graph with no negative cycles has at most how many edges?','|V| − 1',['|V|','|E|','|V|²'],'It is a simple path.'],
  ['Dijkstra differs from Prim mainly in:','The key: total distance from s instead of a single edge weight',['Using a stack instead of a heap','Working only on DAGs','Running in O(VE)'],'Otherwise the structure is the same.']
 ]},

{id:'t19', num:'#19', short:'All-Pairs Shortest Paths', title:'All-Pairs', grad:'Shortest Paths', when:'Week 13 · Wed 11/18', icon:'🧭', color:'#d946ef',
 blurb:'Matrix multiplication method, Floyd-Warshall, Johnson\'s algorithm.',
 lead:'Compute δ(u, v) for <b>every</b> pair of vertices. Output is a |V| × |V| distance matrix.',
 reading:'CLRS Chapter 23', notes:'Topic 19',
 videos:[['Ku24z4v9YF8','19A · All-Pairs Shortest Paths'],['z0reAeK4kl0','19B · Johnson\'s Algorithm'],['dzf7x5Z8Ui8','19C · Floyd-Warshall']],
 mit:[['Sygq1e0xWnM','MIT Lecture 19 (00:00–9:00)',0,540],['Sygq1e0xWnM','MIT Lecture 19 (53:00–end)',3180]],
 prereq:[],
 html:`<h2>Floyd-Warshall</h2>
 <div class="grid g2"><pre><code><span class="fn">FLOYD-WARSHALL</span>(W, n)
  D = W                     <span class="cm">// D[i, j] = w(i, j) or ∞</span>
  <span class="kw">for</span> k = 1 <span class="kw">to</span> n             <span class="cm">// allow vertex k in the middle</span>
      <span class="kw">for</span> i = 1 <span class="kw">to</span> n
          <span class="kw">for</span> j = 1 <span class="kw">to</span> n
              D[i, j] = min(D[i, j], D[i, k] + D[k, j])
  <span class="kw">return</span> D</code></pre>
 <div class="card"><p class="math">d<sub>ij</sub><sup>(k)</sup> = min(d<sub>ij</sub><sup>(k−1)</sup>, d<sub>ik</sub><sup>(k−1)</sup> + d<sub>kj</sub><sup>(k−1)</sup>)</p><ul class="clean"><li>DP over the set of allowed <b>intermediate</b> vertices {1..k}.</li><li>Θ(V³) time, Θ(V²) space. Negative edges are fine; a negative D[i, i] reveals a negative cycle.</li><li>Keep a predecessor matrix Π to rebuild the paths.</li></ul></div></div>
 <h2>Comparing approaches</h2>
 <table class="tbl"><tr><th>Method</th><th>Time</th><th>Notes</th></tr>
 <tr><td>Run Dijkstra from every vertex</td><td>O(V E lg V) or O(V² lg V + VE)</td><td>non-negative weights only</td></tr>
 <tr><td>Run Bellman-Ford from every vertex</td><td>O(V² E)</td><td>up to O(V⁴) on dense graphs</td></tr>
 <tr><td>Repeated squaring of the "min-plus" matrix product</td><td>Θ(V³ lg V)</td><td>L<sup>(2m)</sup> = L<sup>(m)</sup> · L<sup>(m)</sup></td></tr>
 <tr><td>Floyd-Warshall</td><td>Θ(V³)</td><td>simple, great for dense graphs</td></tr>
 <tr><td>Johnson's algorithm</td><td>O(V² lg V + VE)</td><td>reweights with Bellman-Ford: ŵ(u, v) = w(u, v) + h(u) − h(v) ≥ 0, then Dijkstra from every vertex. Best for sparse graphs.</td></tr></table>`,
 eli5:{title:'A chart of the fastest trip between every pair of towns',pts:['📋 Instead of one starting town, we want a giant chart: the fastest trip from <b>every</b> town to <b>every</b> other town.','🔁 <b>Floyd-Warshall</b>: "What if we are allowed to stop in town 1 on the way? Now towns 1 and 2? Now 1, 2, 3…" Update the chart each time.','➕ For each pair, check: is going through the new stop faster than what I had?','🪄 <b>Johnson\'s trick</b>: shift every road time so none are negative, then run Dijkstra from each town.']},
 diagram:()=>fig(D.svg(720,210,
   `<path d="M120 150 Q 360 40 600 150" fill="none" stroke="${C.dim}" stroke-width="3" stroke-dasharray="7 6"/>`+D.text(360,72,'D[i, j] = 12 (current best)',12.5,C.mut)+
   D.arrow(145,155,330,155,'cy',3.5)+D.arrow(390,155,575,155,'cy',3.5)+D.wlabel(238,143,4,C.cy)+D.wlabel(482,143,5,C.cy)+
   D.node(120,155,'i',C.acc,24)+D.node(360,155,'k',C.warn,24)+D.node(600,155,'j',C.acc,24)+
   D.text(360,200,'D[i, k] + D[k, j] = 4 + 5 = 9 < 12, so D[i, j] becomes 9',13,C.good,'middle',700)),
  'Floyd-Warshall asks, for every pair (i, j): is going through intermediate vertex k shorter?','Is it faster to stop at town k on the way? Here yes: 9 minutes instead of 12.'),
 mc:[
  ['Running time of Floyd-Warshall:','Θ(V³)',['Θ(V² lg V)','Θ(VE)','Θ(V⁴)'],'Three nested loops over the vertices.'],
  ['In Floyd-Warshall, the outermost loop must range over:','The intermediate vertex k',['The source i','The destination j','The edges'],'Each iteration allows one more intermediate vertex.'],
  ['Johnson\'s algorithm reweights edges using:','h(v) computed by Bellman-Ford from a new source',['The edge weights squared','Random weights','The degree of each vertex'],'ŵ(u, v) = w(u, v) + h(u) − h(v) ≥ 0.'],
  ['Johnson\'s algorithm is best suited for:','Sparse graphs with possibly negative edges',['Dense graphs only','Unweighted graphs only','Graphs with negative cycles'],'O(V² lg V + VE).'],
  ['How can Floyd-Warshall detect a negative-weight cycle?','Some diagonal entry D[i, i] becomes negative',['The algorithm never terminates','D becomes all ∞','A row becomes all zeros'],'A path from i back to i with negative weight.'],
  ['All-pairs by repeated squaring of the min-plus product takes:','Θ(V³ lg V)',['Θ(V³)','Θ(V⁴)','Θ(V² lg V)'],'lg V squarings, each Θ(V³).'],
  ['Running Dijkstra from every vertex is valid only when:','All edge weights are non-negative',['The graph is a DAG','The graph is dense','There are negative edges but no negative cycles'],'Otherwise use Johnson to reweight first.']
 ]},

{id:'t20', num:'#20', short:'Maximum Flow', title:'Maximum', grad:'Flow', when:'Week 14 · Mon 11/23', icon:'🚰', color:'#0891b2',
 blurb:'Flow networks, residual graphs, augmenting paths, Ford-Fulkerson, max-flow min-cut.',
 lead:'Push as much "stuff" as possible from a source s to a sink t through a network of pipes with capacities.',
 reading:'CLRS Sections 24.1–24.3', notes:'Topic 20',
 videos:[['3Q0IJgyuVEM','20A · Maximum Flow Intro'],['TDO4dwq4fKI','20B · Residuals and Augmenting Flows'],['TTFOk0miZ6k','20C · Flow Algorithms and Applications']],
 prereq:[],
 html:`<h2>Flow networks</h2>
 <div class="grid g2"><div class="card"><ul class="clean"><li>Directed graph with capacities c(u, v) ≥ 0, a source s and a sink t.</li><li><b>Capacity constraint:</b> 0 ≤ f(u, v) ≤ c(u, v).</li><li><b>Flow conservation:</b> flow in = flow out at every vertex except s and t.</li><li>Value |f| = flow out of s − flow into s.</li></ul></div>
 <div class="card"><h3>Residual network G<sub>f</sub></h3><ul class="clean"><li>c<sub>f</sub>(u, v) = c(u, v) − f(u, v): room left to push forward.</li><li>c<sub>f</sub>(v, u) = f(u, v): flow you could <b>cancel</b>.</li><li>An <b>augmenting path</b> is an s→t path in G<sub>f</sub>; push its bottleneck capacity along it.</li></ul></div></div>
 <h2>Ford-Fulkerson and max-flow min-cut</h2>
 <div class="grid g2"><pre><code><span class="fn">FORD-FULKERSON</span>(G, s, t)
  <span class="kw">for each</span> edge (u, v) ∈ G.E
      (u, v).f = 0
  <span class="kw">while</span> there is a path p from s to t in G<sub>f</sub>
      c<sub>f</sub>(p) = min{c<sub>f</sub>(u, v) : (u, v) in p}
      <span class="kw">for each</span> edge (u, v) in p
          <span class="kw">if</span> (u, v) ∈ G.E
              (u, v).f = (u, v).f + c<sub>f</sub>(p)
          <span class="kw">else</span> (v, u).f = (v, u).f − c<sub>f</sub>(p)</code></pre>
 <div class="card"><p><b>Max-flow min-cut theorem:</b> these are equivalent:</p><ol><li>f is a maximum flow.</li><li>G<sub>f</sub> has no augmenting path.</li><li>|f| = c(S, T) for some cut (S, T).</li></ol><table class="tbl"><tr><th>Variant</th><th>Time</th></tr><tr><td>Ford-Fulkerson (integer capacities)</td><td>O(E |f*|)</td></tr><tr><td>Edmonds-Karp (BFS shortest augmenting path)</td><td>O(VE²)</td></tr></table><p>Application: <b>maximum bipartite matching</b> by adding s, t and unit capacities.</p></div></div>`,
 eli5:{title:'Pushing water through pipes',pts:['🚰 Imagine water flowing from a tap (s) to a drain (t) through pipes. Each pipe can only carry so much.','💧 Water that goes into a junction must come out (no leaks!).','🔍 Find any route from tap to drain that still has room, and push more water through it. Repeat!','↩️ Sometimes you "undo" some water in one pipe to send it a smarter way. That is the <b>residual</b> network.','✂️ The most water you can push equals the smallest total size of pipes you would need to cut to stop all flow.']},
 diagram:()=>fig(D.svg(720,240,(()=>{const N={s:[80,120],a:[260,50],b:[260,190],c:[460,50],d:[460,190],t:[640,120]};const E=[['s','a','10/10'],['s','b','5/8'],['a','c','8/9'],['a','b','2/2'],['b','d','7/7'],['c','t','8/10'],['d','c','0/3'],['d','t','7/8']];let s=E.map(([u,v,l])=>{const [x1,y1]=N[u],[x2,y2]=N[v],dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),k=20/L;return D.arrow(x1+dx*k,y1+dy*k,x2-dx*k,y2-dy*k,l.split('/')[0]===l.split('/')[1]?'warn':'cy',2.5)+`<rect x="${(x1+x2)/2-22}" y="${(y1+y2)/2-11}" width="44" height="20" rx="6" fill="#111827" stroke="${C.dim}"/>`+D.text((x1+x2)/2,(y1+y2)/2+4,l,11,C.txt,'middle',700);}).join('');Object.entries(N).forEach(([k,[x,y]])=>s+=D.node(x,y,k,k==='s'||k==='t'?C.good:C.acc,18));return s+`<path d="M360 20 L360 230" stroke="${C.bad}" stroke-width="2" stroke-dasharray="6 6"/>`+D.text(360,236,'a cut (S, T)',11,C.bad)+D.text(110,225,'flow / capacity · yellow = saturated',11.5,C.mut,'start');})()),
  'Each edge shows flow / capacity. A flow is maximum exactly when its value equals the capacity of some cut.','Numbers show "water now / pipe size". Yellow pipes are completely full.'),
 mc:[
  ['Flow conservation says that at every vertex other than s and t:','Total flow in equals total flow out',['Flow equals capacity','Flow is zero','Flow in is at most half the flow out'],'No vertex stores or creates flow.'],
  ['In the residual network, the reverse edge (v, u) has capacity:','f(u, v), the flow that could be cancelled',['c(u, v)','c(u, v) − f(u, v)','0 always'],'Pushing along (v, u) undoes flow.'],
  ['The max-flow min-cut theorem states that the maximum flow value equals:','The minimum capacity of an s-t cut',['The number of edges','The maximum edge capacity','The sum of all capacities'],'Strong duality for flows.'],
  ['Ford-Fulkerson stops when:','There is no augmenting path in the residual network',['Every edge is saturated','The flow equals the sum of capacities out of s','After |V| − 1 iterations'],'Then the flow is maximum.'],
  ['Edmonds-Karp chooses augmenting paths using:','BFS (shortest paths in edges)',['DFS','Dijkstra on capacities','Random walks'],'This gives O(VE²).'],
  ['Running time of Edmonds-Karp:','O(VE²)',['O(E |f*|)','O(V + E)','O(V³ lg V)'],'At most O(VE) augmentations, each O(E).'],
  ['Maximum bipartite matching can be solved by:','Max flow with a source, a sink, and unit capacities',['Dijkstra','Topological sort','Kruskal'],'Integral max flow gives a matching.']
 ]},

{id:'t24', num:'#24', short:'NP-Completeness', title:'Complexity Theory &amp;', grad:'NP-Completeness', when:'Week 15 · Mon 11/30', icon:'🧩', color:'#9333ea',
 blurb:'P, NP, reductions, NP-hard, NP-complete, SAT and friends.',
 lead:'Some problems seem to have no polynomial-time algorithm. NP-completeness gives strong evidence: if any NP-complete problem is in P, then <b>all</b> of NP is.',
 reading:'CLRS Chapter 34', notes:'Topic 24',
 videos:[['Cm_c_y2z0HY','24A · NP-Completeness'],['H4OYXaVkLA4','24B · An NP-Complete Problem'],['J5l-crl0LgA','24C · NP-Complete Problems']],
 prereq:[],
 html:`<h2>Classes</h2>
 <table class="tbl"><tr><th>Class</th><th>Meaning</th></tr>
 <tr><td><b>P</b></td><td>decision problems solvable in polynomial time</td></tr>
 <tr><td><b>NP</b></td><td>decision problems whose "yes" answers can be <b>verified</b> in polynomial time given a certificate</td></tr>
 <tr><td><b>NP-hard</b></td><td>every problem in NP reduces to it in polynomial time</td></tr>
 <tr><td><b>NP-complete (NPC)</b></td><td>in NP <i>and</i> NP-hard</td></tr></table>
 <div class="grid g2"><div class="card"><h3>Reductions</h3><ul class="clean"><li>A ≤<sub>P</sub> B: a polynomial-time function f maps instances of A to instances of B with the same answer.</li><li>If A ≤<sub>P</sub> B and B ∈ P then A ∈ P.</li><li>To prove B is NP-complete: (1) show B ∈ NP, (2) reduce a <b>known</b> NP-complete problem A to B.</li><li>Direction matters: reduce <i>from</i> the known hard problem <i>to</i> the new one.</li></ul></div>
 <div class="card"><h3>Famous NP-complete problems</h3><ul class="clean"><li>CIRCUIT-SAT and SAT (Cook-Levin theorem), 3-CNF-SAT</li><li>CLIQUE, VERTEX-COVER, INDEPENDENT-SET</li><li>HAM-CYCLE, TSP (decision version)</li><li>SUBSET-SUM</li></ul><p>Typical chain: CIRCUIT-SAT → SAT → 3-CNF-SAT → CLIQUE → VERTEX-COVER.</p></div></div>
 <div class="callout">P ⊆ NP is known. Whether P = NP is the most famous open problem in computer science. Most researchers believe P ≠ NP.</div>`,
 eli5:{title:'Easy to check, hard to solve',pts:['🧩 Some puzzles are easy to <b>check</b> (someone shows you the answer and you can verify it fast) but seem really hard to <b>solve</b>. That is <b>NP</b>.','✅ <b>P</b> is the puzzles that are fast to solve.','🔁 A <b>reduction</b> is turning one puzzle into another: "If I could solve B, I could solve A too."','👑 <b>NP-complete</b> puzzles are the hardest ones in NP. Solve one of them fast and you could solve all of them fast!','❓ Nobody knows if P = NP. There is a million-dollar prize for the answer.']},
 diagram:()=>fig(D.svg(720,240,
   `<ellipse cx="300" cy="125" rx="230" ry="100" fill="${C.acc}14" stroke="${C.acc}" stroke-width="2"/><ellipse cx="200" cy="130" rx="105" ry="65" fill="${C.good}22" stroke="${C.good}" stroke-width="2"/><ellipse cx="455" cy="125" rx="70" ry="50" fill="${C.bad}33" stroke="${C.bad}" stroke-width="2"/>`+
   `<path d="M455 75 Q 560 40 690 70 L 690 200 Q 560 230 455 175" fill="${C.warn}14" stroke="${C.warn}" stroke-width="2" stroke-dasharray="6 5"/>`+
   D.text(300,45,'NP',15,C.acc,'middle',700)+D.text(200,125,'P',16,C.good,'middle',700)+D.text(200,147,'sorting, MST, shortest paths',10.5,C.mut)+D.text(455,120,'NP-complete',12.5,'#fff','middle',700)+D.text(455,138,'SAT, CLIQUE, TSP',10,C.mut)+D.text(625,135,'NP-hard',13,C.warn,'middle',700)+
   D.text(360,236,'the picture assuming P ≠ NP',11.5,C.mut)),
  'Assuming P ≠ NP: P sits inside NP, NP-complete problems are the hardest problems in NP, and NP-hard extends beyond NP.','The green bubble is the easy puzzles. The red bubble is the hardest checkable puzzles.'),
 mc:[
  ['A problem is NP-complete if it is:','In NP and NP-hard',['In P and NP','NP-hard only','Unsolvable'],'Both conditions are needed.'],
  ['To prove a new problem B is NP-hard, you:','Reduce a known NP-complete problem to B',['Reduce B to a known NP-complete problem','Show B is in P','Find an exponential algorithm for B'],'The known hard problem must reduce to the new one.'],
  ['The class NP consists of decision problems:','Whose yes-instances can be verified in polynomial time with a certificate',['That require exponential time','That are not in P','That cannot be decided'],'NP = nondeterministic polynomial time.'],
  ['If any NP-complete problem has a polynomial-time algorithm, then:','P = NP',['P ≠ NP','NP = EXP','Nothing changes'],'Every NP problem reduces to it.'],
  ['The first problem proven NP-complete (Cook-Levin) was:','SAT (circuit / boolean satisfiability)',['CLIQUE','TSP','SUBSET-SUM'],'Everything else is reduced from it.'],
  ['Which relationship is known to be true?','P ⊆ NP',['P = NP','NP ⊆ P','NP-hard ⊆ NP'],'Whether P = NP is open.'],
  ['Which problem is in P?','Minimum spanning tree',['Hamiltonian cycle','3-CNF-SAT','Vertex cover (decision)'],'Kruskal and Prim are polynomial.']
 ]},

{id:'t25', num:'#25', short:'Approximation Algorithms', title:'Approximation', grad:'Algorithms', when:'Week 15 · Wed 12/02', icon:'🎯', color:'#7c3aed',
 blurb:'Approximation ratios, vertex cover, TSP with the triangle inequality, set cover.',
 lead:'For NP-hard optimization problems, settle for a solution that is <b>provably close</b> to optimal, computed in polynomial time.',
 reading:'CLRS Chapter 35', notes:'Topic 25',
 videos:[['hdch8ioLRqE','25A · Approximation Algorithms'],['a0fkEdx_K3g','25B · Approximation Strategies']],
 prereq:[],
 html:`<h2>Approximation ratio</h2>
 <div class="card"><p>An algorithm has ratio ρ(n) if for every input of size n, its cost C and the optimal cost C* satisfy <span class="math">max(C/C*, C*/C) ≤ ρ(n)</span>. A "2-approximation" is never more than twice as bad as optimal.</p></div>
 <div class="grid g2"><pre><code><span class="fn">APPROX-VERTEX-COVER</span>(G)    <span class="cm">// ratio 2</span>
  C = ∅
  E′ = G.E
  <span class="kw">while</span> E′ ≠ ∅
      let (u, v) be any edge of E′
      C = C ∪ {u, v}
      remove from E′ every edge incident on u or v
  <span class="kw">return</span> C</code></pre>
 <div class="card"><h3>Why ratio 2?</h3><p>The chosen edges form a <b>matching</b> A (no shared endpoints). Any cover must include at least one endpoint of each edge in A, so |C*| ≥ |A|, while |C| = 2|A|.</p></div></div>
 <table class="tbl"><tr><th>Problem</th><th>Strategy</th><th>Ratio</th></tr>
 <tr><td>Vertex cover</td><td>take both endpoints of a maximal matching</td><td>2</td></tr>
 <tr><td>TSP with triangle inequality</td><td>build an MST, walk it in preorder, shortcut repeats</td><td>2</td></tr>
 <tr><td>General TSP</td><td>no constant-ratio algorithm unless P = NP</td><td>—</td></tr>
 <tr><td>Set cover</td><td>greedy: pick the set covering the most uncovered elements</td><td>H(max set size) = O(lg n)</td></tr></table>`,
 eli5:{title:'Good enough, and fast',pts:['⏳ Some problems are so hard that finding the perfect answer could take longer than the age of the universe.','👍 So we use a fast trick that is <b>guaranteed</b> to be close, like "never more than twice the best".','👮 Vertex cover: place guards so every hallway has a guard at one end. Trick: pick any unguarded hallway, put guards at <b>both</b> ends, repeat.','🗺️ Traveling salesman: build the cheapest road network (MST), walk around it, and skip towns you already visited.']},
 diagram:()=>fig(D.svg(720,220,(()=>{const N={a:[100,60],b:[230,40],c:[360,70],d:[120,170],e:[260,160],f:[400,180],g:[520,110]};const E=[['a','b'],['b','c'],['a','d'],['b','e'],['c','e'],['d','e'],['e','f'],['c','g'],['f','g']];const M=['b,c','d,e','f,g'];const inC=new Set(['b','c','d','e','f','g']);let s=E.map(([u,v])=>D.line(...N[u],...N[v],M.includes([u,v].sort().join())?C.warn:C.dim,M.includes([u,v].sort().join())?5:2.5)).join('');Object.entries(N).forEach(([k,[x,y]])=>s+=D.node(x,y,k,inC.has(k)?C.good:C.mut,18));return s+D.text(640,70,'yellow = chosen edges (a matching A)',12,C.warn,'middle',700)+D.text(640,95,'green = cover C, |C| = 6',12,C.good,'middle',700)+D.text(640,120,'any cover needs ≥ |A| = 3',12,C.mut)+D.text(640,145,'so |C| ≤ 2 · OPT',13,C.txt,'middle',700);})()),
  'APPROX-VERTEX-COVER takes both endpoints of a maximal matching, so it uses at most twice the optimal number of vertices.','Yellow hallways got guards at both ends (green). We might use extra guards, but never more than double.'),
 mc:[
  ['APPROX-VERTEX-COVER has approximation ratio:','2',['1','lg n','n'],'Both endpoints of a maximal matching.'],
  ['Why is APPROX-VERTEX-COVER within a factor of 2?','The chosen edges form a matching, and any cover needs one endpoint per matched edge',['It solves the problem exactly on trees','It uses dynamic programming','It picks the highest-degree vertex each time'],'|C| = 2|A| ≤ 2|C*|.'],
  ['The 2-approximation for TSP requires:','The triangle inequality',['Integer weights','A bipartite graph','Negative edges'],'Shortcutting can only make the tour shorter under the triangle inequality.'],
  ['The TSP approximation with triangle inequality starts by computing:','A minimum spanning tree',['A maximum matching','A topological sort','All-pairs shortest paths'],'MST weight ≤ optimal tour weight.'],
  ['For general TSP (no triangle inequality):','No constant-ratio polynomial algorithm exists unless P = NP',['A 2-approximation exists','It is in P','Greedy is optimal'],'It would solve HAM-CYCLE.'],
  ['The greedy set-cover algorithm achieves ratio:','O(lg n)',['2','1','n'],'H(d) where d is the largest set size.'],
  ['An approximation ratio of ρ means the solution\'s cost is:','Within a factor ρ of optimal',['Exactly ρ','At most ρ more than optimal (additive)','Optimal with probability ρ'],'Multiplicative guarantee.']
 ]},

{id:'t22', num:'#22', short:'Parallel Algorithms', title:'Parallel', grad:'Algorithms', when:'Week 16 · Mon 12/07', icon:'🧵', color:'#14b8a6',
 blurb:'Fork-join parallelism, work, span, parallelism, greedy scheduling.',
 lead:'Use many processors at once. The <b>fork-join</b> model with <b>spawn</b> and <b>sync</b> lets us analyze parallel algorithms with two numbers: <b>work</b> and <b>span</b>.',
 reading:'CLRS Chapter 26', notes:'Topic 22',
 videos:[],
 prereq:[],
 html:`<h2>Work and span</h2>
 <div class="grid g2"><div class="card"><ul class="clean"><li><b>Work</b> T<sub>1</sub>: total time on one processor (all the nodes of the computation DAG).</li><li><b>Span</b> T<sub>∞</sub>: length of the longest path (critical path) in the DAG.</li><li><b>Work law:</b> T<sub>P</sub> ≥ T<sub>1</sub>/P. <b>Span law:</b> T<sub>P</sub> ≥ T<sub>∞</sub>.</li><li><b>Parallelism</b> = T<sub>1</sub>/T<sub>∞</sub>: the most speedup possible.</li><li>A greedy scheduler achieves T<sub>P</sub> ≤ T<sub>1</sub>/P + T<sub>∞</sub>.</li></ul></div>
 <pre><code><span class="fn">P-FIB</span>(n)
  <span class="kw">if</span> n ≤ 1
      <span class="kw">return</span> n
  x = <span class="kw">spawn</span> P-FIB(n - 1)   <span class="cm">// runs in parallel</span>
  y = P-FIB(n - 2)
  <span class="kw">sync</span>                    <span class="cm">// wait for the spawned call</span>
  <span class="kw">return</span> x + y

<span class="cm">// work  T1(n) = T1(n-1) + T1(n-2) + Θ(1) = Θ(φⁿ)</span>
<span class="cm">// span  T∞(n) = max(T∞(n-1), T∞(n-2)) + Θ(1) = Θ(n)</span></code></pre></div>
 <h2>Composing work and span</h2>
 <table class="tbl"><tr><th>Composition</th><th>Work</th><th>Span</th></tr>
 <tr><td>A then B (serial)</td><td>T₁(A) + T₁(B)</td><td>T∞(A) + T∞(B)</td></tr>
 <tr><td>A ∥ B (parallel)</td><td>T₁(A) + T₁(B)</td><td>max(T∞(A), T∞(B))</td></tr>
 <tr><td><b>parallel for</b> over n iterations</td><td>Θ(n) × body</td><td>Θ(lg n) + max body span</td></tr></table>
 <div class="callout cyan">Parallel merge sort with a serial merge has work Θ(n lg n) but span Θ(n), so parallelism is only Θ(lg n). A parallel merge improves the span to Θ(lg³ n).</div>`,
 eli5:{title:'Many hands make light work',pts:['👩‍🍳 Cooking dinner alone takes a long time. With friends, some tasks can happen at the same time.','📦 <b>Work</b> is the total amount of cooking to do, no matter who does it.','⛓️ <b>Span</b> is the longest chain of steps that must happen in order (you can\'t frost a cake before baking it).','🚀 Even with a million helpers, you can\'t finish faster than the span!','🧵 <b>spawn</b> means "a friend starts this now"; <b>sync</b> means "wait until the friends are done".']},
 diagram:()=>fig(D.svg(720,220,(()=>{const N=[[80,110],[200,60],[200,160],[320,30],[320,90],[320,160],[440,60],[440,160],[560,110],[660,110]];const E=[[0,1],[0,2],[1,3],[1,4],[2,5],[3,6],[4,6],[5,7],[6,8],[7,8],[8,9]];const crit=['0-1','1-3','3-6','6-8','8-9'];let s=E.map(([a,b])=>{const c=crit.includes(a+'-'+b);return D.arrow(N[a][0]+14,N[a][1],N[b][0]-16,N[b][1],c?'warn':'mut',c?3.5:2);}).join('');N.forEach(([x,y],i)=>s+=D.node(x,y,'',[0,1,3,6,8,9].includes(i)?C.warn:C.acc,13));return s+D.text(360,205,'work T₁ = 10 nodes · span T∞ = 6 nodes (yellow critical path) · parallelism = 10/6 ≈ 1.7',12.5,C.txt);})()),
  'A computation DAG: work counts all strands, span is the longest (critical) path.','Each dot is a task. The yellow chain must happen in order, so it decides the fastest possible finish time.'),
 mc:[
  ['The span T∞ of a parallel computation is:','The length of the longest path in its computation DAG',['The total number of strands','The number of processors','The running time on one processor'],'Also called the critical-path length.'],
  ['Parallelism is defined as:','T₁ / T∞',['T∞ / T₁','T₁ · T∞','T_P / P'],'Maximum possible speedup.'],
  ['The work law says:','T_P ≥ T₁ / P',['T_P ≤ T₁ / P','T_P ≥ T∞ · P','T_P = T₁'],'P processors do at most P units of work per step.'],
  ['A greedy scheduler guarantees:','T_P ≤ T₁/P + T∞',['T_P = T∞','T_P ≤ T∞ / P','T_P ≥ T₁'],'Within a factor of 2 of optimal.'],
  ['Running two computations A and B in parallel gives span:','max(T∞(A), T∞(B))',['T∞(A) + T∞(B)','min(T∞(A), T∞(B))','T₁(A) + T₁(B)'],'They overlap in time.'],
  ['The span of P-FIB(n) is:','Θ(n)',['Θ(φⁿ)','Θ(lg n)','Θ(1)'],'T∞(n) = T∞(n−1) + Θ(1).'],
  ['In the fork-join model, sync means:','Wait until all spawned children of this procedure have finished',['Start a new thread','Lock a shared variable','Terminate all processors'],'It joins the parallel strands.']
 ]}
);

// ---- pseudocode challenges ----
COMPOUNDS.push('initialize single source','floyd warshall');
CODE.push(
 {id:'dijkstra', topic:'t18', title:"Dijkstra's algorithm",
  prompt:'Write <code>INITIALIZE-SINGLE-SOURCE(G, s)</code>, <code>RELAX(u, v, w)</code> and <code>DIJKSTRA(G, w, s)</code> using a min-priority queue Q keyed by v.d. Assume non-negative weights.',
  starter:'INITIALIZE-SINGLE-SOURCE(G, s)\n    \n\nRELAX(u, v, w)\n    \n\nDIJKSTRA(G, w, s)\n    \n', define:['initializesinglesource','relax','dijkstra'], call:['initializesinglesource','relax','extractmin'], maxLoop:2,
  correctness:[
   {label:'Initializes every v.d = ∞ and s.d = 0', w:2, test:t=>/=\s*inf/.test(t) && /s\.d\s*=\s*0|d\s*\[\s*s\s*\]\s*=\s*0/.test(t), hint:'v.d = ∞ for all v, then s.d = 0'},
   {label:'Builds a min-priority queue of vertices', w:1, test:t=>/\bq\s*=|insert\s*\(|buildminheap|minheap|priority/.test(t), hint:'Q = G.V (keyed by d)'},
   {label:'Repeatedly EXTRACT-MINs the closest vertex', w:2, test:t=>/\bwhile\b/.test(t) && /extractmin\s*\(/.test(t), hint:'while Q ≠ ∅: u = EXTRACT-MIN(Q)'},
   {label:'Relaxes every edge leaving u', w:2, test:t=>/\b(for|foreach)\b[^\n]*(adj|neighbors?)/.test(t) && /relax\s*\(/.test(t), hint:'for each v ∈ G.Adj[u]: RELAX(u, v, w)'},
   {label:'RELAX tests and updates v.d and v.π', w:3, test:(t,P)=>{const b=P.body('relax');return /(>\s*\w+\.d\s*\+\s*w|>\s*d\s*\[\s*u\s*\]\s*\+)/.test(b) && /(\.d\s*=\s*\w+\.d\s*\+\s*w|d\s*\[\s*v\s*\]\s*=\s*d\s*\[\s*u\s*\]\s*\+)/.test(b) && /(pi|\.p\b|parent)/.test(b);}, hint:'if v.d > u.d + w(u, v): v.d = u.d + w(u, v); v.π = u'}
  ],
  efficiency:[
   {label:'Uses a min-priority queue: O((V + E) lg V)', w:6, test:t=>/extractmin|heap|priority/.test(t), hint:'A binary heap gives O(lg V) EXTRACT-MIN.'},
   {label:'Updates the queue when a key drops (DECREASE-KEY or re-insert)', w:4, test:t=>/decreasekey|insert\s*\(|push\s*\(/.test(t), hint:'DECREASE-KEY(Q, v, v.d) inside RELAX.'}
  ],
  penalties:[{label:'Scans all of Q to find the minimum (O(V²))', p:3, test:(t,P)=>P.lines.some(l=>l.loopDepth>=1 && /\b(for|foreach)\b[^\n]*(\binq\b|\bin\s+q\b|g\.v)/.test(l.t)), hint:'Let the heap find the minimum.'}],
  model:`INITIALIZE-SINGLE-SOURCE(G, s)
    for each vertex v in G.V
        v.d = ∞
        v.π = NIL
    s.d = 0

RELAX(u, v, w)
    if v.d > u.d + w(u, v)
        v.d = u.d + w(u, v)
        v.π = u
        DECREASE-KEY(Q, v, v.d)      // keep the heap up to date

DIJKSTRA(G, w, s)
    INITIALIZE-SINGLE-SOURCE(G, s)
    S = ∅
    Q = G.V                          // min-priority queue keyed by d
    while Q ≠ ∅
        u = EXTRACT-MIN(Q)
        S = S ∪ {u}
        for each vertex v in G.Adj[u]
            RELAX(u, v, w)`},

 {id:'floyd', topic:'t19', title:'Floyd-Warshall',
  prompt:'Write <code>FLOYD-WARSHALL(W, n)</code> that returns the matrix D of shortest-path distances between all pairs, given the n × n weight matrix W (∞ where there is no edge).',
  starter:'FLOYD-WARSHALL(W, n)\n    \n', define:['floydwarshall'], call:[], maxLoop:3,
  correctness:[
   {label:'Starts D from the weight matrix W', w:2, test:t=>/\bd\s*=\s*(w\b|copy)/.test(t) || /d\s*\[\s*i\s*(,|\]\s*\[)\s*j\s*\]\s*=\s*w\s*\[/.test(t), hint:'D = W'},
   {label:'Outermost loop is over the intermediate vertex k', w:3, test:t=>{const k=t.search(/\bfor\b[^\n]*\bk\s*(=|in)/), i=t.search(/\bfor\b[^\n]*\bi\s*(=|in)/);return k>=0 && i>=0 && k<i;}, hint:'for k = 1 to n (then i, then j)'},
   {label:'Updates D[i, j] with D[i, k] + D[k, j]', w:3, test:t=>/d\s*\[\s*i\s*(,|\]\s*\[)\s*k\s*\]\s*\+\s*d\s*\[\s*k\s*(,|\]\s*\[)\s*j\s*\]/.test(t), hint:'D[i, j] = min(D[i, j], D[i, k] + D[k, j])'},
   {label:'Returns D', w:2, test:t=>/return\s+d\b/.test(t), hint:'return D'}
  ],
  efficiency:[
   {label:'Exactly three nested loops: Θ(n³)', w:5, test:(t,P)=>P.maxLoop===3, hint:'k, i, j loops each 1..n.'},
   {label:'Single matrix updated in place: Θ(n²) space', w:5, test:t=>!/d\s*\(\s*k|d\s*\^|d\s*\[\s*k\s*\]\s*\[\s*i\s*\]\s*\[/.test(t), hint:'You do not need a separate matrix per k.'}
  ],
  penalties:[{label:'Runs a single-source algorithm from every vertex instead', p:2, test:t=>/(dijkstra|bellman)/.test(t), hint:'Floyd-Warshall is a direct DP.'}],
  model:`FLOYD-WARSHALL(W, n)
    D = copy of W                    // D[i, j] = w(i, j), or ∞ if no edge
    for k = 1 to n                   // allow vertex k as an intermediate stop
        for i = 1 to n
            for j = 1 to n
                D[i, j] = min(D[i, j], D[i, k] + D[k, j])
    return D`}
);

GEN.push({topic:'t18', gen(){
  const g = randomGraph(), adj = {}; g.nodes.forEach(n => adj[n.id] = []); g.edges.forEach(e => { adj[e.u].push([e.v, e.w]); adj[e.v].push([e.u, e.w]); });
  const s = g.nodes[0].id, d = {}, done = {}; g.nodes.forEach(n => d[n.id] = Infinity); d[s] = 0;
  for (let k = 0; k < g.nodes.length; k++){ let u = null; for (const v in d) if (!done[v] && (u === null || d[v] < d[u])) u = v; done[u] = true; adj[u].forEach(([v, w]) => { if (d[u] + w < d[v]) d[v] = d[u] + w; }); }
  const t = pick(Object.keys(d).filter(v => v !== s)), direct = (adj[s].find(([v]) => v === t) || [])[1];
  return {q:`Run <b>Dijkstra from ${s}</b> on this undirected weighted graph. What is the shortest-path distance <b>δ(${s}, ${t})</b>?`, graph: renderGraph(g), ...opts4(d[t], [direct, d[t] + 1, d[t] + 2, d[t] - 1].filter(v => v !== undefined && v > 0)),
    explain:`Final distances from ${s}: ${Object.entries(d).sort((a, b) => a[1] - b[1]).map(([v, x]) => `${v}=${x}`).join(', ')}.`};
}});

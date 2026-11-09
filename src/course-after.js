// ======================= COURSE DATA · AFTER MIDTERM 3 =======================
COURSE.push(
{id:'t13', num:'#13', short:'Greedy & Huffman Codes', title:'Greedy Algorithms &amp;', grad:'Huffman Codes', when:'Week 10 · Mon 10/26', icon:'🪙', color:'#eab308',
 blurb:'Greedy-choice property, activity selection, Huffman codes.',
 lead:'A <b>greedy algorithm</b> makes the locally best choice at each step and never looks back. It works when the problem has the <b>greedy-choice property</b> and optimal substructure.',
 reading:'CLRS Sections 15.1–15.3', notes:'Topic 13',
 videos:[['hWtmauUMYD8','13A · Greedy Algorithms and DP'],['_-1nKy0bnwE','13B · Activity Scheduling'],['UgJk87jazLQ','13C · Huffman Codes']],
 prereq:[],
 html:`<h2>Activity selection</h2>
 <div class="grid g2"><pre><code><span class="fn">GREEDY-ACTIVITY-SELECTOR</span>(s, f, n)
  <span class="cm">// activities sorted by finish time f</span>
  A = {a₁}
  k = 1
  <span class="kw">for</span> m = 2 <span class="kw">to</span> n
      <span class="kw">if</span> s[m] ≥ f[k]      <span class="cm">// compatible</span>
          A = A ∪ {a_m}
          k = m
  <span class="kw">return</span> A</code></pre>
 <div class="card"><ul class="clean"><li>Goal: the largest set of mutually compatible activities.</li><li><b>Greedy choice:</b> pick the activity that finishes first. It leaves the most room for the rest.</li><li>Proof idea (exchange argument): swap the first activity of any optimal solution with a₁; it stays optimal.</li><li>Θ(n) after an O(n lg n) sort.</li></ul></div></div>
 <h2>Huffman codes</h2>
 <div class="grid g2"><div class="card"><ul class="clean"><li>A <b>prefix code</b>: no codeword is a prefix of another, so decoding is unambiguous. Codes = binary trees, characters at leaves.</li><li>Cost B(T) = Σ c.freq · depth(c).</li><li><b>HUFFMAN:</b> put characters in a min-priority queue by frequency; repeatedly EXTRACT-MIN twice, merge into a new node with summed frequency, INSERT it back. n − 1 merges.</li><li>O(n lg n) with a binary heap.</li></ul></div>
 <div class="card"><h3>Greedy vs dynamic programming</h3><table class="tbl"><tr><th></th><th>Greedy</th><th>DP</th></tr><tr><td>Choice</td><td>made before solving subproblems</td><td>depends on subproblem solutions</td></tr><tr><td>Subproblems</td><td>one remains</td><td>many considered</td></tr><tr><td>Example</td><td>fractional knapsack</td><td>0-1 knapsack</td></tr></table></div></div>`,
 eli5:{title:'Always grab the best-looking choice right now',pts:['🍪 Greedy means: at every step, take what looks best right now, and never change your mind.','📅 Fitting the most activities into your day? Always pick the one that <b>ends earliest</b>, so you have time left for more.','🔡 Huffman codes give short codes to common letters (like "e") and long codes to rare ones (like "z"), so messages get smaller.','⚠️ Greedy does not always work! It only works for problems where the "best right now" choice is always safe.']},
 diagram:()=>fig(D.svg(720,220,(()=>{const A=[[1,4],[3,5],[0,6],[5,7],[3,9],[5,9],[6,10],[8,11],[8,12],[2,14],[12,16]];const pick=[0,3,7,10];const X=t=>40+t*40;let s='';A.forEach(([a,b],i)=>{const p=pick.includes(i);s+=`<rect x="${X(a)}" y="${14+i*17}" width="${(b-a)*40}" height="13" rx="6" fill="${p?C.good:C.dim}" opacity="${p?.95:.45}"/>`;});for(let t=0;t<=16;t+=2)s+=D.text(X(t),210,t,10.5,C.mut);return s+D.text(700,40,'green = chosen',12,C.good,'end',700)+D.text(700,60,'earliest finish first',12,C.mut,'end');})()),
  'GREEDY-ACTIVITY-SELECTOR repeatedly picks the compatible activity with the earliest finish time.','Each bar is an activity. We keep picking the one that ends first, so we fit the most green bars.'),
 mc:[
  ['The greedy choice in activity selection is to pick the activity that:','Finishes earliest',['Starts earliest','Is shortest','Overlaps the fewest others'],'Leaves the maximum remaining time.'],
  ['Huffman\'s algorithm repeatedly:','Merges the two least-frequent trees',['Merges the two most-frequent trees','Splits the largest tree','Assigns codes in alphabetical order'],'Using EXTRACT-MIN twice.'],
  ['Running time of Huffman\'s algorithm on n characters with a binary heap:','O(n lg n)',['O(n²)','O(n)','O(2ⁿ)'],'n − 1 merges, each O(lg n).'],
  ['In a prefix code:','No codeword is a prefix of another codeword',['All codewords have the same length','Codewords are sorted','Every codeword starts with 0'],'Makes decoding unambiguous.'],
  ['Which problem is solved optimally by a greedy algorithm?','Fractional knapsack',['0-1 knapsack','Longest common subsequence','Matrix-chain multiplication'],'0-1 knapsack needs DP.'],
  ['The standard proof technique for greedy algorithms is:','An exchange argument',['The master theorem','A decision tree','Amortized potential functions'],'Swap the greedy choice into an optimal solution.'],
  ['Greedy algorithms differ from DP because they:','Make a choice before solving the remaining subproblem',['Always consider all subproblems','Never use recursion','Require overlapping subproblems'],'Greedy commits; DP compares.']
 ]},

{id:'t14a', num:'#14A', short:'Graphs, BFS & DFS', title:'Graph Representations,', grad:'BFS &amp; DFS', when:'Week 11 · Mon 11/02', icon:'🕸️', color:'#06b6d4',
 blurb:'Adjacency lists vs matrices, breadth-first search, depth-first search, edge types.',
 lead:'Graphs model pairwise relationships. <b>BFS</b> explores in layers and finds shortest paths by edge count; <b>DFS</b> goes deep first and records discovery and finish times that reveal the graph\'s structure.',
 reading:'CLRS Sections 20.1–20.3; Chapter 5 of Jeff Erickson\'s notes; Goodrich &amp; Tamassia section on Graph Representations (Google Drive Resources folder)', notes:'Topic 14A',
 videos:[['IdStgDmUlXM','14A · Graphs Definitions'],['pyDxf58rK_0','14B · Graph ADT Representations'],['A8SKOFseOyU','14C · BFS'],['emiWSGizJlc','14D · DFS Introduction'],['HMPaUoGfsPo','14E · DFS Example Properties']],
 mit:[['FPEMBWg_WlY','MIT Lecture 16 (until 23:26)',0,1406]],
 prereq:['ICS 241 Ch 10.1: Graphs and Graph Models','ICS 241 Ch 10.2: Graph Terminology and Special Types of Graphs','ICS 241 Ch 10.3: Representing Graphs and Graph Isomorphism','ICS 241 Ch 10.4: Connectivity','ICS 241 Ch 11.4: Spanning Trees','ICS 241: Graphs'],
 html:`<h2>Representations</h2>
 <table class="tbl"><tr><th></th><th>Adjacency list</th><th>Adjacency matrix</th></tr>
 <tr><td>Space</td><td>Θ(V + E)</td><td>Θ(V²)</td></tr><tr><td>Is (u, v) an edge?</td><td>O(degree(u))</td><td>O(1)</td></tr><tr><td>List neighbors of u</td><td>Θ(degree(u))</td><td>Θ(V)</td></tr><tr><td>Best for</td><td>sparse graphs (E ≪ V²)</td><td>dense graphs</td></tr></table>
 <h2>Breadth-first search</h2>
 <div class="grid g2"><pre><code><span class="fn">BFS</span>(G, s)
  <span class="kw">for each</span> vertex u ∈ G.V - {s}
      u.color = WHITE; u.d = ∞; u.π = NIL
  s.color = GRAY; s.d = 0; s.π = NIL
  Q = ∅
  <span class="fn">ENQUEUE</span>(Q, s)
  <span class="kw">while</span> Q ≠ ∅
      u = <span class="fn">DEQUEUE</span>(Q)
      <span class="kw">for each</span> v ∈ G.Adj[u]
          <span class="kw">if</span> v.color == WHITE
              v.color = GRAY
              v.d = u.d + 1; v.π = u
              <span class="fn">ENQUEUE</span>(Q, v)
      u.color = BLACK</code></pre>
 <div class="card"><ul class="clean"><li>Runs in <b>O(V + E)</b>: each vertex is enqueued once, each adjacency list scanned once.</li><li>v.d = shortest-path distance (number of edges) from s.</li><li>The π pointers form a <b>breadth-first tree</b>.</li></ul><h3>Depth-first search</h3><ul class="clean"><li>DFS-VISIT recursively explores each white neighbor; it stamps discovery time u.d and finish time u.f. Also Θ(V + E).</li><li><b>Parenthesis theorem:</b> intervals [u.d, u.f] are either nested or disjoint.</li><li>Edge types: <b>tree</b>, <b>back</b> (to an ancestor ⇒ cycle), <b>forward</b>, <b>cross</b>. Undirected graphs have only tree and back edges.</li></ul></div></div>`,
 eli5:{title:'Two ways to explore a map',pts:['🗺️ A <b>graph</b> is dots (places) connected by lines (roads).','🌊 <b>BFS</b> is like ripples in a pond: first visit all neighbors 1 step away, then 2 steps away, and so on. It finds the fewest-steps route!','🕳️ <b>DFS</b> is like exploring a cave: go as deep as you can down one tunnel, then back up and try the next tunnel.','📒 We can store a graph as a list of neighbors for each dot (great when there are few roads) or a big yes/no grid (great when there are lots).']},
 diagram:()=>fig(D.svg(720,230,(()=>{const N={s:[90,115,0],a:[220,55,1],b:[220,175,1],c:[360,40,2],d:[360,120,2],e:[360,195,2],f:[500,80,3],g:[500,170,3]};const E=[['s','a'],['s','b'],['a','c'],['a','d'],['b','d'],['b','e'],['c','f'],['d','f'],['e','g'],['d','g']];const col=[C.warn,C.cy,C.acc,C.pink];let s=[1,2,3].map(r=>`<circle cx="90" cy="115" r="${r*135}" fill="none" stroke="${col[r]}" stroke-opacity=".25" stroke-dasharray="5 6"/>`).join('');s+=E.map(([u,v])=>D.line(N[u][0],N[u][1],N[v][0],N[v][1],C.dim,2)).join('');Object.entries(N).forEach(([k,[x,y,d]])=>{s+=D.node(x,y,k,col[d],17)+D.text(x,y+32,'d='+d,11,col[d]);});return s+D.text(640,60,'BFS layers',13,C.txt,'middle',700)+col.map((c,i)=>D.text(640,85+i*22,'distance '+i,12,c)).join('');})()),
  'BFS discovers vertices in layers by distance from s; each ring is one more edge away.','Ripples spread out from s: the first ring is 1 step away, the next ring 2 steps, and so on.'),
 mc:[
  ['Running time of BFS with adjacency lists:','O(V + E)',['O(V²)','O(E lg V)','O(VE)'],'Each vertex dequeued once; each list scanned once.'],
  ['Space for an adjacency-matrix representation:','Θ(V²)',['Θ(V + E)','Θ(E)','Θ(V lg V)'],'One entry per vertex pair.'],
  ['After BFS from s, v.d equals:','The minimum number of edges on a path from s to v',['The DFS discovery time of v','The total weight of the lightest path','The degree of v'],'BFS computes unweighted shortest paths.'],
  ['BFS uses which data structure for its frontier?','A FIFO queue',['A stack','A min-heap keyed by weight','A hash table only'],'DFS uses recursion (a stack).'],
  ['In DFS, an edge (u, v) to an ancestor v of u is a:','Back edge',['Tree edge','Forward edge','Cross edge'],'Back edges indicate cycles.'],
  ['In a DFS of an undirected graph, every edge is either:','A tree edge or a back edge',['A tree edge or a cross edge','A forward edge or a cross edge','Any of the four types'],'CLRS Theorem 20.10.'],
  ['The parenthesis theorem says the intervals [u.d, u.f] and [v.d, v.f] are:','Either nested or disjoint',['Always disjoint','Always overlapping','Equal in length'],'Like properly matched parentheses.'],
  ['For a sparse graph (E = O(V)), the better representation is usually:','Adjacency lists',['Adjacency matrix','Incidence matrix','Edge list sorted by weight'],'Θ(V + E) space instead of Θ(V²).']
 ]},

{id:'t14b', num:'#14B', short:'Topological Sort & SCC', title:'Topological Sort &amp;', grad:'Strongly Connected Components', when:'Week 11 · Wed 11/04', icon:'🧱', color:'#0ea5e9',
 blurb:'Ordering a DAG with DFS finish times; Kosaraju\'s SCC algorithm.',
 lead:'DFS finish times solve two classic problems: ordering the tasks of a <b>DAG</b> so every edge points forward, and splitting a directed graph into <b>strongly connected components</b>.',
 reading:'CLRS Sections 20.4–20.5', notes:'Topic 14B',
 videos:[['TZDQHplPrNo','14F · DFS Applications: Topological Sort and SCC']],
 prereq:['ICS 241 Ch 10.4: Connectivity','ICS 241: Graphs'],
 html:`<h2>Topological sort</h2>
 <div class="grid g2"><pre><code><span class="fn">TOPOLOGICAL-SORT</span>(G)
  call <span class="fn">DFS</span>(G) to compute finish times v.f
  as each vertex finishes, insert it
      onto the <b>front</b> of a linked list
  <span class="kw">return</span> the linked list</code></pre>
 <div class="card"><ul class="clean"><li>A topological order lists vertices so every edge (u, v) has u before v. It exists <b>iff</b> the graph is a DAG.</li><li>Order vertices by <b>decreasing finish time</b>. Θ(V + E).</li><li>A directed graph is acyclic iff DFS finds <b>no back edges</b>.</li><li>Classic example: getting dressed (socks before shoes).</li></ul></div></div>
 <h2>Strongly connected components</h2>
 <div class="grid g2"><div class="card"><h3>STRONGLY-CONNECTED-COMPONENTS(G)</h3><ol><li>Call DFS(G) to compute finish times u.f.</li><li>Compute the transpose Gᵀ (reverse every edge).</li><li>Call DFS(Gᵀ), considering vertices in order of <b>decreasing u.f</b>.</li><li>Each tree in the second DFS forest is one SCC.</li></ol><p>Θ(V + E) total.</p></div>
 <div class="card"><ul class="clean"><li>An SCC is a maximal set of vertices where every vertex can reach every other.</li><li>G and Gᵀ have the same SCCs.</li><li>The <b>component graph</b> G^SCC (one vertex per SCC) is always a DAG.</li></ul></div></div>`,
 eli5:{title:'Doing chores in the right order',pts:['👟 You must put on socks before shoes, and underwear before pants. A <b>topological sort</b> lists chores so every "before" rule is obeyed.','🔁 This only works if there are no loops (you can\'t need A before B and B before A).','🏘️ <b>Strongly connected components</b> are neighborhoods where you can drive from any house to any other house and back.','🔄 Trick to find them: explore once, flip every one-way street, then explore again in a special order.']},
 diagram:()=>fig(D.svg(720,200,(()=>{const order=['undershorts','socks','pants','shoes','belt','shirt','tie','jacket'];const E=[[0,2],[0,3],[1,3],[2,3],[2,4],[5,4],[5,6],[6,7],[4,7]];let s='';const X=i=>55+i*88;E.forEach(([a,b])=>{const h=Math.abs(b-a)*20+18;s+=`<path d="M${X(a)} 95 Q ${(X(a)+X(b))/2} ${95-h} ${X(b)-6} 95" fill="none" stroke="${C.cy}" stroke-width="2" marker-end="url(#ar-cy)"/>`;});order.forEach((l,i)=>{s+=`<rect x="${X(i)-40}" y="95" width="80" height="30" rx="8" fill="${C.acc}22" stroke="${C.acc}" stroke-width="2"/>`+D.text(X(i),115,l,11,'#fff','middle',700);});return s+D.text(360,165,'topological order: every arrow points to the right',12.5,C.txt)+D.text(360,188,'= vertices sorted by decreasing DFS finish time',12,C.mut);})()),
  'In a topological order of a DAG every edge points forward; DFS finish times produce one.','Every arrow goes left-to-right, so if you do the chores in this order, you never break a rule.'),
 mc:[
  ['A topological sort exists if and only if the directed graph:','Is acyclic (a DAG)',['Is strongly connected','Is undirected','Has no isolated vertices'],'A cycle makes a consistent order impossible.'],
  ['TOPOLOGICAL-SORT orders vertices by:','Decreasing DFS finish time',['Increasing discovery time','BFS distance','Out-degree'],'Insert each finished vertex at the front of a list.'],
  ['A directed graph is acyclic iff DFS yields:','No back edges',['No tree edges','No cross edges','Exactly V − 1 edges'],'CLRS Lemma 20.11.'],
  ['The SCC algorithm runs DFS on:','G, then on the transpose Gᵀ in order of decreasing finish time',['G twice in the same order','Gᵀ only','G with BFS in between'],'Kosaraju’s algorithm.'],
  ['The component graph G^SCC is always:','A DAG',['A tree','Strongly connected','Complete'],'Otherwise two components would merge.'],
  ['Running time of the SCC algorithm with adjacency lists:','Θ(V + E)',['Θ(V²)','Θ(E lg V)','Θ(VE)'],'Two DFS runs plus computing Gᵀ.'],
  ['G and its transpose Gᵀ have:','Exactly the same strongly connected components',['Reversed topological orders but different SCCs','No SCCs in common','The same DFS finish times'],'Mutual reachability is unchanged by reversing all edges.']
 ]}
);

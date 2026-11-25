// ======================= MT4 LEARNING PATH: LESSON CONTENT =======================
// LEARN_MT4 = units (big topics). Each lesson has a detailed explanation, a dummy
// note (plain-language version), screencast sections (clip specs resolved against
// the real YouTube chapters in learn-chapters.js), an optional step-through
// visualizer, and a quick knowledge check. Each unit ends with a generated
// pseudocode test from learn-mt4-gen.js.
//   clip spec: [videoId, firstChapterTitle?, lastChapterTitle?]  (omit titles = whole video)
//   check:     [question, [correct, wrong, wrong, wrong], explanation]
const LEARN_MT4 = [
{id: 'greedy', topics: ['t13'], title: 'Greedy Algorithms & Huffman Codes', notes: 'Topic 13', reading: 'CLRS 4e Ch 15 (15.1–15.3)',
 extra: [['FPEMBWg_WlY', 'Greedy Algorithms', 'Greedy Choice Property']],
 lessons: [
  {h: 'What "greedy" means, and how it differs from DP', clips: [['hWtmauUMYD8', 'Conceptual overview', 'Comparing the strategies']],
   body: `<p>A <b>greedy algorithm</b> builds a solution one piece at a time, and at every step it takes the choice that looks best <i>right now</i>, then never revisits it. That makes greedy algorithms short and fast, but they are only correct for problems with two properties:</p><ol><li><b>Greedy-choice property:</b> some optimal solution contains the greedy choice, so committing to it early can't lose.</li><li><b>Optimal substructure:</b> once the choice is made, what remains is a smaller instance of the same problem, and an optimal answer to it combined with the choice is optimal overall.</li></ol><p>Compare dynamic programming (Topic 12): DP also needs optimal substructure, but it makes its choice <b>after</b> solving every candidate subproblem and comparing them. Greedy makes the choice <b>before</b>, leaving exactly one subproblem. That's why greedy is usually Θ(n) or Θ(n lg n) where the DP version is Θ(n²) or worse.</p>`,
   kid: 'Greedy is like always grabbing the biggest cookie on the plate right now. Sometimes that is the smartest plan, sometimes it isn\'t, and you have to prove which one it is.',
   check: ['Greedy algorithms differ from dynamic programming because greedy…', ['commits to a choice before solving the remaining subproblem', 'always considers every subproblem', 'never needs optimal substructure', 'only works on graphs'], 'Greedy commits first and leaves one subproblem; DP solves all candidate subproblems and then chooses.']},
  {h: 'The knapsack example: where greedy works and where it fails', clips: [['hWtmauUMYD8', 'Knapsack problem example', 'Algorithm comparison']],
   body: `<p>A thief has a knapsack of capacity W and items with weight wᵢ and value vᵢ.</p><ul><li><b>Fractional knapsack</b> (you may take part of an item): sort by value density vᵢ / wᵢ and take the densest items first, then a fraction of the next one. This greedy is optimal. If an optimal solution held less of the densest item, swapping weight from a less dense item into it would increase the value without exceeding W.</li><li><b>0-1 knapsack</b> (each item is all or nothing): the same greedy fails. With W = 50 and items (10 kg, $60), (20 kg, $100), (30 kg, $120), density-greedy takes the first two for $160, but the optimum is items 2 + 3 for $220. Indivisibility breaks the exchange argument, so 0-1 knapsack needs DP in Θ(nW).</li></ul><p>The lesson the professor wants you to keep: <b>a greedy rule is a claim that needs a proof</b>. When you can't find the exchange argument, look for a small counterexample.</p>`,
   kid: 'If you can cut the gold bars, always take the shiniest gold per kilo first. If you can\'t cut anything, that shortcut can trick you into a worse bag.',
   check: ['Which knapsack version is solved optimally by taking the highest value/weight first?', ['Fractional knapsack', '0-1 knapsack', 'Both', 'Neither'], 'Fractional allows partial items, so the exchange argument works; 0-1 needs DP.']},
  {h: 'Activity selection: the problem and the greedy choice', clips: [['_-1nKy0bnwE', 'Activity scheduling problem', 'Formulating the solution'], ['_-1nKy0bnwE', 'Greedy choice property', 'Proving the greedy choice']],
   body: `<p>You're given n activities with start times sᵢ and finish times fᵢ. Pick the <b>largest</b> set of mutually compatible activities, where two activities are compatible if one finishes before the other starts.</p><p>A DP formulation exists: S<sub>ij</sub> is the set of activities between aᵢ and aⱼ, and c[i, j] = max over k of c[i, k] + c[k, j] + 1, which costs Θ(n³). The greedy insight makes it unnecessary.</p><p><b>Theorem (CLRS 15.1):</b> if a<sub>m</sub> has the earliest finish time, then a<sub>m</sub> is in some maximum-size compatible set.</p><p><b>Exchange proof:</b> take any optimal set A, and let a<sub>j</sub> be its earliest-finishing activity. If a<sub>j</sub> = a<sub>m</sub>, you're done. Otherwise replace a<sub>j</sub> with a<sub>m</sub>. Since f<sub>m</sub> ≤ f<sub>j</sub> ≤ the start of A's second activity, the new set is still compatible and the same size, so it's also optimal and it contains a<sub>m</sub>. Then recurse on the activities that start after f<sub>m</sub>, which is optimal substructure.</p>`,
   kid: 'To fit the most activities into your day, always pick the one that ends earliest. It leaves you the most time for everything else.',
   check: ['Which greedy rule is provably optimal for activity selection?', ['Earliest finish time', 'Shortest duration', 'Earliest start time', 'Fewest overlaps'], 'Earliest finish leaves the most remaining time; the exchange argument swaps it into any optimal solution.']},
  {h: 'The iterative algorithm, its cost, and the four strategies (Exercise 15)', clips: [['_-1nKy0bnwE', 'Iterative greedy algorithm', 'Algorithm analysis and summary']],
   body: `<pre><code>GREEDY-ACTIVITY-SELECTOR(s, f, n)   // sorted by finish time
  A = {a1};  k = 1
  for m = 2 to n
      if s[m] ≥ f[k]                 // compatible with the last pick
          A = A ∪ {am};  k = m
  return A</code></pre><p>The loop is Θ(n), plus Θ(n lg n) if you must sort first. The hidden invariant: after each step, A is compatible and can be extended to an optimal solution.</p><table class="tbl"><tr><th>Rule (Exercise 15)</th><th>Verdict</th><th>Why</th></tr><tr><td>Earliest finish</td><td>optimal</td><td>exchange argument</td></tr><tr><td>Latest start</td><td>optimal</td><td>earliest finish on the time-reversed instance</td></tr><tr><td>Shortest duration</td><td>fails</td><td>a short activity can block two long compatible ones</td></tr><tr><td>Fewest overlaps</td><td>fails</td><td>the exercise's instance: greedy gets 3, optimal gets 4</td></tr><tr><td>Weighted values</td><td>needs DP</td><td>no local rule is provably safe</td></tr></table>`,
   kid: 'Go down the list in finishing order and keep every activity that starts after the last one you kept. That\'s the whole algorithm.',
   check: ['"Pick the compatible activity with the latest START time" is…', ['optimal, by symmetry with earliest finish', 'never optimal', 'optimal only when activities are the same length', 'the same as shortest duration'], 'Reverse time: latest start becomes earliest finish, and the same proof applies.']},
  {h: 'Prefix codes and code trees', clips: [['UgJk87jazLQ', 'Huffman Codes', 'Binary Tree Representation of Prefix Codes']],
   body: `<p>To compress text we give each character a binary codeword. A <b>fixed-length</b> code with n characters needs ⌈lg n⌉ bits each. A <b>variable-length</b> code gives frequent characters short codewords. To decode without separators, we need a <b>prefix code</b>: no codeword is a prefix of another.</p><p>A prefix code is a binary tree with the characters at the leaves; 0 means go left and 1 means go right. To decode, walk from the root and output a character at each leaf. The cost of a tree T is</p><p class="math" style="text-align:center">B(T) = Σ<sub>c</sub> c.freq · d<sub>T</sub>(c)</p><p>where d<sub>T</sub>(c) is the depth of c, which is also its codeword length. An optimal code tree is always <b>full</b>: every internal node has two children. Otherwise a node with one child could be removed, shortening some codewords. So a code for n characters has n leaves and n − 1 internal nodes.</p>`,
   kid: 'Common letters get short secret codes and rare letters get long ones. Because no code starts with another code, you can read the message without spaces.',
   check: ['Why must the code tree of an optimal prefix code be FULL?', ['A node with one child could be removed, shortening codewords', 'Prefix codes require a balanced tree', 'Full trees are easier to store', 'Huffman merges three trees at a time'], 'A single child wastes a bit on every codeword below it.']},
  {h: 'Huffman\'s algorithm and why it is optimal', clips: [['UgJk87jazLQ', 'Huffman\'s Algorithm', 'Informal Correctness']], viz: 'huff',
   body: `<pre><code>HUFFMAN(C)
  n = |C|;  Q = C               // min-priority queue on freq
  for i = 1 to n − 1
      z.left  = x = EXTRACT-MIN(Q)
      z.right = y = EXTRACT-MIN(Q)
      z.freq  = x.freq + y.freq
      INSERT(Q, z)
  return EXTRACT-MIN(Q)         // root</code></pre><p>There are n − 1 merges, each costing O(lg n) with a binary heap, so the total is <b>Θ(n lg n)</b>. If the frequencies are already sorted, two FIFO queues make it Θ(n); that's this unit's generated test.</p><p><b>Why it's optimal:</b></p><ul><li><b>Greedy-choice lemma:</b> some optimal tree has the two least-frequent characters x, y as siblings at maximum depth. Swapping them down can't increase B, because the characters they displace are at least as frequent.</li><li><b>Optimal-substructure lemma:</b> merging x and y into z with freq x + y gives B(T) = B(T′) + x.freq + y.freq, so an optimal T′ expands to an optimal T.</li></ul><p><b>Trace (CLRS):</b> a45 b13 c12 d16 e9 f5 merge into 14, 25, 30, 55, 100. The codes are a = 0, c = 100, b = 101, d = 111, f = 1100, e = 1101, so B = 224 versus 300 for a fixed 3-bit code.</p>`,
   kid: 'Keep gluing the two rarest letters together into a team until one big tree is left. Rare letters end up deep (long codes) and common ones stay near the top (short codes).',
   check: ['Huffman\'s algorithm on n characters with a binary heap runs in…', ['Θ(n lg n)', 'Θ(n)', 'Θ(n²)', 'Θ(2ⁿ)'], 'n − 1 merges, each with O(lg n) heap operations.']},
  {h: 'When greedy coin change works (PS9) and when it fails',
   body: `<p>For coins 1, c, c², …, cᵏ, greedy change is optimal: take ⌊n / d⌋ of the largest coin, keep n mod d, and move down. An optimal solution never uses c or more copies of any smaller coin cⁱ, because c copies could be replaced by one cⁱ⁺¹. So the optimal answer is exactly the base-c expansion of n, which is what greedy produces. That's Θ(k) time.</p><p>For arbitrary coins the same rule fails: with {1, 3, 4} and n = 6, greedy gives 4 + 1 + 1 (3 coins) but 3 + 3 uses 2. That's why coin change in general is the DP of PS8 (Θ(nk)).</p><div class="callout">The pattern for every "is this greedy correct?" question: try to break it on 2–4 items first. If it survives, prove it with an exchange argument, then state the running time (usually a sort plus one pass).</div>`,
   kid: 'With coins like 1, 2, 4, 8 you can always grab the biggest one that fits. With weird coins like 1, 3, 4 that trick sometimes gives you extra coins.',
   check: ['Greedy change on coins {1, 3, 4} for 6 cents gives…', ['3 coins (4+1+1), but 2 coins (3+3) is optimal', 'the optimal 2 coins', '6 coins', 'an error'], 'This is the classic counterexample showing greedy needs a proof.']}
 ]},

{id: 'bfs', topics: ['t14a'], title: 'Graphs, Representations, BFS & DFS', notes: 'Topic 14A', reading: 'CLRS 4e 20.1–20.3 · Erickson Ch 5',
 extra: [['FPEMBWg_WlY', 'Introduction', 'Handshaking Lemma']],
 lessons: [
  {h: 'Graph vocabulary you must use precisely', clips: [['IdStgDmUlXM', 'Graph definitions', 'Connectivity and subgraphs']],
   body: `<p>A graph G = (V, E) has vertices V and edges E. In a <b>directed</b> graph an edge is an ordered pair (u, v); in an <b>undirected</b> graph it's an unordered pair.</p><ul><li><b>Degree:</b> in undirected graphs Σ deg(v) = 2|E| (the handshaking lemma). In directed graphs each vertex has an in-degree and an out-degree.</li><li><b>Path:</b> a sequence of edges. It's <b>simple</b> if no vertex repeats. A <b>cycle</b> starts and ends at the same vertex. A directed acyclic graph is a <b>DAG</b>.</li><li><b>Connected</b> (undirected): every pair has a path. <b>Strongly connected</b> (directed): every pair has paths both ways.</li><li>Sparse means |E| ≈ |V|; dense means |E| ≈ |V|². Running times are written in V and E, for example Θ(V + E).</li></ul>`,
   kid: 'A graph is dots connected by lines. Count the lines touching each dot and add them up: you get twice the number of lines, because each line touches two dots.',
   check: ['In an undirected graph, the sum of all vertex degrees equals…', ['2|E|', '|E|', '|V|', '|V| + |E|'], 'Each edge contributes 1 to the degree of each of its two endpoints.']},
  {h: 'Representations and their trade-offs (Exercise 16)', clips: [['pyDxf58rK_0', 'Basic graph representations', 'Complexity and tradeoff analysis']],
   body: `<table class="tbl"><tr><th>Operation</th><th>Adjacency list</th><th>Adjacency matrix</th></tr><tr><td>Space</td><td>Θ(V + E)</td><td>Θ(V²)</td></tr><tr><td>Is (u, v) an edge?</td><td>O(deg u)</td><td>O(1)</td></tr><tr><td>List the neighbours of u</td><td>Θ(deg u)</td><td>Θ(V)</td></tr><tr><td>BFS / DFS</td><td>Θ(V + E)</td><td>Θ(V²)</td></tr></table><p>Use lists for sparse graphs and a matrix for dense graphs or when you need many edge queries. <b>Exercise 16 (transpose Gᵀ):</b></p><ul><li>Matrix: swap A[i][j] with A[j][i] below the diagonal, O(V²) time and O(1) extra space.</li><li>Matrix with an "is-transposed" bit: O(1) to transpose, but every access pays a branch.</li><li>Edge list: swap the endpoints, O(E).</li><li>Adjacency lists: rebuild in O(V + E). Copying while deleting keeps the <i>live</i> extra space at O(V).</li></ul>`,
   kid: 'A list says "here are my friends"; a big grid says yes or no for every pair. Few friendships: use the list. Almost everyone is friends: the grid is fine.',
   check: ['BFS on a graph stored as an adjacency MATRIX costs…', ['Θ(V²)', 'Θ(V + E)', 'Θ(E lg V)', 'Θ(V)'], 'Listing the neighbours of each vertex scans a whole row: V rows × V entries.']},
  {h: 'Breadth-first search: the algorithm and its invariants', clips: [['A8SKOFseOyU', 'BFS', 'Code']], viz: 'bfsdfs',
   body: `<pre><code>BFS(G, s)
  for each u ∈ G.V − {s}: u.color = WHITE; u.d = ∞; u.π = NIL
  s.color = GRAY;  s.d = 0;  ENQUEUE(Q, s)
  while Q ≠ ∅
      u = DEQUEUE(Q)
      for each v ∈ G.Adj[u]
          if v.color == WHITE          // mark on DISCOVERY
              v.color = GRAY; v.d = u.d + 1; v.π = u
              ENQUEUE(Q, v)
      u.color = BLACK</code></pre><p>Colors: white means undiscovered, gray means discovered and in the queue, black means finished.</p><p><b>Invariant 1:</b> the queue holds vertices in non-decreasing d order, and the first and last d differ by at most 1.</p><p><b>Invariant 2:</b> when u is dequeued, u.d = δ(s, u), the fewest-edges distance. The π pointers form the <b>breadth-first tree</b>, and following them back from v prints a shortest path in O(length).</p><div class="callout warn">Classic bug: marking vertices when they're <b>dequeued</b> instead of when they're <b>discovered</b>. Then a vertex can be enqueued many times.</div>`,
   kid: 'BFS is ripples in a pond: first everyone 1 step away, then everyone 2 steps away. The first time a ripple reaches you is the shortest way there.',
   check: ['When should BFS mark a vertex as discovered?', ['When it is first seen and enqueued', 'When it is dequeued', 'When it turns black', 'Only at the end'], 'Marking at enqueue time guarantees each vertex enters the queue once: Θ(V + E).']},
  {h: 'Why BFS is Θ(V + E) and why it finds shortest paths', clips: [['A8SKOFseOyU', 'Aggregate Analysis']],
   body: `<p><b>Aggregate analysis:</b> each vertex is enqueued at most once (only while white), so there are O(V) queue operations. Each adjacency list is scanned exactly once, when its vertex is dequeued, and the lists have total length Θ(E) (2E undirected). Total <b>Θ(V + E)</b>.</p><p><b>Correctness (CLRS 20.2):</b></p><ol><li>For any edge (u, v), δ(s, v) ≤ δ(s, u) + 1.</li><li>v.d ≥ δ(s, v) always (induction on ENQUEUE).</li><li>The queue is ordered by d with a spread of at most 1.</li><li>Suppose some vertex got the wrong d, and take the one with the smallest δ. Its predecessor on a shortest path was dequeued earlier with the correct d, and would have discovered it with exactly δ. Contradiction.</li></ol><p>This only works because every edge has weight 1. With weights, the first time you reach a vertex need not be the cheapest, which is why Dijkstra (Unit 7) replaces the FIFO queue with a priority queue.</p>`,
   kid: 'Every dot gets in line once and every line gets looked at once, so the work is (dots + lines).',
   check: ['BFS distances are shortest paths when…', ['every edge has the same (unit) weight', 'the graph is a DAG', 'the graph is dense', 'always, even with weights'], 'BFS counts edges; weighted graphs need Dijkstra or Bellman-Ford.']},
  {h: 'Depth-first search and timestamps', clips: [['emiWSGizJlc', 'DFS vs BDF', 'Example']],
   body: `<pre><code>DFS(G)                          DFS-VISIT(G, u)
  for each u: u.color = WHITE     time = time + 1;  u.d = time
  time = 0                        u.color = GRAY
  for each u ∈ G.V                for each v ∈ G.Adj[u]
      if u.color == WHITE             if v.color == WHITE
          DFS-VISIT(G, u)                 v.π = u;  DFS-VISIT(G, v)
                                  u.color = BLACK
                                  time = time + 1;  u.f = time</code></pre><p>DFS goes as deep as possible, then backtracks. Every vertex gets a <b>discovery time</b> u.d and a <b>finish time</b> u.f, with 1 ≤ u.d &lt; u.f ≤ 2|V|. The π pointers form a <b>depth-first forest</b>, because the outer loop restarts from every white vertex.</p><p>The cost is Θ(V + E): each vertex is visited once and each edge examined once (twice in undirected graphs). Exams make you compute d/f tables by hand. Always follow the stated adjacency order (usually alphabetical), and increment the clock on both discover and finish.</p>`,
   kid: 'DFS explores a cave: go down one tunnel as far as you can, then walk back and try the next one. Write down when you enter and when you leave each room.',
   check: ['In DFS, the clock (time) is incremented…', ['both when a vertex is discovered and when it finishes', 'only on discovery', 'only on finish', 'once per edge'], 'That is why timestamps range from 1 to 2|V|.']},
  {h: 'Edge classification, the parenthesis theorem and the white-path theorem', clips: [['HMPaUoGfsPo', 'Edge Classification', 'White Path Theorem']],
   body: `<table class="tbl"><tr><th>v's color when (u, v) is explored</th><th>Edge type</th><th>Meaning</th></tr><tr><td>white</td><td>tree</td><td>v discovered through this edge</td></tr><tr><td>gray</td><td>back</td><td>v is an ancestor ⇒ a <b>cycle</b></td></tr><tr><td>black, u.d &lt; v.d</td><td>forward</td><td>v is a non-child descendant</td></tr><tr><td>black, u.d &gt; v.d</td><td>cross</td><td>another subtree or another tree</td></tr></table><ul><li><b>Parenthesis theorem:</b> for any u, v, the intervals [u.d, u.f] and [v.d, v.f] are either disjoint or nested. v is a descendant of u ⇔ u.d &lt; v.d &lt; v.f &lt; u.f.</li><li><b>White-path theorem:</b> v becomes a descendant of u ⇔ when u is discovered there is a path u ⇝ v made entirely of white vertices.</li><li><b>Undirected graphs</b> have only tree and back edges.</li><li><b>A directed graph is acyclic ⇔ DFS finds no back edges.</b></li></ul>`,
   kid: 'If you walk into a room that is still "open" (gray) on your current path, you went in a circle. That\'s a back edge, and it means a cycle.',
   check: ['During DFS, exploring an edge to a GRAY vertex means…', ['a back edge, so the graph has a cycle', 'a tree edge', 'a cross edge', 'nothing special'], 'Gray vertices are on the current recursion path, so the edge closes a cycle.']},
  {h: 'Applications: bipartite test and number maze (PS10)',
   body: `<ul><li><b>Bipartite test (PS10 1b):</b> run BFS and give each newly discovered vertex the color 1 − u.color. If any edge joins two vertices of the same color, the graph has an odd cycle and is <b>not bipartite</b>. That's Θ(V + E). A graph is bipartite ⇔ it has no odd cycle.</li><li><b>Number maze (PS10 P2):</b> each square is a vertex. From a square labeled k you can jump exactly k squares in 4 directions, so there are at most 4 edges per square. "Fewest moves" means BFS, Θ(n²). Return "no solution" if (n, n) is never reached. Don't backtrack over all paths, which is exponential.</li><li><b>Connected components:</b> restart BFS or DFS from every unvisited vertex, Θ(V + E).</li><li><b>Undirected cycle detection:</b> a visited neighbour that isn't the parent.</li></ul><p>The modeling skill being tested: turn the story into vertices (states) and edges (moves), then recognize "fewest steps" ⇒ BFS.</p>`,
   kid: 'To split kids into two teams where friends are always on opposite teams, color them red, blue, red, blue as you go. If two friends end up the same color, it can\'t be done.',
   check: ['BFS 2-coloring finds an edge between two vertices of the same color. Therefore…', ['the graph has an odd cycle and is not bipartite', 'the graph is bipartite', 'the graph is a tree', 'BFS made an error'], 'Same-color neighbours mean an odd cycle, and no 2-coloring exists.']}
 ]},

{id: 'topo', topics: ['t14b'], title: 'Topological Sort & Strongly Connected Components', notes: 'Topic 14B', reading: 'CLRS 4e 20.4–20.5',
 lessons: [
  {h: 'Topological sort with DFS finish times', clips: [['TZDQHplPrNo', 'Topological sort', 'recursive DFS']], viz: 'topo',
   body: `<p>A <b>topological order</b> of a DAG lists its vertices so that every edge (u, v) has u before v. Think of scheduling tasks with prerequisites. It exists <b>iff</b> the graph is acyclic.</p><pre><code>TOPOLOGICAL-SORT(G)
  call DFS(G) to compute finish times v.f
  as each vertex finishes, insert it at the FRONT of a list
  return the list            // decreasing finish time; Θ(V + E)</code></pre><p><b>Trace:</b> A→B, A→D, B→C, B→E, D→E, E→F, C→F, G→F, H→C with alphabetical DFS gives A 1/12, B 2/9, C 3/6, F 4/5, E 7/8, D 10/11, G 13/14, H 15/16. Sorted by decreasing f, that's <b>H, G, A, D, B, E, C, F</b>. Check that every edge points left to right.</p>`,
   kid: 'Socks before shoes, underwear before pants. List the chores so every "before" rule is obeyed. Whoever finishes last in DFS goes first in the list.',
   check: ['TOPOLOGICAL-SORT outputs vertices in order of…', ['decreasing finish time', 'increasing discovery time', 'increasing finish time', 'BFS distance'], 'Insert each vertex at the front of the list when it finishes.']},
  {h: 'Why finish times work, and detecting cycles',
   body: `<p><b>Lemma:</b> in a DAG, every edge (u, v) has <b>u.f &gt; v.f</b>.</p><p><b>Proof</b>, by cases on v's color when DFS explores (u, v):</p><ul><li><b>White:</b> v becomes u's descendant and finishes first.</li><li><b>Gray:</b> that would be a back edge, which means a cycle, which is impossible in a DAG.</li><li><b>Black:</b> v has already finished.</li></ul><p>In every case v.f &lt; u.f, so decreasing f puts u before v. ∎</p><p><b>Cycle detection:</b> a directed graph has a cycle ⇔ DFS finds a back edge (an edge to a gray vertex). If you see one, no topological order exists, so report "impossible." The <b>uniqueness</b> check: the topological order is unique ⇔ every pair of consecutive vertices is joined by an edge (a Hamiltonian path).</p>`,
   kid: 'In a no-loop graph, if you must do A before B, then A always gets "closed" after B in DFS, so A lands earlier in the list.',
   check: ['A topological order exists if and only if the directed graph…', ['has no cycle (is a DAG)', 'is strongly connected', 'has no isolated vertices', 'is a tree'], 'Any cycle makes a consistent order impossible.']},
  {h: 'Kahn\'s algorithm (Exercise 17)',
   body: `<pre><code>KAHN(G)
  compute indeg[v] for every v            // Θ(V + E)
  Q = all vertices with indeg 0
  while Q ≠ ∅
      u = DEQUEUE(Q);  output u
      for each v ∈ Adj[u]
          indeg[v] = indeg[v] − 1
          if indeg[v] == 0: ENQUEUE(Q, v)</code></pre><p>Two observations give the Θ(V + E) analysis:</p><ol><li>Each vertex enters the queue <b>at most once</b>, because its in-degree hits 0 exactly once.</li><li>Each edge is scanned once, when its tail is dequeued.</li></ol><p>If fewer than |V| vertices are output, the leftover vertices all have positive in-degree, so following incoming edges must eventually loop: there's a <b>cycle</b>. On the DAG above with an alphabetical queue: A, G, H, B, D, C, E, F.</p>`,
   kid: 'Repeatedly do any chore that has no unfinished "before" chores left. If you get stuck with chores left over, there\'s a loop in the rules.',
   check: ['Kahn\'s algorithm finishes but some vertices still have in-degree > 0. This means…', ['the graph has a cycle', 'the graph is disconnected', 'the algorithm has a bug', 'the graph is bipartite'], 'Every DAG has a source; positive leftover in-degrees force a cycle.']},
  {h: 'Strongly connected components: definitions', clips: [['TZDQHplPrNo', 'strongly connected components', 'weakly connected components']],
   body: `<p>A <b>strongly connected component (SCC)</b> of a directed graph is a <b>maximal</b> set of vertices in which every vertex can reach every other. A <b>weakly connected component</b> ignores edge directions. Don't confuse the two.</p><ul><li>Every vertex is in exactly one SCC.</li><li>G and its transpose Gᵀ (every edge reversed) have <b>the same SCCs</b>, because mutual reachability doesn't care about reversing every edge.</li><li>Contract each SCC into one vertex to get the <b>component graph</b> G<sup>SCC</sup>, which is always a <b>DAG</b>. If two components could reach each other, they would be one component.</li></ul>`,
   kid: 'An SCC is a neighborhood where you can drive from any house to any other house and back, even with one-way streets.',
   check: ['The component graph G^SCC is always…', ['a DAG', 'a tree', 'strongly connected', 'complete'], 'A cycle among components would merge them into one SCC.']},
  {h: 'Kosaraju\'s two-pass algorithm and why it works', clips: [['TZDQHplPrNo', 'DFS Algorithm', 'Component Graph']],
   body: `<ol><li>Run DFS(G) to compute finish times u.f.</li><li>Compute Gᵀ in Θ(V + E).</li><li>Run DFS(Gᵀ), with the main loop taking vertices in <b>decreasing u.f</b>.</li><li>Each tree of the second DFS forest is one SCC.</li></ol><p>The total is <b>Θ(V + E)</b>.</p><p><b>Key lemma:</b> if there is an edge from SCC C to SCC C′, then f(C) &gt; f(C′), where f(C) is the largest finish time in C. So the vertex with the highest finish time lies in a <b>source</b> component of G<sup>SCC</sup>. In Gᵀ that component has no outgoing edges, so the second DFS can't escape it. The same argument repeats for the next-highest unvisited vertex.</p><p><b>Exercise 17</b> makes you build the full d/f/π tables with alphabetical tie-breaking. Its answer is the SCCs {l}, {k}, {a, b, c}, {d, e, h}, {i}, {j}, {f, g}.</p><div class="callout warn">Classic mistakes: running pass 2 on G instead of Gᵀ, using increasing f, or sorting by discovery time.</div>`,
   kid: 'Explore once and note who finished last. Flip every one-way street. Explore again starting from the last-finisher: each exploration gets stuck inside exactly one neighborhood.',
   check: ['Kosaraju\'s second DFS runs on…', ['Gᵀ, in decreasing order of the first pass\'s finish times', 'G, in increasing finish time', 'Gᵀ, in alphabetical order', 'the component graph'], 'The transpose traps each DFS tree inside one SCC.']}
 ]},

{id: 'ds', topics: ['ds'], title: 'Disjoint Sets (Union-Find)', notes: 'Topic 16', reading: 'CLRS 4e Ch 19 (19.1–19.4); Lemmas 19.11–19.13, Thm 19.14',
 lessons: [
  {h: 'The ADT and its classic use: connected components',
   body: `<p>A disjoint-set structure maintains a collection of non-overlapping sets, each identified by a <b>representative</b> member. There are three operations:</p><ul><li><b>MAKE-SET(x):</b> create the singleton {x}.</li><li><b>FIND-SET(x):</b> return the representative of x's set.</li><li><b>UNION(x, y):</b> merge the sets containing x and y.</li></ul><p>We analyze sequences of m operations, n of which are MAKE-SETs. At most n − 1 UNIONs can actually merge sets.</p><pre><code>CONNECTED-COMPONENTS(G)
  for each v ∈ G.V: MAKE-SET(v)
  for each (u, v) ∈ G.E
      if FIND-SET(u) ≠ FIND-SET(v): UNION(u, v)
SAME-COMPONENT(u, v)
  return FIND-SET(u) == FIND-SET(v)</code></pre><p>For a <b>static</b> graph, a single DFS or BFS is simpler. Union-Find wins when edges <b>arrive over time</b>, as in Kruskal. It can't delete edges.</p>`,
   kid: 'Kids are sorted into teams. MAKE-SET gives each kid their own team, UNION merges two teams, and FIND-SET asks "who is your team captain?"',
   check: ['Starting from n singletons, at most how many UNIONs can actually merge sets?', ['n − 1', 'n', 'n/2', 'unlimited'], 'Each successful union reduces the number of sets by one.']},
  {h: 'Linked-list representation and weighted union',
   body: `<p>Each set is a linked list whose head is the representative, and every node points back to the head.</p><ul><li>MAKE-SET and FIND-SET are O(1).</li><li>UNION appends one list to the other and must update the back-pointer of every appended node.</li><li>Naively that can total Θ(n²) for n unions, i.e. Θ(n) amortized per operation.</li></ul><p><b>Weighted-union heuristic:</b> always append the <b>shorter</b> list. A node's pointer changes only when it's in the smaller list, and then its set at least doubles. So each node is updated at most ⌈lg n⌉ times, and m operations cost <b>O(m + n lg n)</b>.</p>`,
   kid: 'When two teams merge, the smaller team changes its name tags. Each kid\'s team at least doubles every time they relabel, so nobody relabels very often.',
   check: ['With linked lists and the weighted-union heuristic, m operations on n elements cost…', ['O(m + n lg n)', 'O(m α(n))', 'O(mn)', 'O(m)'], 'Each element\'s back-pointer moves at most lg n times.']},
  {h: 'Forests: union by rank and path compression',
   body: `<pre><code>MAKE-SET(x):  x.p = x;  x.rank = 0
FIND-SET(x)                       // path compression
  if x ≠ x.p:  x.p = FIND-SET(x.p)
  return x.p
LINK(x, y)                        // union by rank
  if x.rank > y.rank:  y.p = x
  else  x.p = y
        if x.rank == y.rank:  y.rank = y.rank + 1
UNION(x, y):  LINK(FIND-SET(x), FIND-SET(y))</code></pre><ul><li>Each set is a tree, and its root (x.p == x) is the representative.</li><li><b>Union by rank:</b> the lower-rank root goes under the higher-rank root. On a tie, <b>y</b> becomes the parent and its rank goes up by 1.</li><li><b>Rank is an upper bound on height</b>, not the height itself, because path compression shrinks trees without updating ranks.</li><li>A rank-r root has ≥ 2ʳ nodes, so rank ≤ ⌊lg n⌋.</li><li>FIND-SET is two-pass: up to the root, then every node on the path is re-pointed at the root as the recursion unwinds. It is <b>not tail-recursive</b>, because the unwinding does the compression.</li></ul>`,
   kid: 'When teams merge, the shorter tree hangs under the taller one. When you ask "who\'s my captain?", everyone you passed on the way gets a direct line to the captain for next time.',
   check: ['With union by rank, two roots of EQUAL rank are linked. Then…', ['the new root\'s rank increases by 1', 'both ranks increase', 'no rank changes', 'the child\'s rank becomes 0'], 'Equal heights stacked can grow the height bound by one.']},
  {h: 'The amortized bound: O(m α(n))',
   body: `<p>With both heuristics, a sequence of m operations costs <b>O(m α(n))</b>, where α is the inverse Ackermann function. The course cites:</p><ul><li><b>Lemma 19.11:</b> MAKE-SET is O(1) amortized.</li><li><b>Lemmas 19.12–19.13:</b> LINK and FIND-SET are O(α(n)) amortized.</li><li><b>Theorem 19.14:</b> m operations cost O(m α(n)).</li></ul><p>You need the result, not the potential-function proof. α(n) ≤ 4 for every n you will ever see, so this is "effectively constant", but say "O(α(n)) amortized", not "O(1)".</p><table class="tbl"><tr><th>Heuristics</th><th>m operations</th></tr><tr><td>none (forest)</td><td>Θ(mn) worst</td></tr><tr><td>union by rank only</td><td>O(m lg n)</td></tr><tr><td>linked list + weighted union</td><td>O(m + n lg n)</td></tr><tr><td>rank + compression</td><td>O(m α(n))</td></tr></table>`,
   kid: 'With both tricks, every team question is answered almost instantly. The "almost" number is never bigger than 4 in real life.',
   check: ['How should you state the per-operation cost of union-find with both heuristics?', ['O(α(n)) amortized', 'O(1) worst case', 'O(lg n) worst case', 'O(n)'], 'α grows unimaginably slowly, but the bound is amortized and not literally constant.']}
 ]},

{id: 'mst', topics: ['mst', 'kruskal', 'prim'], title: 'Minimum Spanning Trees: Kruskal & Prim', notes: 'Topic 17', reading: 'CLRS 4e Ch 21',
 extra: [['FPEMBWg_WlY', 'Minimum Spanning Tree', 'Cut Paste']],
 lessons: [
  {h: 'The MST problem and GENERIC-MST', clips: [['Mx-dvvSE4Qc', 'Minimum Spanning Trees', 'Generic Algorithm']],
   body: `<p>Given a connected, undirected, weighted graph, a <b>spanning tree</b> connects all V vertices with exactly V − 1 edges and no cycle. A <b>minimum spanning tree</b> minimizes the total weight. A minimum connector is always a tree, because any cycle contains an edge whose removal keeps the graph connected and lowers the cost.</p><pre><code>GENERIC-MST(G, w)
  A = ∅
  while A is not a spanning tree        // runs V − 1 times
      find an edge (u, v) that is SAFE for A
      A = A ∪ {(u, v)}
  return A</code></pre><p><b>Invariant:</b> A is a subset of some MST. A <b>safe</b> edge is one that can be added while keeping that true. Kruskal and Prim are two ways of finding safe edges.</p>`,
   kid: 'An MST is the cheapest way to connect every town with roads, with no loops: like laying the least pipe that still reaches every house.',
   check: ['How many edges does every spanning tree of a connected graph with V vertices have?', ['V − 1', 'V', 'E', 'V + 1'], 'A tree on V vertices always has V − 1 edges.']},
  {h: 'Cuts, light edges and the Safe Edge Theorem (the most-asked proof)', clips: [['Mx-dvvSE4Qc', 'Safe Edge Theorem']],
   body: `<p>A <b>cut</b> (S, V − S) splits the vertices. An edge <b>crosses</b> it if one endpoint is on each side. The cut <b>respects</b> A if no edge of A crosses it. A <b>light</b> edge is a minimum-weight edge among those crossing the cut.</p><p><b>Theorem:</b> if A ⊆ some MST T, the cut respects A, and (u, v) is light across it, then (u, v) is safe.</p><p><b>Proof (reproduce this from memory):</b></p><ol><li>If (u, v) ∈ T, we're done.</li><li>Otherwise T has a unique path u ⇝ v. Since u and v are on opposite sides, some edge (x, y) on that path crosses the cut.</li><li>(x, y) ∉ A, because the cut respects A.</li><li>T′ = T − (x, y) + (u, v) is a spanning tree, and w(T′) ≤ w(T) because (u, v) is light. So T′ is an MST containing A ∪ {(u, v)}. ∎</li></ol><p><b>Corollaries and facts:</b></p><ul><li>A light edge joining two components of (V, A) is safe.</li><li>Distinct weights ⇒ the MST is unique.</li><li>The cycle property: the strictly heaviest edge on a cycle is in no MST.</li><li>Adding a constant to every weight doesn't change the MST (but it does change shortest paths).</li></ul>`,
   kid: 'Draw a line splitting the towns into two groups. The cheapest road crossing that line is always safe to build. If a plan skips it, swap it in for a pricier crossing road and the plan only gets cheaper.',
   check: ['In the safe-edge proof, why can\'t the removed edge (x, y) belong to A?', ['Because the cut respects A, so no A-edge crosses it', 'Because (x, y) is the heaviest edge in the graph', 'Because A is empty', 'Because (x, y) is light'], '(x, y) crosses the cut, and a respecting cut is crossed by no edge of A.']},
  {h: 'Kruskal\'s algorithm', clips: [['1BnpXYm7LKY']],
   body: `<pre><code>MST-KRUSKAL(G, w)
  A = ∅
  for each v ∈ G.V: MAKE-SET(v)
  sort G.E by weight                     // once
  for each (u, v) in sorted order
      if FIND-SET(u) ≠ FIND-SET(v)
          A = A ∪ {(u, v)};  UNION(u, v)
  return A</code></pre><ul><li>A is a <b>forest</b> that merges over time. Each accepted edge is a light edge between two components, so it's safe by the corollary.</li><li>Cost: O(E lg E) for sorting, which equals <b>O(E lg V)</b> because E ≤ V². The O(E α(V)) union-find work is dominated by the sort.</li><li>Reject (u, v) when u and v are in the same <b>set</b>, not when they're "adjacent in A".</li><li>A disconnected graph gives a minimum spanning forest.</li></ul><p><b>Trace:</b> edges a–c 1, b–c 2, d–e 2, a–b 4, b–d 5, c–d 8, c–e 10. Kruskal accepts a–c, b–c and d–e, rejects a–b, accepts b–d, and rejects the rest. Weight <b>10</b>.</p>`,
   kid: 'Sort every road by price and take each road unless it would make a loop. The union-find "team captain" check is the loop detector.',
   check: ['Which step dominates Kruskal\'s running time?', ['Sorting the edges: O(E lg V)', 'The MAKE-SET loop', 'The UNION calls', 'Checking connectivity with DFS'], 'Union-find work is O(E α(V)), smaller than the sort.']},
  {h: 'Prim\'s algorithm and choosing an implementation', clips: [['qegY0R78QMQ']],
   body: `<pre><code>MST-PRIM(G, w, r)
  for each u: u.key = ∞; u.π = NIL; INSERT(Q, u)
  DECREASE-KEY(Q, r, 0)
  while Q ≠ ∅
      u = EXTRACT-MIN(Q)
      for each v ∈ G.Adj[u]
          if v ∈ Q and w(u, v) < v.key
              v.π = u;  DECREASE-KEY(Q, v, w(u, v))</code></pre><p>Prim grows <b>one tree</b>. <b>v.key</b> is the lightest edge from v to the tree; it is <i>not</i> a distance. The cut is (tree, rest). The invariant is A = {(v, v.π) : v ∉ Q, v ≠ r}.</p><table class="tbl"><tr><th>Implementation</th><th>Time</th><th>Best for</th></tr><tr><td>binary heap</td><td>O(E lg V)</td><td>sparse</td></tr><tr><td>Fibonacci heap</td><td>O(E + V lg V)</td><td>sparse, large</td></tr><tr><td>array scan</td><td>Θ(V²)</td><td>dense (PS11 P4)</td></tr></table><p>The <b>Prim vs Dijkstra</b> difference is only the key: Prim uses w(u, v), while Dijkstra uses u.d + w(u, v).</p>`,
   kid: 'Prim grows one blob of connected towns. Each step it adds the cheapest road leaving the blob.',
   check: ['In MST-PRIM, v.key is…', ['the weight of the lightest edge connecting v to the current tree', 'the distance from r to v', 'v\'s degree', 'v\'s rank'], 'That is exactly a light edge across the cut (tree, rest).']},
  {h: 'MST facts the exams test, and Exercise 18',
   body: `<ul><li><b>Equal weights (PS11 P3):</b> every spanning tree is an MST, so a DFS/BFS tree in Θ(V + E) is enough. Don't sort or use a heap.</li><li><b>Max spanning tree:</b> negate the weights or sort descending. Negative weights are fine for MSTs.</li><li>An MST is <b>not</b> a shortest-path tree. Its u–v path minimizes the <i>maximum</i> edge (bottleneck), not the sum.</li></ul><table class="tbl"><tr><th>Exercise 18 algorithm</th><th>Verdict</th></tr><tr><td>A: sort descending, delete any edge whose removal keeps G connected (reverse-delete)</td><td>correct (cycle property)</td></tr><tr><td>B: arbitrary order, add if no cycle</td><td>wrong: a triangle counterexample</td></tr><tr><td>C: add every edge, drop the max edge of any cycle formed</td><td>correct (invariant: T is the MSF of the edges seen)</td></tr></table>`,
   kid: 'Cheapest-network questions are about connecting everyone for the least total money, not about the fastest trip between two towns.',
   check: ['Adding 5 to every edge weight of a connected graph…', ['does not change which spanning tree is minimum', 'changes the MST', 'makes the MST unique', 'breaks Kruskal'], 'Every spanning tree has V − 1 edges, so all totals shift by 5(V − 1).']}
 ]},

{id: 'fib', topics: ['fib'], title: 'Fibonacci Heaps (supplement)', notes: 'Topic 16', reading: 'CLRS 3e Ch 19 (not in the 4e print edition)',
 lessons: [
  {h: 'Why Fibonacci heaps exist',
   body: `<p>Prim and Dijkstra do V EXTRACT-MINs and up to E DECREASE-KEYs. With a binary heap each costs O(lg V), giving O((V + E) lg V). A Fibonacci heap makes <b>DECREASE-KEY O(1) amortized</b>, which gives <b>O(V lg V + E)</b>. That's a real gain on sparse graphs with many key updates.</p><table class="tbl"><tr><th>Operation</th><th>Binary heap</th><th>Fibonacci heap (amortized)</th></tr><tr><td>INSERT</td><td>Θ(lg n)</td><td>O(1)</td></tr><tr><td>MINIMUM</td><td>Θ(1)</td><td>O(1)</td></tr><tr><td>EXTRACT-MIN</td><td>Θ(lg n)</td><td>O(lg n)</td></tr><tr><td>DECREASE-KEY</td><td>Θ(lg n)</td><td>O(1)</td></tr><tr><td>UNION</td><td>Θ(n)</td><td>O(1)</td></tr></table>`,
   kid: 'A Fibonacci heap is a lazy priority queue. It doesn\'t tidy up until it absolutely has to, which makes "this item got more urgent" super cheap.',
   check: ['Using a Fibonacci heap, Dijkstra runs in…', ['O(V lg V + E)', 'O((V + E) lg V)', 'O(V²)', 'O(VE)'], 'V EXTRACT-MINs at O(lg V) plus E DECREASE-KEYs at O(1) amortized.']},
  {h: 'Structure and lazy operations',
   body: `<p>A Fibonacci heap is a <b>root list</b> of min-heap-ordered trees, plus a pointer H.min. Each node stores p, child, left/right siblings (a circular doubly linked list), degree and mark.</p><ul><li><b>INSERT:</b> add a singleton tree to the root list. O(1).</li><li><b>UNION:</b> concatenate the root lists. O(1).</li><li><b>EXTRACT-MIN:</b> remove H.min, move its children to the root list, then <b>CONSOLIDATE</b>: repeatedly link two roots of equal degree (the larger key becomes a child) until all root degrees differ, then find the new min. This is the only time the heap gets tidied.</li></ul>`,
   kid: 'Adding things is instant: just drop a new pile on the floor. Only when you need the smallest do you merge same-size piles so things don\'t get too messy.',
   check: ['When does a Fibonacci heap consolidate its root list?', ['Only during EXTRACT-MIN', 'On every INSERT', 'On every DECREASE-KEY', 'Never'], 'Laziness: the work is postponed until a minimum must actually be removed.']},
  {h: 'DECREASE-KEY, CUT and CASCADING-CUT',
   body: `<pre><code>FIB-DECREASE-KEY(H, x, k)
  x.key = k;  y = x.p
  if y ≠ NIL and x.key < y.key
      CUT(H, x, y);  CASCADING-CUT(H, y)
  if x.key < H.min.key:  H.min = x
CUT(H, x, y):  remove x from y's children; y.degree−−
               add x to the root list; x.p = NIL; x.mark = FALSE
CASCADING-CUT(H, y)
  z = y.p
  if z ≠ NIL
      if y.mark == FALSE:  y.mark = TRUE
      else  CUT(H, y, z);  CASCADING-CUT(H, z)</code></pre><p>The <b>mark</b> bit records "this node has lost a child since it became a child." The first loss sets the mark. A second loss cuts the node too, and the cut cascades upward. This limits how much a tree can be thinned out, which is what keeps degrees small. <b>FIB-DELETE(H, x)</b> = DECREASE-KEY to −∞, then EXTRACT-MIN, which is O(lg n) amortized. That's this unit's generated test.</p>`,
   kid: 'If a parent loses one child, it gets a sticker. If it loses a second child, it gets cut loose too, and its own parent might get a sticker.',
   check: ['A marked node loses another child. What happens?', ['It is cut to the root list and the cut cascades to its parent', 'It is deleted', 'Its mark is ignored', 'The heap is rebuilt'], 'Second loss ⇒ cut; that is the cascading cut.']},
  {h: 'The degree bound and the potential function',
   body: `<p><b>Child-degree lemma:</b> if x has children y₁ … yₖ in the order they were linked, then yᵢ.degree ≥ i − 2. When yᵢ was linked it had degree ≥ i − 1, and it can lose at most one child without being cut.</p><p><b>Size lemma:</b> a node of degree k roots a subtree of size ≥ F<sub>k+2</sub> ≥ φᵏ, where φ = (1 + √5)/2 ≈ 1.618 and φ² = φ + 1. The minimum sizes 1, 2, 3, 5, 8, … are Fibonacci numbers.</p><p>So the max degree is <b>D(n) ≤ ⌊log<sub>φ</sub> n⌋ = O(lg n)</b>, which makes EXTRACT-MIN O(lg n) amortized. For example, D(1000) ≤ 14.</p><p><b>Potential:</b> Φ(H) = t(H) + 2·m(H), the number of trees plus twice the number of marks. Its credit pays for consolidation and cascading cuts. Always say "<b>amortized</b>".</p>`,
   kid: 'Because a node can only lose one kid before being cut, every node with many children must have a big family tree underneath, so no node can have too many kids.',
   check: ['A Fibonacci-heap node of degree k roots a subtree with at least…', ['F(k+2) ≥ φᵏ nodes', '2ᵏ nodes', 'k nodes', 'k² nodes'], 'The minimum sizes follow the Fibonacci recurrence.']}
 ]},

{id: 'sssp', topics: ['t18'], title: 'Single-Source Shortest Paths', notes: 'Topic 18', reading: 'CLRS 4e 22.1–22.3, 22.5',
 extra: [['xhG2DyCX3uA', 'Dijkstra\'s algorithm', 'Correctness and applications'], ['Ttezuzs39nk', 'Bellmanford', 'Induction'], ['Ttezuzs39nk', 'Difference Constraints', 'Negative Weight Cycles']],
 lessons: [
  {h: 'The problem, its variants, and negative cycles', clips: [['S7rzpWwICo8', 'Shortest path definitions', 'Negative weights and cycles']],
   body: `<p>The weight of a path is the sum of its edge weights, and δ(s, v) is the minimum over all s ⇝ v paths (∞ if v is unreachable). The <b>single-source</b> problem asks for δ(s, v) for every v. Variants:</p><ul><li>Single-destination: run on Gᵀ.</li><li>Single pair: no asymptotically faster method is known.</li><li>All pairs: Unit 8.</li></ul><p><b>Negative edges</b> are allowed by some algorithms. But a <b>negative-weight cycle reachable from s</b> makes the distances of everything reachable from it −∞, because you can go around once more. Negative cycles that aren't reachable don't matter. Without negative cycles, shortest paths are <b>simple</b>, so they have at most V − 1 edges.</p>`,
   kid: 'Every road has a travel time. If a loop of roads had a negative total time (a time machine!), you could drive around it forever and the "fastest" route would be infinitely fast.',
   check: ['If a negative-weight cycle is reachable from s, the distances to vertices reachable from that cycle are…', ['−∞ (undefined)', '0', 'unchanged', '∞'], 'Going around the cycle again always lowers the cost.']},
  {h: 'Optimal substructure, relaxation and its properties', clips: [['S7rzpWwICo8', 'Optimal substructure', 'Shortest path properties']],
   body: `<pre><code>INITIALIZE-SINGLE-SOURCE(G, s):  v.d = ∞, v.π = NIL for all v;  s.d = 0
RELAX(u, v, w):  if v.d > u.d + w(u, v)
                     v.d = u.d + w(u, v);  v.π = u</code></pre><ul><li><b>Optimal substructure:</b> subpaths of shortest paths are shortest paths (cut-and-paste).</li><li><b>Triangle inequality:</b> δ(s, v) ≤ δ(s, u) + w(u, v).</li><li><b>Upper bound:</b> v.d ≥ δ(s, v) always, and once equal it never changes.</li><li><b>No-path:</b> if v is unreachable, v.d stays ∞.</li><li><b>Convergence:</b> if u.d = δ(s, u) and (u, v) is the last edge of a shortest path, relaxing it gives v.d = δ(s, v).</li><li><b>Path relaxation:</b> relaxing the edges of a shortest path <i>in order</i>, even with other relaxations mixed in, gives the correct d at the end.</li></ul><p>Every algorithm in this unit is "relax edges in a clever order."</p>`,
   kid: 'Relax a road: "Is going through this road faster than my current best guess? Then update my guess." Every shortest-path robot just relaxes roads in a smart order.',
   check: ['RELAX(u, v, w) updates v when…', ['v.d > u.d + w(u, v)', 'v.d < u.d + w(u, v)', 'w(u, v) < 0', 'u.d > v.d'], 'The route through u is strictly shorter than v\'s current estimate.']},
  {h: 'Bellman-Ford and its |V| − 1 lemma', clips: [['4Iy0RalrsXo', 'BellmanFord', 'correctness']], viz: 'sssp',
   body: `<pre><code>BELLMAN-FORD(G, w, s)
  INITIALIZE-SINGLE-SOURCE(G, s)
  for i = 1 to |G.V| − 1
      for each edge (u, v) ∈ G.E: RELAX(u, v, w)
  for each edge (u, v) ∈ G.E
      if v.d > u.d + w(u, v): return FALSE   // negative cycle
  return TRUE</code></pre><p>The cost is <b>Θ(VE)</b>.</p><p><b>Lemma:</b> after pass i, v.d ≤ the weight of every s ⇝ v path with at most i edges. Prove it by induction on i: the last edge of an i-edge path gets relaxed in pass i, after its prefix was bounded in pass i − 1. A shortest simple path has ≤ V − 1 edges, so V − 1 passes suffice (this is path relaxation).</p><p><b>Negative-cycle check:</b> if some edge can still be relaxed, summing around the cycle gives a contradiction unless the cycle's weight is negative. <b>Early exit:</b> if a full pass changes nothing, stop. That's this unit's first generated test.</p><p><b>Trace (CLRS):</b> s 0, t 2, x 4, y 7, z −2, returning TRUE.</p>`,
   kid: 'Bellman-Ford fixes every road\'s guess, over and over, (number of towns − 1) times. If a guess can still improve after that, there\'s a time-machine loop somewhere.',
   check: ['Bellman-Ford makes how many relaxation passes before the negative-cycle check?', ['|V| − 1', '|V|', '|E|', 'lg V'], 'A shortest simple path has at most |V| − 1 edges.']},
  {h: 'Shortest paths in a DAG', clips: [['4Iy0RalrsXo', 'DAG Example']],
   body: `<pre><code>DAG-SHORTEST-PATHS(G, w, s)
  topologically sort G
  INITIALIZE-SINGLE-SOURCE(G, s)
  for each u in topological order
      for each v ∈ G.Adj[u]: RELAX(u, v, w)</code></pre><p>The cost is <b>Θ(V + E)</b>, and negative weights are fine because a DAG has no cycles. <b>Why it's correct:</b> every path appears in topological order, so its edges are relaxed in order, which is the path-relaxation property. Each edge is relaxed exactly once.</p><p><b>Longest paths</b> in a DAG (critical-path or PERT scheduling): negate the weights, or initialize to −∞ and relax with &lt;. That's this unit's third generated test. In general graphs, the longest simple path is NP-hard.</p>`,
   kid: 'With no loops, just do the roads in "before and after" order once each. Every road\'s starting point is already finished when you get to it.',
   check: ['DAG-SHORTEST-PATHS with negative edge weights…', ['works, in Θ(V + E)', 'fails because of the negative edges', 'needs Bellman-Ford', 'needs Dijkstra'], 'No cycles means no negative cycles; topological order relaxes every path in order.']},
  {h: 'Dijkstra\'s algorithm (and how it differs from Prim)', clips: [['0wfNtfhHlqE', 'Introduction to Dijkstra', 'Example Execution']],
   body: `<pre><code>DIJKSTRA(G, w, s)               // requires w ≥ 0
  INITIALIZE-SINGLE-SOURCE(G, s)
  S = ∅;  Q = G.V                  // min-priority queue keyed on d
  while Q ≠ ∅
      u = EXTRACT-MIN(Q);  S = S ∪ {u}
      for each v ∈ G.Adj[u]
          RELAX(u, v, w)           // plus DECREASE-KEY</code></pre><p>Dijkstra is greedy: settle the closest unsettled vertex, then relax its out-edges. Its structure is identical to Prim's. The only change is the key: <b>Prim uses w(u, v); Dijkstra uses u.d + w(u, v)</b>.</p><p><b>Trace (CLRS):</b> the vertices are extracted in the order s, y, z, t, x with final d = 0, 5, 7, 8, 9.</p>`,
   kid: 'Dijkstra always finishes the closest unfinished town next, like ripples that spread by travel time instead of by number of roads.',
   check: ['Dijkstra and Prim have the same structure. The difference is…', ['the key: total distance u.d + w(u, v) vs single edge weight w(u, v)', 'Dijkstra uses a stack', 'Prim requires non-negative weights', 'Dijkstra sorts the edges'], 'Everything else (EXTRACT-MIN loop, relax neighbours) is the same.']},
  {h: 'Why Dijkstra is correct, and why negative edges break it', clips: [['0wfNtfhHlqE', 'Negative Weight Issue', 'Complexity and Conclusion']],
   body: `<p><b>Invariant:</b> at the start of each iteration, v.d = δ(s, v) for every v ∈ S.</p><p><b>Proof by contradiction:</b></p><ol><li>Let u be the first vertex added to S with u.d ≠ δ(s, u).</li><li>On a shortest path s ⇝ u, let y be the first vertex not in S, and x its predecessor (x ∈ S, so x.d is correct).</li><li>(x, y) was relaxed, so y.d = δ(s, y) by convergence.</li><li>Since <b>w ≥ 0</b>, δ(s, y) ≤ δ(s, u) ≤ u.d.</li><li>But Dijkstra chose u, so u.d ≤ y.d. Hence everything is equal, and u.d = δ(s, u), a contradiction.</li></ol><p><b>The w ≥ 0 assumption is used exactly in step 4.</b></p><p><b>Counterexample:</b> s→a 2, a→c 1, s→b 4, b→a −3. Dijkstra settles a at 2 and c at 3. The true distance to c is 2, but c is never updated. Adding a constant to every edge does <b>not</b> fix this, because it penalizes paths with more edges. Use Bellman-Ford, or Johnson's reweighting.</p><table class="tbl"><tr><th>Priority queue</th><th>Time</th></tr><tr><td>binary heap</td><td>O((V + E) lg V)</td></tr><tr><td>Fibonacci heap</td><td>O(V lg V + E)</td></tr><tr><td>array (dense graphs)</td><td>Θ(V²)</td></tr></table>`,
   kid: 'Dijkstra promises "once I finish a town, its time is final." A negative road could make a later route cheaper, and that breaks the promise.',
   check: ['Why can\'t you fix negative edges for Dijkstra by adding a constant to every edge?', ['It penalizes paths with more edges, changing which path is shortest', 'It makes the graph cyclic', 'Dijkstra rejects positive weights', 'It is too slow'], 'A path with k edges grows by k·c, so different paths shift by different amounts.']},
  {h: 'Difference constraints: Bellman-Ford as a solver (extra, MIT 18)',
   body: `<p>A system of constraints of the form xⱼ − xᵢ ≤ b<sub>k</sub> can be solved with shortest paths. Make a vertex per variable and an edge i → j with weight b<sub>k</sub> for each constraint, plus a source s with 0-weight edges to every vertex. Run Bellman-Ford from s:</p><ul><li>If it finds a <b>negative cycle</b>, the system is <b>infeasible</b>.</li><li>Otherwise xᵢ = δ(s, i) is a solution, because the triangle inequality δ(s, j) ≤ δ(s, i) + b<sub>k</sub> is exactly the constraint.</li></ul><p>This is CLRS 22.4. It's also the same "super-source + Bellman-Ford" trick that Johnson's algorithm uses in Unit 8.</p>`,
   kid: 'Rules like "x can be at most 3 more than y" become roads with lengths. If the roads form a time-machine loop, the rules can\'t all be true at once.',
   check: ['In the constraint graph, Bellman-Ford finds a negative cycle. The difference-constraint system is…', ['infeasible', 'feasible with all x = 0', 'feasible with x = δ', 'undefined'], 'Summing the constraints around the cycle gives 0 ≤ (negative number).']}
 ]},

{id: 'apsp', topics: ['t19'], title: 'All-Pairs Shortest Paths', notes: 'Topic 19', reading: 'CLRS 4e Ch 23',
 extra: [['Sygq1e0xWnM', 'All-pairs shortest paths', 'Improved matrix squaring'], ['Sygq1e0xWnM', 'Floyd-Warshall algorithm', 'Johnson\'s algorithm']],
 lessons: [
  {h: 'The problem and the brute-force options', clips: [['Ku24z4v9YF8']],
   body: `<p>Compute δ(u, v) for every pair. The output is a V × V matrix. The obvious approach is to run a single-source algorithm from each vertex:</p><table class="tbl"><tr><th>Method</th><th>Time</th><th>Notes</th></tr><tr><td>V × Dijkstra (binary heap)</td><td>O(VE lg V)</td><td>w ≥ 0 only</td></tr><tr><td>V × Dijkstra (Fibonacci heap)</td><td>O(V² lg V + VE)</td><td>w ≥ 0 only</td></tr><tr><td>V × Bellman-Ford</td><td>O(V² E), up to O(V⁴)</td><td>negative edges OK</td></tr><tr><td>V × BFS</td><td>Θ(V(V + E))</td><td>unweighted</td></tr></table><p>The two dedicated algorithms are <b>Floyd-Warshall</b>, Θ(V³) (best for dense graphs, negative edges OK), and <b>Johnson's</b> algorithm, O(V² lg V + VE) (best for sparse graphs with negative edges).</p>`,
   kid: 'Instead of the fastest trip from one town, we want a whole chart of the fastest trip between every pair of towns.',
   check: ['Running Dijkstra from every vertex is valid only when…', ['all edge weights are non-negative', 'the graph is a DAG', 'the graph is dense', 'there are negative edges but no negative cycles'], 'Each Dijkstra run needs w ≥ 0; Johnson reweights to get there.']},
  {h: 'The matrix-multiplication method', clips: [['dzf7x5Z8Ui8', 'Dynamic programming basics', 'Matrix multiplication']],
   body: `<p>Let l<sup>(m)</sup><sub>ij</sub> be the shortest i ⇝ j weight using <b>at most m edges</b>. Then</p><p class="math" style="text-align:center">l<sup>(m)</sup><sub>ij</sub> = min over k of ( l<sup>(m−1)</sup><sub>ik</sub> + w<sub>kj</sub> )</p><p>This looks like matrix multiplication with (min, +) in place of (+, ·). Computing L<sup>(1)</sup>, L<sup>(2)</sup>, …, L<sup>(n−1)</sup> one edge at a time costs Θ(V⁴).</p><p><b>Repeated squaring</b> (L<sup>(2m)</sup> = L<sup>(m)</sup> ⊗ L<sup>(m)</sup>) reaches m ≥ n − 1 in ⌈lg(n − 1)⌉ products, so <b>Θ(V³ lg V)</b>. It still loses to Floyd-Warshall, but it shows how the DP builds up path lengths.</p>`,
   kid: 'First find the best trips using 1 road, then 2 roads, then 4 roads, doubling each time, like matrix multiplication with "min" and "+".',
   check: ['All-pairs shortest paths by repeated squaring of the min-plus product takes…', ['Θ(V³ lg V)', 'Θ(V³)', 'Θ(V⁴)', 'Θ(V² lg V)'], 'lg V squarings, each Θ(V³).']},
  {h: 'Floyd-Warshall: the k-intermediate DP', clips: [['dzf7x5Z8Ui8', 'Floyd-Warshall approach', 'Trace example']], viz: 'fw',
   body: `<p>Define d<sup>(k)</sup><sub>ij</sub> = the shortest i ⇝ j path whose <b>intermediate</b> vertices all lie in {1, …, k}. Such a path either avoids k, or uses it exactly once (simple paths don't repeat vertices):</p><p class="math" style="text-align:center">d<sup>(k)</sup><sub>ij</sub> = min( d<sup>(k−1)</sup><sub>ij</sub>, d<sup>(k−1)</sup><sub>ik</sub> + d<sup>(k−1)</sup><sub>kj</sub> )</p><pre><code>FLOYD-WARSHALL(W, n)
  D = W
  for k = 1 to n                 // k MUST be the outer loop
      for i = 1 to n
          for j = 1 to n
              D[i, j] = min(D[i, j], D[i, k] + D[k, j])
  return D</code></pre><ul><li>The cost is <b>Θ(n³)</b> time and <b>Θ(n²)</b> space if you update in place. In-place is safe because row k and column k don't change during round k (d<sub>kk</sub> = 0).</li><li>Negative edges are fine. A negative diagonal entry d<sub>ii</sub> &lt; 0 means a negative cycle.</li><li><b>Paths:</b> keep a predecessor matrix (π<sub>ij</sub> = π<sub>kj</sub> when the route through k wins) or a next-hop matrix (next<sub>ij</sub> = next<sub>ik</sub>). That's this unit's generated test.</li></ul>`,
   kid: 'Ask, for every pair of towns: "is it faster if I\'m allowed to stop in town k?" Do that for k = 1, then 2, then 3. The chart updates in place.',
   check: ['In Floyd-Warshall, which loop must be outermost?', ['the intermediate vertex k', 'the source i', 'the destination j', 'any order works'], 'Round k may only use paths whose intermediates are in {1..k−1}, all already computed.']},
  {h: 'Transitive closure', clips: [['dzf7x5Z8Ui8', 'Transitive closure']],
   body: `<p>If we only need to know <b>whether</b> j is reachable from i, run Floyd-Warshall on booleans, with OR in place of min and AND in place of +:</p><p class="math" style="text-align:center">t<sup>(k)</sup><sub>ij</sub> = t<sup>(k−1)</sup><sub>ij</sub> ∨ ( t<sup>(k−1)</sup><sub>ik</sub> ∧ t<sup>(k−1)</sup><sub>kj</sub> )</p><p>Initialize t<sub>ij</sub> = 1 if i = j or (i, j) ∈ E. That's still Θ(n³), but with 1-bit entries and very cheap operations. An alternative is BFS or DFS from every vertex, Θ(V(V + E)), which is better for sparse graphs.</p>`,
   kid: 'Same chart trick, but every box just says yes or no: "can I get there at all?"',
   check: ['The transitive-closure version of Floyd-Warshall replaces min and + with…', ['OR and AND', 'AND and OR', 'max and ×', 'XOR and +'], 't_ij = t_ij OR (t_ik AND t_kj).']},
  {h: 'Johnson\'s algorithm: reweighting', clips: [['z0reAeK4kl0', 'Reweighting lemma and proof', 'Johnson\'s insight'], ['z0reAeK4kl0', 'Algorithm steps and runtime']],
   body: `<ol><li>Add a new vertex s with a 0-weight edge to every vertex. Run Bellman-Ford from s to get <b>h(v) = δ(s, v)</b>, or report a negative cycle.</li><li>Reweight: <b>ŵ(u, v) = w(u, v) + h(u) − h(v)</b>.</li><li>Run Dijkstra from every vertex using ŵ. Convert back: <b>δ(u, v) = δ̂(u, v) − h(u) + h(v)</b>.</li></ol><ul><li><b>Lemma 1 (ŵ ≥ 0):</b> by the triangle inequality, h(v) ≤ h(u) + w(u, v).</li><li><b>Lemma 2 (paths preserved):</b> for any path P from u to v, ŵ(P) = w(P) + h(u) − h(v), because the h terms <b>telescope</b>. Every u ⇝ v path shifts by the same amount, so the shortest paths stay shortest. Negative cycles stay negative.</li></ul><p>The cost is one Bellman-Ford, O(VE), plus V Dijkstras: <b>O(V² lg V + VE)</b> with a Fibonacci heap, or O(VE lg V) with a binary heap.</p><table class="tbl"><tr><th>Graph</th><th>Choose</th></tr><tr><td>dense, any weights</td><td>Floyd-Warshall</td></tr><tr><td>sparse, negative edges</td><td>Johnson</td></tr><tr><td>sparse, non-negative</td><td>V × Dijkstra</td></tr><tr><td>unweighted</td><td>V × BFS</td></tr></table>`,
   kid: 'Shift every road time with a per-town "height" so no road is negative, run the fast Dijkstra robot from every town, then shift the answers back. Every route between the same two towns shifts by the same amount, so the winner never changes.',
   check: ['Why does Johnson\'s reweighting preserve shortest paths?', ['Every u ⇝ v path changes by the same amount h(u) − h(v)', 'All weights become 0', 'Bellman-Ford sorts the edges', 'Dijkstra ignores the weights'], 'The h terms telescope along any path.']}
 ]}
];

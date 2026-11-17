// ======================= WEEKS 7–11: EXERCISE-INSPIRED PRACTICE =======================
// Modeled on the professor's Exercise 11–18 solution sets: stable/radix sorts
// (Ex 11), recursive backtracking (Ex 12), dynamic programming (Ex 13),
// greedy algorithms (Ex 15), graph representations (Ex 16), SCC & topological
// sort (Ex 17), and MST algorithms (Ex 18). Loaded after course-w1-6.js.

// ======================= MULTIPLE CHOICE =======================
MC.push(
 // ---- t12s: Backtracking (Exercise 12) ----
 {topic:'t12s', q:'<code>CUT-STICK(0)</code> returns 1 because…',
  options:['the empty stick has exactly one "cut" — leave it uncut','zero sticks can be made','the loop body never runs, so count stays 0','it is an error case'], answer:0,
  explain:'Base case: there is exactly one way to cut a stick of length 0 — do nothing. This seeds the count.'},
 {topic:'t12s', q:'<code>CUT-STICK(n)</code> counts compositions of n into positive parts, so it returns:',
  options:['2^(n−1)','2^n','n!','n²'], answer:0,
  explain:'Each of the n−1 gaps between units is independently "cut or not" → 2^(n−1) compositions (for n = 3: 4 ways, matching the example).'},
 {topic:'t12s', q:'The running time of <code>CUT-STICK</code> is Θ(2^n) because…',
  options:['the recurrence T(n) = Σ T(n−i) + Θ(n) unrolls to c(2^(n+1) − 1)','the for-loop runs n times','each call scans the stick','recursion depth is n'], answer:0,
  explain:'Unrolling gives T(0)=c, T(1)=3c, T(2)=7c, T(3)=15c — coefficients one less than powers of 2; substitution proves T(n) = c(2^(n+1) − 1).'},
 {topic:'t12s', q:'Why is <code>CUT-STICK</code> exponential rather than quadratic? It recomputes…',
  options:['overlapping subproblems with no memoization — T(n−1), T(n−2), … each expand fully','the same loop twice','n recursive calls per level','the input twice'], answer:0,
  explain:'Every suffix length is reached many times through different first-piece choices; nothing is stored, so the recursion tree has exponentially many nodes.'},
 {topic:'t12s', q:'A binary tree is <b>perfect</b> when…',
  options:['every internal node has two children and all leaves have the same depth','it is complete and balanced by height only','every node has exactly two children','it has 2^h − 1 nodes for some h'], answer:0,
  explain:'Both conditions are required: full (two children each) AND all leaves at equal depth — Exercise 12 defines it this way.'},
 {topic:'t12s', q:'To find the largest perfect subtree, a node v is the root of a perfect subtree iff…',
  options:['both subtrees are perfect with equal height','its left subtree is perfect','its height exceeds its children\'s','either child is a leaf'], answer:0,
  explain:'A post-order check: compute each subtree\'s height; v is perfect-root iff height(left) = height(right) ≥ 0 and both sides are perfect — track the max depth seen.'},

 // ---- t10b: Lower bounds & O(n) sorts (Exercise 11) ----
 {topic:'t10b', q:'A sorting algorithm is <b>stable</b> if…',
  options:['equal elements keep their original relative order','it runs in O(n) time','it uses no extra memory','it sorts in place'], answer:0,
  explain:'Stability only constrains ties — merge sort and insertion sort are stable; quicksort and heapsort generally are not.'},
 {topic:'t10b', q:'The generic way to make ANY sorting algorithm stable is to…',
  options:['decorate each element with its original index and break ties by index (lexicographic order)','run it twice','sort a copy backwards','use a stable auxiliary sort'], answer:0,
  explain:'Store pairs (value, index); compare values first, indices on ties. Costs one extra comparison per comparison and n extra words.'},
 {topic:'t10b', q:'Stabilizing by index costs how much extra space?',
  options:['n words (indices 1..n fit in log n bits each → n log n bits)','O(1)','O(n log n) words','a second copy of the array'], answer:0,
  explain:'One index per element — n words total, i.e. n log n bits. Time stays Θ(n log n): at most one extra comparison per original comparison.'},
 {topic:'t10b', q:'LSD radix sort must process digit positions…',
  options:['least significant digit first, each pass stable','most significant digit first, each pass unstable','in any order, since passes are independent','only the last digit'], answer:0,
  explain:'Processing LSD→MSD with stable passes means each pass preserves the order established by less-significant digits — that is the whole correctness argument.'},
 {topic:'t10b', q:'The radix-sort loop invariant is:',
  options:['after pass i, elements are sorted by their i low-order digits','after pass i, elements are fully sorted','elements are sorted by the most significant digit','the array is partitioned by digit value'], answer:0,
  explain:'Each stable pass on digit i preserves the ordering by digits 1..i−1 while sorting digit i — induction over i gives full sort after d passes.'},
 {topic:'t10b', q:'Where does the radix-sort proof rely on stability?',
  options:['the case aᵢ = bᵢ: the i-th-digit sort must not disturb the order already established by lower digits','the initialization step','the final merge','computing digit values'], answer:0,
  explain:'When the current digits tie, the correct order is decided by lower-order digits — only a stable sort preserves it.'},
 {topic:'t10b', q:'COUNTING-SORT on keys in {0,…,k−1} runs in:',
  options:['Θ(n + k)','Θ(n log n)','Θ(k log k)','Θ(n·k)'], answer:0,
  explain:'One pass to count, one for prefix sums, one to place — linear in input plus key range. O(n) when k = O(n).'},
 {topic:'t10b', q:'Why can counting/radix sort beat the Ω(n log n) comparison lower bound?',
  options:['they are not comparison-based — they exploit integer key structure directly','they use more memory','they are randomized','the bound only applies to worst case'], answer:0,
  explain:'The decision-tree bound counts comparisons only. Non-comparison sorts sidestep it entirely — same reason hash tables get O(1) expected lookup.'},

 // ---- t13: Greedy (Exercise 15) ----
 {topic:'t13', q:'The activity-selection greedy rule that IS provably optimal is:',
  options:['repeatedly pick the compatible activity with the earliest finish time','pick the shortest-duration activity','pick the activity with the latest start','pick the one overlapping fewest others'], answer:0,
  explain:'Earliest finish leaves maximum room — CLRS §16.1 proves the greedy-choice property by exchange argument.'},
 {topic:'t13', q:'Why does earliest-finish work? Intuitively it…',
  options:['leaves the most remaining time for other activities','minimizes total duration','maximizes overlap','uses the fewest activities'], answer:0,
  explain:'Any optimal solution using a later-finishing first activity can swap in the earliest-finishing one without losing compatibility — the exchange argument.'},
 {topic:'t13', q:'"Pick the compatible activity with least duration" fails because…',
  options:['a short activity can block two longer non-overlapping ones — counterexample exists','durations are not comparable','it needs sorting first','it is actually optimal'], answer:0,
  explain:'Exercise 15 Q1: a1 (short) overlaps both a2 and a3; greedy picks 1 activity, optimal picks 2.'},
 {topic:'t13', q:'"Pick the compatible activity with latest start time"…',
  options:['IS optimal — it is earliest-finish run on the reversed timeline','is not optimal','needs a counterexample','works only for unit durations'], answer:0,
  explain:'Reverse time (swap start↔finish, earlier↔later) and the CLRS proof applies verbatim — Exercise 15 Q2.'},
 {topic:'t13', q:'"Pick the activity overlapping fewest others" fails — the exercise\'s counterexample has…',
  options:['a1 overlapping only 2 activities while the optimal 4-activity solution requires skipping it','all activities overlapping equally','a cycle in the interval graph','negative durations'], answer:0,
  explain:'a1 is locally minimal (2 overlaps) but choosing it destroys compatibility needed for a2, a3, a10, a11 — greedy gets 3, optimal gets 4.'},
 {topic:'t13', q:'When activities have different revenues (weighted interval scheduling), the problem…',
  options:['loses the greedy-choice property — use dynamic programming instead','is still solved by earliest finish','is solved by latest start','becomes NP-complete'], answer:0,
  explain:'Exercise 15 Q4: no local choice is provably safe when weights differ; DP over sorted-by-finish activities solves it in O(n²) or O(n log n).'},

 // ---- t14a: Graph representations (Exercise 16) ----
 {topic:'t14a', q:'Transposing an adjacency <b>matrix</b> in place takes…',
  options:['O(V²) time, O(1) extra space — swap A[i][j] ↔ A[j][i] below the diagonal','O(V+E) time, O(V) space','O(E) time, O(1) space','O(V²) time, O(V²) space'], answer:0,
  explain:'Only the (V²−V)/2 pairs below the diagonal need swapping; one temp variable suffices — Exercise 16 Q1.'},
 {topic:'t14a', q:'The famous "one bit" transpose trick stores…',
  options:['a flag saying whether the graph is currently transposed; every accessor checks and flips endpoints','one edge at a time','a parity bit per vertex','a compressed adjacency list'], answer:0,
  explain:'transposeGraph() flips the bit in O(1); getEdge(i,j) reads A[j][i] when set. All methods pay only a constant-factor check — Exercise 16 Q2.'},
 {topic:'t14a', q:'Transposing an <b>edge list</b> is…',
  options:['swap each (u,v) to (v,u) in place — O(E) time, O(1) space, simplest of all','impossible without copying','O(V+E) with a hash table','O(V²)'], answer:0,
  explain:'Edges are stored sequentially; reversing endpoints is O(1) per edge. Downside: edge lists are poor for most other operations — Exercise 16 Q4.'},
 {topic:'t14a', q:'Why can\'t adjacency <b>lists</b> use the matrix-style swap trick?',
  options:['there is no O(1) "is (i,j) an edge" access — you must search i\'s list','lists are immutable','they store edges twice','swapping would break sorting'], answer:0,
  explain:'Matrix transpose exploits random access to A[i][j]; lists give only sequential neighbor access, so every approach needs Ω(E) extra space or a copy — Exercise 16 Q3.'},
 {topic:'t14a', q:'The best adjacency-list transpose (plan C) works by…',
  options:['copying while deleting old edges — peaks at O(V) extra space instead of O(E)','reversing edges in place with a hash set of done-edges','the one-bit flag trick','building the transpose from scratch'], answer:0,
  explain:'Copy each reversed edge to a new list and delete the original as you go — new edges created ≈ old edges deleted, so live extra space stays O(V).'},
 {topic:'t14a', q:'BFS on an unweighted graph finds shortest paths because…',
  options:['it explores in order of distance from the source — first visit IS shortest','it uses a stack','it sorts neighbors by weight','it runs DFS underneath'], answer:0,
  explain:'The queue processes vertices level by level; the first time v is dequeued, its distance is minimal — unweighted edges all cost 1.'},

 // ---- t14b: Topological sort & SCC (Exercise 17) ----
 {topic:'t14b', q:'Topological sort via DFS outputs vertices in order of…',
  options:['decreasing finish time','decreasing discovery time','increasing degree','alphabetical order'], answer:0,
  explain:'CLRS: a vertex finished later cannot be a descendant of one finished earlier in a DAG — reversing finish order gives a valid topo order.'},
 {topic:'t14b', q:'Kahn\'s algorithm (repeatedly remove in-degree-0 vertices) runs in…',
  options:['O(V + E) with adjacency lists','O(V²)','O(E log V)','O(V·E)'], answer:0,
  explain:'Each vertex enters the queue once (in-degree hits 0 once, then set to −1); each edge is scanned once when its tail is dequeued — Exercise 17 Q2.'},
 {topic:'t14b', q:'If Kahn\'s algorithm finishes with vertices still having in-degree > 0, the graph…',
  options:['contains a cycle — no topological order exists','is disconnected','is not a DAG for another reason','has a self-loop only'], answer:0,
  explain:'Every DAG has a source; leftover positive in-degree means every remaining vertex has an incoming edge — following them cycles.'},
 {topic:'t14b', q:'Kosaraju\'s SCC algorithm runs DFS twice: first on G, then on…',
  options:['the transpose Gᵀ, processing vertices in decreasing finish time','G again in increasing finish time','the complement graph','each SCC separately'], answer:0,
  explain:'Finish times from pass 1 give a topo order of the SCC condensation; DFS on Gᵀ in that order makes each tree exactly one SCC — O(V+E) total.'},
 {topic:'t14b', q:'In the transpose-graph DFS (Kosaraju pass 2), each DFS tree corresponds to…',
  options:['exactly one strongly connected component','one weakly connected component','one topological level','one back edge'], answer:0,
  explain:'The decreasing-finish-time order ensures you start each SCC\'s "sink" component first; the tree can\'t escape to an earlier-processed SCC in Gᵀ.'},
 {topic:'t14b', q:'Exercise 17\'s DFS table practice is mainly testing whether you can…',
  options:['compute d, f, and π consistently — parent is whoever discovers you first','balance the recursion','choose visit order cleverly','skip the transpose'], answer:0,
  explain:'d = discovery counter, f = finish counter, π = discoverer. Alphabetical order is specified precisely so everyone gets the same table — the skill is mechanical consistency.'},

 // ---- t12a: DP — party planning (Exercise 13) ----
 {topic:'t12a', q:'In party planning, the memo state memo[v][t] must record…',
  options:['the best fun achievable in v\'s subtree given whether v is included (t ∈ {0,1})','just the fun rating of v','the guest list itself','the depth of v'], answer:0,
  explain:'Two states per node — include or exclude — because the constraint couples a node to its parent\'s choice.'},
 {topic:'t12a', q:'If employee v IS invited, the optimal subproblem forces…',
  options:['both children excluded — fun-helper(child, false)','both children included','children chosen independently','the parent excluded'], answer:0,
  explain:'The rule "no employee with their supervisor" means including v forbids v.left and v.right — their subtrees still optimize freely below them.'},
 {topic:'t12a', q:'If v is NOT invited, each child contributes…',
  options:['max(memo[child][0], memo[child][1]) — independently optimal','memo[child][0] only','memo[child][1] only','zero'], answer:0,
  explain:'With v excluded, left and right subtrees decouple; each takes whichever state scores higher.'},
 {topic:'t12a', q:'The memoized party-fun algorithm runs in…',
  options:['O(n) — at most 2 states per node, n nodes','O(n²)','O(2ⁿ)','O(n log n)'], answer:0,
  explain:'Brute force tries 2 choices per node → exponential; memoization collapses it to 2n subproblems of O(1) work each. The president must be included → answer memo[root][1].'},

 // ---- t12b: DP — LPS (Exercise 13) ----
 {topic:'t12b', q:'For LPS, when X[i] = X[j] the recurrence is:',
  options:['p[i][j] = 2 + p[i+1][j−1]','p[i][j] = 1 + p[i+1][j−1]','p[i][j] = max(p[i+1][j], p[i][j−1])','p[i][j] = p[i+1][j−1]'], answer:0,
  explain:'Matching endpoints contribute both characters plus the best palindrome strictly inside — Exercise 13.'},
 {topic:'t12b', q:'When X[i] ≠ X[j], p[i][j] =',
  options:['max(p[i+1][j], p[i][j−1])','p[i+1][j−1] + 1','min of the two neighbors','0'], answer:0,
  explain:'The optimal palindrome excludes at least one endpoint — try dropping i or dropping j and keep the better.'},
 {topic:'t12b', q:'The bottom-up LPS fill order is by…',
  options:['increasing substring length (diagonals of the table)','row by row top to bottom','column by column','reverse diagonals'], answer:0,
  explain:'p[i][j] depends on p[i+1][j−1], p[i+1][j], p[i][j−1] — all on earlier diagonals. Fill p[i][i]=1, p[i][i+1], then diagonals 3..n.'},
 {topic:'t12b', q:'LPS-iterative runs in…',
  options:['Θ(n²) time and Θ(n²) space','Θ(n log n)','Θ(n)','Θ(n³)'], answer:0,
  explain:'The table has n(n+1)/2 relevant entries, each O(1) — the exercise sums the diagonal counts to get n(n+1)/2.'},
 {topic:'t12b', q:'Why does optimal substructure hold for LPS? If the optimal Z\'s inner part weren\'t optimal for X[i+1..j−1], you could…',
  options:['replace it with a longer palindrome and contradict optimality of Z','not — subproblems are independent','swap the endpoints','reduce n'], answer:0,
  explain:'The exchange argument: any improvable sub-solution yields a strictly longer palindrome for the whole string — so Z must contain optimal sub-solutions.'},

 // ---- mst/kruskal: MST algorithms (Exercise 18) ----
 {topic:'mst', q:'Maybe-MST-A (sort edges DESCENDING, delete any edge whose removal keeps G connected) IS a correct MST algorithm because…',
  options:['it is reverse-delete: removing the heaviest redundant edge can never hurt — a cut argument proves minimality','it sorts the edges','it always removes the last edge','it is Kruskal backwards'], answer:0,
  explain:'Exercise 18 Q1: when T−{e} stays connected, e is the unique heaviest crossing some cut — removing it is safe, like adding the lightest.'},
 {topic:'mst', q:'Maybe-MST-B (add edges in ARBITRARY order if no cycle forms) fails because…',
  options:['it ignores weights entirely — a triangle picks two heavy edges first','it is too slow','it needs sorting','it only works on trees'], answer:0,
  explain:'Counterexample: triangle where the two heaviest edges are processed first → a spanning tree of non-minimum weight. It builds A tree, not THE minimum one.'},
 {topic:'mst', q:'Maybe-MST-C (add each edge; if it creates a cycle, remove the cycle\'s MAX-weight edge) is correct by the…',
  options:['safe edge removal theorem: on a single cycle, dropping the heaviest edge gives the min-weight forest','cut property','loop invariant only','exchange argument'], answer:0,
  explain:'Exercise 18 Q3: one cycle needs exactly one edge removed; removing anything but the max leaves a heavier forest. The MSF loop invariant carries it through all edges.'},
 {topic:'mst', q:'The loop invariant proving Maybe-MST-C correct states that after processing e₁..eᵢ, T is…',
  options:['the minimum spanning FOREST of the graph formed by just those edges','a spanning tree of G','the MST of G','a connected graph'], answer:0,
  explain:'Induction on edges examined: init = empty forest; maintenance = safe-edge-removal on the ≤1 new cycle; termination = MSF of all of G = MST since G is connected.'},
 {topic:'mst', q:'Detecting whether adding edge e creates a cycle can be done in…',
  options:['O(V + E) via DFS, exiting early on a back edge','O(1) with union-find only','O(E) always','O(V²)'], answer:0,
  explain:'DFS from e\'s endpoint finds a back edge iff a cycle exists — Exercise 18 Q4(b). Union-find cannot answer this for edge REMOVAL algorithms.'}
);

// ======================= PSEUDOCODE CHALLENGES =======================
CODE.push(
 {id:'cut-stick', topic:'t12s', title:'CUT-STICK — counting compositions',
  prompt:'Write <code>CUT-STICK(n)</code> returning the number of ways to cut a stick of length n into integral pieces (order matters; n = 0 → 1 way). Try every first-piece length i = 1..n and sum the recursive counts.',
  starter:'CUT-STICK(n)\n    if n == 0\n        return \n    count = 0\n    for i = 1 to n\n        \n    return count\n', define:['cutstick'], call:[], maxLoop:1,
  correctness:[
   {label:'Base case n = 0 returns 1', w:3, test:t=>/n\s*==\s*0|n\s*=\s*0/.test(t) && /return\s+1\b/.test(t), hint:'if n == 0 return 1'},
   {label:'Loops i from 1 to n', w:2, test:t=>/for[\s\S]{0,80}\bto\s+n\b|for\s*\(\s*\w+\s*=\s*1/.test(t), hint:'for i = 1 to n'},
   {label:'Recurses on the remaining length n − i', w:3, test:(t,P)=>{const b=P.body('cutstick'); return /cut-?stick\s*\([^)]*-\s*i/.test(b) || /cut-?stick\s*\([^)]*n\s*-\s*\w+/.test(b);}, hint:'count += CUT-STICK(n - i)'},
   {label:'Accumulates into a count variable', w:2, test:t=>/count\s*(\+?=)|\+=/.test(t), hint:'count = count + CUT-STICK(n - i)'},
   {label:'Returns the count', w:1, test:t=>/return\s+count/.test(t), hint:'return count'}
  ],
  efficiency:[
   {label:'Single loop with one recursive call per iteration', w:5, test:(t,P)=>P.maxLoop<=1, hint:'Exponential time is expected — the exercise analyzes it, not avoids it.'}
  ],
  penalties:[{label:'Missing the n = 0 base case', p:3, test:(t,P)=>!/n\s*==\s*0|n\s*=\s*0/.test(P.body('cutstick')), hint:'Without n = 0 → 1 the recursion never bottoms out.'}],
  model:`CUT-STICK(n)
    // returns the number of compositions of n (order matters)
    // invariant: count = sum over first-piece lengths tried so far
    if n == 0
        return 1                    // one way: leave it uncut
    count = 0
    for i = 1 to n                 // first piece has length i; i = n means "no cut"
        count = count + CUT-STICK(n - i)
    return count`},

 {id:'activity-select', topic:'t13', title:'ACTIVITY-SELECT — earliest finish first',
  prompt:'Write <code>ACTIVITY-SELECT(A)</code> returning the maximum number of non-overlapping activities. Each activity has start s and finish f; sort by finish time, then greedily accept any activity whose start is ≥ the last accepted finish.',
  starter:'ACTIVITY-SELECT(A)\n    // A = list of (start, finish) activities\n    sort A by finish time\n    count = 0\n    lastFinish = \n    for each activity a in A\n        if a.start >= lastFinish\n            \n    return count\n', define:['activityselect'], call:[], maxLoop:1,
  correctness:[
   {label:'Sorts activities by finish time', w:3, test:t=>/sort[^\n]*(finish|f\b|end)|finish[^\n]*sort/.test(t), hint:'sort A by finish time (nondecreasing f)'},
   {label:'Tracks the last accepted finish', w:2, test:t=>/last(Finish|End|f)|prev(Finish|End)/.test(t), hint:'lastFinish = finish of the last chosen activity'},
   {label:'Accepts only compatible activities (start ≥ lastFinish)', w:3, test:t=>/start[^\n]*>=|>=\s*last|a\.s\s*>=|s\s*>=\s*last/.test(t), hint:'if a.start >= lastFinish'},
   {label:'Increments count on acceptance', w:2, test:t=>/count\s*(\+\+|\+=\s*1|=\s*count\s*\+\s*1)/.test(t), hint:'count = count + 1'},
   {label:'Updates lastFinish to the accepted finish', w:3, test:t=>/last\s*finish\s*=\s*\w*\.?f|lastfinish\s*=\s*\w+\.f/.test(t), hint:'lastFinish = a.finish'}
  ],
  efficiency:[
   {label:'One pass after sorting — O(n log n) total', w:5, test:(t,P)=>P.maxLoop<=1, hint:'Sort dominates; the selection scan is a single loop.'}
  ],
  penalties:[{label:'Selects by duration or start instead of finish', p:3, test:t=>/(duration|shortest|earliest start)/.test(t) && !/finish/.test(t), hint:'The provably optimal key is earliest FINISH time.'}],
  model:`ACTIVITY-SELECT(A)
    // A: array of activities, each with .start and .finish
    // greedy choice property: earliest-finishing compatible activity is safe (CLRS 16.1)
    sort A by finish time                    // nondecreasing .finish
    count = 0
    lastFinish = -infinity                   // nothing scheduled yet
    for each activity a in A
        if a.start >= lastFinish             // compatible with everything chosen so far
            count = count + 1
            lastFinish = a.finish
    return count`},

 {id:'topo-indegree', topic:'t14b', title:'Kahn\'s topological sort — O(V + E)',
  prompt:'Write <code>TOPO-SORT(V, Adj)</code> using Kahn\'s algorithm: compute in-degrees, enqueue all in-degree-0 vertices, then repeatedly dequeue a vertex, print it, and decrement its neighbors\' in-degrees (enqueuing any that reach 0).',
  starter:'TOPO-SORT(V, Adj)\n    // Adj[v] = list of out-neighbors of v\n    for v in V\n        indegree[v] = \n    for v in V\n        for u in Adj[v]\n            \n    Q = new empty queue\n    for v in V\n        if indegree[v] == 0\n            enqueue(Q, v)\n    while Q is not empty\n        v = dequeue(Q)\n        print v\n        for u in Adj[v]\n            \n', define:['toposort'], call:[], maxLoop:2,
  correctness:[
   {label:'Initializes in-degree of every vertex to 0', w:2, test:t=>/indegree|in-?degree|indeg/.test(t) && /=\s*0\b/.test(t), hint:'indegree[v] = 0 for all v'},
   {label:'Counts in-degrees by scanning adjacency lists', w:3, test:t=>/for[\s\S]{0,200}adj[\s\S]{0,200}indegree\[\w+\][^\n]*(\+\+|\+\s*1|=\s*indegree)|indegree\[\w+\][^\n]*(\+\+|\+\s*1|=\s*indegree)/.test(t), hint:'for u in Adj[v]: indegree[u]++'},
   {label:'Enqueues all in-degree-0 vertices', w:2, test:t=>/indegree\[\w+\]\s*==\s*0|indegree\[\w+\]\s*=\s*0/.test(t) && /enqueue/.test(t), hint:'if indegree[v] == 0 enqueue(Q, v)'},
   {label:'Dequeue-print loop over the queue', w:3, test:t=>/while[\s\S]{0,100}(queue|Q)[\s\S]{0,100}dequeue|dequeue[\s\S]{0,80}print/.test(t), hint:'while Q not empty: v = dequeue; print v'},
   {label:'Decrements neighbor in-degree and enqueues at 0', w:4, test:t=>/indegree\[\w+\][^\n]*(--|-=\s*1|-\s*1|=\s*indegree\[\w+\]\s*-)/.test(t) && /enqueue/.test(t) && /==\s*0/.test(t), hint:'indegree[u]--; if indegree[u] == 0 enqueue(Q,u)'}
  ],
  efficiency:[
   {label:'O(V + E) — every vertex enqueued once, every edge scanned once', w:5, test:(t,P)=>P.maxLoop<=2, hint:'Nested loops only for the one-time in-degree count; the main loop is linear.'}
  ],
  penalties:[{label:'Uses DFS finish times instead (valid but not Kahn\'s)', p:1, test:t=>/dfs|finish time|d\[|f\[/.test(t) && !/indegree|in-?degree/.test(t), hint:'This problem specifically wants the in-degree queue method.'}],
  model:`TOPO-SORT(V, Adj)
    // Kahn's algorithm — Exercise 17 Q2, O(V + E)
    // invariant: vertices with indegree 0 are exactly the "sources" ready to print
    for v in V
        indegree[v] = 0
    for v in V                       // count in-degrees: O(V + E)
        for u in Adj[v]
            indegree[u] = indegree[u] + 1
    Q = new empty queue
    for v in V                       // all current sources
        if indegree[v] == 0
            enqueue(Q, v)
    while Q is not empty             // O(V + E): each vertex dequeued once
        v = dequeue(Q)
        print v
        for u in Adj[v]               // each edge examined once
            indegree[u] = indegree[u] - 1
            if indegree[u] == 0
                enqueue(Q, u)
            indegree[u] = -1          // mark processed so it can never re-enter`},

 {id:'transpose-matrix', topic:'t14a', title:'In-place matrix transpose',
  prompt:'Write <code>TRANSPOSE-MATRIX(A, n)</code> swapping A[i][j] ↔ A[j][i] for every pair — iterate only BELOW the main diagonal so each pair is swapped exactly once.',
  starter:'TRANSPOSE-MATRIX(A, n)\n    for i = 2 to n\n        for j = 1 to i - 1\n            \n', define:['transposematrix'], call:[], maxLoop:2,
  correctness:[
   {label:'Outer loop covers rows 2..n (or equivalent below-diagonal range)', w:2, test:t=>/for[\s\S]{0,60}(2\s*to\s*n|1\s*to\s*n\s*-\s*1)/.test(t), hint:'for i = 2 to n'},
   {label:'Inner loop bounded by i − 1 (strictly below diagonal)', w:3, test:t=>/j\s*=\s*1\s*to\s*i\s*-\s*1|to\s*i-1/.test(t), hint:'for j = 1 to i - 1'},
   {label:'Swaps A[i][j] with A[j][i]', w:4, test:t=>/temp|swap|exchange/.test(t) && /a\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]/.test(t) && /a\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]/.test(t), hint:'temp = A[i][j]; A[i][j] = A[j][i]; A[j][i] = temp'},
   {label:'Inner loop stops strictly below the diagonal (j ≤ i−1)', w:3, test:t=>/(to|<|<=)\s*i\s*-\s*1|j\s*<\s*i\b|for\s+j[^\n]*<\s*i/.test(t), hint:'for j = 1 to i - 1 — a full j = 1 to n swaps every pair twice and undoes the transpose.'}
  ],
  efficiency:[
   {label:'O(V²) — visits each off-diagonal pair once', w:5, test:(t,P)=>P.maxLoop===2, hint:'Nested loops over the strict lower triangle.'}
  ],
  penalties:[{label:'Swaps the whole matrix (double-swaps everything back)', p:4, test:(t,P)=>{const b=P.body('transposematrix'); return /for[\s\S]*j\s*=\s*1\s*to\s*n/.test(b) && !/i\s*-\s*1|i-1/.test(b);}, hint:'Full n×n loops swap each pair twice — restrict j to below the diagonal.'}],
  model:`TRANSPOSE-MATRIX(A, n)
    // G^T in place: swap across the main diagonal, each pair once
    // invariant: after processing row i, all pairs (i,j) with j < i are swapped
    for i = 2 to n
        for j = 1 to i - 1
            temp = A[i][j]
            A[i][j] = A[j][i]
            A[j][i] = temp`},

 {id:'party-fun', topic:'t12a', title:'PARTY-FUN — tree DP with include/exclude states',
  prompt:'Write <code>PARTY-FUN(T)</code> and <code>PARTY-HELPER(v, memo)</code> for Giggle\'s party: maximize Σ fun ratings subject to no employee attending with their supervisor; the president (root) MUST attend. Use an n×2 memo table indexed by node id and include-flag (0 = excluded, 1 = included).',
  starter:'PARTY-FUN(T)\n    memo = new [0..n, 0..1] array\n    for v = 0 to n\n        memo[v][0] = -infinity\n        memo[v][1] = -infinity\n    memo[0][0] = 0\n    memo[0][1] = 0\n    PARTY-HELPER(T.root, memo)\n    return memo[T.root.id][1]\n\nPARTY-HELPER(v, memo)\n    if v == NIL\n        return\n    if memo[v.id][0] != -infinity or memo[v.id][1] != -infinity\n        return\n    PARTY-HELPER(v.left, memo)\n    PARTY-HELPER(v.right, memo)\n    // included: children must be EXCLUDED\n    memo[v.id][1] = \n    // excluded: each child picks its better state\n    memo[v.id][0] = \n', define:['partyfun','partyhelper'], call:[], maxLoop:1,
  correctness:[
   {label:'Uses a 2-state memo table (include / exclude)', w:3, test:t=>/memo\s*\[|memo\[/.test(t) && /,\s*0|,\s*1|\[0\]|\[1\]|0\.\.1|0\.\.\.1/.test(t), hint:'memo[v.id][0] and memo[v.id][1]'},
   {label:'Included state adds funRating and forces children excluded (state 0)', w:4, test:t=>/funrating|\bfun\s*\[|fun\(v/.test(t) && /memo\s*\[[^\]]*\]\s*\[\s*0\s*\]|\[\s*0\s*\]/.test(t), hint:'memo[v][1] = funRating[v] + memo[left][0] + memo[right][0]'},
   {label:'Excluded state takes max of each child\'s two states', w:4, test:t=>/max\s*\(/.test(t) && /memo/.test(t), hint:'memo[v][0] = max(memo[l][0],memo[l][1]) + max(memo[r][0],memo[r][1])'},
   {label:'Memoizes / skips already-computed nodes', w:2, test:t=>/-?inf|computed|already/.test(t) || /!=\s*-/.test(t), hint:'if memo[v.id][*] already set, return early'},
   {label:'Returns memo[root][1] — president included', w:2, test:t=>/return\s+memo[^\n]*\[\s*1\s*\]|root[^\n]*1/.test(t), hint:'return memo[T.root.id][1]'}
  ],
  efficiency:[
   {label:'O(n) — two states per node, constant work each', w:5, test:(t,P)=>P.maxLoop<=1, hint:'Post-order fill of a 2n-entry table; helper has no loops.'}
  ],
  penalties:[{label:'Tries all subsets without memoization (exponential)', p:3, test:(t,P)=>!/memo/.test(t) && /party-?helper/.test(t), hint:'Without the memo table this is 2^n brute force.'}],
  model:`PARTY-FUN(T)
    // Giggle Inc. party — Exercise 13 Q1
    // memo[v][0] = best fun in v's subtree when v is EXCLUDED
    // memo[v][1] = best fun in v's subtree when v is INCLUDED
    memo = new [0..n, 0..1] array
    for v = 0 to n
        memo[v][0] = -infinity
        memo[v][1] = -infinity
    memo[0][0] = 0          // NIL contributes nothing
    memo[0][1] = 0
    PARTY-HELPER(T.root, memo)
    return memo[T.root.id][1]        // president must attend

PARTY-HELPER(v, memo)
    if v == NIL
        return
    if memo[v.id][0] != -infinity or memo[v.id][1] != -infinity
        return                        // both states already computed
    PARTY-HELPER(v.left, memo)
    PARTY-HELPER(v.right, memo)
    // state 1: v attends -> supervisor rule forces both children OUT
    memo[v.id][1] = funRating[v.id]
                   + memo[v.left.id][0] + memo[v.right.id][0]
    // state 0: v skips -> each child independently takes its better state
    if v == T.root
        memo[v.id][0] = -infinity     // president cannot be excluded
    else
        memo[v.id][0] = max(memo[v.left.id][0], memo[v.left.id][1])
                      + max(memo[v.right.id][0], memo[v.right.id][1])`},

 {id:'lps-length', topic:'t12b', title:'LPS — longest palindromic subsequence, bottom-up',
  prompt:'Write <code>LPS(X, n)</code> filling an n×n table where p[i][j] = LPS length of X[i..j]. Base: p[i][i] = 1 and p[i][i+1] = 2 if X[i]=X[i+1] else 1. Then fill by increasing substring length: match → 2 + p[i+1][j−1]; mismatch → max(p[i+1][j], p[i][j−1]). Return p[1][n].',
  starter:'LPS(X, n)\n    p = new n x n array\n    for i = 1 to n\n        p[i][i] = 1\n    for i = 1 to n - 1\n        if X[i] == X[i+1]\n            p[i][i+1] = 2\n        else\n            p[i][i+1] = 1\n    for len = 3 to n\n        for i = 1 to n - len + 1\n            j = i + len - 1\n            if X[i] == X[j]\n                \n            else\n                \n    return p[1][n]\n', define:['lps'], call:[], maxLoop:3,
  correctness:[
   {label:'Allocates an n×n table', w:2, test:t=>/new[^\n]*(n\s*x\s*n|n\s*\*\s*n|array)/.test(t) && /p\s*\[/.test(t), hint:'p = new n x n array'},
   {label:'Base case p[i][i] = 1 for all i', w:2, test:t=>/p\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]\s*=\s*1/.test(t), hint:'for i: p[i][i] = 1'},
   {label:'Length-2 base case (2 if equal else 1)', w:2, test:t=>/p\s*\[[^\]]*\]\s*\[\s*\w+\s*\+\s*1\s*\]|\[i\s*\+\s*1\]/.test(t) && /=\s*2/.test(t), hint:'p[i][i+1] = 2 when X[i]==X[i+1] else 1'},
   {label:'Match case: 2 + p[i+1][j−1]', w:3, test:t=>/x\s*\[\s*\w+\s*\]\s*==\s*x\s*\[\s*\w+\s*\]/.test(t) && /2\s*\+\s*p\s*\[/.test(t), hint:'p[i][j] = 2 + p[i+1][j-1]'},
   {label:'Mismatch case: max of the two neighbors', w:3, test:t=>/max\s*\(\s*p\s*\[/.test(t), hint:'p[i][j] = max(p[i+1][j], p[i][j-1])'},
   {label:'Returns p[1][n]', w:2, test:t=>/return\s+p\s*\[\s*1\s*\]\s*\[\s*n\s*\]|return\s+p\s*\[\s*\w+\s*\]\s*\[/.test(t), hint:'return p[1][n]'}
  ],
  efficiency:[
   {label:'Fills each of the n(n+1)/2 entries once — Θ(n²)', w:5, test:(t,P)=>P.maxLoop<=3, hint:'Diagonals by increasing length guarantee dependencies are ready.'}
  ],
  penalties:[{label:'Fills rows before dependencies exist (wrong order)', p:2, test:t=>/for[\s\S]{0,80}i\s*=\s*1\s*to\s*n[\s\S]{0,80}j\s*=\s*1\s*to\s*n/.test(t) && !/len|length|diagonal/.test(t), hint:'p[i][j] needs p[i+1][j-1] etc. — fill by substring length, not arbitrary row order.'}],
  model:`LPS(X, n)
    // p[i][j] = length of LPS of substring X[i..j]   (Exercise 13)
    p = new n x n array
    for i = 1 to n                        // length-1 substrings
        p[i][i] = 1
    for i = 1 to n - 1                    // length-2 substrings
        if X[i] == X[i+1]
            p[i][i+1] = 2
        else
            p[i][i+1] = 1
    for len = 3 to n                      // increasing substring length
        for i = 1 to n - len + 1
            j = i + len - 1
            if X[i] == X[j]
                p[i][j] = 2 + p[i+1][j-1]       // endpoints match: keep both
            else
                p[i][j] = max(p[i+1][j],        // drop j
                             p[i][j-1])         // drop i
    return p[1][n]`},

 {id:'radix-lsd', topic:'t10b', title:'RADIX-SORT with stable COUNTING-SORT passes',
  prompt:'Write <code>RADIX-SORT(A, n, d)</code> sorting d-digit keys least-significant-digit first, where each pass calls your stable <code>COUNTING-SORT(A, n, digit)</code> subroutine. Stability is REQUIRED for correctness — say so in a comment.',
  starter:'COUNTING-SORT(A, n, digit)\n    // stable sort of A by the given digit position\n    // (count occurrences, prefix sums, place from the END to stay stable)\n    \n\nRADIX-SORT(A, n, d)\n    // LSD radix: process digit positions 1..d, least significant first\n    for digit = 1 to d\n        \n', define:['radixsort','countingsort'], call:['counting-sort'], maxLoop:2,
  correctness:[
   {label:'COUNTING-SORT sorts by the requested digit', w:3, test:(t,P)=>/count|cnt|freq/.test(P.body('countingsort')) && /digit|position|\^|mod/.test(t), hint:'count frequencies of each digit value, prefix-sum, place elements'},
   {label:'COUNTING-SORT is stable (places from the end or preserves order)', w:3, test:t=>/(end|backward|reverse|stable|last)/.test(t) || /for[\s\S]{0,120}(n|length)[\s\S]{0,40}downto|downto/.test(t), hint:'iterate input from last to first when placing, or otherwise preserve prior order'},
   {label:'RADIX-SORT loops digits 1..d (LSD first)', w:3, test:t=>/for[\s\S]{0,60}(1\s*to\s*d|digit\s*=\s*1)/.test(t), hint:'for digit = 1 to d  // least significant first'},
   {label:'Each pass calls the stable sort', w:3, test:(t,P)=>/counting-?sort\s*\(/.test(P.body('radixsort')), hint:'COUNTING-SORT(A, n, digit) inside the loop'},
   {label:'Comment or structure shows LSD order matters', w:1, test:t=>/least|lsd|stable|low.order/i.test(t), hint:'// LSD: least significant digit first — passes MUST be stable'}
  ],
  efficiency:[
   {label:'d passes of O(n + k) counting sort → O(d(n+k))', w:5, test:(t,P)=>P.maxLoop<=2, hint:'Two nested loops max: digits × counting-sort internals.'}
  ],
  penalties:[{label:'Processes most-significant digit first (LSD violated)', p:3, test:(t,P)=>{const b=P.body('radixsort'); return /downto|d\s*-\s*1|most.significant/.test(b) && !/1\s*to\s*d/.test(b);}, hint:'LSD radix goes 1→d; MSD-first is a different (recursive) algorithm.'}],
  model:`COUNTING-SORT(A, n, digit)
    // stable sort by digit position 'digit' (1 = least significant)
    // stability: place elements scanning A from n down to 1
    count[0..k-1] = 0
    for i = 1 to n
        count[digitOf(A[i], digit)] = count[digitOf(A[i], digit)] + 1
    // prefix sums -> starting positions
    sum = 0
    for dgt = 0 to k-1
        c = count[dgt]; count[dgt] = sum; sum = sum + c
    for i = n downto 1                 // BACKWARD = stable
        dgt = digitOf(A[i], digit)
        B[count[dgt]] = A[i]
        count[dgt] = count[dgt] + 1
    copy B back into A

RADIX-SORT(A, n, d)
    // LSD radix sort — Exercise 11
    // INVARIANT: after pass 'digit', A is sorted by its 'digit' low-order digits.
    // Each pass MUST be stable: equal i-th digits keep the order earned by
    // the lower-order digits in previous passes.
    for digit = 1 to d                 // least significant digit FIRST
        COUNTING-SORT(A, n, digit)`}
);


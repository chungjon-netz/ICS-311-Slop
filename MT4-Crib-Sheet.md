# ICS 311 · Midterm 4 Crib Sheet

**Exam:** Wed 11/25 (Week 14). **Covers:** Topics 13, 14A, 14B, 16 (Disjoint Sets), 17 (MST, Kruskal, Prim, plus the Fibonacci-heap supplement), 18, 19.
**Not on MT4:** Topic 20 (Max Flow). It was taught Mon 11/23, the Monday of exam week, so it counts toward the final.

> **CLRS 4th-edition chapter map.** Some site notes use 3rd-edition numbers, so check against this list:
> Greedy = **Ch 15** (15.1 activity selection, 15.2 greedy elements, 15.3 Huffman) · Disjoint sets = **Ch 19** · BFS/DFS/topo/SCC = **Ch 20** (20.1–20.5) · MST = **Ch 21** · SSSP = **Ch 22** (22.1 Bellman-Ford, 22.2 DAG, 22.3 Dijkstra, 22.4 difference constraints, 22.5 proofs) · APSP = **Ch 23** (23.1 matrix mult, 23.2 Floyd-Warshall, 23.3 Johnson) · Fibonacci heaps = **3e Ch 19**, online-only in 4e.

---

## 0. The 60-second master table (memorize this)

| Algorithm | Time | Space | Requirements / notes |
|---|---|---|---|
| Activity selection | Θ(n) after Θ(n lg n) sort | Θ(1) extra | sort by **finish** time |
| Huffman | Θ(n lg n) binary heap; Θ(n) if presorted (two queues) | Θ(n) | n − 1 merges; full binary tree, n leaves, n − 1 internal |
| Fractional knapsack | Θ(n lg n) | | sort by value/weight. **0-1 knapsack needs DP** |
| BFS | Θ(V + E) lists, Θ(V²) matrix | Θ(V) | unweighted shortest paths (edge count) |
| DFS | Θ(V + E) lists, Θ(V²) matrix | Θ(V) stack | d/f times, edge types, cycles |
| Topological sort (DFS) | Θ(V + E) | | DAG only; decreasing f |
| Kahn's topo sort | Θ(V + E) | | in-degree queue; leftover vertices ⇒ cycle |
| SCC (Kosaraju) | Θ(V + E) | Θ(V + E) for Gᵀ | DFS(G), build Gᵀ, DFS(Gᵀ) in decreasing f |
| Union-Find (rank + path compression) | O(m α(n)) total | Θ(n) | α(n) ≤ 4 in practice. Say **amortized** |
| Union by rank only | O(m lg n) | | height ≤ ⌊lg n⌋ |
| Linked-list + weighted union | O(m + n lg n) | | each pointer moves ≤ lg n times |
| Kruskal | O(E lg E) = **O(E lg V)** | | sorting dominates; works on disconnected graphs (gives a forest) |
| Prim, binary heap | **O(E lg V)** | | (V + E) lg V |
| Prim, Fibonacci heap | **O(E + V lg V)** | | DECREASE-KEY O(1) amortized |
| Prim, array (no heap) | **Θ(V²)** | | best for dense graphs, E ≈ V² (PS11 P4) |
| Bellman-Ford | Θ(VE) | Θ(V) | negative edges OK; detects reachable negative cycles |
| DAG-SHORTEST-PATHS | Θ(V + E) | | negative edges OK (no cycles exist) |
| Dijkstra, binary heap | O((V + E) lg V) | | **w ≥ 0 only** |
| Dijkstra, Fibonacci heap | O(V lg V + E) | | |
| Dijkstra, array | Θ(V²) | | dense graphs |
| APSP: V × Bellman-Ford | Θ(V²E), Θ(V⁴) if dense | | |
| APSP: V × Dijkstra | O(VE lg V) binary; O(V² lg V + VE) Fib | | w ≥ 0 only |
| APSP: repeated squaring | Θ(V³ lg V) | Θ(V²) | slow-APSP is Θ(V⁴) |
| **Floyd-Warshall** | **Θ(V³)** | **Θ(V²)** (in place) | negative edges OK; negative cycle ⇒ some d[i,i] < 0 |
| **Johnson** | O(VE lg V) binary; O(V² lg V + VE) Fib | Θ(V²) | 1× BF + V× Dijkstra; best for **sparse + negative edges** |
| Transitive closure | Θ(V³) | Θ(V²) bits | FW with OR/AND |

**Fibonacci heap vs. binary heap (amortized for Fib):**

| Op | Binary heap | Fibonacci heap |
|---|---|---|
| INSERT | Θ(lg n) | **O(1)** |
| MINIMUM | Θ(1) | O(1) |
| EXTRACT-MIN | Θ(lg n) | **O(lg n) amortized** |
| DECREASE-KEY | Θ(lg n) | **O(1) amortized** |
| UNION | Θ(n) | O(1) |
| DELETE | Θ(lg n) | O(lg n) amortized |

---

## 1. Topic 13 · Greedy Algorithms & Huffman Codes

### 1.1 Core definitions
- **Greedy algorithm:** make the locally best choice, commit to it, never revisit it.
- A greedy algorithm is correct when **both** hold:
  1. **Greedy-choice property:** some optimal solution contains the greedy choice.
  2. **Optimal substructure:** after the choice, what's left is a smaller instance of the same problem, and an optimal solution to it plus the choice is optimal overall.
- **Greedy vs DP:** greedy makes its choice *before* solving subproblems and leaves one subproblem. DP's choice *depends on* subproblem solutions and compares many subproblems. Example pair: fractional knapsack (greedy) vs 0-1 knapsack (DP).

### 1.2 Activity selection (CLRS 15.1)
```
GREEDY-ACTIVITY-SELECTOR(s, f, n)      // activities pre-sorted by f
  A = {a1};  k = 1
  for m = 2 to n
      if s[m] ≥ f[k]                    // compatible with last pick
          A = A ∪ {a_m};  k = m
  return A
```
- Greedy choice: **earliest finish time**. Θ(n) after an O(n lg n) sort.
- **Exchange proof:** let a_m finish first. Take any optimal A with first activity a_i. Since f(a_m) ≤ f(a_i) ≤ start of A's 2nd activity, A − {a_i} ∪ {a_m} is still feasible and the same size, so it is also optimal. Recurse (induction) on the activities compatible with a_m.
- Hidden invariant: after k picks, the chosen set is compatible and extends to some optimal solution.

**Exercise 15: four strategies, four verdicts. Memorize these.**

| Rule | Verdict | Why |
|---|---|---|
| Earliest finish | **Optimal** | exchange argument above |
| Latest start | **Optimal** | it is earliest finish on the time-reversed instance (symmetry) |
| Shortest duration | **Fails** | a short activity in the middle blocks two long compatible ones. Greedy gets 1, optimal gets 2 |
| Fewest overlaps | **Fails** | counterexample: a1 overlaps only 2 others but blocks a 4-set. Greedy gets 3, optimal gets 4 |
| Earliest start | **Fails** | one long early activity blocks everything |
| Weighted (revenues) | **Greedy dies** | use DP (weighted interval scheduling), O(n lg n) with binary search or O(n²) |

### 1.3 Huffman codes (CLRS 15.3)
```
HUFFMAN(C)
  n = |C|;  Q = C                        // min-priority queue keyed on freq
  for i = 1 to n − 1
      allocate new node z
      z.left  = x = EXTRACT-MIN(Q)
      z.right = y = EXTRACT-MIN(Q)
      z.freq  = x.freq + y.freq
      INSERT(Q, z)
  return EXTRACT-MIN(Q)                  // root
```
- **Prefix code:** no codeword is a prefix of another, so decoding is unambiguous (walk the tree: 0 = left, 1 = right, output at a leaf).
- **Cost:** B(T) = Σ c.freq · d_T(c), where d_T(c) is the depth of c = its codeword length.
- An optimal code tree is always **full**: every internal node has 2 children. With |C| leaves it has |C| − 1 internal nodes.
- **Lemma 1 (greedy choice):** some optimal tree has the two least-frequent chars x, y as **siblings at maximum depth**. Proof: swap them with the deepest sibling pair; the displaced chars are at least as frequent, so B can't increase.
- **Lemma 2 (optimal substructure):** merge x, y into z with freq x.freq + y.freq. Then **B(T) = B(T′) + x.freq + y.freq**, so an optimal T′ expands to an optimal T.
- Θ(n lg n) with a binary heap. Θ(n) if the frequencies are pre-sorted (two-queue trick: leaves in one queue, merged nodes in another; both stay non-decreasing).

**Worked trace (CLRS example):** a:45 b:13 c:12 d:16 e:9 f:5 (thousands of chars)

| Step | Extract | Merge → |
|---|---|---|
| 1 | f:5, e:9 | 14 |
| 2 | c:12, b:13 | 25 |
| 3 | 14, d:16 | 30 |
| 4 | 25, 30 | 55 |
| 5 | a:45, 55 | 100 (root) |

Codes: **a=0, c=100, b=101, d=111, f=1100, e=1101**.
B(T) = 45·1 + 12·3 + 13·3 + 16·3 + 5·4 + 9·4 = **224** (thousand bits), vs a fixed 3-bit code = 300. Ties can give different trees, but the cost is always the same.

### 1.4 Greedy coin change (PS9 Problem 1(a))
Denominations 1, c, c², …, cᵏ (c > 1): greedy is optimal.
```
GREEDY-CHANGE(n, c, k)        // Θ(k)
  count = 0;  d = c^k
  for i = k downto 0
      count = count + ⌊n / d⌋   // take as many of this coin as fit
      n = n mod d
      d = d / c
  return count
```
- Why it works: an optimal solution uses **at most c − 1** of each coin smaller than cᵏ. Otherwise c copies of cⁱ could be swapped for one cⁱ⁺¹, giving fewer coins. A sum Σ (c−1)cⁱ for i < j is < cʲ, so the representation is the unique base-c expansion, which is exactly what greedy produces.
- **Grader traps:** use div/mod, not one coin per loop iteration (that loop runs up to n times). Go from the largest coin downward.
- Fails for arbitrary coins: {1, 3, 4} for 6 gives greedy 4+1+1 (3 coins), but 3+3 (2 coins) is optimal. US coins {1, 5, 10, 25} happen to be canonical.

### 1.5 Extra greedy problems the professor could pose (external, standard results)
| Problem | Correct greedy | Proof idea |
|---|---|---|
| Interval partitioning (min rooms) | sort by start; put each lecture in any free room, else open a new one | #rooms = max depth of overlap (a lower bound) |
| Minimize max lateness | **earliest deadline first** | swap adjacent inversions |
| Minimize Σ completion times | shortest job first | swap adjacent pair |
| Offline caching (CLRS 15.4) | evict **furthest in future** | exchange |
| Fractional knapsack | highest value/weight first | exchange a unit of weight |
| MST, Dijkstra | (Topics 17, 18) | cut property / settled-is-final |

---

## 2. Topic 14A · Graph Representations, BFS & DFS

### 2.1 Representations (CLRS 20.1)
| | Adjacency list | Adjacency matrix |
|---|---|---|
| Space | Θ(V + E) | Θ(V²) |
| Is (u,v) an edge? | O(deg u) | **O(1)** |
| List neighbors of u | Θ(deg u) | Θ(V) |
| BFS/DFS time | Θ(V + E) | Θ(V²) |
| Best for | sparse (E ≪ V²) | dense, or many edge queries |
- Undirected adjacency lists hold 2E entries total; directed lists hold E (handshake lemma: Σ deg = 2E).

**Exercise 16: transposing Gᵀ in each representation**
| Representation | Transpose cost |
|---|---|
| Matrix | swap A[i][j] ↔ A[j][i] **below the diagonal**: O(V²) time, O(1) extra space |
| Matrix + "is-transposed" bit | O(1) to flip the bit, but every accessor pays a branch forever |
| Edge list | swap (u,v) → (v,u) per edge: O(E) time, O(1) space |
| Adjacency list | O(V + E) time. Plan C (copy while deleting) keeps **live** extra space at O(V). Space counts simultaneously-live data |

### 2.2 BFS (CLRS 20.2)
```
BFS(G, s)
  for each u ∈ G.V − {s}:  u.color = WHITE; u.d = ∞; u.π = NIL
  s.color = GRAY; s.d = 0; s.π = NIL
  Q = ∅;  ENQUEUE(Q, s)
  while Q ≠ ∅
      u = DEQUEUE(Q)
      for each v ∈ G.Adj[u]
          if v.color == WHITE            // mark on DISCOVERY, not dequeue
              v.color = GRAY; v.d = u.d + 1; v.π = u
              ENQUEUE(Q, v)
      u.color = BLACK
```
- **Invariants:** (1) the queue holds vertices in non-decreasing d, and the d values of the head and tail differ by at most 1. (2) When u is dequeued, u.d = δ(s,u).
- Proof of (2) by contradiction: take the first vertex on a shortest path still waiting in the queue; it must be dequeued before u. This works only because every edge has weight 1.
- π pointers form the **breadth-first tree**. PRINT-PATH runs in O(path length).
- **Classic mistake:** marking a vertex visited when it is *dequeued* instead of when it is discovered. Then duplicates enter the queue.

**Trace (CLRS undirected graph):** edges r–s, r–v, s–w, w–t, w–x, t–x, t–u, x–u, x–y, u–y. BFS from s gives
s=0 · r=1, w=1 · v=2, t=2, x=2 · u=3, y=3.

### 2.3 DFS (CLRS 20.3)
```
DFS(G)
  for each u ∈ G.V: u.color = WHITE; u.π = NIL
  time = 0
  for each u ∈ G.V
      if u.color == WHITE: DFS-VISIT(G, u)

DFS-VISIT(G, u)
  time = time + 1;  u.d = time;  u.color = GRAY
  for each v ∈ G.Adj[u]
      if v.color == WHITE
          v.π = u;  DFS-VISIT(G, v)
  u.color = BLACK;  time = time + 1;  u.f = time
```
- Θ(V + E). Timestamps satisfy 1 ≤ u.d < u.f ≤ 2|V|.
- **Colors:** white = undiscovered, gray = on the recursion stack, black = finished.
- **Parenthesis theorem:** for any u, v, the intervals [u.d, u.f] and [v.d, v.f] are either **disjoint** or **nested**, never partially overlapping. v is a descendant of u ⇔ u.d < v.d < v.f < u.f.
- **White-path theorem:** v becomes a descendant of u ⇔ when u is discovered there is a u⇝v path of all-white vertices.

**Edge classification (when (u,v) is explored):**
| v's color | Type | Timestamp test | Meaning |
|---|---|---|---|
| WHITE | **tree** | u.d < v.d < v.f < u.f | v discovered via (u,v) |
| GRAY | **back** | v.d ≤ u.d < u.f ≤ v.f | v is an ancestor ⇒ **cycle** (self-loops count) |
| BLACK, u.d < v.d | **forward** | u.d < v.d < v.f < u.f | non-tree edge to a descendant |
| BLACK, u.d > v.d | **cross** | v.d < v.f < u.d < u.f | another subtree or tree |

- **Undirected graphs:** only tree and back edges.
- Directed graph is acyclic ⇔ DFS finds **no back edges**.

**Trace (same graph directed as drawn, alphabetical adjacency):**
r 1/16, s 2/13, w 3/12, t 4/11, u 5/8, y 6/7, x 9/10, v 14/15.
Tree edges: r→s, s→w, w→t, t→u, u→y, t→x, r→v. Forward: w→x. Cross: x→u, x→y. No back edges, so the graph is a DAG.

### 2.4 BFS/DFS applications (PS10)
- **Bipartite test (PS10 1b):** BFS 2-coloring. Give each new vertex the color 1 − u.color. If an edge joins two vertices of the same color, the graph has an odd cycle ⇒ not bipartite. Θ(V + E). (A graph is bipartite ⇔ it has no odd cycle.) For a disconnected graph, restart BFS from every uncolored vertex.
- **Number maze (PS10 P2):** BFS on the **state graph**. Each square is a vertex with ≤ 4 jumps of length k = M[r,c]. Θ(n²). Return "NO SOLUTION" if (n,n) is never reached. Never backtrack over all paths, which is exponential.
- Connected components: DFS/BFS restarted from each white vertex, Θ(V + E).
- Undirected cycle detection: a visited neighbor that is **not the parent**.

---

## 3. Topic 14B · Topological Sort & SCC

### 3.1 Topological sort (CLRS 20.4)
```
TOPOLOGICAL-SORT(G)
  DFS(G) computing v.f
  as each vertex finishes, insert it at the FRONT of a linked list
  return the list                   // = decreasing finish time
```
- Exists **iff** G is a DAG.
- **Key lemma:** in a DAG, every edge (u,v) has **u.f > v.f**. Case on v's color when (u,v) is explored: white means v is a descendant and finishes first. Gray would be a back edge, so a cycle, which is impossible. Black means v has already finished.
- Many valid orders may exist. The order is **unique** ⇔ consecutive vertices are joined by edges (a Hamiltonian path exists).

**Trace (site DAG):** A→B, A→D, B→C, B→E, D→E, E→F, C→F, G→F, H→C. Alphabetical DFS:
A 1/12, B 2/9, C 3/6, F 4/5, E 7/8, D 10/11, G 13/14, H 15/16.
Topological order: **H, G, A, D, B, E, C, F**.

### 3.2 Kahn's algorithm (Exercise 17 Q2, arena challenge `topo-indegree`)
```
TOPO-SORT(V, Adj)
  for v in V: indeg[v] = 0
  for v in V: for u in Adj[v]: indeg[u] += 1      // Θ(V + E)
  Q = all v with indeg[v] == 0
  while Q ≠ ∅
      v = DEQUEUE(Q); output v
      for u in Adj[v]
          indeg[u] −= 1
          if indeg[u] == 0: ENQUEUE(Q, u)
  // if fewer than |V| were output ⇒ a cycle exists
```
- Each vertex is enqueued **at most once** (its in-degree hits 0 exactly once). Each edge is scanned once. Θ(V + E).
- On the DAG above (alphabetical queue): A, G, H, B, D, C, E, F.

### 3.3 Strongly connected components (CLRS 20.5)
```
SCC(G)
  1. DFS(G) to compute u.f
  2. compute Gᵀ                          // Θ(V + E)
  3. DFS(Gᵀ), main loop in order of DECREASING u.f
  4. each tree of the 2nd DFS forest = one SCC
```
- An SCC is a **maximal** set of mutually reachable vertices.
- G and Gᵀ have the **same SCCs**.
- The component graph G^SCC is always a **DAG**.
- **Key lemma:** if C, C′ are distinct SCCs with an edge from C to C′, then f(C) > f(C′), where f(C) is the max finish time in C. So the vertex with the largest f lies in a **source** component of G^SCC. In Gᵀ that component has no outgoing edges, so the second DFS can't escape it.
- **Exercise 17 solution (12-vertex digraph):** pass-1 finish order l, k, a, c, b, d, h, i, j, e, f, g. The SCCs are {l}, {k}, {a,b,c}, {d,e,h}, {i}, {j}, {f,g}. The test is careful d/f/π bookkeeping with **alphabetical tie-breaking**.
- **Mistakes to avoid:** running pass 2 on G instead of Gᵀ, using increasing f, or sorting by discovery time.
- SCC is not the same as a weakly connected component, which ignores edge direction.
- Uses: 2-SAT, deadlock detection, "mother vertex". (The last-finishing vertex of a DFS is the only candidate; verify it with one more DFS.)

---

## 4. Topic 16 · Disjoint Sets (Union-Find), CLRS Ch 19

### 4.1 Operations and forest code (arena challenge `ds-forest`)
```
MAKE-SET(x)              FIND-SET(x)                 // two-pass: up, then compress
  x.p = x                  if x ≠ x.p
  x.rank = 0                   x.p = FIND-SET(x.p)
                           return x.p

LINK(x, y)               UNION(x, y)
  if x.rank > y.rank       LINK(FIND-SET(x), FIND-SET(y))   // ALWAYS link ROOTS
      y.p = x
  else x.p = y
      if x.rank == y.rank: y.rank = y.rank + 1
```
- **Root test:** x.p == x (not NIL).
- **Tie rule in CLRS:** on equal ranks, **y (the second argument's root) becomes the parent** and its rank goes up by 1. The site's random trace questions use exactly this rule.
- Unequal ranks: the lower-rank root goes under the higher one, and **no rank changes**.
- **Rank is an upper bound on height**, not the height. Path compression shrinks height without updating rank.
- A rank-r root has ≥ 2ʳ nodes ⇒ rank ≤ ⌊lg n⌋.
- FIND-SET is **not tail-recursive**. The compression happens as the recursion unwinds.
- At most **n − 1** UNIONs can actually merge sets.
- Bounds: both heuristics give **O(m α(n))** for m operations (n of them MAKE-SETs). The course cites Lemma 19.11 (MAKE-SET O(1) amortized), Lemmas 19.12–19.13 (LINK and FIND-SET O(α(n)) amortized) and Theorem 19.14. You need the **result**, not the potential proof. α(n) ≤ 4 for any realistic n.

**Trace with the CLRS tie rule:** singletons a–f.
UNION(a,b): b becomes the root, rank 1. UNION(c,d): d is the root, rank 1. UNION(a,c): this links roots b and d (tie), so d becomes the root with rank 2. UNION(e,a): FIND(a) compresses a and b to point at d. LINK(e, d): 0 < 2, so e.p = d and the rank stays 2.
Result: FIND-SET(any of a–e) = **d, rank 2**. f is still a singleton.

### 4.2 Linked-list representation
- MAKE-SET and FIND-SET are O(1). UNION must update every back-pointer of the appended list.
- Naive union: Θ(n²) for 2n operations, so Θ(n) amortized.
- **Weighted union** (append the shorter list): O(m + n lg n). Each element's set at least doubles whenever its pointer moves.

### 4.3 When to use what
- **Static** graph components: DFS/BFS in Θ(V + E) is simpler and faster.
- **Dynamic** edge insertions, as in Kruskal or online connectivity queries: Union-Find.
- Union-Find **cannot delete edges**. That's why reverse-delete can't use it.
- CONNECTED-COMPONENTS (arena `ds-cc`): MAKE-SET each vertex, then for each edge, if FIND(u) ≠ FIND(v), UNION. SAME-COMPONENT(u,v) = FIND(u) == FIND(v), O(α(n)) with no loops. Total O((V + E) α(V)).

---

## 5. Topic 17 · Minimum Spanning Trees (CLRS Ch 21)

### 5.1 Vocabulary (arena challenge `mst-cut`)
- **Spanning tree:** connects all V vertices with exactly **V − 1** edges and no cycle.
- **Cut (S, V − S):** a partition of V. An edge **crosses** the cut if exactly one endpoint is in S.
- A cut **respects** A if **no edge of A crosses it**.
- **Light edge:** a minimum-weight edge **among those crossing the cut**. There can be ties, and it need not be the global minimum.
- **Safe edge:** an edge that can be added to A while keeping A ⊆ some MST.

### 5.2 GENERIC-MST and the Safe Edge Theorem
```
GENERIC-MST(G, w)
  A = ∅
  while A is not a spanning tree          // runs exactly V − 1 times
      find an edge (u,v) safe for A
      A = A ∪ {(u,v)}
  return A
```
**Invariant:** A is a subset of some MST.

**Theorem (cut property):** if A ⊆ some MST T, (S, V − S) respects A, and (u,v) is light across it, then (u,v) is safe.
**Proof (the most-asked proof, reproduce it from memory):**
1. If (u,v) ∈ T, done.
2. Otherwise T has a unique u⇝v path. Since u, v are on opposite sides, the path has some edge (x,y) that **crosses the cut**.
3. (x,y) ∉ A because the cut respects A.
4. T′ = T − {(x,y)} ∪ {(u,v)} is a spanning tree. Since (u,v) is light, w(u,v) ≤ w(x,y), so w(T′) ≤ w(T). Then T′ is an MST.
5. A ∪ {(u,v)} ⊆ T′, so (u,v) is safe. ∎

**Corollary:** a light edge joining a component C of G_A = (V, A) to another component is safe (use the cut (V_C, V − V_C)). Kruskal and Prim both use this.

### 5.3 MST facts the professor loves to test
- **Distinct weights ⇒ unique MST.** With ties several MSTs may exist, but all have the **same total weight**.
- **Cycle property:** the strictly heaviest edge on any cycle is in **no** MST.
- The lightest edge is in some MST, and in every MST if it is unique. The 2nd-lightest is also always in some MST, because two edges can't form a cycle.
- **Adding a constant to all weights does not change the MST**, since every spanning tree has V − 1 edges. It **does** change shortest paths.
- Any **strictly increasing** transform (squaring non-negative weights, ×c with c > 0, +c) keeps the MST, because only the relative order of weights matters.
- Negative weights are fine for MSTs.
- **Max spanning tree:** negate the weights, or sort descending.
- An MST is **not** a shortest-path tree. The MST path between u and v minimizes the **maximum** edge (minimax/bottleneck), not the sum.
- Disconnected G: the MST becomes a **minimum spanning forest**. Kruskal handles this naturally. Prim only spans r's component.
- Why the optimum is a tree: with positive weights, any cycle has a removable edge, which keeps connectivity and lowers the cost.
- **Equal weights (PS11 P3):** every spanning tree is an MST with weight (V−1)·w, so a plain DFS/BFS tree works in **Θ(V + E)**. Don't sort, and don't use a heap or Union-Find; the grader penalizes them.

**Exercise 18: three "maybe-MST" algorithms.**
| Algorithm | Verdict | Reason |
|---|---|---|
| A: sort **descending**, delete e if G − e stays connected (reverse-delete) | **Correct** | cycle property: it removes the heaviest edge on some cycle. It can't use Union-Find, because that structure can't delete edges |
| B: arbitrary order, add if no cycle | **Incorrect** | ignores weights. Triangle counterexample: process the two heavy edges first. It's just CONNECTED-COMPONENTS |
| C: add every edge; if a cycle forms, drop the cycle's **max** edge | **Correct** | invariant: "T is the MSF of the edges seen so far." Cycle check costs O(V + E) by DFS per edge |

### 5.4 Kruskal (arena `kr-mst`, `kr-weight`)
```
MST-KRUSKAL(G, w)
  A = ∅
  for each v ∈ G.V: MAKE-SET(v)
  sort G.E into non-decreasing order by w          // ONCE, outside the loop
  for each (u,v) ∈ G.E in sorted order
      if FIND-SET(u) ≠ FIND-SET(v)
          A = A ∪ {(u,v)};  UNION(u,v)
          if |A| == |V| − 1: break                 // optional early exit
  return A
```
- A is a **forest** that merges over time; Kruskal "hops around" the graph.
- **O(E lg E) = O(E lg V)**, because E ≤ V² ⇒ lg E ≤ 2 lg V. Sorting dominates, and that cost is worst-case, not amortized. The Union-Find part is O(E α(V)).
- Reject (u,v) ⇔ **same set**, not "adjacent in A".
- Disconnected check: |A| < |V| − 1 ⇒ "disconnected".
- **Grader traps:** sort once at loop depth 0, and never detect cycles with DFS/BFS per edge (−4 penalty).

**Trace:** a–c 1, b–c 2, d–e 2, a–b 4, b–d 5, c–d 8, c–e 10.
Accept a–c, b–c, d–e. Reject a–b (same set). Accept b–d. Reject c–d and c–e. **Weight 10.**

### 5.5 Prim (arena `pr-mst`, `pr-edges`, PS11 P4)
```
MST-PRIM(G, w, r)
  for each u ∈ G.V: u.key = ∞; u.π = NIL; INSERT(Q, u)
  DECREASE-KEY(Q, r, 0)
  while Q ≠ ∅
      u = EXTRACT-MIN(Q)
      for each v ∈ G.Adj[u]
          if v ∈ Q and w(u,v) < v.key              // keep an inQ flag: O(1) test
              v.π = u
              DECREASE-KEY(Q, v, w(u,v))
```
- **v.key = the lightest edge connecting v to the tree**, not v's distance from r (that's Dijkstra).
- Updating π at the same moment as the key is essential, otherwise the output edges are wrong.
- A is always **one tree**: A = {(v, v.π) : v ∈ V − {r} − Q}.
- Σ of the final keys = MST weight. To recover the edges, walk π over each v ≠ r in O(V) and use v.key as the weight.
- DECREASE-KEY can hit the same vertex more than once.
- The inner loop does Θ(E) total work (aggregate analysis over the adjacency lists).
- **Dense input (PS11 P4, MIN-BRIDGES with an n×n matrix):** use **array-based Prim, Θ(n²)**, which is optimal for a complete graph. A heap gives Θ(n² lg n), and sorting all pairs for Kruskal also gives Θ(n² lg n); the grader penalizes both.

**Trace (graph from 5.4, root a):** extract a (b=4, c=1) → c (b→2, d=8, e=10) → b (d→5) → d (e→2) → e.
Order a, c, b, d, e. **Weight 1+2+5+2 = 10** (it matches Kruskal).

**Prim vs Dijkstra:** same skeleton. Prim's key = w(u,v); Dijkstra's key = u.d + w(u,v).

### 5.6 Fibonacci heaps (supplement; arena `fib-cut`, `fib-deg`)
- **Structure:** a root list of min-heap-ordered trees, a min pointer, and per-node degree, mark, parent and child pointers.
- **Laziness:** INSERT just adds a singleton tree to the root list. Consolidation happens **only during EXTRACT-MIN**: link equal-degree roots (the larger key goes under the smaller) until all degrees differ, then find the new min.
- **DECREASE-KEY(x, k):** set the key. If heap order breaks, CUT x to the root list and run CASCADING-CUT on its old parent.
```
CUT(H, x, y)                      CASCADING-CUT(H, y)
  remove x from y's child list      z = y.p
  y.degree = y.degree − 1           if z ≠ NIL
  add x to H's root list                if y.mark == FALSE: y.mark = TRUE
  x.p = NIL;  x.mark = FALSE            else CUT(H, y, z); CASCADING-CUT(H, z)
```
- **Mark bit:** "lost a child since becoming a child." The first loss sets the mark. The second loss cuts the node and propagates upward.
- **Potential:** Φ = t(H) + 2·m(H), where t = #trees and m = #marked nodes.
- **Degree lemmas:**
  - The i-th child (in link order) satisfies **yᵢ.degree ≥ i − 2**.
  - **size(x) ≥ F_{k+2} ≥ φᵏ** for degree k, with φ = (1+√5)/2 ≈ 1.618 and φ² = φ + 1.
  - Minimum sizes s₀=1, s₁=2, s₂=3, s₃=5, s₄=8, … give the Fibonacci numbers.
  - Therefore **D(n) ≤ ⌊log_φ n⌋ = O(lg n)**, which is why EXTRACT-MIN is O(lg n) amortized.
- F: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, … Example: D(1000) ≤ ⌊ln 1000 / ln φ⌋ = **14**.
- MAX-DEGREE(n): the largest k with F_{k+2} ≤ n. Compute it iteratively in O(lg n).
- **Always say "amortized."** These bounds are not worst-case per operation.

---

## 6. Topic 18 · Single-Source Shortest Paths (CLRS Ch 22)

### 6.1 Building blocks
```
INITIALIZE-SINGLE-SOURCE(G, s)        RELAX(u, v, w)
  for each v: v.d = ∞; v.π = NIL        if v.d > u.d + w(u,v)
  s.d = 0                                   v.d = u.d + w(u,v); v.π = u
```
**Properties every proof uses:**
- **Triangle inequality:** δ(s,v) ≤ δ(s,u) + w(u,v).
- **Upper bound:** v.d ≥ δ(s,v) always. Once equal, it never changes.
- **No-path:** if v is unreachable, v.d = ∞ forever.
- **Convergence:** if s⇝u→v is shortest and u.d = δ(s,u) before relaxing (u,v), then v.d = δ(s,v) afterwards.
- **Path-relaxation:** relaxing the edges of a shortest path **in order** (other relaxations may be interleaved) gives the right d at the end.
- **Optimal substructure:** subpaths of shortest paths are shortest paths.
- **Negative cycles:** a negative cycle reachable from s makes the affected distances −∞. Unreachable ones don't matter. With no negative cycles, shortest paths are simple, with ≤ V − 1 edges.
- **Longest simple path** in a general graph is NP-hard and has no optimal substructure.

### 6.2 Bellman-Ford
```
BELLMAN-FORD(G, w, s)
  INITIALIZE-SINGLE-SOURCE(G, s)
  for i = 1 to |V| − 1
      for each (u,v) ∈ G.E: RELAX(u, v, w)
  for each (u,v) ∈ G.E
      if v.d > u.d + w(u,v): return FALSE   // reachable negative cycle
  return TRUE
```
- Θ(VE).
- **Lemma (|V| − 1):** after pass i, v.d ≤ the weight of every s⇝v path with ≤ i edges. Proved by induction on i. Edge order within a pass doesn't affect correctness, only how fast it converges.
- **Early exit:** if a pass changes nothing, stop.
- **Mistakes:** doing only V − 2 passes, skipping the final check, or initializing s.d = ∞.

**CLRS trace:** s→t 6, s→y 7, t→x 5, t→y 8, t→z −4, x→t −2, y→x −3, y→z 9, z→s 2, z→x 7.
Final: **s=0, t=2, x=4, y=7, z=−2**. TRUE, no negative cycle.

### 6.3 DAG shortest paths
```
DAG-SHORTEST-PATHS(G, w, s)
  topologically sort G
  INITIALIZE-SINGLE-SOURCE(G, s)
  for each u in topological order
      for each v ∈ G.Adj[u]: RELAX(u, v, w)
```
- Θ(V + E). Negative weights are OK.
- Invariant: when u is processed, all of its predecessors are final.
- **Longest path in a DAG:** negate the weights (or flip min to max and initialize to −∞). This is PERT/critical-path scheduling.
- Counting paths in a DAG uses the same order with DP.

### 6.4 Dijkstra (arena `dijkstra`)
```
DIJKSTRA(G, w, s)
  INITIALIZE-SINGLE-SOURCE(G, s)
  S = ∅;  Q = G.V                     // min-priority queue keyed on d
  while Q ≠ ∅
      u = EXTRACT-MIN(Q);  S = S ∪ {u}
      for each v ∈ G.Adj[u]
          RELAX(u, v, w)              // + DECREASE-KEY(Q, v, v.d)
```
- **Invariant:** when u is extracted, u.d = δ(s,u).
- **Proof:** suppose u is the first vertex extracted with u.d > δ(s,u). Let y be the first vertex on a shortest s⇝u path not in S, and x its predecessor (in S, final). Then y.d = δ(s,y) by convergence. Since w ≥ 0, δ(s,y) ≤ δ(s,u) < u.d. But Dijkstra picked u, so u.d ≤ y.d, a contradiction. **w ≥ 0 is used exactly there.**
- **Why negative edges break it:** s→a 2, a→c 1, s→b 4, b→a −3. Dijkstra settles a (2), then c (3), then b (4). Relaxing b→a then gives a.d = 1, but c stays at 3, while the true δ(c) = 2. (Even when a lucky RELAX fixes a settled vertex, its descendants aren't updated.)
- **Adding a constant to every edge does NOT fix negative edges.** It penalizes paths with more edges. Use Johnson's potentials.
- Costs: V EXTRACT-MINs + ≤ E DECREASE-KEYs. That's O((V+E) lg V) with a binary heap, O(V lg V + E) with a Fibonacci heap, and Θ(V²) with an array (dense graphs).
- **Grader trap:** don't scan all of Q to find the min (−3). Let the heap find it.

**CLRS trace:** s→t 10, s→y 5, t→x 1, t→y 2, y→t 3, y→x 9, y→z 2, x→z 4, z→x 6, z→s 7.
Extract order **s, y, z, t, x**. Final **s=0, y=5, z=7, t=8, x=9**. π: y←s, z←y, t←y, x←t.

---

## 7. Topic 19 · All-Pairs Shortest Paths (CLRS Ch 23)

### 7.1 Floyd-Warshall (arena `floyd`)
```
FLOYD-WARSHALL(W, n)
  D = W                                   // 0 on the diagonal, ∞ for no edge
  for k = 1 to n                          // k MUST be the OUTERMOST loop
      for i = 1 to n
          for j = 1 to n
              D[i,j] = min(D[i,j], D[i,k] + D[k,j])
  return D
```
- **Subproblem:** d⁽ᵏ⁾ᵢⱼ = the shortest i⇝j path whose **intermediate** vertices all lie in {1, …, k}.
- **Recurrence:** d⁽ᵏ⁾ᵢⱼ = min(d⁽ᵏ⁻¹⁾ᵢⱼ, d⁽ᵏ⁻¹⁾ᵢₖ + d⁽ᵏ⁻¹⁾ₖⱼ). A shortest path either avoids k, or uses k exactly once (simple paths never repeat vertices).
- Θ(n³) time. **Θ(n²) space in place**, because row k and column k don't change during round k (d[i,k] + d[k,k] = d[i,k] when d[k,k] = 0). The "Θ(n³) space" claim in one lecture card applies only to storing every D⁽ᵏ⁾.
- Negative edges are fine. A **negative diagonal entry** d[i,i] < 0 ⇒ negative cycle.
- **Predecessor matrix:** π⁽⁰⁾ᵢⱼ = i if edge (i,j) exists, otherwise NIL. When the "through k" option wins, set **πᵢⱼ = πₖⱼ**. Print paths recursively, like PRINT-PATH.
- **Transitive closure:** tᵢⱼ = tᵢⱼ ∨ (tᵢₖ ∧ tₖⱼ), Θ(n³).
- **Mistake:** putting the k loop inside the i/j loops.

**CLRS 5-vertex example** (1→2 3, 1→3 8, 1→5 −4, 2→4 1, 2→5 7, 3→2 4, 4→1 2, 4→3 −5, 5→4 6). Final D⁽⁵⁾:
```
     1   2   3   4   5
1    0   1  -3   2  -4
2    3   0  -4   1  -1
3    7   4   0   5   3
4    2  -1  -5   0  -2
5    8   5   1   6   0
```
**Exam move:** to fill one round k, copy row k and column k unchanged, then for every other cell ask whether D[i,k] + D[k,j] < D[i,j].

### 7.2 Johnson's algorithm
1. Add a new vertex s with 0-weight edges to every vertex. Run Bellman-Ford from s to get **h(v) = δ(s,v)** (all ≤ 0). If BF finds a negative cycle, stop.
2. Reweight: **ŵ(u,v) = w(u,v) + h(u) − h(v) ≥ 0**. By the triangle inequality, h(v) ≤ h(u) + w(u,v).
3. Run Dijkstra from every u using ŵ. Convert back: **δ(u,v) = δ̂(u,v) − h(u) + h(v)**.
- **Why paths are preserved:** for any path P from u to v, ŵ(P) = w(P) + h(u) − h(v). The h terms **telescope**, so every u⇝v path shifts by the same amount.
- Cost: O(VE) + V·Dijkstra = **O(VE lg V)** with a binary heap, **O(V² lg V + VE)** with a Fibonacci heap.

**Mini trace:** 1→2 (3), 2→3 (−2), 1→3 (2).
h = (0, 0, −2). ŵ(1,2) = 3, ŵ(2,3) = 0, ŵ(1,3) = 4.
δ̂(1,3) = 3 ⇒ δ(1,3) = 3 − 0 + (−2) = **1** ✓ (the path 1→2→3).

### 7.3 Other APSP methods
- **Slow APSP:** "min-plus matrix multiplication." L⁽ᵐ⁾ = L⁽ᵐ⁻¹⁾ ⊗ W takes Θ(V⁴). **Repeated squaring** L⁽²ᵐ⁾ = L⁽ᵐ⁾ ⊗ L⁽ᵐ⁾ takes **Θ(V³ lg V)**. Stop once m ≥ V − 1.

### 7.4 Choosing an APSP algorithm
| Graph | Choose |
|---|---|
| Dense, any weights (no negative cycles) | **Floyd-Warshall** (Θ(V³), tiny constants) |
| Sparse, non-negative | Dijkstra from every vertex |
| Sparse, some negative edges | **Johnson** |
| Unweighted | BFS from every vertex, Θ(V(V+E)) |
| Reachability only | transitive closure / DFS from each vertex |

---

## 8. Pathways: how to attack a problem you've never seen

### 8.1 Step 0: read the problem like the professor wrote it
1. **What's the input?** A set of items or intervals points to greedy or sorting. Pairwise relations, grids or prerequisites point to a **graph**. A distance matrix means a **dense** graph.
2. **What's the output?** An order, a set of edges, distances, yes/no, or a count.
3. **What's the objective?** "fewest steps" means BFS. "Cheapest total" means shortest paths or MST (see 8.3). "Maximum number of compatible…" points to greedy, but prove it.
4. **What do the constraints hint at?** "All weights equal", "dense", "weights ≥ 0", "DAG", "powers of c" are each a **signal** for which algorithm the professor wants (PS9, PS11).
5. **What's the efficiency target?** Θ(V + E) means one BFS/DFS. Θ(n²) on a matrix means array-Prim. "As efficiently as possible" means: don't add a log factor you don't need.

### 8.2 Decision tree: which algorithm?
```
Is it a graph problem? (if not obviously, can you MAKE it one? states = vertices, moves = edges)
│
├─ Connectivity / reachability / components
│    static graph ...................... BFS/DFS Θ(V+E)
│    edges arrive over time ............ Union-Find
│    directed, mutual reachability ..... SCC (Kosaraju)
│
├─ Ordering with prerequisites ......... Topological sort (DFS or Kahn)
│    "is it possible?" ................. cycle check (back edge / Kahn leftovers)
│
├─ Two-coloring / "split into 2 groups with no conflict" ... BFS 2-color (bipartite)
│
├─ Connect everything as cheaply as possible (no source) ... MST
│    all weights equal ................. any BFS/DFS tree Θ(V+E)       (PS11 P3)
│    dense / matrix input .............. array-Prim Θ(V²)              (PS11 P4)
│    sparse, edge list ................. Kruskal O(E lg V) or heap-Prim
│
├─ Cheapest path FROM ONE source
│    unweighted / unit ................. BFS                           (PS10 P2)
│    DAG (any weights) ................. topo order + relax Θ(V+E)
│    weights ≥ 0 ....................... Dijkstra
│    negative edges / need neg-cycle detection ... Bellman-Ford
│
└─ Cheapest path between ALL pairs
     dense ............................. Floyd-Warshall
     sparse + negative edges ........... Johnson
     sparse + non-negative ............. V × Dijkstra
     unweighted ........................ V × BFS
```

### 8.3 MST vs shortest path: the #1 confusion
- **MST:** no source vertex. Connect *everyone* at minimum *total* cost. The answer is a set of V − 1 edges.
- **SSSP:** has a source. Minimize the cost of each *individual* path from s. The answer is distances plus a π-tree.
- Quick check: "build roads/bridges/cables so all cities connect" → MST. "Fastest route from the depot to each city" → shortest paths.

### 8.4 Graph-modeling tricks (for "design an algorithm" questions)
| Situation | Transform |
|---|---|
| Grid / puzzle / maze | each cell or state is a vertex, legal moves are edges, then BFS (PS10 Number Maze) |
| Several sources | add a **super-source** with 0-weight edges (same trick Johnson uses) |
| Shortest path *to* one target from everyone | run SSSP from the target on **Gᵀ** |
| Vertex costs | move them onto the incoming edges, or split v into v_in → v_out |
| Probabilities that multiply (most reliable path) | use weights −log p, then Dijkstra (p ≤ 1 ⇒ weights ≥ 0) |
| Longest path in a DAG / critical path | negate the weights, then DAG-SP |
| Max spanning tree / maximize the bottleneck | negate the weights or sort descending |
| Edge weights only 0 or 1 | 0-1 BFS with a deque, Θ(V+E) |
| Difference constraints xⱼ − xᵢ ≤ b | edge i→j with weight b plus a super-source; Bellman-Ford (CLRS 22.4). A negative cycle means infeasible |

### 8.5 "Is this greedy algorithm correct?" pathway (Exercises 15 and 18 style)
1. **Try to break it first**, on 2–4 items. Typical counterexample shapes:
   - Intervals: one short interval in the middle, or one long early one.
   - Coins: {1, 3, 4} with target 6.
   - Knapsack: W = 50 with (10 kg, $60), (20, $100), (30, $120). Greedy by ratio gets $160; the optimum is $220.
   - Graphs: a triangle with one cheap edge and two expensive ones.
2. If you can't break it, **prove it by exchange**: take an optimal O; if it lacks the greedy choice g, swap g in for some element of O; show the result is feasible and no worse; conclude by induction.
3. **State the running time.** It's usually a sort plus one linear pass.
4. If the problem has weights or profits and no swap works, say **"greedy-choice property fails, use DP"**, as with weighted intervals.

### 8.6 Proof templates (keep these on the sheet)
- **Exchange argument:** for greedy algorithms, Huffman, and the Safe Edge Theorem.
- **Loop invariant: Initialization / Maintenance / Termination.** Examples:
  - BFS: queue in d-order.
  - Kruskal: A ⊆ MST.
  - Prim: the tree ⊆ MST.
  - Dijkstra: S is final.
  - Bellman-Ford: after i passes, paths of ≤ i edges are right.
  - Floyd-Warshall: D = D⁽ᵏ⁾.
  - Kahn: the output so far is consistent.
  - Maybe-MST-C: T = MSF of the edges seen.
- **Contradiction on the first failure:** Dijkstra, and BFS finality.
- **Induction on the number of edges:** Bellman-Ford, and Floyd-Warshall's k.
- **Cut and paste** (optimal substructure): subpaths of shortest paths are shortest.
- **Counterexample:** the smallest instance where the claimed rule fails. Draw it.

### 8.7 Hand-trace protocol (the professor tests bookkeeping)
1. **Tie-break exactly as told.** The default is alphabetical or numeric. Write down the adjacency order before starting.
2. Keep a **table**: vertex | d | f | π (DFS), d | π (BFS, Dijkstra, Bellman-Ford), key | π (Prim), or parent | rank (Union-Find).
3. **DFS:** increment time on discovery *and* finish. When you see an edge to a gray vertex, write "back edge ⇒ cycle."
4. **Dijkstra and Prim:** cross out an extracted vertex and never update it again.
5. **Bellman-Ford:** follow the stated edge order for each pass. Do V − 1 passes plus a check, or stop early when a pass changes nothing.
6. **Floyd-Warshall:** highlight row k and column k, which stay fixed in that round.
7. **Union-Find:** always FIND both roots first, then compare **ranks**. On a tie the second root becomes the parent and its rank goes up.
8. **Sanity checks:** an MST has V − 1 edges. Topo order has every edge pointing forward. Σ Prim keys = MST weight. Parenthesis intervals nest.

### 8.8 Writing pseudocode the grader rewards (Correctness 40 / Modularity 30 / Efficiency 30)
- Define each **required procedure by name** (e.g., `MST-KRUSKAL`, `IS-BIPARTITE`, `NUMBER-MAZE`, `GREEDY-CHANGE`).
- **Call ADT operations** rather than inlining them: `MAKE-SET`, `FIND-SET`, `UNION`, `ENQUEUE`, `DEQUEUE`, `EXTRACT-MIN`, `DECREASE-KEY`, `RELAX`, `INITIALIZE-SINGLE-SOURCE`. Factor out helpers like `INSIDE(x,y,n)`, `CLOSEST-ISLAND`, `TOTAL-WEIGHT`.
- Keep procedures ≤ 20 lines with ≤ 4 nesting levels, use descriptive names, and include **at least one comment**, ideally `// Θ(...)` plus the invariant.
- **Efficiency checklist:**
  - Sort once, outside loops.
  - Mark a vertex visited **when it's discovered**.
  - Use adjacency lists, not a scan of G.V, per vertex.
  - Union-Find for cycle checks in Kruskal.
  - Use a heap only when the graph is sparse. Use the array version for dense graphs.
  - Use div/mod rather than repeated subtraction.
  - In equal-weight MST, don't sort and don't use a heap.

---

## 9. Practice map: what to drill and where (Question Hub)

| Skill | Site resources |
|---|---|
| Greedy proof / verdicts | Exercise 15 MC set (t13); arena challenge **`activity-select`**; **PS9 P1(a) `ps9-greedy`** |
| Huffman | step-through visualizer (CLRS frequencies plus 🎲 random) |
| Graph representations | Exercise 16 MC set (t14a); arena **`transpose-matrix`** |
| BFS | arena **`bfs`**; 🎲 BFS-distance generator; **PS10 P1(b) `ps10-bipartite`**, **PS10 P2 `ps10-maze`**; BFS/DFS visualizer |
| DFS edge types and timestamps | BFS/DFS visualizer (DFS mode); Exercise 17 table practice |
| Topo sort / SCC | topo visualizer (🎲 vertex order); arena **`topo-indegree`** (Kahn); Exercise 17 MC set |
| Union-Find | arena **`ds-forest`**, **`ds-cc`**; 🎲 rank-after-pairing and FIND-SET trace generators |
| Cuts and light edges | arena **`mst-cut`**; 🎲 light-edge-across-cut generator; Exercise 18 MC set (maybe-MST A/B/C) |
| Kruskal | arena **`kr-mst`**, **`kr-weight`**; 🎲 total-weight and first-rejected-edge generators; Kruskal visualizer |
| Prim | arena **`pr-mst`**, **`pr-edges`**; 🎲 extract-order and Σkey generators; **PS11 P3 `ps11-equal`**, **PS11 P4 `ps11-bridges`** |
| Fibonacci heaps | arena **`fib-cut`**, **`fib-deg`**; 🎲 D(n) and F_{k+2} generators |
| Dijkstra / Bellman-Ford | arena **`dijkstra`**; 🎲 Dijkstra-distance generator; SSSP visualizer (both algorithms, CLRS graphs) |
| Floyd-Warshall / Johnson | arena **`floyd`**; Floyd-Warshall visualizer (CLRS 5-vertex example) |

### 9.1 How each PS / exercise problem should be reasoned through (model pathways)
- **PS9 1(a) GREEDY-CHANGE:** denominations are powers of c ⇒ greedy is safe (the base-c argument). Loop k downto 0, take ⌊n/d⌋, set n = n mod d. **Θ(k)**.
- **PS10 1(b) IS-BIPARTITE:** "two groups, every edge across" = 2-coloring. BFS, give each new vertex the opposite color, and a same-color edge means return false. **Θ(V+E)**.
- **PS10 P2 NUMBER-MAZE:** "fewest moves" = unweighted shortest path. Squares are vertices and jumps are edges. BFS from (1,1) with dist = ∞ initially, and handle "no solution." **Θ(n²)**.
- **PS11 P3 EQUAL-WEIGHT-MST:** all weights equal ⇒ every spanning tree costs (V−1)w ⇒ DFS tree. **Θ(V+E)**. No sort, no heap, no Union-Find.
- **PS11 P4 MIN-BRIDGES:** a distance matrix is a complete graph, so E = Θ(n²). Array-Prim with an n-round × Θ(n)-scan is **Θ(n²)**, which is optimal because you must read the whole matrix anyway.
- **Ex 15:** for each rule, either build a counterexample or prove it by exchange or symmetry.
- **Ex 16:** a table of representation vs transpose time and space. Remember that space means *live* memory.
- **Ex 17:** mechanical DFS tables (alphabetical), then Kahn's analysis (each vertex enqueued once, each edge scanned once).
- **Ex 18:** judge each algorithm by the cut property or the cycle property. Correct ones get an invariant; incorrect ones get a triangle counterexample.

### 9.2 Likely "curveball" questions and the one-line answer
- *Does BFS give shortest paths on weighted graphs?* No. Use Dijkstra or Bellman-Ford.
- *Can Dijkstra be fixed for negatives by adding a constant?* No, that penalizes paths with more edges. Use Johnson's h-potentials.
- *Does adding a constant change the MST?* No. *Does it change shortest paths?* Yes.
- *Is the MST unique?* Yes if all weights are distinct. Otherwise maybe not, but the total weight is fixed.
- *Kruskal on a disconnected graph?* It produces a spanning forest. Prim spans only r's component.
- *Why O(E lg V) and not O(E lg E)?* Because lg E ≤ 2 lg V.
- *Undirected DFS edge types?* Tree and back only.
- *When does a topo order exist?* Iff the graph is a DAG (no back edges).
- *Why is SCC pass 2 run on Gᵀ in decreasing f?* So each DFS tree is trapped inside exactly one SCC.
- *Rank vs height?* Rank is an upper bound on height. Ranks only change on equal-rank links.
- *Is Fibonacci-heap DECREASE-KEY O(1)?* Only **amortized**.
- *Why must D(n) be O(lg n)?* EXTRACT-MIN consolidation costs O(D(n)).
- *What does a negative diagonal entry mean in Floyd-Warshall?* A negative cycle.
- *Which loop is outermost in Floyd-Warshall?* k.
- *Johnson beats Floyd-Warshall when…* the graph is sparse. Floyd-Warshall wins when it's dense.
- *Static components: Union-Find or DFS?* DFS (linear). Union-Find is for dynamic edge additions.
- *Bellman-Ford pass count?* V − 1, plus one check pass. Stop early if a pass changes nothing.
- *DAG shortest paths with negative edges?* Fine, Θ(V+E).
- *How many Huffman merges?* n − 1. The tree is full, with n − 1 internal nodes.
- *Activity selection greedy key?* Earliest **finish**. Latest start is also optimal, by symmetry.

---

## 10. Last-minute recall list (write these from memory before the exam)
1. Safe Edge Theorem proof (cut → path edge (x,y) → swap → w(T′) ≤ w(T)).
2. Dijkstra correctness and where w ≥ 0 is used.
3. Bellman-Ford |V| − 1 lemma (induction on the number of edges).
4. Floyd-Warshall recurrence and why the in-place update is safe.
5. Johnson: h from Bellman-Ford, ŵ = w + h(u) − h(v) ≥ 0, telescoping, convert back.
6. Topological sort lemma: u.f > v.f for every DAG edge.
7. SCC: DFS(G), Gᵀ, DFS in decreasing f. G^SCC is a DAG.
8. DFS edge-type table, parenthesis theorem, and white-path theorem.
9. Huffman's two lemmas, plus B(T) = B(T′) + x.freq + y.freq.
10. Union-Find code (MAKE-SET / FIND-SET with compression / LINK by rank / UNION), with the CLRS tie rule.
11. Fibonacci heap: yᵢ.degree ≥ i − 2 ⇒ size ≥ F_{k+2} ≥ φᵏ ⇒ D(n) = O(lg n). Φ = t + 2m.
12. The master running-time table in §0.

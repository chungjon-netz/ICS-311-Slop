# ICS 311 · Midterm 4 Crib Sheet
> **Wed 11/25 (Week 14)** · Topics 13 (greedy, Huffman), 14A (BFS/DFS), 14B (topo sort, SCC), 16 (union-find), 17 (MST, Kruskal, Prim, Fibonacci heaps), 18 (SSSP), 19 (APSP). Not on it: 20. CLRS 4e Ch 15, 19–23.

## 0 · Master table

### Costs to memorize
| Algorithm | Time |
|---|---|
| activity selection | Θ(n) after Θ(n lg n) sort |
| Huffman | Θ(n lg n); Θ(n) presorted |
| BFS / DFS | Θ(V + E) lists, Θ(V²) matrix |
| topo sort / Kahn / SCC | Θ(V + E) |
| union-find, m ops | O(m α(n)) amortized |
| Kruskal | O(E lg V) (sorting) |
| Prim: binary / Fib / array | O(E lg V) / O(E + V lg V) / Θ(V²) |
| Bellman-Ford | Θ(VE) |
| DAG shortest paths | Θ(V + E) |
| Dijkstra: binary / Fib / array | O((V + E) lg V) / O(V lg V + E) / Θ(V²) |
| Floyd-Warshall | Θ(V³) time, Θ(V²) space |
| Johnson | O(VE lg V) binary, O(V² lg V + VE) Fib |
| repeated squaring APSP | Θ(V³ lg V) |

### Heap operations
| Op | Binary | Fibonacci (amortized) |
|---|---|---|
| INSERT | Θ(lg n) | O(1) |
| EXTRACT-MIN | Θ(lg n) | O(lg n) |
| DECREASE-KEY | Θ(lg n) | O(1) |
| UNION | Θ(n) | O(1) |

## 1 · Greedy (Topic 13)

### Activity selection
- Needs the greedy-choice property **and** optimal substructure. Greedy commits before solving subproblems; DP compares them.
- Sort by **finish** time; take each activity with s[m] ≥ f[k].
- **Exchange:** swap the first activity of an optimal A for the earliest finisher a_m; it stays feasible and the same size.
- **Ex 15:** latest start is optimal (time reversal); shortest duration fails (it blocks two); fewest overlaps fails (3 vs 4); earliest start fails; weighted needs DP.

### Huffman codes
- Prefix code ⇒ unambiguous decoding; cost B(T) = Σ freq × depth. The optimal tree is **full** (n leaves, n − 1 internal).
- HUFFMAN: n − 1 times EXTRACT-MIN twice, merge, INSERT.
- **Lemma (choice):** the two rarest can be the deepest siblings. **Lemma (substructure):** B(T) = B(T′) + x.freq + y.freq.
- a45 b13 c12 d16 e9 f5 ⇒ merges 14, 25, 30, 55, 100 ⇒ a = 0, c = 100, b = 101, d = 111, f = 1100, e = 1101; B = 224 vs 300.
- **Coins 1, c, …, cᵏ (PS9):** greedy with ⌊n/d⌋ and n mod d, Θ(k). Fails for {1, 3, 4} at 6. Fractional knapsack is greedy; 0-1 is DP.

## 2 · BFS and DFS (Topic 14A)

### Representations
| | Lists | Matrix |
|---|---|---|
| space | Θ(V + E) | Θ(V²) |
| is (u, v) an edge? | O(deg u) | O(1) |
| neighbours of u | Θ(deg u) | Θ(V) |
- Transpose (Ex 16): matrix O(V²) in place; edge list O(E); adjacency lists O(V + E) with O(V) live extra space.

### BFS
- Queue; mark gray **on discovery**; v.d = u.d + 1, v.π = u.
- **Invariants:** the queue is in non-decreasing d (head and tail differ by ≤ 1); a dequeued u has u.d = δ(s, u). Unweighted only.
- **Bipartite (PS10 1b):** 2-color by BFS; a same-color edge ⇒ an odd cycle ⇒ not bipartite.
- **Number maze (PS10 P2):** squares are vertices, jumps are edges; BFS, Θ(n²).

### DFS
- time++ on discover (d) and finish (f). White = new, gray = on the stack, black = done.
| v when (u, v) is explored | Edge |
|---|---|
| white | tree |
| gray | back ⇒ cycle |
| black, u.d < v.d | forward |
| black, u.d > v.d | cross |
- **Parenthesis theorem:** intervals are nested or disjoint. **White-path theorem.** Undirected graphs have only tree and back edges.

## 3 · Topo sort and SCC (Topic 14B)

### Topological sort
- DAG ⇔ no back edge. Insert each vertex at the **front** as it finishes, giving decreasing f.
- **Lemma:** every DAG edge has u.f > v.f (case on v's color).
- Trace: A→B, A→D, B→C, B→E, D→E, E→F, C→F, G→F, H→C ⇒ H, G, A, D, B, E, C, F.
- **Kahn:** queue the in-degree-0 vertices; each vertex is enqueued once; leftovers ⇒ a cycle.

### SCC (Kosaraju)
- DFS(G) for f; build Gᵀ; DFS(Gᵀ) in **decreasing f**; each tree is one SCC.
- G and Gᵀ have the same SCCs; G^SCC is a DAG; an edge C → C′ ⇒ f(C) > f(C′).
- Ex 17: alphabetical d/f/π tables; SCCs {l}, {k}, {a, b, c}, {d, e, h}, {i}, {j}, {f, g}.

## 4 · Union-find (Topic 16)

### Forest with both heuristics
```
MAKE-SET(x): x.p = x;  x.rank = 0
FIND-SET(x)
  if x ≠ x.p: x.p = FIND-SET(x.p)
  return x.p
LINK(x, y)
  if x.rank > y.rank: y.p = x
  else x.p = y
    if x.rank == y.rank: y.rank++
UNION(x, y)
  LINK(FIND-SET(x), FIND-SET(y))
```
- On a tie, **y** becomes the parent and its rank goes up. Rank is an upper bound on height. Rank r ⇒ ≥ 2ʳ nodes ⇒ rank ≤ ⌊lg n⌋.
- O(m α(n)) (Lemmas 19.11–19.13, Thm 19.14). Weighted-union linked lists: O(m + n lg n).
- Static components ⇒ DFS; dynamic edges ⇒ union-find. It can't delete edges.

## 5 · MST (Topic 17)

### Cut property and facts
- A cut **respects** A if no A-edge crosses it; a **light** edge is a minimum crossing edge.
- **Safe Edge Thm:** if (u, v) ∉ T, T's u–v path has a crossing edge (x, y) ∉ A. T − (x, y) + (u, v) has weight ≤ w(T).
- Cycle property: the heaviest edge on a cycle is in no MST. Distinct weights ⇒ a unique MST.
- Adding a constant keeps the MST (but changes shortest paths). Negative weights are fine. Max spanning tree: negate.
- Equal weights (PS11 P3) ⇒ any DFS tree, Θ(V + E).
- **Ex 18:** reverse-delete correct; arbitrary-order Kruskal wrong; add-then-drop-max correct.

### Kruskal and Prim
- **Kruskal:** MAKE-SET all; sort E once; accept (u, v) if FIND(u) ≠ FIND(v), then UNION. A is a forest ⊆ an MST; a disconnected graph gives a forest.
- **Prim:** key = ∞, r.key = 0; EXTRACT-MIN u; for v ∈ Adj[u], if v ∈ Q and w(u, v) < v.key, set v.π = u and DECREASE-KEY. key = the lightest edge **to the tree**.
- Prim invariant: A = {(v, v.π) : v ∉ Q, v ≠ r}. Σ final keys = MST weight.
- Dense (PS11 P4 matrix) ⇒ array Prim Θ(n²).
- Trace: a–c 1, b–c 2, d–e 2, a–b 4, b–d 5, c–d 8, c–e 10 ⇒ weight 10; Prim from a extracts a, c, b, d, e.

### Fibonacci heaps
- A root list plus a min pointer. Consolidate only in EXTRACT-MIN. DECREASE-KEY cuts to the root list; a marked parent ⇒ **cascading cut**.
- i-th child degree ≥ i − 2 ⇒ size ≥ F_(k+2) ≥ φᵏ ⇒ D(n) ≤ ⌊log_φ n⌋. Φ = trees + 2 · marks. Always say **amortized**.

## 6 · Single-source shortest paths (Topic 18)

### Relaxation
- RELAX(u, v): if v.d > u.d + w(u, v), set v.d = u.d + w(u, v) and v.π = u.
- Properties: triangle inequality; upper bound (v.d ≥ δ); convergence; **path relaxation**; subpaths of shortest paths are shortest.
- A reachable negative cycle ⇒ −∞. Otherwise paths have ≤ V − 1 edges.

### The three algorithms
- **Bellman-Ford:** V − 1 passes over E, then one check pass (FALSE ⇒ negative cycle). After pass i, every ≤ i-edge path is bounded. Stop early if a pass changes nothing.
- **DAG-SP:** relax in topological order, Θ(V + E), negative weights OK; negate for longest paths.
- **Dijkstra (w ≥ 0):** EXTRACT-MIN, relax out-edges. **Invariant:** v.d = δ(s, v) for v ∈ S. Negative edges break it; adding a constant doesn't fix it.
- CLRS Dijkstra ⇒ extract s, y, z, t, x with d = 0, 5, 7, 8, 9. CLRS BF ⇒ s 0, t 2, x 4, y 7, z −2.

## 7 · All-pairs shortest paths (Topic 19)

### Floyd-Warshall and Johnson
- d^(k)[i, j] = min(d^(k−1)[i, j], d^(k−1)[i, k] + d^(k−1)[k, j]). **k is the outer loop.** In place is safe; d[i, i] < 0 ⇒ a negative cycle.
- Predecessor update: π[i, j] = π[k, j] when the k route wins. Transitive closure: OR / AND.
- **Johnson:** a new s with 0-edges; BF gives h = δ(s, ·); ŵ = w + h(u) − h(v) ≥ 0; V × Dijkstra; δ = δ̂ − h(u) + h(v). Paths telescope, so shortest paths are preserved.
- Choose: dense ⇒ FW; sparse with negative edges ⇒ Johnson; non-negative ⇒ V × Dijkstra; unweighted ⇒ V × BFS.

## 8 · Pathways and exam traps

### Which algorithm?
- Components / reachability: static ⇒ BFS/DFS; dynamic ⇒ union-find; mutual ⇒ SCC.
- Prerequisites ⇒ topo sort (a cycle ⇒ impossible). Two groups ⇒ bipartite BFS.
- Connect everything cheaply (no source) ⇒ **MST**. Cheapest route from s ⇒ **SSSP**.
- SSSP: unit ⇒ BFS; DAG ⇒ topo relax; w ≥ 0 ⇒ Dijkstra; negative ⇒ Bellman-Ford.
- Modeling: grid ⇒ BFS on states; many sources ⇒ super-source; to a target ⇒ Gᵀ; vertex costs ⇒ split v; probabilities ⇒ −log; difference constraints ⇒ BF.

### Proof and trace templates
- **Exchange** (greedy, Huffman, safe edge) · **invariant** (BFS, Kruskal, Prim, Dijkstra, FW, Kahn) · **first-failure contradiction** (Dijkstra, BFS) · **induction on edges** (BF).
- Greedy check: try {1, 3, 4}, intervals, a triangle; then prove it by exchange.
- Traces: follow the stated tie order; keep d/f/π, key/π or rank tables; time++ twice in DFS; cross out extracted vertices; union-find FINDs both roots first.

### Curveballs
- BFS is wrong for weighted graphs. The MST is unique only with distinct weights. Kruskal on a disconnected graph gives a forest. O(E lg E) = O(E lg V).
- Undirected DFS: tree and back edges only. SCC pass 2 uses Gᵀ in decreasing f. Rank ≠ height.
- Fibonacci DECREASE-KEY is O(1) **amortized**. FW: k outermost. BF: V − 1 passes + check.
- Grader: sort once; FIND-SET for cycle checks; mark on discovery; heap only when sparse; no sort or heap for equal weights.

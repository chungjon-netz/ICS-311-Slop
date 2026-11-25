# ICS 311 · Midterm 3 Crib Sheet
> **Wed 10/28 (Week 10)** · Topics 10A (selection), 10B (lower bounds & linear sorts), 12 backtracking, 12A (DP), 12B (LCS, optimal BST). Not on it: 13. CLRS 4e Ch 8, 9, 14 · Erickson Ch 1–3.

## 0 · Master table

### Costs to memorize
| Algorithm | Time |
|---|---|
| MIN or MAX | n − 1 compares (optimal) |
| MIN and MAX | 3⌊n/2⌋ compares |
| second smallest | n + ⌈lg n⌉ − 2 |
| RANDOMIZED-SELECT | Θ(n) expected, Θ(n²) worst |
| SELECT (groups of 5) | Θ(n) worst |
| comparison sort | Ω(n lg n) |
| COUNTING-SORT | Θ(n + k), stable |
| RADIX-SORT | Θ(d(n + k)) |
| BUCKET-SORT | Θ(n) expected, Θ(n²) worst |
| k-sorted array (PS7) | Θ(n lg(n/k)) |
| subset sum (backtracking) | O(2ⁿ); DP O(nT) |
| CUT-STICK (Ex 12) | Θ(2ⁿ), returns 2^(n−1) |
| rod cutting | 2ⁿ naive; Θ(n²) DP |
| matrix chain | Θ(n³) time, Θ(n²) space |
| LCS | Θ(mn); print Θ(m + n) |
| optimal BST | Θ(n³) |
| 0-1 knapsack | Θ(nW) pseudo-polynomial |
| coin change (PS8) | Θ(nk) |
| checkerboard (PS8) | Θ(n²) |
| party planning (Ex 13) | Θ(n) |
| LPS (Ex 13) | Θ(n²) |

## 1 · Selection (Topic 10A)

### Min, max, order statistics
- The i-th order statistic is the i-th smallest; the lower median is at ⌊(n + 1)/2⌋.
- MIN: n − 1 compares, optimal (every non-min must lose once).
- MIN and MAX: compare in **pairs**, then the smaller with min and the larger with max: 3 per 2 elements.
- Second smallest: run a tournament, then take the best of the ⌈lg n⌉ elements that lost to the winner.

### RANDOMIZED-SELECT
```
R-SELECT(A, p, r, i)
  if p == r: return A[p]
  q = RANDOMIZED-PARTITION(A, p, r)
  k = q − p + 1          // pivot rank
  if i == k: return A[q]
  if i < k
    return R-SELECT(A, p, q − 1, i)
  return R-SELECT(A, q + 1, r, i − k)
```
- Recurse on **one** side and **adjust the rank** to i − k on the right.
- **Expected Θ(n):** a pivot is good (rank in [n/4, 3n/4]) with Pr ≥ 1/2, and keeps ≤ 3n/4. So E[T] ≤ 2cn(1 + 3/4 + (3/4)² + …) = 8cn.
- Worst Θ(n²) (one element removed per round).

### SELECT, median of medians
1. Groups of 5; take each median by insertion sort: O(n).
2. x = SELECT of the ⌈n/5⌉ medians.
3. Partition around x; at least 3n/10 − 6 elements fall on each side.
4. Recurse on the side holding rank i, which has ≤ 7n/10 + 6 elements.
- T(n) ≤ T(⌈n/5⌉) + T(7n/10 + 6) + O(n). Substitution T ≤ cn holds for n ≥ 140 with c ≥ 20a.
- 1/5 + 7/10 < 1 ⇒ linear. **Groups of 3 fail** (Θ(n lg n)); groups of 7 work.

### Applications (Ex 10, PS6)
- **Pipeline:** the median minimizes Σ abs(yᵢ − p); for even n any point between the two middle values works.
- **QUICKSORT′:** a SELECT median pivot gives Θ(n lg n) worst case.
- T(n/5) + T(2n/3) + cn = Θ(n), since c′ ≥ 15c/2.
- **k smallest sorted (PS6 P1):** SELECT k, partition, sort k: Θ(n + k lg k). Compare sorting (n lg n) and a heap (n + k lg n).
- **k-th largest via MEDIAN (PS6 P2):** rank n − k + 1; partition around the median, recurse on one half: T(n/2) + O(n) = O(n).

## 2 · Lower bounds and linear sorts (Topic 10B)

### Decision-tree lower bound
- A comparison sort is a binary decision tree; it needs ≥ n! leaves, one per permutation.
- **Thm 8.1:** 2ʰ ≥ n! ⇒ h ≥ lg(n!) ≥ (n/2) lg(n/2) = Ω(n lg n). **Cor 8.2:** heapsort and merge sort are optimal.
- Sorting 3 elements needs 3 compares; searching a sorted array Ω(lg n); merging two n-lists 2n − 1.
- k-sorted: ((n/k)!)ᵏ outputs ⇒ Ω(n lg(n/k)).
- Linear sorts escape the bound because they index by key value (but counting sort with k = n³ is Θ(n³)).

### COUNTING-SORT
```
COUNTING-SORT(A, n, k)   // keys 0..k
  C[0..k] = 0
  for j = 1 to n: C[A[j]]++
  for i = 1 to k: C[i] += C[i − 1]
  for j = n downto 1      // stable
    B[C[A[j]]] = A[j]
    C[A[j]]−−
```
- Θ(n + k), not in place. C[v] = the last free slot for v. The backwards loop is what makes it **stable**.
- Trace: ⟨2, 5, 3, 0, 2, 3, 0, 3⟩ with k = 5: prefix sums C = [2, 2, 4, 7, 7, 8], output ⟨0, 0, 2, 2, 3, 3, 3, 5⟩.

### RADIX and BUCKET
- RADIX: for each digit, least significant first, use a **stable** sort.
- **Lemma 8.3:** Θ(d(n + k)). **Lemma 8.4:** b-bit keys with r-bit digits take Θ((b/r)(n + 2ʳ)); r ≈ lg n gives Θ(bn/lg n).
- Integers 0..n³ − 1 in Θ(n): base n, 3 digits.
- **Invariant (Ex 11):** after pass i, sorted on the low i digits. If digit i differs, it decides; if equal, **stability** keeps the earlier (correct) order.
- Trace 329 457 657 839 436 720 355 ⇒ ones: 720 355 436 457 657 329 839 ⇒ tens: 720 329 436 839 355 457 657 ⇒ hundreds: sorted.
- BUCKET: n buckets, insertion-sort each. E[nᵢ²] = 2 − 1/n ⇒ expected Θ(n); all keys in one bucket ⇒ Θ(n²).
- **Stabilize any sort (Ex 11):** sort (key, index) pairs; same Θ time plus n extra words.

## 3 · Backtracking (Topic 12)

### Recipe
- Build a solution one decision at a time; try each legal option; recurse; **undo**; prune early.
- Time = (# recursion-tree nodes) × (work per node). Keep the state small (index + remaining target).
- Prove correctness by induction on the decisions left. Repeated arguments ⇒ memoize (that's DP).

### Classics
```
SUBSET-SUM(X, i, T)
  if T == 0: return TRUE
  if T < 0 or i > n: return FALSE
  return SUBSET-SUM(X, i + 1, T)
      or SUBSET-SUM(X, i + 1, T − X[i])
```
- T(n) = 2T(n − 1) + O(1) = O(2ⁿ). The (i, T) states give a DP in O(nT), pseudo-polynomial.
- **n-queens:** one row per call; column j is legal if no Q[i] = j or abs(Q[i] − j) = r − i.
- **Text split:** try each first word; memoized gives O(n²). **LIS:** state (prev, j); DP Θ(n²).

### Course problems
- **CUT-STICK (Ex 12):** counts compositions, 2^(n−1); CUT-STICK(0) = 1. T(n) = c(2^(n+1) − 1) = Θ(2ⁿ).
- **Perfect subtree (Ex 12):** v is perfect ⇔ both children perfect **and** equal heights. One post-order pass: O(n).
- **Almost-palindrome (PS7 P3):** move pointers inward while equal; at the first mismatch try dropping s[i] or s[j]. Θ(n).
- **Treasure (PS7 P4):** check bounds, then X (TRUE), then water/visited (FALSE). Mark v, try 4 moves, **unmark**, FALSE.
- **k-sorted (PS7 1a):** merge-sort each block: k · (n/k) lg(n/k).

## 4 · Dynamic programming (Topic 12A)

### Method
- Four steps: structure of an optimal solution, recursive value, compute (memo or bottom-up), construct from stored choices.
- **Needs** optimal substructure **and** overlapping subproblems. Time ≈ #subproblems × choices each.
- Cut-and-paste proof: a better sub-solution would give a better whole.
- **Longest simple path fails** (subproblems share vertices); unweighted shortest path works.
- Memo solves only the needed subproblems; bottom-up has better constants and easy space saving. Bottom-up order is a reverse topological order of the subproblem graph.

### Rod cutting
- rₙ = max over 1 ≤ i ≤ n of (pᵢ + rₙ₋ᵢ), r₀ = 0. Naive 1 + Σ T(j) = 2ⁿ calls; DP Θ(n²). Store s[j] = the first piece.
| j | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| p | 1 | 5 | 8 | 9 | 10 | 17 | 17 | 20 | 24 | 30 |
| r | 1 | 5 | 8 | 10 | 13 | 17 | 18 | 22 | 25 | 30 |
| s | 1 | 2 | 3 | 2 | 2 | 6 | 1 | 2 | 3 | 10 |
- Greedy by density fails: prices 1, 20, 33, 36 ⇒ greedy 34 vs DP 40.

### Matrix chain
- Aᵢ is p_(i−1) × pᵢ. m[i, j] = min over i ≤ k < j of (m[i, k] + m[k + 1, j] + p_(i−1) p_k p_j).
- Fill by increasing chain length; Θ(n³). CLRS: 30 35 15 5 10 20 25 ⇒ 15,125 with ((A₁(A₂A₃))((A₄A₅)A₆)).

### More DPs
- **Coin change (PS8):** C[v] = 1 + min C[v − c[i]] over coins c[i] ≤ v; Θ(nk).
- **Checkerboard (PS8):** D[r, c] = max of 3 predecessors + p(move); the answer is the max of the top row; Θ(n²); watch the edges.
- **Party (Ex 13):** in[v] = fun(v) + Σ out[child]; out[v] = Σ max(in, out) over children. Post-order, Θ(n). President must attend ⇒ in[root].
- **0-1 knapsack:** K[i, w] = max(K[i − 1, w], K[i − 1, w − wᵢ] + vᵢ). **Fibonacci:** Θ(n), 2 variables.

## 5 · LCS and optimal BST (Topic 12B)

### LCS
- **Thm 14.1:** x_m = y_n ⇒ Z_(k−1) is an LCS of the prefixes. Otherwise drop the last character of X or of Y.
- c[i, j] = 0 on an empty prefix; c[i − 1, j − 1] + 1 if xᵢ = yⱼ; else max(c[i − 1, j], c[i, j − 1]).
- Θ(mn); arrows ↖ ↑ ← let PRINT-LCS run in Θ(m + n). The length needs only Θ(min(m, n)) space.
- ABCBDAB vs BDCABA ⇒ length 4 (BCBA).
- Substring ≠ subsequence: the substring version resets to 0 on a mismatch and takes the max cell.
- **LPS (Ex 13):** p[i, i] = 1; equal ends ⇒ 2 + p[i + 1, j − 1]; else max(p[i + 1, j], p[i, j − 1]). Fill by length.

### Optimal BST
- e[i, j] = min over i ≤ r ≤ j of (e[i, r − 1] + e[r + 1, j] + w(i, j)), with e[i, i − 1] = q_(i−1).
- Making r the root adds w(i, j) because every node sinks one level. Θ(n³); Knuth's root monotonicity gives Θ(n²).
- Greedy (most probable key as root) is not always optimal.

## 6 · Pathways and exam traps

### Lemma / invariant index
- n − 1 min · 3n/2 min-max · good-pivot geometric series · 3n/10 − 6 · c ≥ 20a · the median minimizes Σ abs.
- Thm 8.1, Cor 8.2 · counting stable · Lemmas 8.3, 8.4 · radix invariant · E[nᵢ²] = 2 − 1/n · stabilize by index.
- Subset-sum induction · CUT-STICK closed form · perfect-subtree equal heights.
- Cut-and-paste · longest-path counterexample · Thm 14.1 · m[i, j] and e[i, j] recurrences · party and LPS.

### Attacking a new problem
- **One order statistic:** RANDOMIZED-SELECT (expected) or SELECT (worst); MEDIAN box ⇒ T(n/2) + O(n); k-th largest = (n − k + 1)-th smallest.
- **Beat n lg n?** Small integers ⇒ counting; d digits or polynomial range ⇒ radix; uniform reals ⇒ bucket; structure ⇒ exploit it; otherwise prove Ω via lg(# outcomes).
- **Design a DP:** (1) brute-force recursion on the last or first choice; (2) the subproblem in English; (3) optimal substructure; (4) count states × choices; (5) fill order; (6) where the answer is; (7) store choices; (8) save space.
- **Shapes:** amount ⇒ 1-D; two strings ⇒ prefix table; ranges or parenthesization ⇒ interval DP by length; grid ⇒ row by row; tree ⇒ post-order states; capacity ⇒ pseudo-polynomial.
- **Greedy or DP?** Find a counterexample (rod densities, coins {1, 3, 4}, knapsack $160 vs $220) ⇒ DP.

### Curveballs
- RANDOMIZED-SELECT is not linear worst case. Selection recurses on one side, with rank i − k.
- The Ω(n lg n) bound doesn't cover counting sort. Counting sort is not in place. Radix needs a stable, LSD-first digit sort.
- DP O(nT) is pseudo-polynomial. Not every problem has optimal substructure.
- Memo and bottom-up have the same Θ. LCS ≠ substring.
- Grader: bottom-up when asked "non-recursive"; checkerboard Θ(n²), not path enumeration; almost-palindrome Θ(n); CUT-STICK is supposed to be exponential.

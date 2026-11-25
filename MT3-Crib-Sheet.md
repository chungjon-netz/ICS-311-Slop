# ICS 311 · Midterm 3 Crib Sheet

**Exam:** Wed 10/28 (Week 10). **Covers:** Topics 10A (Selection & Order Statistics), 10B (Lower Bounds & O(n) Sorts), 12 Backtracking (the starred "Recursion Review" topic), 12A (Dynamic Programming), 12B (DP continued: LCS, Optimal BSTs).
**Not on MT3:** Topic 13 (Greedy & Huffman). It was taught Mon 10/26, the Monday of exam week, so it counts toward Midterm 4. Expect DP-vs-greedy contrast questions anyway, using rod cutting and 0-1 knapsack.
**Builds on MT2:** PARTITION and RANDOMIZED-PARTITION (Topic 5B), indicator variables (5A), heapsort and merge sort (the optimal comparison sorts).

> **CLRS 4th-edition chapter map.** Ch 8 (8.1 lower bounds, 8.2 counting sort, 8.3 radix sort, 8.4 bucket sort) · Ch 9 (9.1 min and max, 9.2 selection in expected linear time, 9.3 selection in worst-case linear time) · Ch 14 dynamic programming (14.1 rod cutting, 14.2 matrix-chain multiplication, 14.3 elements of DP, 14.4 LCS, 14.5 optimal BSTs) · **Jeff Erickson, *Algorithms*:** Ch 1 (recursion), Ch 2 (backtracking: 2.1 n-queens, 2.3 subset sum, 2.4 text segmentation, 2.6 longest increasing subsequence, 2.8 optimal BST), Ch 3 (DP, through 3.9). Screencasts: **10C** (bounds on sorting), **12A–12D** (DP intro, DP steps & LCS, LCS example, DP applications). MIT 6.046J Lectures 05 (linear sorts), 06 (order statistics) and 15 (DP).

---

## 0. The 60-second master table (memorize this)

| Algorithm | Best | Expected | Worst | Space | Notes |
|---|---|---|---|---|---|
| MINIMUM or MAXIMUM | n − 1 compares | | **n − 1** | Θ(1) | optimal |
| MIN **and** MAX together | | | **3⌊n/2⌋** | Θ(1) | process in pairs; the lower bound is ⌈3n/2⌉ − 2 |
| Second smallest | | | n + ⌈lg n⌉ − 2 | | tournament (CLRS Ex 9.1-1) |
| RANDOMIZED-SELECT | Θ(n) | **Θ(n)** | **Θ(n²)** | Θ(1) iterative | recurses into **one** side |
| SELECT (median of medians, groups of 5) | Θ(n) | Θ(n) | **Θ(n)** | Θ(lg n) stack | T(n) ≤ T(n/5) + T(7n/10) + Θ(n) |
| Sort then index | Θ(n lg n) | Θ(n lg n) | Θ(n lg n) | | simple but slower |
| Any comparison sort (lower bound) | | Ω(n lg n) | **Ω(n lg n)** | | decision tree with ≥ n! leaves |
| COUNTING-SORT (keys 0..k) | Θ(n + k) | Θ(n + k) | **Θ(n + k)** | Θ(n + k) | **stable**, not in place |
| RADIX-SORT (d digits, base k) | | | **Θ(d(n + k))** | Θ(n + k) | LSD first with a **stable** digit sort |
| RADIX, b-bit keys, r-bit digits | | | Θ((b/r)(n + 2ʳ)) | | best r ≈ lg n gives Θ(bn / lg n) |
| BUCKET-SORT (uniform on [0, 1)) | Θ(n) | **Θ(n)** | Θ(n²) | Θ(n) | E[nᵢ²] = 2 − 1/n |
| Sort a k-sorted array (PS7) | | | **Θ(n lg(n/k))** | | sort each of the k blocks; matching lower bound |
| Subset sum (backtracking) | | | **O(2ⁿ)** | Θ(n) stack | T(n) = 2T(n − 1) + O(1); DP gives O(nT) |
| n-queens (backtracking) | | | O(n!·n) | Θ(n) | pruning cuts it drastically |
| CUT-STICK / compositions (Exercise 12) | | | **Θ(2ⁿ)** | | counts 2^(n−1) compositions |
| Plain recursive CUT-ROD | | | **Θ(2ⁿ)** calls | Θ(n) stack | T(n) = 1 + Σ T(j) |
| Rod cutting (memoized or bottom-up) | | | **Θ(n²)** | Θ(n) | n subproblems × O(n) choices |
| Fibonacci (memoized) | | | Θ(n) | Θ(n), or Θ(1) with 2 variables | |
| Matrix-chain order | | | **Θ(n³)** | Θ(n²) | Θ(n²) subproblems × O(n) splits |
| LCS-LENGTH | | | **Θ(mn)** | Θ(mn), or Θ(min(m, n)) for the length only | PRINT-LCS takes Θ(m + n) |
| Optimal BST | | | **Θ(n³)** | Θ(n²) | Knuth's trick gives Θ(n²) |
| 0-1 knapsack (capacity W) | | | Θ(nW) | Θ(nW) | **pseudo-polynomial** |
| Coin change (PS8, k coins) | | | **Θ(nk)** | Θ(n) | |
| Checkerboard (PS8) | | | **Θ(n²)** | Θ(n²) | |
| Edit distance / LPS / longest common substring | | | Θ(mn) / Θ(n²) / Θ(mn) | | |
| Party planning (Exercise 13, tree DP) | | | **Θ(n)** | Θ(n) | 2 states per node |
| LIS (DP) | | | Θ(n²) | Θ(n) | Θ(n lg n) with patience sorting |

---

## 1. Topic 10A · Selection & Order Statistics (CLRS Ch 9)

### 1.1 Definitions
- The **i-th order statistic** is the i-th smallest element. The minimum is i = 1 and the maximum is i = n.
- The **median** is the "halfway point." The **lower median** is at i = ⌊(n + 1)/2⌋ and the **upper median** at ⌈(n + 1)/2⌉. CLRS's "the median" means the lower median.
- **Selection problem:** given n distinct numbers and a rank i, return the element that is larger than exactly i − 1 others.

### 1.2 Minimum, maximum, both
- **MINIMUM takes exactly n − 1 comparisons, and that's optimal.** Think of a tournament: every element except the winner must lose at least once.
- **Min and max together: 3⌊n/2⌋ comparisons.**
  - Initialize: if n is odd, set min = max = A[1]. If n is even, compare A[1] with A[2].
  - Then process the rest **in pairs**. Compare the two with each other, the smaller with min, and the larger with max. That's 3 comparisons per 2 elements, instead of 4.
  - The lower bound is ⌈3n/2⌉ − 2, by an adversary argument.
- **Second smallest:** run a tournament of n − 1 comparisons. The runner-up lost directly to the winner, and the winner played ⌈lg n⌉ matches, so finding the runner-up takes ⌈lg n⌉ − 1 more comparisons. Total **n + ⌈lg n⌉ − 2**.

### 1.3 RANDOMIZED-SELECT (quickselect)
```
RANDOMIZED-SELECT(A, p, r, i)
  if p == r
      return A[p]                         // 1 ≤ i ≤ r − p + 1 is guaranteed
  q = RANDOMIZED-PARTITION(A, p, r)
  k = q − p + 1                           // rank of the pivot within A[p..r]
  if i == k
      return A[q]                         // the pivot is the answer
  elseif i < k
      return RANDOMIZED-SELECT(A, p, q − 1, i)
  else return RANDOMIZED-SELECT(A, q + 1, r, i − k)   // ADJUST the rank!
```
- **Correctness:** after PARTITION, A[p..q−1] ≤ A[q] < A[q+1..r], and the pivot has rank k. If i < k, the answer is the i-th smallest of the left side. If i > k, it's the **(i − k)-th** smallest of the right side.
- **Worst case Θ(n²):** an unlucky pivot can remove just one element per round.
- **Expected Θ(n), the "helpful partition" argument (CLRS 4e):** call a pivot **good** if its rank lies in the middle half, [n/4, 3n/4]. That happens with **probability ≥ ½**, and then at most 3n/4 elements survive. So you expect ≤ 2 partitions per shrink by a factor of ¾, and the total is a geometric series: E[T(n)] ≤ 2cn(1 + ¾ + (¾)² + …) = **8cn = O(n)**.
- **The 3e indicator proof:** E[T(n)] ≤ Σₖ (1/n) T(max(k − 1, n − k)) + O(n), then substitute E[T(n)] ≤ cn.
- **Why quicksort is n lg n but quickselect is n:** quickselect follows **one** branch, so the level costs shrink geometrically instead of each summing to n.

### 1.4 SELECT, worst-case linear (median of medians, CLRS 9.3)
1. Divide the n elements into ⌈n/5⌉ **groups of 5**, the last one possibly smaller.
2. Find each group's median by insertion-sorting the 5 elements. That's O(1) per group, so O(n) total.
3. **Recursively SELECT the median x of the ⌈n/5⌉ medians.**
4. Partition around x (a modified PARTITION that takes the pivot as input). Let k be x's rank.
5. If i = k, return x. Otherwise recurse on the side that contains rank i.

**Why the split is good:**
- At least half of the ⌈n/5⌉ groups have a median ≥ x, and each such group contributes ≥ 3 elements that are ≥ x (except possibly x's own group and the last group). So **at least 3n/10 − 6 elements are > x**, and the same number are < x.
- Either recursive side therefore has **≤ 7n/10 + 6** elements.

**Recurrence:** T(n) ≤ T(⌈n/5⌉) + T(7n/10 + 6) + O(n).
**Substitution proof:** guess T(n) ≤ cn for n ≥ 140. Then T(n) ≤ cn/5 + c + 7cn/10 + 6c + an = cn + (−cn/10 + 7c + an), which is ≤ cn whenever c ≥ 10a·n/(n − 70). For n ≥ 140 that holds with **c ≥ 20a**. ∎

- **Recursion-tree view:** 1/5 + 7/10 = 9/10 < 1, so the level costs shrink geometrically, giving **Θ(n)**.
- **Groups of 3 fail:** T(n/3) + T(2n/3) + O(n) = Θ(n lg n), because the fractions sum to 1.
- **Groups of 7 work:** T(n/7) + T(5n/7) + O(n), because 6/7 < 1.
- SELECT is slower than RANDOMIZED-SELECT in practice because of its big constants. **Randomness buys simplicity; determinism buys the guarantee.**

### 1.5 Applications (Exercise 10, PS6)
- **Oil pipeline (Exercise 10):**
  - Wells sit at y₁..yₙ and the pipe at height p, so the total spur length is Σ abs(yᵢ − p).
  - Moving the pipe up by d changes the total by d·(#wells below − #wells above). That's ≥ 0 exactly when p is at or above a median, so **the median minimizes the total**. Find it with SELECT in O(n).
  - For even n, **any p between the two middle values** is optimal.
- **QUICKSORT′ (Exercise 10):** use SELECT to find the true median as the pivot. Then T(n) = 2T(n/2) + O(n) = **Θ(n lg n) worst case**.
- **Exercise 10 recurrence T(n) = T(n/5) + T(2n/3) + cn:** 1/5 + 2/3 = 13/15 < 1, so it's linear. Guess c′n: we need c′(13/15) + c ≤ c′, so **c′ ≥ 15c/2**, giving **Θ(n)**.
- **k smallest in sorted order (PS6 P1):**
  1. x = SELECT(A, k): Θ(n).
  2. Partition around x, so A[1..k] are the k smallest: Θ(n).
  3. Sort A[1..k]: Θ(k lg k).

  Total **Θ(n + k lg k)**. Compare a full sort (Θ(n lg n)) and a heap (Θ(n + k lg n)).
- **k-th largest from a MEDIAN black box (PS6 P2):** the k-th largest is the **(n − k + 1)-th smallest**. Use the median as the pivot: partition around it, recurse on the side holding the rank, and adjust i. T(n) = T(n/2) + O(n) = **O(n)**.
- **k elements closest to the median:** SELECT the median, compute abs(A[j] − median) for every j, SELECT the k-th smallest distance, then one pass collects them. Θ(n).
- **Weighted median** and **k quantiles** (O(n lg k) via recursive median splitting) are extra CLRS problems in the same spirit.

---

## 2. Topic 10B · Lower Bounds & Linear-Time Sorts (CLRS Ch 8)

### 2.1 The decision-tree lower bound (CLRS 8.1)
- **Model:** a comparison sort learns about the input **only** by comparing pairs (aᵢ ≤ aⱼ?).
- **Decision tree:** each internal node is a comparison aᵢ : aⱼ, its two children are the outcomes, and each **leaf is an output permutation**. The algorithm runs along one root-to-leaf path, and the **height is the worst-case number of comparisons**.
- **Correctness forces ≥ n! reachable leaves:** each of the n! input orderings needs a different output permutation.
- **Theorem 8.1:** a binary tree of height h has ≤ 2ʰ leaves, so 2ʰ ≥ n!, which gives **h ≥ lg(n!) = Ω(n lg n)**.
  - The bound on lg(n!) follows from n! ≥ (n/2)^(n/2), so lg(n!) ≥ (n/2) lg(n/2) = Ω(n lg n).
- **Corollary 8.2:** heapsort and merge sort are **asymptotically optimal** comparison sorts.
- **Other decision-tree bounds:**
  - Searching a sorted array is Ω(lg n), because there are n + 1 possible outcomes.
  - The average-case comparison-sort bound is also Ω(n lg n).
  - **Merging two sorted lists of n elements needs 2n − 1 comparisons** in the worst case.
  - **Sorting a k-sorted array (PS7)** has ((n/k)!)ᵏ possible outputs, so it needs ≥ k·lg((n/k)!) = **Ω(n lg(n/k))** comparisons, and sorting each block matches that.
- **Small cases:** sorting 3 elements needs ⌈lg 6⌉ = **3** comparisons. Sorting 5 needs ⌈lg 120⌉ = 7, and 7 are achievable.

### 2.2 How linear sorts escape the bound
They don't compare keys. They use keys as **array indices or digits**, which requires extra assumptions:
- Counting sort needs a small integer range.
- Radix sort needs a fixed number of digits.
- Bucket sort needs a known (uniform) distribution.

The lower bound applies only to comparison sorts. **Counting sort with k = n³ is Θ(n³), which is worse than merge sort**, so the assumptions matter.

### 2.3 Counting sort (CLRS 8.2)
```
COUNTING-SORT(A, n, k)                    // keys are integers in 0..k
  let B[1..n] and C[0..k] be new arrays
  for i = 0 to k:  C[i] = 0
  for j = 1 to n:  C[A[j]] = C[A[j]] + 1   // C[i] = number of keys equal to i
  for i = 1 to k:  C[i] = C[i] + C[i − 1]  // C[i] = number of keys ≤ i
  for j = n downto 1                       // BACKWARDS ⇒ STABLE
      B[C[A[j]]] = A[j]
      C[A[j]] = C[A[j]] − 1
  return B
```
- **Θ(n + k)** time and space. **Not in place.** **Stable.**
- **Invariant of the last loop:** C[v] is the index of the **last free slot for key v**, i.e. the number of keys ≤ v that haven't been placed yet. Scanning j from n down to 1 means the **last** copy of each key gets the **highest** slot, which preserves the input order of equal keys.
- Running the last loop forwards still sorts, but it's **not stable**, which breaks radix sort.
- **Trace (CLRS):** A = ⟨2, 5, 3, 0, 2, 3, 0, 3⟩, k = 5.
  - Counts C = [2, 0, 2, 3, 0, 1]. Prefix sums C = [2, 2, 4, 7, 7, 8].
  - B = **⟨0, 0, 2, 2, 3, 3, 3, 5⟩**.
- Counting sort can also answer "how many keys fall in [a, b]?" in O(1) after Θ(n + k) preprocessing: C[b] − C[a − 1].

### 2.4 Radix sort (CLRS 8.3)
```
RADIX-SORT(A, n, d)
  for i = 1 to d                          // digit 1 = LEAST significant
      use a STABLE sort to sort A on digit i
```
- **Lemma 8.3:** n d-digit numbers whose digits each take up to k values sort in **Θ(d(n + k))** when the digit sort is a Θ(n + k) stable sort (counting sort).
- **Lemma 8.4:** n b-bit numbers with digits of r ≤ b bits sort in **Θ((b/r)(n + 2ʳ))**. Choosing r = ⌊lg n⌋ (when b ≥ lg n) gives Θ(bn / lg n), and when b = O(lg n), that's Θ(n).
- **Curveball:** sort n integers in the range 0..n³ − 1 in Θ(n). Write them in base n, so each has **3 digits**, giving Θ(3(n + n)) = Θ(n).
- **Loop invariant (Exercise 11):** after pass i, the array is sorted by the **i low-order digits**. For the maintenance step, compare any two elements a and b on digit i:
  1. **aᵢ < bᵢ:** digit i decides. The lower digits contribute less than 10^(i−1), so a < b on the last i digits, and the digit sort puts a first.
  2. **aᵢ > bᵢ:** symmetric.
  3. **aᵢ = bᵢ:** the digit sort keeps them in their **previous** relative order (**this is the one place stability is required**), which was correct for the last i − 1 digits by the induction hypothesis. Equal i-th digits don't change that.
- **MSD-first radix** without recursion on buckets is wrong, because later passes destroy earlier ones.
- Radix sort isn't in place (it uses counting sort's B array). Whether it beats quicksort depends on the constants and the cache.
- **Trace (CLRS):** 329, 457, 657, 839, 436, 720, 355.
  - By the ones digit: 720, 355, 436, 457, 657, 329, 839.
  - By the tens digit: 720, 329, 436, 839, 355, 457, 657.
  - By the hundreds digit: **329, 355, 436, 457, 657, 720, 839**.

### 2.5 Bucket sort (CLRS 8.4)
```
BUCKET-SORT(A, n)                         // assumes A[i] uniform on [0, 1)
  let B[0..n−1] be a new array of empty lists
  for i = 1 to n:  insert A[i] into list B[⌊n·A[i]⌋]
  for i = 0 to n − 1:  sort list B[i] with insertion sort
  concatenate B[0], B[1], …, B[n − 1] in order
```
- **Expected Θ(n):** E[T(n)] = Θ(n) + Σ O(E[nᵢ²]), and **E[nᵢ²] = 2 − 1/n**, using indicator variables Xᵢⱼ = I{A[j] lands in bucket i}. So E[T(n)] = Θ(n) + n·O(2 − 1/n) = Θ(n).
- **Worst case Θ(n²):** everything lands in one bucket and insertion sort takes Θ(n²). Using merge sort inside each bucket makes the worst case Θ(n lg n).
- It stays linear whenever the **sum of the squares of the bucket sizes is linear in n**, which holds for many distributions besides uniform.

### 2.6 Stability by decoration (Exercise 11)
- **Stable:** equal keys keep their original relative order.
- **To make any sort stable:** replace A[i] with the pair (A[i], i) and compare lexicographically. The index only breaks ties.
- **Cost:** at most one extra comparison per original comparison, so the asymptotic time is unchanged. You also need **n extra indices**: n lg n extra bits, or n words. State **both** the time and space impact; that's what's graded.

---

## 3. Topic 12 (Backtracking & Recursion Review) · Erickson Ch 1–2

### 3.1 The recipe
1. **Build a solution one decision at a time:** a queen per row, include or exclude an item, where the next word ends, which cell to move to.
2. **Try every option that is still legal** given the earlier choices.
3. **Recurse.** If the recursion fails, **undo** the choice (un-mark the cell, remove the queen) and try the next option.
4. **Prune:** abandon a branch as soon as it can't lead to a valid or better solution.

The recursion explores a **tree of partial solutions**. Running time = (number of recursion-tree nodes) × (work per node), which is usually exponential. The art is choosing **what each call needs to know**. For subset sum, that's just (index i, remaining target T).
**Proving it correct:** use induction on the number of remaining decisions. Each call tries every legal option, and by the inductive hypothesis each sub-call answers its subproblem correctly.

### 3.2 n-queens (Erickson 2.1)
```
PLACE-QUEENS(Q[1..n], r)                 // Q[i] = column of the queen in row i
  if r == n + 1
      print Q                            // all rows filled
  else for j = 1 to n
      legal = TRUE
      for i = 1 to r − 1
          if Q[i] == j or Q[i] == j + r − i or Q[i] == j − r + i    // same column or diagonal
              legal = FALSE
      if legal
          Q[r] = j
          PLACE-QUEENS(Q, r + 1)
```
- Rows are implicit, and the diagonal test is abs(Q[i] − j) = r − i.
- The search is at most n! partial placements × O(n) per check. Pruning makes it far smaller in practice.

### 3.3 Subset sum (Erickson 2.3)
```
SUBSET-SUM(X[1..n], i, T)                // is there a subset of X[i..n] summing to T?
  if T == 0
      return TRUE                         // empty subset works
  if T < 0 or i > n
      return FALSE                        // (T < 0 test assumes positive inputs)
  return SUBSET-SUM(X, i + 1, T)          // exclude X[i]
      or SUBSET-SUM(X, i + 1, T − X[i])   // include X[i]
```
- **T(n) = 2T(n − 1) + O(1) = O(2ⁿ).**
- **Correctness:** any subset of X[i..n] either contains X[i] or doesn't, so the two branches cover every case.
- **DP version:** the subproblems are (i, T) pairs, so there are n·T of them, giving **O(nT)**. That's **pseudo-polynomial**, since T can be exponential in the input size. Subset sum is NP-complete (Topic 24).

### 3.4 Text segmentation and LIS (Erickson 2.4, 2.6)
- **SPLITTABLE(i):** can A[i..n] be split into words?
  - If i > n, return TRUE.
  - Otherwise, for j = i..n: if IsWord(i, j) and SPLITTABLE(j + 1), return TRUE.
  - Return FALSE.
  - This is O(2ⁿ) worst case. **Memoized on i**, it's O(n²) calls to IsWord.
- **LIS (longest increasing subsequence):** LIS-BIGGER(prev, j) returns the longest increasing subsequence of A[j..n] whose elements all exceed A[prev].
  - Skip A[j]: LIS-BIGGER(prev, j + 1).
  - Take A[j], if A[j] > A[prev]: 1 + LIS-BIGGER(j, j + 1).
  - Return the max of the two.
  - It's exponential as written. The state is (prev, j), so the DP is **O(n²)**.

### 3.5 Course exercises and problem sets
- **CUT-STICK (Exercise 12):**
  - It counts the ways to cut a stick of length n into integral pieces, where order matters: the **compositions** of n.
  - Base case: CUT-STICK(0) = 1 (leave it uncut).
  - It returns **2^(n−1)** for n ≥ 1, because each of the n − 1 gaps is independently cut or not.
  - Running time: T(0) = c and T(n) = Σᵢ₌₁ⁿ T(n − i) + c(n + 1). Unrolling gives 3c, 7c, 15c, 31c, …, so **T(n) = c(2^(n+1) − 1) = Θ(2ⁿ)**, proved by substitution with a geometric sum.
  - It's exponential because the same CUT-STICK(j) is recomputed through every prefix. **Memoize it to get a polynomial algorithm.**
- **Largest perfect subtree (Exercise 12):**
  - **Perfect:** every internal node has 2 children **and** all leaves are at the same depth.
  - **Full** only requires the two children.
  - Recurrence: v is perfect iff both children are perfect **and height(l) = height(r)**. Compute it with one **post-order** traversal that returns (height, perfect?). That's **O(n)**; checking every node independently would be O(n²).
- **Palindrome / almost-palindrome (PS7 P3):**
  - IS-PALINDROME(s, i, j) recurses inward.
  - ALMOST-PALINDROME walks i and j inward while s[i] = s[j]. At the first mismatch it tries **deleting s[i] or s[j]**: return IS-PALINDROME(s, i+1, j) or IS-PALINDROME(s, i, j−1).
  - **Θ(n)**, because only one branch point is allowed.
- **Treasure hunt (PS7 P4):** PATH-EXISTS(M, r, c).
  - Off the map: FALSE. At X: TRUE. Water or an already-visited cell: FALSE.
  - Otherwise **mark** the cell 'v', try all 4 neighbours, and if none succeeds, **un-mark** it (that's the backtrack) and return FALSE.
  - Marking prevents infinite loops. Un-marking restores the map for other paths.
- **k-sorted array (PS7 1a):** merge-sort each of the k blocks of n/k elements. That's k·Θ((n/k) lg(n/k)) = **Θ(n lg(n/k))**, which matches the decision-tree lower bound.

### 3.6 When backtracking becomes DP
**Draw the recursion tree.** If the **same arguments recur** and the number of **distinct** subproblems is polynomial, cache the answers.
- Subset sum, text segmentation, LIS, CUT-STICK and rod cutting all simplify this way.
- n-queens doesn't, because every partial board is different.

**Erickson's mantra:** write the brute-force recursion and prove it correct **first**, then optimize.

---

## 4. Topic 12A · Dynamic Programming (CLRS 14.1–14.3, Erickson Ch 3)

### 4.1 The four steps (CLRS)
1. **Characterize the structure** of an optimal solution (optimal substructure).
2. **Recursively define** the value of an optimal solution.
3. **Compute** the value, top-down with memoization or bottom-up in dependency order.
4. **Construct** an optimal solution from the stored **choices**, such as s[j].

**Erickson's version:**
1. Specify the subproblem **in English** ("r[j] = the best revenue for a rod of length j").
2. Give the recurrence and base cases.
3. Choose a data structure (an array or table).
4. Find an evaluation order where every dependency comes first.
5. Analyze: **time ≈ (#subproblems) × (work per subproblem)**.
6. Write the code.

### 4.2 Rod cutting (CLRS 14.1)
- **Problem:** a rod of length n and prices pᵢ for length i. Maximize the revenue rₙ.
- **Recurrence:** **rₙ = max over 1 ≤ i ≤ n of (pᵢ + rₙ₋ᵢ)**, with r₀ = 0. The first piece has length i, and the rest is cut optimally.
- **Plain recursion:** CUT-ROD(n) calls CUT-ROD(n − i) for every i, so T(n) = 1 + Σⱼ₌₀ⁿ⁻¹ T(j) = **2ⁿ**.
```
MEMOIZED-CUT-ROD(p, n)                   MEMOIZED-CUT-ROD-AUX(p, n, r)
  let r[0..n] be a new array               if r[n] ≥ 0: return r[n]          // already solved
  for i = 0 to n: r[i] = −∞                if n == 0: q = 0
  return MEMOIZED-CUT-ROD-AUX(p, n, r)     else q = −∞
                                               for i = 1 to n
EXTENDED-BOTTOM-UP-CUT-ROD(p, n)                   q = max(q, p[i] + MEMOIZED-CUT-ROD-AUX(p, n − i, r))
  let r[0..n] and s[1..n] be new arrays    r[n] = q
  r[0] = 0                                 return q
  for j = 1 to n                         // increasing j: r[j − i] is ready
      q = −∞                             PRINT-CUT-ROD-SOLUTION(p, n)
      for i = 1 to j                       (r, s) = EXTENDED-BOTTOM-UP-CUT-ROD(p, n)
          if q < p[i] + r[j − i]           while n > 0
              q = p[i] + r[j − i]              print s[n]           // size of the first piece
              s[j] = i                         n = n − s[n]
      r[j] = q
  return r and s
```
- **Θ(n²)** both ways. The **subproblem graph** has n + 1 vertices and Θ(n²) edges, which matches the running time. The bottom-up order is a reverse topological order of that graph.
- **Trace (CLRS prices):** p = 1, 5, 8, 9, 10, 17, 17, 20, 24, 30 for i = 1..10.

| j | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| r[j] | 1 | 5 | 8 | 10 | 13 | 17 | 18 | 22 | 25 | 30 |
| s[j] | 1 | 2 | 3 | 2 | 2 | 6 | 1 | 2 | 3 | 10 |

For example, r[4] = 10 comes from cutting 2 + 2, and r[7] = 18 from 1 + 6.
- **Greedy fails:** with prices 1, 20, 33, 36 for lengths 1–4, the densities are 1, 10, 11, 9. Greedy takes length 3 first and gets 33 + 1 = 34, but two pieces of length 2 give **40**.

### 4.3 Matrix-chain multiplication (CLRS 14.2)
- Aᵢ is p_(i−1) × pᵢ. Multiplying a p×q matrix by a q×r matrix costs pqr scalar multiplications.
- **Goal:** the parenthesization of A₁⋯Aₙ that minimizes the cost. The number of parenthesizations is a Catalan number, Ω(4ⁿ/n^(3/2)), so brute force is hopeless.
- **Recurrence:** m[i, i] = 0, and **m[i, j] = min over i ≤ k < j of (m[i, k] + m[k+1, j] + p_(i−1)·p_k·p_j)**. Store the best split in s[i, j].
- **Fill order:** by increasing **chain length** l = 2..n, so every shorter chain is ready.
- **Θ(n³) time, Θ(n²) space.**
- **CLRS example:** dimensions 30, 35, 15, 5, 10, 20, 25 give **m[1, 6] = 15,125**, with parenthesization **((A₁(A₂A₃))((A₄A₅)A₆))**.

### 4.4 Elements of DP (CLRS 14.3)
- **Optimal substructure:** an optimal solution contains optimal solutions to its subproblems. Prove it with **cut-and-paste**: if a sub-solution weren't optimal, paste in a better one and get a better overall solution, which is a contradiction.
- **Independent subproblems are required.**
  - **Unweighted shortest simple path has optimal substructure.**
  - **Longest simple path does not.** In CLRS's 4-cycle example, q → r → t is a longest simple path from q to t, but its piece q → r is not the longest simple path from q to r (q → s → t → r is longer). Gluing two longest subpaths can **repeat vertices**, because the subproblems share resources.
- **Overlapping subproblems:** the number of distinct subproblems is polynomial even though the recursion tree is exponential. If they don't overlap, use plain divide and conquer (merge sort).
- **Memoization vs bottom-up:**

| | Memoized (top-down) | Bottom-up |
|---|---|---|
| Order | natural recursion; cache the results | loop in dependency order |
| Solves | only the subproblems actually needed | all subproblems |
| Overhead | recursive calls | tight loops, better constants |
| Space tricks | harder | easy: keep only the last row(s) |

- **Reconstruction:** store the **choice** (s[j], s[i, j], arrows) along with the value, or recompute it from the table.

### 4.5 More DP problems the course uses (PS8, Exercise 13)
- **Coin change (PS8 1e):** coins c[1..k] with c[1] = 1.
  - **C[v] = min over i with c[i] ≤ v of (C[v − c[i]] + 1)**, with C[0] = 0. Fill v = 1..n.
  - **Θ(nk)** time and Θ(n) space.
  - Greedy fails for arbitrary coins, e.g. {1, 3, 4} with target 6.
- **Checkerboard (PS8 P3):**
  - **D[r, c] = max(D[r−1, c] + p(straight), D[r−1, c−1] + p(diagonal), D[r−1, c+1] + p(diagonal))**, with D[1, c] = 0 for the bottom row.
  - The answer is the max over the top row. **Θ(n²).**
  - Handle the board edges (c = 1 and c = n), and remember payments can be negative.
- **Party planning (Exercise 13, tree DP):**
  - memo[v][1] = fun[v] + Σ over children of memo[c][0], because if v attends, its children (whom v supervises) can't.
  - memo[v][0] = Σ over children of max(memo[c][0], memo[c][1]).
  - Fill post-order: **Θ(n)**, with 2n states.
  - If the president must attend, the answer is memo[root][1]. To reconstruct, walk down and pick the larger state at each child.
- **0-1 knapsack:**
  - K[i, w] = max(K[i−1, w], K[i−1, w − wᵢ] + vᵢ), where the second option requires wᵢ ≤ w.
  - **Θ(nW), which is pseudo-polynomial.** Fractional knapsack is greedy (Topic 13).
- **Fibonacci:** F(n) = F(n−1) + F(n−2). Naive recursion is Θ(φⁿ); memoized it's Θ(n); and keeping only 2 variables gives Θ(1) space.
- **LIS:** L[j] = 1 + max over i < j with A[i] < A[j] of L[i]. Θ(n²).

---

## 5. Topic 12B · LCS & Optimal BSTs (CLRS 14.4–14.5)

### 5.1 Longest common subsequence
- A **subsequence** keeps the order but may skip letters, so BCBA is a subsequence of ABCBDAB. A **substring** must be contiguous. These are different problems.
- **Brute force:** there are 2ᵐ subsequences of X, each checked in Θ(n), so Θ(n 2ᵐ).
- **Theorem 14.1 (optimal substructure of an LCS):** let Z = z₁…z_k be any LCS of X = x₁…x_m and Y = y₁…y_n.
  1. If x_m = y_n, then z_k = x_m = y_n, and Z_(k−1) is an LCS of X_(m−1) and Y_(n−1).
  2. If x_m ≠ y_n and z_k ≠ x_m, then Z is an LCS of X_(m−1) and Y.
  3. If x_m ≠ y_n and z_k ≠ y_n, then Z is an LCS of X and Y_(n−1).

  Each case is a cut-and-paste argument.
- **Recurrence:** c[i, j] = 0 if i = 0 or j = 0; **c[i−1, j−1] + 1 if xᵢ = yⱼ**; otherwise **max(c[i−1, j], c[i, j−1])**.
```
LCS-LENGTH(X, Y, m, n)                     PRINT-LCS(b, X, i, j)        // Θ(m + n)
  let b[1..m, 1..n], c[0..m, 0..n] be new    if i == 0 or j == 0: return
  for i = 0 to m: c[i, 0] = 0                if b[i, j] == "↖"
  for j = 0 to n: c[0, j] = 0                    PRINT-LCS(b, X, i − 1, j − 1);  print xᵢ
  for i = 1 to m                             elseif b[i, j] == "↑": PRINT-LCS(b, X, i − 1, j)
      for j = 1 to n                         else PRINT-LCS(b, X, i, j − 1)
          if xᵢ == yⱼ
              c[i, j] = c[i−1, j−1] + 1;  b[i, j] = "↖"
          elseif c[i−1, j] ≥ c[i, j−1]
              c[i, j] = c[i−1, j];  b[i, j] = "↑"
          else c[i, j] = c[i, j−1];  b[i, j] = "←"
  return c and b
```
- **Θ(mn)** time and space. The c table alone is enough to rebuild the LCS: at (i, j), on a match go diagonal; otherwise move toward the neighbour that equals c[i, j].
- **The length alone needs only Θ(min(m, n)) space**, because row i depends only on row i − 1.
- When c[i−1, j] = c[i, j−1], either move works, which is why **several different LCSs** can have the same length.
- **CLRS example:** X = ABCBDAB and Y = BDCABA give an LCS of **length 4**, such as **BCBA** (BDAB also works).
- **Classic bug:** dropping the max() and always taking the diagonal. Also watch for off-by-one errors in row and column 0.

### 5.2 Related string DPs
| Problem | Recurrence idea | Time |
|---|---|---|
| Longest common **substring** | L[i, j] = L[i−1, j−1] + 1 on a match, else **0**; the answer is the **max entry**, not the corner | Θ(mn) |
| Edit distance | min(insert, delete, substitute) + 0 if the letters match | Θ(mn) |
| **Longest palindromic subsequence (Exercise 13)** | p[i][i] = 1. If X[i] = X[j], **p[i][j] = 2 + p[i+1][j−1]**; else **max(p[i+1][j], p[i][j−1])**. Fill by **increasing substring length** (the diagonals). Equivalently, the LCS of X and reverse(X) | Θ(n²) time and space |
| Almost-palindrome (PS7) | one deletion allowed, so a two-pointer scan with one branch | Θ(n) |
| diff / DNA alignment | LCS or edit distance with weights | Θ(mn) |

For LPS, the base case p[i][i+1] is 2 if X[i] = X[i+1] and 1 otherwise. The table has n(n + 1)/2 relevant cells.

### 5.3 Optimal binary search trees (CLRS 14.5)
- **Setup:** keys k₁ < … < kₙ with search probabilities pᵢ, and dummy keys d₀..dₙ (unsuccessful searches) with probabilities qᵢ.
- **Expected search cost:** E = Σ (depth(kᵢ) + 1) pᵢ + Σ (depth(dᵢ) + 1) qᵢ.
- **Optimal substructure:** any subtree of an optimal BST is optimal for its key range kᵢ..kⱼ.
- **Recurrence:**
  - w(i, j) = Σₗ₌ᵢʲ pₗ + Σₗ₌ᵢ₋₁ʲ qₗ.
  - e[i, i−1] = q_(i−1).
  - **e[i, j] = min over i ≤ r ≤ j of (e[i, r−1] + e[r+1, j] + w(i, j))**. Making r the root pushes every node one level deeper, which adds w(i, j).
- **Θ(n³)** (Θ(n²) subproblems × O(n) root choices). Knuth's observation that root[i, j−1] ≤ root[i, j] ≤ root[i+1, j] cuts it to Θ(n²).
- CLRS's 5-key example has an optimal expected cost of 2.75.
- **Greedy fails:** making the highest-probability key the root isn't always optimal.

---

## 6. Every lemma, theorem and loop invariant on MT3 (index)

| # | Statement | Where | Proof idea |
|---|---|---|---|
| 1 | MINIMUM needs n − 1 comparisons, which is optimal | CLRS 9.1 | every non-min element must lose once |
| 2 | Simultaneous min/max in 3⌊n/2⌋ comparisons | CLRS 9.1 | pairs |
| 3 | RANDOMIZED-SELECT is expected Θ(n) and worst Θ(n²) | CLRS 9.2 | good pivot with probability ≥ ½ ⇒ geometric series |
| 4 | SELECT: ≥ 3n/10 − 6 elements on each side of x; T(n) ≤ T(n/5) + T(7n/10 + 6) + O(n) = O(n) | CLRS 9.3 | counting groups; substitution with c ≥ 20a |
| 5 | The median minimizes Σ abs(yᵢ − p) | Exercise 10 / CLRS Problem 9-2 | moving p changes the sum by d(#below − #above) |
| 6 | Theorem 8.1: any comparison sort is Ω(n lg n) worst case | CLRS 8.1 | 2ʰ ≥ n! ⇒ h ≥ lg n! |
| 7 | Corollary 8.2: heapsort and merge sort are optimal | CLRS 8.1 | they match the bound |
| 8 | Counting sort is stable and Θ(n + k); last-loop invariant: C[v] = the last free slot for v | CLRS 8.2 | backwards scan |
| 9 | Lemma 8.3: radix Θ(d(n + k)); Lemma 8.4: Θ((b/r)(n + 2ʳ)) | CLRS 8.3 | d passes of counting sort |
| 10 | Radix invariant: after pass i, sorted on the i low digits (stability used when digits tie) | CLRS 8.3 / Exercise 11 | three cases |
| 11 | Bucket sort: E[nᵢ²] = 2 − 1/n ⇒ expected Θ(n) | CLRS 8.4 | indicator variables |
| 12 | Any sort can be stabilized with (key, index) pairs: same Θ time, n extra words | Exercise 11 | lexicographic comparison |
| 13 | k-sorted arrays need Ω(n lg(n/k)) comparisons, and that's achievable | PS7 P1 | decision tree with ((n/k)!)ᵏ leaves |
| 14 | SUBSET-SUM correct; T(n) = 2T(n − 1) + O(1) | Erickson 2.3 | induction on i |
| 15 | CUT-STICK(n) = 2^(n−1); T(n) = c(2^(n+1) − 1) | Exercise 12 | gaps cut or not; substitution |
| 16 | v roots a perfect subtree ⇔ both children are perfect with equal heights | Exercise 12 | post-order induction |
| 17 | Cut-rod recursion makes 2ⁿ calls; DP is Θ(n²) | CLRS 14.1 | T(n) = 1 + Σ T(j) |
| 18 | Matrix-chain m[i, j] recurrence; Θ(n³) | CLRS 14.2 | optimal split k |
| 19 | Optimal substructure via cut-and-paste; longest simple path fails (subproblems not independent) | CLRS 14.3 | counterexample |
| 20 | Theorem 14.1: LCS optimal substructure (3 cases) | CLRS 14.4 | cut-and-paste |
| 21 | Optimal BST e[i, j] recurrence with w(i, j); Θ(n³) | CLRS 14.5 | any subtree of an optimal BST is optimal |
| 22 | Party-planning recurrences (include ⇒ children excluded) | Exercise 13 | tree DP, 2 states |
| 23 | LPS recurrence and fill order by increasing length | Exercise 13 | endpoint case analysis |

---

## 7. Pathways: how to attack a problem you've never seen

### 7.1 "Find something without sorting" (selection problems)
```
Need one order statistic (median, k-th smallest/largest, percentile)?
├─ expected time is fine ........ RANDOMIZED-SELECT, Θ(n) expected
├─ guaranteed worst case ........ SELECT (median of medians), Θ(n)
├─ given a MEDIAN black box ..... partition around it, recurse on one half: T(n/2) + O(n) = O(n)   (PS6 P2)
├─ k-th LARGEST ................. = (n − k + 1)-th smallest
├─ k smallest, sorted ........... SELECT k-th + partition + sort k: Θ(n + k lg k)                     (PS6 P1)
├─ optimize Σ abs(yᵢ − p) ....... the median (Exercise 10); Σ (yᵢ − p)² → the mean
└─ only min/max ................. n − 1 compares; both: 3⌊n/2⌋
```

### 7.2 "Sort faster than n lg n?" decision
1. Are the keys **integers in a small range 0..k with k = O(n)**? Use **counting sort**, Θ(n + k).
2. Are they **d-digit / b-bit integers**, with a polynomial range like 0..n^c? Use **radix sort** with base n, Θ(cn).
3. Are they **real numbers, uniformly distributed**? Use **bucket sort**, expected Θ(n).
4. Is there **known structure**, like k-sorted blocks or few inversions? Exploit it: Θ(n lg(n/k)), or insertion sort in Θ(n + inversions).
5. Otherwise the answer is **Ω(n lg n)**. Prove the lower bound by counting the possible outputs (decision-tree leaves) and taking lg.

### 7.3 "Prove a lower bound" pathway
1. Count the number of **distinct outcomes** L the algorithm must distinguish: n! permutations, n + 1 search results, ((n/k)!)ᵏ k-sorted outputs.
2. A comparison-based algorithm is a binary decision tree with ≥ L leaves.
3. So its height is ≥ **⌈lg L⌉**. Simplify with lg(n!) = Θ(n lg n).
4. For "find the max"-type problems, use an **adversary** or **elimination** argument instead: every non-answer must lose a comparison.

### 7.4 "Design a DP" pathway (the one to practise)
1. **Write the brute-force recursion** (backtracking): what is the *last* (or first) decision? Try every option. Write the base cases.
2. **Name the subproblem in English** ("c[i, j] = LCS length of X[1..i] and Y[1..j]"). Its parameters are exactly the arguments the recursion needs.
3. **Prove optimal substructure** with cut-and-paste, and check that the subproblems are **independent**.
4. **Count the distinct subproblems** and the **choices per subproblem**. Their product is the running time.
5. **Pick an evaluation order** where dependencies come first:
   - Increasing j for rod cutting and coin change.
   - Increasing chain length for matrix-chain and optimal BST.
   - Increasing interval length for LPS.
   - Row by row for LCS and the checkerboard.
   - Post-order for tree DPs.
6. **Find where the answer lives:** the corner c[m, n], an endpoint r[n], the max over a row (checkerboard), or the root state (party).
7. **Store the choices** so you can reconstruct the solution: s[j], s[i, j], arrows.
8. **Check for space savings:** if you only need the previous row, keep 2 rows.

**Recognizing the pattern:**

| Phrase in the problem | DP shape |
|---|---|
| "best way to cut / split / make change for n" | 1-D over the amount: r[j] = best over the first choice |
| "two strings / sequences" | 2-D prefix table c[i, j] |
| "parenthesize / merge adjacent / build a tree over a range" | interval DP over [i, j], by increasing length |
| "path on a grid / board moving one direction" | row-by-row table (checkerboard) |
| "tree, parent–child constraint" | post-order with include/exclude states (party) |
| "subset with capacity / target" | (item, remaining capacity): pseudo-polynomial |

### 7.5 "Is greedy enough, or do I need DP?"
- Try the obvious greedy rule on a small counterexample first:
  - Rod densities 1, 20, 33, 36.
  - Coins {1, 3, 4} for 6.
  - Knapsack with W = 50 and items (10 kg, $60), (20, $100), (30, $120).
- If you find one, you need DP. If no counterexample exists and you can prove an exchange argument, greedy works (Topic 13, on MT4).

### 7.6 Backtracking design pathway
1. What's a **partial solution**, and what are the legal **next choices**?
2. What does the recursive call need to **know**? Keep the state small, e.g. index plus remaining target.
3. **Base cases:** success, and dead ends (out of bounds, target < 0, no rows left).
4. Can you **mark and un-mark**, so the shared state is restored after each branch (treasure hunt, n-queens)?
5. **Prune early**, checking constraints as soon as a choice is made.
6. Analyze it with a recurrence like T(n) = b·T(n − 1) + f(n), then **look for repeated subproblems**, which means it's time to memoize.

### 7.7 Writing pseudocode the grader rewards (Correctness 40 / Modularity 30 / Efficiency 30)
- Name the procedures as asked: RANDOMIZED-SELECT, SELECT, COUNTING-SORT, RADIX-SORT, CUT-STICK, PATH-EXISTS, MAKE-CHANGE, MAX-DOLLARS, LCS-LENGTH, PARTY-FUN, LPS-LENGTH.
- Factor out helpers (PARTITION-AROUND, MAX-OF-ROW, IS-PALINDROME, INSIDE checks).
- Comment the **subproblem definition, recurrence, fill order and running time**.
- **Efficiency traps:**
  - Selection must recurse on **one** side and adjust the rank (i − k).
  - Counting sort's last loop must go **n downto 1**.
  - Radix sort must use a stable sort, least significant digit first.
  - DP must be **bottom-up when asked** ("non-recursive"), with no nested recomputation.
  - The checkerboard must be Θ(n²), not exponential path enumeration.
  - Almost-palindrome must be Θ(n), not "try deleting every character".
  - CUT-STICK is *expected* to be exponential; the exercise analyzes that, it doesn't avoid it.

---

## 8. Practice map: what to drill and where (Question Hub)

| Skill | Site resources |
|---|---|
| Selection | RANDOMIZED-SELECT visualizer (t10a); arena **`rand-select`**, **`mom-select`**; **PS6 P1 `ps6-ksmall`**, **PS6 P2 `ps6-kthlargest`**; Exercise 10 notes |
| Lower bounds and linear sorts | COUNTING-SORT and RADIX-SORT visualizers (t10b); arena **`counting`**, **`radix-lsd`**; Exercise 11 MC set (stability, radix invariant); **PS7 1(a) `ps7-ksorted`** |
| Backtracking | n-queens visualizer (t12s); arena **`cut-stick`**; Exercise 12 MC set (CUT-STICK, perfect subtree); **PS7 P3 `ps7-almostpal`**, **PS7 P4 `ps7-treasure`** |
| Dynamic programming | bottom-up rod-cutting visualizer (t12a); arena **`party-fun`**; **PS8 1(e) `ps8-coins`**, **PS8 P3 `ps8-checker`** |
| LCS / string DP | LCS table and traceback visualizer (t12b); arena **`lcs`**, **`lps-length`**; 🎲 LCS-length generator |

### 8.1 Model pathways for each PS / exercise problem
- **PS6 P1 (k smallest, sorted):** you don't need all n sorted, so select first. SELECT(k) in Θ(n), partition, then sort only k elements in Θ(k lg k). Compare the three approaches: full sort Θ(n lg n), heap Θ(n + k lg n), selection Θ(n + k lg k).
- **PS6 P2 (k-th largest via MEDIAN):** convert to the (n − k + 1)-th smallest. Partition around the median, recurse into the half holding the rank, and adjust i. T(n) = T(n/2) + O(n) = O(n) by master case 3.
- **PS7 1(a) (k-sorted):** the blocks are already in order, so sort within the blocks only, for Θ(n lg(n/k)). The decision-tree count ((n/k)!)ᵏ shows you can't do better.
- **PS7 P3 (almost palindrome):** use two pointers. At the first mismatch there are only two candidate deletions, so make two O(n) checks. Θ(n).
- **PS7 P4 (treasure hunt):** this is backtracking with mark and un-mark. The base cases come in a specific order: bounds, then treasure, then water or visited.
- **PS8 1(e) (coin change):** the subproblem C[v] is the fewest coins for v. There are k choices for the last coin, so Θ(nk) bottom-up, with ∞ for unreachable amounts.
- **PS8 P3 (checkerboard):** the subproblem D[r, c] is the best total to reach (r, c). There are 3 predecessors, so Θ(n²). The answer is the max over the top row. Watch the edge columns.
- **Exercise 10:** the median minimizes the pipeline cost; QUICKSORT′ with a SELECT pivot is Θ(n lg n) worst case; and the substitution proof for T(n/5) + T(2n/3) + cn gives c′ ≥ 15c/2.
- **Exercise 11:** stabilize any sort with indices (same time, n extra words), and prove the radix invariant with the three cases.
- **Exercise 12:** CUT-STICK counts 2^(n−1) and runs in Θ(2ⁿ). The largest perfect subtree takes one post-order pass with (height, perfect?).
- **Exercise 13:** party planning with 2 states per node in Θ(n), and LPS with its recurrence, diagonal fill order and Θ(n²).

### 8.2 Likely curveball questions and the one-line answer
- *Is RANDOMIZED-SELECT linear worst case?* No, it's Θ(n²) worst case and Θ(n) expected. SELECT is the worst-case linear one.
- *Why groups of 5?* Because 1/5 + 7/10 < 1. Groups of 3 give Θ(n lg n). Groups of 7 also work.
- *Does selection recurse on both sides?* No, only on one. That's why it's linear.
- *What do you recurse on when i > k?* The right side with rank **i − k**.
- *Does the Ω(n lg n) bound apply to counting sort?* No. It doesn't compare keys.
- *How many leaves must a sorting decision tree have?* At least n!.
- *How many comparisons to sort 3 elements?* 3.
- *Why is counting sort's last loop backwards?* For stability.
- *What does radix sort require of its digit sort?* Stability. *Which digit goes first?* The least significant.
- *Sort integers in 0..n³ − 1 in linear time?* Radix sort in base n with 3 passes.
- *What's bucket sort's worst case?* Θ(n²).
- *Is counting sort in place?* No.
- *Is subset-sum DP polynomial?* No. O(nT) is pseudo-polynomial.
- *Does every optimization problem have optimal substructure?* No. Longest simple path doesn't.
- *What's the difference between memoization and bottom-up?* They have the same asymptotic cost. Memoization solves only the needed subproblems; bottom-up has better constants.
- *How fast is LCS?* Θ(mn) time. PRINT-LCS takes Θ(m + n).
- *Is LCS the same as longest common substring?* No, the substring version uses a different recurrence.
- *How fast are matrix-chain and optimal BST?* Θ(n³).
- *How fast is rod cutting, and how fast is the naive version?* Θ(n²), versus 2ⁿ naive.
- *What is CUT-STICK(n), and what is its running time?* It returns 2^(n−1) and runs in Θ(2ⁿ).
- *DP running-time formula?* (Number of subproblems) × (choices per subproblem).

---

## 9. Last-minute recall list (write these from memory before the exam)
1. RANDOMIZED-SELECT code with the i − k adjustment; the expected Θ(n) argument (good pivot with probability ½ gives a geometric series); worst case Θ(n²).
2. SELECT's 5 steps, the 3n/10 − 6 count, the recurrence T(n/5) + T(7n/10 + 6) + O(n), and why groups of 3 fail.
3. The decision-tree proof: n! leaves, 2ʰ ≥ n!, lg n! = Ω(n lg n). Corollary 8.2.
4. COUNTING-SORT code (prefix sums, backwards loop) and the CLRS trace.
5. RADIX-SORT, Lemmas 8.3 and 8.4, the invariant with three cases, and the 0..n³ trick.
6. Bucket sort: E[nᵢ²] = 2 − 1/n, expected Θ(n), worst Θ(n²).
7. The backtracking recipe, subset sum, n-queens, and CUT-STICK = 2^(n−1).
8. The four DP steps, the rod-cutting recurrence, and the r/s table for the CLRS prices.
9. The matrix-chain recurrence and fill order; LCS Theorem 14.1, its recurrence and the ABCBDAB example.
10. The cut-and-paste proof pattern and the longest-simple-path counterexample.

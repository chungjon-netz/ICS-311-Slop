# ICS 311 · Midterm 1 Crib Sheet
> **Wed 09/09 (Week 3)** · Topics 1 & 4 (data structures), 3 (growth), 2 (correctness), 7 (divide & conquer). CLRS 4e Ch 1–4, 10, App. A · screencasts 02A–02E, 03A–03D, 04A–04B, 07A–07D.

## 0 · Master tables

### Operation costs
| Operation | Unsorted array | Sorted array | Doubly linked list |
|---|---|---|---|
| access k-th | Θ(1) | Θ(1) | Θ(n) |
| SEARCH | Θ(n) | Θ(lg n) | Θ(n) |
| INSERT | Θ(1) at end | Θ(n) shift | Θ(1) given position |
| DELETE (pointer) | Θ(n) shift | Θ(n) | Θ(1) |
| MIN / MAX | Θ(n) | Θ(1) | Θ(n) |
| SUCC / PRED | Θ(n) | Θ(1) | Θ(n) |
Stack PUSH/POP and queue ENQUEUE/DEQUEUE: Θ(1). Singly linked DELETE needs the predecessor: Θ(n).

### Algorithms of the unit
| Algorithm | Best | Worst | Space · stable |
|---|---|---|---|
| Insertion sort | Θ(n) sorted | Θ(n²) reversed | Θ(1) · yes |
| Selection sort | Θ(n²) | Θ(n²) | Θ(1) · no |
| Merge sort | Θ(n lg n) | Θ(n lg n) | Θ(n) · yes |
| MERGE | Θ(n) | Θ(n) | Θ(n) |
| Linear search | Θ(1) | Θ(n) | Θ(1) |
| Binary search | Θ(1) | Θ(lg n) | Θ(1) |
| Local max (PS2) | Θ(1) | Θ(lg n) | Θ(lg n) stack |
| Max subarray (D&C) | Θ(n lg n) | Θ(n lg n) | Kadane Θ(n) |
| Strassen | Θ(n^(lg 7)) | ≈ n^2.81 | 7 products |

### Recurrences to know cold
| Recurrence | Solution | Method |
|---|---|---|
| 2T(n/2) + Θ(n) | Θ(n lg n) | master 2 |
| T(n/2) + Θ(1) | Θ(lg n) | master 2 |
| T(n − 1) + Θ(n) | Θ(n²) | unroll |
| 2T(n − 1) + Θ(1) | Θ(2ⁿ) | unroll |
| 9T(n/3) + n | Θ(n²) | case 1 |
| 3T(n/4) + n lg n | Θ(n lg n) | case 3 |
| 2T(n/2) + n lg n | Θ(n lg² n) | case 2, k = 1 |
| 2T(n/2) + n / lg n | Θ(n lg lg n) | gap |
| 3T(n/3) + Θ(n²) | Θ(n²) | case 3 (Ex 3) |
| T(n/3) + T(2n/3) + n | Θ(n lg n) | tree |
| T(n/5) + T(7n/10) + n | Θ(n) | tree |
| 2T(√n) + lg n | Θ(lg n lg lg n) | m = lg n |

## 1 · Data structures (Topics 1 & 4)

### Vocabulary
- **Algorithm:** finite, unambiguous steps; **correct** iff it halts with the right output on **every** instance.
- **Analysis** = correctness (invariants, induction) + cost (input size n, RAM model, count steps).
- **RAM model:** arithmetic, compare, assign, index, call/return each O(1). Sorting or xᵏ is not one step.
- **ADT** = contract (what); **data structure** = implementation (cost).
- Dynamic set: SEARCH, INSERT, DELETE (takes a pointer), MIN, MAX, SUCC, PRED.

### Stacks and circular queues
```
PUSH(S, x)
  if S.top == S.size: error "overflow"
  S.top = S.top + 1;  S[S.top] = x
POP(S)
  if S.top == 0: error "underflow"
  S.top = S.top − 1
  return S[S.top + 1]
ENQUEUE(Q, x)
  Q[Q.tail] = x
  if Q.tail == Q.size: Q.tail = 1
  else Q.tail = Q.tail + 1
DEQUEUE(Q)   // same wrap on Q.head
```
- Queue **empty** when head = tail; **full** when head = tail + 1 (mod size), so it holds **n − 1** items.
- **Linked stack with CATENATE in O(1) (PS1):** keep head, **tail** and a size field; S.tail.next = T.head; S.tail = T.tail; handle empty S or T.
- Queue from two stacks: O(1) amortized.

### Linked lists and trees
- LIST-SEARCH Θ(n); PREPEND / INSERT(x after y) Θ(1); DELETE Θ(1) given x (doubly linked).
- **Sentinel L.nil** makes the list circular, so x.prev.next = x.next and x.next.prev = x.prev with no NIL tests. Same asymptotics.
- Reverse a singly linked list: Θ(n) time, Θ(1) space.
- Binary node: p, left, right. **Left-child, right-sibling** handles any branching in O(n) space; COUNT-CHILDREN walks the sibling list (PS1 P6).
- Iterative traversal (PS1 5a): pop, print, push right, push left: Θ(n).
- Depth = edges from the root; height = longest path down to a leaf. A height-h binary tree has ≤ 2^(h+1) − 1 nodes.

## 2 · Growth of functions (Topic 3)

### Definitions (∃ c > 0, n₀; ∀ n ≥ n₀)
| | Definition | Like |
|---|---|---|
| f = O(g) | 0 ≤ f(n) ≤ c·g(n) | ≤ |
| f = Ω(g) | 0 ≤ c·g(n) ≤ f(n) | ≥ |
| f = Θ(g) | c₁g(n) ≤ f(n) ≤ c₂g(n) | = |
| f = o(g) | **∀** c > 0: f(n) < c·g(n) | < |
| f = ω(g) | **∀** c > 0: f(n) > c·g(n) | > |
- **Thm 3.1:** Θ ⇔ O and Ω. o ⇒ O, but not conversely.
- f = g exactly: O, Ω, Θ hold; **o and ω fail**.
- Σᵢ O(1) over n terms is O(n), not O(1).

### Limit test and ladder
- L = lim f/g. L = 0 ⇒ o; 0 < L < ∞ ⇒ Θ; L = ∞ ⇒ ω; no limit ⇒ test fails (n vs n^(1+sin n) incomparable).
- 1 < lg* n < lg lg n < lg n < lgᵏ n < n^ε < √n < n < n lg n < n² < 2ⁿ < 3ⁿ < n! < nⁿ.
- Polylog = o(poly); poly = o(exp); 2ⁿ = o(3ⁿ); n^1.01 beats n lg n; 2^(2n) ≠ O(2ⁿ) but 2^(n+1) = Θ(2ⁿ).
- **lg(n!) = Θ(n lg n)** (Stirling; n! ≥ (n/2)^(n/2)).
- Proof by definition: 3n² + 10n + 5 ≤ 4n² for n ≥ 11; disprove n² = O(n) since n ≤ c fails.

### Identities and sums
- log_b a = log_c a / log_c b (base = constant); **a^(log_b c) = c^(log_b a)**, so 3^(lg n) = n^(lg 3).
- x − 1 < ⌊x⌋ ≤ x ≤ ⌈x⌉ < x + 1.
- Σ i = n(n + 1)/2; Σ i² = Θ(n³); Σₖ₌₀ⁿ xᵏ = (x^(n+1) − 1)/(x − 1).
- x < 1: Σ xᵏ = 1/(1 − x); **Σ k xᵏ = x/(1 − x)²**, so Σ k/2ᵏ = 2.
- Hₙ = Σ 1/k = ln n + O(1); Σ lg k = Θ(n lg n).
- Lower bound a sum by its top half: Σ k ≥ (n/2)(n/2).
- Transitivity (all five), reflexivity (O, Ω, Θ), symmetry (Θ), f = O(g) ⇔ g = Ω(f).

## 3 · Correctness and analysis (Topic 2)

### Insertion sort and its invariant
```
INSERTION-SORT(A, n)
  for i = 2 to n
    key = A[i];  j = i − 1
    while j > 0 and A[j] > key
      A[j + 1] = A[j];  j = j − 1
    A[j + 1] = key
```
- **Invariant:** before each for iteration, A[1..i−1] holds the **original** first i − 1 elements, **sorted**.
- **Init** i = 2 (one element). **Maintenance:** shift larger keys right, drop key in. **Termination** i = n + 1 ⇒ A[1..n] sorted.
- Inner invariant: A[j+2..i] = old A[j+1..i−1] shifted, all > key.
- Stable (strict >), in place.

### Trace: insertion sort on ⟨5, 2, 4, 6, 1, 3⟩
| i | key | array after the pass | shifts |
|---|---|---|---|
| 2 | 2 | 2 5 4 6 1 3 | 1 |
| 3 | 4 | 2 4 5 6 1 3 | 1 |
| 4 | 6 | 2 4 5 6 1 3 | 0 |
| 5 | 1 | 1 2 4 5 6 3 | 4 |
| 6 | 3 | 1 2 3 4 5 6 | 3 |
Total shifts 9 = number of inversions of the input.

### Loop-invariant method
- Init (true before), Maintenance (preserved), **Termination** (invariant + exit condition ⇒ goal; say why it halts).
- Find it by asking "what has the loop done so far?"
- **Linear search:** x ∉ A[1..i−1]; the test runs n + 1 times.
- **Binary search:** x ∈ A ⇒ x ∈ A[left..right]; the range halves ⇒ ⌊lg n⌋ + 1 iterations. Use mid ± 1.
- **Selection sort:** A[1..i−1] = the i − 1 smallest, sorted.
- **Horner:** y = Σₖ a_(k+i+1)xᵏ; Θ(n).

### Cost analysis
- T(n) = Σ cᵢtᵢ. Insertion sort: tᵢ = 1 sorted ⇒ an + b = Θ(n); tᵢ = i reversed ⇒ an² + bn + c = Θ(n²).
- **Shifts = inversions.** A random input has n(n − 1)/4 expected inversions. Count them in Θ(n lg n) with a modified MERGE.
- Nested loops: **sum** t(i), e.g. Σ (n − i + 1) = Θ(n²). Sandwich: ≤ n·n and ≥ (n/2)(n/2).
- Ex 1 recipe: write the exact T(n) with fₓ(n), bound it, then simplify. Report the worst case.
- In place = Θ(1) extra; stable = equal keys keep their order.

## 4 · Divide & conquer (Topic 7)

### Merge sort
```
MERGE-SORT(A, p, r)
  if p ≥ r: return
  q = ⌊(p + r)/2⌋
  MERGE-SORT(A, p, q)
  MERGE-SORT(A, q + 1, r)
  MERGE(A, p, q, r)       // Θ(n)
MERGE(A, p, q, r)
  copy A[p..q] → L, A[q+1..r] → R
  i = j = 0;  k = p
  while i < nL and j < nR
    if L[i] ≤ R[j]: A[k] = L[i]; i++
    else A[k] = R[j]; j++
    k++
  copy the leftover of L or R
```
- **MERGE invariant:** A[p..k−1] = the k − p smallest of L ∪ R, sorted; L[i] and R[j] are the smallest uncopied. Take from L on ties (≤) ⇒ **stable**.
- Correct by strong induction on n. T(n) = 2T(n/2) + Θ(n): lg n + 1 levels × cn.

### Substitution
- Guess, prove the **exact** form by induction with the same c, then fix the base cases (n₀ = 2 if T(1) breaks lg).
- 2T(n/2) + n ≤ cn lg n − cn + n ≤ cn lg n for c ≥ 1.
- **Trap:** "T(n) ≤ cn + n = O(n)" is wrong.
- **Fix:** subtract a lower-order term: T ≤ cn − d works for 2T(n/2) + 1 when d ≥ 1.
- Change variables: m = lg n.

### Recursion tree
- Per level: (# nodes) × (cost per node). Equal levels ⇒ × lg n; shrinking ⇒ the root wins; growing ⇒ the leaves win (n^(log_b a) leaves).
- 3T(n/4) + cn²: (3/16)ⁱcn² ⇒ Θ(n²).
- T(n/3) + T(2n/3) + cn: full to depth log₃ n, longest path log_(3/2) n ⇒ Θ(n lg n).
- Use the tree to guess, then prove by substitution (Ex 3 wants all three methods).

### Master theorem, T(n) = aT(n/b) + f(n)
- **Case 1:** f = O(n^(log_b a − ε)) ⇒ Θ(n^(log_b a)).
- **Case 2:** f = Θ(n^(log_b a) lgᵏ n), k ≥ 0 ⇒ Θ(n^(log_b a) lg^(k+1) n).
- **Case 3:** f = Ω(n^(log_b a + ε)) **and** af(n/b) ≤ cf(n) with c < 1 ⇒ Θ(f(n)).
- Gaps: not polynomially apart (n / lg n). Not for T(n − 1), unequal splits, or non-constant a.
- 4T(n/2) + n² = Θ(n² lg n); 8T(n/2) + n² = Θ(n³); 2T(n/4) + √n = Θ(√n lg n).
- **Akra-Bazzi:** Σ aᵢ/bᵢᵖ = 1 ⇒ Θ(nᵖ(1 + ∫ f(x)/x^(p+1) dx)).

### Master method, worked
| Recurrence | n^(log_b a) | Case | Answer |
|---|---|---|---|
| 4T(n/2) + n | n² | 1 | Θ(n²) |
| 4T(n/2) + n² | n² | 2 | Θ(n² lg n) |
| 4T(n/2) + n³ | n² | 3 | Θ(n³) |
| 8T(n/2) + n² | n³ | 1 | Θ(n³) |
| 7T(n/2) + n² | n^2.807 | 1 | Θ(n^(lg 7)) |
| 2T(n/4) + √n | √n | 2 | Θ(√n lg n) |
| 2T(n/4) + 1 | √n | 1 | Θ(√n) |
| T(2n/3) + 1 | 1 | 2 | Θ(lg n) |
Regularity for 3T(n/4) + n lg n: 3(n/4) lg(n/4) ≤ (3/4) n lg n, so c = 3/4 works.

### D&C examples
- **Local max (PS2 7a):** recurse toward a larger neighbour; a peak of that side is a peak of A. T(n/2) + Θ(1).
- **Max subarray:** left, right, or crossing mid (Θ(n) scan) ⇒ Θ(n lg n). Kadane: best and best-ending-here, Θ(n).
- **Matrix multiply:** 8T(n/2) + Θ(n²) = Θ(n³); Strassen 7 products ⇒ Θ(n^(lg 7)).
- **`stupid_sort` (Ex 3):** 3T(n/3) + Θ(n²) = Θ(n²); the combine step dominates.

## 5 · Pathways and exam traps

### Lemma / invariant index
- Insertion, linear search, binary search, selection, MERGE invariants · merge sort by strong induction.
- Thm 3.1 · lg(n!) = Θ(n lg n) · polylog < poly < exp · shifts = inversions.
- Master theorem with regularity · substitution exact form · Akra-Bazzi.
- Queue holds n − 1 · LCRS is O(n) · local max side contains a peak.

### Attacking a new problem
- **Compare f, g:** simplify, place on the ladder, take the ratio limit, then fill **every** column.
- **Prove correct:** loop ⇒ invariant (Init / Maint / Term + halting); recursion ⇒ strong induction (base, IH on the calls, combine).
- **Runtime:** iterative ⇒ cᵢtᵢ table and sums; recursive ⇒ recurrence. Name the best and worst inputs. Say Θ only with both bounds.
- **Solve the recurrence:** aT(n/b) + f ⇒ master; unequal splits ⇒ tree or Akra-Bazzi; T(n − c) ⇒ unroll; √n ⇒ change variables; "prove" ⇒ substitution.
- **Design D&C:** independent halves, cheap combine, base case first; throwing away one side gives T(n/2).
- **Pick a structure:** undo ⇒ stack; FIFO ⇒ queue; O(1) splice ⇒ list with tail; any branching ⇒ LCRS; static search ⇒ sorted array.

### Curveballs
- Insertion sort is Θ(n²) **worst case** only; the best case is Θ(n).
- Merge sort is O(n²) (true) but Θ(n lg n) (tight).
- Θ ⇒ never o. log₂ n = Θ(log₁₀ n). Master can't do T(n − 1) + n.
- MERGE uses ≤ for stability · merge sort Θ(n) extra space · sentinels don't change Θ.
- Grader: name the procedures, comment the invariant and Θ, handle underflow and empty, binary search must halve, CATENATE must be O(1).

# ICS 311 · Midterm 1 Crib Sheet

**Exam:** Wed 09/09 (Week 3). **Covers:** Topics 1 & 4 (Intro, Basic Data Structures), 3 (Growth of Functions), 2 (Correctness & Analysis), 7 (Divide & Conquer, Recurrences).
**Nothing is excluded:** Monday 09/07 is the Labor Day holiday, so no topic was taught in exam week.

> **CLRS 4th-edition chapter map.** Ch 1 (role of algorithms) · Ch 2 (2.1 insertion sort, 2.2 analyzing algorithms, 2.3 merge sort / divide & conquer) · Ch 3 (3.1 O/Ω/Θ informally, 3.2 formal definitions, 3.3 standard notations: floors, mod, polynomials, exponentials, logs, factorials, Fibonacci) · Ch 4 (4.1 matrix multiplication, 4.2 Strassen, 4.3 substitution, 4.4 recursion trees, 4.5 master method, 4.6 master theorem proof, 4.7 Akra-Bazzi) · Ch 10 (10.1 arrays/matrices/stacks/queues, 10.2 linked lists, 10.3 rooted trees) · Appendix A (summations). Screencasts: **04A–04B** (data structures), **03A–03D** (growth), **02A–02E** (insertion sort, invariants, merge sort), **07A–07D** (D&C, substitution, recursion trees, master method). MIT 6.046J Lectures 01–03. Erickson Appendix I (induction).

---

## 0. The 60-second master table (memorize this)

**Data-structure operation costs**

| Operation | Unsorted array | Sorted array | Doubly linked list | Stack / queue |
|---|---|---|---|---|
| Access k-th element | Θ(1) | Θ(1) | Θ(n) | — |
| SEARCH(key) | Θ(n) | **Θ(lg n)** binary search | Θ(n) | — |
| INSERT | Θ(1) at end (if room) | Θ(n) (shift) | **Θ(1)** given position | PUSH / ENQUEUE Θ(1) |
| DELETE given pointer/index | Θ(n) shift (Θ(1) if order doesn't matter) | Θ(n) | **Θ(1)** (doubly linked) | POP / DEQUEUE Θ(1) |
| MINIMUM / MAXIMUM | Θ(n) | Θ(1) | Θ(n) | — |
| SUCCESSOR / PREDECESSOR | Θ(n) | Θ(1) | Θ(n) | — |

**Algorithms of the unit**

| Algorithm | Best | Average | Worst | Space | Stable? / notes |
|---|---|---|---|---|---|
| Insertion sort | **Θ(n)** sorted input | Θ(n²) | **Θ(n²)** reverse sorted | Θ(1) in place | stable; shifts = inversions |
| Selection sort | Θ(n²) | Θ(n²) | Θ(n²) | Θ(1) | not stable (swap version) |
| Bubble sort | Θ(n²) (Θ(n) with early-exit flag) | Θ(n²) | Θ(n²) | Θ(1) | stable |
| Merge sort | Θ(n lg n) | Θ(n lg n) | **Θ(n lg n)** | **Θ(n)** extra | stable (take from L on ties) |
| MERGE (n elements) | Θ(n) | Θ(n) | Θ(n) | Θ(n) | |
| Linear search | Θ(1) | ≈ (n+1)/2 probes | Θ(n) | Θ(1) | |
| Binary search | Θ(1) | Θ(lg n) | **Θ(lg n)** | Θ(1) iterative | sorted input required |
| Max subarray (D&C) | Θ(n lg n) | | Θ(n lg n) | Θ(lg n) stack | Kadane's scan is Θ(n) |
| Naive square-matrix multiply | Θ(n³) | | Θ(n³) | | T(n) = 8T(n/2) + Θ(n²) |
| Strassen | Θ(n^(lg 7)) ≈ n^2.81 | | | Θ(n²) | T(n) = 7T(n/2) + Θ(n²) |
| Local max / peak finding (PS2) | Θ(1) | | **Θ(lg n)** | | T(n) = T(n/2) + Θ(1) |

**Recurrences you must know cold**

| Recurrence | Answer | How |
|---|---|---|
| T(n) = 2T(n/2) + Θ(n) | Θ(n lg n) | master case 2 (merge sort) |
| T(n) = T(n/2) + Θ(1) | Θ(lg n) | master case 2 (binary search) |
| T(n) = T(n − 1) + Θ(n) | Θ(n²) | unroll: arithmetic series (insertion sort worst, recursive) |
| T(n) = T(n − 1) + Θ(1) | Θ(n) | unroll |
| T(n) = 2T(n − 1) + Θ(1) | Θ(2ⁿ) | unroll: geometric series |
| T(n) = 9T(n/3) + n | Θ(n²) | case 1 |
| T(n) = 3T(n/4) + n lg n | Θ(n lg n) | case 3 + regularity |
| T(n) = 2T(n/2) + n lg n | Θ(n lg² n) | case 2 with k = 1 (4e) |
| T(n) = 2T(n/2) + n / lg n | Θ(n lg lg n) | **gap**: no master case |
| T(n) = 3T(n/3) + Θ(n²) | Θ(n²) | case 3 (Exercise 3 `stupid_sort`) |
| T(n) = T(n/3) + T(2n/3) + n | Θ(n lg n) | recursion tree / Akra-Bazzi |
| T(n) = T(√n) + 1 | Θ(lg lg n) | change of variables m = lg n |
| T(n) = 2T(√n) + lg n | Θ(lg n · lg lg n) | m = lg n gives S(m) = 2S(m/2) + m |

---

## 1. Topics 1 & 4 · Algorithms, ADTs and Basic Data Structures (CLRS Ch 1, 10)

### 1.1 Vocabulary the professor expects you to state precisely
- **Computational problem:** a relation between inputs and required outputs, e.g. sorting maps ⟨a₁, …, aₙ⟩ to a permutation with a′₁ ≤ … ≤ a′ₙ.
- **Instance:** one particular input.
- **Algorithm:** a finite sequence of unambiguous, effective steps that halts. It is **correct** iff for **every** instance it halts with the correct output. "It worked on my tests" is evidence, not proof.
- **Analyzing an algorithm has two separate jobs:**
  1. **Correctness:** prove it with loop invariants (Topic 2), induction (recursive code), or exchange arguments (later in the course).
  2. **Cost:** choose the **input size n** (number of elements, bits, vertices…), a **cost model** (the RAM model), and count steps as a function of n.
- **RAM model:** each primitive operation costs O(1). That covers arithmetic, comparison, assignment, array indexing, following a pointer, and call/return. Instructions run one after another, and every memory access costs the same. Operations that are **not** one step include "sort this", "find the min" and xᵏ for non-constant k.
- **ADT vs data structure:** an ADT is the *contract* (what the operations mean). A data structure is the *implementation* (what they cost). Example: a priority queue is an ADT. An unsorted list makes INSERT Θ(1) and EXTRACT-MAX Θ(n). A heap (Topic 9) makes both Θ(lg n).
- **Dynamic-set operations:**
  - Queries: SEARCH(S, k), MINIMUM, MAXIMUM, SUCCESSOR, PREDECESSOR.
  - Modifying operations: INSERT(S, x), DELETE(S, x). Note that DELETE takes a *pointer*, not a key.

### 1.2 Stacks (LIFO)
```
STACK-EMPTY(S)            PUSH(S, x)                    POP(S)
  return S.top == 0         if S.top == S.size              if STACK-EMPTY(S)
                                error "overflow"                error "underflow"
                            S.top = S.top + 1               S.top = S.top − 1
                            S[S.top] = x                    return S[S.top + 1]
```
- All three are Θ(1). S[1..S.top] holds the elements, and S[S.top] is the top.
- Errors: **underflow** (POP on empty) and **overflow** (PUSH on full). Exams love "what's missing from this code?"
- Uses: undo, matching parentheses, simulating recursion, DFS (Topic 14), and iterative tree traversal (PS1 5a).
- **Linked-list stack (PS1 1b,c):** head = top. PUSH and POP are O(1) at the head. With a **tail pointer and size field**, CATENATE(S, T) (put T under S) is O(1): `S.tail.next = T.head; S.tail = T.tail; S.n += T.n`. Handle empty S and empty T separately.

### 1.3 Queues (FIFO), circular array
```
ENQUEUE(Q, x)                          DEQUEUE(Q)
  Q[Q.tail] = x                          x = Q[Q.head]
  if Q.tail == Q.size: Q.tail = 1        if Q.head == Q.size: Q.head = 1
  else Q.tail = Q.tail + 1               else Q.head = Q.head + 1
                                         return x
```
- Q.head points at the front element, and Q.tail at the **next free slot**.
- **Empty ⇔ head == tail.** **Full ⇔ head == tail + 1 (mod size).** An array of size n therefore holds at most **n − 1** elements; the wasted slot is what distinguishes full from empty. The alternative is to keep a count field, which lets you use all n slots.
- CLRS's pseudocode omits the overflow/underflow checks. Add them when asked (arena challenge `array-queue`).
- **Deque:** insert or delete at both ends, Θ(1) each, using the same wrap-around arithmetic.
- **Extra classics:**
  - A queue from two stacks costs O(1) **amortized** per operation: move the in-stack to the out-stack only when the out-stack is empty.
  - A stack from two queues makes one operation Θ(n).

### 1.4 Linked lists
```
LIST-SEARCH(L, k)                LIST-PREPEND(L, x)            LIST-DELETE(L, x)
  x = L.head                       x.next = L.head               if x.prev ≠ NIL: x.prev.next = x.next
  while x ≠ NIL and x.key ≠ k      x.prev = NIL                  else L.head = x.next
      x = x.next                   if L.head ≠ NIL               if x.next ≠ NIL: x.next.prev = x.prev
  return x                             L.head.prev = x
                                   L.head = x
LIST-INSERT(x, y)                // insert x right after y (4e)
  x.next = y.next;  x.prev = y
  if y.next ≠ NIL: y.next.prev = x
  y.next = x
```
- SEARCH is Θ(n) worst case. PREPEND and INSERT are Θ(1). DELETE is **Θ(1) given a pointer** in a *doubly* linked list.
- Deleting by **key** costs Θ(n), because you have to search for it first.
- In a **singly** linked list, DELETE needs the predecessor, so it costs Θ(n). That's the classic trap.
- **Sentinel L.nil:** a dummy node between the tail and the head, making the list circular and doubly linked. Then L.nil.next = head and L.nil.prev = tail, and every real node has real neighbours. This removes the NIL special cases from the code:
```
LIST-DELETE′(x)                  LIST-INSERT′(x, y)            LIST-SEARCH′(L, k)
  x.prev.next = x.next             x.next = y.next               L.nil.key = k        // sentinel stops the loop
  x.next.prev = x.prev             x.prev = y                    x = L.nil.next
                                   y.next.prev = x               while x.key ≠ k: x = x.next
                                   y.next = x                    if x == L.nil: return NIL
                                                                 return x
```
- Sentinels simplify the code but don't change asymptotic cost. They waste memory when there are many small lists.
- Extra classic: **reverse a singly linked list in Θ(n) with Θ(1) extra space.** Walk with prev/cur/next pointers and flip `cur.next = prev`.

### 1.5 Rooted trees
- **Binary tree node:** `p`, `left`, `right`, `key`. The root has p = NIL. T.root = NIL means the tree is empty.
- **Unbounded branching uses the left-child, right-sibling (LCRS) representation:** `x.left-child` is the leftmost child and `x.right-sibling` is the next sibling. Each node needs only 2 pointers, so the whole tree takes Θ(n) space for any branching factor.
- **COUNT-CHILDREN (PS1 P6):** `c = x.left-child; while c ≠ NIL: count++; c = c.right-sibling`. Θ(#children).
- **Depth** of x = the number of edges from the root to x. **Height** of x = the number of edges on the longest downward path from x to a leaf. The height of the tree = the height of the root.
- **Iterative traversal (PS1 5a):** pop a node, print it, push the right child, then push the left child. Each node is pushed and popped once, so this is Θ(n) and visits in preorder. Recursive walks are also Θ(n) (see Topic 8).
- Full binary tree facts:
  - A binary tree of height h has ≤ 2^(h+1) − 1 nodes and ≤ 2^h leaves.
  - Every nonempty full binary tree has #leaves = #internal nodes + 1.

---

## 2. Topic 3 · Growth of Functions (CLRS Ch 3, Appendix A)

### 2.1 Formal definitions (there must exist positive constants; "for all n ≥ n₀")
| Notation | Definition | Read as |
|---|---|---|
| f = O(g) | ∃ c > 0, n₀ > 0: 0 ≤ f(n) ≤ c·g(n) ∀ n ≥ n₀ | f grows **no faster** than g (≤) |
| f = Ω(g) | ∃ c > 0, n₀: 0 ≤ c·g(n) ≤ f(n) ∀ n ≥ n₀ | f grows **at least** as fast (≥) |
| f = Θ(g) | ∃ c₁, c₂ > 0, n₀: c₁g(n) ≤ f(n) ≤ c₂g(n) ∀ n ≥ n₀ | same growth (=) |
| f = o(g) | **∀** c > 0 ∃ n₀: 0 ≤ f(n) < c·g(n) ∀ n ≥ n₀ | strictly slower (<); f/g → 0 |
| f = ω(g) | **∀** c > 0 ∃ n₀: 0 ≤ c·g(n) < f(n) ∀ n ≥ n₀ | strictly faster (>); f/g → ∞ |

- **Theorem 3.1:** f = Θ(g) ⇔ f = O(g) **and** f = Ω(g).
- The big notations say "there exists a c"; the little notations say "**for every** c". That's why o ⇒ O but O does not imply o. For example, n = O(n) but n ≠ o(n).
- **f = g exactly:** O, Ω and Θ all hold, and **both o and ω fail**. This is a favourite exam trick (Exercise 2).
- The "=" is one-way: n = O(n²) is fine, but "O(n²) = n" is meaningless.
- **On the right-hand side**, notation means "some anonymous function." **On the left-hand side**, it means "for every function": 2n² + Θ(n) = Θ(n²).
- **Trap:** "Σᵢ₌₁ⁿ O(1) = O(1)" is wrong. The hidden constant can't hide an n, so the sum is O(n). Likewise, an inductive proof can't change the constant c from step to step.

### 2.2 Proving and disproving from the definition
- **Prove 3n² + 10n + 5 = Θ(n²):**
  - Lower bound: 3n² ≤ f(n) for n ≥ 1 ⇒ c₁ = 3.
  - Upper bound: with c₂ = 4 we need 10n + 5 ≤ n², which holds for n ≥ 11 (121 ≥ 115). It fails at n = 10 (100 < 105), so n₀ = 11.
  - A lazier upper bound also works: f(n) ≤ 3n² + 10n² + 5n² = 18n² for n ≥ 1.
- **Disprove n² = O(n):** suppose n² ≤ cn for all n ≥ n₀. Then n ≤ c for all large n, which is false at n = max(n₀, ⌈c⌉ + 1). Contradiction.
- **Prove ½n² − 3n = Θ(n²)** (CLRS): we need c₁ ≤ ½ − 3/n ≤ c₂. Take c₂ = ½, n₀ = 7, c₁ = 1/14.
- **Polynomials:** for p(n) = Σ aᵢnⁱ with a_d > 0, p(n) = Θ(n^d).
- **max(f, g) = Θ(f + g)** for non-negative f, g, because ½(f + g) ≤ max ≤ f + g.
- **(n + a)^b = Θ(n^b)** for constants a and b > 0.

### 2.3 The limit test (the fastest way to fill a comparison table)
Compute L = lim f(n)/g(n) as n → ∞.
- L = 0 ⇒ f = o(g), so also O(g).
- 0 < L < ∞ ⇒ f = Θ(g).
- L = ∞ ⇒ f = ω(g), so also Ω(g).
- If L does not exist, the test is inconclusive. An example is f = n^(1+sin n), which is **incomparable** with n.

**L'Hôpital examples:**
- lg n vs √n: (1/(n ln 2)) / (1/(2√n)) = 2/(√n ln 2) → 0, so lg n = o(√n).
- n¹⁰⁰ vs 1.01ⁿ: apply L'Hôpital 100 times; the numerator becomes a constant and the denominator still grows, so n¹⁰⁰ = o(1.01ⁿ).
- 2^(n+1) vs 2ⁿ: the ratio is 2, so Θ. But 2^(2n) vs 2ⁿ: the ratio is 2ⁿ → ∞. **Constants in the exponent matter.**

### 2.4 The growth ladder (any two rungs compare instantly)
1 < lg* n < lg lg n < lg n < lgᵏ n < n^ε (any ε > 0) < √n < n < n lg n < n^(1+ε) < n² < n³ < … < 2ⁿ < 3ⁿ < n! < nⁿ

- **Polylog < polynomial:** lgᵇ n = o(n^a) for every a > 0. Even lg¹⁰⁰ n = o(n^0.001).
- **Polynomial < exponential:** n^b = o(aⁿ) for every a > 1.
- **n^1.01 vs n lg n:** n^1.01 grows faster, because n^0.01 beats lg n eventually. This is a classic mistake.
- **Exponentials with different bases are not Θ of each other:** 2ⁿ = o(3ⁿ), since (2/3)ⁿ → 0.
- **Factorial:** n! = o(nⁿ), n! = ω(2ⁿ), and **lg(n!) = Θ(n lg n)**. By Stirling, n! = √(2πn)(n/e)ⁿ(1 + Θ(1/n)). A quick lower bound: n! ≥ (n/2)^(n/2) ⇒ lg n! ≥ (n/2) lg(n/2).
- **"Looks different, is the same":**
  - n^(lg c) = c^(lg n), using a^(log_b c) = c^(log_b a).
  - lg(n!) vs lg(nⁿ) = n lg n: Θ.
  - log₂ n vs log₁₀ n: Θ.
- **Iterated log:** lg* n ≤ 5 for every practical n. The Union-Find α(n) (Topic 16) grows even slower.

### 2.5 Toolkit: logs, exponents, floors, sums
**Logs and exponents**
- a = b^(log_b a). log_b(ac) = log_b a + log_b c. log_b aⁿ = n log_b a.
- **log_b a = log_c a / log_c b**, so the base is just a constant factor (that's why we write lg). log_b a = 1/log_a b.
- **a^(log_b c) = c^(log_b a).** For example, 3^(lg n) = n^(lg 3) ≈ n^1.585. This comes up in recursion trees.
- lg n = log₂ n, ln n = logₑ n, and lgᵏ n = (lg n)ᵏ, which is not lg lg n.

**Floors and ceilings**
- x − 1 < ⌊x⌋ ≤ x ≤ ⌈x⌉ < x + 1.
- ⌈n/2⌉ + ⌊n/2⌋ = n.
- ⌈⌈n/a⌉/b⌉ = ⌈n/(ab)⌉.
- Floors and ceilings never change the asymptotic answer of the recurrences we solve.

**Summations (Appendix A)**
- Arithmetic: Σᵢ₌₁ⁿ i = n(n+1)/2 = Θ(n²).
- Σ i² = n(n+1)(2n+1)/6 = Θ(n³), and Σ i³ = (n(n+1)/2)² = Θ(n⁴).
- Geometric: Σₖ₌₀ⁿ xᵏ = (x^(n+1) − 1)/(x − 1). For x < 1, the infinite sum Σ xᵏ = 1/(1 − x), which is **dominated by its first term**. For x > 1 the sum is dominated by its last term.
- **Σ k xᵏ = x/(1 − x)²** for x < 1. In particular **Σ k/2ᵏ = 2**, which is the key to BUILD-MAX-HEAP being O(n) in Topic 9.
- **Harmonic:** Hₙ = Σ 1/k = ln n + O(1), so Θ(lg n). Integral bounds give ln(n + 1) ≤ Hₙ ≤ ln n + 1.
- **Σ lg k = lg(n!) = Θ(n lg n).**
- **Telescoping:** Σ (a_k − a_(k−1)) = a_n − a_0.
- **Bounding a sum:**
  - Upper bound: replace every term by the largest, so Σ ≤ n · max.
  - Lower bound: keep only the top half, so Σ ≥ (n/2) · (the term at n/2). For example, Σ k ≥ (n/2)(n/2) = Ω(n²).
  - Integral bounds: ∫ₘ₋₁ⁿ f ≤ Σₘⁿ f(k) ≤ ∫ₘⁿ⁺¹ f for increasing f.

### 2.6 Properties
| Property | Holds for |
|---|---|
| Transitivity (f = O(g), g = O(h) ⇒ f = O(h)) | O, Ω, Θ, o, ω |
| Reflexivity (f = O(f)) | O, Ω, Θ (not o, ω) |
| Symmetry (f = Θ(g) ⇔ g = Θ(f)) | Θ only |
| Transpose symmetry | f = O(g) ⇔ g = Ω(f); f = o(g) ⇔ g = ω(f) |
| Trichotomy | **fails**: some pairs are incomparable |

### 2.7 Big-O is NOT "worst case"
O, Ω and Θ describe **functions**. Best, worst and average case decide **which function** you are describing. Insertion sort's worst-case time is Θ(n²) and its best-case time is Θ(n). So "insertion sort is O(n²)" and "insertion sort is Ω(n)" are true for every input, while "insertion sort is Θ(n²)" describes only the worst case.

---

## 3. Topic 2 · Proving Correctness & Analyzing Algorithms (CLRS 2.1–2.2)

### 3.1 Insertion sort
```
INSERTION-SORT(A, n)
  for i = 2 to n
      key = A[i]
      // insert A[i] into the sorted subarray A[1..i−1]
      j = i − 1
      while j > 0 and A[j] > key
          A[j + 1] = A[j]
          j = j − 1
      A[j + 1] = key
```
**Outer-loop invariant (CLRS):** at the start of each iteration of the **for** loop, A[1..i−1] consists of the elements **originally** in A[1..i−1], **but in sorted order**.
- **Initialization:** before the first iteration i = 2, and A[1..1] is a single element. It is the original element, and it is trivially sorted.
- **Maintenance:** the body shifts A[i−1], A[i−2], … one slot right until it finds the first A[j] ≤ key, then drops key into A[j+1]. A[1..i] now holds the original A[1..i], sorted. Incrementing i restores the invariant.
- **Termination:** the loop ends when i = n + 1. Substituting gives "A[1..n] is the original elements in sorted order", which is the postcondition. ∎

**Inner-loop invariant (the "extra rigour" version, for when the professor asks you to formalize Maintenance):** at the start of each while test,
1. A[1..j] is unchanged from the start of this outer iteration, and so is sorted.
2. A[j+2..i] holds the original A[j+1..i−1] shifted right by one, and every element of A[j+2..i] is **> key**.

When the while loop exits, either j = 0 or A[j] ≤ key. In both cases A[j+1] = key gives A[1..j] ≤ key < A[j+2..i], which is sorted.

**Properties:** in place (Θ(1) extra) and **stable**, because the test is A[j] **>** key, strictly, so equal keys are never jumped.

### 3.2 Loop-invariant method (it's induction on iterations)
1. **Initialization:** true before the first iteration.
2. **Maintenance:** if it is true before an iteration, it is true before the next one.
3. **Termination:** when the loop stops, the invariant **plus the exit condition** gives the result you want. This is the part students forget. The invariant must be *useful* at the end, and the loop must actually terminate (state why: some index strictly increases toward a bound).

**How to find the invariant:** ask "what has the loop accomplished so far?" The invariant describes the processed prefix and the state variables, and it should turn into the postcondition when you substitute the exit value of the index.

### 3.3 Invariants you should be able to write instantly
- **LINEAR-SEARCH(A, n, x)** (Exercise 2, arena `find-index`).
  - Invariant: **x ∉ A[1..i−1]**.
  - Init: the range is empty, so it's vacuously true.
  - Maintenance: reaching i + 1 means A[i] ≠ x was verified.
  - Termination: either A[i] = x and we return i, which is correct, or i = n + 1, so x ∉ A[1..n] and we return NIL.
  - Cost: the loop **test** runs **n + 1** times in the worst case (the extra failing test) and the body n times. Worst case Θ(n), best case Θ(1).
- **BINARY-SEARCH(A, n, x)** (PS2 P6, arena `binary-search`).
  - Invariant: **if x is in A[1..n], then x is in A[left..right]**.
  - Init: left = 1 and right = n.
  - Maintenance: A is sorted, so x < A[mid] ⇒ x can't be in A[mid..right], so set right = mid − 1. The other side is symmetric.
  - Termination: left > right means the range is empty, so x is absent.
  - Progress: right − left strictly decreases, and the range at least halves. That gives ≤ ⌊lg n⌋ + 1 iterations, so Θ(lg n).
  - Pitfalls: `mid = ⌊(left + right)/2⌋`, and setting left = mid instead of mid + 1, which loops forever.
- **SELECTION-SORT** (CLRS Ex 2.2-2).
  - Invariant: A[1..i−1] holds the **i − 1 smallest elements in sorted order**. Notice this is stronger than insertion sort's invariant.
  - It only needs to run for i = 1..n−1, because the last element is automatically the largest.
  - Θ(n²) in **all** cases.
- **BUBBLE-SORT** (CLRS Problem 2-2).
  - Inner invariant: A[j] = min A[j..n].
  - Outer invariant: A[1..i−1] holds the i − 1 smallest, sorted.
  - Θ(n²).
- **HORNER(a, n, x)** (CLRS Problem 2-3): `y = 0; for i = n downto 0: y = aᵢ + x·y`.
  - Invariant: y = Σₖ₌₀^(n−(i+1)) a_(k+i+1) xᵏ.
  - Θ(n), versus Θ(n²) for the naive method that recomputes the powers.
- **Sum / max of an array:** the invariant is "s = Σ A[1..i−1]" or "m = max A[1..i−1]".

### 3.4 Line-by-line cost analysis (CLRS 2.2; Exercise 1)
For insertion sort, let tᵢ be the number of times the while **test** runs for that i.

| Line | Cost | Times |
|---|---|---|
| for i = 2 to n | c₁ | n |
| key = A[i] | c₂ | n − 1 |
| j = i − 1 | c₄ | n − 1 |
| while j > 0 and A[j] > key | c₅ | Σᵢ₌₂ⁿ tᵢ |
| A[j + 1] = A[j] | c₆ | Σ (tᵢ − 1) |
| j = j − 1 | c₇ | Σ (tᵢ − 1) |
| A[j + 1] = key | c₈ | n − 1 |

- **Best case** (already sorted): tᵢ = 1, so T(n) = an + b = **Θ(n)**.
- **Worst case** (reverse sorted): tᵢ = i, and Σᵢ₌₂ⁿ i = n(n+1)/2 − 1, so T(n) = an² + bn + c = **Θ(n²)**.
- **Average case:** tᵢ ≈ i/2, still **Θ(n²)**.
- **The three-step pattern (Exercise 1):**
  1. Write the exact T(n) with the input-dependent quantity explicit, e.g. fₓ(n) = the position of x.
  2. Bound that quantity by the extremes the input allows.
  3. Only then simplify to Θ, O or Ω. Never write O(·) before T(n) is on paper.
- **Why report the worst case:** it's a guarantee for every input, it happens often (searching for a missing key), and the average is often just as bad.

### 3.5 Inversions explain insertion sort's running time
- An **inversion** is a pair i < j with A[i] > A[j].
- **Each shift removes exactly one inversion**, so shifts = inversions, and the running time is Θ(n + #inversions).
- Sorted input has 0 inversions, so Θ(n). Reverse-sorted input has n(n−1)/2, so Θ(n²). A random permutation has **n(n−1)/4** expected inversions: each pair is inverted with probability ½, which previews Topic 5A.
- **Nearly sorted input** with O(n) inversions sorts in Θ(n). That's why library sorts use insertion sort for small or almost-sorted subarrays.
- **Counting inversions in Θ(n lg n)** (CLRS Problem 2-4): modify MERGE. When R[j] is copied before L[i], add (nL − i) to the count, because all of L's remaining elements are greater.

### 3.6 Nested loops: count by summation, then sandwich
- When the inner loop runs t(i) times for outer index i, the total is Σᵢ t(i). Don't multiply n·n unless the inner loop really runs n times every time.
- Example: an inner loop that runs n − i + 1 times gives Σ (n − i + 1) = n(n+1)/2 = Θ(n²).
- **Sandwich:**
  - Upper bound: each outer iteration does ≤ n inner steps, so O(n²).
  - Lower bound: the first n/2 outer iterations each do ≥ n/2 inner steps, so Ω(n²).
  - Together they give Θ(n²).
- An inner loop that doubles (j = 1, 2, 4, …, n) runs lg n times per outer iteration, giving Θ(n lg n). An inner loop like `for j = i to n step i` gives Σ n/i = n·Hₙ = Θ(n lg n).

### 3.7 Sorting vocabulary
- **In place:** only Θ(1) elements are stored outside the array at any time. Insertion, selection, heap and quick sort are in place; merge sort is not.
- **Stable:** equal keys keep their input order. Insertion, merge and counting sort are stable. Heap sort, quicksort and swap-based selection sort are not.
- **Comparison sort:** it only gains information by comparing keys. Its lower bound is Ω(n lg n) (Topic 10B).

---

## 4. Topic 7 · Divide & Conquer and Recurrences (CLRS 2.3, Ch 4)

### 4.1 The paradigm
- **Divide** into subproblems that are smaller instances of the same problem.
- **Conquer** them recursively. The base case solves small inputs directly.
- **Combine** the sub-answers.
- The running time is a **recurrence**: T(n) = a·T(n/b) + D(n) + C(n), where D is the divide cost and C is the combine cost.

### 4.2 Merge sort
```
MERGE-SORT(A, p, r)
  if p ≥ r                         // zero or one element: already sorted
      return
  q = ⌊(p + r)/2⌋
  MERGE-SORT(A, p, q)
  MERGE-SORT(A, q + 1, r)
  MERGE(A, p, q, r)

MERGE(A, p, q, r)                  // CLRS 4e, no sentinels; Θ(n), n = r − p + 1
  nL = q − p + 1;  nR = r − q
  let L[0..nL−1] and R[0..nR−1] be new arrays
  copy A[p..q] into L and A[q+1..r] into R
  i = 0;  j = 0;  k = p
  while i < nL and j < nR
      if L[i] ≤ R[j]               // ≤ (take from L on ties) ⇒ STABLE
          A[k] = L[i];  i = i + 1
      else A[k] = R[j];  j = j + 1
      k = k + 1
  copy the rest of L[i..] or R[j..] into A[k..r]
```
**MERGE loop invariant:** at the start of each iteration that fills A[k],
1. A[p..k−1] contains the **k − p smallest** elements of L and R, in sorted order.
2. L[i] and R[j] are the smallest elements of their arrays that have not been copied back.

- Init: k = p, so the prefix is empty.
- Maintenance: the smaller of L[i] and R[j] is the smallest uncopied element overall, so placing it at A[k] keeps the invariant.
- Termination: one array is exhausted, and the leftover of the other is ≥ everything placed so far, so copying it finishes a sorted A[p..r].

The 3e variant puts ∞ **sentinels** at the end of L and R, so the loop runs exactly n times with no emptiness test.

**MERGE-SORT correctness** is by strong induction on n = r − p + 1.
- Base case n ≤ 1: the subarray is already sorted.
- Step: both halves have fewer than n elements, so by the induction hypothesis they are sorted. MERGE is correct, so the whole subarray is sorted.

**Running time:** T(n) = 2T(n/2) + Θ(n) = **Θ(n lg n)**. The recursion tree has lg n + 1 levels, each costing cn.

**Properties:** stable, **not** in place (Θ(n) extra), and the same cost in every case. CLRS 4e assumes n is a power of 2 for the analysis; floors and ceilings don't change the answer.

### 4.3 Method 1: substitution (CLRS 4.3)
1. **Guess** the form, e.g. T(n) ≤ c·n lg n.
2. **Prove** it by (strong) induction. Substitute the hypothesis for the smaller arguments and show the **exact same form** comes out, with the same c.
3. **Handle the base cases.** Pick n₀ and c large enough that the small cases hold.

**Worked example:** T(n) = 2T(⌊n/2⌋) + n. Guess T(n) ≤ cn lg n.
T(n) ≤ 2c⌊n/2⌋ lg⌊n/2⌋ + n ≤ cn lg(n/2) + n = cn lg n − cn + n ≤ cn lg n whenever **c ≥ 1**.
Base case: T(1) = 1 but c·1·lg 1 = 0, so the bound fails at n = 1. Asymptotic notation only needs n ≥ n₀, so take n₀ = 2 and use T(2) and T(3) as base cases (pick c ≥ max(T(2)/2, T(3)/(3 lg 3))).

**Trap 1 (proving the wrong form):** for T(n) = 2T(n/2) + n, the "proof" of O(n) goes T(n) ≤ 2c(n/2) + n = cn + n = O(n). **Wrong.** You must show T(n) ≤ cn, and cn + n is not ≤ cn. The constant isn't allowed to grow.

**Trap 2 (the guess is right but the induction fails):** for T(n) = 2T(n/2) + 1 with guess T(n) ≤ cn, you get cn + 1, which fails. **Subtract a lower-order term:** guess T(n) ≤ cn − d. Then 2(cn/2 − d) + 1 = cn − 2d + 1 ≤ cn − d whenever d ≥ 1. ✓

**Change of variables:** for T(n) = 2T(√n) + lg n, let m = lg n and S(m) = T(2ᵐ). Then S(m) = 2S(m/2) + m = Θ(m lg m), so T(n) = **Θ(lg n lg lg n)**.

**Exercise 3 (`stupid_sort`), T(n) = 3T(n/3) + cn²:** guess T(n) ≤ c′n². Then 3c′(n/3)² + cn² = (c′/3 + c)n² ≤ c′n² ⇔ c′ ≥ 3c/2. Verify the small base cases **by hand**; the exercise grades that tedium.

### 4.4 Method 2: recursion tree (CLRS 4.4)
Draw the tree. For each level write the number of nodes, the cost per node and the level total. Sum the levels and add the leaves, of which there are n^(log_b a) = a^(log_b n), each Θ(1).

- **2T(n/2) + cn:** level i has 2ⁱ nodes × cn/2ⁱ = **cn per level**, and there are lg n + 1 levels, so the total is **Θ(n lg n)**.
- **3T(n/4) + cn²:** level i costs (3/16)ⁱcn². That's a decreasing geometric series, so the total is ≤ cn²/(1 − 3/16) = (16/13)cn², plus the leaves Θ(n^(log₄ 3)) = o(n²). The answer is **Θ(n²)**: the root dominates.
- **T(n/3) + T(2n/3) + cn:** every full level costs cn. The longest path n → (2/3)n → … has log_(3/2) n levels, giving O(n lg n). The tree is full down to depth log₃ n, giving Ω(n lg n). So **Θ(n lg n)**.
- **T(n/5) + T(7n/10) + cn:** level i costs (9/10)ⁱcn, a decreasing series, so **Θ(n)**. This is the SELECT recurrence in Topic 10A.
- **Rule of thumb:** equal levels ⇒ (level cost) × (number of levels). Shrinking levels ⇒ the **root** wins. Growing levels ⇒ the **leaves** win.
- **Use a recursion tree to get a guess, then prove it by substitution.** This is CLRS's recommended workflow, and the professor wants all three methods (Exercise 3).

### 4.5 Method 3: the master theorem (CLRS 4e §4.5)
For T(n) = a·T(n/b) + f(n) with constants a ≥ 1 and b > 1, compare the **driving function** f(n) with the **watershed function** n^(log_b a):

| Case | Condition | Solution |
|---|---|---|
| 1 | f(n) = O(n^(log_b a − ε)) for some ε > 0 (f polynomially **smaller**) | **Θ(n^(log_b a))**, the leaves dominate |
| 2 | f(n) = Θ(n^(log_b a) lgᵏ n) for some k ≥ 0 | **Θ(n^(log_b a) lg^(k+1) n)**, every level costs the same |
| 3 | f(n) = Ω(n^(log_b a + ε)) for some ε > 0 **and** regularity a·f(n/b) ≤ c·f(n) for some c < 1 and all large n | **Θ(f(n))**, the root dominates |

- **Always check regularity in case 3.** It holds automatically for polynomial f, but state it on an exam.
- **Gaps:** f(n) can be smaller than the watershed without being *polynomially* smaller, which matches no case. Example: 2T(n/2) + n/lg n = Θ(n lg lg n). You can also get a gap where f is larger but not polynomially larger, or where regularity fails.
- **In 4e, case 2 includes the lgᵏ n factor,** so 2T(n/2) + n lg n = Θ(n lg² n) is covered. The 3e version only had k = 0 and called this a gap.
- **Doesn't apply** to subtract-and-conquer recurrences like T(n − 1) + …, to unequal splits like T(n/3) + T(2n/3), or when a or b isn't constant. Use a recursion tree or substitution there.
- **Proof idea:** T(n) = Θ(n^(log_b a)) + Σⱼ₌₀^(log_b n − 1) aʲ f(n/bʲ). Each case says which end of that sum dominates.

**Worked master-method table**

| Recurrence | a, b, n^(log_b a) | f(n) | Case | T(n) |
|---|---|---|---|---|
| 9T(n/3) + n | 9, 3, n² | n | 1 (ε = 1) | Θ(n²) |
| T(2n/3) + 1 | 1, 3/2, n⁰ = 1 | 1 | 2 (k = 0) | Θ(lg n) |
| 3T(n/4) + n lg n | 3, 4, n^0.793 | n lg n | 3; regularity 3(n/4)lg(n/4) ≤ ¾ n lg n | Θ(n lg n) |
| 2T(n/2) + n | 2, 2, n | n | 2 | Θ(n lg n) |
| 4T(n/2) + n | 4, 2, n² | n | 1 | Θ(n²) |
| 4T(n/2) + n² | 4, 2, n² | n² | 2 | Θ(n² lg n) |
| 4T(n/2) + n³ | 4, 2, n² | n³ | 3 | Θ(n³) |
| 8T(n/2) + n² | 8, 2, n³ | n² | 1 | Θ(n³) |
| 7T(n/2) + n² | 7, 2, n^2.807 | n² | 1 | Θ(n^(lg 7)) |
| 2T(n/4) + √n | 2, 4, n^½ | √n | 2 | Θ(√n lg n) |
| 2T(n/4) + 1 | 2, 4, √n | 1 | 1 | Θ(√n) |
| 3T(n/3) + n² | 3, 3, n | n² | 3 | Θ(n²) |
| 2T(n/2) + n lg n | 2, 2, n | n lg n | 2 (k = 1) | Θ(n lg² n) |
| 2T(n/2) + n/lg n | 2, 2, n | n/lg n | **none** | Θ(n lg lg n) |

### 4.6 Akra-Bazzi (CLRS 4e §4.7, the extra tool for unequal splits)
For T(n) = Σᵢ aᵢT(n/bᵢ) + f(n), find the unique p with **Σᵢ aᵢ / bᵢᵖ = 1**. Then T(n) = Θ(nᵖ(1 + ∫₁ⁿ f(x)/x^(p+1) dx)).
- T(n/3) + T(2n/3) + n: p = 1, so the integral is ∫ 1/x = ln n, giving **Θ(n lg n)**.
- T(n/5) + T(7n/10) + n: p < 1, so the integral is Θ(n^(1−p)), giving **Θ(n)**.

### 4.7 More divide-and-conquer algorithms the course uses
- **Binary search:** T(n) = T(n/2) + Θ(1) = Θ(lg n).
- **Local maximum / peak finding (PS2 P7a):**
  - Look at A[mid]. If a neighbour is larger, recurse on that side; otherwise return mid.
  - Why this is correct: suppose A[mid−1] > A[mid]. Every local max of A[lo..mid−1] is a local max of A. The only element whose neighbourhood changes is A[mid−1], and it's > A[mid] anyway.
  - T(n) = T(n/2) + Θ(1) = **Θ(lg n)**.
- **Maximum subarray:**
  - The best subarray lies entirely left, entirely right, or **crosses the midpoint**. Find the crossing one in Θ(n) by scanning outward from mid in both directions.
  - T(n) = 2T(n/2) + Θ(n) = Θ(n lg n).
  - Kadane's scan is Θ(n). Its invariant: best = max over subarrays of A[1..i], and cur = max over subarrays ending at i.
- **Matrix multiplication:**
  - Naive D&C does 8 half-size products: T(n) = 8T(n/2) + Θ(n²) = Θ(n³).
  - **Strassen** does **7** products and Θ(n²) additions: Θ(n^(lg 7)) ≈ n^2.81.
  - Lesson: lowering a (the number of subproblems) beats lowering f(n).
- **Exercise 3, `stupid_sort`:**
  - Recurse on the three thirds, then run one Θ(n²) bubble pass over the whole range.
  - T(n) = 3T(n/3) + Θ(n²) = Θ(n²) by all three methods (case 3 with regularity 3(n/3)² = n²/3 ≤ ⅓ n²).
  - The combine step dominates.

---

## 5. Every lemma, theorem and loop invariant on MT1 (index)

| # | Statement | Where | How it's proved |
|---|---|---|---|
| 1 | Insertion-sort invariant: A[1..i−1] = original first i − 1 elements, sorted | CLRS 2.1 | init/maintenance/termination (plus an inner-loop invariant if you formalize it) |
| 2 | Linear-search invariant: x ∉ A[1..i−1] | Exercise 2 | invariant plus the two exits |
| 3 | Binary-search invariant: x ∈ A ⇒ x ∈ A[left..right] | PS2 P6 | sortedness eliminates half; the range shrinks |
| 4 | Selection-sort invariant: A[1..i−1] = the i − 1 smallest, sorted | CLRS Ex 2.2-2 | invariant |
| 5 | MERGE invariant: A[p..k−1] = the k − p smallest of L ∪ R, sorted; L[i], R[j] = the smallest uncopied | CLRS 2.3 | invariant |
| 6 | MERGE-SORT correct | CLRS 2.3 | strong induction on n |
| 7 | Theorem 3.1: Θ ⇔ O ∧ Ω | CLRS 3.2 | definitions |
| 8 | Polynomial of degree d is Θ(n^d); log base change is Θ(1); polylog = o(poly); poly = o(exp) | CLRS 3.3 | limits / L'Hôpital |
| 9 | lg(n!) = Θ(n lg n) | CLRS 3.3 (Stirling) | n! ≤ nⁿ and n! ≥ (n/2)^(n/2) |
| 10 | Shifts in insertion sort = number of inversions | CLRS Problem 2-4 | each shift fixes exactly one inverted pair |
| 11 | Master theorem (3 cases, regularity) | CLRS 4.5 | recursion-tree sum (4.6) |
| 12 | Substitution: prove the exact form, the same constant | CLRS 4.3 | induction |
| 13 | Akra-Bazzi | CLRS 4.7 | (statement only) |
| 14 | Queue in an array of size n holds ≤ n − 1 elements (head == tail means empty) | CLRS 10.1 | the wasted slot distinguishes full from empty |
| 15 | LCRS represents any rooted tree in O(n) space | CLRS 10.3 | 2 pointers per node |
| 16 | Local max: the larger neighbour's side contains a local max of the whole array | PS2 P7a | boundary argument |

---

## 6. Pathways: how to attack a problem you've never seen

### 6.1 "Is f = O/Ω/Θ/o/ω of g?" (Exercise 2 style)
1. Simplify both functions: drop constants, use log/exponent identities, and rewrite a^(lg n) as n^(lg a).
2. Place both on the **ladder** (§2.4). If they're on different rungs, you're done.
3. Same rung? **Take the ratio limit** (use L'Hôpital, or take logs of both: compare lg f vs lg g).
4. If you need an explicit proof, give c and n₀ (check a specific n where the inequality starts holding).
5. Fill **every** column. If f = Θ(g), then O, Ω and Θ hold and o and ω are **false**. If f = o(g), then O and o hold, and Θ, Ω and ω are false.
6. Watch out for oscillating functions (sin, n mod 2), which may be incomparable.

### 6.2 "Prove this algorithm correct"
- **Iterative:** write a loop invariant.
  1. Ask what the loop has done after each iteration.
  2. Check that it turns into the postcondition at the exit index.
  3. Prove Init, then Maintenance (cite the loop body's lines), then Termination (the invariant plus the exit condition).
  4. Add a sentence on why the loop terminates.
- **Recursive:** use strong induction on the input size.
  1. Base case: the input is small enough that the code returns directly.
  2. Inductive hypothesis: the recursive calls return correct answers on their smaller inputs.
  3. Show the combine step turns correct sub-answers into a correct answer.
- **Nested loops:** prove the inner loop's invariant first, then use it inside the outer loop's Maintenance step.

### 6.3 "Analyze the running time"
1. **Iterative code:** build the cᵢ/tᵢ table, write T(n) = Σ cᵢtᵢ, then sum honestly using arithmetic, geometric or harmonic series.
2. **Recursive code:** write T(n) = (number of calls) · T(subproblem size) + (non-recursive work). Remember the base case.
3. Identify best, worst and average cases separately, **naming the inputs that cause them**.
4. Report Θ when you have matching upper and lower bounds. If you only have the upper bound, say O.

### 6.4 Which recurrence-solving method?
```
Is it T(n) = a·T(n/b) + f(n) with constant a ≥ 1, b > 1?
├─ yes → compute n^(log_b a), compare with f(n)
│    polynomially smaller → case 1      equal up to lgᵏ → case 2
│    polynomially larger + regularity → case 3      otherwise (gap) → recursion tree / substitution
├─ unequal splits (T(n/3) + T(2n/3) + n) → recursion tree, Akra-Bazzi; prove by substitution
├─ T(n − c) + f(n) → unroll (iterate) and sum the series
├─ T(√n) or other odd arguments → change variables (m = lg n)
└─ asked to PROVE → substitution with the exact inductive form (subtract a lower-order term if needed)
```

### 6.5 Designing a divide-and-conquer algorithm
1. Find a split that leaves **independent** subproblems of the same type: halves, thirds, or around a pivot.
2. Decide what each recursive call must **return** so that combining is cheap (max subarray returns sums, peak finding returns an index).
3. Write the base case first.
4. Write the recurrence and solve it, and check that it beats brute force.
5. If you can throw away one side entirely (binary search, local max, selection), the recurrence is T(n/2) + …, which is much cheaper.

### 6.6 Picking a data structure (Topic 1 design questions)
| Needed operation | Choose |
|---|---|
| undo / most-recent first | stack |
| process in arrival order | queue (circular array, or a linked list with a tail pointer) |
| O(1) insert/delete in the middle, given a pointer | doubly linked list (with a sentinel) |
| O(1) concatenation of two lists/stacks | linked list with **head and tail** pointers and a size field (PS1) |
| fast search on static data | sorted array plus binary search |
| any branching factor tree | left-child, right-sibling |
| priority / max | heap (Topic 9) |
| dictionary lookup | hash table (Topic 6) |
| ordered operations (successor, range) | BST / red-black tree (Topics 8, 11) |

### 6.7 Writing pseudocode the grader rewards (Correctness 40 / Modularity 30 / Efficiency 30)
- Name procedures exactly as asked (INSERTION-SORT, MERGE-SORT and MERGE, BINARY-SEARCH, LOCAL-MAX, PUSH, POP, CATENATE…).
- Put the **invariant** and the **running time** in a comment.
- Factor out helpers: MERGE, PARENT, IS-EMPTY.
- Handle the **empty / underflow / overflow** cases.
- **Efficiency traps:**
  - Binary search must halve the range rather than scan it.
  - CATENATE must be O(1) through the tail pointer, not by walking the list.
  - Merge sort's MERGE must be a single linear pass.
  - Local max must recurse on **one** side.

---

## 7. Practice map: what to drill and where (Question Hub)

| Skill | Site resources |
|---|---|
| Stacks / queues / lists | stack & circular-queue visualizer (t01); arena **`array-queue`**; **PS1 1(b,c) `ps1-stack`** (O(1) CATENATE), **PS1 5(a) `ps1-traverse`**, **PS1 P6 `ps1-children`** |
| Growth of functions | growth-race visualizer (t03); Exercise 2 comparison MC (t03) |
| Loop invariants | insertion-sort invariant visualizer (t02); arena **`ins-sort`**, **`find-index`**, **`binary-search`**; **PS2 P6 `ps2-bsearch`** |
| Merge sort / D&C | merge-sort visualizer (t07); arena **`merge-sort`**, **`stupid-sort`**; **PS2 7(a) `ps2-localmax`** |
| Master method | 🎲 master-method generator (new a, b, f every time) |

### 7.1 Model pathways for each PS / exercise problem
- **PS1 1(b,c) linked-list stack with CATENATE:** the "every operation O(1)" requirement forces a **tail** pointer and a size field. PUSH and POP work at the head. CATENATE splices `S.tail.next = T.head`. Handle the empty cases.
- **PS1 5(a) iterative traversal:** recursion means an implicit stack, so make it explicit. Push the root. Then repeatedly pop, print, push the right child and push the left child (so the left is processed first). Θ(n).
- **PS1 P6 count children:** in the LCRS representation, children form a sibling list starting at leftChild. Walk it. Θ(#children).
- **PS2 P6 binary search:** state the invariant first, then make sure each branch maintains it, and use left ≤ right as the loop test.
- **PS2 7(a) local max:** a Θ(lg n) target means throwing half away each step. Recurse toward a larger neighbour, then argue that the side contains a peak.
- **Exercise 1 (Find cost):** the cᵢ/tᵢ table with fₓ(n) gives worst case Θ(n) and best case Θ(1).
- **Exercise 2:** the function-comparison table (limit test) plus the loop-invariant proof for LINEAR-SEARCH.
- **Exercise 3 (`stupid_sort`):** solve T(n) = 3T(n/3) + Θ(n²) by recursion tree, substitution (with base cases) and the master theorem (case 3 plus regularity). All three are required.

### 7.2 Likely curveball questions and the one-line answer
- *Is insertion sort Θ(n²)?* Only in the worst case. The best case is Θ(n). Say O(n²) for "all inputs".
- *Is O(n²) a tight bound for merge sort?* It's true but not tight. Merge sort is Θ(n lg n).
- *Does f = O(g) imply f = o(g)?* No. o is strictly stronger.
- *If f = Θ(g), is f = o(g)?* Never.
- *Is 2^(2n) = O(2ⁿ)?* No (the ratio is 2ⁿ). *Is 2^(n+1) = O(2ⁿ)?* Yes (the ratio is 2).
- *Is log₂ n = Θ(log₁₀ n)?* Yes.
- *Is n^1.01 = O(n lg n)?* No, n^1.01 grows faster.
- *Is lg(n!) = Θ(n lg n)?* Yes, by Stirling.
- *Can the master theorem solve T(n) = T(n − 1) + n?* No. Unroll it to get Θ(n²).
- *Which part of the invariant proof uses the exit condition?* Termination.
- *Why does merge sort use ≤ in MERGE?* So it's stable.
- *What's the extra space for merge sort?* Θ(n). For insertion sort it's Θ(1).
- *How many elements can a circular queue in an array of n slots hold?* n − 1.
- *What is the cost of deleting from a singly linked list given a pointer?* Θ(n), because you need the predecessor. In a doubly linked list it's Θ(1).
- *Why use a sentinel?* To remove the boundary special cases. It doesn't change the asymptotic cost.
- *What is Σᵢ₌₁ⁿ O(1)?* O(n), not O(1).
- *How many levels does the merge-sort recursion tree have?* lg n + 1.

---

## 8. Last-minute recall list (write these from memory before the exam)
1. The five asymptotic definitions, with quantifiers (∃ c vs ∀ c), and Theorem 3.1.
2. The limit test and the growth ladder, including where n!, nⁿ and lg* n go.
3. a^(log_b c) = c^(log_b a), the change-of-base rule, Σ k/2ᵏ = 2, and Hₙ = Θ(lg n).
4. INSERTION-SORT code, its outer and inner invariants, and best/worst cost with the tᵢ table.
5. The LINEAR-SEARCH and BINARY-SEARCH invariants.
6. The MERGE invariant, the MERGE-SORT recurrence, and its stability (≤).
7. The substitution recipe and its two traps (wrong form; subtract a lower-order term).
8. Recursion trees for 2T(n/2) + n, 3T(n/4) + n² and T(n/3) + T(2n/3) + n.
9. The master theorem's three cases, regularity, and one gap example.
10. Circular-queue full/empty tests, the sentinel list code, and the LCRS representation.

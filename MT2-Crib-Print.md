# ICS 311 · Midterm 2 Crib Sheet
> **Wed 10/07 (Week 7)** · Topics 9 (heaps), 8 (BSTs), 11 (2-3-4 & red-black), 5A (probabilistic analysis), 5B (quicksort), 6 (hashing). Not on it: 10A. CLRS 4e Ch 5–7, 11–13, Sedgewick Ch 15.

## 0 · Master table

### Costs to memorize
| Operation | Time |
|---|---|
| MAX-HEAPIFY | O(lg n) = O(h) |
| BUILD-MAX-HEAP | Θ(n) |
| HEAPSORT | Θ(n lg n), in place, unstable |
| EXTRACT-MAX / INSERT / INCREASE-KEY | O(lg n) |
| build by n inserts | Θ(n lg n) worst |
| BST search / insert / delete / succ | O(h), h ∈ [⌊lg n⌋, n − 1] |
| inorder walk | Θ(n) |
| random BST height | O(lg n) expected |
| red-black / 2-3-4 operations | O(lg n) worst |
| RB rotations: insert / delete | ≤ 2 / ≤ 3 |
| quicksort worst / expected | Θ(n²) / Θ(n lg n) |
| PARTITION | Θ(n), r − p compares |
| hires: worst / expected | n / Hₙ ≈ ln n |
| chaining search | Θ(1 + α) expected, Θ(n) worst |
| open addr. unsuccessful | ≤ 1/(1 − α) probes |
| open addr. successful | ≤ (1/α) ln(1/(1 − α)) |

### n lg n sorts compared
| | Heap | Merge | Quick (rand) |
|---|---|---|---|
| worst | n lg n | n lg n | n² (rare) |
| extra space | Θ(1) | Θ(n) | Θ(lg n) |
| stable | no | yes | no |

## 1 · Heaps (Topic 9)

### Shape facts
- Nearly complete tree in A[1..n]: PARENT(i) = ⌊i/2⌋, LEFT(i) = 2i, RIGHT(i) = 2i + 1.
- Max-heap: A[PARENT(i)] ≥ A[i]. Height ⌊lg n⌋. Leaves are ⌊n/2⌋ + 1..n. At most ⌈n/2^(h+1)⌉ nodes of height h.
- Min of a max-heap is in a leaf. A descending array is a heap; a heap is not sorted.
- d-ary: height Θ(log_d n); ternary (Ex 4) children 3i − 1, 3i, 3i + 1, parent ⌊(i + 1)/3⌋, T(n) = T(3n/5) + Θ(1) = Θ(lg n).

### MAX-HEAPIFY and BUILD
```
MAX-HEAPIFY(A, i)    // subtrees are heaps
  l = 2i;  r = 2i + 1;  largest = i
  if l ≤ size and A[l] > A[largest]
    largest = l
  if r ≤ size and A[r] > A[largest]
    largest = r
  if largest ≠ i
    swap A[i], A[largest]
    MAX-HEAPIFY(A, largest)
BUILD-MAX-HEAP(A, n)
  for i = ⌊n/2⌋ downto 1
    MAX-HEAPIFY(A, i)
```
- Heapify: T(n) ≤ T(2n/3) + Θ(1) (half-full bottom level).
- **BUILD invariant:** nodes i + 1..n are roots of max-heaps.
- **Θ(n):** Σ ⌈n/2^(h+1)⌉ · O(h) = O(n Σ h/2ʰ) = O(2n).
- Trace: ⟨4, 1, 3, 2, 16, 9, 10, 14, 8, 7⟩ becomes ⟨16, 14, 10, 8, 7, 9, 3, 2, 4, 1⟩.

### Heapsort and priority queues
- HEAPSORT: build, then for i = n downto 2 swap A[1] with A[i], shrink, heapify(1).
- **Invariant:** A[1..i] is a heap of the i smallest; A[i+1..n] holds the n − i largest, sorted.
- EXTRACT-MAX: save A[1], move the last element to the root, shrink, heapify(1).
- INCREASE-KEY: set the key, swap with the parent while the parent is smaller. **Invariant:** at most one violation, A[i] > A[PARENT(i)].
- INSERT: append −∞, then INCREASE-KEY.
- Top-k (PS3 P1): BUILD + k EXTRACT-MAX = O(n + k lg n).

## 2 · Binary search trees (Topic 8)

### Queries, all O(h)
- BST property: left subtree ≤ x.key ≤ right subtree. Inorder walk prints sorted in Θ(n) (Thm 12.1).
- MIN: follow left; MAX: follow right.
- **SUCCESSOR:** if x.right exists, MIN(x.right). Otherwise climb while x is a right child; the first ancestor reached from a left child.
- **Ex 5 lemma:** with two children, succ(x) has no left child (pred has no right child); proved by contradiction.
- Preorder copies a tree; postorder frees it.

### Insert and delete
```
TRANSPLANT(T, u, v)
  if u.p == NIL: T.root = v
  elseif u == u.p.left: u.p.left = v
  else u.p.right = v
  if v ≠ NIL: v.p = u.p
```
- INSERT: walk down with a trailing y, set z.p = y, attach left or right.
- **DELETE:** no left child ⇒ TRANSPLANT(z, z.right); no right child ⇒ TRANSPLANT(z, z.left); two children ⇒ y = MIN(z.right). If y ≠ z.right, first replace y by y.right and give y z's right subtree. Then TRANSPLANT(z, y) and give y z's left subtree.
- Sorted inserts build a path (Θ(n) per operation). A random insertion order gives O(lg n) expected height (Thm 12.4).

## 3 · 2-3-4 and red-black trees (Topic 11)

### 2-3-4 trees
- Nodes with 1, 2 or 3 keys. **All leaves at the same depth**, so h ≈ lg n.
- **Insert top-down:** split every 4-node on the way down (the middle key goes up). The tree grows only when the root splits.
- **Delete:** swap with the successor in a leaf. On underflow, **transfer** from a rich sibling or **fuse** with a 2-node sibling plus the parent key.
- Insert 10, 20, 30, then 15: the root splits to 20 with children [10 15] and [30].

### Red-black properties
- Every node is red or black; the root is black; NIL leaves are black; a red node has black children; every path from x down has the same black-height bh(x).
- **Lemma 13.1:** the subtree at x has ≥ 2^(bh(x)) − 1 internal nodes, and bh(root) ≥ h/2, so **h ≤ 2 lg(n + 1)**.
- 2-node = black; 3-node = black + one red child; 4-node = black + two red children. Black-height = 2-3-4 height. A color flip = a 4-node split.

### Rotations
```
LEFT-ROTATE(T, x)
  y = x.right;  x.right = y.left
  if y.left ≠ nil: y.left.p = x
  y.p = x.p
  if x.p == nil: T.root = y
  elseif x == x.p.left: x.p.left = y
  else x.p.right = y
  y.left = x;  x.p = y
```
- O(1); preserves the inorder order. PS4: any BST becomes a right chain in ≤ n − 1 right rotations.

### RB-INSERT-FIXUP
- Insert as in a BST and color z **red**. Loop while z.p is red (y = the uncle):
  1. **Uncle red:** parent and uncle black, grandparent red, z = grandparent (loops, O(lg n) times).
  2. **Uncle black, z an inner child:** rotate at z.p to make a line (becomes case 3).
  3. **Uncle black, z an outer child:** parent black, grandparent red, rotate the grandparent. Done.
- Finally the root is made black.
- **Invariant:** z is red; if z.p is the root it is black; at most one violation (property 2 or property 4).
- Insert 10, 20, 30 ⇒ case 3 gives 20 black with red 10 and 30. Insert 15 ⇒ case 1 recolors.
- **Delete:** if the removed color was black, x is doubly black. With sibling w: (1) w red ⇒ rotate; (2) w black, both children black ⇒ recolor and move up; (3) near child red ⇒ rotate w; (4) far child red ⇒ rotate x.p, done.

## 4 · Probabilistic analysis (Topic 5A)

### Indicators and linearity
- **Lemma 5.1:** E[I{A}] = Pr{A}. **Linearity:** E[Σ Xᵢ] = Σ E[Xᵢ] even for **dependent** variables. Products need independence.
- Recipe: count = sum of indicators ⇒ find each probability ⇒ add them up.
- **Hiring:** candidate i is hired iff they are the best of the first i, with Pr = 1/i, so E = Hₙ = ln n + O(1). Worst case: n hires (increasing quality).

### Expectations to know
| Quantity | Answer |
|---|---|
| heads in n flips | n/2 |
| fixed points of a random permutation | 1 |
| inversions | n(n − 1)/4 |
| position of a key (Ex 8) | (n + 1)/2 |
| Ex 7: {5, 10, 15} with Pr 3/5, 1/5, 1/5 | 8 |
| n rolls of an s-sided die | n(s + 1)/2 |
| birthday pairs, k people | C(k, 2)/n |
| fill all n bins | n Hₙ |
| longest streak in n flips | Θ(lg n) |
- Pr{all k birthdays distinct} ≤ e^(−k(k − 1)/2n), which is ≤ 1/2 at k = 23.

### Randomized algorithms
- Probabilistic analysis assumes a random **input**; a randomized algorithm flips its own coins, so the bound holds for **every** input (the worst case is still possible).
- RANDOMLY-PERMUTE: for i = 1..n, swap A[i] with A[RANDOM(i, n)].
- **Invariant:** each (i − 1)-permutation is in A[1..i−1] with probability (n − i + 1)!/n!, which becomes 1/n! at the end.
- Swapping with RANDOM(1, n) is **biased** (nⁿ outcomes is not divisible by n!).

## 5 · Quicksort (Topic 5B)

### PARTITION (Lomuto)
```
PARTITION(A, p, r)
  x = A[r];  i = p − 1
  for j = p to r − 1
    if A[j] ≤ x
      i = i + 1;  swap A[i], A[j]
  swap A[i + 1], A[r]
  return i + 1
```
- **Invariant:** A[p..i] ≤ x; A[i+1..j−1] > x; A[r] = x.
- Trace: ⟨2, 8, 7, 1, 3, 5, 6, 4⟩ becomes ⟨2, 1, 3, 4, 7, 5, 6, 8⟩ and returns q = 4.
- RANDOMIZED-PARTITION swaps A[RANDOM(p, r)] into A[r] first.

### Analysis
- **Worst:** T(n) = T(n − 1) + Θ(n) = Θ(n²) (sorted input with the last element as pivot; all-equal keys with Lomuto).
- Any constant split, even 99 : 1, gives depth Θ(lg n), so Θ(n lg n).
- **Expected:** time O(n + X). zᵢ and zⱼ are compared iff one of them is the first pivot chosen from {zᵢ..zⱼ}: Pr = 2/(j − i + 1). So E[X] = Σ 2/(j − i + 1) < Σᵢ Σₖ 2/k = O(n lg n).
- Each pair is compared at most once.
- **Three-way partition (PS5):** < x, = x, > x in one pass; all-equal input becomes Θ(n).
- Recurse on the smaller side first for an O(lg n) stack. Introsort falls back to heapsort.

## 6 · Hash tables (Topic 6)

### Chaining and hash functions
- α = n/m. Independent uniform hashing ⇒ unsuccessful and successful search Θ(1 + α) (Thms 11.1, 11.2). INSERT Θ(1) (prepend); DELETE Θ(1) with doubly linked chains.
- **Division** k mod m: m prime, not near 2ᵖ. **Multiplication** ⌊m(kA mod 1)⌋ with A ≈ 0.618.
- **Universal:** Pr{h(k) = h(l)} ≤ 1/m. The family ((ak + b) mod p) mod m defeats adversaries.
- Direct addressing: Θ(1), but space Θ(size of U).

### Open addressing
| Probe | h(k, i) | Problem |
|---|---|---|
| linear | (h′(k) + i) mod m | primary clustering |
| quadratic | (h′ + c₁i + c₂i²) mod m | secondary clustering |
| double | (h₁ + i·h₂) mod m | h₂ coprime to m |
- α ≤ 1. Unsuccessful ≤ 1/(1 − α) (α = 0.5 ⇒ 2; α = 0.9 ⇒ 10). Successful ≤ (1/α) ln(1/(1 − α)).
- **Tombstones (Ex 9):** DELETE writes DELETED; search skips it and stops only at NIL; insert may reuse it. Deleting with NIL breaks later searches. Worst case Θ(m).
- PS5 double hashing: (k mod m + i(1 + k mod 7)) mod m; loop i = 0..m − 1, else overflow.

### Trace: keys 10, 22, 31, 4, 15, 28, 17, 88, 59, m = 11
- **Linear**, k mod 11: [22, 88, –, –, 4, 15, 28, 17, 59, 31, 10].
- **Double**, h₂ = 1 + (k mod 10): [22, –, 59, 17, 4, 15, 28, 88, –, 31, 10].
- Hash table vs BST: O(1) expected vs O(lg n) worst; only the BST supports min, succ, range queries and sorted output.

## 7 · Pathways and exam traps

### Lemma / invariant index
- Heapify precondition · BUILD invariant + Σ h/2ʰ = 2 · heapsort invariant · INCREASE-KEY one-violation invariant.
- Successor two cases · Ex 5 lemma · TRANSPLANT delete cases · Thm 12.4.
- Lemma 13.1 · rotations keep the order · fixup invariant · ≤ 2 / ≤ 3 rotations.
- Lemma 5.1 · Hₙ hires · shuffle invariant · PARTITION invariant · 2/(j − i + 1).
- Θ(1 + α) · 1/(1 − α) · (1/α) ln(1/(1 − α)) · universal ≤ 1/m.

### Attacking a new problem
- **Choose a structure by its operations:** repeated max ⇒ heap; key lookup ⇒ hash; ordered queries ⇒ red-black tree; worst-case guarantee or adversary ⇒ red-black tree or universal hashing; in-place Θ(n lg n) worst ⇒ heapsort; many duplicates ⇒ three-way quicksort.
- **Expected value:** define X, split it into indicators, get each probability by symmetry or counting, sum with linearity, then sanity-check n = 1.
- **Trace protocol:** heap: draw the tree and the array, swap with the **larger** child. BST delete: classify the case first. RB: insert red, look at the uncle, cross-check with 2-3-4. Hash: write h(k, i) for i = 0, 1, 2, ….
- **Proofs:** precondition, then a loop invariant, induction on height, or contradiction (successor lemma).

### Curveballs
- BUILD-MAX-HEAP is Θ(n), not n lg n. Heapsort is not stable but is in place.
- BST operations are O(h), not O(lg n), unless balanced. New RB nodes are red. Rotations keep the inorder order.
- A 4-node is black with two red children. A 2-3-4 tree grows only at the root.
- Linearity needs no independence. Randomization doesn't remove the Θ(n²) worst case.
- With chaining α can exceed 1; with open addressing α ≤ 1. Chaining's worst case is Θ(n). Double hashing needs gcd(h₂, m) = 1.
- Grader: call PARENT, MAX-HEAPIFY, TRANSPLANT, PARTITION and HASH helpers; BUILD rather than n inserts; search stops at NIL, not DELETED.

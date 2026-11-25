# ICS 311 · Midterm 2 Crib Sheet

**Exam:** Wed 10/07 (Week 7). **Covers:** Topics 9 (Heaps & Priority Queues), 8 (Binary Search Trees), 11 (2-3-4 & Red-Black Trees), 5A (Probabilistic Analysis), 5B (Randomized Quicksort), 6 (Hash Tables).
**Not on MT2:** Topic 10A (Selection & Order Statistics). It was taught Mon 10/05, the Monday of exam week, so it counts toward Midterm 3. You still need PARTITION from 5B, which 10A reuses.

> **CLRS 4th-edition chapter map.** Ch 5 (5.1 hiring problem, 5.2 indicator random variables, 5.3 randomized algorithms, 5.4 birthday / balls-and-bins / streaks / online hiring) · Ch 6 (6.1 heaps, 6.2 MAX-HEAPIFY, 6.3 BUILD-MAX-HEAP, 6.4 heapsort, 6.5 priority queues) · Ch 7 (7.1 quicksort and PARTITION, 7.2 performance, 7.3 randomized version, 7.4 analysis) · Ch 11 (11.1 direct addressing, 11.2 hash tables / chaining, 11.3 hash functions, 11.4 open addressing, 11.5 practical considerations) · Ch 12 (12.1 BSTs, 12.2 queries, 12.3 insert and delete, 12.4 randomly built BSTs) · Ch 13 (red-black trees: properties, rotations, insert, delete) · **Sedgewick Ch 15** (balanced trees, 2-3-4 trees). Screencasts: **09A–09D**, **08A–08D**, **11A–11D**, **05A–05B**, **10A–10B** (quicksort), **06A–06D**. MIT 6.046J Lectures 07–08 (hashing) and 10 (balanced trees).

---

## 0. The 60-second master table (memorize this)

| Structure / algorithm | Operation | Time | Notes |
|---|---|---|---|
| Binary heap | MAX-HEAPIFY | O(lg n), i.e. O(h) | floats one key down one path |
| | BUILD-MAX-HEAP | **Θ(n)** | Σ (nodes at height h)·O(h) = O(n Σ h/2ʰ) |
| | HEAPSORT | **Θ(n lg n)** | in place, **not stable** |
| | MAXIMUM / EXTRACT-MAX | Θ(1) / O(lg n) | |
| | INSERT / INCREASE-KEY | O(lg n) | float up |
| | build by n inserts | Θ(n lg n) worst | increasing input (PS3 P2) |
| BST (height h) | SEARCH, MIN, MAX, SUCC, PRED, INSERT, DELETE | **O(h)** | h ∈ [⌊lg n⌋, n − 1] |
| | INORDER-TREE-WALK | Θ(n) | sorted output |
| | expected height, random insertion order | O(lg n) | CLRS Thm 12.4 |
| Red-black tree | SEARCH / INSERT / DELETE | **O(lg n)** worst | h ≤ 2 lg(n + 1) |
| | rotations per INSERT / DELETE | ≤ **2** / ≤ **3** | recolorings O(lg n) |
| 2-3-4 tree | search / insert / delete | O(lg n) | all leaves at the same depth |
| Quicksort (deterministic) | best / average / worst | Θ(n lg n) / Θ(n lg n) / **Θ(n²)** | worst on sorted input with last-element pivot |
| Randomized quicksort | expected, **any** input | **O(n lg n)** | expected comparisons < 2n ln n ≈ 1.39 n lg n |
| PARTITION | n elements | Θ(n) | exactly n − 1 comparisons |
| Hiring problem | hires: worst / expected | n / **Hₙ = ln n + O(1)** | |
| Chaining | INSERT / DELETE (pointer) / SEARCH | Θ(1) / Θ(1) / **Θ(1 + α)** expected | worst SEARCH Θ(n) |
| Open addressing | unsuccessful / insert | **≤ 1/(1 − α)** probes | α < 1 |
| | successful | **≤ (1/α) ln(1/(1 − α))** | α = ½ gives < 1.39; α = 0.9 gives < 2.56 |
| Direct-address table | all operations | Θ(1) | space Θ(size of the universe U) |

**Sorting comparison (MT2 adds heapsort and quicksort to MT1's list)**

| | Heapsort | Merge sort | Quicksort (randomized) | Insertion sort |
|---|---|---|---|---|
| Worst | Θ(n lg n) | Θ(n lg n) | Θ(n²) (rare) | Θ(n²) |
| Expected | Θ(n lg n) | Θ(n lg n) | Θ(n lg n), small constants | Θ(n²) |
| Extra space | Θ(1) | Θ(n) | Θ(lg n) expected stack | Θ(1) |
| Stable | no | yes | no | yes |

---

## 1. Topic 9 · Heaps, Heapsort & Priority Queues (CLRS Ch 6)

### 1.1 Shape and index arithmetic
- A heap is a **nearly complete binary tree**: every level is full except possibly the last, which is filled **left to right**. It is stored in A[1..n], with A.heap-size ≤ A.length.
- PARENT(i) = ⌊i/2⌋, LEFT(i) = 2i, RIGHT(i) = 2i + 1. With 0-indexing these are ⌊(i−1)/2⌋, 2i + 1 and 2i + 2.
- **Max-heap property:** A[PARENT(i)] ≥ A[i] for every i > 1, so the max is at A[1]. A min-heap flips the inequality.
- **Height = ⌊lg n⌋.** The leaves are exactly indices **⌊n/2⌋ + 1 … n**.
- There are at most **⌈n / 2^(h+1)⌉ nodes of height h**.
- An n-element heap with height h has 2ʰ ≤ n ≤ 2^(h+1) − 1 elements.
- The **minimum of a max-heap is in some leaf**. The second-largest element is a child of the root.
- A **descending sorted array is a max-heap**, but a max-heap is usually not sorted, because siblings are unordered.
- **d-ary heap:**
  - Children of i: d(i−1) + 2 … di + 1. Parent: ⌊(i − 2)/d⌋ + 1.
  - Height Θ(log_d n). INSERT is O(log_d n), and EXTRACT-MAX is O(d log_d n) because it compares d children per level.
  - **Ternary heap (Exercise 4):** children 3i − 1, 3i, 3i + 1; parent ⌊(i + 1)/3⌋. The largest child subtree has ≤ 3n/5 nodes, so HEAPIFY satisfies T(n) = T(3n/5) + Θ(1) = **Θ(lg n)** (master case 2). BUILD is still Θ(n).

### 1.2 MAX-HEAPIFY
```
MAX-HEAPIFY(A, i)                 // precondition: subtrees at LEFT(i), RIGHT(i) are max-heaps
  l = LEFT(i);  r = RIGHT(i)
  if l ≤ A.heap-size and A[l] > A[i]   largest = l
  else largest = i
  if r ≤ A.heap-size and A[r] > A[largest]   largest = r
  if largest ≠ i
      exchange A[i] with A[largest]
      MAX-HEAPIFY(A, largest)
```
- **Precondition:** both child subtrees are already max-heaps; only A[i] may be "too small".
- **Postcondition:** the subtree rooted at i is a max-heap.
- **Recurrence:** T(n) ≤ T(2n/3) + Θ(1) = O(lg n). Each child's subtree has at most **2n/3** nodes, and the worst case is a half-full bottom level. On a node of height h it costs O(h).

### 1.3 BUILD-MAX-HEAP
```
BUILD-MAX-HEAP(A, n)
  A.heap-size = n
  for i = ⌊n/2⌋ downto 1          // leaves ⌊n/2⌋+1..n are already 1-element heaps
      MAX-HEAPIFY(A, i)
```
**Loop invariant:** at the start of each iteration of the for loop, **each node i + 1, i + 2, …, n is the root of a max-heap**.
- Init: i = ⌊n/2⌋, so nodes ⌊n/2⌋ + 1 … n are leaves, which are trivial heaps.
- Maintenance: the children of i have larger indices, so they are heap roots by the invariant. That satisfies HEAPIFY's precondition, and afterwards i is a heap root too. Decrementing i restores the invariant.
- Termination: i = 0, so node 1 is the root of a max-heap. ∎

**Why it's O(n), not O(n lg n):** Σₕ₌₀^(⌊lg n⌋) ⌈n/2^(h+1)⌉ · O(h) = O(n Σ h/2ʰ) = **O(2n) = O(n)**, using Σ k xᵏ = x/(1−x)² with x = ½. Half the nodes are leaves that cost 0, a quarter sink at most 1 level, and so on. The few nodes that sink far are near the top.
**Contrast:** building by n successive INSERTs costs **Θ(n lg n)** in the worst case, on increasing input (PS3 P2).

**Trace (CLRS):** A = ⟨4, 1, 3, 2, 16, 9, 10, 14, 8, 7⟩ (n = 10, so start at i = 5). BUILD gives **⟨16, 14, 10, 8, 7, 9, 3, 2, 4, 1⟩**.
**HEAPIFY trace:** MAX-HEAPIFY(A, 2) on ⟨16, **4**, 10, 14, 7, 9, 3, 2, 8, 1⟩. 4 swaps with 14 (index 4), then with 8 (index 9), giving ⟨16, 14, 10, 8, 7, 9, 3, 2, 4, 1⟩.

### 1.4 Heapsort
```
HEAPSORT(A, n)
  BUILD-MAX-HEAP(A, n)
  for i = n downto 2
      exchange A[1] with A[i]          // max goes to its final slot
      A.heap-size = A.heap-size − 1
      MAX-HEAPIFY(A, 1)
```
**Loop invariant (CLRS Ex 6.4-2):** at the start of each for iteration, A[1..i] is a max-heap containing the **i smallest** elements of A[1..n], and A[i+1..n] contains the **n − i largest** elements of A[1..n], **in sorted order**.

- Cost: Θ(n) build + (n − 1) × O(lg n) = **Θ(n lg n)**. Even the best case is Θ(n lg n) when the elements are distinct (CLRS 6.4-5); if all elements are equal it's Θ(n).
- **In place, not stable.**

### 1.5 Priority queues (max-priority version)
```
HEAP-MAXIMUM(A)          HEAP-EXTRACT-MAX(A)                 HEAP-INCREASE-KEY(A, i, key)
  return A[1]              if A.heap-size < 1: error "underflow"   if key < A[i]: error "new key smaller"
                           max = A[1]                           A[i] = key
                           A[1] = A[A.heap-size]                while i > 1 and A[PARENT(i)] < A[i]
                           A.heap-size = A.heap-size − 1            exchange A[i] with A[PARENT(i)]
                           MAX-HEAPIFY(A, 1)                        i = PARENT(i)
                           return max
MAX-HEAP-INSERT(A, key)
  A.heap-size = A.heap-size + 1
  A[A.heap-size] = −∞
  HEAP-INCREASE-KEY(A, A.heap-size, key)
```
**INCREASE-KEY invariant (CLRS Ex 6.5-6):** at the start of each while iteration, A[1..heap-size] satisfies the max-heap property, **except for at most one violation: A[i] may be larger than A[PARENT(i)]**. Also, if PARENT(i) exists, A[PARENT(i)] ≥ A[LEFT(i)] and A[PARENT(i)] ≥ A[RIGHT(i)].

- **Costs:** MAXIMUM Θ(1); EXTRACT-MAX, INCREASE-KEY, INSERT and DELETE(i) are O(lg n). For DELETE(i), swap with the last element, shrink the heap, then sift up or down.
- **Applications:**
  - Job scheduling (max-PQ).
  - Event-driven simulation (min-PQ).
  - Dijkstra and Prim (Topics 17–18).
  - **Top-k (PS3 P1):** BUILD-MAX-HEAP then k EXTRACT-MAXes costs **O(n + k lg n)**, which beats sorting when k = o(n / lg n).
  - Merging k sorted lists in O(n lg k) with a min-heap of the list heads.
  - Running median with two heaps.

---

## 2. Topic 8 · Binary Search Trees (CLRS Ch 12)

### 2.1 Property and walks
- **BST property:** for every node x, keys in x.left's subtree are ≤ x.key, and keys in x.right's subtree are ≥ x.key.
- **INORDER-TREE-WALK** (left, node, right) prints the keys in **sorted order** in **Θ(n)**. **Theorem 12.1:** with d the per-node cost, T(n) = T(k) + T(n − k − 1) + d gives T(n) ≤ (c + d)n + c by substitution, for any split k.
- **Preorder** (node, left, right) is for copying or serializing a tree. **Postorder** (left, right, node) is for freeing memory and evaluating expression trees.
- **BST vs heap:** a heap orders parents vs children (fast max). A BST orders left vs right (search, successor, range queries, sorted output). To get sorted output, a heap needs Θ(n lg n) of extractions, while a BST needs only a Θ(n) walk.

### 2.2 Queries, all O(h) (Theorem 12.2)
```
TREE-SEARCH(x, k)                    // iterative is fine too
  while x ≠ NIL and k ≠ x.key
      if k < x.key: x = x.left else x = x.right
  return x

TREE-MINIMUM(x)                       TREE-MAXIMUM(x)
  while x.left ≠ NIL: x = x.left        while x.right ≠ NIL: x = x.right
  return x                              return x

TREE-SUCCESSOR(x)
  if x.right ≠ NIL
      return TREE-MINIMUM(x.right)          // case 1: leftmost node of the right subtree
  y = x.p                                    // case 2: climb until we come from a LEFT child
  while y ≠ NIL and x == y.right
      x = y;  y = y.p
  return y
```
- **Successor lemma (case 2):** if x has no right child, succ(x) is the **lowest ancestor of x whose left child is also an ancestor of x** (counting x as its own ancestor). PREDECESSOR is symmetric.
- **Exercise 5 lemma:** if x has **two children**, succ(x) has **no left child**, and pred(x) has no right child.
  - Proof: suppose S = succ(x) had a left child Y. Then x.key < Y.key < S.key, contradicting the minimality of S.
  - Ruling out other locations: S can't be an ancestor of x, and it can't be a "cousin". So S lies in x's right subtree.
  - Why it matters: DELETE splices out y with a single TRANSPLANT.
- Successor never compares keys, only structure. It works with duplicate keys too.

### 2.3 Insert and delete, O(h) (Theorem 12.3)
```
TREE-INSERT(T, z)                      TRANSPLANT(T, u, v)          // replace subtree u by subtree v
  y = NIL;  x = T.root                   if u.p == NIL: T.root = v
  while x ≠ NIL                          elseif u == u.p.left: u.p.left = v
      y = x                              else u.p.right = v
      if z.key < x.key: x = x.left       if v ≠ NIL: v.p = u.p
      else x = x.right
  z.p = y                              TREE-DELETE(T, z)
  if y == NIL: T.root = z                if z.left == NIL: TRANSPLANT(T, z, z.right)      // case 1
  elseif z.key < y.key: y.left = z       elseif z.right == NIL: TRANSPLANT(T, z, z.left)  // case 2
  else y.right = z                       else y = TREE-MINIMUM(z.right)                    // case 3: successor
                                              if y ≠ z.right                              // 3b: y deeper
                                                  TRANSPLANT(T, y, y.right)
                                                  y.right = z.right;  y.right.p = y
                                              TRANSPLANT(T, z, y)
                                              y.left = z.left;  y.left.p = y
```
- **The three delete cases:**
  1. No left child: replace z by its right child, which may be NIL.
  2. No right child: replace z by its left child.
  3. Two children: the **successor y = TREE-MINIMUM(z.right)** has no left child. If y is not z's right child, first replace y by y.right. Then put y in z's place and give it z's left subtree.
- TRANSPLANT is O(1). It does **not** update v.left or v.right; the caller does that.
- **Common mistakes:**
  - Forgetting to set z.p on insert.
  - Forgetting v.p in TRANSPLANT.
  - Using the predecessor while mixing up the cases.
  - Copying keys instead of relinking, which breaks external pointers.

**Trace (CLRS Fig 12.2):** insert 15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9.
- Inorder: 2 3 4 6 7 9 13 15 17 18 20.
- succ(15) = 17 (min of the right subtree). succ(13) = 15 (climb: 13 is in 6's right subtree, and 6 is 15's left child). pred(6) = 4.
- **Delete 6** (two children): succ = 7 = z.right, so case 3a. Then 7 replaces 6 and takes 6's left subtree (3). 15 now has left child 7, with children 3 and 13, and 13 has left child 9.

### 2.4 Height is everything
- Every operation is O(h). **h ranges from ⌊lg n⌋ (balanced) to n − 1 (a path).**
- Inserting **sorted** (or reverse-sorted) keys builds a path, so each operation is Θ(n). Building by n inserts then costs Θ(n²) worst and Θ(n lg n) best.
- **Theorem 12.4:** the expected height of a **randomly built** BST (a uniformly random insertion order) is **O(lg n)**. Its expected average depth is also O(lg n), which is the same analysis as quicksort.
- You rarely control the insertion order, and deletions break the randomness. That's why Topic 11 exists.
- **BST sort** costs the same as quicksort with the first element as pivot: Θ(n lg n) expected and Θ(n²) worst.

---

## 3. Topic 11 · 2-3-4 Trees & Red-Black Trees (Sedgewick Ch 15, CLRS Ch 13)

### 3.1 2-3-4 trees, also called (2,4) trees
- **Nodes:** a 2-node has 1 key and 2 children, a 3-node has 2 keys and 3 children, and a 4-node has 3 keys and 4 children. Keys within a node are sorted, and the children sit between the keys.
- **Every leaf is at the same depth** (perfect balance). For n keys, **½ lg(n + 1) ≤ h ≤ lg(n + 1)**, so h = Θ(lg n).
- **Search:** at each node, compare against ≤ 3 keys and descend into the correct child. O(lg n).
- **Insert (top-down, Sedgewick):**
  - On the way down, **split every 4-node you meet**: its middle key moves up into the parent, and the other two keys become 2-nodes. The parent can't be a 4-node, because it would already have been split.
  - Insert into the leaf, which now has room.
  - The **tree grows taller only when the root splits**, so all leaves stay level.
- **Insert (bottom-up, Goodrich):** insert into a leaf. On **overflow** (4 keys), split it and push a key up, which may cascade to the root.
- **Delete:**
  1. Swap the key with its successor in a leaf.
  2. Remove it from the leaf.
  3. On **underflow** (an empty node), either **transfer** (a 3- or 4-node sibling lends a key through the parent, like a rotation) or **fuse** (merge with a 2-node sibling plus the separating parent key). Fusion may cascade upward, and the tree shrinks when the root empties.
- **Trace:** insert 10, 20, 30, which fills one 4-node [10 20 30]. Inserting 15 splits on the way down: 20 becomes the root with children [10] and [30], and 15 joins to make [10 15].

### 3.2 Red-black properties (CLRS 13.1)
1. Every node is red or black.
2. **The root is black.**
3. Every leaf (NIL, i.e. T.nil) is black.
4. **A red node has two black children** (no red-red parent–child pair).
5. For every node, **every simple path down to a descendant leaf has the same number of black nodes**. That number is the **black-height bh(x)**, which doesn't count x itself.

**Lemma 13.1:** a red-black tree with n internal nodes has **height ≤ 2 lg(n + 1)**.
**Proof:**
1. **Claim:** the subtree at x contains ≥ 2^(bh(x)) − 1 internal nodes. Prove it by induction on height(x). Each child has bh ≥ bh(x) − 1, so the subtree has ≥ 2(2^(bh(x)−1) − 1) + 1 = 2^(bh(x)) − 1 internal nodes.
2. By property 4, at least half the nodes on any root-to-leaf path are black, so bh(root) ≥ h/2.
3. So n ≥ 2^(h/2) − 1, which gives **h ≤ 2 lg(n + 1)**. ∎

### 3.3 The 2-3-4 ↔ red-black correspondence (the easiest way to remember everything)
| 2-3-4 tree | Red-black tree |
|---|---|
| 2-node (1 key) | a black node |
| 3-node (2 keys) | a black node with **one** red child (leaning either way in CLRS) |
| 4-node (3 keys) | a black node with **two** red children |
| height of the 2-3-4 tree | **black-height** |
| splitting a 4-node (middle key up) | **color flip**: the two red children turn black and the parent turns red (insert case 1) |
| rearranging a 3-node into a balanced 4-node | **rotations** (insert cases 2–3) |

To read a red-black tree as a 2-3-4 tree, merge every red node into its black parent.

### 3.4 Rotations, O(1), preserve the inorder (BST) order
```
LEFT-ROTATE(T, x)                      //      x                 y
  y = x.right                          //     / \               / \
  x.right = y.left                     //    α   y     ⇒       x   γ
  if y.left ≠ T.nil: y.left.p = x      //       / \           / \
  y.p = x.p                            //      β   γ         α   β
  if x.p == T.nil: T.root = y
  elseif x == x.p.left: x.p.left = y
  else x.p.right = y
  y.left = x;  x.p = y
```
- RIGHT-ROTATE is symmetric (swap left and right).
- The inorder order α x β y γ is unchanged.
- Rotations change only a **constant number of pointers**.
- **PS4 P5(a):** any n-node BST can become a right-going chain with **≤ n − 1 right rotations**. Each rotation at a node on the right spine that has a left child moves one more node onto the spine. More generally, any BST can be converted into any other with O(n) rotations (CLRS 13.2-4).

### 3.5 RB-INSERT and RB-INSERT-FIXUP
1. Insert z as in TREE-INSERT, using T.nil.
2. Set z.left = z.right = T.nil and **color z red**. Red keeps every black-height unchanged; only property 2 or 4 can break.
3. Call RB-INSERT-FIXUP(T, z).

```
RB-INSERT-FIXUP(T, z)
  while z.p.color == RED
      if z.p == z.p.p.left
          y = z.p.p.right                         // the UNCLE
          if y.color == RED                       // case 1: recolor, move z up two levels
              z.p.color = BLACK;  y.color = BLACK;  z.p.p.color = RED
              z = z.p.p
          else
              if z == z.p.right                   // case 2: triangle → line
                  z = z.p;  LEFT-ROTATE(T, z)
              z.p.color = BLACK                   // case 3: line → rotate grandparent
              z.p.p.color = RED
              RIGHT-ROTATE(T, z.p.p)
      else (same with "left" and "right" exchanged)
  T.root.color = BLACK
```
**Loop invariant (CLRS 13.3):** at the start of each iteration,
- (a) z is red.
- (b) If z.p is the root, then z.p is black.
- (c) If the tree violates any red-black property, it violates **at most one**: either **property 2** (z is a red root) or **property 4** (z and z.p are both red).

- **Termination:** the loop stops when z.p is black. Then property 4 holds, and the final line fixes property 2.
- **Case 1 (uncle red):** recolor the parent and uncle black and the grandparent red, then set z = grandparent. Only case 1 repeats, so this happens O(lg n) times.
- **Case 2 (uncle black, z is an "inner" child):** rotate z.p to turn the triangle into a line, which is case 3.
- **Case 3 (uncle black, z is an "outer" child):** recolor, then rotate the grandparent. The loop ends.
- **RB-INSERT costs O(lg n) with at most 2 rotations.**

**Trace:**
- Insert 10, 20, 30. 30's uncle is NIL (black) and 30 is an outer child, so this is mirror case 3: LEFT-ROTATE(10). Now 20 is black with red children 10 and 30.
- Insert 15. Its parent 10 is red and its uncle 30 is red, so this is case 1: 10 and 30 turn black and 20 turns red, then the root is recolored black. The result is 20(B), with children 10(B) (right child 15(R)) and 30(B). This matches the 2-3-4 trace in §3.1.

### 3.6 RB-DELETE (know the outline and the counts)
- **BST delete with TRANSPLANT.** Track y, the node actually removed or moved, and its **original color**, and x, the node that moves into y's old position.
- **If y's original color was black**, a black node left a path, and x carries an "extra black" (doubly black). Call RB-DELETE-FIXUP(T, x). With w = x's sibling:
  1. **w is red:** recolor w black and x.p red, rotate x.p toward x, then go on to case 2, 3 or 4.
  2. **w is black and both of w's children are black:** color w red and move the extra black up (x = x.p).
  3. **w is black, w's near child is red and its far child is black:** swap the colors of w and its near child, rotate w away from x, then go to case 4.
  4. **w is black and w's far child is red:** set w's color to x.p's color, make x.p and the far child black, rotate x.p toward x, and set x = root. Done.
- **O(lg n) with at most 3 rotations.** Only case 2 loops, and it moves up the tree.

### 3.7 Why balanced trees? (comparing the Topic 8 and 11 structures)
- An unbalanced BST is Θ(n) per operation in the worst case. Red-black and 2-3-4 trees guarantee **O(lg n)**.
- Tree sort with a red-black tree (PS4 P2): n RB-INSERTs cost O(n lg n), then an inorder walk takes Θ(n), so Θ(n lg n) worst case.
- A red-black tree is **not perfectly balanced**: the longest root-to-leaf path is at most twice the shortest. AVL trees are more rigidly balanced (h ≤ 1.44 lg n) but need more rotations.

---

## 4. Topic 5A · Probabilistic Analysis & Indicator Random Variables (CLRS Ch 5)

### 4.1 The hiring problem
```
HIRE-ASSISTANT(n)
  best = 0                          // candidate 0 is a least-qualified dummy
  for i = 1 to n
      interview candidate i          // cost cᵢ
      if candidate i is better than candidate best
          best = i
          hire candidate i           // cost c_h
```
- Cost: O(cᵢn + c_h m), where m is the number of hires.
- **Worst case m = n:** the candidates arrive in increasing order of quality.
- **Expected m with a random order:** let Xᵢ = I{candidate i is hired}. Candidate i is hired iff they are the best of the first i, and in a random order each of those i is equally likely to be the best, so **Pr = 1/i**. Then E[m] = Σ 1/i = **Hₙ = ln n + O(1)**.
- **Lemma 5.2:** the expected hiring cost is **O(c_h ln n)**, assuming a random order.

### 4.2 The two tools
- **Indicator random variable:** I{A} = 1 if event A occurs, and 0 otherwise.
- **Lemma 5.1: E[I{A}] = Pr{A}.** Proof: 1·Pr{A} + 0·Pr{not A}.
- **Linearity of expectation:** E[Σ Xᵢ] = Σ E[Xᵢ] for **any** random variables, **even dependent ones**.
- E[XY] = E[X]E[Y] requires **independence**. Linearity is for sums, not products.
- **Recipe:**
  1. Write the count you want as a sum of indicators.
  2. Find the probability of each indicator's event.
  3. Add them up.

### 4.3 Worked expectations to have ready
| Quantity | Indicator | Answer |
|---|---|---|
| Heads in n fair flips | Xᵢ = I{flip i heads}, Pr ½ | **n/2** |
| Hires (random order) | I{candidate i best of first i}, Pr 1/i | **Hₙ ≈ ln n** |
| Fixed points of a random permutation | I{π(i) = i}, Pr 1/n | **1** (for any n) |
| Inversions of a random permutation | I{pair (i, j) inverted}, Pr ½ over C(n,2) pairs | **n(n − 1)/4** |
| Position of key k in a random permutation (Exercise 8) | Y = Σ i·I{A[i] = k}, Pr = (n−1)!/n! = 1/n | **(n + 1)/2** (linear search checks half on average) |
| Exercise 7, X ∈ {5, 10, 15} with Pr 3/5, 1/5, 1/5 | definition E[X] = Σ x Pr{X = x} | 3 + 2 + 3 = **8** |
| Exercise 7, total of n rolls of an s-sided die | Xᵢⱼ = I{roll j shows i}, Pr 1/s | **n(s + 1)/2** |
| Pairs sharing a birthday among k people, n days | I{i, j same day}, Pr 1/n | **C(k,2)/n**, which reaches 1 at k ≈ √(2n) + 1 ≈ 28 |
| Balls into n bins until one ball lands in a given bin | geometric with p = 1/n | **n** tosses |
| Balls until every bin is non-empty (coupon collector) | sum of geometric stages | **n Hₙ ≈ n ln n** |
| Longest streak of heads in n flips | (bounded probability) | **Θ(lg n)** |

- **Birthday paradox (exact):** Pr{all k distinct} = Πᵢ₌₁^(k−1) (1 − i/n) ≤ e^(−k(k−1)/2n). This is ≤ ½ once **k ≥ 23** for n = 365.
- **Other facts:**
  - A geometric distribution (wait for the first success with probability p) has expected value **1/p**.
  - A binomial distribution has expected value **np**.
  - **Markov's inequality:** Pr{X ≥ t} ≤ E[X]/t for non-negative X.

### 4.4 Probabilistic analysis vs randomized algorithms
- **Probabilistic analysis** assumes the **input** is random. The bound is only as good as that assumption.
- A **randomized algorithm** makes its **own** random choices, by shuffling first or picking a random pivot. The expectation is then over the algorithm's coin flips and holds for **every** input; no input is always bad. The **worst case can still happen**, just with tiny probability.
```
RANDOMLY-PERMUTE(A, n)             // a.k.a. RANDOMIZE-IN-PLACE; Θ(n)
  for i = 1 to n
      swap A[i] with A[RANDOM(i, n)]
```
**Loop invariant (CLRS 5.3):** just before iteration i, for each possible (i − 1)-permutation of the n elements, A[1..i−1] contains it with probability **(n − i + 1)!/n!**.
- Init: i = 1. There is exactly one 0-permutation, with probability n!/n! = 1.
- Maintenance: Pr{A[1..i] is a specific i-permutation} = Pr{prefix} × Pr{A[i] chosen} = ((n − i + 1)!/n!) · 1/(n − i + 1) = (n − i)!/n!.
- Termination: i = n + 1, so every n-permutation has probability **1/n!**, which means the shuffle is uniform. ∎

**Curveball: `swap A[i] with A[RANDOM(1, n)]` is biased.** It has nⁿ equally likely outcomes, and n! doesn't divide nⁿ for n ≥ 3.
**PERMUTE-BY-SORTING:** assign random priorities in 1..n³ and sort. That's Θ(n lg n), and the priorities are all distinct with probability ≥ 1 − 1/n.
**Online hiring (CLRS 5.4.4):** reject the first k ≈ n/e candidates, then hire the first one better than all of them. You pick the best candidate with probability ≈ **1/e**.

---

## 5. Topic 5B · Quicksort & Randomized Quicksort (CLRS Ch 7)

### 5.1 The algorithm (Lomuto partition)
```
QUICKSORT(A, p, r)
  if p < r
      q = PARTITION(A, p, r)          // pivot ends at its final index q
      QUICKSORT(A, p, q − 1)
      QUICKSORT(A, q + 1, r)

PARTITION(A, p, r)                     // Θ(n), exactly r − p comparisons
  x = A[r]                             // pivot
  i = p − 1
  for j = p to r − 1
      if A[j] ≤ x
          i = i + 1
          exchange A[i] with A[j]
  exchange A[i + 1] with A[r]
  return i + 1

RANDOMIZED-PARTITION(A, p, r)
  i = RANDOM(p, r)
  exchange A[r] with A[i]
  return PARTITION(A, p, r)
```
**PARTITION loop invariant (CLRS 7.1):** at the start of each for iteration, for any index k,
1. if p ≤ k ≤ i, then A[k] ≤ x;
2. if i + 1 ≤ k ≤ j − 1, then A[k] > x;
3. if k = r, then A[k] = x.

(A[j..r−1] is still unrestricted.)
- Init: i = p − 1 and j = p, so both regions are empty.
- Maintenance: if A[j] > x, just j++ (it joins region 2). If A[j] ≤ x, i++ and swap A[i] with A[j]. The element moved out of region 2 into slot j is > x, and the new A[i] ≤ x.
- Termination: j = r. Swapping A[i+1] with A[r] puts the pivot between the regions, so A[p..q−1] ≤ A[q] < A[q+1..r].

**Trace (CLRS Fig 7.1):** A = ⟨2, 8, 7, 1, 3, 5, 6, **4**⟩. The result is ⟨2, 1, 3, **4**, 7, 5, 6, 8⟩ and the call returns **q = 4**.
**Hoare partition (CLRS Problem 7-1):** two indices move inward from both ends and swap out-of-place pairs. It does fewer swaps and returns j, splitting into A[p..j] and A[j+1..r]. The pivot is **not** necessarily in its final place.

### 5.2 Performance (CLRS 7.2, 7.4)
| Split | Recurrence | Time |
|---|---|---|
| worst: 0 : n − 1 every time (sorted / reverse-sorted input with last-element pivot; **all-equal keys with Lomuto**) | T(n) = T(n − 1) + Θ(n) | **Θ(n²)** |
| best: n/2 : n/2 | T(n) = 2T(n/2) + Θ(n) | Θ(n lg n) |
| any constant ratio, even 99 : 1 | depth log_(100/99) n = Θ(lg n), ≤ cn per level | **Θ(n lg n)** |
| alternating good and bad splits | a bad split followed by a good one costs about one good split | Θ(n lg n) |

**Worst-case proof (substitution):** T(n) = max over 0 ≤ q ≤ n−1 of (T(q) + T(n − q − 1)) + Θ(n). Guess T(n) ≤ cn². q² + (n − q − 1)² is maximized at an endpoint, giving (n − 1)². So T(n) ≤ c(n − 1)² + Θ(n) ≤ cn² for c large enough, and the bound is **Θ(n²)**.

### 5.3 Expected running time: the indicator-variable proof (CLRS 7.4)
1. **Lemma 7.1:** quicksort's running time is **O(n + X)**, where X is the total number of comparisons in PARTITION.
2. Rename the elements by rank, z₁ < z₂ < … < zₙ, and let Zᵢⱼ = {zᵢ, …, zⱼ}.
3. **Each pair is compared at most once**, because comparisons are only made with the pivot and the pivot is then excluded from both recursive calls.
4. zᵢ and zⱼ are compared **iff one of them is the first pivot chosen from Zᵢⱼ**. If some pivot strictly between them comes first, they're separated forever. Each of the j − i + 1 elements is equally likely to be first, so **Pr{zᵢ compared with zⱼ} = 2/(j − i + 1)**.
5. **E[X] = Σᵢ₌₁ⁿ⁻¹ Σⱼ₌ᵢ₊₁ⁿ 2/(j − i + 1) = Σᵢ Σₖ₌₁ⁿ⁻ⁱ 2/(k + 1) < Σᵢ Σₖ₌₁ⁿ 2/k = O(n lg n).**

So randomized quicksort runs in **expected O(n lg n) on every input**, and the bound is tight: also Ω(n lg n) expected.

### 5.4 Practical details and variants
- In place; **not stable**; the stack is Θ(lg n) expected and Θ(n) worst.
- **Recursing on the smaller side first** (tail recursion on the larger side) keeps the stack at O(lg n) worst case.
- **Equal keys:** Lomuto puts everything on the ≤ side, so all-equal input is Θ(n²) **even with random pivots**. The **three-way partition** (PS5 P1) into < x, = x and > x recurses only on the strict sides, so all-equal input is **Θ(n)**.
- **Library tweaks:**
  - Insertion sort for small subarrays (≲ 16 elements).
  - Median-of-3 pivot selection.
  - **Introsort:** fall back to heapsort if the recursion gets too deep, which guarantees Θ(n lg n).
- **With SELECT (Topic 10A)** as the pivot rule (the true median), quicksort is Θ(n lg n) worst case, but slower in practice.

---

## 6. Topic 6 · Hash Tables (CLRS Ch 11)

### 6.1 Direct addressing and chaining
- **Direct-address table:** T[0..size of U − 1], with every operation Θ(1). Space is Θ(size of U), so it only works when the universe U of keys is small.
- **Hash table:** m slots and h: U → {0, …, m − 1}. A **collision** means h(k₁) = h(k₂). Collisions are unavoidable when the universe is larger than m (pigeonhole).
- **Chaining:** slot j holds a (doubly) linked list of the keys that hash to j.
  - INSERT: prepend in **Θ(1)**, assuming the key isn't already present (otherwise search first).
  - DELETE: **Θ(1)** given a pointer, with doubly linked chains.
  - SEARCH: proportional to the chain length.
- **Load factor α = n/m** (it can be > 1 with chaining).
- **Independent uniform hashing** (3e called it "simple uniform hashing"): each key is equally likely to hash to any slot, independently of the others.
- **Theorem 11.1 (unsuccessful search)** and **Theorem 11.2 (successful search):** both take **Θ(1 + α)** expected time. The successful case is exactly 1 + α/2 − α/2n.
- If m = Θ(n), α = O(1), and **every dictionary operation is O(1) on average**. The worst case is **Θ(n)**, when all keys land in one slot.

### 6.2 Hash functions (CLRS 11.3)
- **Division method, h(k) = k mod m:**
  - Choose m **prime and not close to a power of 2**.
  - With m = 2ᵖ you'd only use the low p bits of k.
  - With m = 2ᵖ − 1 and character-string keys, permuting the characters doesn't change the hash.
- **Multiplication method, h(k) = ⌊m (kA mod 1)⌋** with 0 < A < 1:
  - m can be a power of 2.
  - Knuth suggests A ≈ (√5 − 1)/2 ≈ 0.618.
  - 4e's "multiply-shift" form is h(k) = (k·a mod 2ʷ) >> (w − ℓ).
- **Universal hashing:**
  - Choose h at random from a family H such that for every pair of distinct keys k, l, at most H/m of the functions collide on them. Equivalently, **Pr{h(k) = h(l)} ≤ 1/m**.
  - Standard family: **h_ab(k) = ((ak + b) mod p) mod m**, with p a prime larger than any key, a ∈ {1..p−1} and b ∈ {0..p−1}.
  - Consequence: with chaining, the expected chain length seen by any key is ≤ 1 + α, and any sequence of n operations with O(m) inserts takes **Θ(n) expected**, no matter what the adversary chooses. This is what defeats malicious inputs.
- **Perfect hashing (extra):** for a **static** key set, two levels of universal hashing give O(1) **worst-case** lookups in O(n) space.

### 6.3 Open addressing (CLRS 11.4)
- All keys live in the table itself, so **α ≤ 1**. The probe sequence h(k, 0), h(k, 1), …, h(k, m − 1) must be a **permutation** of 0..m−1.

| Probing | h(k, i) | Distinct probe sequences | Problem |
|---|---|---|---|
| Linear | (h′(k) + i) mod m | m | **primary clustering**: long runs of occupied slots grow and merge |
| Quadratic | (h′(k) + c₁i + c₂i²) mod m | m | **secondary clustering**: keys with the same h′ get the same sequence; the constants must be chosen so every slot is reachable |
| **Double hashing** | (h₁(k) + i·h₂(k)) mod m | **Θ(m²)** | closest to uniform. **h₂(k) must be relatively prime to m**: either m prime with 0 < h₂ < m (e.g. h₂ = 1 + (k mod m′), m′ = m − 1), or m = 2ᵖ with h₂ always odd |

```
HASH-INSERT(T, k)                       HASH-SEARCH(T, k)
  i = 0                                   i = 0
  repeat                                  repeat
      q = h(k, i)                             q = h(k, i)
      if T[q] == NIL or T[q] == DELETED       if T[q] == k: return q
          T[q] = k;  return q                 i = i + 1
      i = i + 1                           until T[q] == NIL or i == m     // DELETED does NOT stop the search
  until i == m                            return NIL
  error "hash table overflow"
```
- **Theorem 11.6 (uniform hashing):** an unsuccessful search takes **≤ 1/(1 − α)** expected probes. The first probe hits an occupied slot with probability α, the next with probability less than α, and so on, so the bound is 1 + α + α² + … (**Corollary 11.7:** insertion costs the same).
- **Theorem 11.8:** a successful search takes **≤ (1/α) ln(1/(1 − α))** expected probes.
- Numbers to remember: α = ½ gives ≤ 2 unsuccessful and < 1.39 successful probes. α = 0.9 gives ≤ 10 and < 2.56.
- **Linear probing (Knuth):** about ½(1 + 1/(1 − α)) probes for a successful search and ½(1 + 1/(1 − α)²) for an unsuccessful one. The **squared** term is the cost of clustering.
- **Resizing:** double m and rehash once α passes a threshold. Insertion is then O(1) **amortized**.

### 6.4 Deletion and tombstones (Exercise 9)
- **The bug:** with m = 5 and h(3) = h(8) = 3, insert 3 (slot 3), then insert 8 (probes to slot 4), then delete 3 by writing NIL. Now a search for 8 hits NIL at slot 3 and reports "absent" even though 8 is in slot 4. The NIL cut the probe chain.
- **The fix:** DELETE writes **DELETED**. Search **steps over** DELETED, and only a true NIL stops it. Insert may **reuse** a DELETED slot, but only after confirming the key isn't stored further along the chain, or you'll create duplicates.
- **The twist:** probe sequences can cross up to m tombstones, so DELETE and SEARCH become **Θ(m) worst case, not Θ(n)**. Search times no longer depend on α alone, so you need to rehash periodically.
- **Chaining is preferred when deletions are frequent.**

### 6.5 Traces (CLRS Ex 11.4-1): keys 10, 22, 31, 4, 15, 28, 17, 88, 59 into m = 11
- **Linear probing, h′(k) = k mod 11:** 10 goes to 10, 22 to 0, 31 to 9, 4 to 4. 15 hashes to 4 (taken), so slot 5. 28 goes to 6. 17 hashes to 6, so slot 7. 88 hashes to 0, so slot 1. 59 hashes to 4 and probes 5, 6, 7 (all taken), landing in slot 8.
  Table: `[22, 88, –, –, 4, 15, 28, 17, 59, 31, 10]`.
- **Double hashing, h₁ = k mod 11, h₂ = 1 + (k mod 10):** 15 starts at 4, then steps by 6 to 10 (taken) and 5 (free), so it lands in 5. 17 starts at 6, then steps by 8 to 3. 88 starts at 0, then steps by 9 to 9 (taken) and 7, so it lands in 7. 59 starts at 4, then steps by 10 to 3 (taken) and 2, so it lands in 2.
  Table: `[22, –, 59, 17, 4, 15, 28, 88, –, 31, 10]`.
- **Chaining with the same h:** slot 0 holds 88 → 22, slot 4 holds 59 → 15 → 4, and slot 6 holds 17 → 28 (each new key is prepended). α = 9/11.

### 6.6 Hash table vs BST
| | Hash table | Balanced BST |
|---|---|---|
| SEARCH / INSERT / DELETE | **O(1) expected**, Θ(n) worst | **O(lg n) worst** |
| MIN, MAX, SUCCESSOR, range queries, sorted output | Θ(n) (no order) | O(lg n), and Θ(n) for sorted output |
| Needs | a good hash function, resizing | a comparison order |

---

## 7. Every lemma, theorem and loop invariant on MT2 (index)

| # | Statement | Where | Proof idea |
|---|---|---|---|
| 1 | MAX-HEAPIFY: if both subtrees are heaps, the result at i is a heap; T(n) ≤ T(2n/3) + Θ(1) | CLRS 6.2 | induction down the path |
| 2 | BUILD-MAX-HEAP invariant: nodes i+1..n are roots of max-heaps; Θ(n) | CLRS 6.3 | invariant; Σ h/2ʰ = 2 |
| 3 | At most ⌈n/2^(h+1)⌉ nodes of height h; leaves are ⌊n/2⌋+1..n; height ⌊lg n⌋ | CLRS 6.1, Ex 6.3-3 | counting |
| 4 | HEAPSORT invariant: A[1..i] is a heap of the i smallest; A[i+1..n] is the n − i largest, sorted | CLRS Ex 6.4-2 | invariant |
| 5 | INCREASE-KEY invariant: at most one violation, A[i] vs A[PARENT(i)] | CLRS Ex 6.5-6 | invariant |
| 6 | Ternary heap heapify Θ(lg n) via T(3n/5) + Θ(1) | Exercise 4 | master case 2 |
| 7 | Inorder walk is Θ(n) (Thm 12.1); queries O(h) (12.2); insert/delete O(h) (12.3) | CLRS 12 | substitution; single path |
| 8 | Successor: min of the right subtree, or the lowest ancestor whose left child is an ancestor | CLRS 12.2 | BST property |
| 9 | Two children ⇒ the successor has no left child (and the predecessor has no right child) | Exercise 5 / CLRS Ex 12.2-5 | contradiction |
| 10 | A randomly built BST has expected height O(lg n) | CLRS Thm 12.4 | random variables (exponential height) |
| 11 | RB Lemma 13.1: h ≤ 2 lg(n + 1); the subtree at x has ≥ 2^(bh(x)) − 1 internal nodes | CLRS 13.1 | induction plus property 4 |
| 12 | Rotations preserve the inorder order and are O(1) | CLRS 13.2 | inspection |
| 13 | RB-INSERT-FIXUP invariant (z red; at most one violation, property 2 or 4) | CLRS 13.3 | cases 1–3 |
| 14 | Insert ≤ 2 rotations; delete ≤ 3 rotations; both O(lg n) | CLRS 13.3–13.4 | only case 1 (insert) / case 2 (delete) loops |
| 15 | Any BST becomes a right chain in ≤ n − 1 right rotations | PS4 5(a) / CLRS 13.2-4 | each rotation extends the right spine by 1 |
| 16 | Lemma 5.1: E[I{A}] = Pr{A}; linearity of expectation | CLRS 5.2 | definition |
| 17 | Lemma 5.2: the expected hiring cost is O(c_h ln n) | CLRS 5.2 | Pr{hire i} = 1/i, Hₙ |
| 18 | RANDOMLY-PERMUTE invariant: each (i−1)-permutation has probability (n − i + 1)!/n! | CLRS 5.3 | invariant ⇒ uniform |
| 19 | PARTITION invariant (three regions) | CLRS 7.1 | invariant |
| 20 | Quicksort worst case Θ(n²) | CLRS 7.4.1 | substitution, max at the endpoints |
| 21 | Lemma 7.1: running time O(n + X); Pr{zᵢ vs zⱼ} = 2/(j − i + 1); E[X] = O(n lg n) | CLRS 7.4.2 | indicators plus the harmonic sum |
| 22 | Chaining: Θ(1 + α) expected for both unsuccessful and successful search (Thms 11.1, 11.2) | CLRS 11.2 | expected chain length α |
| 23 | Universal family ⇒ Pr{collision} ≤ 1/m ⇒ expected chain ≤ 1 + α | CLRS 11.3 | indicators |
| 24 | Open addressing: unsuccessful ≤ 1/(1 − α) (Thm 11.6, Cor 11.7); successful ≤ (1/α) ln(1/(1 − α)) (Thm 11.8) | CLRS 11.4 | geometric series; average over insert times |

---

## 8. Pathways: how to attack a problem you've never seen

### 8.1 Pick the data structure from the operations
```
What must be fast?
├─ repeatedly get / remove the max (or min) ............ heap: O(1) peek, O(lg n) extract; build in O(n)
├─ k largest / k smallest of n (k ≪ n) ................. BUILD-HEAP + k EXTRACTs, O(n + k lg n)   (PS3 P1)
│                                                         (or SELECT + partition, Topic 10A)
├─ search / insert / delete by key only ................ hash table: O(1) expected
├─ ...plus ordered queries (min, succ, range, sorted) ... balanced BST (red-black / 2-3-4): O(lg n) worst
├─ adversarial inputs must not hurt .................... universal hashing, or a red-black tree (worst-case guarantee)
├─ sort with an O(n lg n) WORST case and O(1) space ..... heapsort
├─ sort, stable, worst case guaranteed .................. merge sort (Topic 7)
└─ sort, fastest in practice ............................ randomized quicksort (three-way if many duplicates)
```

### 8.2 "Compute an expected value" pathway (5A, 5B, Exercises 7–8)
1. Define the random variable X you want to count.
2. **Split it into indicators:** X = Σ Xᵢ, where Xᵢ = I{some simple event}.
3. Compute **Pr{event}** for one indicator. Use symmetry ("each of the i is equally likely to be the best / first / largest") or counting (favourable outcomes / total, e.g. (n−1)!/n!).
4. **Apply linearity:** E[X] = Σ Pr{eventᵢ}. You never need independence.
5. Evaluate the sum: Σ 1/i = Hₙ, C(n,2)·½, or Σ 2/(j − i + 1) = O(n lg n).
6. **Sanity-check** at n = 1 or 2.

### 8.3 "Trace a heap / BST / red-black / hash operation" protocol
- **Heap:**
  - Draw the tree **and** the array.
  - BUILD runs from ⌊n/2⌋ down to 1. At each node, compare with **both** children and swap with the **larger**.
  - EXTRACT moves the **last** element to the root, then sifts it down.
  - INSERT appends at the end, then sifts up.
- **BST delete:** first classify the case (0 or 1 child, or 2 children). In the 2-children case, find the successor and ask whether it is z.right itself.
- **Red-black insert:**
  1. Insert the node red.
  2. Look at the **uncle**. Red uncle: recolor and move up two levels. Black uncle: is z inner (rotate the parent first) or outer (rotate the grandparent and recolor)?
  3. Make the root black at the end.
  4. Cross-check against the 2-3-4 picture.
- **2-3-4 insert:** split every 4-node on the way down **before** descending, then insert into the leaf.
- **Hashing:** write the probe formula with i = 0, 1, 2, …, compute each slot mod m, and stop at the first NIL (search) or the first NIL/DELETED (insert). Track α.
- **PARTITION:**
  - Keep pointer i at the last "≤ pivot" element and pointer j as the scanner.
  - Swap only when A[j] ≤ x.
  - After the scan, put the pivot at i + 1.

### 8.4 "Prove a heap/tree/partition algorithm correct" pathway
1. State the **precondition**. For HEAPIFY that's "subtrees are heaps"; for successor it's the BST property.
2. For loops, write the invariant: BUILD-HEAP's "i + 1..n are heap roots", PARTITION's three regions, HEAPSORT's sorted suffix.
3. For recursion (HEAPIFY, QUICKSORT), use strong induction on the subtree or subarray size.
4. For structural claims (successor has no left child, h ≤ 2 lg(n + 1)), use **contradiction** or **induction on height**.

### 8.5 Analyzing a new randomized algorithm
- Is the randomness in the **input** (probabilistic analysis) or in the **algorithm** (a randomized algorithm)? Say which explicitly.
- Expected running time: write T as a sum of per-step costs, take expectations with linearity, and bound the result.
- Look for a "**good event with constant probability**" argument. Example: a pivot lands in the middle half with probability ½, so in expectation every 2 rounds shrink the input by a constant factor. Selection (10A) uses the same argument.
- Always also state the **worst case**. A randomized algorithm doesn't change it, only its probability.

### 8.6 Writing pseudocode the grader rewards (Correctness 40 / Modularity 30 / Efficiency 30)
- Define the helpers it expects: **PARENT/LEFT/RIGHT, MAX-HEAPIFY, TRANSPLANT, TREE-MINIMUM, PARTITION, HASH(k, i, m)**. Then **call** them instead of inlining.
- State the running time and the invariant in comments.
- **Efficiency traps:**
  - Use BUILD-MAX-HEAP, not n inserts, when you have all the data up front.
  - Top-k is BUILD plus k extractions, not a full sort.
  - The successor search must be O(h), not an inorder walk.
  - The three-way partition must do one pass.
  - Hash search must stop at NIL but **not** at DELETED.
  - Use RB-INSERT, which guarantees O(lg n), for tree sort.

---

## 9. Practice map: what to drill and where (Question Hub)

| Skill | Site resources |
|---|---|
| Heaps | BUILD-MAX-HEAP / HEAPSORT visualizer (t09); arena **`heapify`**, **`ternary-index`**, **`heapify-3way`**; 🎲 heap-index generator; **PS3 P1 `ps3-topk`**, **PS3 P2 `ps3-insert`** |
| BSTs | BST insert/search/delete visualizer (t08); arena **`bst`**, **`bst-successor`**, **`bst-delete`** |
| Red-black / 2-3-4 | RB-INSERT-FIXUP visualizer (t11); **PS4 P2 `ps4-treesort`**, **PS4 5(a) `ps4-chain`** |
| Indicator variables | hiring-problem visualizer (t05a); arena **`dice-expected`** |
| Quicksort | randomized-quicksort visualizer (t05b); arena **`rqs`**, **`rand-select`**; **PS5 P1 `ps5-3way`** |
| Hashing | chaining vs open-addressing visualizer (t06); arena **`hash-delete`**; 🎲 linear-probing generator; **PS5 P2 `ps5-hash`** |

### 9.1 Model pathways for each PS / exercise problem
- **PS3 P1 (largest k):** "faster than sorting" plus "heap" means building in Θ(n) and then k extractions in O(k lg n), for O(n + k lg n) total. Don't heapify k separate times from scratch.
- **PS3 P2 (insert / build by inserts):** INSERT appends and floats up in O(lg n). Building by inserts is Θ(n lg n) worst case (increasing keys make every new key float to the root), compared with Θ(n) for BUILD-MAX-HEAP.
- **PS4 P2 (tree sort):** n RB-INSERTs cost O(lg n) each because of the height bound, then an inorder walk writes the keys back. Θ(n lg n) worst case.
- **PS4 5(a) (right chain):** rotate right at any spine node with a left child. Each rotation adds one node to the spine, so at most n − 1 rotations. Write RIGHT-ROTATE carefully, including the parent pointers and the root case.
- **PS5 1(b,d) (three-way partition):** maintain four regions (< x, = x, unknown, > x) with indices e, i and g. One pass, Θ(n). Then recurse only on the < and > blocks, so all-equal input takes Θ(n).
- **PS5 P2 (double hashing):** HASH(k, i, m) = (k mod m + i(1 + k mod 7)) mod m. INSERT loops i = 0..m−1 and reports overflow.
- **Exercise 4:** redo the index arithmetic for d = 3, derive T(3n/5) + Θ(1), and conclude Θ(lg n).
- **Exercise 5:** prove the successor lemma by eliminating ancestors and cousins, then explain why it makes DELETE a single TRANSPLANT.
- **Exercise 7:** E[X] by definition (8), then n rolls of an s-sided die with indicators: n(s + 1)/2.
- **Exercise 8:** the position of a key in a random permutation is (n + 1)/2. Contrast quickselect (expected O(n)) with quicksort.
- **Exercise 9:** the tombstone bug trace and the Θ(m) delete twist.

### 9.2 Likely curveball questions and the one-line answer
- *Is BUILD-MAX-HEAP O(n lg n)?* That's true but not tight. It's **Θ(n)**.
- *Is a sorted array a heap?* A descending one is a max-heap. *Is a heap sorted?* No.
- *Where is the min of a max-heap?* In a leaf (indices ⌊n/2⌋ + 1..n).
- *Is heapsort stable?* No. *Is it in place?* Yes.
- *Are BST operations O(lg n)?* Only if h = O(lg n). In general they're O(h), and h can be n − 1.
- *What does inserting sorted keys into a plain BST produce?* A path, so each operation is Θ(n).
- *What color is a new red-black node?* Red. *Why?* It keeps the black-heights equal.
- *Does a rotation change the inorder order?* No.
- *What does a black node with two red children correspond to?* A 4-node.
- *When does a 2-3-4 tree grow taller?* Only when the root splits.
- *Does linearity of expectation need independence?* No. E[XY] = E[X]E[Y] does.
- *Does randomization change quicksort's worst case?* No, only the probability of hitting it. It's still Θ(n²).
- *Is a 9:1 split O(n lg n)?* Yes, because the depth is log_(10/9) n.
- *What happens with all-equal keys and Lomuto partition?* Θ(n²). A three-way partition gives Θ(n).
- *Why not m = 2ᵖ with the division method?* Only the low-order bits would matter.
- *Can α exceed 1?* Yes with chaining, never with open addressing.
- *What is chaining's worst-case search?* Θ(n).
- *Why do we need a DELETED marker?* A NIL would end later probe sequences early.
- *What must hold for double hashing?* h₂(k) must be relatively prime to m.
- *Which is better for range queries, a hash table or a BST?* A BST.

---

## 10. Last-minute recall list (write these from memory before the exam)
1. PARENT/LEFT/RIGHT, MAX-HEAPIFY, BUILD-MAX-HEAP with its invariant, and the Σ h/2ʰ = 2 argument for Θ(n).
2. HEAPSORT's loop and invariant, and EXTRACT-MAX / INCREASE-KEY / INSERT with their costs.
3. TREE-SUCCESSOR's two cases, TRANSPLANT, and TREE-DELETE's three cases.
4. The five red-black properties, Lemma 13.1 with its proof, and LEFT-ROTATE.
5. The RB-INSERT-FIXUP cases (red uncle recolors; black uncle rotates, inner then outer) and the 2-3-4 correspondence.
6. Lemma 5.1, linearity, hiring Hₙ, inversions n(n−1)/4, and the RANDOMLY-PERMUTE invariant.
7. PARTITION code, its three-region invariant, and the CLRS trace returning q = 4.
8. The expected-comparisons proof: 2/(j − i + 1), summing to O(n lg n). Worst case Θ(n²).
9. Chaining Θ(1 + α). The open-addressing bounds 1/(1 − α) and (1/α) ln(1/(1 − α)).
10. The three probe sequences with their clustering behaviour, the double-hashing coprime condition, and tombstones.

// ======================= MT1–MT3 LEARNING PATHS: LESSON CONTENT =======================
// Same format as learn-mt4-units.js. Clip specs: [videoId, firstChapter?, lastChapter?].
const LEARN_MT1 = [
{id: 'adt', topics: ['t01'], title: 'Algorithms, ADTs & Basic Data Structures', notes: 'Topic 01', reading: 'CLRS 4e Ch 1, 10',
 lessons: [
  {h: 'What an algorithm is, and what "analysis" means', body: `<p>An <b>algorithm</b> is a finite sequence of unambiguous steps that solves a computational problem. A <b>problem</b> is a relation between inputs and required outputs; one particular input is an <b>instance</b>. An algorithm is <b>correct</b> only if it halts with the right output on <i>every</i> instance. Testing a few inputs is evidence, not proof.</p><p>Analyzing an algorithm means two separate jobs: <b>correctness</b> (proved with loop invariants or induction) and <b>cost</b>. For cost we pick the input size n and the <b>RAM model</b>, where each primitive step (arithmetic, comparison, assignment, array index, call/return) costs O(1), and count steps as a function of n. We discard constants only after the exact count is written down.</p><p>An <b>ADT</b> is a contract (what the operations do); a <b>data structure</b> is an implementation (what they cost). Dynamic sets support SEARCH, INSERT, DELETE, MINIMUM, MAXIMUM, SUCCESSOR and PREDECESSOR.</p>`,
   kid: 'An algorithm is a recipe that must work for every kitchen, not just yours. An ADT is the menu; the data structure is how the kitchen actually cooks it.',
   check: ['An algorithm is correct if…', ['it halts with the correct output on every input instance', 'it works on the sample inputs', 'it runs in polynomial time', 'it never uses recursion'], 'Correctness must hold for all instances, and the algorithm must terminate.']},
  {h: 'Stacks and circular queues', clips: [['86QY8mBX7Ks', 'Understanding stacks', 'Queue implementation details']],
   body: `<p>A <b>stack</b> is LIFO: PUSH and POP work at S.top, both O(1). POP on an empty stack is an <b>underflow</b>; PUSH on a full array is an <b>overflow</b>.</p><p>A <b>queue</b> is FIFO, implemented in an array as a ring: Q.head is the front, Q.tail is the next free slot, and both wrap from Q.size back to 1. The queue is <b>empty</b> when head = tail and <b>full</b> when head = tail + 1 (mod size), so an array of n slots holds at most <b>n − 1</b> items; the spare slot is what tells full from empty. A count field lets you use all n.</p><p><b>PS1:</b> a linked-list stack with head, <b>tail</b> and a size field supports CATENATE(S, T) in O(1): S.tail.next = T.head.</p>`,
   kid: 'A stack is a pile of plates: you take the top one. A queue is a lunch line: first in, first out. In a ring-shaped line, one empty spot is kept so you can tell "full" from "empty".',
   check: ['A circular queue stored in an array of n slots (no count field) can hold at most…', ['n − 1 items', 'n items', 'n + 1 items', 'n/2 items'], 'head = tail means empty, so one slot is sacrificed to distinguish full.']},
  {h: 'Linked lists, sentinels and rooted trees', clips: [['86QY8mBX7Ks', 'Linked list concepts', 'List operations and wrap-up'], ['eECZ_lKXsHs', 'Binary tree structure', 'Left-child right-sibling']],
   body: `<p>In a doubly linked list, SEARCH is Θ(n), but INSERT and DELETE (given a pointer) are Θ(1): just relink x.prev and x.next. In a <b>singly</b> linked list DELETE needs the predecessor, so it is Θ(n). A <b>sentinel</b> L.nil makes the list circular so that x.prev.next = x.next and x.next.prev = x.prev never need NIL checks; it simplifies code without changing the asymptotics.</p><p>Binary-tree nodes store p, left and right. For any branching factor, the <b>left-child, right-sibling</b> representation uses two pointers per node, Θ(n) space total; COUNT-CHILDREN walks the sibling list (PS1 P6). Depth is the number of edges from the root; height is the longest downward path to a leaf.</p>`,
   kid: 'A linked list is a chain of paper clips. A dummy clip at the front means you never have to handle "the end of the chain" as a special case.',
   check: ['Given a pointer to node x, deleting x from a DOUBLY linked list costs…', ['Θ(1)', 'Θ(lg n)', 'Θ(n)', 'Θ(n²)'], 'Only x.prev and x.next are relinked.']}
 ]},
{id: 'growth', topics: ['t03'], title: 'Growth of Functions & Asymptotic Notation', notes: 'Topic 03', reading: 'CLRS 4e Ch 3, App. A',
 extra: [['whjt_N9uYFI', 'Big O Notation', 'Big Omega']],
 lessons: [
  {h: 'O, Ω, Θ, o and ω, defined precisely', clips: [['y86z2OrIYQQ', 'Framework for analysis', 'Examples and applications'], ['4IL2Ir_O_vI']],
   body: `<table class="tbl"><tr><th>Notation</th><th>Definition (for all n ≥ n₀)</th><th>Like</th></tr><tr><td>f = O(g)</td><td>∃ c &gt; 0: f(n) ≤ c·g(n)</td><td>≤</td></tr><tr><td>f = Ω(g)</td><td>∃ c &gt; 0: f(n) ≥ c·g(n)</td><td>≥</td></tr><tr><td>f = Θ(g)</td><td>∃ c₁, c₂: c₁g(n) ≤ f(n) ≤ c₂g(n)</td><td>=</td></tr><tr><td>f = o(g)</td><td>∀ c &gt; 0: f(n) &lt; c·g(n)</td><td>&lt;</td></tr><tr><td>f = ω(g)</td><td>∀ c &gt; 0: f(n) &gt; c·g(n)</td><td>&gt;</td></tr></table><p><b>Theorem 3.1:</b> Θ ⇔ O and Ω. The big notations say "there exists a c"; the little ones say "for every c", so o ⇒ O but not conversely. If f = g, then O, Ω, Θ hold and o, ω fail. To prove 3n² + 10n + 5 = Θ(n²): c₁ = 3 works for n ≥ 1, and c₂ = 4 works for n ≥ 11.</p>`,
   kid: 'Big-O means "grows at most this fast", Big-Omega "at least this fast", Big-Theta "exactly this kind of growth". Little-o means "strictly slower".',
   check: ['If f(n) = g(n) for all n, which statement is FALSE?', ['f = o(g)', 'f = O(g)', 'f = Θ(g)', 'f = Ω(g)'], 'Little-o requires f < c·g for every c > 0, which fails for c = 1.']},
  {h: 'The limit test and the growth ladder', clips: [['uaqLI449XQw']],
   body: `<p>Compute L = lim f(n)/g(n). L = 0 ⇒ f = o(g); 0 &lt; L &lt; ∞ ⇒ Θ; L = ∞ ⇒ ω. If the limit doesn't exist the test is silent (n and n^(1+sin n) are incomparable). L'Hôpital: lg n vs √n gives 2/(√n ln 2) → 0, so lg n = o(√n).</p><p><b>Ladder:</b> 1 &lt; lg* n &lt; lg lg n &lt; lg n &lt; lgᵏ n &lt; n^ε &lt; √n &lt; n &lt; n lg n &lt; n² &lt; 2ⁿ &lt; 3ⁿ &lt; n! &lt; nⁿ. Polylogs lose to every polynomial, polynomials lose to every exponential, n^1.01 beats n lg n, 2^(2n) is not O(2ⁿ), and lg(n!) = Θ(n lg n). Properties: transitivity (all five), reflexivity (O, Ω, Θ), symmetry (Θ), and f = O(g) ⇔ g = Ω(f).</p>`,
   kid: 'Line the functions up like runners in a very long race. Logs are slow walkers, polynomials are bikes, exponentials are rockets.',
   check: ['lim f(n)/g(n) = 5. Then…', ['f = Θ(g)', 'f = o(g)', 'f = ω(g)', 'nothing can be concluded'], 'A positive finite limit means the same growth rate.']},
  {h: 'Logs, exponents and sums you will need', clips: [['f2czg61AtQw', 'Exponentials', 'Factorials']],
   body: `<ul><li>log_b a = log_c a / log_c b, so the base of a log is only a constant factor. a^(log_b c) = c^(log_b a), so 3^(lg n) = n^(lg 3).</li><li>Σ i = n(n + 1)/2; Σ i² = Θ(n³); Σₖ₌₀ⁿ xᵏ = (x^(n+1) − 1)/(x − 1); for x &lt; 1, Σ xᵏ = 1/(1 − x) and Σ k xᵏ = x/(1 − x)², so Σ k/2ᵏ = 2.</li><li>Hₙ = Σ 1/k = ln n + O(1); Σ lg k = Θ(n lg n); Stirling gives n! ≈ √(2πn)(n/e)ⁿ.</li><li>x − 1 &lt; ⌊x⌋ ≤ x ≤ ⌈x⌉ &lt; x + 1.</li></ul><p><b>Trap:</b> Σᵢ₌₁ⁿ O(1) is O(n), not O(1); a hidden constant cannot hide an n.</p>`,
   kid: 'A few math facts do most of the work: adding 1 + 2 + … + n gives about n²/2, and halving again and again only takes about lg n steps.',
   check: ['Σ from i = 1 to n of O(1) is…', ['O(n)', 'O(1)', 'O(lg n)', 'O(n²)'], 'There are n terms; the constant cannot absorb n.']}
 ]},
{id: 'correct', topics: ['t02'], title: 'Proving Correctness & Analyzing Insertion Sort', notes: 'Topic 02', reading: 'CLRS 4e 2.1–2.2',
 lessons: [
  {h: 'Insertion sort', clips: [['euEquYjVVcQ', 'The sorting problem', 'Insertion sort in practice']], viz: 'isort',
   body: `<pre><code>INSERTION-SORT(A, n)
  for i = 2 to n
      key = A[i];  j = i − 1
      while j > 0 and A[j] > key
          A[j + 1] = A[j];  j = j − 1
      A[j + 1] = key</code></pre><p>The sorted prefix A[1..i−1] grows by one element per iteration: shift every larger element one slot right and drop key into the gap. It sorts <b>in place</b> (Θ(1) extra space) and is <b>stable</b>, because the test is strictly A[j] &gt; key, so equal keys are never jumped.</p>`,
   kid: 'Sort playing cards in your hand: pick up one card at a time and slide it left until it fits.',
   check: ['Why is insertion sort stable?', ['The test A[j] > key is strict, so equal keys never pass each other', 'It uses extra memory', 'It sorts from right to left', 'It compares every pair'], 'An equal key stops the shifting loop.']},
  {h: 'The loop-invariant proof', clips: [['t1ranlQmofQ']],
   body: `<p><b>Invariant:</b> at the start of each for iteration, A[1..i−1] consists of the elements originally in A[1..i−1], in sorted order.</p><ul><li><b>Initialization:</b> i = 2, so A[1..1] is one element, trivially sorted.</li><li><b>Maintenance:</b> the while loop shifts A[i−1], A[i−2], … right until it finds A[j] ≤ key, then key goes into A[j+1]; A[1..i] is now the original A[1..i], sorted. (Formally, an inner invariant: A[j+2..i] holds the old A[j+1..i−1], all &gt; key.)</li><li><b>Termination:</b> the loop ends at i = n + 1, so A[1..n] is sorted. Termination is where the invariant meets the exit condition.</li></ul><p>Other invariants to know: <b>linear search</b> x ∉ A[1..i−1]; <b>binary search</b> "if x ∈ A then x ∈ A[left..right]" (PS2 P6); <b>selection sort</b> A[1..i−1] holds the i − 1 smallest, sorted.</p>`,
   kid: 'A loop invariant is a promise that is true before the loop, stays true every lap, and at the end tells you the job is done.',
   check: ['Which part of a loop-invariant proof uses the exit condition of the loop?', ['Termination', 'Initialization', 'Maintenance', 'None of them'], 'Termination combines the invariant with why the loop stopped.']},
  {h: 'Line-by-line cost: best, worst, average', clips: [['UtEMLcKHcGc']],
   body: `<p>Give each line a cost cᵢ and count how often it runs; let tᵢ be the number of while tests for a given i. Then T(n) = Σ cᵢ · (times line i runs).</p><ul><li><b>Best case</b> (already sorted): tᵢ = 1, so T(n) = an + b = <b>Θ(n)</b>.</li><li><b>Worst case</b> (reverse sorted): tᵢ = i, and Σ i = n(n + 1)/2 − 1, so T(n) = <b>Θ(n²)</b>.</li><li><b>Average:</b> about i/2 shifts, still Θ(n²).</li></ul><p>Every shift fixes exactly one <b>inversion</b> (a pair i &lt; j with A[i] &gt; A[j]), so the running time is Θ(n + #inversions); a random permutation has n(n − 1)/4 expected inversions. For nested loops, <b>sum</b> the inner count t(i) instead of multiplying.</p>`,
   kid: 'Already-sorted cards: one quick look each. Backwards cards: every card slides all the way, so the work grows like n².',
   check: ['Worst-case input for insertion sort:', ['A reverse-sorted array', 'A sorted array', 'All equal keys', 'A random array'], 'Every key must shift past all earlier elements.']}
 ]},
{id: 'dc', topics: ['t07'], title: 'Divide & Conquer, Merge Sort & Recurrences', notes: 'Topic 07', reading: 'CLRS 4e 2.3, Ch 4',
 extra: [['whjt_N9uYFI', 'Recurrence', 'master method'], ['-EQTVuAhSFY', 'Divide and conquer concept', 'Analyzing merge sort']],
 lessons: [
  {h: 'Merge sort and the MERGE invariant', clips: [['9BI0Lw1kzkE'], ['1JbqqmK7e5s']], viz: 'msort',
   body: `<p>Divide the array in half, sort each half recursively, and <b>MERGE</b> the two sorted halves in Θ(n) by repeatedly copying the smaller front element. T(n) = 2T(n/2) + Θ(n) = <b>Θ(n lg n)</b>: lg n + 1 levels, each costing cn.</p><p><b>MERGE invariant:</b> A[p..k−1] holds the k − p smallest elements of L and R in sorted order, and L[i], R[j] are the smallest elements not yet copied. Taking from L on ties (≤) makes merge sort <b>stable</b>. It is <b>not</b> in place: Θ(n) extra space. Correctness of MERGE-SORT is by strong induction on n.</p>`,
   kid: 'Split the pile in half, sort each half, then merge by always taking the smaller top card.',
   check: ['Merge sort is stable because MERGE…', ['takes from the left half when the keys are equal (≤)', 'copies into a new array', 'runs in Θ(n)', 'is recursive'], 'Using ≤ keeps equal keys in their original order.']},
  {h: 'Substitution and recursion trees', clips: [['X2D80jsS3sY'], ['8F2OvQIlGiU']],
   body: `<p><b>Substitution:</b> guess the form, then prove it by induction with the <b>exact</b> same constant. T(n) = 2T(n/2) + n ≤ cn lg n − cn + n ≤ cn lg n for c ≥ 1. Trap: "T(n) ≤ cn + n = O(n)" is wrong, because cn + n is not ≤ cn. If the right guess fails by a lower-order term, subtract one: guess cn − d.</p><p><b>Recursion tree:</b> per level, write (#nodes) × (cost per node). 2T(n/2) + cn has cn per level over lg n levels, so Θ(n lg n). 3T(n/4) + cn² shrinks geometrically, so the root wins: Θ(n²). T(n/3) + T(2n/3) + cn is Θ(n lg n). Use the tree to guess, and substitution to prove (Exercise 3 wants all three methods).</p>`,
   kid: 'Draw all the helpers in a tree and add up how much work each row does. Equal rows: multiply by the number of rows. Shrinking rows: the top row wins.',
   check: ['What is wrong with "T(n) ≤ cn + n = O(n)" in a substitution proof?', ['The induction must prove T(n) ≤ cn with the same c', 'Nothing, it is correct', 'The base case is missing', 'It should be O(n lg n) by definition'], 'The hypothesis was T ≤ cn, and cn + n is not ≤ cn.']},
  {h: 'The master theorem', clips: [['h4Avr0byu1g']],
   body: `<p>For T(n) = aT(n/b) + f(n), compare f with n^(log_b a):</p><ol><li>f = O(n^(log_b a − ε)) ⇒ Θ(n^(log_b a)).</li><li>f = Θ(n^(log_b a) lgᵏ n) ⇒ Θ(n^(log_b a) lg^(k+1) n).</li><li>f = Ω(n^(log_b a + ε)) and af(n/b) ≤ cf(n) for some c &lt; 1 ⇒ Θ(f(n)).</li></ol><p>Examples: 9T(n/3) + n = Θ(n²); T(2n/3) + 1 = Θ(lg n); 3T(n/4) + n lg n = Θ(n lg n); 2T(n/2) + n lg n = Θ(n lg² n); 2T(n/2) + n / lg n is a <b>gap</b> (Θ(n lg lg n) by other means). It does not apply to T(n − 1) + n or unequal splits. Strassen: 7T(n/2) + Θ(n²) = Θ(n^(lg 7)). Local max (PS2): T(n/2) + Θ(1) = Θ(lg n).</p>`,
   kid: 'Compare the work at the top with the number of leaves at the bottom. Whichever is bigger wins; if they tie, multiply by lg n.',
   check: ['Solve T(n) = 4T(n/2) + n².', ['Θ(n² lg n)', 'Θ(n²)', 'Θ(n³)', 'Θ(n lg n)'], 'n^(log₂ 4) = n² equals f(n): case 2.']}
 ]}
];

const LEARN_MT2 = [
{id: 'heap', topics: ['t09'], title: 'Heaps, Heapsort & Priority Queues', notes: 'Topic 09', reading: 'CLRS 4e Ch 6',
 lessons: [
  {h: 'Heap shape and MAX-HEAPIFY', clips: [['0zh4IiKaVN0', 'Heap properties', 'Identifying leaves']],
   body: `<p>A heap is a nearly complete binary tree stored in A[1..n]: PARENT(i) = ⌊i/2⌋, LEFT(i) = 2i, RIGHT(i) = 2i + 1. The <b>max-heap property</b> is A[PARENT(i)] ≥ A[i], so the max is A[1]. The height is ⌊lg n⌋, and the leaves are ⌊n/2⌋ + 1..n.</p><p><b>MAX-HEAPIFY(A, i)</b> assumes both subtrees of i are heaps, swaps A[i] with its larger child if needed, and recurses down that child: T(n) ≤ T(2n/3) + Θ(1) = O(lg n), i.e. O(h).</p>`,
   kid: 'A heap is a pyramid where every boss is taller than the people right under them, so the tallest is always on top.',
   check: ['In a 1-indexed heap, the left child of index i is at…', ['2i', '2i + 1', '⌊i/2⌋', 'i + 1'], 'LEFT(i) = 2i, RIGHT(i) = 2i + 1.']},
  {h: 'BUILD-MAX-HEAP is Θ(n)', clips: [['gMwtzAPDupI', 'correctness', 'analysis']], viz: 'heap',
   body: `<p>BUILD-MAX-HEAP calls MAX-HEAPIFY for i = ⌊n/2⌋ down to 1. <b>Invariant:</b> at the start of each iteration, nodes i + 1, …, n are roots of max-heaps (initially they are leaves). A node at height h costs O(h), and there are at most ⌈n/2^(h+1)⌉ such nodes, so the total is O(n Σ h/2ʰ) = O(2n) = <b>Θ(n)</b>. Building by n inserts would cost Θ(n lg n) worst case (PS3 P2).</p>`,
   kid: 'Half the people are already at the bottom and do nothing; only a few near the top have far to sink, so building the pyramid is fast.',
   check: ['BUILD-MAX-HEAP on n elements runs in…', ['Θ(n)', 'Θ(n lg n)', 'Θ(lg n)', 'Θ(n²)'], 'Σ h/2ʰ converges to 2.']},
  {h: 'Heapsort and priority queues', clips: [['8O5iBigvDIw', 'Heapsort', 'Increasing Keys']],
   body: `<p><b>HEAPSORT:</b> build, then for i = n down to 2 swap A[1] with A[i], shrink the heap and heapify the root. Invariant: A[1..i] is a heap of the i smallest, and A[i+1..n] holds the n − i largest in order. Θ(n lg n), <b>in place, not stable</b>.</p><p><b>Priority queue:</b> MAXIMUM Θ(1); EXTRACT-MAX moves the last element to the root and heapifies, O(lg n); INCREASE-KEY floats the key up (invariant: at most one violation, A[i] vs its parent), O(lg n); INSERT appends −∞ and increases it. Top-k (PS3 P1): BUILD plus k EXTRACT-MAXes = O(n + k lg n).</p>`,
   kid: 'Heapsort keeps taking the tallest person off the top of the pyramid and putting them at the end of the line.',
   check: ['Heapsort is…', ['in place but not stable', 'stable and in place', 'stable but not in place', 'neither'], 'Swapping the root across the array breaks stability.']}
 ]},
{id: 'bst', topics: ['t08'], title: 'Binary Search Trees', notes: 'Topic 08', reading: 'CLRS 4e Ch 12',
 lessons: [
  {h: 'The BST property, walks and queries', clips: [['LDncFcNOr_I', 'Binary search tree basics', 'Successors and predecessors']], viz: 'bst',
   body: `<p>For every node x: keys in x.left's subtree ≤ x.key ≤ keys in x.right's subtree. The <b>inorder walk</b> prints the keys sorted in Θ(n). SEARCH, MINIMUM (follow left), MAXIMUM (follow right), SUCCESSOR and PREDECESSOR all follow one path, so they are <b>O(h)</b>.</p><p><b>SUCCESSOR(x):</b> if x has a right subtree, take its minimum; otherwise climb until you arrive from a left child. <b>Exercise 5:</b> if x has two children, its successor has no left child.</p>`,
   kid: 'A BST is the "higher or lower?" guessing game: smaller numbers go left, bigger go right.',
   check: ['If node x has a right subtree, SUCCESSOR(x) is…', ['the minimum of x.right', 'x.p', 'the maximum of x.left', 'the root'], 'The smallest key larger than x is in its right subtree.']},
  {h: 'Insert, delete and why height matters', clips: [['qJ7TyaKSf_0', 'BST insertion procedures', 'BST operation complexity'], ['vx0uWYHIRes']],
   body: `<p>INSERT walks down with a trailing pointer y and attaches z as y's child. DELETE has three cases: no left child (TRANSPLANT z with z.right), no right child (TRANSPLANT with z.left), or two children: take y = MIN(z.right); if y ≠ z.right, first replace y by y.right and give y z's right subtree; then TRANSPLANT z with y and give y z's left subtree.</p><p>Everything is O(h), and h ranges from ⌊lg n⌋ to n − 1: inserting sorted keys builds a path. A randomly built BST has expected height O(lg n) (Thm 12.4), but you rarely control the order, which motivates red-black trees.</p>`,
   kid: 'If you add numbers already in order, the tree becomes one long skinny line and searching gets slow.',
   check: ['Inserting 1, 2, 3, …, n into an empty BST gives height…', ['n − 1', '⌊lg n⌋', 'n/2', '√n'], 'Each key becomes the right child of the previous one.']}
 ]},
{id: 'rbt', topics: ['t11'], title: '2-3-4 Trees & Red-Black Trees', notes: 'Topic 11', reading: 'Sedgewick Ch 15 · CLRS 4e Ch 13',
 extra: [['O3hI9FdxFOM', 'RedBlack Trees', 'Tree height']],
 lessons: [
  {h: '2-3-4 trees: perfect balance by splitting', clips: [['N-Sot-yf3As'], ['W49P7wqdIuE', 'Insertion in 2-4 trees', 'Transfer and complexity']],
   body: `<p>Nodes hold 1, 2 or 3 keys (2-, 3-, 4-nodes), and <b>all leaves have the same depth</b>, so the height is Θ(lg n). <b>Insert:</b> split every 4-node on the way down (the middle key moves up), then insert into the leaf; the tree only grows when the root splits. <b>Delete:</b> swap with the successor in a leaf; on underflow, <b>transfer</b> a key from a sibling through the parent or <b>fuse</b> with a sibling and the parent key.</p>`,
   kid: 'Each box can hold up to 3 numbers. When a box gets too full, the middle number moves up and the box splits, so the tree stays perfectly even.',
   check: ['When does a 2-3-4 tree grow in height?', ['Only when the root splits', 'On every insert', 'When a leaf becomes a 3-node', 'On deletion'], 'Height grows at the top, so all leaves stay level.']},
  {h: 'Red-black properties and the height bound', clips: [['a6LaiKa3ES0']],
   body: `<p>(1) every node is red or black, (2) the root is black, (3) NIL leaves are black, (4) a red node has black children, (5) every path from a node down has the same black-height. <b>Lemma 13.1:</b> the subtree at x has ≥ 2^(bh(x)) − 1 internal nodes, and bh(root) ≥ h/2, so <b>h ≤ 2 lg(n + 1)</b>.</p><p>A black node plus its red children is one 2-3-4 node: 2-node = black, 3-node = black with one red child, 4-node = black with two red children. A color flip is a 4-node split.</p>`,
   kid: 'A red-black tree is a 2-3-4 tree drawn with only two kids per node; the red kids are the extra keys squeezed into the same box.',
   check: ['A 4-node of a 2-3-4 tree corresponds in a red-black tree to…', ['a black node with two red children', 'a red node with two black children', 'three black nodes', 'a black node with one red child'], 'Merge the red children into their black parent.']},
  {h: 'Rotations and RB-INSERT-FIXUP', clips: [['HlwQ_n56MHQ', 'Red-black tree insertion', 'Recoloring red-black trees']], viz: 'rbt',
   body: `<p>Insert as in a BST and color the node <b>red</b> (black-heights stay equal). While z.p is red, look at the <b>uncle</b>: (1) red uncle ⇒ recolor parent and uncle black, grandparent red, move z up two levels; (2) black uncle and z is an inner child ⇒ rotate at the parent to make a line; (3) black uncle, outer child ⇒ recolor and rotate the grandparent. Finally color the root black. Invariant: at most one violation, of property 2 or 4. Rotations are O(1) and keep the inorder order; insert does ≤ 2 rotations and delete ≤ 3, both O(lg n).</p>`,
   kid: 'If a red kid has a red parent, check the uncle: red uncle means repaint everyone, black uncle means twist the family (rotate) and repaint.',
   check: ['A newly inserted node in RB-INSERT is colored…', ['red', 'black', 'its parent\'s color', 'red only if it is a left child'], 'Red keeps black-heights equal; only red-red may need fixing.']}
 ]},
{id: 'prob', topics: ['t05a'], title: 'Probabilistic Analysis & Indicator Variables', notes: 'Topic 05A', reading: 'CLRS 4e 5.1–5.4',
 lessons: [
  {h: 'The hiring problem and indicator random variables', clips: [['MgnvWTZgqcA', 'Indicator Random Variables', 'Example']], viz: 'hire',
   body: `<p>HIRE-ASSISTANT hires whenever a candidate beats the best so far. Worst case: n hires. With a random order, let Xᵢ = I{candidate i is hired}; candidate i is hired iff they are the best of the first i, which happens with probability 1/i. <b>Lemma 5.1:</b> E[I{A}] = Pr{A}. By <b>linearity of expectation</b> (which needs no independence), E[hires] = Σ 1/i = Hₙ = ln n + O(1).</p><p>Recipe: write the count as a sum of indicators, find each probability, add them up.</p>`,
   kid: 'An indicator is a light switch: 1 if something happened, 0 if not. The average of a switch is just the chance it turns on.',
   check: ['Linearity of expectation requires the random variables to be…', ['nothing: it holds even for dependent variables', 'independent', 'identically distributed', 'indicators only'], 'Sums always split; only products need independence.']},
  {h: 'Worked expectations and randomizing the input', clips: [['k-jusEhrRik']],
   body: `<ul><li>Inversions of a random permutation: C(n, 2) pairs, each inverted with probability ½ ⇒ <b>n(n − 1)/4</b>.</li><li>Fixed points of a random permutation: n · 1/n = <b>1</b>.</li><li>Position of a key in a random permutation (Exercise 8): (n + 1)/2. Exercise 7: n rolls of an s-sided die total n(s + 1)/2.</li><li>Birthday pairs among k people: C(k, 2)/n.</li></ul><p><b>Probabilistic analysis</b> assumes a random input; a <b>randomized algorithm</b> flips its own coins, so the bound holds for every input. RANDOMLY-PERMUTE swaps A[i] with A[RANDOM(i, n)]; its invariant gives each (i − 1)-permutation probability (n − i + 1)!/n!, so the result is uniform. Swapping with RANDOM(1, n) is biased.</p>`,
   kid: 'Instead of hoping the line is shuffled, shuffle it yourself. Then no sneaky order can make you slow.',
   check: ['Expected number of inversions in a uniformly random permutation of n distinct elements:', ['n(n − 1)/4', 'n(n − 1)/2', 'n/2', 'n lg n'], 'Each of the C(n,2) pairs is inverted with probability 1/2.']}
 ]},
{id: 'qsort', topics: ['t05b'], title: 'Quicksort & Randomized Quicksort', notes: 'Topic 05B', reading: 'CLRS 4e Ch 7',
 lessons: [
  {h: 'PARTITION and its invariant', clips: [['v1ghdc_hwMI', 'The partition procedure', 'Step-by-step example']], viz: 'qsort',
   body: `<pre><code>PARTITION(A, p, r)
  x = A[r];  i = p − 1
  for j = p to r − 1
      if A[j] ≤ x:  i = i + 1;  swap A[i], A[j]
  swap A[i + 1], A[r];  return i + 1</code></pre><p><b>Invariant:</b> A[p..i] ≤ x, A[i+1..j−1] &gt; x, and A[r] = x. At the end the pivot is swapped between the two regions, so A[p..q−1] ≤ A[q] &lt; A[q+1..r]. Θ(n). Trace: ⟨2, 8, 7, 1, 3, 5, 6, 4⟩ becomes ⟨2, 1, 3, 4, 7, 5, 6, 8⟩ and returns q = 4.</p>`,
   kid: 'Pick a leader. Everyone shorter goes to the left group, everyone taller to the right group, and the leader stands in the middle.',
   check: ['After PARTITION returns q, which is guaranteed?', ['A[p..q−1] ≤ A[q] < A[q+1..r]', 'A is sorted', 'A[q] is the median', 'q = (p + r)/2'], 'The pivot lands in its final sorted position.']},
  {h: 'Worst, best and expected running time', clips: [['qS9oMz4_kTU', 'Randomization Strategy', 'Random Analysis']],
   body: `<p>Worst case: every split is 0 : n − 1 (sorted input with the last element as pivot), T(n) = T(n − 1) + Θ(n) = <b>Θ(n²)</b>. Any constant split, even 99 : 1, has depth Θ(lg n), so Θ(n lg n).</p><p><b>Expected time with a random pivot:</b> the running time is O(n + X), X = number of comparisons. The i-th and j-th smallest are compared iff one of them is the first pivot chosen from z<sub>i</sub>..z<sub>j</sub>, with probability 2/(j − i + 1), so E[X] = Σ 2/(j − i + 1) = O(n lg n) on <b>every</b> input. With many equal keys, use the <b>three-way partition</b> (PS5) so all-equal input is Θ(n).</p>`,
   kid: 'Always picking the shortest kid as leader makes one empty group every time, which is slow. Picking the leader at random makes that super unlikely.',
   check: ['In randomized quicksort, z_i and z_j are compared with probability…', ['2/(j − i + 1)', '1/n', '1/2', '1/(j − i)'], 'One of them must be the first pivot chosen from z_i..z_j.']}
 ]},
{id: 'hash', topics: ['t06'], title: 'Hash Tables', notes: 'Topic 06', reading: 'CLRS 4e 11.1–11.4',
 extra: [['JZHBa-rLrBA', 'Hashing', 'Load Factor'], ['s7QSM_hlS1U', 'Universal Hashing', 'Theorem']],
 lessons: [
  {h: 'Chaining and its analysis', clips: [['NMm1BKomO_Y', 'Hash functions and collisions', 'Chaining for collisions'], ['ei7T9Y97u0M', 'Analysis of Chaining', 'Final Answer']], viz: 'hash',
   body: `<p>Slot j holds a linked list of the keys with h(k) = j. INSERT is Θ(1) (prepend) and DELETE is Θ(1) with doubly linked chains. With <b>load factor α = n/m</b> and independent uniform hashing, both unsuccessful and successful searches take <b>Θ(1 + α)</b> expected time (Thms 11.1, 11.2), so with m = Θ(n) every operation is O(1) on average. The worst case is Θ(n), when every key lands in one slot.</p>`,
   kid: 'A hash table is a wall of mailboxes. A rule tells you which box each letter goes in, and if two letters land in one box, that box keeps a little list.',
   check: ['With chaining and uniform hashing, expected search time is…', ['Θ(1 + α)', 'Θ(α²)', 'Θ(lg n)', 'Θ(n)'], 'Hash in O(1), then scan a chain of expected length α.']},
  {h: 'Hash functions and universal hashing', clips: [['jW4wCfz3DwE']],
   body: `<ul><li><b>Division:</b> h(k) = k mod m, with m a prime not near a power of 2 (with m = 2ᵖ only the low bits matter).</li><li><b>Multiplication:</b> h(k) = ⌊m (kA mod 1)⌋, A ≈ 0.618; m can be a power of 2.</li><li><b>Universal hashing:</b> pick h at random from a family where any two keys collide with probability ≤ 1/m, e.g. ((ak + b) mod p) mod m. No adversary can force bad behavior.</li></ul>`,
   kid: 'A good rule spreads the letters evenly across the mailboxes. Picking the rule at random means nobody can plan to jam one box.',
   check: ['For the division method h(k) = k mod m, a good m is…', ['a prime not too close to a power of 2', 'a power of 2', 'a power of 10', 'any even number'], 'Powers of 2 only look at the low-order bits.']},
  {h: 'Open addressing, probing and tombstones', clips: [['SGGP_HJNUts', 'Open Addressing', 'Results of analysis']],
   body: `<p>All keys live in the table (α ≤ 1). The probe sequence must hit every slot: linear (h′(k) + i) mod m has <b>primary clustering</b>; quadratic has secondary clustering; <b>double hashing</b> (h₁(k) + i·h₂(k)) mod m is closest to uniform if h₂(k) is coprime to m. Expected probes: unsuccessful ≤ 1/(1 − α), successful ≤ (1/α) ln(1/(1 − α)).</p><p><b>Deletion (Exercise 9):</b> write DELETED, not NIL. Searches skip DELETED and stop only at NIL; inserts may reuse a DELETED slot. Writing NIL breaks the probe chain for keys stored further along.</p>`,
   kid: 'If a mailbox is full, try the next one, and the next. When you remove a letter, leave a "moved out" sign so people searching know to keep looking.',
   check: ['Why must open-addressing DELETE write DELETED instead of NIL?', ['A NIL would stop later searches before reaching keys further along the probe sequence', 'NIL wastes memory', 'DELETED is faster to write', 'Chaining requires it'], 'Search stops at the first NIL.']}
 ]}
];

const LEARN_MT3 = [
{id: 'select', topics: ['t10a'], title: 'Selection & Order Statistics', notes: 'Topic 10', reading: 'CLRS 4e Ch 9',
 extra: [['mR_RUjsJnV8', 'Medians', 'Random Pivots']],
 lessons: [
  {h: 'Minimum, maximum and the selection problem',
   body: `<p>The i-th <b>order statistic</b> is the i-th smallest element; the median is at ⌊(n + 1)/2⌋. Finding the minimum takes exactly <b>n − 1</b> comparisons, which is optimal, because every non-minimum must lose once. Finding <b>both</b> min and max takes 3⌊n/2⌋: compare elements in pairs, then the smaller with the min and the larger with the max. The <b>selection problem</b> asks for the i-th smallest without sorting (sorting costs Θ(n lg n)).</p>`,
   kid: 'To find the shortest kid you only need everyone except the winner to lose one height contest.',
   check: ['Minimum comparisons needed to find the minimum of n elements:', ['n − 1', 'n', 'n/2', 'lg n'], 'Every non-minimum element must lose at least once.']},
  {h: 'RANDOMIZED-SELECT', viz: 'rselect',
   body: `<pre><code>RANDOMIZED-SELECT(A, p, r, i)
  if p == r: return A[p]
  q = RANDOMIZED-PARTITION(A, p, r);  k = q − p + 1
  if i == k: return A[q]
  if i < k: return RANDOMIZED-SELECT(A, p, q − 1, i)
  return RANDOMIZED-SELECT(A, q + 1, r, i − k)</code></pre><p>Like quicksort, but it recurses into <b>one</b> side, adjusting the rank to i − k on the right. A pivot lands in the middle half with probability ≥ ½ and then at most 3n/4 elements remain, so the expected work is a geometric series: <b>Θ(n) expected</b>. Worst case Θ(n²).</p>`,
   kid: 'Pick a random kid, split into shorter and taller, and only keep looking in the group that must contain the one you want.',
   check: ['When RANDOMIZED-SELECT recurses into the right side, the new rank is…', ['i − k', 'i', 'k − i', 'i + k'], 'The k elements up to and including the pivot are discarded.']},
  {h: 'SELECT: worst-case linear (median of medians)',
   body: `<ol><li>Split into groups of 5 and find each group's median.</li><li>Recursively SELECT the median x of those ⌈n/5⌉ medians.</li><li>Partition around x: at least 3n/10 − 6 elements fall on each side.</li><li>Recurse on the side containing rank i (≤ 7n/10 + 6 elements).</li></ol><p>T(n) ≤ T(n/5) + T(7n/10 + 6) + O(n) = <b>Θ(n)</b>, because 1/5 + 7/10 &lt; 1 (substitution works for n ≥ 140 with c ≥ 20a). Groups of 3 fail (Θ(n lg n)); groups of 7 work. Uses (Exercise 10, PS6): the median minimizes Σ abs(yᵢ − p) for the oil pipeline; a SELECT median pivot makes quicksort Θ(n lg n) worst case; the k smallest in sorted order cost Θ(n + k lg k).</p>`,
   kid: 'Make teams of 5, find each team\'s middle kid, then the middle of those middles. That leader is never too short or too tall.',
   check: ['Why does SELECT use groups of 5 rather than 3?', ['So the recursive sizes n/5 + 7n/10 sum to less than n', 'Because 5 is prime', 'To make it stable', 'Groups of 3 are slower to sort'], 'With 3, the fractions sum to 1 and the bound becomes n lg n.']}
 ]},
{id: 'linsort', topics: ['t10b'], title: 'Lower Bounds & Linear-Time Sorts', notes: 'Topic 10', reading: 'CLRS 4e Ch 8',
 lessons: [
  {h: 'The Ω(n lg n) decision-tree lower bound', clips: [['gZmEYyqHefk']],
   body: `<p>Any comparison sort is a binary <b>decision tree</b>: internal nodes are comparisons, leaves are output permutations, and the height is the worst-case number of comparisons. Correctness needs at least n! leaves, and a tree of height h has ≤ 2ʰ leaves, so h ≥ lg(n!) ≥ (n/2) lg(n/2) = <b>Ω(n lg n)</b> (Thm 8.1). Merge sort and heapsort are asymptotically optimal (Cor 8.2). The same counting gives Ω(n lg(n/k)) for k-sorted arrays (PS7).</p>`,
   kid: 'Each yes/no question splits the possible orders in two. With n! possible orders, you need about n lg n questions.',
   check: ['A decision tree that sorts n elements must have at least…', ['n! leaves', '2ⁿ leaves', 'n² leaves', 'n leaves'], 'One leaf per possible output permutation.']},
  {h: 'Counting sort', viz: 'csort',
   body: `<p>For integer keys in 0..k: count each key in C, turn C into prefix sums (C[v] = number of keys ≤ v), then place elements from <b>j = n down to 1</b> at B[C[A[j]]] and decrement. The backwards loop makes it <b>stable</b>. Θ(n + k) time and space, not in place; linear when k = O(n). Trace: ⟨2, 5, 3, 0, 2, 3, 0, 3⟩ gives prefix sums [2, 2, 4, 7, 7, 8] and output ⟨0, 0, 2, 2, 3, 3, 3, 5⟩.</p>`,
   kid: 'If every number is small, just count them: "three 2s, one 5", then write them out in order.',
   check: ['Why does counting sort fill the output from j = n down to 1?', ['To make it stable', 'To make it in place', 'To handle negative keys', 'To make it Θ(n)'], 'The last copy of each key gets the highest free slot.']},
  {h: 'Radix sort and bucket sort', viz: 'radix',
   body: `<p><b>Radix sort:</b> sort by each digit, <b>least significant first</b>, with a <b>stable</b> sort. Θ(d(n + k)) (Lemma 8.3); with b-bit keys and r-bit digits, Θ((b/r)(n + 2ʳ)) (Lemma 8.4). <b>Invariant (Exercise 11):</b> after pass i, the keys are sorted by their low i digits; when two keys tie on digit i, stability keeps the earlier correct order. Integers 0..n³ − 1 sort in Θ(n) in base n.</p><p><b>Bucket sort</b> (keys uniform on [0, 1)): n buckets, insertion-sort each, concatenate. E[nᵢ²] = 2 − 1/n gives expected Θ(n); worst case Θ(n²). <b>Stabilize any sort</b> by sorting (key, index) pairs.</p>`,
   kid: 'Radix sort is sorting mail by the last digit of the zip code, then the next digit, keeping ties in order each time.',
   check: ['Radix sort requires the per-digit sort to be…', ['stable', 'in place', 'comparison based', 'randomized'], 'Stability preserves the order from the earlier digits.']}
 ]},
{id: 'backtrack', topics: ['t12s'], title: 'Backtracking & Recursion', notes: 'Topic 12A', reading: 'Erickson Ch 1–2',
 lessons: [
  {h: 'The backtracking recipe and n-queens', viz: 'queens',
   body: `<p>Build a solution one decision at a time; try every option still legal; recurse; if it fails, <b>undo</b> the choice and try the next; <b>prune</b> branches that can't succeed. The recursion explores a tree of partial solutions, so the cost is (#nodes) × (work per node), usually exponential. Prove correctness by induction on the decisions left.</p><p><b>n-queens:</b> place one queen per row; column j is legal if no earlier queen has Q[i] = j or abs(Q[i] − j) = r − i (same diagonal).</p>`,
   kid: 'Walk a corn maze: at a dead end, walk back to the last fork and try the other path.',
   check: ['What is "pruning" in backtracking?', ['Abandoning a branch as soon as it cannot lead to a valid solution', 'Deleting tree nodes', 'Sorting the input', 'Removing the base case'], 'It shrinks the explored recursion tree.']},
  {h: 'Subset sum, CUT-STICK and when to switch to DP',
   body: `<p><b>Subset sum:</b> SS(i, T) = TRUE if T = 0; FALSE if T &lt; 0 or i &gt; n; otherwise SS(i + 1, T) or SS(i + 1, T − X[i]). T(n) = 2T(n − 1) + O(1) = O(2ⁿ). The distinct states (i, T) give a DP in O(nT), which is pseudo-polynomial.</p><p><b>CUT-STICK (Exercise 12)</b> counts the compositions of n: 2^(n−1), in Θ(2ⁿ) time because the same CUT-STICK(j) is recomputed through every prefix. <b>PS7:</b> almost-palindrome is Θ(n) with one branch at the first mismatch; the treasure hunt marks cells, tries four moves, and un-marks on failure. When the recursion tree repeats the same arguments, memoize: that is dynamic programming.</p>`,
   kid: 'For each item you decide "take it or skip it". That is 2 choices, n times, so 2ⁿ possibilities unless you remember answers you already worked out.',
   check: ['The recurrence T(n) = 2T(n − 1) + O(1) solves to…', ['Θ(2ⁿ)', 'Θ(n²)', 'Θ(n lg n)', 'Θ(n)'], 'The work doubles at each of n levels.']}
 ]},
{id: 'dp', topics: ['t12a'], title: 'Dynamic Programming', notes: 'Topic 12A', reading: 'CLRS 4e 14.1–14.3 · Erickson Ch 3',
 extra: [['V5hZoJ6uK-s', 'Dynamic Programming', 'Memoization']],
 lessons: [
  {h: 'Rod cutting: from 2ⁿ recursion to Θ(n²)', clips: [['RYPsOJmhwgE', 'The rod cutting problem', 'Memoization and bottom-up']], viz: 'rod',
   body: `<p>rₙ = max over 1 ≤ i ≤ n of (pᵢ + rₙ₋ᵢ), with r₀ = 0. Plain recursion makes 1 + Σ T(j) = 2ⁿ calls because it recomputes the same lengths. <b>Memoized</b> (top-down with a table) or <b>bottom-up</b> (fill r[1..n] in increasing j), each length is solved once with j choices: <b>Θ(n²)</b>. Keep s[j], the size of the first piece, to print the cuts. For CLRS prices 1, 5, 8, 9, 10, 17, 17, 20, 24, 30: r = 1, 5, 8, 10, 13, 17, 18, 22, 25, 30.</p>`,
   kid: 'Don\'t solve the same little puzzle twice: write each answer in a chart and look it up next time.',
   check: ['Bottom-up rod cutting for a rod of length n runs in…', ['Θ(n²)', 'Θ(2ⁿ)', 'Θ(n)', 'Θ(n³)'], 'n subproblems × up to n choices each.']},
  {h: 'The four steps and the elements of DP', clips: [['0tQ3ah0Fddw', 'DP conditions', 'Problem solving steps']],
   body: `<ol><li>Characterize the structure of an optimal solution.</li><li>Define its value recursively.</li><li>Compute the values bottom-up (or memoized).</li><li>Construct a solution from the stored choices.</li></ol><p>DP needs <b>optimal substructure</b> (proved by cut-and-paste) and <b>overlapping subproblems</b>. Subproblems must be independent: unweighted <b>shortest</b> simple path has optimal substructure, but <b>longest</b> simple path does not. Running time ≈ (#subproblems) × (choices each). Greedy can fail where DP succeeds: prices 1, 20, 33, 36 give greedy 34 but DP 40.</p>`,
   kid: 'A problem is DP-friendly when the best answer is built from best answers to smaller pieces, and those pieces repeat a lot.',
   check: ['Which problem does NOT have optimal substructure?', ['Longest simple path in a general graph', 'Shortest path', 'LCS', 'Rod cutting'], 'Combining two longest subpaths can repeat vertices.']},
  {h: 'Matrix chain and the PS8 / Exercise 13 DPs', clips: [['QzgqDJIJtNY', 'Matrix Chain Multiplication']],
   body: `<p><b>Matrix chain:</b> m[i, j] = min over i ≤ k &lt; j of (m[i, k] + m[k+1, j] + p<sub>i−1</sub>p<sub>k</sub>p<sub>j</sub>), filled by increasing chain length: Θ(n³) time, Θ(n²) space.</p><ul><li><b>Coin change (PS8):</b> C[v] = 1 + min C[v − c[i]], Θ(nk).</li><li><b>Checkerboard (PS8):</b> D[r, c] = best of 3 predecessors + payment, Θ(n²).</li><li><b>Party planning (Exercise 13):</b> in[v] = fun(v) + Σ out[child]; out[v] = Σ max(in, out) over children; post-order, Θ(n).</li><li><b>0-1 knapsack:</b> K[i, w] = max(K[i−1, w], K[i−1, w − wᵢ] + vᵢ), Θ(nW).</li></ul>`,
   kid: 'The same chart trick works for coins, game boards and party guest lists: decide what one box of the chart means, then fill it from smaller boxes.',
   check: ['Matrix-chain multiplication with DP runs in…', ['Θ(n³)', 'Θ(n²)', 'Θ(2ⁿ)', 'Θ(n lg n)'], 'Θ(n²) subproblems × O(n) split points.']}
 ]},
{id: 'lcs', topics: ['t12b'], title: 'LCS & Optimal Binary Search Trees', notes: 'Topic 12B', reading: 'CLRS 4e 14.4–14.5',
 lessons: [
  {h: 'LCS: optimal substructure and the recurrence', clips: [['0tQ3ah0Fddw', 'LCS problem definition', 'Recursive formula']],
   body: `<p>A <b>subsequence</b> keeps order but may skip characters (a substring must be contiguous). <b>Theorem 14.1:</b> if x<sub>m</sub> = y<sub>n</sub>, an LCS ends with that character plus an LCS of the shorter prefixes; otherwise it is an LCS of X<sub>m−1</sub> and Y, or of X and Y<sub>n−1</sub>.</p><p class="math" style="text-align:center">c[i, j] = c[i−1, j−1] + 1 if xᵢ = yⱼ, else max(c[i−1, j], c[i, j−1])</p><p>with c[i, 0] = c[0, j] = 0. Brute force is Θ(n 2ᵐ).</p>`,
   kid: 'Find the longest list of letters that appears in both words in the same order. If the last letters match, keep them; otherwise drop one last letter and take the better result.',
   check: ['If x_i = y_j, then c[i, j] equals…', ['c[i−1, j−1] + 1', 'max(c[i−1, j], c[i, j−1])', 'c[i−1, j] + 1', '0'], 'The matching character extends the LCS of the shorter prefixes.']},
  {h: 'Filling the table and printing the LCS', clips: [['dFObo5BeJ0k', 'Dynamic programming solution', 'Review and takeaways']], viz: 'lcs',
   body: `<p>Fill c row by row in <b>Θ(mn)</b>, storing arrows ↖ ↑ ← in b. PRINT-LCS walks back from (m, n) in Θ(m + n): diagonal on a match, otherwise toward the neighbor equal to c[i, j]. The length alone needs only two rows, Θ(min(m, n)) space. Example: ABCBDAB and BDCABA have LCS length 4 (BCBA). Related: longest palindromic subsequence (Exercise 13) p[i, j] = 2 + p[i+1, j−1] on equal ends, else max(p[i+1, j], p[i, j−1]), filled by increasing length.</p>`,
   kid: 'Make a grid with one word on top and one down the side. A match means "diagonal plus one"; otherwise copy the bigger neighbor. The bottom-right box is the answer.',
   check: ['The LCS-LENGTH algorithm on strings of length m and n runs in…', ['Θ(mn)', 'Θ(m + n)', 'Θ(2ᵐ)', 'Θ(mn lg n)'], 'Each of the (m+1)(n+1) cells takes O(1).']},
  {h: 'Optimal binary search trees', clips: [['QzgqDJIJtNY', 'Optimal Binary Search Trees', 'Summary']],
   body: `<p>Given search probabilities pᵢ for keys and qᵢ for gaps, minimize the expected search cost. Any subtree of an optimal BST is optimal for its key range. With w(i, j) = Σ p + Σ q over the range, e[i, i−1] = q<sub>i−1</sub> and</p><p class="math" style="text-align:center">e[i, j] = min over i ≤ r ≤ j of (e[i, r−1] + e[r+1, j] + w(i, j))</p><p>Making r the root pushes every node one level deeper, adding w(i, j). Θ(n³) (Knuth's trick gives Θ(n²)). Greedy (most probable key at the root) is not always optimal.</p>`,
   kid: 'Put the words people look up most often near the top of the tree, but use the chart to check, because "most popular on top" isn\'t always best.',
   check: ['The optimal-BST DP algorithm runs in…', ['Θ(n³)', 'Θ(n²)', 'Θ(n lg n)', 'Θ(2ⁿ)'], 'Θ(n²) subproblems × O(n) root choices.']}
 ]}
];

// ======================= PROBLEM-SET PSEUDOCODE PRACTICE =======================
COMPOUNDS.push('build max heap','local max','binary search','largest k','extract max','max heap insert','rb insert','inorder tree walk','right rotate','right chain',
  'three way partition','three way quicksort','hash insert','k smallest','partition around','kth largest','select by median','sort k sorted',
  'is palindrome','almost palindrome','path exists','make change','max dollars','max of row','greedy change','is bipartite','number maze',
  'equal weight mst','dfs visit','min bridges','closest island','count children','binary tree traversal','is empty');
const PS_BASE = 'https://algoparc.ics.hawaii.edu/~nodari/teaching/f26/Problem-Sets/';
const fnLoop = (P, n) => { const f = P.fn(n); return f ? (f.maxLoop || 0) : 0; };
const nCalls = (b, n) => (b.match(new RegExp('\\b' + n + '\\s*\\(', 'g')) || []).length;
const PSETS = [
 {id:'ps01', num:1, covers:'Topics 1, 3 & 4', probs:[
  {id:'ps1-stack', topic:'t01', from:'Problem 1(b, c)', title:'Linked-list stack with O(1) CATENATE',
   prompt:'Implement a stack with a <b>singly linked list</b>. Write <code>IS-EMPTY(S)</code>, <code>PUSH(S, o)</code>, <code>POP(S)</code>, <code>TOP(S)</code> and <code>CATENATE(S, T)</code>, which puts all of T underneath S (S keeps its top elements). Every operation, including CATENATE, must run in <b>O(1)</b> time. Keep a size field.',
   starter:'IS-EMPTY(S)\n    \n\nPUSH(S, o)\n    \n\nPOP(S)\n    \n\nTOP(S)\n    \n\nCATENATE(S, T)\n    \n', define:['isempty','push','pop','top','catenate'], call:['isempty'], maxLoop:0,
   correctness:[
    {label:'PUSH links the new node above the old top', w:2, test:(t,P)=>/\.next\s*=\s*\w+\.(head|top)\b/.test(P.body('push')), hint:'x.next = S.head'},
    {label:'PUSH makes the new node the top', w:1, test:(t,P)=>/\w+\.(head|top)\s*=\s*(?!=)\w+/.test(P.body('push')), hint:'S.head = x'},
    {label:'POP moves the top to the next node', w:2, test:(t,P)=>/\.(head|top)\s*=\s*\w+(\.(head|top))?\.next\b/.test(P.body('pop')), hint:'S.head = S.head.next'},
    {label:'POP handles an empty stack', w:1, test:(t,P)=>/isempty|==\s*(nil|null|none)|\.(n|size|count)\s*==\s*0/.test(P.body('pop')), hint:'if IS-EMPTY(S) then error "underflow"'},
    {label:'Size is maintained', w:1, test:t=>/(\.n|size|count)\s*=\s*[^\n]*[+-]\s*1|(\.n|size|count)\s*(\+=|-=)\s*1/.test(t), hint:'S.n = S.n + 1 in PUSH, − 1 in POP'},
    {label:'CATENATE links the bottom of S to the top of T', w:3, test:(t,P)=>/\.(tail|bottom|last)\.next\s*=\s*\w+\.(head|top)\b/.test(P.body('catenate')), hint:'S.tail.next = T.head'},
    {label:'CATENATE updates the bottom pointer', w:1, test:(t,P)=>/\.(tail|bottom|last)\s*=\s*\w+\.(tail|bottom|last)\b/.test(P.body('catenate')), hint:'S.tail = T.tail'},
    {label:'CATENATE adds the sizes', w:1, test:(t,P)=>/(\.n|size|count)\s*(=\s*[^\n]*\+|\+=)\s*\w+\.(n|size|count)\b/.test(P.body('catenate')), hint:'S.n = S.n + T.n'}],
   efficiency:[
    {label:'Keeps a tail (bottom) pointer so CATENATE never walks the list', w:5, test:t=>/tail|bottom|last/.test(t), hint:'Store S.tail; update it in PUSH (first element) and POP (last element).'},
    {label:'CATENATE has no loop: O(1)', w:5, test:(t,P)=>P.hasFn('catenate') && !/\b(for|while|repeat)\b/.test(P.body('catenate')), hint:'Splice the lists with a couple of pointer assignments.'}],
   penalties:[{label:'PUSH/POP loops over the list', p:3, test:(t,P)=>/\b(for|while)\b/.test(P.body('push')) || /\b(for|while)\b/.test(P.body('pop')), hint:'Work only at the head of the list.'}],
   model:`// S.head = top node, S.tail = bottom node, S.n = size
IS-EMPTY(S)
    return S.n == 0

PUSH(S, o)
    x = new node with key o
    x.next = S.head
    S.head = x
    if S.tail == NIL
        S.tail = x
    S.n = S.n + 1

POP(S)
    if IS-EMPTY(S)
        error "underflow"
    x = S.head
    S.head = x.next
    if S.head == NIL
        S.tail = NIL
    S.n = S.n - 1
    return x.key

TOP(S)
    if IS-EMPTY(S)
        error "underflow"
    return S.head.key

CATENATE(S, T)          // O(1): splice T underneath S
    if IS-EMPTY(T)
        return
    if IS-EMPTY(S)
        S.head = T.head
    else
        S.tail.next = T.head
    S.tail = T.tail
    S.n = S.n + T.n`},
  {id:'ps1-traverse', topic:'t01', from:'Problem 5(a)', title:'Iterative binary-tree traversal with a stack',
   prompt:'Write an <b>iterative</b> Θ(n) procedure <code>BINARY-TREE-TRAVERSAL(T)</code> that prints the key of every node of a linked binary tree (fields <code>root</code>, <code>left</code>, <code>right</code>, <code>key</code>) using a <b>stack</b> instead of recursion.',
   starter:'BINARY-TREE-TRAVERSAL(T)\n    \n', define:['binarytreetraversal'], call:['push','pop'], maxLoop:1,
   correctness:[
    {label:'Starts by pushing the root', w:2, test:t=>/push\s*\([^)]*root/.test(t), hint:'if T.root ≠ NIL then PUSH(S, T.root)'},
    {label:'Loops while the stack is not empty', w:2, test:t=>/\bwhile\b/.test(t), hint:'while S is not empty'},
    {label:'Pops a node and prints its key', w:2, test:t=>/pop\s*\(/.test(t) && /print|output|visit/.test(t), hint:'x = POP(S); print x.key'},
    {label:'Pushes both children', w:2, test:t=>/push\s*\([^)]*\.left/.test(t) && /push\s*\([^)]*\.right/.test(t), hint:'PUSH(S, x.right); PUSH(S, x.left)'},
    {label:'Skips NIL children', w:1, test:t=>/!=\s*(nil|null|none)|\bis\s+not\s+(nil|null|none)/.test(t), hint:'if x.left ≠ NIL …'}],
   efficiency:[
    {label:'No recursion (stack does the work)', w:5, test:(t,P)=>!P.calls('binarytreetraversal'), hint:'The point of the stack is to replace recursion.'},
    {label:'Each node is pushed and popped once: Θ(n)', w:5, test:(t,P)=>P.maxLoop <= 1, hint:'One while loop; no nested scans.'}],
   model:`BINARY-TREE-TRAVERSAL(T)      // Θ(n): each node pushed and popped once
    S = empty stack
    if T.root != NIL
        PUSH(S, T.root)
    while S is not empty
        x = POP(S)
        print x.key
        if x.right != NIL
            PUSH(S, x.right)
        if x.left != NIL
            PUSH(S, x.left)`},
  {id:'ps1-children', topic:'t01', from:'Problem 6', title:'Count children (left-child, right-sibling)',
   prompt:'A k-ary tree uses the left-child, right-sibling representation (fields <code>leftChild</code>, <code>rightSibling</code>). Write an iterative <code>COUNT-CHILDREN(node)</code> that returns how many children the node has.',
   starter:'COUNT-CHILDREN(node)\n    \n', define:['countchildren'], call:[], maxLoop:1,
   correctness:[
    {label:'Starts at the left child', w:2, test:t=>/=\s*\w+\.(leftchild|left_child|left)\b/.test(t), hint:'c = node.leftChild'},
    {label:'Loops until NIL', w:2, test:t=>/while[^\n]*(!=\s*(nil|null|none)|not\s+(nil|null|none))|while\s+\w+\s*$/m.test(t), hint:'while c ≠ NIL'},
    {label:'Moves along right siblings', w:3, test:t=>/\w+\s*=\s*\w+\.(rightsibling|right_sibling|sibling|right)\b/.test(t), hint:'c = c.rightSibling'},
    {label:'Counts each child', w:2, test:t=>/(\w+)\s*=\s*\1\s*\+\s*1|\+=\s*1|\+\+/.test(t), hint:'count = count + 1'},
    {label:'Returns the count', w:1, test:t=>/\breturn\b/.test(t), hint:'return count'}],
   efficiency:[
    {label:'One pass over the sibling list: Θ(number of children)', w:5, test:(t,P)=>P.maxLoop <= 1, hint:'No nested loops.'},
    {label:'Does not descend into grandchildren', w:5, test:t=>(t.match(/leftchild|left_child/g) || []).length <= 2, hint:'Only node.leftChild is read; then follow rightSibling.'}],
   model:`COUNT-CHILDREN(node)        // Θ(number of children)
    count = 0
    c = node.leftChild           // first child
    while c != NIL
        count = count + 1
        c = c.rightSibling       // next child
    return count`}]},
 {id:'ps02', num:2, covers:'Topics 2 & 7', probs:[
  {id:'ps2-localmax', topic:'t07', from:'Problem 7(a)', title:'Local maximum in Θ(lg n)',
   prompt:'An element A[i] is a <b>local maximum</b> if it is ≥ each of its neighbors (only one neighbor at the ends). Write a <b>recursive</b> <code>LOCAL-MAX(A, lo, hi)</code> that returns the index of some local maximum as fast as possible.',
   starter:'LOCAL-MAX(A, lo, hi)\n    \n', define:['localmax'], call:['localmax'], maxLoop:0,
   correctness:[
    {label:'Computes the midpoint', w:2, test:t=>/mid\s*=\s*[^\n]*(lo|low|left|l|p)\s*\+\s*(hi|high|right|r|q)/.test(t), hint:'mid = ⌊(lo + hi) / 2⌋'},
    {label:'Compares with the left neighbor', w:2, test:t=>/a\s*\[\s*mid\s*-\s*1\s*\]/.test(t), hint:'A[mid − 1] > A[mid]?'},
    {label:'Compares with the right neighbor', w:2, test:t=>/a\s*\[\s*mid\s*\+\s*1\s*\]/.test(t), hint:'A[mid + 1] > A[mid]?'},
    {label:'Recurses toward a larger neighbor', w:2, test:(t,P)=>P.calls('localmax'), hint:'A bigger neighbor means a peak exists on that side.'},
    {label:'Returns mid when it beats both neighbors', w:2, test:t=>/return\s+mid\b/.test(t), hint:'else return mid'},
    {label:'Handles the array ends', w:1, test:t=>/mid\s*>\s*(lo|low|left|1|p)|mid\s*<\s*(hi|high|right|n|r)|mid\s*==\s*(1|n|lo|hi|low|high)/.test(t), hint:'Only compare with neighbors that exist.'}],
   efficiency:[
    {label:'No linear scan', w:5, test:t=>!/\b(for|while)\b/.test(t), hint:'Checking every element is Θ(n).'},
    {label:'Halves the range each call: T(n) = T(n/2) + O(1) = Θ(lg n)', w:5, test:(t,P)=>P.calls('localmax') && /mid\s*-\s*1|mid\s*\+\s*1/.test(t), hint:'Recurse on A[lo..mid − 1] or A[mid + 1..hi].'}],
   model:`LOCAL-MAX(A, lo, hi)          // call LOCAL-MAX(A, 1, n); Θ(lg n)
    mid = ⌊(lo + hi) / 2⌋
    if mid > lo and A[mid - 1] > A[mid]
        return LOCAL-MAX(A, lo, mid - 1)   // the larger left side must contain a peak
    else if mid < hi and A[mid + 1] > A[mid]
        return LOCAL-MAX(A, mid + 1, hi)
    else
        return mid                         // A[mid] ≥ its neighbors`},
  {id:'ps2-bsearch', topic:'t02', from:'Problem 6', title:'Binary search with its loop invariant',
   prompt:'Write <code>BINARY-SEARCH(A, n, x)</code> for a sorted array A[1..n] that returns the index of x or NOT-FOUND. Add a comment stating the <b>loop invariant</b> you would prove.',
   starter:'BINARY-SEARCH(A, n, x)\n    \n', define:['binarysearch'], call:[], maxLoop:1,
   correctness:[
    {label:'Initializes the search range', w:1, test:t=>/(left|lo|low|l)\s*=\s*(1|0)\b/.test(t), hint:'left = 1, right = n'},
    {label:'Loops while the range is non-empty', w:2, test:t=>/while[^\n]*(<=|>=)/.test(t), hint:'while left ≤ right'},
    {label:'Probes the middle', w:1, test:t=>/mid\s*=/.test(t), hint:'mid = ⌊(left + right) / 2⌋'},
    {label:'Returns mid on a match', w:2, test:t=>/return\s+mid\b/.test(t), hint:'if A[mid] == x return mid'},
    {label:'Discards the right half', w:2, test:t=>/=\s*mid\s*-\s*1/.test(t), hint:'right = mid − 1'},
    {label:'Discards the left half', w:2, test:t=>/=\s*mid\s*\+\s*1/.test(t), hint:'left = mid + 1'},
    {label:'Reports NOT-FOUND', w:1, test:t=>/return[^\n]*(not|nil|null|none|-1|fail|false)/.test(t), hint:'return NOT-FOUND after the loop'},
    {label:'States the loop invariant', w:1, test:t=>/invariant/.test(t), hint:'// invariant: if x is in A, then x is in A[left..right]'}],
   efficiency:[
    {label:'No linear scan', w:5, test:t=>!/\bfor\b/.test(t), hint:'Binary search never checks every element.'},
    {label:'Range shrinks every iteration (Θ(lg n), no infinite loop)', w:5, test:t=>/=\s*mid\s*-\s*1/.test(t) && /=\s*mid\s*\+\s*1/.test(t), hint:'Exclude mid itself: mid − 1 and mid + 1.'}],
   model:`BINARY-SEARCH(A, n, x)        // Θ(lg n)
    left = 1
    right = n
    // invariant: if x is in A, then x is in A[left..right]
    while left <= right
        mid = ⌊(left + right) / 2⌋
        if A[mid] == x
            return mid
        else if x < A[mid]
            right = mid - 1
        else
            left = mid + 1
    return NOT-FOUND`}]},
 {id:'ps03', num:3, covers:'Topics 8 & 9', probs:[
  {id:'ps3-topk', topic:'t09', from:'Problem 1', title:'Largest k elements with a heap',
   prompt:'Write <code>LARGEST-K(A, n, k)</code> that returns the k largest elements of A[1..n] using a binary heap, faster than sorting (k = o(n)). You may call <code>BUILD-MAX-HEAP</code> and <code>EXTRACT-MAX</code>.',
   starter:'LARGEST-K(A, n, k)\n    \n', define:['largestk'], call:['buildmaxheap','extractmax'], maxLoop:1,
   correctness:[
    {label:'Builds a max-heap', w:3, test:t=>/buildmaxheap\s*\(/.test(t), hint:'BUILD-MAX-HEAP(A, n)'},
    {label:'Loops k times', w:2, test:t=>/(for|while)[^\n]*\bk\b/.test(t), hint:'for i = 1 to k'},
    {label:'Extracts the maximum each time', w:2, test:t=>/extractmax\s*\(/.test(t), hint:'B[i] = EXTRACT-MAX(A)'},
    {label:'Returns the k elements', w:1, test:t=>/\breturn\b/.test(t), hint:'return B'}],
   efficiency:[
    {label:'Builds the heap bottom-up in O(n), not with n inserts', w:5, test:t=>/buildmaxheap/.test(t) && !/insert\s*\(/.test(t), hint:'n inserts cost Θ(n lg n) in the worst case.'},
    {label:'Never sorts the whole array: O(n + k lg n)', w:5, test:t=>!/sort\s*\(|heapsort|mergesort|quicksort/.test(t), hint:'Stop after k extractions.'}],
   penalties:[{label:'Extracts n times instead of k', p:3, test:t=>/for[^\n]*to\s*n\b[^\n]*\n[^\n]*extractmax/.test(t), hint:'Only k extractions are needed.'}],
   model:`LARGEST-K(A, n, k)          // O(n + k lg n)
    BUILD-MAX-HEAP(A, n)          // O(n)
    let B[1..k] be a new array
    for i = 1 to k
        B[i] = EXTRACT-MAX(A)     // O(lg n) each
    return B`},
  {id:'ps3-insert', topic:'t09', from:'Problem 2', title:'MAX-HEAP-INSERT and building by insertion',
   prompt:'Write <code>MAX-HEAP-INSERT(A, key)</code> (float the new key up) and a procedure <code>BUILD-BY-INSERTS(A, n)</code> that builds a heap by inserting A[2..n] one at a time. In a comment, give its worst-case running time.',
   starter:'MAX-HEAP-INSERT(A, key)\n    \n\nBUILD-BY-INSERTS(A, n)\n    \n', define:['maxheapinsert','build'], call:['maxheapinsert'], maxLoop:1,
   correctness:[
    {label:'Grows the heap by one', w:2, test:t=>/heap-?size\s*=\s*[^\n]*\+\s*1|heap-?size\s*(\+\+|\+=\s*1)/.test(t), hint:'A.heap-size = A.heap-size + 1'},
    {label:'Places the key in the new last slot', w:2, test:t=>/a\s*\[[^\]]*\]\s*=\s*key\b/.test(t), hint:'A[A.heap-size] = key'},
    {label:'Floats up while the parent is smaller', w:3, test:t=>/while[^\n]*(parent|\/\s*2)[^\n]*</.test(t) || /while[^\n]*<[^\n]*(parent|\/\s*2)/.test(t), hint:'while i > 1 and A[PARENT(i)] < A[i]'},
    {label:'Swaps with the parent', w:2, test:t=>/exchange|swap/.test(t), hint:'exchange A[i] with A[PARENT(i)]'},
    {label:'Moves i up to the parent', w:2, test:t=>/\bi\s*=\s*(parent\s*\(|⌊?\s*i\s*\/\s*2)/.test(t), hint:'i = PARENT(i)'},
    {label:'Build loop inserts the remaining elements', w:2, test:t=>/for[^\n]*\n[^\n]*maxheapinsert\s*\(/.test(t), hint:'for i = 2 to n: MAX-HEAP-INSERT(A, A[i])'}],
   efficiency:[
    {label:'Float-up follows one leaf-to-root path: O(lg n)', w:5, test:(t,P)=>{const f = P.fn('maxheapinsert'); return !!f && (f.maxLoop || 0) <= 1 && /while/.test(f.body);}, hint:'One while loop that moves i up.'},
    {label:'Stops as soon as the parent is larger', w:5, test:t=>/while[^\n]*\band\b|while[^\n]*&&/.test(t), hint:'Combine the bounds check with the parent comparison.'}],
   model:`PARENT(i)
    return ⌊i / 2⌋

MAX-HEAP-INSERT(A, key)        // O(lg n)
    A.heap-size = A.heap-size + 1
    i = A.heap-size
    A[i] = key
    while i > 1 and A[PARENT(i)] < A[i]      // float up
        exchange A[i] with A[PARENT(i)]
        i = PARENT(i)

BUILD-BY-INSERTS(A, n)         // Θ(n lg n) worst case (increasing input)
    A.heap-size = 1
    for i = 2 to n
        MAX-HEAP-INSERT(A, A[i])`}]},
 {id:'ps04', num:4, covers:'Topics 5A & 11', probs:[
  {id:'ps4-treesort', topic:'t11', from:'Problem 2', title:'Sorting with a red-black tree',
   prompt:'Write <code>TREE-SORT(A, n)</code> that sorts n comparable elements in <b>O(n lg n) worst case</b> using a red-black (or 2-3-4) tree, plus the tree walk that writes the keys back in order.',
   starter:'TREE-SORT(A, n)\n    \n\nINORDER-TREE-WALK(x)\n    \n', define:['treesort','inorder'], call:['rbinsert|insert','inordertreewalk|inorder'], maxLoop:1,
   correctness:[
    {label:'Inserts every element into the tree', w:3, test:t=>/for[^\n]*\n[^\n]*(rbinsert|insert)\s*\(/.test(t), hint:'for i = 1 to n: RB-INSERT(T, A[i])'},
    {label:'Uses an inorder walk to output keys', w:3, test:t=>/inorder/.test(t), hint:'An inorder walk visits keys in sorted order.'},
    {label:'Walk visits left, then the node, then right', w:2, test:(t,P)=>/\.left[\s\S]*\.key[\s\S]*\.right/.test(P.body('inorder')), hint:'WALK(x.left); output x.key; WALK(x.right)'},
    {label:'Walk stops at NIL', w:1, test:(t,P)=>/!=\s*(t\.nil|nil|null|none)|==\s*(t\.nil|nil|null|none)/.test(P.body('inorder')), hint:'if x ≠ T.nil'}],
   efficiency:[
    {label:'Uses a balanced tree, so each insert is O(lg n)', w:5, test:t=>/\brb|red|black|2-3-4|\b234\b|\(2,\s*4\)|balanced/.test(t), hint:'A plain BST can degrade to height n.'},
    {label:'Outputs with one Θ(n) walk, not n searches or deletes', w:5, test:t=>!/extract|delete|minimum\s*\(|successor\s*\(/.test(t), hint:'One inorder walk lists all keys in Θ(n).'}],
   model:`TREE-SORT(A, n)            // Θ(n lg n) worst case
    T = new empty red-black tree
    for i = 1 to n
        RB-INSERT(T, A[i])     // O(lg n): height ≤ 2 lg(n + 1)
    k = 1
    INORDER-TREE-WALK(T.root)  // writes the keys back into A in sorted order

INORDER-TREE-WALK(x)
    if x != T.nil
        INORDER-TREE-WALK(x.left)
        A[k] = x.key
        k = k + 1
        INORDER-TREE-WALK(x.right)`},
  {id:'ps4-chain', topic:'t11', from:'Problem 5(a)', title:'Right rotations into a right-going chain',
   prompt:'Write <code>RIGHT-ROTATE(T, y)</code> and <code>MAKE-RIGHT-CHAIN(T)</code>, which turns any n-node BST into a right-going chain using <b>at most n − 1 right rotations</b>.',
   starter:'RIGHT-ROTATE(T, y)\n    \n\nMAKE-RIGHT-CHAIN(T)\n    \n', define:['rightrotate','chain'], call:['rightrotate'], maxLoop:1,
   correctness:[
    {label:'Rotation lifts the left child', w:2, test:(t,P)=>/=\s*\w+\.left\b/.test(P.body('rightrotate')), hint:'x = y.left'},
    {label:'x’s right subtree becomes y’s left subtree', w:2, test:(t,P)=>/\.left\s*=\s*\w+\.right\b/.test(P.body('rightrotate')), hint:'y.left = x.right'},
    {label:'Fixes the parent link (or the root)', w:2, test:(t,P)=>/\.root\s*=/.test(P.body('rightrotate')) && /\.(p|parent)\s*=/.test(P.body('rightrotate')), hint:'x.p = y.p; if y was the root, T.root = x'},
    {label:'y becomes x’s right child', w:1, test:(t,P)=>/\.right\s*=\s*y\b/.test(P.body('rightrotate')), hint:'x.right = y'},
    {label:'Chain loop rotates while the node has a left child', w:2, test:(t,P)=>/\.left\s*!=\s*(nil|null|none|t\.nil)/.test(P.body('chain')) && /\bwhile\b/.test(P.body('chain')), hint:'if y.left ≠ NIL: RIGHT-ROTATE(T, y)'},
    {label:'Moves down the chain once a node has no left child', w:2, test:(t,P)=>/=\s*\w+\.right\b/.test(P.body('chain')), hint:'else y = y.right'}],
   efficiency:[
    {label:'One loop: each rotation adds one node to the chain (≤ n − 1 rotations)', w:5, test:(t,P)=>P.hasFn('chain') && fnLoop(P, 'chain') <= 1, hint:'No nested loops in MAKE-RIGHT-CHAIN.'},
    {label:'RIGHT-ROTATE is O(1)', w:5, test:(t,P)=>P.hasFn('rightrotate') && !/\b(for|while)\b/.test(P.body('rightrotate')), hint:'A rotation is a constant number of pointer changes.'}],
   model:`RIGHT-ROTATE(T, y)          // O(1)
    x = y.left
    y.left = x.right
    if x.right != NIL
        x.right.p = y
    x.p = y.p
    if y.p == NIL
        T.root = x
    else if y == y.p.right
        y.p.right = x
    else
        y.p.left = x
    x.right = y
    y.p = x

MAKE-RIGHT-CHAIN(T)         // at most n − 1 right rotations
    y = T.root
    while y != NIL
        if y.left != NIL
            RIGHT-ROTATE(T, y)    // one more node joins the chain
            y = y.p               // continue from the node that moved up
        else
            y = y.right`}]},
 {id:'ps05', num:5, covers:'Topics 5B & 6', probs:[
  {id:'ps5-3way', topic:'t05b', from:'Problem 1(b, d)', title:'Three-way partition and quicksort',
   prompt:'Write <code>THREE-WAY-PARTITION(A, p, r)</code>, which partitions around x = A[r] and returns <code>(e, g)</code> so that A[p..e−1] &lt; x, A[e..g−1] = x and A[g..r] &gt; x in Θ(n). Then write <code>THREE-WAY-QUICKSORT(A, p, r)</code> that runs fast even when all keys are equal.',
   starter:'THREE-WAY-PARTITION(A, p, r)\n    \n\nTHREE-WAY-QUICKSORT(A, p, r)\n    \n', define:['partition','quicksort'], call:['threewaypartition|partition','threewayquicksort|quicksort'], maxLoop:1,
   correctness:[
    {label:'Pivot is A[r]', w:1, test:(t,P)=>/=\s*a\s*\[\s*r\s*\]/.test(P.body('partition')), hint:'x = A[r]'},
    {label:'Compares against the pivot both ways', w:2, test:(t,P)=>{const b = P.body('partition'); return /<\s*(x|pivot|q)\b/.test(b) && />\s*(x|pivot|q)\b/.test(b);}, hint:'if A[i] < x … else if A[i] > x …'},
    {label:'Swaps elements into place', w:1, test:(t,P)=>/exchange|swap/.test(P.body('partition')), hint:'exchange A[i] with A[e]'},
    {label:'Maintains separate boundaries for < and > regions', w:2, test:(t,P)=>(P.body('partition').match(/\b(\w+)\s*=\s*\1\s*[+-]\s*1|\+\+|--|[+-]=\s*1/g) || []).length >= 3, hint:'Pointers e (end of <), i (scan) and g (start of >).'},
    {label:'Returns the pair (e, g)', w:2, test:(t,P)=>/return\s*\(?\s*\w+\s*,\s*\w+/.test(P.body('partition')), hint:'return (e, g)'},
    {label:'Quicksort base case p < r', w:1, test:(t,P)=>/if[^\n]*p\s*<\s*r/.test(P.body('quicksort')), hint:'if p < r'},
    {label:'Quicksort recurses on both outer parts', w:2, test:(t,P)=>nCalls(P.body('quicksort'), '\\w*quicksort') >= 2, hint:'Sort A[p..e − 1] and A[g..r].'}],
   efficiency:[
    {label:'Partition is a single Θ(n) pass', w:5, test:(t,P)=>P.hasFn('partition') && fnLoop(P, 'partition') <= 1, hint:'One loop over A[p..r].'},
    {label:'Recursion skips the block equal to the pivot', w:5, test:(t,P)=>{const b = P.body('quicksort'); return /,\s*e\s*-\s*1\s*\)/.test(b) && /\(\s*a\s*,\s*g\s*,/.test(b) || /\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*=[\s\S]*,\s*\1\s*-\s*1\s*\)[\s\S]*\(\s*a\s*,\s*\2\s*,/.test(b);}, hint:'Recursing only on the < and > parts makes n equal keys Θ(n).'}],
   model:`THREE-WAY-PARTITION(A, p, r)    // Θ(n); returns (e, g)
    x = A[r]
    e = p            // A[p..e-1] < x
    i = p            // A[e..i-1] == x
    g = r + 1        // A[g..r] > x
    while i < g
        if A[i] < x
            exchange A[i] with A[e]
            e = e + 1
            i = i + 1
        else if A[i] > x
            g = g - 1
            exchange A[i] with A[g]
        else
            i = i + 1
    return (e, g)

THREE-WAY-QUICKSORT(A, p, r)
    if p < r
        (e, g) = THREE-WAY-PARTITION(A, p, r)
        THREE-WAY-QUICKSORT(A, p, e - 1)    // skip the block equal to x
        THREE-WAY-QUICKSORT(A, g, r)`},
  {id:'ps5-hash', topic:'t06', from:'Problem 2', title:'Open-addressing insert (double hashing)',
   prompt:'Write <code>HASH(k, i, m)</code> for double hashing with h₁(k) = k mod m and h₂(k) = 1 + (k mod 7), and <code>HASH-INSERT(T, k, m)</code> that probes until it finds an empty slot or reports overflow.',
   starter:'HASH(k, i, m)\n    \n\nHASH-INSERT(T, k, m)\n    \n', define:['hashinsert'], call:['hash|h|probe'], maxLoop:1,
   correctness:[
    {label:'Probe number starts at 0', w:1, test:t=>/\bi\s*=\s*0\b/.test(t), hint:'i = 0'},
    {label:'Hash uses mod m', w:1, test:t=>/\bmod\b|%/.test(t), hint:'(h₁(k) + i·h₂(k)) mod m'},
    {label:'Slot depends on both k and i', w:2, test:t=>/(hash|h|probe)\s*\(\s*k\s*,\s*i/.test(t) || /\bi\s*\*/.test(t), hint:'j = HASH(k, i, m)'},
    {label:'Checks for an empty slot', w:2, test:t=>/==\s*(nil|null|none|empty)|is\s+empty/.test(t), hint:'if T[j] == NIL'},
    {label:'Stores the key', w:2, test:t=>/t\s*\[\s*\w+\s*\]\s*=\s*k\b/.test(t), hint:'T[j] = k'},
    {label:'Advances to the next probe', w:1, test:t=>/\bi\s*=\s*i\s*\+\s*1|\bi\s*\+=\s*1|\bi\+\+/.test(t), hint:'i = i + 1'},
    {label:'Reports overflow after m probes', w:2, test:t=>/overflow|full|error/.test(t), hint:'error "hash table overflow"'}],
   efficiency:[
    {label:'Stops at the first empty slot', w:5, test:t=>/\breturn\b/.test(t), hint:'Return as soon as the key is stored.'},
    {label:'At most m probes', w:5, test:t=>/until\s+i\s*==\s*m|i\s*<\s*m|while[^\n]*\bm\b|for[^\n]*\bm\b/.test(t), hint:'repeat … until i == m'}],
   model:`HASH(k, i, m)                  // double hashing
    return (k mod m + i * (1 + (k mod 7))) mod m

HASH-INSERT(T, k, m)
    i = 0
    repeat
        j = HASH(k, i, m)
        if T[j] == NIL
            T[j] = k
            return j
        i = i + 1
    until i == m
    error "hash table overflow"`}]},
 {id:'ps06', num:6, covers:'Topic 10A', probs:[
  {id:'ps6-ksmall', topic:'t10a', from:'Problem 1 (third approach)', title:'k smallest, in sorted order, via selection',
   prompt:'Write <code>K-SMALLEST(A, n, k)</code> that outputs the k smallest numbers in sorted order by finding the k-th smallest with an order-statistic algorithm, partitioning around it, and sorting only those k. Aim for Θ(n + k lg k).',
   starter:'K-SMALLEST(A, n, k)\n    \n', define:['ksmallest'], call:['select','partitionaround|partition','mergesort|heapsort|sort'], maxLoop:1,
   correctness:[
    {label:'Finds the k-th smallest with SELECT', w:3, test:t=>/select\s*\([^)]*\bk\b/.test(t), hint:'x = SELECT(A, 1, n, k)'},
    {label:'Partitions around it', w:2, test:t=>/partition/.test(t), hint:'PARTITION-AROUND(A, 1, n, x) puts the k smallest first.'},
    {label:'Sorts only the first k', w:3, test:t=>/sort\s*\([^)]*(1|0|p)\s*,\s*k\b|sort\s*\([^)]*\.\.\s*k\s*\]/.test(t), hint:'MERGE-SORT(A, 1, k)'},
    {label:'Returns them', w:1, test:t=>/\breturn\b|print|output/.test(t), hint:'return A[1..k]'}],
   efficiency:[
    {label:'Does not sort all n numbers', w:5, test:t=>!/sort\s*\([^)]*\bn\b/.test(t), hint:'Sorting everything costs Θ(n lg n).'},
    {label:'Linear-time selection, not k repeated extractions', w:5, test:t=>/select/.test(t) && !/extract/.test(t), hint:'Worst-case linear SELECT: Θ(n).'}],
   model:`K-SMALLEST(A, n, k)              // Θ(n + k lg k)
    x = SELECT(A, 1, n, k)            // k-th smallest, worst-case Θ(n)
    PARTITION-AROUND(A, 1, n, x)      // now A[1..k] are the k smallest
    MERGE-SORT(A, 1, k)               // Θ(k lg k)
    return A[1..k]`},
  {id:'ps6-kthlargest', topic:'t10a', from:'Problem 2', title:'k-th largest using MEDIAN',
   prompt:'You have <code>MEDIAN(A, n)</code> that returns the median in O(n). Write <code>KTH-LARGEST(A, n, k)</code> (and any helper) that finds the k-th largest element in <b>O(n)</b> worst case.',
   starter:'KTH-LARGEST(A, n, k)\n    \n', define:['kthlargest'], call:['median','partitionaround|partition'], maxLoop:0,
   correctness:[
    {label:'Converts k-th largest to the (n − k + 1)-th smallest', w:2, test:t=>/n\s*-\s*k\s*\+\s*1|n\s*-\s*k\b/.test(t), hint:'i = n − k + 1'},
    {label:'Uses MEDIAN as the pivot', w:2, test:t=>/median\s*\(/.test(t), hint:'m = MEDIAN(A, n)'},
    {label:'Partitions around the median', w:2, test:t=>/partition/.test(t), hint:'q = PARTITION-AROUND(A, 1, n, m)'},
    {label:'Base case for one element', w:1, test:t=>/if[^\n]*(n\s*==\s*1|n\s*<=\s*1|p\s*==\s*r|lo\s*==\s*hi)/.test(t), hint:'if n == 1 return A[1]'},
    {label:'Compares the rank with the pivot position', w:1, test:t=>/if[^\n]*\b(i|k)\s*(==|<|>)\s*q\b|if[^\n]*\bq\s*(==|<|>)/.test(t), hint:'if i == q return m'},
    {label:'Recurses on one side with an adjusted rank', w:2, test:t=>/(i|k)\s*-\s*q\b/.test(t), hint:'right side: rank i − q'}],
   efficiency:[
    {label:'No sorting', w:5, test:t=>!/sort/.test(t), hint:'Sorting is Θ(n lg n).'},
    {label:'Median pivot halves n each call: T(n) = T(n/2) + O(n) = O(n)', w:5, test:t=>/median\s*\(/.test(t) && /partition/.test(t), hint:'Recurse into only the side that holds the answer.'}],
   model:`KTH-LARGEST(A, n, k)              // O(n)
    return SELECT-BY-MEDIAN(A, n, n - k + 1)    // k-th largest = (n−k+1)-th smallest

SELECT-BY-MEDIAN(A, n, i)          // T(n) = T(n/2) + O(n) = O(n)
    if n == 1
        return A[1]
    m = MEDIAN(A, n)
    q = PARTITION-AROUND(A, 1, n, m)    // m lands at index q
    if i == q
        return m
    else if i < q
        return SELECT-BY-MEDIAN(A[1..q-1], q - 1, i)
    else
        return SELECT-BY-MEDIAN(A[q+1..n], n - q, i - q)`}]},
 {id:'ps07', num:7, covers:'Topics 10B & 12*', probs:[
  {id:'ps7-ksorted', topic:'t10b', from:'Problem 1(a)', title:'Sort a k-sorted array in O(n lg(n/k))',
   prompt:'A[1..n] is <b>k-sorted</b>: it splits into k blocks of n/k elements, and every element of a block is larger than everything in earlier blocks. Write <code>SORT-K-SORTED(A, n, k)</code> that fully sorts it in O(n lg(n/k)).',
   starter:'SORT-K-SORTED(A, n, k)\n    \n', define:['sortksorted'], call:['mergesort|heapsort|sort'], maxLoop:1,
   correctness:[
    {label:'Block size n/k', w:2, test:t=>/=\s*n\s*\/\s*k\b/.test(t), hint:'s = n / k'},
    {label:'Loops over the k blocks', w:3, test:t=>/for[^\n]*\bk\b/.test(t), hint:'for b = 0 to k − 1'},
    {label:'Sorts each block', w:3, test:t=>/(mergesort|heapsort|sort)\s*\(/.test(t), hint:'MERGE-SORT(A, b·s + 1, (b + 1)·s)'},
    {label:'Block bounds use the block size', w:2, test:t=>/\*\s*\w+\s*\+\s*1|\*\s*s\b|\*\s*\(\s*n\s*\/\s*k\s*\)/.test(t), hint:'Block b covers A[b·s + 1 .. (b + 1)·s].'}],
   efficiency:[
    {label:'Never sorts the whole array at once', w:5, test:t=>!/sort\s*\(\s*a\s*,\s*(1|0)\s*,\s*n\s*\)/.test(t), hint:'That costs Θ(n lg n).'},
    {label:'Θ(m lg m) sort per block, not insertion sort', w:5, test:t=>!/insertion/.test(t), hint:'Insertion sort makes a block Θ((n/k)²).'}],
   model:`SORT-K-SORTED(A, n, k)        // k blocks × Θ((n/k) lg(n/k)) = Θ(n lg(n/k))
    s = n / k
    for b = 0 to k - 1
        MERGE-SORT(A, b * s + 1, (b + 1) * s)
    // blocks are already in the right order, so A is now sorted`},
  {id:'ps7-almostpal', topic:'t12s', from:'Problem 3', title:'Palindrome and almost-palindrome',
   prompt:'Write a recursive <code>IS-PALINDROME(s, i, j)</code> that tests whether s[i..j] is a palindrome, and <code>ALMOST-PALINDROME(s, n)</code> that tests whether deleting <b>at most one</b> character makes s[1..n] a palindrome, in Θ(n).',
   starter:'IS-PALINDROME(s, i, j)\n    \n\nALMOST-PALINDROME(s, n)\n    \n', define:['ispalindrome','almostpalindrome'], call:['ispalindrome'], maxLoop:1,
   correctness:[
    {label:'Base case: empty or one character', w:2, test:(t,P)=>/if[^\n]*(i\s*>=\s*j|j\s*<=\s*i|i\s*>\s*j|n\s*<=\s*1|len[^\n]*<=\s*1)/.test(P.body('ispalindrome')), hint:'if i ≥ j return true'},
    {label:'Compares the two ends', w:2, test:(t,P)=>/s\s*\[\s*i\s*\]\s*(!=|==)\s*s\s*\[\s*j\s*\]/.test(P.body('ispalindrome')), hint:'if s[i] ≠ s[j] return false'},
    {label:'Recurses inward', w:2, test:(t,P)=>/ispalindrome\s*\([^)]*i\s*\+\s*1[^)]*j\s*-\s*1/.test(P.body('ispalindrome')), hint:'IS-PALINDROME(s, i + 1, j − 1)'},
    {label:'Finds the first mismatch from both ends', w:1, test:(t,P)=>/\bwhile\b|\bfor\b/.test(P.body('almostpalindrome')), hint:'Move i and j inward while s[i] == s[j].'},
    {label:'Tries skipping either mismatched character', w:3, test:(t,P)=>{const b = P.body('almostpalindrome'); return /ispalindrome\s*\([^)]*i\s*\+\s*1/.test(b) && /ispalindrome\s*\([^)]*j\s*-\s*1/.test(b);}, hint:'IS-PALINDROME(s, i + 1, j) or IS-PALINDROME(s, i, j − 1)'}],
   efficiency:[
    {label:'Only two candidates after the mismatch: Θ(n), not Θ(n²)', w:5, test:(t,P)=>P.hasFn('almostpalindrome') && fnLoop(P, 'almostpalindrome') <= 1 && nCalls(P.body('almostpalindrome'), 'ispalindrome') <= 2, hint:'Don’t try deleting every position.'},
    {label:'Reuses IS-PALINDROME with indices (no string copies)', w:5, test:(t,P)=>/ispalindrome\s*\(/.test(P.body('almostpalindrome')) && !/substring|substr|slice|copy|remove|concat/.test(t), hint:'Pass index ranges instead of building new strings.'}],
   model:`IS-PALINDROME(s, i, j)       // Θ(j − i)
    if i >= j
        return true
    if s[i] != s[j]
        return false
    return IS-PALINDROME(s, i + 1, j - 1)

ALMOST-PALINDROME(s, n)      // Θ(n)
    i = 1
    j = n
    while i < j and s[i] == s[j]
        i = i + 1
        j = j - 1
    if i >= j
        return true                  // already a palindrome
    // first mismatch: delete s[i] or delete s[j]
    return IS-PALINDROME(s, i + 1, j) or IS-PALINDROME(s, i, j - 1)`},
  {id:'ps7-treasure', topic:'t12s', from:'Problem 4', title:'Treasure hunt (backtracking)',
   prompt:'An m × n map has land <code>.</code>, water <code>#</code> and one treasure <code>X</code>. Write a recursive backtracking <code>PATH-EXISTS(M, r, c)</code> that returns whether a path of up/down/left/right land moves leads from (r, c) to the treasure. Mark the cells you use with <code>v</code>.',
   starter:'PATH-EXISTS(M, r, c)\n    \n', define:['pathexists'], call:['pathexists'], maxLoop:1,
   correctness:[
    {label:'Rejects positions off the map', w:2, test:t=>/\br\s*<\s*(1|0)|\br\s*>\s*m|\bc\s*>\s*n|\bc\s*<\s*(1|0)|inside|in\s*bounds|outside/.test(t), hint:'if r < 1 or r > m or c < 1 or c > n return false'},
    {label:'Succeeds on the treasure', w:2, test:t=>/==\s*['"]x['"]/.test(t), hint:'if M[r][c] == "X" return true'},
    {label:'Rejects water and visited cells', w:2, test:t=>/!=\s*['"]\.['"]|==\s*['"]#['"]|visited/.test(t), hint:'if M[r][c] ≠ "." return false'},
    {label:'Marks the cell before exploring', w:2, test:t=>/(?<![!=])=\s*['"]v['"]|visited\s*\[[^\]]*\]\s*=\s*true/.test(t), hint:'M[r][c] = "v"'},
    {label:'Explores all four directions', w:2, test:t=>nCalls(t, 'pathexists') >= 4 || (/\bfor\b/.test(t) && nCalls(t, 'pathexists') >= 1), hint:'Try (r − 1, c), (r + 1, c), (r, c − 1), (r, c + 1).'},
    {label:'Un-marks the cell when it is a dead end (backtrack)', w:1, test:t=>/(?<![!=])=\s*['"]\.['"]/.test(t), hint:'M[r][c] = "." before returning false'}],
   efficiency:[
    {label:'Never re-enters a marked cell', w:5, test:t=>/(?<![!=])=\s*['"]v['"]|visited\s*\[[^\]]*\]\s*=\s*true/.test(t) && /!=\s*['"]\.['"]|visited/.test(t), hint:'Marking prevents infinite loops.'},
    {label:'Stops as soon as the treasure is found', w:5, test:t=>/\bor\b|\|\||return\s+true/.test(t), hint:'Short-circuit: return true from the first successful direction.'}],
   model:`PATH-EXISTS(M, r, c)          // M is m × n
    if r < 1 or r > m or c < 1 or c > n
        return false                 // off the map
    if M[r][c] == 'X'
        return true                  // found the treasure
    if M[r][c] != '.'
        return false                 // water or already on the path
    M[r][c] = 'v'                    // choose this cell
    if PATH-EXISTS(M, r - 1, c) or PATH-EXISTS(M, r + 1, c) or PATH-EXISTS(M, r, c - 1) or PATH-EXISTS(M, r, c + 1)
        return true
    M[r][c] = '.'                    // un-choose (backtrack)
    return false`}]},
 {id:'ps08', num:8, covers:'Topics 12A & 12B', probs:[
  {id:'ps8-coins', topic:'t12a', from:'Problem 1(e)', title:'Coin change: bottom-up DP in O(nk)',
   prompt:'Coins have values c[1..k] with c[1] = 1. Write a bottom-up (non-recursive) <code>MAKE-CHANGE(c, k, n)</code> that returns the fewest coins that make n cents in O(nk) time.',
   starter:'MAKE-CHANGE(c, k, n)\n    \n', define:['makechange'], call:[], maxLoop:2,
   correctness:[
    {label:'Base case: 0 cents needs 0 coins', w:2, test:t=>/\[\s*0\s*\]\s*=\s*0/.test(t), hint:'C[0] = 0'},
    {label:'Initializes each entry to ∞', w:1, test:t=>/=\s*inf/.test(t), hint:'C[v] = ∞'},
    {label:'Fills amounts 1..n in increasing order', w:2, test:t=>/for[^\n]*=\s*1\s*to\s*n\b|for[^\n]*range\s*\(\s*1\s*,\s*n/.test(t), hint:'for v = 1 to n'},
    {label:'Tries every coin', w:2, test:t=>/for[^\n]*\bk\b/.test(t), hint:'for i = 1 to k'},
    {label:'Recurrence C[v − c[i]] + 1', w:3, test:t=>/\[\s*\w+\s*-\s*\w+\s*\[\s*\w+\s*\]\s*\]\s*\+\s*1/.test(t), hint:'C[v] = min(C[v], C[v − c[i]] + 1)'},
    {label:'Only uses coins that fit', w:1, test:t=>/\w+\s*\[\s*i\s*\]\s*<=|>=\s*\w+\s*\[\s*i\s*\]/.test(t), hint:'if c[i] ≤ v'},
    {label:'Returns C[n]', w:1, test:t=>/return\s+\w+\s*\[\s*n\s*\]/.test(t), hint:'return C[n]'}],
   efficiency:[
    {label:'Bottom-up table, no recursion', w:5, test:(t,P)=>!P.calls('makechange'), hint:'Plain recursion is exponential.'},
    {label:'Two nested loops: Θ(nk)', w:5, test:(t,P)=>P.maxLoop === 2, hint:'Amounts outside, coins inside.'}],
   model:`MAKE-CHANGE(c, k, n)          // Θ(nk) time, Θ(n) space
    let C[0..n] be a new array    // C[v] = fewest coins for v cents
    C[0] = 0
    for v = 1 to n
        C[v] = ∞
        for i = 1 to k
            if c[i] <= v and C[v - c[i]] + 1 < C[v]
                C[v] = C[v - c[i]] + 1
    return C[n]`},
  {id:'ps8-checker', topic:'t12a', from:'Problem 3', title:'Checkerboard: maximum dollars with DP',
   prompt:'On an n × n board a checker moves from the bottom row to the top row; each step goes straight up or diagonally up-left/up-right, and the move x → y pays p(x, y) dollars (may be negative). Write a bottom-up <code>MAX-DOLLARS(p, n)</code> that returns the maximum total.',
   starter:'MAX-DOLLARS(p, n)\n    \n', define:['maxdollars'], call:[], maxLoop:2,
   correctness:[
    {label:'Bottom row starts at 0', w:1, test:t=>/\[\s*1\s*,\s*\w+\s*\]\s*=\s*0|\[\s*1\s*\]\s*\[\s*\w+\s*\]\s*=\s*0|\[\s*0\s*\]\s*\[\s*\w+\s*\]\s*=\s*0|\[\s*0\s*,\s*\w+\s*\]\s*=\s*0/.test(t), hint:'D[1, c] = 0 for every column c'},
    {label:'Fills rows from bottom to top', w:2, test:t=>/for[^\n]*=\s*2\s*to\s*n\b|for[^\n]*range\s*\(\s*1\s*,\s*n/.test(t), hint:'for r = 2 to n'},
    {label:'Straight-up move from D[r − 1, c]', w:2, test:t=>/\[\s*r\s*-\s*1\s*,\s*c\s*\]|\[\s*r\s*-\s*1\s*\]\s*\[\s*c\s*\]/.test(t), hint:'D[r − 1, c] + p((r − 1, c), (r, c))'},
    {label:'Both diagonal moves', w:2, test:t=>/c\s*-\s*1/.test(t) && /c\s*\+\s*1/.test(t), hint:'from columns c − 1 and c + 1'},
    {label:'Guards the edge columns', w:1, test:t=>/c\s*>\s*1|c\s*<\s*n|c\s*>=\s*2|c\s*<=\s*n\s*-\s*1/.test(t), hint:'if c > 1 …; if c < n …'},
    {label:'Takes the maximum', w:2, test:t=>/max/.test(t), hint:'D[r, c] = max(…)'},
    {label:'Answer is the best square in the top row', w:1, test:t=>/\breturn\b/.test(t), hint:'return max over c of D[n, c]'}],
   efficiency:[
    {label:'Table instead of exponential recursion', w:5, test:(t,P)=>!P.calls('maxdollars'), hint:'Brute force tries 3ⁿ paths.'},
    {label:'Θ(1) work per square: Θ(n²) total', w:5, test:(t,P)=>P.maxLoop <= 2, hint:'Rows outside, columns inside.'}],
   model:`MAX-DOLLARS(p, n)            // rows 1 (bottom) .. n (top); Θ(n²)
    let D[1..n, 1..n] be a new table   // D[r, c] = best total to reach (r, c)
    for c = 1 to n
        D[1, c] = 0
    for r = 2 to n
        for c = 1 to n
            D[r, c] = D[r - 1, c] + p((r - 1, c), (r, c))
            if c > 1
                D[r, c] = max(D[r, c], D[r - 1, c - 1] + p((r - 1, c - 1), (r, c)))
            if c < n
                D[r, c] = max(D[r, c], D[r - 1, c + 1] + p((r - 1, c + 1), (r, c)))
    return MAX-OF-ROW(D, n)

MAX-OF-ROW(D, n)
    best = D[n, 1]
    for c = 2 to n
        best = max(best, D[n, c])
    return best`}]},
 {id:'ps09', num:9, covers:'Topic 13', probs:[
  {id:'ps9-greedy', topic:'t13', from:'Problem 1(a)', title:'Greedy change for powers of c',
   prompt:'The coins are c⁰, c¹, …, cᵏ for an integer c &gt; 1. Write a <b>greedy</b> <code>GREEDY-CHANGE(n, c, k)</code> that returns the fewest coins for n cents, and state its running time in a comment.',
   starter:'GREEDY-CHANGE(n, c, k)\n    \n', define:['greedychange'], call:[], maxLoop:1,
   correctness:[
    {label:'Starts with the largest coin cᵏ', w:2, test:t=>/c\s*\^\s*k|c\s*\*\*\s*k|pow\s*\(\s*c\s*,\s*k/.test(t), hint:'d = cᵏ'},
    {label:'Goes from the largest coin down to 1', w:2, test:t=>/downto|step\s*-\s*1|,\s*-\s*1\s*\)|for[^\n]*\bk\b[^\n]*\b0\b/.test(t), hint:'for i = k downto 0'},
    {label:'Takes as many of the current coin as fit', w:3, test:t=>/n\s*\/\s*\w+|n\s*div\s*\w+|n\s*\/\/\s*\w+/.test(t), hint:'count = count + ⌊n / d⌋'},
    {label:'Keeps the remainder', w:2, test:t=>/\bmod\b|%|n\s*=\s*n\s*-/.test(t), hint:'n = n mod d'},
    {label:'Moves to the next smaller coin', w:1, test:t=>/\/\s*c\b|c\s*\^\s*\(?\s*i\b|c\s*\*\*\s*i\b/.test(t), hint:'d = d / c'},
    {label:'Returns the count', w:1, test:t=>/\breturn\b/.test(t), hint:'return count'}],
   efficiency:[
    {label:'One iteration per denomination: Θ(k)', w:5, test:(t,P)=>P.maxLoop <= 1 && !/while[^\n]*n\s*>=?/.test(t), hint:'Don’t take one coin per iteration.'},
    {label:'Uses division and mod instead of repeated subtraction', w:5, test:t=>/\bmod\b|%|\bdiv\b|n\s*\/\s*\w+|n\s*\/\/\s*\w+/.test(t), hint:'⌊n / d⌋ coins in one step.'}],
   penalties:[{label:'Subtracts one coin per loop iteration', p:3, test:t=>/while[^\n]*n\s*>=/.test(t), hint:'That loop runs up to n times.'}],
   model:`GREEDY-CHANGE(n, c, k)       // coins c^0 .. c^k; Θ(k) time
    count = 0
    d = c^k                      // largest coin
    for i = k downto 0
        count = count + ⌊n / d⌋  // take as many of this coin as fit
        n = n mod d
        d = d / c
    return count`}]},
 {id:'ps10', num:10, covers:'Topics 14A & 14B', probs:[
  {id:'ps10-bipartite', topic:'t14a', from:'Problem 1(b)', title:'Bipartite test with BFS 2-coloring',
   prompt:'Write <code>IS-BIPARTITE(G, s)</code> for a connected undirected graph (adjacency lists <code>G.adj</code>) that returns true exactly when G is bipartite, in Θ(V + E).',
   starter:'IS-BIPARTITE(G, s)\n    \n', define:['isbipartite'], call:['enqueue|push|append','dequeue|pop'], maxLoop:2,
   correctness:[
    {label:'Starts every vertex uncolored', w:1, test:t=>/color\s*(\[[^\]]*\])?\s*=\s*(nil|null|none|-1|white|uncolored)/.test(t), hint:'u.color = NIL for all u'},
    {label:'Colors the source', w:1, test:t=>/s\.color\s*=|color\s*\[\s*s\s*\]\s*=/.test(t), hint:'s.color = 0'},
    {label:'Runs BFS with a queue', w:2, test:t=>/enqueue|queue|\.push|append/.test(t) && /dequeue|pop/.test(t), hint:'ENQUEUE(Q, s); u = DEQUEUE(Q)'},
    {label:'Scans each adjacency list', w:2, test:t=>/adj/.test(t), hint:'for each v in G.adj[u]'},
    {label:'Gives a new neighbor the opposite color', w:2, test:t=>/color\s*(\[[^\]]*\])?\s*=\s*(1\s*-|not\b|!|opposite|other)/.test(t), hint:'v.color = 1 − u.color'},
    {label:'Detects an edge inside one side', w:2, test:t=>/color\s*(\[[^\]]*\])?\s*==\s*\w+(\.color|\s*\[\s*color)|color\s*\[\s*v\s*\]\s*==\s*color\s*\[\s*u\s*\]/.test(t), hint:'if v.color == u.color return false'},
    {label:'Returns false on conflict and true at the end', w:1, test:t=>/return\s+false/.test(t) && /return\s+true/.test(t), hint:'return true after BFS finishes'}],
   efficiency:[
    {label:'Each vertex enqueued once (only when uncolored)', w:5, test:t=>/if[^\n]*color\s*(\[[^\]]*\])?\s*==\s*(nil|null|none|-1|white|uncolored)/.test(t), hint:'Enqueue v only the first time you see it.'},
    {label:'One BFS: Θ(V + E)', w:5, test:(t,P)=>P.maxLoop <= 2 && !P.calls('isbipartite'), hint:'No restart per vertex; the graph is connected.'}],
   model:`IS-BIPARTITE(G, s)         // G connected, undirected; Θ(V + E)
    for each vertex u in G.V
        u.color = NIL
    s.color = 0
    Q = empty queue
    ENQUEUE(Q, s)
    while Q is not empty
        u = DEQUEUE(Q)
        for each v in G.adj[u]
            if v.color == NIL
                v.color = 1 - u.color     // opposite side
                ENQUEUE(Q, v)
            else if v.color == u.color
                return false              // edge inside one side
    return true`},
  {id:'ps10-maze', topic:'t14a', from:'Problem 2', title:'Number maze: fewest moves with BFS',
   prompt:'An n × n grid M holds positive integers. From a square labeled k you may jump exactly k squares up, down, left or right (staying on the board). Write <code>NUMBER-MAZE(M, n)</code> that returns the fewest moves from the top-left to the bottom-right square, or reports that there is no solution.',
   starter:'NUMBER-MAZE(M, n)\n    \n', define:['numbermaze'], call:['enqueue|push|append','dequeue|pop'], maxLoop:2,
   correctness:[
    {label:'Distances start at ∞', w:1, test:t=>/=\s*inf/.test(t), hint:'dist[r, c] = ∞'},
    {label:'Start square has distance 0', w:1, test:t=>/\[\s*(1|0)\s*,\s*(1|0)\s*\]\s*=\s*0|\[\s*(1|0)\s*\]\s*\[\s*(1|0)\s*\]\s*=\s*0/.test(t), hint:'dist[1, 1] = 0'},
    {label:'Uses a FIFO queue (BFS)', w:2, test:t=>/enqueue|queue/.test(t), hint:'ENQUEUE(Q, (1, 1))'},
    {label:'Jumps by the number on the square', w:2, test:t=>/[+-]\s*k\b|[+-]\s*m\s*\[/.test(t), hint:'k = M[r, c]; try (r ± k, c) and (r, c ± k)'},
    {label:'Stays on the board', w:2, test:t=>/inside|<=\s*n\b|>=\s*1\b|<\s*n\b|>=\s*0\b|bounds/.test(t), hint:'1 ≤ x ≤ n and 1 ≤ y ≤ n'},
    {label:'Only visits unvisited squares', w:2, test:t=>/==\s*inf|not\s+visited|!\s*visited/.test(t), hint:'if dist[x, y] == ∞'},
    {label:'New distance is one more move', w:1, test:t=>/\+\s*1\b/.test(t), hint:'dist[x, y] = dist[r, c] + 1'},
    {label:'Reports when there is no solution', w:1, test:t=>/return[^\n]*(no\b|inf|-1|none|nil|false|impossible)/.test(t), hint:'return "NO SOLUTION"'}],
   efficiency:[
    {label:'BFS visits each square once: Θ(n²)', w:5, test:t=>/enqueue|queue/.test(t) && /==\s*inf|visited/.test(t), hint:'Each square has at most 4 outgoing jumps.'},
    {label:'No backtracking over all paths', w:5, test:(t,P)=>!P.calls('numbermaze'), hint:'Trying every path is exponential.'}],
   model:`NUMBER-MAZE(M, n)            // BFS on n² squares, ≤ 4 jumps each: Θ(n²)
    let dist[1..n, 1..n] be a new table, every entry ∞
    dist[1, 1] = 0
    Q = empty queue
    ENQUEUE(Q, (1, 1))
    while Q is not empty
        (r, c) = DEQUEUE(Q)
        if r == n and c == n
            return dist[n, n]
        k = M[r, c]
        for each (x, y) in [(r - k, c), (r + k, c), (r, c - k), (r, c + k)]
            if INSIDE(x, y, n) and dist[x, y] == ∞
                dist[x, y] = dist[r, c] + 1
                ENQUEUE(Q, (x, y))
    return "NO SOLUTION"

INSIDE(x, y, n)
    return 1 <= x and x <= n and 1 <= y and y <= n`}]},
 {id:'ps11', num:11, covers:'Topics 16 & 17', probs:[
  {id:'ps11-equal', topic:'mst', from:'Problem 3', title:'MST when every edge weight is equal',
   prompt:'All edge weights of a connected graph G are equal. Write the most efficient <code>EQUAL-WEIGHT-MST(G)</code> you can (plus helpers) that returns a minimum spanning tree.',
   starter:'EQUAL-WEIGHT-MST(G)\n    \n', define:['mst'], call:['dfsvisit|bfs|visit|dfs'], maxLoop:1,
   correctness:[
    {label:'Tracks visited vertices', w:2, test:t=>/visited|color/.test(t), hint:'u.visited = false for every vertex'},
    {label:'Searches from a single start vertex', w:2, test:t=>/dfsvisit\s*\(|bfs\s*\(|visit\s*\(|dfs\s*\(/.test(t), hint:'DFS-VISIT(G, s, T)'},
    {label:'Scans adjacency lists', w:2, test:t=>/adj/.test(t), hint:'for each v in G.adj[u]'},
    {label:'Adds the edge to each newly discovered vertex', w:3, test:t=>ADD_EDGE.test(t), hint:'T = T ∪ {(u, v)}'},
    {label:'Returns the tree', w:1, test:t=>/return\s+t\b/.test(t), hint:'return T'}],
   efficiency:[
    {label:'No edge sorting (every spanning tree is minimum)', w:5, test:t=>!/sort/.test(t), hint:'All spanning trees have weight (V − 1)·w.'},
    {label:'Θ(V + E) graph search, no priority queue', w:5, test:t=>!/extractmin|heap|priority/.test(t), hint:'BFS or DFS suffices.'}],
   penalties:[{label:'Uses Union-Find machinery that isn’t needed', p:2, test:t=>/findset|union\s*\(/.test(t), hint:'A plain DFS/BFS tree is already an MST.'}],
   model:`EQUAL-WEIGHT-MST(G)          // any spanning tree is an MST: Θ(V + E)
    T = ∅
    for each vertex u in G.V
        u.visited = false
    s = any vertex in G.V
    DFS-VISIT(G, s, T)
    return T

DFS-VISIT(G, u, T)
    u.visited = true
    for each v in G.adj[u]
        if not v.visited
            T = T ∪ {(u, v)}        // tree edge
            DFS-VISIT(G, v, T)`},
  {id:'ps11-bridges', topic:'prim', from:'Problem 4', title:'Low-cost bridges from a distance matrix',
   prompt:'n islands have pairwise distances in an n × n matrix D, and a bridge costs its length. Write <code>MIN-BRIDGES(D, n)</code> that returns the cheapest set of bridges connecting all islands, as efficiently as possible for this <b>dense</b> input.',
   starter:'MIN-BRIDGES(D, n)\n    \n', define:['bridges'], call:[], maxLoop:2,
   correctness:[
    {label:'Keys start at ∞', w:1, test:t=>/=\s*inf/.test(t), hint:'key[v] = ∞'},
    {label:'Start island has key 0', w:1, test:t=>/key\s*\[\s*\w+\s*\]\s*=\s*0|\.key\s*=\s*0/.test(t), hint:'key[1] = 0'},
    {label:'Picks the closest island not yet connected', w:2, test:t=>/min|closest|best|extractmin/.test(t), hint:'u = the non-tree island with the smallest key'},
    {label:'Marks it as connected', w:1, test:t=>/intree|in_tree|visited|done|=\s*true/.test(t), hint:'inTree[u] = true'},
    {label:'Updates keys from the matrix row', w:2, test:t=>/=\s*d\s*\[\s*u\s*\]\s*\[\s*v\s*\]|=\s*d\s*\[\s*u\s*,\s*v\s*\]/.test(t), hint:'if D[u][v] < key[v]: key[v] = D[u][v]'},
    {label:'Records the bridge (parent)', w:2, test:t=>/(parent|pi)\s*\[\s*v\s*\]\s*=\s*u|\.(pi|parent)\s*=\s*u/.test(t), hint:'parent[v] = u'},
    {label:'Returns the bridges', w:1, test:t=>/\breturn\b/.test(t), hint:'return {(v, parent[v])}'}],
   efficiency:[
    {label:'Array-based Prim: Θ(n²), optimal for a complete graph', w:5, test:t=>!/heap|sort/.test(t), hint:'With Θ(n²) edges, a heap or sorting adds a log factor.'},
    {label:'Only two nested loops (no Θ(n³))', w:5, test:(t,P)=>P.maxLoop <= 2, hint:'n rounds × Θ(n) scan.'}],
   penalties:[{label:'Sorts all Θ(n²) pairs (Kruskal is slower here)', p:2, test:t=>/sort/.test(t), hint:'Sorting n² distances is Θ(n² lg n).'}],
   model:`MIN-BRIDGES(D, n)            // dense graph: array-based Prim, Θ(n²)
    for v = 1 to n
        key[v] = ∞
        inTree[v] = false
    key[1] = 0
    parent[1] = NIL
    for step = 1 to n
        u = CLOSEST-ISLAND(key, inTree, n)    // Θ(n) scan
        inTree[u] = true
        for v = 1 to n
            if not inTree[v] and D[u][v] < key[v]
                key[v] = D[u][v]
                parent[v] = u
    return {(v, parent[v]) : v = 2 to n}

CLOSEST-ISLAND(key, inTree, n)
    best = NIL
    for v = 1 to n
        if not inTree[v] and (best == NIL or key[v] < key[best])
            best = v
    return best`}]}
];
const PS_CODE = PSETS.flatMap(s => s.probs.map(q => Object.assign(q, {ps: s.id})));

const PS_TOPICS = {ps01:['t01','t03'], ps02:['t02','t07'], ps03:['t08','t09'], ps04:['t05a','t11'], ps05:['t05b','t06'], ps06:['t10a'], ps07:['t10b','t12s'], ps08:['t12a','t12b'], ps09:['t13'], ps10:['t14a','t14b'], ps11:['ds','mst','kruskal','prim']};
const PS_COLORS = ['#60a5fa','#38bdf8','#22d3ee','#34d399','#a3e635','#facc15','#fb923c','#f87171','#f472b6','#c084fc','#818cf8'];
const psChips = s => (PS_TOPICS[s.id] || []).filter(id => TMETA[id]).map(id => `<a class="pill" href="#${id}" style="color:${TMETA[id].color}">#${TMETA[id].num} ${TMETA[id].short}</a>`).join(' ');
function psCard(s){
  return `<div class="card ps-card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">📄 Problem Set ${s.num}</h3><span class="pill">${s.covers}</span></div>
    <div class="row" style="gap:6px;margin:10px 0">${psChips(s)}</div>
    <ul class="ps-list">${s.probs.map(q => `<li>${q.title} <span class="ps-best" data-best="${q.id}"></span></li>`).join('')}</ul>
    <div class="row"><a class="btn sm primary" href="#${s.id}">✍️ Practice ${s.probs.length} problem${s.probs.length > 1 ? 's' : ''}</a><a class="btn sm ghost" href="${PS_BASE}${s.id}.pdf" target="_blank" rel="noopener">PDF ↗</a></div></div>`;
}
const PS_HOW = `<div class="callout cyan">Every problem here is graded like the <a href="#practice">Practice Arena</a>: <b>Correctness</b> (40%) · <b>Modularity</b> (30%) · <b>Efficiency</b> (30%).</div>
  <div class="card"><h3>🎯 Practice on purpose</h3><ol class="ps-steps"><li><b>Plan first.</b> Before typing, write in a comment what the procedure returns and its target running time.</li><li><b>Write it from memory.</b> Don't open the notes or the PDF solution path yet.</li><li><b>Submit, then read the feedback.</b> Use 💡 Hint only after a first attempt.</li><li><b>Fix and resubmit</b> until you reach an A, and only then compare with the model answer.</li><li><b>Re-do it tomorrow</b> from a blank editor. Getting it right a second time is what makes it stick.</li></ol>
  <p class="stat-label">The problems are short rewrites of the pseudocode parts of each problem set. Proof and table parts are not graded here; work those on paper using the PDF.</p></div>`;
document.getElementById('page-videos').insertAdjacentHTML('beforebegin',
  `<section class="page hidden" id="page-ps"><div class="row" style="gap:8px"><span class="eyebrow">📂 Problem Sets</span></div><h1>📂 Problem Set <span class="grad">Pseudocode Practice</span></h1>
    <p class="lead">Write the algorithms each problem set asks for and get graded instantly. ${PS_CODE.length} problems across ${PSETS.length} problem sets.</p>
    ${PS_HOW}<div class="row" style="margin:14px 0"><button class="btn primary" id="ps-random">🎲 Random problem I haven't aced</button></div>
    <div class="grid g3">${PSETS.map(psCard).join('')}</div></section>` +
  PSETS.map((s, k) => `<section class="page hidden" id="page-${s.id}"><div class="row" style="gap:8px"><a class="eyebrow" href="#ps">📂 Problem Sets</a><span class="eyebrow" style="color:${PS_COLORS[k]};border-color:${PS_COLORS[k]}55">Problem Set ${s.num}</span></div>
    <h1>📄 Problem Set ${s.num} <span class="grad">${s.covers}</span></h1>
    <div class="row" style="gap:6px">${psChips(s)}<a class="btn sm ghost" href="${PS_BASE}${s.id}.pdf" target="_blank" rel="noopener">Open the PDF ↗</a></div>
    <div class="callout cyan" style="margin-top:14px">Graded like the Practice Arena: <b>Correctness</b> 40% · <b>Modularity</b> 30% · <b>Efficiency</b> 30%. Plan in a comment, write from memory, then use the feedback.</div>
    ${s.probs.map((q, i) => `<div class="card ps-prob" id="psq-${q.id}"><div class="row" style="justify-content:space-between"><span class="pill">Problem ${i + 1} of ${s.probs.length} · based on PS ${s.num}, ${q.from}</span><span class="ps-best" data-best="${q.id}"></span></div><div class="ps-q" data-q="${q.id}"></div></div>`).join('')}
    <div class="row" style="justify-content:space-between;margin-top:16px">${k ? `<a class="btn ghost" href="#${PSETS[k - 1].id}">← Problem Set ${k}</a>` : '<span></span>'}${k < PSETS.length - 1 ? `<a class="btn ghost" href="#${PSETS[k + 1].id}">Problem Set ${k + 2} →</a>` : ''}</div></section>`).join(''));
document.querySelector('#nav .nav-label').insertAdjacentHTML('beforebegin',
  `<details class="nav-group" data-group="ps"><summary><span>📂 Problem Sets</span><span class="gdate">${PS_CODE.length} problems</span></summary><a href="#ps" data-page="ps" class="gover"><span class="dot" style="background:linear-gradient(135deg,#60a5fa,#c084fc)"></span>All problem sets</a>` +
  PSETS.map((s, k) => `<a href="#${s.id}" data-page="${s.id}"><span class="dot" style="background:${PS_COLORS[k]}"></span><span class="nnum">PS${s.num}</span><span class="nlabel">${s.covers.replace(/^Topics? /, 'T ')}</span></a>`).join('') + `</details>`);
function psBest(){
  document.querySelectorAll('.ps-best[data-best]').forEach(el => { const v = store.code[el.dataset.best]; el.innerHTML = v == null ? '' : `<span class="pill" style="color:${v >= 90 ? 'var(--good)' : v >= 70 ? 'var(--warn)' : 'var(--bad)'}">best ${v}%</span>`; });
}
function mountPS(){
  document.querySelectorAll('.ps-q[data-q]').forEach(el => {
    const q = PS_CODE.find(x => x.id === el.dataset.q);
    renderQuestion(el, {kind: 'code', topic: q.topic, q}, () => { psBest(); renderHome(); });
    el.querySelector('.submit').addEventListener('click', () => setTimeout(psBest, 0));
  });
  document.getElementById('ps-random').onclick = () => {
    const pool = PS_CODE.filter(q => (store.code[q.id] || 0) < 90), list = pool.length ? pool : PS_CODE;
    const q = list[Math.floor(Math.random() * list.length)];
    location.hash = q.ps; setTimeout(() => document.getElementById('psq-' + q.id).scrollIntoView({behavior: 'smooth', block: 'start'}), 60);
  };
  psBest();
}

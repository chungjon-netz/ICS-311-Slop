// ======================= PSEUDOCODE CHALLENGES & GENERATORS FOR WEEKS 1–11 =======================
COMPOUNDS.push('insertion sort','merge sort','max heapify','build max heap','tree insert','tree search','randomized partition','randomized quicksort','counting sort','lcs length');
const fnBody = (P, n) => { const f = P.funcs.find(f => f.norm === n); return f ? f.body : ''; };

CODE.push(
 {id:'ins-sort', topic:'t02', title:'Insertion sort',
  prompt:'Write <code>INSERTION-SORT(A, n)</code> that sorts A[1..n] <b>in place</b>. Add a comment stating the loop invariant.',
  starter:'INSERTION-SORT(A, n)\n    \n', define:['insertionsort'], call:[], maxLoop:2,
  correctness:[
   {label:'Outer loop over positions 2..n', w:2, test:t=>/\b(for|foreach)\b[^\n]*\b\w+\s*(=|in)\s*(2|1)\b|\bfor\b[^\n]*range\s*\(\s*1/.test(t), hint:'for i = 2 to n'},
   {label:'Saves the current element as key', w:2, test:t=>/\bkey\s*=\s*a\s*\[/.test(t), hint:'key = A[i]'},
   {label:'Inner loop scans left while elements are larger than key', w:2, test:t=>/\bwhile\b[^\n]*>\s*key|\bwhile\b[^\n]*key\s*</.test(t), hint:'while j > 0 and A[j] > key'},
   {label:'Shifts larger elements one position right', w:2, test:t=>/a\s*\[\s*\w+\s*\+\s*1\s*\]\s*=\s*a\s*\[\s*\w+\s*\]/.test(t), hint:'A[j + 1] = A[j]'},
   {label:'Drops key into the gap', w:2, test:t=>/a\s*\[\s*\w+\s*\+\s*1\s*\]\s*=\s*key/.test(t), hint:'A[j + 1] = key'}
  ],
  efficiency:[
   {label:'Sorts in place (no extra array)', w:5, test:t=>!/=\s*(\[\s*\]|new\s|array\s*\(|list\s*\(|copy)/.test(t), hint:'Shift within A: O(1) extra space.'},
   {label:'Inner loop stops as soon as key fits (Θ(n) on sorted input)', w:5, test:t=>/\bwhile\b/.test(t) || /\bbreak\b/.test(t), hint:'Use a while loop that stops at the first element ≤ key.'}
  ],
  penalties:[{label:'Swaps on every step instead of shifting (extra writes)', p:1, test:t=>/\b(swap|exchange)\b/.test(t), hint:'Shift elements and write key once.'}],
  model:`INSERTION-SORT(A, n)
    // invariant: A[1..i-1] is the sorted original prefix
    for i = 2 to n
        key = A[i]
        j = i - 1
        while j > 0 and A[j] > key
            A[j + 1] = A[j]
            j = j - 1
        A[j + 1] = key`},

 {id:'merge-sort', topic:'t07', title:'Merge sort',
  prompt:'Write <code>MERGE-SORT(A, p, r)</code> and a helper <code>MERGE(A, p, q, r)</code> that merges the sorted subarrays A[p..q] and A[q+1..r].',
  starter:'MERGE-SORT(A, p, r)\n    \n\nMERGE(A, p, q, r)\n    \n', define:['mergesort','merge'], call:['merge','mergesort'], maxLoop:1,
  correctness:[
   {label:'Base case: only recurse when p < r', w:2, test:(t,P)=>/\bif\b[^\n]*p\s*<\s*r|\bif\b[^\n]*r\s*>\s*p|\bif\b[^\n]*p\s*>=\s*r[^\n]*return/.test(P.body('mergesort')), hint:'if p < r'},
   {label:'Splits at the midpoint', w:2, test:(t,P)=>/q\s*=\s*[^\n]*p\s*\+\s*r/.test(P.body('mergesort')), hint:'q = ⌊(p + r) / 2⌋'},
   {label:'Two recursive calls on the halves', w:2, test:(t,P)=>(P.body('mergesort').match(/mergesort\s*\(/g)||[]).length>=2, hint:'MERGE-SORT(A, p, q) and MERGE-SORT(A, q + 1, r)'},
   {label:'Calls MERGE to combine', w:1, test:(t,P)=>/\bmerge\s*\(/.test(P.body('mergesort')), hint:'MERGE(A, p, q, r)'},
   {label:'MERGE compares the fronts of the two halves', w:2, test:(t,P)=>/(l|left)\s*\[[^\n]*<=?\s*(r|right)\s*\[|(r|right)\s*\[[^\n]*>=?\s*(l|left)\s*\[/.test(fnBody(P,'merge')), hint:'if L[i] ≤ R[j] then A[k] = L[i] …'},
   {label:'MERGE writes back into A', w:1, test:(t,P)=>/a\s*\[[^\]]*\]\s*=/.test(fnBody(P,'merge')), hint:'A[k] = L[i]'}
  ],
  efficiency:[
   {label:'MERGE is a single linear pass (no nested loops)', w:5, test:(t,P)=>{const f=P.funcs.find(f=>f.norm==='merge'); return f && (f.maxLoop||0)<=1;}, hint:'Each element is moved once: Θ(n).'},
   {label:'Divides in half (Θ(n lg n) total)', w:5, test:(t,P)=>/\/\s*2|floor|\/\/\s*2/.test(P.body('mergesort')), hint:'Split at the midpoint.'}
  ],
  penalties:[{label:'Sorts inside MERGE instead of merging', p:3, test:(t,P)=>/\bsort\s*\(/.test(fnBody(P,'merge')), hint:'MERGE should exploit that the halves are already sorted.'}],
  model:`MERGE-SORT(A, p, r)
    if p < r                       // base case: 0 or 1 element
        q = floor((p + r) / 2)
        MERGE-SORT(A, p, q)
        MERGE-SORT(A, q + 1, r)
        MERGE(A, p, q, r)

MERGE(A, p, q, r)
    L = copy of A[p..q] followed by sentinel ∞
    R = copy of A[q+1..r] followed by sentinel ∞
    i = 1
    j = 1
    for k = p to r
        if L[i] <= R[j]
            A[k] = L[i]
            i = i + 1
        else
            A[k] = R[j]
            j = j + 1`},

 {id:'heapify', topic:'t09', title:'MAX-HEAPIFY and BUILD-MAX-HEAP',
  prompt:'Write <code>MAX-HEAPIFY(A, i)</code> (assume both subtrees of i are max-heaps) and <code>BUILD-MAX-HEAP(A, n)</code> for a 1-indexed array with field <code>A.heap-size</code>.',
  starter:'MAX-HEAPIFY(A, i)\n    \n\nBUILD-MAX-HEAP(A, n)\n    \n', define:['maxheapify','buildmaxheap'], call:['maxheapify'], maxLoop:1,
  correctness:[
   {label:'Computes the children 2i and 2i + 1', w:2, test:(t,P)=>/2\s*\*?\s*i\b/.test(P.body('maxheapify'))||/left\s*\(/.test(P.body('maxheapify')), hint:'l = 2i, r = 2i + 1'},
   {label:'Checks children are within the heap', w:2, test:(t,P)=>/(heapsize|heap-size|heap_size|size|\bn\b)/.test(P.body('maxheapify')) && /<=|</.test(P.body('maxheapify')), hint:'if l ≤ A.heap-size and A[l] > A[i]'},
   {label:'Finds the largest of node and children', w:2, test:(t,P)=>/largest/.test(P.body('maxheapify'))||/max\s*\(/.test(P.body('maxheapify')), hint:'largest = i, then compare with l and r'},
   {label:'Swaps and continues downward', w:2, test:(t,P)=>{const b=P.body('maxheapify');return /(exchange|swap|,\s*a\s*\[[^\n]*=\s*a\s*\[)/.test(b) && (/maxheapify\s*\(/.test(b)||/\bwhile\b/.test(b));}, hint:'exchange A[i] with A[largest]; MAX-HEAPIFY(A, largest)'},
   {label:'BUILD loops from ⌊n/2⌋ down to 1 calling MAX-HEAPIFY', w:2, test:(t,P)=>{const b=P.body('buildmaxheap');return /maxheapify\s*\(/.test(b) && /(downto|down to|-1\s*\)|-\s*1\s*,\s*-1|reversed|step\s*-1)/.test(b);}, hint:'for i = ⌊n/2⌋ downto 1: MAX-HEAPIFY(A, i)'}
  ],
  efficiency:[
   {label:'BUILD skips the leaves (starts at n/2): O(n) total', w:5, test:(t,P)=>/(\/\s*2|\/\/\s*2|floor|half)/.test(P.body('buildmaxheap')), hint:'Leaves are already heaps; start at ⌊n/2⌋.'},
   {label:'MAX-HEAPIFY follows one path: O(lg n)', w:5, test:(t,P)=>{const f=P.fn('maxheapify');return f && (f.maxLoop||0)<=1 && !/\bfor\b/.test(f.body);}, hint:'Only descend into the larger child.'}
  ],
  penalties:[{label:'Builds the heap with a sort or n inserts (O(n lg n))', p:2, test:t=>/\bsort\s*\(|\binsert\s*\(/.test(t), hint:'Bottom-up heapify is O(n).'}],
  model:`MAX-HEAPIFY(A, i)
    l = 2 * i
    r = 2 * i + 1
    largest = i
    if l <= A.heap-size and A[l] > A[largest]
        largest = l
    if r <= A.heap-size and A[r] > A[largest]
        largest = r
    if largest != i
        exchange A[i] with A[largest]
        MAX-HEAPIFY(A, largest)        // float down one level

BUILD-MAX-HEAP(A, n)
    A.heap-size = n
    for i = floor(n / 2) downto 1      // leaves are already heaps
        MAX-HEAPIFY(A, i)`},

 {id:'bst', topic:'t08', title:'BST search and insert',
  prompt:'Write <code>TREE-SEARCH(x, k)</code> and <code>TREE-INSERT(T, z)</code>. Nodes have <code>key</code>, <code>left</code>, <code>right</code>, <code>p</code>; the tree has <code>T.root</code>.',
  starter:'TREE-SEARCH(x, k)\n    \n\nTREE-INSERT(T, z)\n    \n', define:['treesearch','treeinsert'], call:[], maxLoop:1,
  correctness:[
   {label:'SEARCH stops at NIL or a matching key', w:2, test:(t,P)=>/(nil|null|none)/.test(P.body('treesearch')) && /(==|!=)\s*\w*\.?key|key\s*(==|!=)/.test(P.body('treesearch')), hint:'while x ≠ NIL and k ≠ x.key'},
   {label:'SEARCH goes left when k < x.key, else right', w:2, test:(t,P)=>{const b=P.body('treesearch');return /k\s*<\s*\w+\.key|\w+\.key\s*>\s*k/.test(b) && /\.left/.test(b) && /\.right/.test(b);}, hint:'if k < x.key then x = x.left else x = x.right'},
   {label:'INSERT walks down keeping a trailing parent pointer', w:2, test:(t,P)=>/\by\s*=\s*x\b/.test(P.body('treeinsert'))||/\bparent\s*=\s*\w+/.test(P.body('treeinsert')), hint:'y = x before moving x down'},
   {label:'INSERT sets z.p', w:1, test:(t,P)=>/z\.(p|parent)\s*=/.test(P.body('treeinsert')), hint:'z.p = y'},
   {label:'INSERT handles an empty tree', w:1, test:(t,P)=>/root\s*=\s*z/.test(P.body('treeinsert')), hint:'if y == NIL then T.root = z'},
   {label:'INSERT attaches z as a left or right child', w:2, test:(t,P)=>{const b=P.body('treeinsert');return /\.left\s*=\s*z/.test(b) && /\.right\s*=\s*z/.test(b);}, hint:'y.left = z or y.right = z depending on z.key < y.key'}
  ],
  efficiency:[
   {label:'Follows a single root-to-leaf path: O(h)', w:6, test:(t,P)=>P.maxLoop<=1 && !/\b(inorder|preorder|postorder)/.test(t), hint:'Never visit both subtrees.'},
   {label:'No extra data structures', w:4, test:t=>!/=\s*(\[\s*\]|new\s+(list|array|queue|stack))/.test(t) && !/\b(enqueue|push)\s*\(/.test(t), hint:'O(1) extra space.'}
  ],
  penalties:[],
  model:`TREE-SEARCH(x, k)
    while x != NIL and k != x.key
        if k < x.key
            x = x.left
        else
            x = x.right
    return x

TREE-INSERT(T, z)
    y = NIL                 // trailing parent pointer
    x = T.root
    while x != NIL
        y = x
        if z.key < x.key
            x = x.left
        else
            x = x.right
    z.p = y
    if y == NIL
        T.root = z          // tree was empty
    elseif z.key < y.key
        y.left = z
    else
        y.right = z`},

 {id:'rqs', topic:'t05b', title:'Randomized quicksort',
  prompt:'Write <code>PARTITION(A, p, r)</code> (Lomuto, pivot A[r]), <code>RANDOMIZED-PARTITION(A, p, r)</code>, and <code>RANDOMIZED-QUICKSORT(A, p, r)</code>.',
  starter:'PARTITION(A, p, r)\n    \n\nRANDOMIZED-PARTITION(A, p, r)\n    \n\nRANDOMIZED-QUICKSORT(A, p, r)\n    \n', define:['partition','randomizedpartition','randomizedquicksort'], call:['random','partition','randomizedpartition'], maxLoop:1,
  correctness:[
   {label:'PARTITION uses A[r] as the pivot', w:1, test:(t,P)=>/=\s*a\s*\[\s*r\s*\]/.test(fnBody(P,'partition')), hint:'x = A[r]'},
   {label:'PARTITION scans j from p to r − 1 comparing with the pivot', w:2, test:(t,P)=>{const b=fnBody(P,'partition');return /\bfor\b[^\n]*\bp\b[^\n]*r/.test(b) && /a\s*\[\s*j\s*\]\s*<=?\s*\w+/.test(b);}, hint:'for j = p to r − 1: if A[j] ≤ x'},
   {label:'Grows the ≤-pivot region with swaps', w:2, test:(t,P)=>{const b=fnBody(P,'partition');return /i\s*=\s*i\s*\+\s*1|i\s*\+=\s*1|i\+\+/.test(b) && /(exchange|swap)/.test(b);}, hint:'i = i + 1; exchange A[i] with A[j]'},
   {label:'Places the pivot and returns its index', w:2, test:(t,P)=>/\breturn\b/.test(fnBody(P,'partition')) && /i\s*\+\s*1/.test(fnBody(P,'partition')), hint:'exchange A[i + 1] with A[r]; return i + 1'},
   {label:'RANDOMIZED-PARTITION swaps a random element into A[r]', w:2, test:(t,P)=>/random\s*\(/.test(P.body('randomizedpartition')) && /(exchange|swap)/.test(P.body('randomizedpartition')), hint:'i = RANDOM(p, r); exchange A[r] with A[i]'},
   {label:'QUICKSORT recurses on both sides of the pivot', w:1, test:(t,P)=>{const b=P.body('randomizedquicksort');return (b.match(/randomizedquicksort\s*\(/g)||[]).length>=2 && /q\s*-\s*1/.test(b) && /q\s*\+\s*1/.test(b);}, hint:'RANDOMIZED-QUICKSORT(A, p, q − 1) and (A, q + 1, r)'}
  ],
  efficiency:[
   {label:'Random pivot ⇒ expected O(n lg n) on every input', w:4, test:t=>/random\s*\(/.test(t), hint:'Choose the pivot uniformly at random.'},
   {label:'Partitions in place (no new lists)', w:3, test:t=>!/=\s*(\[\s*\]|new\s|list\s*\()/.test(t) && !/\.(append|push)\s*\(/.test(t), hint:'Swap within A instead of building new lists.'},
   {label:'PARTITION is a single linear pass', w:3, test:(t,P)=>{const f=P.funcs.find(f=>f.norm==='partition');return f && (f.maxLoop||0)<=1;}, hint:'Θ(n) per partition.'}
  ],
  penalties:[{label:'Never randomizes the pivot (sorted input costs Θ(n²))', p:3, test:t=>!/random/.test(t), hint:'Pick the pivot with RANDOM(p, r).'}],
  model:`PARTITION(A, p, r)
    x = A[r]                       // pivot
    i = p - 1
    for j = p to r - 1
        if A[j] <= x
            i = i + 1
            exchange A[i] with A[j]
    exchange A[i + 1] with A[r]
    return i + 1

RANDOMIZED-PARTITION(A, p, r)
    i = RANDOM(p, r)
    exchange A[r] with A[i]
    return PARTITION(A, p, r)

RANDOMIZED-QUICKSORT(A, p, r)
    if p < r
        q = RANDOMIZED-PARTITION(A, p, r)
        RANDOMIZED-QUICKSORT(A, p, q - 1)
        RANDOMIZED-QUICKSORT(A, q + 1, r)`},

 {id:'counting', topic:'t10b', title:'Counting sort',
  prompt:'Write <code>COUNTING-SORT(A, B, n, k)</code> that <b>stably</b> sorts A[1..n] (integer keys 0..k) into the output array B.',
  starter:'COUNTING-SORT(A, B, n, k)\n    \n', define:['countingsort'], call:[], maxLoop:1,
  correctness:[
   {label:'Initializes counts C[0..k] to 0', w:2, test:t=>/c\s*\[[^\]]*\]\s*=\s*0|zeros|=\s*\[\s*0\s*\]\s*\*|new array[^\n]*0/.test(t), hint:'C[i] = 0 for i = 0..k'},
   {label:'Counts occurrences of each key', w:2, test:t=>/c\s*\[\s*a\s*\[\s*\w+\s*\]\s*\]\s*(=\s*c\s*\[\s*a\s*\[\s*\w+\s*\]\s*\]\s*\+\s*1|\+=\s*1)/.test(t), hint:'C[A[j]] = C[A[j]] + 1'},
   {label:'Prefix sums: C[i] = number of keys ≤ i', w:2, test:t=>/c\s*\[\s*i\s*\]\s*(=\s*c\s*\[\s*i\s*\]\s*\+|\+=)\s*c\s*\[\s*i\s*-\s*1\s*\]/.test(t), hint:'C[i] = C[i] + C[i − 1]'},
   {label:'Places each element at B[C[A[j]]]', w:2, test:t=>/b\s*\[\s*c\s*\[\s*a\s*\[\s*\w+\s*\]\s*\]\s*\]\s*=\s*a\s*\[/.test(t), hint:'B[C[A[j]]] = A[j]'},
   {label:'Decrements the count after placing', w:2, test:t=>/c\s*\[\s*a\s*\[\s*\w+\s*\]\s*\]\s*(=\s*c\s*\[\s*a\s*\[\s*\w+\s*\]\s*\]\s*-\s*1|-=\s*1)/.test(t), hint:'C[A[j]] = C[A[j]] − 1'}
  ],
  efficiency:[
   {label:'Final pass goes from n down to 1 (stable)', w:4, test:t=>/downto|down to|reversed|step\s*-1|-1\s*,\s*-1/.test(t), hint:'for j = n downto 1 keeps equal keys in order.'},
   {label:'No key comparisons and no nested loops: Θ(n + k)', w:6, test:(t,P)=>P.maxLoop<=1 && !/\bif\b[^\n]*a\s*\[[^\n]*[<>]\s*a\s*\[/.test(t), hint:'Counting sort beats Ω(n lg n) by never comparing keys.'}
  ],
  penalties:[{label:'Calls a comparison sort', p:3, test:t=>/\bsort\s*\(/.test(t), hint:'Use counts, not a comparison sort.'}],
  model:`COUNTING-SORT(A, B, n, k)
    let C[0..k] be a new array
    for i = 0 to k
        C[i] = 0
    for j = 1 to n
        C[A[j]] = C[A[j]] + 1          // count each key
    for i = 1 to k
        C[i] = C[i] + C[i - 1]         // C[i] = number of keys <= i
    for j = n downto 1                 // backwards keeps it stable
        B[C[A[j]]] = A[j]
        C[A[j]] = C[A[j]] - 1`},

 {id:'lcs', topic:'t12b', title:'LCS length (bottom-up DP)',
  prompt:'Write <code>LCS-LENGTH(X, Y, m, n)</code> that returns the length of a longest common subsequence of X[1..m] and Y[1..n] using a bottom-up table c.',
  starter:'LCS-LENGTH(X, Y, m, n)\n    \n', define:['lcslength'], call:[], maxLoop:2,
  correctness:[
   {label:'Base cases: row 0 and column 0 are 0', w:2, test:t=>/c\s*\[\s*(i\s*,\s*0|0\s*,\s*j|i\s*\]\s*\[\s*0|0\s*\]\s*\[\s*j)\s*\]\s*=\s*0|zeros|=\s*\[\s*\[?\s*0/.test(t), hint:'c[i, 0] = 0 and c[0, j] = 0'},
   {label:'Nested loops over i = 1..m and j = 1..n', w:2, test:(t,P)=>P.maxLoop>=2, hint:'for i = 1 to m: for j = 1 to n'},
   {label:'Compares X[i] with Y[j]', w:2, test:t=>/x\s*\[\s*i\s*\]\s*==\s*y\s*\[\s*j\s*\]|y\s*\[\s*j\s*\]\s*==\s*x\s*\[\s*i\s*\]/.test(t), hint:'if X[i] == Y[j]'},
   {label:'Match: c[i, j] = c[i−1, j−1] + 1', w:2, test:t=>/c\s*\[\s*i\s*-\s*1\s*(,|\]\s*\[)\s*j\s*-\s*1\s*\]\s*\+\s*1/.test(t), hint:'diagonal + 1'},
   {label:'Otherwise take the max of top and left', w:2, test:t=>/max\s*\(/.test(t) || (/c\s*\[\s*i\s*-\s*1\s*(,|\]\s*\[)\s*j\s*\]/.test(t) && /c\s*\[\s*i\s*(,|\]\s*\[)\s*j\s*-\s*1\s*\]/.test(t)), hint:'c[i, j] = max(c[i−1, j], c[i, j−1])'}
  ],
  efficiency:[
   {label:'Bottom-up table, no plain recursion: Θ(mn) time', w:6, test:(t,P)=>!/lcslength\s*\(/.test(P.body('lcslength')), hint:'Fill the table iteratively instead of recursing.'},
   {label:'Returns c[m, n] directly', w:4, test:t=>/return\s+c\s*\[\s*m\s*(,|\]\s*\[)\s*n\s*\]|return\s+c\b/.test(t), hint:'return c[m, n]'}
  ],
  penalties:[{label:'Enumerates all subsequences (exponential)', p:4, test:t=>/(all|every)\s+subsequences?|2\s*\^\s*m|powerset/.test(t), hint:'There are 2^m subsequences of X.'}],
  model:`LCS-LENGTH(X, Y, m, n)
    let c[0..m, 0..n] be a new table
    for i = 0 to m
        c[i, 0] = 0
    for j = 0 to n
        c[0, j] = 0
    for i = 1 to m
        for j = 1 to n
            if X[i] == Y[j]
                c[i, j] = c[i - 1, j - 1] + 1     // extend the diagonal
            else
                c[i, j] = max(c[i - 1, j], c[i, j - 1])
    return c[m, n]`},

 {id:'bfs', topic:'t14a', title:'Breadth-first search',
  prompt:'Write <code>BFS(G, s)</code> that computes v.d (distance in edges from s) and v.π for every vertex, using a FIFO queue and adjacency lists <code>G.Adj</code>.',
  starter:'BFS(G, s)\n    \n', define:['bfs'], call:['enqueue|insert|append|push','dequeue|popleft|pop'], maxLoop:2,
  correctness:[
   {label:'Initializes every vertex (d = ∞, π = NIL / unvisited)', w:2, test:t=>/\b(for|foreach)\b[^\n]*(g\.v|vertex|vertices|\bu\b|\bv\b)/.test(t) && /(=\s*inf|white|visited)/.test(t), hint:'for each u ∈ G.V: u.d = ∞, u.π = NIL, u.color = WHITE'},
   {label:'Source gets distance 0 and is enqueued', w:2, test:t=>/s\.d\s*=\s*0|d\s*\[\s*s\s*\]\s*=\s*0|dist\s*\[\s*s\s*\]\s*=\s*0/.test(t) && /(enqueue|append|push|insert)\s*\(\s*\w*\s*,?\s*s\s*\)/.test(t), hint:'s.d = 0; ENQUEUE(Q, s)'},
   {label:'Loops while the queue is not empty, dequeuing u', w:2, test:t=>/\bwhile\b/.test(t) && /(dequeue|popleft|pop)\s*\(/.test(t), hint:'while Q ≠ ∅: u = DEQUEUE(Q)'},
   {label:'Scans u\'s adjacency list', w:2, test:t=>/\b(for|foreach)\b[^\n]*(adj|neighbors?|neighbours?)/.test(t), hint:'for each v ∈ G.Adj[u]'},
   {label:'Sets v.d = u.d + 1 and v.π = u for undiscovered v', w:2, test:t=>/(v\.d|d\s*\[\s*v\s*\]|dist\s*\[\s*v\s*\])\s*=\s*(u\.d|d\s*\[\s*u\s*\]|dist\s*\[\s*u\s*\])\s*\+\s*1/.test(t) && /(v\.pi|pi\s*\[\s*v\s*\]|v\.p\b|parent\s*\[\s*v\s*\]|v\.parent)\s*=\s*u/.test(t), hint:'v.d = u.d + 1; v.π = u'}
  ],
  efficiency:[
   {label:'Marks vertices when discovered so each is enqueued once: O(V + E)', w:6, test:t=>/\bif\b[^\n]*(white|==\s*inf|not\s+visited|!\s*visited|visited\s*\[\s*v\s*\]\s*==\s*false|not\s+in\s+visited)/.test(t), hint:'Only enqueue WHITE (undiscovered) vertices.'},
   {label:'Uses adjacency lists, not a scan of all vertices per dequeue', w:4, test:t=>/(adj|neighbors?|neighbours?)/.test(t), hint:'Scanning G.V for each u makes it O(V²).'}
  ],
  penalties:[{label:'Scans all vertices for each dequeued vertex (O(V²))', p:3, test:(t,P)=>P.lines.some(l=>l.loopDepth>=1 && /\b(for|foreach)\b[^\n]*(g\.v|vertices)/.test(l.t)), hint:'Iterate over G.Adj[u] instead.'}],
  model:`BFS(G, s)
    for each vertex u in G.V
        u.color = WHITE
        u.d = ∞
        u.π = NIL
    s.color = GRAY
    s.d = 0
    Q = ∅
    ENQUEUE(Q, s)
    while Q ≠ ∅
        u = DEQUEUE(Q)
        for each v in G.Adj[u]
            if v.color == WHITE          // first discovery
                v.color = GRAY
                v.d = u.d + 1
                v.π = u
                ENQUEUE(Q, v)
        u.color = BLACK`}
);

// ---- randomized generators ----
function opts4(correct, cands){
  const c = String(correct), out = [];
  for (const x of cands){ const s = String(x); if (s !== c && !out.includes(s)) out.push(s); if (out.length === 3) break; }
  for (let k = 1; out.length < 3 && k < 50; k++){ const d = Math.ceil(k / 2) * (k % 2 ? 1 : -1); const s = isNaN(+c) ? c + "'".repeat(k) : String(+c + d); if (s !== c && !out.includes(s)) out.push(s); }
  return {options: [c, ...out], answer: 0};
}
const SUP = {2:'²', 3:'³', 4:'⁴'};
const npow = e => e === 0 ? '1' : e === 1 ? 'n' : 'n' + (SUP[e] || '^' + e);
GEN.push(
 {topic:'t07', gen(){
   const [a, b] = pick([[1,2],[2,2],[4,2],[8,2],[3,3],[9,3],[2,4],[4,4],[16,4],[3,2],[7,2]]), d = rnd(0, 3);
   const L = Math.log(a) / Math.log(b), Li = Math.abs(L - Math.round(L)) < 1e-9 ? Math.round(L) : null;
   const nL = Li !== null ? npow(Li) : `n^(log${b === 2 ? '₂' : b === 3 ? '₃' : '₄'}${a}) ≈ n^${L.toFixed(2)}`;
   const f = d === 0 ? 'Θ(1)' : `Θ(${npow(d)})`;
   let ans, why;
   if (Li !== null && Li === d){ ans = `Θ(${npow(d)} lg n)`; why = `Case 2: f(n) = Θ(n^log_b a) = ${f}.`; }
   else if (L > d){ ans = `Θ(${nL})`; why = `Case 1: n^(log_b a) = ${nL} grows polynomially faster than f(n) = ${f}.`; }
   else { ans = `Θ(${npow(d)})`; why = `Case 3: f(n) = ${f} dominates n^(log_b a) = ${nL} (and the regularity condition holds).`; }
   const cands = [`Θ(${npow(d)} lg n)`, `Θ(${nL})`, `Θ(${npow(d)})`, `Θ(${npow(d + 1)})`, `Θ(${nL} lg n)`, 'Θ(n lg n)'];
   return {q:`Use the master method to solve <b>T(n) = ${a === 1 ? '' : a}T(n/${b}) + ${f}</b>.`, ...opts4(ans, cands), explain:`n^(log_${b} ${a}) = ${nL}. ${why}`};
 }},
 {topic:'t09', gen(){
   const i = rnd(2, 60), kind = pick(['parent', 'left child', 'right child']);
   const ans = kind === 'parent' ? Math.floor(i / 2) : kind === 'left child' ? 2 * i : 2 * i + 1;
   return {q:`In a 1-indexed binary heap stored in an array, what is the index of the <b>${kind}</b> of index <b>${i}</b>?`, ...opts4(ans, [Math.floor(i / 2), 2 * i, 2 * i + 1, i + 1, Math.ceil(i / 2), 2 * i - 1]), explain:'PARENT(i) = ⌊i/2⌋, LEFT(i) = 2i, RIGHT(i) = 2i + 1.'};
 }},
 {topic:'t06', gen(){
   const m = pick([7, 11, 13]), keys = []; while (keys.length < 5){ const k = rnd(1, 80); if (!keys.includes(k)) keys.push(k); }
   const T = Array(m).fill(null); let slot = 0, probes = 0;
   keys.forEach(k => { let j = k % m, p = 1; while (T[j] !== null){ j = (j + 1) % m; p++; } T[j] = k; slot = j; probes = p; });
   const last = keys[4];
   return {q:`Insert the keys <b>${keys.join(', ')}</b> (in order) into an empty table of size m = ${m} using <b>linear probing</b> with h(k) = k mod ${m}. In which slot does <b>${last}</b> end up?`, ...opts4(slot, [last % m, (slot + 1) % m, (slot + m - 1) % m, (last % m + 2) % m]), explain:`h(${last}) = ${last % m}. ${probes > 1 ? `That slot is taken, so it probes ${probes - 1} more slot(s) and lands in slot ${slot}.` : 'That slot is free.'} Final table: [${T.map(x => x === null ? '–' : x).join(', ')}].`};
 }},
 {topic:'t12b', gen(){
   const s = n => Array.from({length: n}, () => pick(['A', 'B', 'C', 'D'])).join('');
   const X = s(rnd(4, 6)), Y = s(rnd(4, 6)), c = [];
   for (let i = 0; i <= X.length; i++){ c[i] = []; for (let j = 0; j <= Y.length; j++) c[i][j] = i && j ? (X[i - 1] === Y[j - 1] ? c[i - 1][j - 1] + 1 : Math.max(c[i - 1][j], c[i][j - 1])) : 0; }
   const L = c[X.length][Y.length];
   return {q:`What is the length of a longest common subsequence of <b>X = ${X}</b> and <b>Y = ${Y}</b>?`, ...opts4(L, [L + 1, L - 1, L + 2, Math.min(X.length, Y.length)].filter(v => v >= 0)), explain:`Filling the LCS table gives c[${X.length}, ${Y.length}] = ${L}.`};
 }},
 {topic:'t14a', gen(){
   const g = randomGraph(), adj = {}; g.nodes.forEach(n => adj[n.id] = []); g.edges.forEach(e => { adj[e.u].push(e.v); adj[e.v].push(e.u); });
   const s = g.nodes[0].id, d = {[s]: 0}, Q = [s];
   while (Q.length){ const u = Q.shift(); adj[u].sort().forEach(v => { if (d[v] === undefined){ d[v] = d[u] + 1; Q.push(v); } }); }
   const far = Object.keys(d).filter(v => d[v] >= 1); const t = pick(far);
   return {q:`Run <b>BFS from vertex ${s}</b> on this undirected graph (ignore the weights). What is <b>${t}.d</b>, the number of edges on a shortest path from ${s} to ${t}?`, graph: renderGraph(g), ...opts4(d[t], [d[t] + 1, d[t] - 1, d[t] + 2].filter(v => v >= 0)), explain:`BFS layers from ${s}: ${Object.entries(d).sort((a, b) => a[1] - b[1]).map(([v, x]) => `${v}=${x}`).join(', ')}.`};
 }}
);

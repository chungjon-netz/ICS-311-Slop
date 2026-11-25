// ======================= MT1–MT3 LEARNING PATHS: GENERATED UNIT TESTS =======================
// Same format as learn-mt4-gen.js; merged into LEARN_GEN.
Object.assign(LEARN_GEN, {
 adt: [() => ({id: 'learn-minstack', topic: 't01', title: 'Stack that remembers its minimum',
  prompt: `A ${lgPick(['text editor\'s undo stack', 'stock-price tracker', 'browser history'])} needs PUSH, POP and MIN, all in <b>O(1)</b>. Modify the array stack to keep a second stack M of running minimums (memory): M's top is always the minimum of S. Write <code>PUSH(S, M, x)</code>, <code>POP(S, M)</code> and <code>MIN(M)</code>, with underflow checks.`,
  starter: 'PUSH(S, M, x)\n    \n\nPOP(S, M)\n    \n\nMIN(M)\n    \n', define: ['push', 'pop', 'min'], call: [], maxLoop: 0,
  correctness: [
   {label: 'PUSH stores x on S', w: 2, test: lgIn('push', /s\s*\[[^\]]*\]\s*=\s*x|push[^\n]*\bs\b[^\n]*x/), hint: 'S.top = S.top + 1; S[S.top] = x'},
   {label: 'PUSH stores min(x, current minimum) on M', w: 3, test: lgIn('push', /min\s*\(|<\s*m\s*\[|x\s*<=?/), hint: 'M[top] = min(x, M[top − 1]) (or x if empty)'},
   {label: 'POP checks for underflow', w: 2, test: lgIn('pop', /underflow|empty|==\s*0/), hint: 'if S.top == 0 error "underflow"'},
   {label: 'POP removes from both stacks', w: 2, test: lgIn('pop', /top\s*=\s*\w+\.top\s*-\s*1|top\s*-=\s*1|top--/), hint: 'S.top = S.top − 1 (M shares the same top)'},
   {label: 'MIN returns the top of M', w: 2, test: lgIn('min', /return[^\n]*m\s*\[/), hint: 'return M[M.top]'}],
  efficiency: [{label: 'Every operation is O(1): no loops', w: 10, test: (t, P) => P.maxLoop === 0, hint: 'Never scan the stack to find the minimum.'}],
  model: `PUSH(S, M, x)                 // O(1); M[i] = min of S[1..i]
    S.top = S.top + 1
    S[S.top] = x
    if S.top == 1
        M[S.top] = x
    else M[S.top] = min(x, M[S.top - 1])

POP(S, M)                     // O(1)
    if S.top == 0
        error "underflow"
    S.top = S.top - 1         // M shares the same top index
    return S[S.top + 1]

MIN(M)                        // O(1): the memory pays off
    if S.top == 0
        error "underflow"
    return M[S.top]`})],
 growth: [() => ({id: 'learn-fastpow', topic: 't03', title: 'Fast exponentiation: Θ(n) down to Θ(lg n)',
  prompt: `Computing x^n by multiplying n times is Θ(n). Make it run in <b>Θ(lg n)</b> multiplications by repeated squaring: x^n = (x^(n/2))² for even n and x · x^(n−1) for odd n. Write <code>FAST-POWER(x, n)</code> (recursive) and state its recurrence in a comment.`,
  starter: 'FAST-POWER(x, n)\n    \n', define: ['fastpower'], call: ['fast-power|fastpower'], maxLoop: 1,
  correctness: [
   {label: 'Base case n = 0 returns 1', w: 2, test: lgRx(/n\s*==\s*0[\s\S]{0,40}return\s+1/), hint: 'if n == 0 return 1'},
   {label: 'Recurses on n / 2', w: 3, test: lgRx(/fast-?power\s*\(\s*x\s*,\s*(n\s*\/\s*2|⌊n\s*\/\s*2⌋|n\s*div\s*2|n\s*\/\/\s*2)/), hint: 'h = FAST-POWER(x, ⌊n/2⌋)'},
   {label: 'Squares the half result', w: 3, test: lgRx(/(\w+)\s*\*\s*\1\b|\^\s*2|\*\*\s*2/), hint: 'return h * h'},
   {label: 'Handles odd n with one extra x', w: 2, test: lgRx(/mod\s*2|%\s*2|odd|even/), hint: 'if n is odd return x * h * h'}],
  efficiency: [{label: 'One recursive call per level: T(n) = T(n/2) + Θ(1) = Θ(lg n)', w: 10, test: (t, P) => (P.body('fastpower').match(/fast-?power\s*\(/g) || []).length === 1, hint: 'Store the half result instead of calling twice (two calls give Θ(n)).'}],
  model: `FAST-POWER(x, n)               // T(n) = T(n/2) + Θ(1) = Θ(lg n)
    if n == 0
        return 1
    h = FAST-POWER(x, ⌊n / 2⌋)     // one call, result remembered
    if n mod 2 == 0
        return h * h
    return x * h * h`})],
 correct: [() => ({id: 'learn-binary-insertion', topic: 't02', title: 'Insertion sort with binary search for the slot',
  prompt: `Modify INSERTION-SORT so it finds the insertion point of key with <b>binary search</b> on the sorted prefix A[1..i−1] (Θ(lg i) comparisons) instead of scanning. Shifting still costs Θ(i), so state both counts in comments. Write <code>BINARY-INSERTION-SORT(A, n)</code> and <code>FIND-SLOT(A, lo, hi, key)</code>; keep it <b>stable</b> (insert after equal keys).`,
  starter: 'BINARY-INSERTION-SORT(A, n)\n    \n\nFIND-SLOT(A, lo, hi, key)\n    \n', define: ['binaryinsertionsort', 'findslot'], call: ['find-slot'], maxLoop: 2,
  correctness: [
   {label: 'Outer loop i = 2 to n with key = A[i]', w: 2, test: t => /for\s+i\s*=\s*2/.test(t) && /key\s*=\s*a\s*\[\s*i\s*\]/.test(t), hint: 'for i = 2 to n: key = A[i]'},
   {label: 'Finds the slot with FIND-SLOT on A[1..i−1]', w: 2, test: lgRx(/find-?slot\s*\(/), hint: 'pos = FIND-SLOT(A, 1, i − 1, key)'},
   {label: 'FIND-SLOT halves the range', w: 3, test: lgIn('findslot', /mid\s*=|\/\s*2/), hint: 'mid = ⌊(lo + hi)/2⌋'},
   {label: 'Stable: equal keys go to the right (<= moves lo up)', w: 1, test: lgIn('findslot', /<=\s*key|key\s*>=|>\s*key/), hint: 'if A[mid] ≤ key: lo = mid + 1'},
   {label: 'Shifts A[pos..i−1] right and drops key in', w: 2, test: t => /a\s*\[\s*\w+\s*\+\s*1\s*\]\s*=\s*a\s*\[\s*\w+\s*\]/.test(t) && /=\s*key/.test(t), hint: 'A[j + 1] = A[j] for j = i − 1 downto pos; A[pos] = key'}],
  efficiency: [{label: 'Binary search: O(lg i) comparisons per key', w: 5, test: lgIn('findslot', /while|find-?slot\s*\(/), hint: 'Halve lo..hi until it is empty.'},
   {label: 'At most two nested loops', w: 5, test: (t, P) => P.maxLoop <= 2, hint: 'Outer loop + shift loop.'}],
  model: `BINARY-INSERTION-SORT(A, n)     // Θ(n lg n) comparisons, still Θ(n²) shifts
    for i = 2 to n
        key = A[i]
        pos = FIND-SLOT(A, 1, i - 1, key)
        for j = i - 1 downto pos      // shift A[pos..i-1] right
            A[j + 1] = A[j]
        A[pos] = key

FIND-SLOT(A, lo, hi, key)          // first index whose value > key (stable)
    while lo <= hi
        mid = ⌊(lo + hi) / 2⌋
        if A[mid] <= key
            lo = mid + 1
        else hi = mid - 1
    return lo`})],
 dc: [() => ({id: 'learn-merge-cutoff', topic: 't07', title: 'Merge sort that skips sorted merges and uses insertion sort on small pieces',
  prompt: `Make merge sort run smoother on ${lgPick(['nearly sorted logs', 'sensor readings that are mostly in order', 'a leaderboard that changes a little each day'])}: (1) for subarrays of size ≤ ${lgPick([8, 16, 32])} call INSERTION-SORT instead of recursing, and (2) skip MERGE entirely when A[q] ≤ A[q + 1] (the halves are already in order). Write <code>HYBRID-MERGE-SORT(A, p, r)</code>; assume MERGE and INSERTION-SORT(A, p, r) exist.`,
  starter: 'HYBRID-MERGE-SORT(A, p, r)\n    \n', define: ['hybridmergesort'], call: ['merge', 'insertion-sort|insertionsort', 'hybrid-merge-sort'], maxLoop: 0,
  correctness: [
   {label: 'Small subarrays go to insertion sort', w: 3, test: lgRx(/r\s*-\s*p[^\n]*<=?\s*\d+[\s\S]{0,60}insertion-?sort\s*\(/), hint: 'if r − p + 1 ≤ 16: INSERTION-SORT(A, p, r); return'},
   {label: 'Splits at the midpoint', w: 2, test: lgRx(/q\s*=\s*⌊?\s*\(\s*p\s*\+\s*r\s*\)\s*\/\s*2/), hint: 'q = ⌊(p + r)/2⌋'},
   {label: 'Recurses on both halves', w: 2, test: (t, P) => (P.body('hybridmergesort').match(/hybrid-?merge-?sort\s*\(/g) || []).length >= 2, hint: 'HYBRID-MERGE-SORT(A, p, q); HYBRID-MERGE-SORT(A, q + 1, r)'},
   {label: 'Skips MERGE when A[q] ≤ A[q + 1]', w: 3, test: lgRx(/a\s*\[\s*q\s*\]\s*(<=|>)\s*a\s*\[\s*q\s*\+\s*1\s*\]/), hint: 'if A[q] > A[q + 1]: MERGE(A, p, q, r)'}],
  efficiency: [{label: 'Still Θ(n lg n) worst case (one merge per level)', w: 5, test: lgRx(/\bmerge\s*\(/), hint: 'MERGE when needed.'},
   {label: 'Θ(n) on already sorted input thanks to the skip test', w: 5, test: lgRx(/a\s*\[\s*q\s*\]\s*(<=|>)/), hint: 'Sorted halves need no merge.'}],
  model: `HYBRID-MERGE-SORT(A, p, r)        // Θ(n lg n) worst, Θ(n) on sorted input
    if r - p + 1 <= 16
        INSERTION-SORT(A, p, r)        // small pieces: lower overhead
        return
    q = ⌊(p + r) / 2⌋
    HYBRID-MERGE-SORT(A, p, q)
    HYBRID-MERGE-SORT(A, q + 1, r)
    if A[q] > A[q + 1]                 // halves not already in order
        MERGE(A, p, q, r)`})],
 heap: [() => ({id: 'learn-kth-largest-heap', topic: 't09', title: 'k-th largest in a stream with a size-k min-heap',
  prompt: `${lgPick(['A leaderboard', 'A trending-topics service', 'A stock screener'])} sees n values one at a time and must report the k-th largest. Keeping all n values is too much memory: keep a <b>min-heap of size k</b> holding the k largest seen so far. Write <code>KTH-LARGEST(A, n, k)</code> that returns it in O(n lg k), using MIN-HEAP-INSERT, HEAP-MINIMUM and HEAP-EXTRACT-MIN.`,
  starter: 'KTH-LARGEST(A, n, k)\n    \n', define: ['kthlargest'], call: ['insert', 'minimum', 'extractmin'], maxLoop: 1,
  correctness: [
   {label: 'Starts with an empty min-heap', w: 1, test: lgRx(/=\s*(empty|new|\{\s*\}|\[\s*\])/), hint: 'H = empty min-heap'},
   {label: 'Inserts while the heap has fewer than k items', w: 2, test: lgRx(/<\s*k[\s\S]{0,80}insert/), hint: 'if H.size < k: MIN-HEAP-INSERT(H, A[i])'},
   {label: 'Replaces the minimum when a larger value arrives', w: 3, test: t => /minimum\s*\(/.test(t) && /extractmin\s*\(/.test(t), hint: 'elif A[i] > HEAP-MINIMUM(H): HEAP-EXTRACT-MIN(H); MIN-HEAP-INSERT(H, A[i])'},
   {label: 'Returns the heap minimum', w: 2, test: lgRx(/return[^\n]*minimum/), hint: 'return HEAP-MINIMUM(H)'}],
  efficiency: [{label: 'Heap never exceeds k: O(n lg k) time, O(k) memory', w: 6, test: lgRx(/<\s*k/), hint: 'Do not insert all n values.'},
   {label: 'No full sort', w: 4, test: t => !/\bsort/.test(t), hint: 'Sorting is Θ(n lg n).'}],
  model: `KTH-LARGEST(A, n, k)            // O(n lg k) time, O(k) memory
    H = empty min-heap             // holds the k largest seen so far
    for i = 1 to n
        if H.size < k
            MIN-HEAP-INSERT(H, A[i])
        else if A[i] > HEAP-MINIMUM(H)
            HEAP-EXTRACT-MIN(H)
            MIN-HEAP-INSERT(H, A[i])
    return HEAP-MINIMUM(H)         // smallest of the k largest`})],
 bst: [() => ({id: 'learn-bst-size', topic: 't08', title: 'BST that remembers subtree sizes: k-th smallest in O(h)',
  prompt: `Augment a BST so each node stores x.size, the number of nodes in its subtree. Modify TREE-INSERT to update sizes on the way down, and use the sizes to find the <b>k-th smallest</b> key in O(h) instead of an O(n) inorder walk. Write <code>SIZE-INSERT(T, z)</code> and <code>KTH-SMALLEST(x, k)</code>.`,
  starter: 'SIZE-INSERT(T, z)\n    \n\nKTH-SMALLEST(x, k)\n    \n', define: ['sizeinsert', 'kthsmallest'], call: ['kth-smallest'], maxLoop: 1,
  correctness: [
   {label: 'New node starts with size 1', w: 1, test: lgRx(/z\.size\s*=\s*1/), hint: 'z.size = 1'},
   {label: 'Increments size on every node passed', w: 3, test: lgIn('sizeinsert', /size\s*=\s*\w+\.size\s*\+\s*1|size\s*\+=\s*1|size\+\+/), hint: 'x.size = x.size + 1 while walking down'},
   {label: 'Insert walks down by key and attaches z', w: 2, test: (t, P) => /<\s*\w+\.key/.test(P.body('sizeinsert')) && /\.(left|right)\s*=\s*z/.test(P.body('sizeinsert')), hint: 'standard TREE-INSERT walk'},
   {label: 'Rank of x is left size + 1', w: 2, test: lgIn('kthsmallest', /\.left\.size\s*\+\s*1|size\s*\(\s*x\.left\s*\)\s*\+\s*1/), hint: 'r = x.left.size + 1 (0 if NIL)'},
   {label: 'Goes left, returns x, or goes right with k − r', w: 3, test: lgIn('kthsmallest', /k\s*-\s*r/), hint: 'if k < r go left; if k == r return x; else KTH-SMALLEST(x.right, k − r)'}],
  efficiency: [{label: 'O(h): one root-to-leaf path, no inorder walk', w: 10, test: (t, P) => !/inorder/.test(t) && (P.fn('kthsmallest') || {}).maxLoop !== 2, hint: 'Use the stored sizes.'}],
  model: `SIZE-INSERT(T, z)                 // O(h); keeps x.size correct
    z.size = 1
    y = NIL
    x = T.root
    while x != NIL
        x.size = x.size + 1          // z will be in x's subtree
        y = x
        if z.key < x.key
            x = x.left
        else x = x.right
    z.p = y
    if y == NIL
        T.root = z
    else if z.key < y.key
        y.left = z
    else y.right = z

KTH-SMALLEST(x, k)                // O(h) using the size memory
    r = SIZE(x.left) + 1             // rank of x in its subtree
    if k == r
        return x
    if k < r
        return KTH-SMALLEST(x.left, k)
    return KTH-SMALLEST(x.right, k - r)`})],
 rbt: [() => ({id: 'learn-rb-range', topic: 't11', title: 'Range count in a balanced tree in O(lg n + m)',
  prompt: `A ${lgPick(['calendar app', 'price-range filter', 'IP allow-list'])} stores keys in a red-black tree (height ≤ 2 lg(n + 1)). Modify the inorder walk to <b>prune</b> subtrees that cannot contain keys in [lo, hi], so listing the m keys in range costs O(lg n + m) instead of Θ(n). Write <code>RANGE-REPORT(x, lo, hi)</code>.`,
  starter: 'RANGE-REPORT(x, lo, hi)\n    \n', define: ['rangereport'], call: ['range-report'], maxLoop: 0,
  correctness: [
   {label: 'Stops at NIL', w: 2, test: lgRx(/if\s+x\s*==\s*(nil|t\.nil)|x\s*!=\s*(nil|t\.nil)/), hint: 'if x == T.nil return'},
   {label: 'Goes left only if lo < x.key', w: 3, test: lgRx(/lo\s*<\s*x\.key|x\.key\s*>\s*lo/), hint: 'if lo < x.key: RANGE-REPORT(x.left, lo, hi)'},
   {label: 'Reports x when lo ≤ x.key ≤ hi', w: 3, test: lgRx(/lo\s*<=\s*x\.key[\s\S]{0,40}hi|x\.key\s*>=\s*lo/), hint: 'if lo ≤ x.key ≤ hi: print x.key'},
   {label: 'Goes right only if x.key < hi', w: 2, test: lgRx(/x\.key\s*<\s*hi|hi\s*>\s*x\.key/), hint: 'if x.key < hi: RANGE-REPORT(x.right, lo, hi)'}],
  efficiency: [{label: 'Prunes both sides (O(lg n + m))', w: 10, test: t => /lo\s*<\s*x\.key|x\.key\s*>\s*lo/.test(t) && /x\.key\s*<\s*hi|hi\s*>\s*x\.key/.test(t), hint: 'Never visit a subtree that is entirely out of range.'}],
  model: `RANGE-REPORT(x, lo, hi)           // inorder walk with pruning: O(lg n + m)
    if x == T.nil
        return
    if lo < x.key                    // left subtree may hold keys ≥ lo
        RANGE-REPORT(x.left, lo, hi)
    if lo <= x.key and x.key <= hi
        print x.key
    if x.key < hi                    // right subtree may hold keys ≤ hi
        RANGE-REPORT(x.right, lo, hi)`})],
 prob: [() => ({id: 'learn-reservoir', topic: 't05a', title: 'Reservoir sampling: a uniform pick with O(1) memory',
  prompt: `A ${lgPick(['log stream', 'stream of tweets', 'sensor feed'])} is too long to store, but we want <b>one item chosen uniformly at random</b>. Modify the hiring-style scan: keep one candidate and replace it with item i with probability 1/i. Write <code>RESERVOIR-PICK(A, n)</code> using RANDOM(1, i), and in a comment state why each item ends up chosen with probability 1/n.`,
  starter: 'RESERVOIR-PICK(A, n)\n    \n', define: ['reservoirpick'], call: ['random'], maxLoop: 1,
  correctness: [
   {label: 'Starts with the first item', w: 2, test: lgRx(/=\s*a\s*\[\s*1\s*\]/), hint: 'pick = A[1]'},
   {label: 'Scans items 2..n once', w: 2, test: lgRx(/for\s+i\s*=\s*2\s+to\s+n/), hint: 'for i = 2 to n'},
   {label: 'Replaces with probability 1/i', w: 4, test: lgRx(/random\s*\(\s*1\s*,\s*i\s*\)\s*==\s*1|random\s*\(\s*1\s*,\s*i\s*\)\s*==\s*i/), hint: 'if RANDOM(1, i) == 1: pick = A[i]'},
   {label: 'Returns the pick', w: 1, test: lgRx(/return\s+\w+/), hint: 'return pick'},
   {label: 'Comment explains the 1/n argument', w: 1, test: (t, P) => /1\s*\/\s*n|1\/n/.test(P.src), hint: 'Pr = (1/i) · Π (1 − 1/j) for j > i = 1/n'}],
  efficiency: [{label: 'One pass, O(1) extra memory', w: 10, test: (t, P) => P.maxLoop <= 1 && !/new\s+array|copy/.test(t), hint: 'Never store the stream.'}],
  model: `RESERVOIR-PICK(A, n)              // one pass, O(1) memory
    pick = A[1]
    for i = 2 to n
        if RANDOM(1, i) == 1          // probability 1/i
            pick = A[i]
    return pick
    // item i survives with (1/i)·(i/(i+1))·…·((n−1)/n) = 1/n`})],
 qsort: [() => ({id: 'learn-qsort-tail', topic: 't05b', title: 'Quicksort with O(lg n) stack: recurse on the smaller side',
  prompt: `Deterministic or not, quicksort's recursion can be n levels deep on bad splits, ${lgPick(['blowing the call stack on an embedded system', 'crashing on adversarial input', 'wasting memory on huge arrays'])}. Modify RANDOMIZED-QUICKSORT to <b>recurse only on the smaller side</b> and loop on the larger side, so the stack depth is O(lg n) worst case. Write <code>SMALL-STACK-QUICKSORT(A, p, r)</code>; assume RANDOMIZED-PARTITION exists.`,
  starter: 'SMALL-STACK-QUICKSORT(A, p, r)\n    \n', define: ['smallstackquicksort'], call: ['randomized-partition|partition', 'small-stack-quicksort'], maxLoop: 1,
  correctness: [
   {label: 'Loops while the range has 2+ elements', w: 2, test: lgRx(/while\s+p\s*<\s*r/), hint: 'while p < r'},
   {label: 'Partitions with a random pivot', w: 2, test: lgRx(/partition\s*\(/), hint: 'q = RANDOMIZED-PARTITION(A, p, r)'},
   {label: 'Compares the two side sizes', w: 2, test: lgRx(/q\s*-\s*p\s*<|r\s*-\s*q\s*>|<\s*r\s*-\s*q/), hint: 'if q − p < r − q'},
   {label: 'Recurses on the smaller side', w: 2, test: (t, P) => (P.body('smallstackquicksort').match(/small-?stack-?quicksort\s*\(/g) || []).length >= 1, hint: 'SMALL-STACK-QUICKSORT(A, p, q − 1)'},
   {label: 'Continues the loop on the larger side', w: 2, test: lgRx(/p\s*=\s*q\s*\+\s*1|r\s*=\s*q\s*-\s*1/), hint: 'p = q + 1 (or r = q − 1)'}],
  efficiency: [{label: 'Only the smaller side uses recursion ⇒ O(lg n) stack', w: 10, test: t => /p\s*=\s*q\s*\+\s*1/.test(t) && /r\s*=\s*q\s*-\s*1/.test(t), hint: 'Update p or r instead of a second recursive call.'}],
  model: `SMALL-STACK-QUICKSORT(A, p, r)     // expected Θ(n lg n), stack O(lg n)
    while p < r
        q = RANDOMIZED-PARTITION(A, p, r)
        if q - p < r - q                   // left side is smaller
            SMALL-STACK-QUICKSORT(A, p, q - 1)
            p = q + 1                      // loop on the larger right side
        else
            SMALL-STACK-QUICKSORT(A, q + 1, r)
            r = q - 1                      // loop on the larger left side`})],
 hash: [() => ({id: 'learn-hash-resize', topic: 't06', title: 'Chained hash table that doubles to keep α ≤ 1',
  prompt: `A ${lgPick(['username directory', 'cache of web pages', 'symbol table in a compiler'])} keeps growing, so α = n/m creeps up and searches slow down. Modify chained HASH-INSERT to <b>double m and rehash every key</b> when α would exceed 1, keeping searches Θ(1 + α) = O(1) and inserts O(1) amortized. Write <code>INSERT-RESIZE(T, k)</code> and <code>REHASH(T)</code>; assume h(k, m) and LIST-PREPEND exist.`,
  starter: 'INSERT-RESIZE(T, k)\n    \n\nREHASH(T)\n    \n', define: ['insertresize', 'rehash'], call: ['rehash', 'list-prepend|prepend'], maxLoop: 2,
  correctness: [
   {label: 'Checks the load factor before inserting', w: 2, test: lgIn('insertresize', /t\.n\s*(\+\s*1\s*)?>\s*t\.m|n\s*\/\s*m|alpha|α/), hint: 'if T.n + 1 > T.m: REHASH(T)'},
   {label: 'Prepends the key to its chain', w: 2, test: lgRx(/prepend\s*\(/), hint: 'LIST-PREPEND(T[h(k, T.m)], k)'},
   {label: 'Updates the key count', w: 1, test: lgRx(/t\.n\s*=\s*t\.n\s*\+\s*1|t\.n\s*\+=\s*1/), hint: 'T.n = T.n + 1'},
   {label: 'REHASH allocates a table of size 2m', w: 2, test: lgIn('rehash', /2\s*\*\s*t\.m|2\s*t\.m|t\.m\s*\*\s*2/), hint: 'new table with 2·T.m empty chains'},
   {label: 'REHASH reinserts every key with the new m', w: 3, test: lgIn('rehash', /for[\s\S]*for[\s\S]*h\s*\(/), hint: 'for each slot, for each key: prepend into new slot h(key, 2m)'}],
  efficiency: [{label: 'Doubling (not +1) gives O(1) amortized inserts', w: 6, test: lgIn('rehash', /2\s*\*|\*\s*2/), hint: 'Growing by a constant amount gives Θ(n) amortized.'},
   {label: 'Rehashing is Θ(n + m), done rarely', w: 4, test: (t, P) => P.maxLoop <= 2, hint: 'One pass over the old table.'}],
  model: `INSERT-RESIZE(T, k)              // O(1) amortized; keeps α ≤ 1
    if T.n + 1 > T.m
        REHASH(T)
    LIST-PREPEND(T[h(k, T.m)], k)
    T.n = T.n + 1

REHASH(T)                        // Θ(n + m), but only when m doubles
    old = T.table
    oldm = T.m
    T.m = 2 * T.m
    T.table = new array of T.m empty lists
    for j = 0 to oldm - 1
        for each key x in old[j]
            LIST-PREPEND(T[h(x, T.m)], x)`})],
 select: [() => ({id: 'learn-iter-select', topic: 't10a', title: 'Iterative RANDOMIZED-SELECT with O(1) extra space',
  prompt: `Quickselect recurses into only one side, so the recursion is a tail call. Modify RANDOMIZED-SELECT into a <b>loop</b> that narrows [p, r] and adjusts the rank, using O(1) extra space. Write <code>ITERATIVE-SELECT(A, p, r, i)</code> that returns the i-th smallest of A[p..r] in expected Θ(n); assume RANDOMIZED-PARTITION exists.`,
  starter: 'ITERATIVE-SELECT(A, p, r, i)\n    \n', define: ['iterativeselect'], call: ['randomized-partition|partition'], maxLoop: 1,
  correctness: [
   {label: 'Loops until one element remains', w: 2, test: lgRx(/while\s+p\s*<\s*r|while\s+true|loop/), hint: 'while p < r'},
   {label: 'Partitions and computes the pivot rank k = q − p + 1', w: 3, test: t => /partition\s*\(/.test(t) && /k\s*=\s*q\s*-\s*p\s*\+\s*1/.test(t), hint: 'q = RANDOMIZED-PARTITION(A, p, r); k = q − p + 1'},
   {label: 'Returns the pivot when i == k', w: 2, test: lgRx(/i\s*==\s*k[\s\S]{0,30}return\s+a\s*\[\s*q\s*\]/), hint: 'if i == k return A[q]'},
   {label: 'Narrows left with r = q − 1', w: 1, test: lgRx(/r\s*=\s*q\s*-\s*1/), hint: 'if i < k: r = q − 1'},
   {label: 'Narrows right with p = q + 1 and i = i − k', w: 2, test: t => /p\s*=\s*q\s*\+\s*1/.test(t) && /i\s*=\s*i\s*-\s*k/.test(t), hint: 'else: p = q + 1; i = i − k'}],
  efficiency: [{label: 'No recursion: O(1) extra space', w: 6, test: lgNoSelfCall('iterativeselect', 'iterative-?select'), hint: 'Replace the tail call by updating p, r, i.'},
   {label: 'One side per round ⇒ expected Θ(n)', w: 4, test: (t, P) => P.maxLoop <= 1, hint: 'A single loop.'}],
  model: `ITERATIVE-SELECT(A, p, r, i)      // expected Θ(n), O(1) extra space
    while p < r
        q = RANDOMIZED-PARTITION(A, p, r)
        k = q - p + 1                    // rank of the pivot in A[p..r]
        if i == k
            return A[q]
        if i < k
            r = q - 1                    // answer is on the left
        else
            p = q + 1                    // answer is on the right
            i = i - k                    // adjust the rank
    return A[p]`})],
 linsort: [() => { const k = lgPick([9, 99, 255]); return {id: 'learn-counting-neg', topic: 't10b', title: 'Counting sort for keys in a range [lo, hi]',
  prompt: `Readings from ${lgPick(['a thermometer (−40..' + k + ')', 'an exam with negative scores allowed', 'elevation data including below sea level'])} are integers in [lo, hi], possibly negative, with hi − lo = O(n). Modify COUNTING-SORT to <b>offset</b> every key by lo so the count array is C[0..hi − lo]. Keep it stable and Θ(n + (hi − lo)). Write <code>RANGE-COUNTING-SORT(A, B, n, lo, hi)</code>.`,
  starter: 'RANGE-COUNTING-SORT(A, B, n, lo, hi)\n    \n', define: ['rangecountingsort'], call: [], maxLoop: 1,
  correctness: [
   {label: 'Count array sized hi − lo + 1, all zeros', w: 2, test: lgRx(/hi\s*-\s*lo/), hint: 'let C[0..hi − lo] be zeros'},
   {label: 'Counts with the offset A[j] − lo', w: 3, test: lgRx(/c\s*\[\s*a\s*\[\s*j\s*\]\s*-\s*lo\s*\][^\n]*\+\s*1|c\s*\[\s*a\s*\[\s*j\s*\]\s*-\s*lo\s*\]\s*\+=/), hint: 'C[A[j] − lo] = C[A[j] − lo] + 1'},
   {label: 'Turns counts into prefix sums', w: 2, test: lgRx(/c\s*\[\s*\w+\s*\]\s*=\s*c\s*\[\s*\w+\s*\]\s*\+\s*c\s*\[\s*\w+\s*-\s*1\s*\]/), hint: 'C[v] = C[v] + C[v − 1]'},
   {label: 'Places elements from j = n down to 1', w: 2, test: lgRx(/for\s+j\s*=\s*n\s+downto\s+1/), hint: 'for j = n downto 1 (stable)'},
   {label: 'Writes B[C[A[j] − lo]] and decrements', w: 1, test: lgRx(/b\s*\[\s*c\s*\[\s*a\s*\[\s*j\s*\]\s*-\s*lo\s*\]\s*\]\s*=/), hint: 'B[C[A[j] − lo]] = A[j]; C[A[j] − lo]−−'}],
  efficiency: [{label: 'No comparisons between keys: Θ(n + (hi − lo))', w: 6, test: t => !/(^|[^-\w])sort\s*\(|if[^\n]*a\s*\[\s*\w+\s*\]\s*[<>]/.test(t), hint: 'Index by value instead of comparing.'},
   {label: 'Only single loops', w: 4, test: (t, P) => P.maxLoop <= 1, hint: 'Count, prefix-sum, place.'}],
  model: `RANGE-COUNTING-SORT(A, B, n, lo, hi)   // stable, Θ(n + (hi − lo))
    let C[0..hi - lo] be a new array of zeros
    for j = 1 to n
        C[A[j] - lo] = C[A[j] - lo] + 1        // offset makes indices ≥ 0
    for v = 1 to hi - lo
        C[v] = C[v] + C[v - 1]                 // number of keys ≤ v + lo
    for j = n downto 1                         // backwards keeps it stable
        B[C[A[j] - lo]] = A[j]
        C[A[j] - lo] = C[A[j] - lo] - 1`}; }],
 backtrack: [() => { const T = lgPick([10, 15, 21]); return {id: 'learn-subset-memo', topic: 't12s', title: 'Subset sum with pruning and a memo',
  prompt: `For ${lgPick(['packing a ' + T + '-minute playlist', 'choosing coins worth ' + T + ' cents', 'filling a ' + T + '-kg truck'])}, the plain backtracking SUBSET-SUM is O(2ⁿ). Make it smarter: (1) <b>prune</b> when T &lt; 0, and (2) <b>memoize</b> each (i, T) state the first time it is solved, so the time becomes O(nT). Write <code>SUBSET-SUM-MEMO(X, n, T)</code> and the recursive helper <code>SS(X, i, T)</code>.`,
  starter: 'SUBSET-SUM-MEMO(X, n, T)\n    \n\nSS(X, i, T)\n    \n', define: ['subsetsummemo', 'ss'], call: ['ss'], maxLoop: 1,
  correctness: [
   {label: 'Base case T == 0 is TRUE', w: 2, test: lgRx(/t\s*==\s*0[\s\S]{0,30}return\s+true/), hint: 'if T == 0 return TRUE'},
   {label: 'Prunes T < 0 or no items left', w: 2, test: lgRx(/t\s*<\s*0|i\s*>\s*n/), hint: 'if T < 0 or i > n return FALSE'},
   {label: 'Reuses a stored answer', w: 2, test: lgIn('ss', /memo\s*\[[^\]]*\]\s*!=|if[^\n]*memo/), hint: 'if memo[i, T] ≠ NIL return memo[i, T]'},
   {label: 'Tries excluding and including X[i]', w: 3, test: lgIn('ss', /ss\s*\([^)]*i\s*\+\s*1[^)]*-\s*x\s*\[/), hint: 'SS(X, i + 1, T) or SS(X, i + 1, T − X[i])'},
   {label: 'Stores the answer before returning', w: 1, test: lgIn('ss', /memo\s*\[[^\]]*\]\s*=/), hint: 'memo[i, T] = result'}],
  efficiency: [{label: 'Memo makes it O(nT) instead of O(2ⁿ)', w: 7, test: lgRx(/memo/), hint: 'Each (i, T) is solved once.'},
   {label: 'Memo is cleared once, not per call', w: 3, test: lgIn('subsetsummemo', /memo/), hint: 'Initialize the table in SUBSET-SUM-MEMO.'}],
  model: `SUBSET-SUM-MEMO(X, n, T)           // O(nT) states, each O(1)
    let memo[1..n+1, 0..T] be a new table, every entry NIL
    return SS(X, 1, T)

SS(X, i, T)                        // can a subset of X[i..n] sum to T?
    if T == 0
        return TRUE
    if T < 0 or i > n
        return FALSE                  // prune
    if memo[i, T] != NIL
        return memo[i, T]             // reuse a solved state
    result = SS(X, i + 1, T) or SS(X, i + 1, T - X[i])
    memo[i, T] = result
    return result`}; }],
 dp: [() => ({id: 'learn-rod-cost', topic: 't12a', title: 'Rod cutting where every cut costs c, with the cuts remembered',
  prompt: `A ${lgPick(['lumber mill', 'steel shop', 'fabric store'])} pays a fixed <b>cost c for every cut</b>. Modify BOTTOM-UP-CUT-ROD so revenue = Σ prices − c × (number of cuts), keep s[j] (the first piece) as memory, and print the optimal pieces. Write <code>CUT-ROD-COST(p, n, c)</code> returning r and s, and <code>PRINT-PIECES(s, n)</code>.`,
  starter: 'CUT-ROD-COST(p, n, c)\n    \n\nPRINT-PIECES(s, n)\n    \n', define: ['cutrodcost', 'printpieces'], call: [], maxLoop: 2,
  correctness: [
   {label: 'r[0] = 0 and lengths filled in increasing order', w: 2, test: t => /r\s*\[\s*0\s*\]\s*=\s*0/.test(t) && /for\s+j\s*=\s*1\s+to\s+n/.test(t), hint: 'r[0] = 0; for j = 1 to n'},
   {label: 'No cut: sell the whole length j', w: 2, test: lgRx(/=\s*p\s*\[\s*j\s*\]/), hint: 'q = p[j]; s[j] = j'},
   {label: 'A first cut at i < j subtracts c', w: 3, test: lgRx(/p\s*\[\s*i\s*\]\s*\+\s*r\s*\[\s*j\s*-\s*i\s*\]\s*-\s*c/), hint: 'p[i] + r[j − i] − c for i = 1 to j − 1'},
   {label: 'Remembers the best first piece in s[j]', w: 2, test: lgRx(/s\s*\[\s*j\s*\]\s*=\s*i/), hint: 's[j] = i'},
   {label: 'PRINT-PIECES follows s until n = 0', w: 1, test: lgIn('printpieces', /n\s*=\s*n\s*-\s*s\s*\[\s*n\s*\]/), hint: 'print s[n]; n = n − s[n]'}],
  efficiency: [{label: 'Bottom-up Θ(n²): two nested loops, no recursion', w: 6, test: (t, P) => P.maxLoop === 2 && !/cut-?rod-?cost\s*\(/.test(P.body('cutrodcost')), hint: 'Fill r[1..n] in order.'},
   {label: 'Reconstruction is O(n) from s', w: 4, test: (t, P) => P.hasFn('printpieces'), hint: 'Use the stored choices.'}],
  model: `CUT-ROD-COST(p, n, c)             // Θ(n²), every cut costs c
    let r[0..n] and s[1..n] be new arrays
    r[0] = 0
    for j = 1 to n
        q = p[j]                      // sell length j uncut
        s[j] = j
        for i = 1 to j - 1
            if p[i] + r[j - i] - c > q
                q = p[i] + r[j - i] - c
                s[j] = i              // remember the best first piece
        r[j] = q
    return (r, s)

PRINT-PIECES(s, n)                // O(n) from the stored choices
    while n > 0
        print s[n]
        n = n - s[n]`})],
 lcs: [() => ({id: 'learn-lcs-tworow', topic: 't12b', title: 'LCS length in two rows of memory',
  prompt: `Comparing ${lgPick(['two long DNA strands', 'two versions of a large file', 'two transcripts'])} with the full (m + 1) × (n + 1) table uses Θ(mn) memory. Row i of the table only needs row i − 1, so modify LCS-LENGTH to keep just <b>two rows</b>: Θ(mn) time, Θ(n) space. Write <code>LCS-TWO-ROWS(X, Y, m, n)</code> returning the length.`,
  starter: 'LCS-TWO-ROWS(X, Y, m, n)\n    \n', define: ['lcstworows'], call: [], maxLoop: 2,
  correctness: [
   {label: 'Two rows initialized to 0', w: 2, test: lgRx(/(prev|old|above)[^\n]*0|=\s*0/), hint: 'prev[0..n] = 0'},
   {label: 'Match: diagonal + 1 from the previous row', w: 3, test: lgRx(/x\s*\[\s*i\s*\]\s*==\s*y\s*\[\s*j\s*\][\s\S]{0,60}(prev|old|above)\s*\[\s*j\s*-\s*1\s*\]\s*\+\s*1/), hint: 'if X[i] == Y[j]: cur[j] = prev[j − 1] + 1'},
   {label: 'Mismatch: max of above and left', w: 3, test: lgRx(/max\s*\(\s*(prev|old|above)\s*\[\s*j\s*\]\s*,\s*(cur|row|new)\s*\[\s*j\s*-\s*1\s*\]|max\s*\(\s*(cur|row|new)\s*\[\s*j\s*-\s*1\s*\]\s*,\s*(prev|old|above)\s*\[\s*j\s*\]/), hint: 'else cur[j] = max(prev[j], cur[j − 1])'},
   {label: 'Swaps the rows after each i', w: 1, test: lgRx(/swap|prev\s*=\s*cur/), hint: 'swap prev and cur'},
   {label: 'Returns the last cell', w: 1, test: lgRx(/return[^\n]*\[\s*n\s*\]/), hint: 'return prev[n]'}],
  efficiency: [{label: 'Θ(n) space: no m × n table', w: 6, test: t => !/c\s*\[\s*i\s*,\s*j\s*\]|c\s*\[\s*i\s*\]\s*\[\s*j\s*\]|\[\s*0\s*\.\.\s*m\s*,/.test(t), hint: 'Only two rows of length n + 1.'},
   {label: 'Θ(mn) time: two nested loops', w: 4, test: (t, P) => P.maxLoop === 2, hint: 'Same loops as LCS-LENGTH.'}],
  model: `LCS-TWO-ROWS(X, Y, m, n)          // Θ(mn) time, Θ(n) space
    let prev[0..n] and cur[0..n] be new arrays of zeros
    for i = 1 to m
        cur[0] = 0
        for j = 1 to n
            if X[i] == Y[j]
                cur[j] = prev[j - 1] + 1          // diagonal + 1
            else cur[j] = max(prev[j], cur[j - 1])  // above or left
        swap prev and cur                         // row i becomes "previous"
    return prev[n]`})]
});

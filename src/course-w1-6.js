// ======================= WEEKS 1–6: EXERCISE-INSPIRED PRACTICE =======================
// Modeled on the professor's Exercise 1–10 solution sets. Adds MC questions,
// pseudocode challenges, and "professor's corner" deep-dive notes to the
// week 1–6 topics. Loaded after deep.js so DEEP pushes land before pages build.

// ======================= MULTIPLE CHOICE =======================
MC.push(
 // ---- t01: Intro & Basic Data Structures ----
 {topic:'t01', q:'What must an algorithm accomplish to be considered correct?',
  options:['For every valid input it produces the required output in finite time','It must always run in O(1) time','It must use the least possible memory','It must terminate on every input, even invalid ones'], answer:0,
  explain:'Correctness = right output for every input, plus termination. Efficiency is analyzed separately.'},
 {topic:'t01', q:'A <b>stack</b> and a <b>queue</b> differ in that…',
  options:['A stack is LIFO; a queue is FIFO','A stack is FIFO; a queue is LIFO','Both are FIFO but stacks are faster','Stacks only store numbers'], answer:0,
  explain:'Push/pop on top vs. enqueue at rear / dequeue at front.'},
 {topic:'t01', q:'Why do we state a <b>loop invariant</b> before proving an iterative algorithm correct?',
  options:['It is a property that holds before, during, and after the loop — bridging init to termination','It tells the compiler how to optimize the loop','It counts how many times the loop runs','It replaces the need for a base case'], answer:0,
  explain:'Initialization, maintenance, and termination turn the invariant into a proof of correctness.'},

 // ---- t03: Growth of Functions ----
 {topic:'t03', q:'Linear search <code>Find(A,x)</code> runs <code>T(n) = a·fx(n) + b</code> when x is present (fx(n) = position of x) and <code>T(n) = a·n + b</code> when absent. Its worst-case running time is:',
  options:['Θ(n)','Θ(fx(n))','Θ(1)','Θ(n²)'], answer:0,
  explain:'fx(n) ≤ n always (worst case: x absent or at the last position), so T(n) = Θ(n).'},
 {topic:'t03', q:'For the same search, the <b>best-case</b> running time is:',
  options:['Θ(1) — x sits at A[1], so fx(n) = 1','Θ(log n)','Θ(n)','Θ(fx(n))'], answer:0,
  explain:'Best case fx(n) = 1 gives T(n) = a + b = Θ(1).'},
 {topic:'t03', q:'Which relation holds between <code>f(n) = n^(log c)</code> and <code>g(n) = c^(log n)</code> for constant c > 1?',
  options:['f(n) = Θ(g(n)) — they are equal','f(n) = o(g(n))','f(n) = O(g(n)) but not Ω','f(n) = ω(g(n))'], answer:0,
  explain:'n^(log c) = c^(log n) by the change-of-base identity — the exercise derives this from the log rules.'},
 {topic:'t03', q:'Compare <code>f(n) = log(k^n)</code> and <code>g(n) = n^d</code> (k ≥ 1, d > 0 constants). The correct entry is:',
  options:['f(n) = o(g(n)), hence also O(g(n))','f(n) = Θ(g(n))','f(n) = Ω(g(n))','f(n) = ω(g(n))'], answer:0,
  explain:'log(k^n) = n·log k grows only linearly in n inside a log — i.e. logarithmically — while n^d grows polynomially, so the ratio → 0.'},
 {topic:'t03', q:'Compare <code>f(n) = 2^n</code> and <code>g(n) = 2^(n/2) = (√2)^n</code>. Which is true?',
  options:['f(n) = ω(g(n)) (and Ω), but not O','f(n) = Θ(g(n))','f(n) = o(g(n))','f(n) = O(g(n)) but not Ω'], answer:0,
  explain:'2^n / (√2)^n = (√2)^n → ∞, so f grows strictly faster: ω and Ω hold, O and Θ fail.'},
 {topic:'t03', q:'Compare <code>f(n) = log(n!)</code> and <code>g(n) = log(n^n)</code>. Stirling gives:',
  options:['f(n) = Θ(g(n))','f(n) = o(g(n))','f(n) = O(g(n)) but not Ω','f(n) = ω(g(n))'], answer:0,
  explain:'log(n!) = Θ(n log n) by Stirling, and log(n^n) = n log n — same growth.'},

 // ---- t02: Correctness & Analysis ----
 {topic:'t02', q:'For <code>Find(A[1..n], x)</code> (return i where A[i]=x, else −1), the standard loop invariant is:',
  options:['x is not in the subarray A[1..i−1]','A[1..i−1] is sorted','i ≤ n','x equals A[i]'], answer:0,
  explain:'Before iteration i, every checked element failed the test — the exercise proves this invariant through all three phases.'},
 {topic:'t02', q:'In the maintenance step of that proof, why does the loop reaching iteration i+1 imply x ∉ A[1..i]?',
  options:['The loop only continues when A[i] ≠ x, and the invariant already excluded A[1..i−1]','Because i is incremented before the test','Because n is finite','Because A is sorted'], answer:0,
  explain:'Reaching i+1 means A[i] ≠ x was just verified; combined with the invariant, x is absent from the whole prefix.'},
 {topic:'t02', q:'<code>Loop(A,x)</code> runs <code>for i=1..n: for j=i; j≤n; j+=n: print A[j]</code>. Its running time is:',
  options:['Θ(n²)','Θ(n lg n)','Θ(n)','Θ(n³)'], answer:0,
  explain:'The inner loop executes ⌈(n−i+1)/n⌉ ≈ n−i+1 times; summing i=1..n gives ≈ n²/2 → Θ(n²).'},
 {topic:'t02', q:'When <code>Find</code> terminates via the for-condition (i = n+1), the invariant yields:',
  options:['x ∉ A[1..n], so returning −1 is correct','A is empty','x = A[n]','The loop never terminates'], answer:0,
  explain:'The invariant at i = n+1 says x is not in A[1..n] — exactly the −1 case.'},

 // ---- t07: Divide & Conquer ----
 {topic:'t07', q:'<code>stupid_sort</code> makes three recursive calls on thirds and then runs an adjacent-swap pass costing Θ(n²). Its running time is:',
  options:['Θ(n²)','Θ(n log n)','Θ(n)','Θ(n³)'], answer:0,
  explain:'T(n) = 3T(n/3) + Θ(n²). Master theorem case 3: n^(log₃3) = n¹ = O(n^(2−ε)), so the work term dominates.'},
 {topic:'t07', q:'For <code>T(n) = 3T(n/3) + cn²</code>, the substitution-method guess is:',
  options:['T(n) = (32/3)·c·n² = Θ(n²)','T(n) = c·n log n','T(n) = c·n³','T(n) = c·n'], answer:0,
  explain:'Plugging c′n² gives c′n²/3 + cn² = c′n² → c′ = (3/2)c… the exercise derives the constant explicitly.'},
 {topic:'t07', q:'Why does the Master theorem apply to <code>T(n) = 3T(n/3) + Θ(n²)</code> in case 3?',
  options:['n^(log_b a) = n¹ is polynomially smaller than f(n) = n²','There is only one recursive call','f(n) is constant','The recurrence has no base case'], answer:0,
  explain:'log₃3 = 1, so the leaf work n¹ = O(n^(2−ε)) for ε < 1 — leaves are dominated by the combine cost.'},

 // ---- t09: Heaps & Priority Queues ----
 {topic:'t09', q:'In a <b>ternary</b> max-heap stored in a 1-based array, the children of node i are at:',
  options:['3i − 1, 3i, 3i + 1','3i, 3i + 1, 3i + 2','2i, 2i + 1, 2i + 2','i + 1, i + 2, i + 3'], answer:0,
  explain:'Node i has children 3i−1 (left), 3i (middle), 3i+1 (right); parent is ⌊(i+1)/3⌋.'},
 {topic:'t09', q:'The parent of node i in a ternary heap is:',
  options:['⌊(i + 1) / 3⌋','⌊i / 3⌋','⌈i / 3⌉','i − 3'], answer:0,
  explain:'Invert the child formulas: i = 3p−1, 3p, or 3p+1 all give p = ⌊(i+1)/3⌋.'},
 {topic:'t09', q:'MAX-HEAPIFY on a ternary heap recurses on a subtree of size at most ___, giving T(n) = T(3n/5) + Θ(1) = Θ(log n).',
  options:['3n/5','n/3','n/2','2n/3'], answer:0,
  explain:'The largest subtree is the left one, one extra level deep: solving the vertex count gives ≤ 3n/5.'},
 {topic:'t09', q:'Why is BUILD-MAX-HEAP still Θ(n) for a ternary heap?',
  options:['Subtree sizes shrink geometrically: Σ (n/3^h)·h = O(n)','Ternary trees have fewer nodes','Heapify becomes O(1)','It does not — it is Θ(n log n)'], answer:0,
  explain:'Same aggregate argument as binary heaps: most nodes are near the leaves where heapify is cheap.'},

 // ---- t08: Binary Search Trees ----
 {topic:'t08', q:'If node X has two children, its in-order successor S always:',
  options:['lies in X\'s right subtree and has no left child','is X\'s parent','is the maximum of the whole tree','has two children itself'], answer:0,
  explain:'Exercise 5 proves S is a descendant in the right subtree; a left child of S would sit between X and S.'},
 {topic:'t08', q:'In BST-DELETE, when the node has two children we replace it with its ___ and then delete that node from its original position.',
  options:['in-order successor','in-order predecessor','parent','leftmost leaf'], answer:0,
  explain:'The successor has at most one child (no left child), so the second deletion is the easy case.'},
 {topic:'t08', q:'<code>height(node)</code> returns −1 for NIL and otherwise 1 + max(height(left), height(right)). The height of a single-node tree is:',
  options:['0','1','−1','2'], answer:0,
  explain:'Both children are NIL (−1), so height = 1 + max(−1,−1) = 0 — edges on the longest root-to-leaf path.'},

 // ---- t05a: Probabilistic Analysis ----
 {topic:'t05a', q:'X takes values {5, 10, 15} with probabilities 3/5, 1/5, 1/5. E[X] =',
  options:['8','10','9','7.5'], answer:0,
  explain:'E[X] = 5·(3/5) + 10·(1/5) + 15·(1/5) = 3 + 2 + 3 = 8.'},
 {topic:'t05a', q:'For an indicator variable Xᵢ = I{event}, the expectation is:',
  options:['Pr[event]','1/2','the value of the event','n·Pr[event]'], answer:0,
  explain:'E[I] = 1·Pr[I=1] + 0·Pr[I=0] = Pr[event] — the key trick behind all indicator analyses.'},
 {topic:'t05a', q:'n rolls of a fair s-sided die: with Yⱼ the j-th roll and Xᵢ = I{roll shows i}, E[total] simplifies to:',
  options:['n(s + 1) / 2','ns / 2','n(s − 1) / 2','s(s + 1) / 2'], answer:0,
  explain:'E[Z] = Σⱼ Σᵢ i·E[Xᵢ] = n·Σᵢ i·(1/s) = n·(s+1)/2 — linearity of expectation does all the work.'},

 // ---- t05b: Randomized Quicksort ----
 {topic:'t05b', q:'In a random permutation of 1..n, the expected position of element k found by linear search is:',
  options:['(n + 1) / 2','n / 2','n','(n − 1) / 2'], answer:0,
  explain:'E[Y] = Σ i·Pr[A[i]=k] = Σ i·(1/n) = (n+1)/2 — search checks half the array on average.'},
 {topic:'t05b', q:'RANDOMIZED-SELECT partitions A[p..r] returning pivot index q. The pivot\'s rank within the subarray is:',
  options:['k = q − p + 1','k = q','k = r − q','k = p + q'], answer:0,
  explain:'After partitioning, exactly q−p elements precede the pivot, so it is the (q−p+1)-th smallest.'},
 {topic:'t05b', q:'Why does RANDOMIZED-SELECT recurse on only one side after partitioning?',
  options:['The pivot\'s rank tells which side contains the i-th smallest element','It saves memory','Partition destroys the other side','It is required by quicksort'], answer:0,
  explain:'If i = k return the pivot; i < k search left; else search right with i − k — discarding half the work each round.'},

 // ---- t06: Hash Tables ----
 {topic:'t06', q:'Why can\'t open addressing simply write NIL over a deleted key?',
  options:['Later keys may have probed past it — NIL would falsely terminate their searches','NIL is not a valid key','It corrupts the hash function','Tables must stay full'], answer:0,
  explain:'Exercise 9: search(8) stops at the NIL left by delete(3) even though 8 sits further down the probe chain.'},
 {topic:'t06', q:'The DELETED marker fixes that because search treats it as…',
  options:['occupied — keep probing','empty — stop','a valid key','an error'], answer:0,
  explain:'Search skips DELETED entries and continues; insert may reuse them.'},
 {topic:'t06', q:'With tombstones, worst-case HASH-DELETE costs:',
  options:['Θ(m) — the table can be full of DELETED entries','Θ(n)','Θ(1)','Θ(log m)'], answer:0,
  explain:'n counts live items, but the probe may traverse up to m slots of tombstones — Exercise 9\'s key insight.'},
 {topic:'t06', q:'The corrected HASH-INSERT first calls HASH-SEARCH because…',
  options:['a key may already exist beyond a DELETED slot, and duplicates must be prevented','search is faster than insert','DELETED slots cannot hold keys','it randomizes the probe order'], answer:0,
  explain:'insert(8) twice must not create two copies — the first attempt in the exercise fails exactly this way.'},

 // ---- t10a: Selection & Order Statistics ----
 {topic:'t10a', q:'For the oil-pipeline problem (minimize total spur length), the optimal east–west pipeline sits at:',
  options:['the median of the wells\' y-coordinates','the mean of the y-coordinates','the minimum y','any y-coordinate'], answer:0,
  explain:'Moving the line off the median adds d per well on one side without removing d on the other — Exercise 10.'},
 {topic:'t10a', q:'With an <b>even</b> number of wells, the optimal pipeline may be placed:',
  options:['anywhere between the two middle (median) wells','exactly at the lower median','exactly at the upper median','at the mean'], answer:0,
  explain:'Between the medians the wells split evenly, so shifting by d adds and subtracts equal spur length.'},
 {topic:'t10a', q:'QUICKSORT\' makes worst-case O(n log n) by choosing the pivot via:',
  options:['SELECT — the true median of the subarray','a random element','the first element','the last element'], answer:0,
  explain:'A median pivot halves every recursion: T(n) = 2T(n/2) + O(n) = O(n log n).'},
 {topic:'t10a', q:'For <code>T(n) = T(n/5) + T(2n/3) + cn</code>, substitution with guess c′n succeeds because:',
  options:['13c′/15 + c = c′ → c′ = 15c/2, and 1/5 + 2/3 < 1','the Master theorem case 1 applies','f(n) = cn dominates','there is no valid guess'], answer:0,
  explain:'Subproblem sizes shrink geometrically (13/15 < 1), so linear work accumulates to Θ(n) — verified by substitution.'}
);

// ======================= PSEUDOCODE CHALLENGES =======================
CODE.push(
 {id:'find-index', topic:'t02', title:'Linear search with a stated invariant',
  prompt:'Write <code>FIND(A, n, x)</code> that returns the index i with A[i] = x, or −1. <b>State the loop invariant in a comment</b> — the graders (and your future self) want to see it.',
  starter:'FIND(A, n, x)\n    // loop invariant: \n    \n', define:['find'], call:[], maxLoop:1,
  correctness:[
   {label:'Loops i from 1 to n', w:2, test:t=>/\bfor\b[^\n]*\b\w+\s*(=|in)\s*(1|0)\b|range\s*\(\s*1/.test(t), hint:'for i = 1 to n'},
   {label:'Compares A[i] to x', w:2, test:t=>/a\s*\[\s*\w+\s*\]\s*==\s*x|x\s*==\s*a\s*\[/.test(t), hint:'if A[i] == x'},
   {label:'Returns i when found', w:2, test:t=>/return\s+\w+\s*;?\s*\n?[\s\S]*if|if[^\n]*a\s*\[\s*\w+\s*\][^\n]*return/.test(t) || /return\s+i\b/.test(t), hint:'return i inside the if'},
   {label:'Returns −1 after the loop', w:2, test:t=>/return\s+-?\s*1\b/.test(t), hint:'return -1 (or 0/NULL) after the loop ends'},
   {label:'States the loop invariant in a comment', w:2, test:t=>/invariant/.test(t), hint:'// invariant: x is not in A[1..i-1]'}
  ],
  efficiency:[
   {label:'Single pass — O(n) worst case', w:5, test:(t,P)=>P.maxLoop<=1, hint:'One loop; exit early on a match.'}
  ],
  penalties:[{label:'Sorts or modifies A (not required)', p:2, test:t=>/\bsort\b|exchange|swap/.test(t), hint:'Linear search should not reorder the input.'}],
  model:`FIND(A, n, x)
    // loop invariant: x is not in the subarray A[1..i-1]
    for i = 1 to n
        if A[i] == x
            return i
    return -1`},

 {id:'binary-search', topic:'t02', title:'Binary search on a sorted array',
  prompt:'Write <code>BINARY-SEARCH(A, n, x)</code> on a <b>sorted</b> array returning the index of x or −1. Keep the loop invariant in a comment.',
  starter:'BINARY-SEARCH(A, n, x)\n    // loop invariant: \n    \n', define:['binarysearch'], call:[], maxLoop:1,
  correctness:[
   {label:'Initializes lo and hi bounds', w:2, test:t=>/\b(lo|left)\s*=\s*1|\b(lo|left)\s*=\s*0/.test(t) && /\b(hi|right|r)\s*=\s*n\b/.test(t), hint:'lo = 1, hi = n'},
   {label:'Loops while lo ≤ hi', w:2, test:t=>/\bwhile\b[^\n]*(<=|<=|<=)\s*hi|while\s*\w+\s*<=\s*\w+/.test(t), hint:'while lo <= hi'},
   {label:'Computes mid without overflow-prone tricks', w:1, test:t=>/mid\s*=|m\s*=\s*\(?\s*\w+\s*\+\s*\w+\s*\)?\s*\/\s*2|floor/.test(t), hint:'mid = floor((lo + hi) / 2)'},
   {label:'Three-way comparison against A[mid]', w:3, test:t=>/a\s*\[\s*mid\s*\]\s*==\s*x|x\s*==\s*a\s*\[\s*mid/.test(t) && /a\s*\[\s*mid\s*\]\s*</.test(t) && (/a\s*\[\s*mid\s*\]\s*>/.test(t) || /hi\s*=\s*mid|right\s*=\s*mid/.test(t)), hint:'if A[mid] == x return mid; if < move lo; if > move hi'},
   {label:'Shrinks the correct side each step', w:2, test:t=>/(lo|left)\s*=\s*mid|hi\s*=\s*mid/.test(t), hint:'lo = mid + 1 when A[mid] < x; hi = mid − 1 when A[mid] > x'},
   {label:'Returns −1 when not found', w:1, test:t=>/return\s+-?\s*1\b/.test(t), hint:'return -1 after the loop'}
  ],
  efficiency:[
   {label:'Halves the search space (O(log n))', w:5, test:(t,P)=>P.maxLoop<=1 && /\/\s*2|floor|mid/.test(t), hint:'One loop over a halving interval.'},
   {label:'Does not scan linearly', w:3, test:t=>!/for[^\n]*1 to n/.test(t), hint:'No linear for-loop over all n.'}
  ],
  penalties:[{label:'Linear scan instead of halving', p:3, test:t=>/for[^\n]*1 to n/.test(t) && !/mid|\/\s*2/.test(t), hint:'Binary search must discard half the interval.'}],
  model:`BINARY-SEARCH(A, n, x)
    // invariant: if x is in A it lies in A[lo..hi]
    lo = 1
    hi = n
    while lo <= hi
        mid = floor((lo + hi) / 2)
        if A[mid] == x
            return mid
        else if A[mid] < x
            lo = mid + 1
        else
            hi = mid - 1
    return -1`},

 {id:'stupid-sort', topic:'t07', title:'stupid_sort — three-way recursion + bubble pass',
  prompt:'Implement <code>STUPID-SORT(A, lo, hi)</code> exactly as in Exercise 3: recurse on the three thirds A[lo..m1], A[m1+1..m2], A[m2+1..hi], then run the adjacent-swap pass over the whole range.',
  starter:'STUPID-SORT(A, lo, hi)\n    if hi - lo + 1 = 1\n        return\n    else if hi - lo + 1 = 2\n        if A[lo] > A[lo+1]\n            exchange A[lo] and A[lo+1]\n    else\n        \n', define:['stupidsort'], call:['stupid-sort'], maxLoop:2,
  correctness:[
   {label:'Base cases for sizes 1 and 2', w:2, test:t=>/if[^\n]*(=|==)\s*1|n\s*=\s*1/.test(t) && /2/.test(t), hint:'Handle n = 1 (return) and n = 2 (compare-and-swap)'},
   {label:'Computes the two third-boundaries', w:2, test:t=>/\/\s*3|third/.test(t), hint:'m1 = lo + floor((hi-lo+1)/3) − 1 style splits'},
   {label:'Makes three recursive calls on the thirds', w:3, test:(t,P)=>{const b=P.body('stupidsort'); return (b.match(/stupid-?sort\s*\(/g)||[]).length>=3;}, hint:'STUPID-SORT on each third'},
   {label:'Runs the n² adjacent-comparison pass', w:3, test:t=>/for[^\n]*downto|for[^\n]*i\s*=\s*1/.test(t) && /for[^\n]*j/.test(t), hint:'for i … for j … if A[j] < A[j−1] exchange'},
   {label:'Swaps only when out of order (A[j] < A[j−1])', w:2, test:t=>/a\s*\[\s*\w+\s*\]\s*<\s*a\s*\[|exchange|swap/.test(t), hint:'Bubble-style: exchange A[j] and A[j−1] when needed'}
  ],
  efficiency:[
   {label:'Recursion depth stays logarithmic-ish (thirds)', w:3, test:(t,P)=>/\/\s*3/.test(t), hint:'Subproblem size n/3 each call.'}
  ],
  penalties:[{label:'Only two recursive calls (misses a third)', p:2, test:(t,P)=>{const b=P.body('stupidsort'); const n=(b.match(/stupid-?sort\s*\(/g)||[]).length; return n>=1 && n<3;}, hint:'The exercise requires three recursive calls on the thirds.'}],
  model:`STUPID-SORT(A, lo, hi)
    // Exercise 3: recurse on thirds, then bubble the whole range once
    n = hi - lo + 1
    if n == 1
        return
    else if n == 2
        if A[lo] > A[hi]
            exchange A[lo] and A[hi]
    else
        m1 = lo + floor(n/3) - 1
        m2 = lo + floor(2n/3) - 1
        STUPID-SORT(A, lo, m1)
        STUPID-SORT(A, m1+1, m2)
        STUPID-SORT(A, m2+1, hi)
        for i = lo to hi - 1
            for j = hi downto i + 1
                if A[j] < A[j-1]
                    exchange A[j] and A[j-1]`},

 {id:'ternary-index', topic:'t09', title:'Ternary heap array indices',
  prompt:'Write the four index procedures for a <b>ternary max-heap</b> in a 1-based array: <code>LEFT(i)</code>, <code>MIDDLE(i)</code>, <code>RIGHT(i)</code>, <code>PARENT(i)</code>.',
  starter:'LEFT(i)\n    return \n\nMIDDLE(i)\n    return \n\nRIGHT(i)\n    return \n\nPARENT(i)\n    return \n', define:['left','middle','right','parent'], call:[], maxLoop:0,
  correctness:[
   {label:'LEFT(i) = 3i − 1', w:3, test:t=>/3\s*\*\s*\w+\s*-\s*1|3i-1/.test(t), hint:'return 3*i - 1'},
   {label:'MIDDLE(i) = 3i', w:3, test:t=>/return\s+3\s*\*\s*\w+\s*;?\s*$/m.test(t), hint:'return 3*i'},
   {label:'RIGHT(i) = 3i + 1', w:3, test:t=>/3\s*\*\s*\w+\s*\+\s*1/.test(t), hint:'return 3*i + 1'},
   {label:'PARENT(i) = ⌊(i+1)/3⌋', w:3, test:t=>/\(\s*\w+\s*\+\s*1\s*\)\s*\/\s*3|floor[^\n]*3/.test(t), hint:'return floor((i + 1) / 3)'}
  ],
  efficiency:[
   {label:'All O(1) — no loops', w:5, test:(t,P)=>P.maxLoop===0, hint:'Index arithmetic only.'}
  ],
  model:`LEFT(i)
    // ternary heap: children of i are 3i-1, 3i, 3i+1 (1-based array)
    // derivation: level-order layout packs 3 children per parent slot
    return 3*i - 1

MIDDLE(i)
    return 3*i

RIGHT(i)
    return 3*i + 1

PARENT(i)
    // invert the child formulas: p = floor((i+1)/3)
    // check: i = 3p-1, 3p, 3p+1 all give floor((i+1)/3) = p
    return floor((i + 1) / 3)`},

 {id:'heapify-3way', topic:'t09', title:'MAX-HEAPIFY for a ternary heap',
  prompt:'Write <code>MAX-HEAPIFY-3(A, i)</code>: restore the max-heap property at i in a ternary heap, checking all three children (LEFT/MIDDLE/RIGHT/PARENT as in Exercise 4).',
  starter:'MAX-HEAPIFY-3(A, i)\n    l = LEFT(i)\n    m = MIDDLE(i)\n    r = RIGHT(i)\n    largest = i\n    \n', define:['maxheapify'], call:['left','middle','right'], maxLoop:1,
  correctness:[
   {label:'Fetches all three children', w:2, test:t=>/left\s*\(|3\s*\*\s*\w+\s*-\s*1/.test(t) && /middle\s*\(|3\s*\*\s*\w+\s*;/.test(t) && /right\s*\(|3\s*\*\s*\w+\s*\+\s*1/.test(t), hint:'l = LEFT(i), m = MIDDLE(i), r = RIGHT(i)'},
   {label:'Compares each child against the current largest', w:3, test:t=>/a\s*\[\s*\w+\s*\]\s*>\s*a\s*\[\s*largest\s*\]|largest\s*=\s*l|largest\s*=\s*m|largest\s*=\s*r/.test(t), hint:'if A[l] > A[largest] then largest = l (×3)'},
   {label:'Swaps when largest ≠ i', w:2, test:t=>/largest\s*!=\s*i|largest\s*<>\s*i/.test(t) && /exchange|swap/.test(t), hint:'if largest != i exchange A[i] with A[largest]'},
   {label:'Recurses on the new position', w:3, test:(t,P)=>/maxheapify|heapify/.test(P.body('maxheapify')) && /\(\s*a\s*,\s*largest\s*\)/.test(t), hint:'MAX-HEAPIFY-3(A, largest)'}
  ],
  efficiency:[
   {label:'Constant work per level — O(log n) overall', w:5, test:(t,P)=>P.maxLoop<=1, hint:'Three comparisons then one recursive call.'}
  ],
  penalties:[{label:'Only checks two children (binary-heap habit)', p:3, test:t=>!/middle|3\s*\*\s*\w+\s*;/.test(t), hint:'A ternary heap has THREE children — do not forget the middle one.'}],
  model:`MAX-HEAPIFY-3(A, i)
    // same sift-down as binary heaps, but THREE children to check
    l = LEFT(i)
    m = MIDDLE(i)
    r = RIGHT(i)
    largest = i
    if l <= A.heapSize and A[l] > A[largest]
        largest = l
    if m <= A.heapSize and A[m] > A[largest]
        largest = m
    if r <= A.heapSize and A[r] > A[largest]
        largest = r
    if largest != i
        exchange A[i] with A[largest]
        MAX-HEAPIFY-3(A, largest)`},

 {id:'bst-successor', topic:'t08', title:'BST-SUCCESSOR',
  prompt:'Write <code>BST-SUCCESSOR(T, x)</code> returning the in-order successor of node x in a BST (the node with the smallest key greater than x.key), or NIL.',
  starter:'BST-SUCCESSOR(T, x)\n    if x.right != NIL\n        \n    else\n        \n', define:['bstsuccessor'], call:[], maxLoop:1,
  correctness:[
   {label:'Handles the right-child case first', w:3, test:t=>/x\.right|\.right\b[^\n]*!=\s*nil|right\s*!=\s*nil/.test(t), hint:'if x.right ≠ NIL go to the leftmost node of x.right'},
   {label:'Walks to the leftmost node of the right subtree', w:3, test:t=>/while[^\n]*\.left|while[^\n]*left[^\n]*!=\s*nil/.test(t), hint:'y = x.right; while y.left ≠ NIL: y = y.left'},
   {label:'Otherwise climbs while x is a right child', w:3, test:t=>/while[^\n]*==\s*\w+\.right|\.parent\.right|==\s*y\.right/.test(t), hint:'while x = x.parent.right; then return x.parent'},
   {label:'Returns NIL at the top', w:1, test:t=>/return\s+(nil|null|none|y)\b/.test(t), hint:'return NIL (or y, which is NIL) if we climb past the root'}
  ],
  efficiency:[
   {label:'O(h) — one downward or upward path', w:5, test:(t,P)=>P.maxLoop<=1, hint:'A single while-loop, either down-left or up-parent.'}
  ],
  model:`BST-SUCCESSOR(T, x)
    // two cases: right subtree exists -> leftmost of it; else climb ancestors
    if x.right != NIL
        y = x.right
        while y.left != NIL
            y = y.left
        return y
    y = x.parent
    while y != NIL and x == y.right
        x = y
        y = y.parent
    return y`},

 {id:'bst-delete', topic:'t08', title:'BST-DELETE with transplant',
  prompt:'Write <code>BST-DELETE(T, z)</code> for a BST where each node has parent pointers. Handle the three cases: 0 children, 1 child, 2 children (replace with successor).',
  starter:'BST-DELETE(T, z)\n    if z.left == NIL\n        TRANSPLANT(T, z, z.right)\n    else if z.right == NIL\n        TRANSPLANT(T, z, z.left)\n    else\n        \n\nTRANSPLANT(T, u, v)\n    \n', define:['bstdelete','transplant'], call:['bst-successor','transplant'], maxLoop:0,
  correctness:[
   {label:'Zero/one-child cases use TRANSPLANT', w:3, test:t=>/transplant/.test(t) && /z\.left|\.left\s*==\s*nil/.test(t) && /z\.right|\.right\s*==\s*nil/.test(t), hint:'if z.left = NIL transplant z with z.right, etc.'},
   {label:'Two-child case finds the successor', w:3, test:(t,P)=>/bstsuccessor|successor/.test(t), hint:'y = BST-SUCCESSOR(z) — it has no left child'},
   {label:'Moves successor into z\'s place', w:3, test:t=>/transplant\s*\(\s*\w+\s*,\s*y\b|transplant\s*\([^)]*successor/.test(t), hint:'TRANSPLANT(z, y) then fix y\'s old spot and parent'},
   {label:'Replaces z\'s key with y\'s key (or transplants carefully)', w:2, test:t=>/z\.key\s*=\s*y\.key|key\s*=\s*\w+\.key/.test(t) || /transplant/.test(t), hint:'z.key = y.key preserves the BST property'}
  ],
  efficiency:[
   {label:'O(h) — successor search plus constant transplants', w:5, test:(t,P)=>P.maxLoop<=1, hint:'No loops except inside BST-SUCCESSOR.'}
  ],
  model:`TRANSPLANT(T, u, v)
    // replace subtree rooted at u with subtree rooted at v
    if u.parent == NIL
        T.root = v
    else if u == u.parent.left
        u.parent.left = v
    else
        u.parent.right = v
    if v != NIL
        v.parent = u.parent

BST-DELETE(T, z)
    if z.left == NIL
        TRANSPLANT(T, z, z.right)
    else if z.right == NIL
        TRANSPLANT(T, z, z.left)
    else
        y = BST-SUCCESSOR(z)              // y has no left child
        if y.parent != z
            TRANSPLANT(T, y, y.right)
            y.right = z.right
            y.right.parent = y
        TRANSPLANT(T, z, y)
        y.left = z.left
        y.left.parent = y
        y.key = z.key`},

 {id:'rand-select', topic:'t05b', title:'RANDOMIZED-SELECT — quickselect',
  prompt:'Write <code>RANDOMIZED-SELECT(A, p, r, i)</code> returning the i-th smallest element of A[p..r] using RANDOMIZED-PARTITION (Exercise 8).',
  starter:'RANDOMIZED-SELECT(A, p, r, i)\n    if p == r\n        return A[p]\n    q = RANDOMIZED-PARTITION(A, p, r)\n    k = q - p + 1\n    \n', define:['randomizedselect'], call:['randomizedpartition'], maxLoop:0,
  correctness:[
   {label:'Base case p = r returns A[p]', w:2, test:t=>/p\s*==\s*r|p\s*=\s*r/.test(t) && /return\s+a\s*\[\s*p\s*\]/.test(t), hint:'if p = r return A[p]'},
   {label:'Partitions around a random pivot', w:3, test:(t,P)=>/randomized-?partition|partition\s*\(/.test(t), hint:'q = RANDOMIZED-PARTITION(A, p, r)'},
   {label:'Computes pivot rank k = q − p + 1', w:3, test:t=>/k\s*=\s*q\s*-\s*p\s*\+\s*1|q\s*-\s*p\s*\+\s*1/.test(t), hint:'the pivot is the (q−p+1)-th smallest in A[p..r]'},
   {label:'Returns pivot when i = k', w:2, test:t=>/i\s*==\s*k/.test(t) && /return\s+a\s*\[\s*q\s*\]/.test(t), hint:'if i = k return A[q]'},
   {label:'Recurses left with i when i < k', w:3, test:t=>/i\s*<\s*k/.test(t) && /randomized-?select\s*\([^)]*p[^)]*q\s*-\s*1/.test(t), hint:'return RANDOMIZED-SELECT(A, p, q−1, i)'},
   {label:'Recurses right with i − k when i > k', w:3, test:t=>/i\s*>\s*k|else/.test(t) && /randomized-?select\s*\([^)]*q\s*\+\s*1[^)]*i\s*-\s*k/.test(t), hint:'return RANDOMIZED-SELECT(A, q+1, r, i−k)'}
  ],
  efficiency:[
   {label:'Expected O(n) — discards one side each round', w:5, test:(t,P)=>P.maxLoop===0, hint:'Tail recursion on a random half: E[T(n)] = O(n).'}
  ],
  penalties:[{label:'Always recurses on both sides (quicksort, not select)', p:3, test:(t,P)=>{const b=P.body('randomizedselect'); return (b.match(/randomized-?select\s*\(/g)||[]).length>=2 && !/i\s*[<>=!]\s*k/.test(b);}, hint:'Quickselect must compare i to k and pick ONE side.'}],
  model:`RANDOMIZED-SELECT(A, p, r, i)
    // returns the i-th smallest element of A[p..r]
    if p == r
        return A[p]
    q = RANDOMIZED-PARTITION(A, p, r)
    k = q - p + 1                 // pivot rank in A[p..r]
    if i == k
        return A[q]
    else if i < k
        return RANDOMIZED-SELECT(A, p, q - 1, i)
    else
        return RANDOMIZED-SELECT(A, q + 1, r, i - k)`},

 {id:'hash-delete', topic:'t06', title:'Hash delete with DELETED tombstones',
  prompt:'Write <code>HASH-DELETE(T, k)</code> and <code>HASH-INSERT(T, k)</code> for a table using <b>open addressing with linear probing</b> and <b>DELETED</b> tombstones (Exercise 9). Insert must not create duplicates.',
  starter:'HASH-DELETE(T, k)\n    i = 0\n    repeat\n        j = h(k, i)\n        if T[j] == k\n            \n        i = i + 1\n    until T[j] == NIL or i == m\n    return "not in table"\n\nHASH-INSERT(T, k)\n    \n', define:['hashdelete','hashinsert'], call:['hash-search'], maxLoop:1,
  correctness:[
   {label:'DELETE marks the slot DELETED, not NIL', w:4, test:t=>/deleted/.test(t) && /t\s*\[\s*\w+\s*\]\s*=\s*['"]?deleted/.test(t), hint:'T[j] = DELETED preserves probe chains'},
   {label:'DELETE probes until NIL or table full', w:2, test:t=>/until[^\n]*(nil|empty)[^\n]*or[^\n]*i\s*==\s*m|i\s*==\s*m/.test(t), hint:'until T[j] == NIL or i == m'},
   {label:'INSERT reuses NIL or DELETED slots', w:3, test:t=>/nil[^\n]*deleted|deleted[^\n]*nil/.test(t), hint:'if T[j] == NIL or T[j] == DELETED'},
   {label:'INSERT checks for an existing key first (no duplicates)', w:3, test:(t,P)=>/hash-?search|search\s*\(/.test(t) || (/repeat|while/.test(t) && /==\s*k\b|!=\s*k\b/.test(t) && /already/.test(t)), hint:'if HASH-SEARCH(T,k) != NIL return "already in table"'}
  ],
  efficiency:[
   {label:'Probes bounded by table size m', w:5, test:(t,P)=>P.maxLoop<=1, hint:'One probe loop; worst case Θ(m) with tombstones.'}
  ],
  penalties:[{label:'Writes NIL on delete (breaks probe chains)', p:4, test:(t,P)=>{const b=P.body('hashdelete'); return /=\s*nil\b|=\s*null\b/.test(b) && !/deleted/.test(b);}, hint:'NIL terminates searches early — use DELETED.'}],
  model:`HASH-DELETE(T, k)
    // tombstone: mark DELETED so probe chains for other keys stay intact
    i = 0
    repeat
        j = h(k, i)
        if T[j] == k
            T[j] = DELETED
            return success
        i = i + 1
    until T[j] == NIL or i == m
    return "not in the hash table"

HASH-INSERT(T, k)
    if HASH-SEARCH(T, k) != NIL
        return "item is already in the table"
    i = 0
    repeat
        j = h(k, i)
        if T[j] == NIL or T[j] == DELETED
            T[j] = k
            return j
        i = i + 1
    until i == m
    error "hash table overflow"`},

 {id:'mom-select', topic:'t10a', title:'SELECT via median-of-medians',
  prompt:'Write <code>SELECT(A, p, r, i)</code> returning the i-th smallest of A[p..r] deterministically: group into 5s, find the median-of-medians pivot, partition, recurse on the correct side.',
  starter:'SELECT(A, p, r, i)\n    // groups of 5 -> median of medians -> partition -> recurse\n    \n', define:['select'], call:['partition'], maxLoop:1,
  correctness:[
   {label:'Groups elements into blocks of 5', w:2, test:t=>/\b5\b|five/.test(t) && /median/.test(t), hint:'Split A[p..r] into groups of 5 and take each median'},
   {label:'Computes the median of medians pivot', w:3, test:t=>/median[^\n]*median|medians/.test(t) || (/median/.test(t) && /pivot|x\s*=/.test(t)), hint:'pivot = median of the group medians'},
   {label:'Partitions around the pivot', w:2, test:(t,P)=>/partition\s*\(/.test(t), hint:'q = PARTITION(A, p, r, pivot)'},
   {label:'Computes pivot rank and recurses one side', w:3, test:t=>/q\s*-\s*p\s*\+\s*1|rank/.test(t) && /select\s*\(/.test(t), hint:'k = q − p + 1; recurse on the side containing i'}
  ],
  efficiency:[
   {label:'Guaranteed 30/70 split → O(n) worst case', w:5, test:(t,P)=>P.maxLoop<=1, hint:'Median-of-medians guarantees the pivot is never extreme.'}
  ],
  penalties:[{label:'Uses a random pivot (that is RANDOMIZED-SELECT)', p:2, test:t=>/random/.test(t), hint:'This problem wants the deterministic median-of-medians version.'}],
  model:`SELECT(A, p, r, i)
    if p == r
        return A[p]
    pivot = MEDIAN-OF-MEDIANS(A, p, r)   // groups of 5
    q = PARTITION(A, p, r, pivot)
    k = q - p + 1
    if i == k
        return A[q]
    else if i < k
        return SELECT(A, p, q - 1, i)
    else
        return SELECT(A, q + 1, r, i - k)`},

 {id:'dice-expected', topic:'t05a', title:'Expected value of dice rolls',
  prompt:'Write <code>DICE-EXPECTED(n, s)</code> returning the expected sum of n rolls of a fair s-sided die (values 1..s), and <code>DICE-SIDE-EXPECTED(s)</code> for a single roll. Use the indicator-variable result E = n(s+1)/2.',
  starter:'DICE-SIDE-EXPECTED(s)\n    return \n\nDICE-EXPECTED(n, s)\n    return DICE-SIDE-EXPECTED(s) * n\n', define:['diceexpected','dicesideexpected'], call:['dice-side-expected'], maxLoop:0,
  correctness:[
   {label:'Single-roll expectation is (s + 1) / 2', w:4, test:t=>/\(\s*\w+\s*\+\s*1\s*\)\s*\/\s*2|\w+\s*\+\s*1\s*\/\s*2/.test(t), hint:'E[Xᵢ] sums i·(1/s) for i = 1..s = (s+1)/2'},
   {label:'n-roll expectation scales linearly', w:3, test:t=>/dice-?side-?expected\s*\(|n\s*\*\s*dice|dice-?expected\s*\([^)]*\)\s*\*\s*n|return\s+n\s*\*/.test(t), hint:'linearity: E[total] = n · E[one roll]'},
   {label:'Returns the formula, not a simulation', w:3, test:(t,P)=>P.maxLoop===0, hint:'Closed form — no loops needed.'}
  ],
  efficiency:[
   {label:'O(1) — closed-form answer', w:5, test:(t,P)=>P.maxLoop===0, hint:'Expected value is a formula, not a simulation.'}
  ],
  penalties:[{label:'Simulates rolls instead of using the formula', p:3, test:(t,P)=>P.maxLoop>0, hint:'E[Z] = n(s+1)/2 is closed-form; a loop is overkill.'}],
  model:`DICE-SIDE-EXPECTED(s)
    // indicator variables: X_i = I{roll shows i}, E[X_i] = 1/s
    // E[one roll] = sum_{i=1}^{s} i * (1/s) = (s+1)/2
    return (s + 1) / 2

DICE-EXPECTED(n, s)
    // linearity of expectation: n rolls, each contributes (s+1)/2
    return n * DICE-SIDE-EXPECTED(s)`},

 {id:'array-queue', topic:'t01', title:'Array-based FIFO queue',
  prompt:'Implement <code>ENQUEUE(Q, x)</code> and <code>DEQUEUE(Q)</code> for a queue stored in an array with head/tail indices (circular or with shifting — your choice).',
  starter:'ENQUEUE(Q, x)\n    \n\nDEQUEUE(Q)\n    \n', define:['enqueue','dequeue'], call:[], maxLoop:1,
  correctness:[
   {label:'ENQUEUE writes at the tail and advances it', w:3, test:t=>/q\s*\[|a\s*\[/.test(t) && /=\s*x\b/.test(t) && /(tail|rear)([^\n]*\+\s*1|\+\+)/.test(t), hint:'Q[tail] = x; tail = tail + 1'},
   {label:'DEQUEUE reads at the head and advances it', w:3, test:t=>/return\s+\w+\b|x\s*=\s*q\s*\[|x\s*=\s*a\s*\[/.test(t) && /(head|front)([^\n]*\+\s*1|\+\+)/.test(t), hint:'x = Q[head]; head = head + 1; return x'},
   {label:'Handles empty-queue underflow', w:2, test:t=>/empty|underflow|head\s*==\s*tail|error/.test(t), hint:'if head == tail → error "queue underflow"'}
  ],
  efficiency:[
   {label:'O(1) per operation (circular buffer or head/tail)', w:5, test:(t,P)=>P.maxLoop<=1, hint:'No shifting of elements — just index arithmetic.'}
  ],
  penalties:[{label:'Shifts all elements on dequeue (O(n))', p:3, test:t=>/for[^\n]*shift|while[^\n]*move/.test(t), hint:'Advance head instead of moving the array.'}],
  model:`ENQUEUE(Q, x)
    // circular buffer: write at tail, advance modulo capacity
    if Q.tail == Q.capacity        // full (circular)
        error "queue overflow"
    Q[Q.tail] = x
    Q.tail = (Q.tail + 1) mod Q.capacity

DEQUEUE(Q)
    if Q.head == Q.tail            // empty
        error "queue underflow"
    x = Q[Q.head]
    Q.head = (Q.head + 1) mod Q.capacity
    return x`}
);

// ======================= PROFESSOR'S CORNER — DEEPER EXPLANATIONS =======================
// Appended to the existing DEEP dives for weeks 1–6 topics.
const PROF = {
 t01: [
  ['Professor\'s corner: what "analyzing an algorithm" really means — a tutor\'s walkthrough', `<p>Forget the code for a second and ask what a recipe <i>is</i>. An algorithm is a finite, unambiguous procedure: finite steps, each one doable, that maps every legal input to an output. "Analyzing" it is two separate jobs, and confusing them is the #1 way students lose points.</p><p><b>Job 1 — correctness.</b> Prove the procedure produces the right answer for <i>every</i> input and actually terminates. "It worked on my test cases" is evidence, not proof. The tools you will use all semester: loop invariants (Topic 2), induction (Topic 3), exchange arguments (Topic 13). Termination matters too — an algorithm that is right but never stops is useless.</p><p><b>Job 2 — cost.</b> Pick the <b>input size</b> n — what are we counting? elements for sorting, vertices for graphs, bits for numbers. Pick the <b>cost model</b> — which primitive ops count as "one step". Then count how many steps the algorithm performs as a function of n. This is the RAM model underneath everything: each basic operation (arithmetic, comparison, memory access, assignment) costs 1 step, memory is free and instant. Real machines violate all of that; the model exists so "steps" is a well-defined number we can compare across algorithms.</p><p><b>A micro-example to hold onto.</b> LINEAR-SEARCH(x, A) has lines with costs c₁..c₄ and execution counts t₁..t₄ that depend on fx(n), the position of x. Summing gives T(n) = fx(n)(c₁+c₂) + c₃ when found — the exercise makes you write this table by hand. That bookkeeping feels pedantic because it is: sloppy counting produces sloppy big-O claims later, and Topic 3 is entirely about cleaning up what you counted here.</p><p><b>The three words to keep:</b> input size, cost model, growth rate. You discard constants and lower-order terms at the end — but only AFTER the exact count exists. Never write O(f(n)) until T(n) is on paper.</p><p><b>References:</b> CLRS Ch. 1–2 (what an algorithm is, the RAM model, and §2.2 analyzing insertion sort line-by-line — the canonical cost table), Topic 1 lecture notes, screencasts <b>04A · Stacks, Queues, Lists</b> / <b>04B · Trees and Dynamic Sets</b> for the data-structure half of week 1, and <b>02A–02C</b> for the first real cost analysis. Practice: <b>PS1</b> covers Topics 1, 3 &amp; 4 — its stack/queue and tree problems drill exactly the structures this topic introduces.</p>`]
 ],
 t03: [
  ['Professor\'s corner: Exercise 1 — cost accounting for Find(), done slowly', `<p>The exercise hands you a linear-search-style procedure and asks for its cost <i>as a function of fx(n)</i> — the position where x sits (or n+1 when absent). Here is the bookkeeping, row by row.</p><p>Make a table: one row per line of code, its unit cost cᵢ, and tᵢ = how many times it executes. The loop test runs once per element checked <b>plus one final failing check</b>: fx(n) times when x is found, n+1 times when absent. The body runs fx(n) or n times. The return runs once iff found. Summing: found case T(n) = fx(n)(c₁+c₂) + c₃; absent case T(n) = (n+1)c₁ + nc₂ + c₄. Collect constants into a and b.</p><p>Now the asymptotic move that makes this whole topic tick: <b>fx(n) is an unknown between 1 and n+1 — bound it.</b> Worst case fx(n) = n+1 ⇒ T(n) = an + b = Θ(n). Best case fx(n) = 1 ⇒ T(n) = Θ(1). Same algorithm, two different answers — which is exactly why cost questions always ask "for which inputs?". Had you written "O(n)" immediately you would have the right worst case but no idea the best case is constant.</p><p><b>The reusable three-step pattern:</b> (1) write the exact T(n) with the input-dependent quantity explicit; (2) bound that quantity by the extremes the input allows; (3) only then simplify to Θ/O/Ω. Every analysis problem this semester is this pattern in a bigger costume.</p><p><b>References:</b> CLRS §3.1–3.2 (the notations you will bound with), §2.2 (the identical line-by-line cost table for insertion sort), Topic 3 lecture notes' Exercise 1, screencasts <b>03A–03D</b> and <b>MIT Lecture 02</b>. Practice: <b>PS2 · Problem 6</b> asks for this same cost accounting on binary search — and its loop invariant while you're at it.</p>`],
  ['Professor\'s corner: Exercise 2 — the comparison table, pair by pair', `<p>The exercise is a table of function pairs (f, g) and for each you must decide O, Ω, Θ, o, ω — possibly several at once. Do not guess; use one of two mechanical tests.</p><p><b>Test 1 — the ratio.</b> Compute lim<sub>n→∞</sub> f(n)/g(n): limit 0 ⇒ f = o(g) (and therefore O(g)); finite positive constant ⇒ f = Θ(g); limit ∞ ⇒ f = ω(g) (and Ω(g)). <b>Test 2 — constants.</b> Find c₁, c₂ with c₁g(n) ≤ f(n) ≤ c₂g(n) for all large n ⇒ Θ; one-sided versions give O or Ω. When f = g exactly, all of O, Ω, Θ hold and BOTH little-o and little-ω fail — that combination is a favorite exam trick.</p><p>Walk three representative pairs slowly. <b>n vs n lg n:</b> n/(n lg n) = 1/lg n → 0, so n = o(n lg n) — the smaller function loses. <b>n^(log c) vs c^(log n):</b> take logs — log(n^(log c)) = (log c)(log n) = log(c^(log n)) — they are <i>identical</i>, so Θ holds; this is the classic "looks different, is the same" trap. <b>log(n!) vs log(nⁿ):</b> Stirling gives log(n!) = n log n − n log e + O(log n) = Θ(n log n), while log(nⁿ) = n log n — again Θ-equal.</p><p><b>Memorize the ladder</b> — any two rungs compare instantly: constants &lt; log log n &lt; log n &lt; n^ε &lt; n &lt; n lg n &lt; n² &lt; … &lt; aⁿ &lt; n! &lt; nⁿ. And the implication to never misuse: f = o(g) ⇒ f = O(g), but O does NOT imply o — little-o is strictly stronger.</p><p><b>References:</b> CLRS §3.1–3.5 (definitions, the limit intuition, and §3.3's growth-rate ladder — this exercise's answer key), Topic 3 lecture notes' Exercise 2, screencasts <b>03A–03D</b>, <b>MIT Lecture 02</b>. PS1 (Topics 1, 3 &amp; 4) folds growth-rate comparisons into its mixed review.</p>`]
 ],
 t02: [
  ['Professor\'s corner: Exercise 2 — the loop-invariant proof, obligation by obligation', `<p>A <b>loop invariant</b> is a property that is true before the loop starts, stays true after every iteration, and — the part students always forget — is <b>useful when the loop exits</b>. It is induction wearing a loop's clothes: prove it once and termination hands you the theorem for free.</p><p>For LINEAR-SEARCH(x, A) the guess is "x is not in A[1..i−1]". Why this one? After i iterations every examined slot failed the equality test, so x cannot hide in the checked prefix — and if the loop finishes without finding x, that prefix IS the whole array. Now check the three obligations slowly:</p><ul class="clean"><li><b>Init:</b> before iteration 1 the checked range is A[1..0] — empty. Vacuously true.</li><li><b>Maintenance:</b> suppose the invariant holds at iteration i. The test just compared A[i] to x; reaching i+1 means A[i] ≠ x was verified, and the invariant already excluded A[1..i−1], so x ∉ A[1..i]. Preserved.</li><li><b>Termination:</b> two exits. If A[i] = x we return i — correct by the test itself. If i reaches n+1, the invariant says x ∉ A[1..n], so returning −1 ("absent") is provably correct. ∎</li></ul><p><b>Why this invariant and not "the prefix is sorted"?</b> Because at termination it must IMPLY the postcondition. "Sorted" may be true and still say nothing about whether x was found. The guess comes from asking one question: "what have I verified so far?" — here, every examined slot failed.</p><p><b>The cost side of the same exercise:</b> build the cᵢ/tᵢ table — the test executes n+1 times worst case (the extra failing check!), the body n times — giving T(n) = Θ(n) worst, Θ(1) best when x sits at A[1]. Report worst case unless asked otherwise; it is the guarantee.</p><p><b>References:</b> CLRS §2.1–2.2 (insertion sort's loop-invariant proof is the canonical template — init/maintenance/termination verbatim), Topic 2 lecture notes' Exercise 2, screencasts <b>02A–02C</b> and <b>MIT Lecture 01</b>. Practice: <b>PS2 · Problem 6</b> asks for binary search's loop invariant — same three obligations, different guess.</p>`],
  ['Professor\'s corner: the nested-loop runtime — count honestly, then sandwich', `<p>Nested loops are counted by summation, not multiplication — unless the inner count really is n for every i. The exercise's inner loop runs a number of times that depends on the outer index; call it t(i). The total is c·Σᵢ t(i), a plain sum you must actually evaluate or bound.</p><p>Here the inner loop executes about n − i + 1 iterations for outer index i (it starts near i and walks toward n). So f(n) = c·Σᵢ₌₁ⁿ (n − i + 1) = c·(n + (n−1) + … + 1) = c·n(n+1)/2 = Θ(n²). That sum is the <b>triangular number</b> — recognize it on sight; it appears constantly.</p><p><b>Sandwich it to be safe.</b> Upper bound: each outer iteration does ≤ n inner steps, n outer iterations ⇒ O(n²). Lower bound: the first n/2 outer iterations each do ≥ n/2 inner steps ⇒ Ω(n²). Both bounds agree: Θ(n²). When they disagree you have only O or only Ω — and reporting "O(n²)" as if it were the answer is the classic exam trap.</p><p><b>General recipe for nested loops:</b> (1) write t(i) for the inner count honestly; (2) sum exactly when possible — arithmetic series, geometric series, triangular numbers; (3) when not, bound above AND below. Never multiply n·n unless the inner body truly runs n times per outer iteration.</p><p><b>References:</b> CLRS §2.2 (the cost summation T(n) = Σ cᵢtᵢ, with insertion sort's own double loop as the model), Topic 2 lecture notes, screencasts <b>02A–02C</b>. PS2 (Topics 2 &amp; 7) has runtime-analysis problems in exactly this style.</p>`]
 ],
 t07: [
  ['Professor\'s corner: Exercise 3 — stupid_sort\'s recurrence, all three methods', `<p>stupid_sort is the exercise that teaches you recurrences <i>hurt</i>: T(n) = 3T(n/3) + Θ(n²). The three recursive calls on n/3-sized pieces are the divide; the double loop over all i, j pairs is the combine — and the combine is quadratic, which will dominate everything. Here are all three solution methods, since the course requires each.</p><p><b>Method 1 — recursion tree.</b> Level 0: one node paying cn². Level 1: three nodes each paying c(n/3)² = cn²/9, level total cn²/3. Level d: 3^d nodes × c(n/3^d)² = cn²/3^d. Level sums form a geometric series: cn²(1 + 1/3 + 1/9 + …) = cn²·(1/(1−1/3)) = (3/2)cn² = Θ(n²). The tree has log₃ n levels; work per level shrinks by factor 3 while node count grows by 3 — the shrink wins. Visualize it with the recursion-tree method before touching formulas.</p><p><b>Method 2 — substitution.</b> Guess T(n) ≤ c′n² (the tree already showed the shape). Inductive step: T(n) ≤ 3·c′(n/3)² + cn² = (c′/3 + c)n². Need c′/3 + c ≤ c′, i.e. c′ ≥ (3/2)c. Choose c′ = (3/2)c — and verify base cases n = 3..8 BY HAND. The exercise makes you do those finite checks explicitly because an asymptotic proof never covers them; that tedium is the point.</p><p><b>Method 3 — Master theorem.</b> a = 3, b = 3 ⇒ n^(log₃ 3) = n¹. Compare f(n) = n²: since n¹ = O(n^(2−ε)) with ε = 1, case 3 applies — <i>provided</i> regularity holds: f(n)/n^(log_b a) = n → ∞ polynomially, and 3f(n/3) = n²/3 ≤ (1/3)f(n). Both conditions check out. Answer: Θ(n²) — the combine cost beats the recursion. Contrast merge sort (T = 2T(n/2) + Θ(n)): there n¹ vs f(n) = n hits case 2 and gives Θ(n lg n). Same machinery, different case.</p><p><b>References:</b> CLRS §4.3 (substitution), §4.4 (recursion trees), §4.5 (the Master theorem and its regularity condition), Topic 7 lecture notes' Exercise 3, screencasts <b>07A–07D</b> and <b>02D–02E</b> (merge sort as the healthy contrast), <b>MIT Lectures 02–03</b>. Practice: <b>PS2 · Problem 7(a)</b> — local maximum in Θ(lg n) — is divide-and-conquer with a leaner recurrence.</p>`]
 ],
 t09: [
  ['Professor\'s corner: Exercise 4 — why ternary heaps stay Θ(log n)', `<p>MAX-HEAPIFY walks down ONE root-to-leaf path, choosing the largest child at each step — so its cost is the tree's height. For a binary heap that is ⌊lg n⌋; the exercise asks you to redo all the index arithmetic for a <b>ternary</b> heap and show the answer class survives.</p><p><b>Index arithmetic first.</b> Children of i: 3i−1, 3i, 3i+1 (the +1 keeps boundaries clean); parent: ⌊(i+1)/3⌋. Same array layout as binary heaps, one extra child slot. Write these down before anything else — half the exercise is getting them right.</p><p><b>The recurrence — where it gets interesting.</b> In a ternary heap the worst subtree is the <b>left</b> child 3i−1, because it gets one extra level of descendants. Count vertices carefully: if the middle and right subtrees hold x vertices of height h each, the left subtree holds x + (2x + 1) = 3x + 1 vertices (its own descendants plus two extra levels). Total n = x + x + (3x+1) = 5x + 2, so the largest recursive call runs on 3x + 1 ≤ 3n/5 vertices. Thus T(n) = T(3n/5) + Θ(1) per level of descent.</p><p><b>Solving it two ways.</b> Recursion tree: depth is log_{5/3} n = Θ(log n) — the constant changed (log base 5/3 vs 2), the class didn't. Master theorem: a = 1, b = 5/3 ⇒ n^(log_{5/3} 1) = n⁰ = 1, and f(n) = Θ(1) = Θ(n⁰) hits case 2 ⇒ Θ(log n). Substitution with T(n) ≤ c·log n works too — the exercise shows both. This "recompute the indices, keep the answer" pattern is exactly what exams probe.</p><p><b>Don\'t forget BUILD-HEAP.</b> It stays Θ(n) by the same level-sum argument as binary heaps — most nodes are leaves where heapify costs O(1), and the sum over heights is geometric. State it explicitly.</p><p><b>References:</b> CLRS §6.2 (MAX-HEAPIFY), §6.3 (BUILD-MAX-HEAP — the level-sum proof), Topic 9 lecture notes' Exercise 4, screencasts <b>09A–09D</b>. Practice: <b>PS3 · Problems 1–2</b> — largest-k with a heap and MAX-HEAP-INSERT — use the same sift machinery on the binary version.</p>`]
 ],
 t08: [
  ['Professor\'s corner: Exercise 5 — proving the successor lemma, case by case', `<p><b>Setup you must internalize first.</b> The BST property: every key in a node\'s left subtree is smaller, every key in its right subtree is larger. BST-SUCCESSOR(x) has two cases — if x.right exists, go right once then all the way left (that node has no left child by construction); otherwise climb parents until you arrive from a left child, and that parent is the successor.</p><p><b>The lemma:</b> if x has two children, succ(x) has NO left child. Suppose for contradiction S = succ(x) has a left child Y. Then x.key &lt; Y.key &lt; S.key — so Y is a smaller key still bigger than x, and S was never the successor. Now eliminate every place S could hide:</p><ul class="clean"><li><b>S is not an ancestor of x:</b> if x sat in S\'s left subtree, the right child Z of x satisfies x.key &lt; Z.key &lt; S.key — contradiction; if x sat in S\'s right subtree, BST property forces S.key &lt; x.key — contradiction.</li><li><b>S is not a cousin:</b> cousins share an ancestor A with x.key &lt; A.key &lt; S.key — again S couldn\'t be minimal-greater.</li><li>So S is a <b>descendant</b> — hence in x\'s right subtree (the left holds only keys &lt; x.key). If S had a left child Y, then x.key &lt; Y.key &lt; S.key — but then Y, not S, is the successor. ∎</li></ul><p><b>Why delete cares:</b> BST-DELETE\'s two-children case finds y = SUCCESSOR(z), transplants y into z\'s position, moves z\'s children under y, copies z.key. Because y is guaranteed to have no left child, y\'s right subtree (if any) splices in with ONE TRANSPLANT — no recursion, O(h) total. Without this lemma the delete procedure would need a second fix-up pass.</p><p><b>References:</b> CLRS §12.2 (SEARCH/MIN/MAX), §12.3 (SUCCESSOR/PREDECESSOR and DELETE with TRANSPLANT — the lemma is the structural fact the pseudocode silently relies on), Topic 8 lecture notes' Exercise 5, screencasts <b>08B · BST Queries</b>, <b>08C · Modifying BST</b>, <b>08D · Analyzing BST</b>. The Topic 11 supplement pages pick up exactly where this leaves off — balancing is what keeps h = Θ(lg n) instead of Θ(n).</p>`]
 ],
 t05a: [
  ['Professor\'s corner: Exercise 7 — expectations and indicator variables, fully walked', `<p><b>Part 1 — plain expectation.</b> E[X] = Σ x·Pr[X = x] is just a weighted average over outcomes. For the exercise\'s variable — 5, 10, or 15 with probabilities 3/5, 1/5, 1/5 — that is 5·(3/5) + 10·(1/5) + 15·(1/5) = 3 + 2 + 3 = 8. Notice you never "run" the experiment; you average over all possibilities.</p><p><b>Part 2 — the dice, where indicators earn their keep.</b> Roll an s-sided die n times. Let Xᵢⱼ = I{roll j shows face i} — the indicator is 1 if it does, 0 otherwise. The total showing face i is Σⱼ Xᵢⱼ, so its expectation is E[Σⱼ Xᵢⱼ].</p><p><b>Two facts do ALL the work:</b> (1) <b>E[I{event}] = Pr[event]</b> — the variable equals 1 exactly when the event happens, so its average IS the probability. (2) <b>Linearity of expectation: E[ΣXᵢ] = ΣE[Xᵢ] — ALWAYS, even when the variables are dependent.</b> Dependence breaks products E[XY] = E[X]E[Y]; it never breaks sums. That single fact is the engine of every randomized-analysis problem this semester.</p><p>Apply it: E[Xᵢⱼ] = Pr[face i on roll j] = 1/s. Sum over faces and rolls: E[total] = Σⱼ Σᵢ i·(1/s) = n·(1/s)·(1+2+…+s) = n(s+1)/2. Sanity check: for n = 1 this recovers the single-roll mean (s+1)/2 — the formula is consistent at the boundary.</p><p><b>References:</b> CLRS §5.1–5.3 (the hiring problem, randomized algorithms, and exactly this indicator technique for linear search\'s (n+1)/2), Topic 5A lecture notes' Exercise 7, screencasts <b>05A · Indicator Random Variables</b> and <b>05B · Example: Expected Inversions</b>. PS4 (Topics 5A &amp; 11) applies expectations to randomized tree algorithms.</p>`]
 ],
 t05b: [
  ['Professor\'s corner: Exercise 8 — expected linear search and quickselect, side by side', `<p>Two expected-cost arguments live here, and both are "count the possibilities, then average".</p><p><b>Permutation search.</b> A uniform random permutation of 1..n hides k at some position Y. Define Xᵢ = I{A[i] = k}. How likely is A[i] = k? Fix A[i] = k: the remaining n−1 elements permute freely, giving (n−1)! arrangements out of n! total ⇒ Pr = (n−1)!/n! = 1/n. The position is Y = Σᵢ i·Xᵢ (exactly one Xᵢ equals 1), so E[Y] = Σᵢ i·(1/n) = (n+1)/2 — linear search examines half the array on average. Indicator variables again: no independence required anywhere.</p><p><b>Randomized-Select (quickselect).</b> PARTITION around a uniformly random pivot p; its rank k = q − p + 1 tells you exactly which side contains the i-th smallest. Recurse on ONE side — the one holding rank i. Why expected O(n)? Each round discards everything on the wrong side of a random pivot; the pivot lands in the middle half with probability ≥ 1/2, so the problem shrinks by a constant factor in expectation. Same skeleton as quicksort but ONE recursive call instead of two ⇒ O(n) expected vs O(n lg n).</p><p><b>The contrast to memorize:</b> RANDOMIZED-SELECT\'s pivot is random ⇒ expected bounds only (worst case still O(n²), with tiny probability). SELECT via median-of-medians (Topic 10A) picks a pivot <i>guaranteed</i> near the middle ⇒ deterministic O(n). Randomness buys simplicity; determinism buys the guarantee. Exams love asking which bound belongs to which.</p><p><b>References:</b> CLRS Ch. 7 §7.3–7.4 (randomized quicksort — the same random-pivot analysis), Ch. 9 §9.2 (RANDOMIZED-SELECT), Topic 5B lecture notes' Exercise 8, screencasts <b>10A · Quicksort</b> and <b>10B · Quicksort Random Analysis</b>. PS5 (Topics 5B &amp; 6) · Problem 1(b, d) drills three-way partition — the primitive quickselect depends on.</p>`]
 ],
 t06: [
  ['Professor\'s corner: Exercise 9 — tombstones and the Θ(m) surprise, traced', `<p><b>The setup.</b> Open addressing probes h(k,0), h(k,1), … and STOPS at the first NIL — "empty slot ⇒ key absent". That assumption is what makes delete dangerous.</p><p><b>The bug, walked concretely.</b> m = 5 slots; suppose h(3) = h(8) = 3. INSERT 3 → lands at slot 3. INSERT 8 → slot 3 occupied, probes to slot 4. Now DELETE 3 by writing NIL at slot 3. SEARCH 8 probes slot 3 → NIL → reports "absent". But 8 is sitting right there at slot 4. The NIL you wrote cut the probe chain in half — every key that probed past slot 3 is now unreachable.</p><p><b>The fix — tombstones.</b> DELETE writes DELETED instead of NIL. Searches step OVER DELETED (the chain might continue); only a real NIL ends the probe. INSERT may reuse a DELETED slot — but ONLY after HASH-SEARCH confirms the key isn't already stored further down the chain, or you silently store duplicates.</p><p><b>The complexity twist the exercise is really after:</b> n counts LIVE keys, but a probe sequence can cross up to m tombstones. So DELETE is Θ(m) worst case — not Θ(n) — and INSERT degrades toward O(m) as tombstones pile up, until you rehash into a fresh table. Expected O(1) assumed α bounded away from 1 <i>and</i> few tombstones; state both assumptions on an exam.</p><p><b>References:</b> CLRS §11.2–11.3 (open addressing, linear probing, the tombstone discussion), §11.4 (the ½(1 + 1/(1−α)²) unsuccessful / ½(1 + 1/(1−α)) successful probe bounds — and why clustering makes them quadratic, not linear), Topic 6 lecture notes' Exercise 9, screencasts <b>06A–06D</b> (chaining vs open addressing) and <b>MIT Lectures 07–08</b>. Practice: <b>PS5 · Problem 2</b> — open-addressing insert with double hashing — is the same probe mechanics you'll be maintaining by hand.</p>`]
 ],
 t10a: [
  ['Professor\'s corner: Exercise 10 — median, pipelines, and guaranteed pivots', `<p>Three results, one theme: <b>selection is cheaper than sorting</b> — and the gap is provable. Walk each part.</p><p><b>Oil pipelines.</b> Wells at heights y₁..yₙ, pipe at height p: total spur length is Σ|yᵢ − p|. Move the pipe by d: wells above gain d each, wells below lose d each — net change d·(#below − #above). This is ≥ 0 exactly while #below ≥ #above, i.e. until p sits at a median. So the median minimizes spur length, and SELECT finds it in O(n). For even n, ANY p between the two middle wells is optimal — a range of answers, not a point.</p><p><b>QUICKSORT′ — deterministic O(n lg n).</b> Ordinary quicksort\'s worst case is sorted input (pivot = extreme). Fix: choose the TRUE median via SELECT as pivot — every partition splits n/2 vs n/2, so T(n) = 2T(n/2) + O(n) = O(n lg n) <i>guaranteed</i>, no randomization needed. The extra O(n) SELECT per level is absorbed into the recurrence.</p><p><b>The recurrence T(n) = T(n/5) + T(2n/3) + cn.</b> Subproblem sizes sum to 13n/15 &lt; n — geometrically shrinking, the same signature as median-of-medians. Guess T(n) = c′n (linear, since work shrinks geometrically): need c′/5 + 2c′/3 + c ≤ c′ ⇒ c′·(1 − 1/5 − 2/3) ≥ c ⇒ c′·(2/15) ≥ c ⇒ c′ ≥ 15c/2. Pick c′ = 15c/2 and verify bases by substitution — answer Θ(n). Recognize the pattern: "subproblems shrink by a constant factor ⇒ linear total" is the fingerprint of SELECT-style algorithms.</p><p><b>References:</b> CLRS Ch. 9 §9.1–9.2 (min/max, the selection lower bound, RANDOMIZED-SELECT), §9.3 (MEDIAN-OF-MEDIANS — the guaranteed 30/70 pivot split), Topic 10A lecture notes' Exercise 10, <b>MIT Lecture 06: Order Statistics, Median</b>, <b>PS6 · Problems 1–2</b> (k smallest via selection; k-th largest using MEDIAN — the exact tools above).</p>`]
 ]
};
Object.keys(PROF).forEach(id => { if (DEEP[id] && DEEP[id].deep) DEEP[id].deep.push(...PROF[id]); });

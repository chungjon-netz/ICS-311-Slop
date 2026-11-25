// ======================= MT4 LEARNING PATH: GENERATED UNIT TESTS =======================
// Each unit ends with a pseudocode problem that MODIFIES an algorithm from the unit
// (early exit, extra memory, a faster data structure…). LEARN_GEN[unit] is a list of
// variant factories; each call picks a story and parameters, and returns a challenge
// object in the same format as CODE (graded by gradeCode in grader.js).
const lgPick = a => a[Math.floor(Math.random() * a.length)];
const lgRx = re => t => re.test(t);
const lgIn = (names, re) => (t, P) => re.test(P.body(names));
const lgCount = (names, re, n) => (t, P) => (P.body(names).match(new RegExp(re.source, 'g')) || []).length >= n;
const lgNoSelfCall = (name, pat) => (t, P) => P.hasFn(name) && !new RegExp('\\b' + pat + '\\s*\\(').test(P.body(name));

const LEARN_GEN = {
 greedy: [
  () => { const ctx = lgPick(['a text-compression service whose character counts are produced already sorted', 'a sensor network that reports symbol frequencies in non-decreasing order', 'a file-format team that keeps frequency tables sorted on disk']);
   return {id: 'learn-huffman-sorted', topic: 't13', title: 'Θ(n) Huffman for pre-sorted frequencies',
    prompt: `In <b>${ctx}</b>, the n frequencies arrive sorted: C[1..n] is in non-decreasing order of freq. Modify HUFFMAN so it runs in <b>Θ(n)</b> instead of Θ(n lg n): replace the min-priority queue with <b>two FIFO queues</b>. Q1 holds the leaves in order; Q2 receives the merged nodes (they are created in non-decreasing order, so Q2 stays sorted too). Write <code>HUFFMAN-SORTED(C, n)</code> and a helper <code>TAKE-MIN(Q1, Q2)</code> that removes and returns the smaller front element.`,
    starter: 'HUFFMAN-SORTED(C, n)\n    \n\nTAKE-MIN(Q1, Q2)\n    \n', define: ['huffmansorted', 'takemin'], call: ['take-min', 'enqueue', 'dequeue'], maxLoop: 1,
    correctness: [
     {label: 'Performs n − 1 merges', w: 2, test: lgRx(/n\s*-\s*1/), hint: 'for i = 1 to n − 1'},
     {label: 'Takes the two smallest trees each round', w: 2, test: lgCount('huffmansorted', /take-?min\s*\(/, 2), hint: 'x = TAKE-MIN(Q1, Q2); y = TAKE-MIN(Q1, Q2)'},
     {label: 'New node frequency is the sum', w: 2, test: lgRx(/freq\s*=\s*\w+\.freq\s*\+\s*\w+\.freq/), hint: 'z.freq = x.freq + y.freq'},
     {label: 'Links both children', w: 1, test: t => /\.left\s*=/.test(t) && /\.right\s*=/.test(t), hint: 'z.left = x; z.right = y'},
     {label: 'Merged node goes into the second queue', w: 2, test: lgRx(/enqueue\s*\(\s*q2/), hint: 'ENQUEUE(Q2, z)'},
     {label: 'TAKE-MIN handles an empty queue and compares the fronts', w: 2, test: lgIn('takemin', /empty/) , hint: 'if Q2 is empty return DEQUEUE(Q1) … compare HEAD(Q1).freq with HEAD(Q2).freq'},
     {label: 'Returns the root', w: 1, test: lgIn('huffmansorted', /\breturn\b/), hint: 'return TAKE-MIN(Q1, Q2)'}],
    efficiency: [
     {label: 'No heap / priority queue (that is the Θ(n lg n) part)', w: 5, test: t => !/heap|priority|extractmin/.test(t), hint: 'Two sorted FIFO queues replace the heap.'},
     {label: 'TAKE-MIN is O(1): no loops', w: 5, test: (t, P) => P.hasFn('takemin') && !(P.fn('takemin').maxLoop), hint: 'Only compare the two fronts.'}],
    penalties: [{label: 'Re-sorts inside the algorithm', p: 3, test: lgRx(/\bsort\s*\(|\bsort\s+(c|q|the)\b/), hint: 'The input is already sorted.'}],
    model: `HUFFMAN-SORTED(C, n)          // C sorted by freq; Θ(n) with two FIFO queues
    Q1 = queue of the n leaves, in the order of C
    Q2 = empty queue               // merged nodes appear in non-decreasing order
    for i = 1 to n - 1
        x = TAKE-MIN(Q1, Q2)
        y = TAKE-MIN(Q1, Q2)
        z = new node
        z.left = x
        z.right = y
        z.freq = x.freq + y.freq
        ENQUEUE(Q2, z)
    return TAKE-MIN(Q1, Q2)        // the root of the code tree

TAKE-MIN(Q1, Q2)                  // O(1): smaller of the two fronts
    if Q2 is empty
        return DEQUEUE(Q1)
    if Q1 is empty
        return DEQUEUE(Q2)
    if HEAD(Q1).freq <= HEAD(Q2).freq
        return DEQUEUE(Q1)
    return DEQUEUE(Q2)`}; },
  () => { const c = lgPick([2, 3, 5, 10]), ctx = lgPick(['a vending machine', 'an arcade token dispenser', 'a transit-card kiosk']);
   return {id: 'learn-change-counts', topic: 't13', title: 'Greedy change that remembers each coin used',
    prompt: `<b>${ctx[0].toUpperCase() + ctx.slice(1)}</b> uses coins d[1..k] = 1, ${c}, ${c}², …, ${c}^(k−1) (powers of ${c}, so greedy is optimal). Modify GREEDY-CHANGE so it also <b>remembers how many of each coin</b> it used. Write <code>CHANGE-WITH-COUNTS(n, d, k)</code> that returns the array used[1..k] and the total number of coins, in Θ(k).`,
    starter: 'CHANGE-WITH-COUNTS(n, d, k)\n    \n', define: ['changewithcounts'], call: [], maxLoop: 1,
    correctness: [
     {label: 'Allocates the used[] array', w: 1, test: lgRx(/used/), hint: 'let used[1..k] be a new array'},
     {label: 'Goes from the largest coin down', w: 2, test: lgRx(/downto|step\s*-\s*1|,\s*-\s*1\s*\)/), hint: 'for i = k downto 1'},
     {label: 'Takes as many of the coin as fit (division)', w: 3, test: lgRx(/used\s*\[\s*\w+\s*\]\s*=[^\n]*n\s*(\/|div|\/\/)/), hint: 'used[i] = ⌊n / d[i]⌋'},
     {label: 'Keeps the remainder', w: 2, test: lgRx(/\bmod\b|%|n\s*=\s*n\s*-/), hint: 'n = n mod d[i]'},
     {label: 'Accumulates the total', w: 1, test: lgRx(/total\s*=\s*total\s*\+|total\s*\+=/), hint: 'total = total + used[i]'},
     {label: 'Returns the counts and the total', w: 1, test: lgRx(/return[^\n]*used/), hint: 'return (used, total)'}],
    efficiency: [
     {label: 'One iteration per denomination: Θ(k)', w: 5, test: (t, P) => P.maxLoop <= 1 && !/while[^\n]*n\s*>=/.test(t), hint: 'Never subtract one coin at a time.'},
     {label: 'Uses division and mod', w: 5, test: lgRx(/\bmod\b|%|\bdiv\b|\/\//), hint: '⌊n / d⌋ coins in one step.'}],
    model: `CHANGE-WITH-COUNTS(n, d, k)     // d = 1, c, c^2, ...; Θ(k)
    let used[1..k] be a new array
    total = 0
    for i = k downto 1              // largest coin first (greedy choice)
        used[i] = ⌊n / d[i]⌋         // remember how many of this coin
        n = n mod d[i]
        total = total + used[i]
    return (used, total)`}; }
 ],
 bfs: [
  () => { const [ctx, s, t] = lgPick([['a subway map', 'Ala Moana', 'UH Mānoa'], ['a social network', 'you', 'a recruiter'], ['a game level graph', 'spawn', 'exit']]);
   return {id: 'learn-bfs-path', topic: 't14a', title: 'BFS with early exit and path memory',
    prompt: `On <b>${ctx}</b> (unweighted graph, adjacency lists), we only care about the fewest-hop route from <b>${s}</b> (vertex s) to <b>${t}</b> (vertex t). Modify BFS so it <b>stops as soon as t is discovered</b> and returns the actual path s ⇝ t, reconstructed from the π pointers (or NIL if t is unreachable). Write <code>BFS-PATH(G, s, t)</code> and <code>BUILD-PATH(s, t)</code>.`,
    starter: 'BFS-PATH(G, s, t)\n    \n\nBUILD-PATH(s, t)\n    \n', define: ['bfspath', 'buildpath'], call: ['enqueue', 'dequeue', 'build-path'], maxLoop: 2,
    correctness: [
     {label: 'Initializes every vertex (unvisited, π = NIL)', w: 1, test: lgRx(/(visited|color|\.d)\s*=\s*(false|white|inf)/), hint: 'u.visited = false; u.π = NIL'},
     {label: 'Runs BFS with a FIFO queue from s', w: 2, test: t => /enqueue\s*\(\s*\w+\s*,\s*s\s*\)/.test(t) && /dequeue/.test(t), hint: 'ENQUEUE(Q, s); u = DEQUEUE(Q)'},
     {label: 'Records the parent on discovery', w: 2, test: lgRx(/\.(pi|parent)\s*=\s*u\b/), hint: 'v.π = u'},
     {label: 'Stops as soon as t is found', w: 2, test: lgRx(/if\s+\(?\s*\w+\s*==\s*t\b/), hint: 'if v == t: return BUILD-PATH(s, t)'},
     {label: 'BUILD-PATH walks the π pointers back from t', w: 2, test: lgIn('buildpath', /=\s*\w+\.(pi|parent)/), hint: 'x = x.π until NIL'},
     {label: 'Reports an unreachable target', w: 1, test: lgIn('bfspath', /return\s+(nil|null|none|false|-1|"no)/), hint: 'return NIL after the queue empties'}],
    efficiency: [
     {label: 'Marks vertices when DISCOVERED (each enqueued once)', w: 5, test: lgRx(/if[^\n]*(not\s+\w+\.visited|white|==\s*false|==\s*inf|!\s*\w+\.visited)/), hint: 'Only enqueue undiscovered vertices.'},
     {label: 'Uses adjacency lists, not a scan of all vertices per step', w: 5, test: lgRx(/adj/), hint: 'for each v in G.Adj[u]'}],
    penalties: [{label: 'Scans all vertices for every dequeued vertex (Θ(V²))', p: 3, test: (t, P) => P.lines.some(l => l.loopDepth >= 1 && /\b(for|foreach)\b[^\n]*(g\.v|vertices)/.test(l.t)), hint: 'Iterate over G.Adj[u] instead.'}],
    model: `BFS-PATH(G, s, t)               // stops early; O(V + E) worst case
    for each vertex u in G.V
        u.visited = false
        u.π = NIL
    s.visited = true
    Q = empty queue
    ENQUEUE(Q, s)
    while Q is not empty
        u = DEQUEUE(Q)
        for each v in G.Adj[u]
            if not v.visited                  // first discovery
                v.visited = true
                v.π = u
                if v == t
                    return BUILD-PATH(s, t)   // early exit
                ENQUEUE(Q, v)
    return NIL                        // t is unreachable

BUILD-PATH(s, t)                   // O(path length), uses the π memory
    path = empty list
    x = t
    while x != NIL
        add x to the front of path
        x = x.π
    return path`}; },
  () => { const ctx = lgPick(['a road network where every road takes one hour', 'a network of routers with unit-latency links', 'a friendship graph']);
   return {id: 'learn-bfs-count', topic: 't14a', title: 'BFS that counts shortest paths (memoized counts)',
    prompt: `In <b>${ctx}</b>, we need not only δ(s, v) but also <b>how many different shortest paths</b> reach each vertex. Modify BFS so every vertex keeps a count: count[s] = 1, and each u at distance d adds its count to every neighbour at distance d + 1. Write <code>COUNT-SHORTEST-PATHS(G, s)</code> in Θ(V + E).`,
    starter: 'COUNT-SHORTEST-PATHS(G, s)\n    \n', define: ['countshortestpaths'], call: ['enqueue', 'dequeue'], maxLoop: 2,
    correctness: [
     {label: 'Distances start at ∞ and counts at 0', w: 2, test: t => /\.d\s*=\s*inf|d\s*\[\s*\w+\s*\]\s*=\s*inf/.test(t) && /count[^\n]*=\s*0/.test(t), hint: 'u.d = ∞; u.count = 0'},
     {label: 'Source has distance 0 and count 1', w: 2, test: t => /s\.d\s*=\s*0|d\s*\[\s*s\s*\]\s*=\s*0/.test(t) && /s\.count\s*=\s*1|count\s*\[\s*s\s*\]\s*=\s*1/.test(t), hint: 's.d = 0; s.count = 1'},
     {label: 'Discovers new vertices at distance u.d + 1', w: 2, test: lgRx(/(\.d|d\s*\[\s*\w+\s*\])\s*=\s*(\w+\.d|d\s*\[\s*u\s*\])\s*\+\s*1/), hint: 'v.d = u.d + 1'},
     {label: 'Adds u.count when u is on a shortest path to v', w: 3, test: lgRx(/count[^\n]*=[^\n]*count[^\n]*\+[^\n]*count|count[^\n]*\+=[^\n]*count/), hint: 'if v.d == u.d + 1: v.count = v.count + u.count'},
     {label: 'Checks the distance relation v.d == u.d + 1', w: 1, test: lgRx(/==\s*(\w+\.d|d\s*\[\s*u\s*\])\s*\+\s*1/), hint: 'if v.d == u.d + 1'}],
    efficiency: [
     {label: 'Each vertex enqueued once (on first discovery)', w: 5, test: lgRx(/if[^\n]*==\s*inf/), hint: 'Enqueue only when v.d == ∞.'},
     {label: 'Single BFS pass, Θ(V + E)', w: 5, test: (t, P) => P.maxLoop <= 2 && /adj/.test(t), hint: 'No repeated BFS per vertex.'}],
    model: `COUNT-SHORTEST-PATHS(G, s)       // BFS + memoized path counts; Θ(V + E)
    for each vertex u in G.V
        u.d = ∞
        u.count = 0
    s.d = 0
    s.count = 1
    Q = empty queue
    ENQUEUE(Q, s)
    while Q is not empty
        u = DEQUEUE(Q)
        for each v in G.Adj[u]
            if v.d == ∞                  // first discovery
                v.d = u.d + 1
                ENQUEUE(Q, v)
            if v.d == u.d + 1            // u lies on a shortest path to v
                v.count = v.count + u.count
    return the count fields`}; },
  () => ({id: 'learn-dfs-stack', topic: 't14a', title: 'DFS without recursion (explicit stack + cursor memory)',
    prompt: `Deep recursion can overflow the call stack on a ${lgPick(['million-vertex web crawl', 'long chain of dependencies', 'maze with a very long corridor'])}. Modify DFS to use an <b>explicit stack</b> and still produce the same discovery and finish times. Each vertex remembers a cursor u.next into its adjacency list, so every edge is examined once. Write <code>DFS-STACK(G)</code>, <code>VISIT-STACK(G, s)</code> and <code>NEXT-WHITE(G, u)</code>.`,
    starter: 'DFS-STACK(G)\n    \n\nVISIT-STACK(G, s)\n    \n\nNEXT-WHITE(G, u)\n    \n', define: ['dfsstack', 'visitstack', 'nextwhite'], call: ['push', 'pop', 'next-white', 'visit-stack'], maxLoop: 2,
    correctness: [
     {label: 'Colors every vertex white and resets the clock', w: 1, test: t => /white/.test(t) && /time\s*=\s*0/.test(t), hint: 'u.color = WHITE; time = 0'},
     {label: 'Restarts from every white vertex', w: 1, test: lgIn('dfsstack', /visit-?stack\s*\(/), hint: 'if u.color == WHITE: VISIT-STACK(G, u)'},
     {label: 'Stamps discovery times when pushing', w: 2, test: lgRx(/\.d\s*=\s*time/), hint: 'time = time + 1; v.d = time'},
     {label: 'Uses a stack (push / top / pop)', w: 2, test: t => /push\s*\(/.test(t) && /pop\s*\(/.test(t), hint: 'PUSH(S, v); POP(S)'},
     {label: 'Stamps finish times when popping', w: 2, test: lgRx(/\.f\s*=\s*time/), hint: 'u.color = BLACK; u.f = time'},
     {label: 'Resumes each adjacency list with a cursor', w: 2, test: lgRx(/\.next|cursor|index|\.ptr/), hint: 'u.next = u.next + 1'}],
    efficiency: [
     {label: 'No recursion inside VISIT-STACK', w: 5, test: lgNoSelfCall('visitstack', 'visit-?stack'), hint: 'The whole point is an explicit stack.'},
     {label: 'Each edge examined once (cursor never restarts)', w: 5, test: lgRx(/\.next\s*=\s*\w+\.next\s*\+\s*1|\.next\s*\+=\s*1|\+\+/), hint: 'Advance u.next instead of rescanning Adj[u].'}],
    model: `DFS-STACK(G)                       // same d/f times as recursive DFS
    for each vertex u in G.V
        u.color = WHITE
        u.next = 1                     // cursor into G.Adj[u]
    time = 0
    for each vertex u in G.V
        if u.color == WHITE
            VISIT-STACK(G, u)

VISIT-STACK(G, s)                  // explicit stack instead of recursion
    S = empty stack
    time = time + 1
    s.d = time
    s.color = GRAY
    PUSH(S, s)
    while S is not empty
        u = TOP(S)
        v = NEXT-WHITE(G, u)
        if v != NIL
            v.π = u
            time = time + 1
            v.d = time
            v.color = GRAY
            PUSH(S, v)
        else
            POP(S)
            u.color = BLACK
            time = time + 1
            u.f = time

NEXT-WHITE(G, u)                   // resumes where u's last scan stopped
    while u.next <= length(G.Adj[u])
        v = G.Adj[u][u.next]
        u.next = u.next + 1
        if v.color == WHITE
            return v
    return NIL`})
 ],
 topo: [
  () => { const ctx = lgPick(['a course-prerequisite DAG', 'a build system\'s dependency DAG', 'a recipe\'s step DAG']);
   return {id: 'learn-dag-paths', topic: 't14b', title: 'Count s ⇝ t paths in a DAG with memoized DFS',
    prompt: `In <b>${ctx}</b>, count how many different directed paths lead from s to t. Plain DFS that explores every path is exponential. Modify DFS to <b>memoize</b> the number of paths from each vertex (computed once, when it finishes), giving Θ(V + E). Write <code>COUNT-PATHS(G, s, t)</code> and the recursive helper <code>PATHS-FROM(G, u, t)</code>.`,
    starter: 'COUNT-PATHS(G, s, t)\n    \n\nPATHS-FROM(G, u, t)\n    \n', define: ['countpaths', 'pathsfrom'], call: ['paths-from'], maxLoop: 1,
    correctness: [
     {label: 'Clears the memo for every vertex', w: 1, test: lgIn('countpaths', /=\s*(nil|null|none|-1|undefined)/), hint: 'u.paths = NIL'},
     {label: 'Base case: one path from t to itself', w: 2, test: lgRx(/if\s+\w+\s*==\s*t[\s\S]{0,40}return\s+1/), hint: 'if u == t return 1'},
     {label: 'Returns the memo when already computed', w: 2, test: lgIn('pathsfrom', /if[^\n]*\.paths\s*!=|if[^\n]*memo\s*\[[^\]]*\]\s*!=/), hint: 'if u.paths ≠ NIL return u.paths'},
     {label: 'Sums the counts of all out-neighbours', w: 3, test: lgIn('pathsfrom', /adj[\s\S]*\+\s*paths-?from\s*\(|adj[\s\S]*\+=\s*paths-?from/), hint: 'total = total + PATHS-FROM(G, v, t)'},
     {label: 'Stores the result before returning', w: 2, test: lgIn('pathsfrom', /\.paths\s*=\s*total|memo\s*\[[^\]]*\]\s*=/), hint: 'u.paths = total'}],
    efficiency: [
     {label: 'Memoization: each vertex solved once ⇒ Θ(V + E)', w: 6, test: lgIn('pathsfrom', /\.paths|memo/), hint: 'Without the memo the same subpaths are recounted exponentially often.'},
     {label: 'No path enumeration / no extra sort', w: 4, test: t => !/sort|all\s+paths/.test(t), hint: 'Counting does not need the paths themselves.'}],
    model: `COUNT-PATHS(G, s, t)              // number of s ⇝ t paths in a DAG; Θ(V + E)
    for each vertex u in G.V
        u.paths = NIL                  // memo: not computed yet
    return PATHS-FROM(G, s, t)

PATHS-FROM(G, u, t)                // DFS that memoizes on finish
    if u == t
        return 1
    if u.paths != NIL
        return u.paths                 // reuse the memo
    total = 0
    for each v in G.Adj[u]
        total = total + PATHS-FROM(G, v, t)
    u.paths = total
    return total`}; },
  () => ({id: 'learn-kahn-cycle', topic: 't14b', title: 'Kahn\'s topological sort that reports a cycle',
    prompt: `A ${lgPick(['package manager', 'spreadsheet recalculation engine', 'course planner'])} must either print a valid order or say the input is impossible. Modify Kahn's algorithm so that, besides the order, it <b>detects a cycle</b>: if fewer than |V| vertices were output, return "CYCLE". Write <code>TOPO-OR-CYCLE(G)</code> in Θ(V + E).`,
    starter: 'TOPO-OR-CYCLE(G)\n    \n', define: ['topoorcycle'], call: ['enqueue', 'dequeue'], maxLoop: 2,
    correctness: [
     {label: 'Starts every in-degree at 0', w: 1, test: lgRx(/indeg\w*\s*=\s*0|indeg\w*\s*\[\s*\w+\s*\]\s*=\s*0/), hint: 'u.indeg = 0'},
     {label: 'Counts in-degrees from the adjacency lists', w: 2, test: lgRx(/indeg\w*[^\n]*=[^\n]*indeg\w*[^\n]*\+\s*1|indeg\w*[^\n]*\+=\s*1|indeg\w*[^\n]*\+\+/), hint: 'v.indeg = v.indeg + 1'},
     {label: 'Queues every source (in-degree 0)', w: 2, test: t => /if[^\n]*indeg\w*[^\n]*==\s*0/.test(t) && /enqueue/.test(t), hint: 'if u.indeg == 0: ENQUEUE(Q, u)'},
     {label: 'Decrements out-neighbours and queues new sources', w: 2, test: lgRx(/indeg\w*[^\n]*-\s*1|indeg\w*[^\n]*-=\s*1|indeg\w*[^\n]*--/), hint: 'v.indeg = v.indeg − 1; if 0, ENQUEUE'},
     {label: 'Compares the output size with |V| to detect a cycle', w: 2, test: t => /cycle/.test(t) && /<\s*\|?\s*(g\.v|v|n)|!=\s*\|?\s*(g\.v|v|n)|count|length|size/.test(t), hint: 'if length(order) < |G.V| return "CYCLE"'},
     {label: 'Returns the order otherwise', w: 1, test: lgRx(/return\s+order|return\s+l\b|return\s+list/), hint: 'return order'}],
    efficiency: [
     {label: 'Each vertex enqueued once, each edge scanned once: Θ(V + E)', w: 6, test: (t, P) => P.maxLoop <= 2, hint: 'Only the in-degree count needs a nested loop.'},
     {label: 'Uses a queue of sources (no repeated scan for in-degree 0)', w: 4, test: lgRx(/enqueue/), hint: 'Never rescan all vertices looking for sources.'}],
    model: `TOPO-OR-CYCLE(G)                  // Kahn's algorithm + cycle report; Θ(V + E)
    for each vertex u in G.V
        u.indeg = 0
    for each vertex u in G.V
        for each v in G.Adj[u]
            v.indeg = v.indeg + 1
    Q = empty queue
    for each vertex u in G.V
        if u.indeg == 0
            ENQUEUE(Q, u)
    order = empty list
    while Q is not empty
        u = DEQUEUE(Q)
        append u to order
        for each v in G.Adj[u]
            v.indeg = v.indeg - 1
            if v.indeg == 0
                ENQUEUE(Q, v)
    if length(order) < |G.V|
        return "CYCLE"            // leftover vertices lie on a cycle
    return order`})
 ],
 ds: [
  () => ({id: 'learn-uf-size', topic: 'ds', title: 'Union by size with a SET-SIZE query',
    prompt: `A ${lgPick(['social app shows "your group has N members"', 'network monitor reports the size of each connected cluster', 'game tracks how many tiles each region contains'])}. Modify the disjoint-set forest to use <b>union by size</b> instead of rank and to <b>remember each set's size</b> at its root, so <code>SET-SIZE(x)</code> answers in O(α(n)). Write <code>MAKE-SET(x)</code>, <code>FIND-SET(x)</code> (with path compression), <code>UNION(x, y)</code> and <code>SET-SIZE(x)</code>.`,
    starter: 'MAKE-SET(x)\n    \n\nFIND-SET(x)\n    \n\nUNION(x, y)\n    \n\nSET-SIZE(x)\n    \n', define: ['makeset', 'findset', 'union', 'setsize'], call: ['findset'], maxLoop: 1,
    correctness: [
     {label: 'MAKE-SET: own parent, size 1', w: 2, test: (t, P) => /\.p\s*=\s*x\b|parent\s*\[\s*x\s*\]\s*=\s*x/.test(P.body('makeset')) && /size[^\n]*=\s*1/.test(P.body('makeset')), hint: 'x.p = x; x.size = 1'},
     {label: 'FIND-SET compresses the path', w: 2, test: lgIn('findset', /\.p\s*=\s*findset\s*\(/), hint: 'x.p = FIND-SET(x.p)'},
     {label: 'UNION finds both roots and skips equal roots', w: 2, test: (t, P) => (P.body('union').match(/findset\s*\(/g) || []).length >= 2 && /==/.test(P.body('union')), hint: 'a = FIND-SET(x); b = FIND-SET(y); if a == b return'},
     {label: 'Attaches the smaller set under the larger', w: 2, test: lgIn('union', /size\s*<|size\s*>|<\s*\w+\.size|>\s*\w+\.size/), hint: 'if a.size < b.size swap a and b; b.p = a'},
     {label: 'Updates the size of the new root', w: 2, test: lgIn('union', /size\s*=\s*\w+\.size\s*\+\s*\w+\.size|size\s*\+=\s*\w+\.size/), hint: 'a.size = a.size + b.size'},
     {label: 'SET-SIZE reads the size at the root', w: 2, test: lgIn('setsize', /findset\s*\([^)]*\)\s*\.size|\.size/), hint: 'return FIND-SET(x).size'}],
    efficiency: [
     {label: 'Path compression keeps finds near O(1)', w: 4, test: lgIn('findset', /\.p\s*=\s*findset/), hint: 'Compress during FIND-SET.'},
     {label: 'Union by size keeps trees shallow', w: 4, test: lgIn('union', /size/), hint: 'Compare sizes before linking.'},
     {label: 'SET-SIZE has no loops (answer stored at the root)', w: 2, test: (t, P) => P.hasFn('setsize') && !/\b(for|while)\b/.test(P.body('setsize')), hint: 'Never count members.'}],
    model: `MAKE-SET(x)
    x.p = x
    x.size = 1

FIND-SET(x)                       // path compression
    if x != x.p
        x.p = FIND-SET(x.p)
    return x.p

UNION(x, y)                       // union by size: smaller root goes under larger
    a = FIND-SET(x)
    b = FIND-SET(y)
    if a == b
        return
    if a.size < b.size
        swap a and b
    b.p = a
    a.size = a.size + b.size      // remember the merged size at the root

SET-SIZE(x)                       // O(α(n)): the size lives at the root
    return FIND-SET(x).size`}),
  () => ({id: 'learn-uf-iterative', topic: 'ds', title: 'Iterative two-pass FIND-SET (no recursion)',
    prompt: `On ${lgPick(['an embedded device with a tiny call stack', 'a GPU kernel where recursion is not allowed', 'a huge union-find over a billion pixels'])}, recursion is not an option. Modify FIND-SET to be <b>iterative</b> but keep full path compression: pass 1 climbs to the root, pass 2 re-points every node on the path at the root. Write <code>FIND-SET(x)</code>, <code>UNION(x, y)</code> and <code>LINK(x, y)</code> (union by rank).`,
    starter: 'FIND-SET(x)\n    \n\nUNION(x, y)\n    \n\nLINK(x, y)\n    \n', define: ['findset', 'union', 'link'], call: ['findset', 'link'], maxLoop: 1,
    correctness: [
     {label: 'Pass 1 climbs parent pointers to the root', w: 3, test: lgIn('findset', /while[^\n]*!=[^\n]*\.p[\s\S]{0,60}=\s*\w+\.p/), hint: 'root = x; while root ≠ root.p: root = root.p'},
     {label: 'Pass 2 saves the next node before rewiring', w: 2, test: lgIn('findset', /\w+\s*=\s*x\.p/), hint: 'next = x.p'},
     {label: 'Pass 2 points each node at the root', w: 3, test: lgIn('findset', /x\.p\s*=\s*root|\.p\s*=\s*r\b/), hint: 'x.p = root'},
     {label: 'UNION links the two roots', w: 2, test: lgIn('union', /link\s*\(/), hint: 'LINK(FIND-SET(x), FIND-SET(y))'},
     {label: 'LINK uses rank and increments it on ties', w: 2, test: (t, P) => /rank[^\n]*(>|<)/.test(P.body('link')) && /rank[^\n]*(\+\s*1|\+\+|\+=)/.test(P.body('link')), hint: 'if x.rank > y.rank … else … if equal y.rank++'}],
    efficiency: [
     {label: 'No recursion in FIND-SET', w: 5, test: lgNoSelfCall('findset', 'findset'), hint: 'Two while loops replace the recursion.'},
     {label: 'Full path compression (every node on the path re-pointed)', w: 5, test: lgIn('findset', /\.p\s*=\s*root|\.p\s*=\s*r\b/), hint: 'The second pass is what makes later finds cheap.'}],
    model: `FIND-SET(x)                       // iterative two-pass path compression
    root = x
    while root != root.p          // pass 1: find the root
        root = root.p
    while x != root               // pass 2: re-point the path at the root
        next = x.p
        x.p = root
        x = next
    return root

UNION(x, y)
    LINK(FIND-SET(x), FIND-SET(y))

LINK(x, y)                        // union by rank
    if x == y
        return
    if x.rank > y.rank
        y.p = x
    else
        x.p = y
        if x.rank == y.rank
            y.rank = y.rank + 1`})
 ],
 mst: [
  () => { const k = lgPick([2, 3, 4, 5]), ctx = lgPick(['customer locations for delivery zones', 'documents by similarity distance', 'stars by distance into galaxies']);
   return {id: 'learn-k-cluster', topic: 'kruskal', title: `Kruskal stopped early: ${k}-clustering`,
    prompt: `Group <b>${ctx}</b> into exactly <b>k = ${k}</b> clusters (single-linkage clustering). Modify Kruskal so it keeps a counter of how many components remain and <b>stops as soon as there are k</b>; the accepted edges form the clusters. Write <code>K-CLUSTER(G, w, k)</code> using MAKE-SET, FIND-SET and UNION. Running time O(E lg V).`,
    starter: 'K-CLUSTER(G, w, k)\n    \n', define: ['kcluster'], call: ['makeset', 'findset', 'union'], maxLoop: 1,
    correctness: [
     {label: 'MAKE-SET for every vertex', w: 1, test: lgRx(/makeset\s*\(/), hint: 'for each v ∈ G.V: MAKE-SET(v)'},
     {label: 'Counts components, starting at |V|', w: 2, test: lgRx(/(comp\w*|count|clusters?|c)\s*=\s*\|?\s*(g\.v|v|n)\b/), hint: 'components = |G.V|'},
     {label: 'Sorts edges by weight once', w: 2, test: lgRx(/sort/), hint: 'sort G.E into non-decreasing order by w'},
     {label: 'Accepts only edges joining different sets', w: 2, test: lgRx(/findset\s*\([^)]*\)\s*!=\s*findset\s*\(/), hint: 'if FIND-SET(u) ≠ FIND-SET(v)'},
     {label: 'UNIONs and decrements the component counter', w: 2, test: t => /\bunion\s*\(/.test(t) && /(comp\w*|count|clusters?)\s*=\s*\w+\s*-\s*1|(comp\w*|count|clusters?)\s*-=\s*1|--/.test(t), hint: 'UNION(u, v); components = components − 1'},
     {label: 'Stops when k components remain', w: 2, test: lgRx(/==\s*k\b|<=\s*k\b|>\s*k\b/), hint: 'if components == k: break'}],
    efficiency: [
     {label: 'Sorts once, outside the loop', w: 4, test: (t, P) => P.lines.some(l => /sort/.test(l.t) && l.loopDepth === 0), hint: 'Sorting inside the loop multiplies the cost.'},
     {label: 'Union-Find cycle test (no DFS per edge)', w: 3, test: lgRx(/findset/), hint: 'FIND-SET is O(α(V)) amortized.'},
     {label: 'Early exit instead of building the whole MST', w: 3, test: lgRx(/break|return\s+a\b/), hint: 'Stop at k components.'}],
    penalties: [{label: 'Detects cycles with DFS/BFS', p: 3, test: lgRx(/\b(dfs|bfs)\b|haspath|reachable/), hint: 'Use FIND-SET.'}],
    model: `K-CLUSTER(G, w, k)               // Kruskal with early exit; O(E lg V)
    for each vertex v in G.V
        MAKE-SET(v)
    components = |G.V|
    A = ∅
    sort G.E into non-decreasing order by w
    for each edge (u, v) in G.E, in sorted order
        if components == k
            break                     // exactly k clusters remain
        if FIND-SET(u) != FIND-SET(v)
            A = A ∪ {(u, v)}
            UNION(u, v)
            components = components - 1
    return A`}; },
  () => { const n = lgPick([50, 200, 1000]), ctx = lgPick(['fiber links between campus buildings', 'water pipes between farms', 'power lines between villages']);
   return {id: 'learn-prim-dense', topic: 'prim', title: 'Prim for a dense distance matrix (array, no heap)',
    prompt: `Plan the cheapest <b>${ctx}</b> for n = ${n} sites; every pair can be connected, and W[i][j] is the cost (an n × n matrix, so E = Θ(n²)). Modify MST-PRIM for this dense input: drop the heap, keep an <b>inTree[] flag</b> and the arrays key[] and parent[] as memory, and find the next vertex with a linear scan. Return the total cost and the parent array in <b>Θ(n²)</b>. Write <code>DENSE-PRIM(W, n)</code> and <code>CHEAPEST(key, inTree, n)</code>.`,
    starter: 'DENSE-PRIM(W, n)\n    \n\nCHEAPEST(key, inTree, n)\n    \n', define: ['denseprim', 'cheapest'], call: ['cheapest'], maxLoop: 2,
    correctness: [
     {label: 'Keys start at ∞, root key 0', w: 2, test: t => /key[^\n]*=\s*inf/.test(t) && /key\s*\[\s*\w+\s*\]\s*=\s*0/.test(t), hint: 'key[v] = ∞; key[1] = 0'},
     {label: 'Picks the cheapest vertex not yet in the tree', w: 2, test: lgRx(/cheapest\s*\(/), hint: 'u = CHEAPEST(key, inTree, n)'},
     {label: 'Marks it as in the tree and adds its key to the total', w: 2, test: t => /intree\s*\[\s*u\s*\]\s*=\s*true/.test(t) && /total\s*=\s*total\s*\+|total\s*\+=/.test(t), hint: 'inTree[u] = true; total = total + key[u]'},
     {label: 'Updates neighbours from the matrix row and records the parent', w: 3, test: t => /w\s*\[\s*u\s*\]\s*\[\s*v\s*\]\s*<\s*key|w\s*\[\s*u\s*,\s*v\s*\]\s*<\s*key/.test(t) && /parent\s*\[\s*v\s*\]\s*=\s*u/.test(t), hint: 'if not inTree[v] and W[u][v] < key[v]: key[v] = W[u][v]; parent[v] = u'},
     {label: 'Returns the total and parent array', w: 1, test: lgRx(/return[^\n]*(total|parent)/), hint: 'return (total, parent)'}],
    efficiency: [
     {label: 'No heap and no sorting: Θ(n²), optimal for dense input', w: 5, test: t => !/bheap|bsort|extractmin|decreasekey/.test(t), hint: 'A heap adds a lg n factor for nothing here.'},
     {label: 'Only two nested loops', w: 5, test: (t, P) => P.maxLoop <= 2, hint: 'n rounds × Θ(n) scan.'}],
    model: `DENSE-PRIM(W, n)                 // array Prim for a complete graph; Θ(n²)
    for v = 1 to n
        key[v] = ∞
        inTree[v] = false
        parent[v] = NIL
    key[1] = 0
    total = 0
    for step = 1 to n
        u = CHEAPEST(key, inTree, n)  // Θ(n) linear scan for the minimum key
        inTree[u] = true
        total = total + key[u]
        for v = 1 to n
            if not inTree[v] and W[u][v] < key[v]
                key[v] = W[u][v]
                parent[v] = u
    return (total, parent)

CHEAPEST(key, inTree, n)          // vertex outside the tree with the smallest key
    best = NIL
    for v = 1 to n
        if not inTree[v] and (best == NIL or key[v] < key[best])
            best = v
    return best`}; }
 ],
 fib: [
  () => ({id: 'learn-fib-delete', topic: 'fib', title: 'FIB-DELETE built from DECREASE-KEY and EXTRACT-MIN',
    prompt: `A ${lgPick(['task scheduler must cancel jobs', 'Dijkstra variant must drop vertices', 'trading engine must withdraw orders'])} that are already in a Fibonacci heap. Add <code>FIB-DELETE(H, x)</code> by reusing the heap's own operations: decrease x's key to −∞ (so it becomes the minimum) and then extract the minimum. Also write <code>FIB-DECREASE-KEY(H, x, k)</code>, <code>CUT(H, x, y)</code> and <code>CASCADING-CUT(H, y)</code>. Assume FIB-EXTRACT-MIN exists.`,
    starter: 'FIB-DELETE(H, x)\n    \n\nFIB-DECREASE-KEY(H, x, k)\n    \n\nCUT(H, x, y)\n    \n\nCASCADING-CUT(H, y)\n    \n', define: ['fibdelete', 'decreasekey', 'cut', 'cascadingcut'], call: ['decreasekey', 'extractmin', 'cut', 'cascadingcut'], maxLoop: 0,
    correctness: [
     {label: 'DELETE decreases the key to −∞', w: 2, test: lgIn('fibdelete', /decreasekey\s*\([^)]*-\s*inf/), hint: 'FIB-DECREASE-KEY(H, x, −∞)'},
     {label: 'DELETE then extracts the minimum', w: 2, test: lgIn('fibdelete', /extractmin\s*\(/), hint: 'FIB-EXTRACT-MIN(H)'},
     {label: 'DECREASE-KEY cuts x when heap order breaks', w: 2, test: lgIn('decreasekey', /<\s*y\.key|y\.key\s*>|\.p\.key/), hint: 'if y ≠ NIL and x.key < y.key: CUT(H, x, y); CASCADING-CUT(H, y)'},
     {label: 'DECREASE-KEY updates H.min', w: 1, test: lgIn('decreasekey', /h\.min\s*=\s*x/), hint: 'if x.key < H.min.key: H.min = x'},
     {label: 'CUT moves x to the root list, clears p and mark, fixes degree', w: 2, test: (t, P) => /degree/.test(P.body('cut')) && /rootlist|root/.test(P.body('cut')) && /mark\s*=\s*false/.test(P.body('cut')), hint: 'remove from child list; y.degree − 1; add to root list; x.p = NIL; x.mark = FALSE'},
     {label: 'CASCADING-CUT marks once, cuts and recurses the second time', w: 3, test: (t, P) => /mark\s*=\s*true/.test(P.body('cascadingcut')) && /\bcut\s*\(/.test(P.body('cascadingcut')) && /cascadingcut\s*\(/.test(P.body('cascadingcut')), hint: 'if y.mark == FALSE: y.mark = TRUE else CUT(H, y, z); CASCADING-CUT(H, z)'}],
    efficiency: [
     {label: 'DELETE reuses the heap operations (O(lg n) amortized)', w: 5, test: (t, P) => !/\b(for|while)\b/.test(P.body('fibdelete')), hint: 'No searching or rebuilding the heap.'},
     {label: 'CUT and DECREASE-KEY are O(1) work apart from the cascade', w: 5, test: (t, P) => !/\b(for|while)\b/.test(P.body('cut')) && !/\b(for|while)\b/.test(P.body('decreasekey')), hint: 'No loops in CUT or DECREASE-KEY.'}],
    model: `FIB-DELETE(H, x)                  // O(lg n) amortized
    FIB-DECREASE-KEY(H, x, -∞)      // x becomes the minimum
    FIB-EXTRACT-MIN(H)

FIB-DECREASE-KEY(H, x, k)          // O(1) amortized
    if k > x.key
        error "new key is greater than current key"
    x.key = k
    y = x.p
    if y != NIL and x.key < y.key
        CUT(H, x, y)
        CASCADING-CUT(H, y)
    if x.key < H.min.key
        H.min = x

CUT(H, x, y)                       // O(1)
    remove x from the child list of y
    y.degree = y.degree - 1
    add x to the root list of H
    x.p = NIL
    x.mark = FALSE

CASCADING-CUT(H, y)                // second lost child ⇒ cut y too
    z = y.p
    if z != NIL
        if y.mark == FALSE
            y.mark = TRUE
        else
            CUT(H, y, z)
            CASCADING-CUT(H, z)`}),
  () => ({id: 'learn-fib-potential', topic: 'fib', title: 'DECREASE-KEY that remembers the potential Φ = t + 2m',
    prompt: `To ${lgPick(['verify the amortized analysis experimentally', 'instrument a Fibonacci heap for a profiler', 'teach the potential method with live numbers'])}, the heap must keep two counters: H.trees (roots in the root list) and H.marks (marked nodes), so Φ(H) = H.trees + 2·H.marks is always available in O(1). Modify <code>CUT(H, x, y)</code> and <code>CASCADING-CUT(H, y)</code> to maintain both counters, and write <code>POTENTIAL(H)</code>.`,
    starter: 'CUT(H, x, y)\n    \n\nCASCADING-CUT(H, y)\n    \n\nPOTENTIAL(H)\n    \n', define: ['cut', 'cascadingcut', 'potential'], call: ['cut', 'cascadingcut'], maxLoop: 0,
    correctness: [
     {label: 'CUT moves x to the root list and fixes y.degree', w: 2, test: (t, P) => /degree/.test(P.body('cut')) && /root/.test(P.body('cut')), hint: 'remove x from y\'s child list; y.degree − 1; add x to the root list'},
     {label: 'CUT adds one tree', w: 2, test: lgIn('cut', /trees\s*=\s*h\.trees\s*\+\s*1|trees\s*\+=\s*1|trees\+\+/), hint: 'H.trees = H.trees + 1'},
     {label: 'CUT un-marks x and decrements H.marks if x was marked', w: 2, test: (t, P) => /mark\s*=\s*false/.test(P.body('cut')) && /marks\s*=\s*h\.marks\s*-\s*1|marks\s*-=\s*1|marks--/.test(P.body('cut')), hint: 'if x.mark: H.marks = H.marks − 1; x.mark = FALSE'},
     {label: 'CASCADING-CUT marks y the first time and counts it', w: 2, test: (t, P) => /mark\s*=\s*true/.test(P.body('cascadingcut')) && /marks\s*=\s*h\.marks\s*\+\s*1|marks\s*\+=\s*1|marks\+\+/.test(P.body('cascadingcut')), hint: 'y.mark = TRUE; H.marks = H.marks + 1'},
     {label: 'Otherwise cuts y and recurses on its parent', w: 2, test: (t, P) => /\bcut\s*\(/.test(P.body('cascadingcut')) && /cascadingcut\s*\(/.test(P.body('cascadingcut')), hint: 'CUT(H, y, z); CASCADING-CUT(H, z)'},
     {label: 'POTENTIAL returns trees + 2·marks', w: 2, test: lgIn('potential', /trees\s*\+\s*2\s*\*?\s*\(?\s*h?\.?marks|2\s*\*\s*h\.marks\s*\+\s*h\.trees/), hint: 'return H.trees + 2 * H.marks'}],
    efficiency: [
     {label: 'POTENTIAL is O(1) (counters, not a traversal)', w: 5, test: (t, P) => P.hasFn('potential') && !/\b(for|while)\b/.test(P.body('potential')), hint: 'Never walk the heap to count.'},
     {label: 'CUT is O(1)', w: 5, test: (t, P) => !/\b(for|while)\b/.test(P.body('cut')), hint: 'Only pointer updates.'}],
    model: `CUT(H, x, y)                       // O(1); keeps the counters exact
    remove x from the child list of y
    y.degree = y.degree - 1
    add x to the root list of H
    H.trees = H.trees + 1
    x.p = NIL
    if x.mark == TRUE
        H.marks = H.marks - 1
    x.mark = FALSE

CASCADING-CUT(H, y)
    z = y.p
    if z != NIL
        if y.mark == FALSE
            y.mark = TRUE              // first lost child: mark it
            H.marks = H.marks + 1
        else
            CUT(H, y, z)               // second lost child: cut it
            CASCADING-CUT(H, z)

POTENTIAL(H)                       // Φ(H) = t(H) + 2 m(H), O(1)
    return H.trees + 2 * H.marks`})
 ],
 sssp: [
  () => ({id: 'learn-bf-early', topic: 't18', title: 'Bellman-Ford that stops when nothing changes',
    prompt: `On ${lgPick(['a currency-exchange graph (negative log rates)', 'a road network with toll rebates (negative edges)', 'a difference-constraints system'])}, most passes of Bellman-Ford change nothing near the end. Make it run smoother: have <code>RELAX</code> return whether it improved v.d, track a <b>changed</b> flag per pass, and <b>stop early</b> when a whole pass changes nothing. Keep the negative-cycle check. Write <code>BELLMAN-FORD-FAST(G, w, s)</code>, <code>RELAX(u, v, w)</code> and <code>INITIALIZE-SINGLE-SOURCE(G, s)</code>.`,
    starter: 'BELLMAN-FORD-FAST(G, w, s)\n    \n\nRELAX(u, v, w)\n    \n\nINITIALIZE-SINGLE-SOURCE(G, s)\n    \n', define: ['bellmanfordfast', 'relax', 'initializesinglesource'], call: ['initializesinglesource', 'relax'], maxLoop: 2,
    correctness: [
     {label: 'Initializes d = ∞, s.d = 0', w: 1, test: t => /=\s*inf/.test(t) && /s\.d\s*=\s*0/.test(t), hint: 'v.d = ∞; s.d = 0'},
     {label: 'At most |V| − 1 passes over every edge', w: 2, test: lgRx(/-\s*1[\s\S]{0,120}(edge|g\.e)/), hint: 'for i = 1 to |G.V| − 1: for each edge (u, v)'},
     {label: 'RELAX returns whether it improved v.d', w: 2, test: (t, P) => /return\s+true/.test(P.body('relax')) && /return\s+false/.test(P.body('relax')), hint: 'return TRUE after updating, FALSE otherwise'},
     {label: 'Tracks a changed flag per pass', w: 2, test: lgRx(/changed\s*=\s*false[\s\S]*changed\s*=\s*true|\w+\s*=\s*false[\s\S]*if\s+relax/), hint: 'changed = FALSE; if RELAX(u, v, w): changed = TRUE'},
     {label: 'Stops early when a pass changes nothing', w: 2, test: lgRx(/if\s+not\s+\w+|if\s+!\s*\w+|if\s+\w+\s*==\s*false/), hint: 'if not changed: return TRUE'},
     {label: 'Final pass detects a negative cycle', w: 2, test: lgRx(/return\s+false/), hint: 'if v.d > u.d + w(u, v): return FALSE'}],
    efficiency: [
     {label: 'Early exit: Θ(E) when the distances settle in one pass', w: 6, test: lgRx(/changed|improved|updated/), hint: 'Stop as soon as a full pass is quiet.'},
     {label: 'No extra nested loops beyond passes × edges', w: 4, test: (t, P) => P.maxLoop <= 2, hint: 'Passes × edges is the whole algorithm.'}],
    model: `BELLMAN-FORD-FAST(G, w, s)         // stops early once distances settle
    INITIALIZE-SINGLE-SOURCE(G, s)
    for i = 1 to |G.V| - 1
        changed = false
        for each edge (u, v) in G.E
            if RELAX(u, v, w)
                changed = true
        if not changed
            return true                  // quiet pass: all d are final
    for each edge (u, v) in G.E
        if v.d > u.d + w(u, v)
            return false                 // reachable negative-weight cycle
    return true

RELAX(u, v, w)                       // reports whether v.d improved
    if v.d > u.d + w(u, v)
        v.d = u.d + w(u, v)
        v.π = u
        return true
    return false

INITIALIZE-SINGLE-SOURCE(G, s)
    for each vertex v in G.V
        v.d = ∞
        v.π = NIL
    s.d = 0`}),
  () => { const [ctx, t] = lgPick([['a GPS app on a road map', 'the destination'], ['a robot on a warehouse floor graph', 'the charging dock'], ['a game AI on a weighted nav-mesh', 'the player']]);
   return {id: 'learn-dijkstra-target', topic: 't18', title: 'Dijkstra that stops at the target and returns the route',
    prompt: `In <b>${ctx}</b> (non-negative weights), we only need the shortest route from s to <b>${t}</b> (vertex t). Modify Dijkstra to <b>stop as soon as t is extracted</b> (its distance is final by Dijkstra's invariant) and return t.d together with the route rebuilt from π. Write <code>DIJKSTRA-TARGET(G, w, s, t)</code> and <code>BUILD-PATH(s, t)</code>; assume INITIALIZE-SINGLE-SOURCE exists.`,
    starter: 'DIJKSTRA-TARGET(G, w, s, t)\n    \n\nBUILD-PATH(s, t)\n    \n', define: ['dijkstratarget', 'buildpath'], call: ['initializesinglesource', 'extractmin', 'decreasekey', 'build-path'], maxLoop: 2,
    correctness: [
     {label: 'Initializes and fills a min-priority queue', w: 1, test: t => /initializesinglesource|=\s*inf/.test(t) && /\bq\s*=|insert\s*\(|priority|minheap/.test(t), hint: 'INITIALIZE-SINGLE-SOURCE(G, s); Q = G.V'},
     {label: 'Repeatedly extracts the closest vertex', w: 2, test: t => /while/.test(t) && /extractmin\s*\(/.test(t), hint: 'u = EXTRACT-MIN(Q)'},
     {label: 'Stops when t is extracted', w: 2, test: lgRx(/if\s+\(?\s*u\s*==\s*t\b/), hint: 'if u == t: return (t.d, BUILD-PATH(s, t))'},
     {label: 'Relaxes the out-edges of u', w: 2, test: lgRx(/(\.d|d\s*\[\s*v\s*\])\s*>\s*(u\.d|d\s*\[\s*u\s*\])\s*\+|relax\s*\(/), hint: 'if v.d > u.d + w(u, v) …'},
     {label: 'Updates π and the queue key', w: 2, test: t => /\.(pi|parent)\s*=\s*u\b|relax\s*\(/.test(t) && /decreasekey/.test(t), hint: 'v.π = u; DECREASE-KEY(Q, v, v.d)'},
     {label: 'BUILD-PATH follows π back from t', w: 1, test: lgIn('buildpath', /=\s*\w+\.(pi|parent)/), hint: 'x = x.π'}],
    efficiency: [
     {label: 'Uses a min-priority queue: O((V + E) lg V) worst case', w: 5, test: lgRx(/extractmin/), hint: 'A heap finds the minimum in O(lg V).'},
     {label: 'Early exit at t', w: 5, test: lgRx(/u\s*==\s*t/), hint: 'Everything after t is extracted is wasted work.'}],
    penalties: [{label: 'Scans all of Q to find the minimum', p: 3, test: (t, P) => P.lines.some(l => l.loopDepth >= 1 && /\b(for|foreach)\b[^\n]*(\bin\s+q\b|g\.v)/.test(l.t)), hint: 'Let the heap find it.'}],
    model: `DIJKSTRA-TARGET(G, w, s, t)       // w ≥ 0; stops once t is settled
    INITIALIZE-SINGLE-SOURCE(G, s)
    Q = G.V                         // min-priority queue keyed by d
    while Q is not empty
        u = EXTRACT-MIN(Q)
        if u == t
            return (t.d, BUILD-PATH(s, t))   // t.d is final now
        for each v in G.Adj[u]
            if v.d > u.d + w(u, v)
                v.d = u.d + w(u, v)
                v.π = u
                DECREASE-KEY(Q, v, v.d)
    return ∞                        // t unreachable

BUILD-PATH(s, t)                   // follow π pointers: O(path length)
    path = empty list
    x = t
    while x != NIL
        add x to the front of path
        x = x.π
    return path`}; },
  () => ({id: 'learn-dag-longest', topic: 't18', title: 'Critical path: longest paths in a DAG',
    prompt: `A ${lgPick(['construction project', 'software release plan', 'conference schedule'])} is a DAG of tasks; w(u, v) is the duration of u. The project takes as long as the <b>longest</b> path from start s. Modify DAG-SHORTEST-PATHS to compute <b>longest</b> paths (critical path) in Θ(V + E): initialize to −∞ and relax "upwards". Write <code>DAG-LONGEST-PATHS(G, w, s)</code>; assume TOPOLOGICAL-SORT exists.`,
    starter: 'DAG-LONGEST-PATHS(G, w, s)\n    \n', define: ['daglongestpaths'], call: ['topological-sort|toposort|topo-sort'], maxLoop: 2,
    correctness: [
     {label: 'Topologically sorts first', w: 2, test: lgRx(/topologicalsort|topological-sort|toposort|topo-sort/), hint: 'order = TOPOLOGICAL-SORT(G)'},
     {label: 'Initializes every d to −∞ and s.d = 0', w: 2, test: t => /=\s*-\s*inf/.test(t) && /s\.d\s*=\s*0/.test(t), hint: 'v.d = −∞; s.d = 0'},
     {label: 'Processes vertices in topological order', w: 2, test: lgRx(/for[^\n]*(in|of)\s+(order|topo|l\b|list)/), hint: 'for each u in order'},
     {label: 'Relaxes for LONGER paths (v.d < u.d + w)', w: 3, test: lgRx(/(\.d|d\s*\[\s*v\s*\])\s*<\s*(u\.d|d\s*\[\s*u\s*\])\s*\+/), hint: 'if v.d < u.d + w(u, v): v.d = u.d + w(u, v); v.π = u'},
     {label: 'Records the predecessor', w: 1, test: lgRx(/\.(pi|parent)\s*=\s*u\b/), hint: 'v.π = u'}],
    efficiency: [
     {label: 'One relaxation per edge: Θ(V + E)', w: 6, test: (t, P) => P.maxLoop <= 2 && !/-\s*1[\s\S]{0,60}edge/.test(t), hint: 'No |V| − 1 passes needed in a DAG.'},
     {label: 'No Dijkstra / priority queue (wrong for longest paths)', w: 4, test: t => !/extractmin|dijkstra|heap/.test(t), hint: 'Topological order is enough.'}],
    model: `DAG-LONGEST-PATHS(G, w, s)        // critical path; Θ(V + E)
    order = TOPOLOGICAL-SORT(G)
    for each vertex v in G.V
        v.d = -∞
        v.π = NIL
    s.d = 0
    for each vertex u in order       // every edge into v is relaxed before v is used
        for each v in G.Adj[u]
            if v.d < u.d + w(u, v)     // relax for a LONGER path
                v.d = u.d + w(u, v)
                v.π = u
    return the d values`})
 ],
 apsp: [
  () => ({id: 'learn-fw-paths', topic: 't19', title: 'Floyd-Warshall that remembers next hops',
    prompt: `A ${lgPick(['router builds its forwarding table', 'transit app precomputes every trip', 'game precomputes NPC routes'])}: distances are not enough, we must print the actual route between any pair. Modify FLOYD-WARSHALL to keep a <b>next-hop matrix</b> next[i, j] (the vertex after i on a shortest i ⇝ j path) and update it whenever going through k wins. Write <code>FW-PATHS(W, n)</code> and <code>PRINT-ROUTE(next, i, j)</code>.`,
    starter: 'FW-PATHS(W, n)\n    \n\nPRINT-ROUTE(next, i, j)\n    \n', define: ['fwpaths', 'printroute'], call: [], maxLoop: 3,
    correctness: [
     {label: 'Starts D from W', w: 1, test: lgRx(/\bd\s*=\s*(copy|w\b)|d\s*\[\s*i\s*,\s*j\s*\]\s*=\s*w/), hint: 'D = copy of W'},
     {label: 'Initializes next[i, j] = j for direct edges, NIL otherwise', w: 2, test: lgRx(/next\s*\[\s*i\s*,\s*j\s*\]\s*=\s*j|next\s*\[\s*i\s*\]\s*\[\s*j\s*\]\s*=\s*j/), hint: 'if W[i, j] < ∞: next[i, j] = j'},
     {label: 'k is the outermost loop', w: 2, test: t => { const k = t.search(/\bfor\b[^\n]*\bk\s*(=|in)/), i = t.lastIndexOf('for i', k); return k >= 0 && (i < 0 || i < k) && /for\s+i[\s\S]*for\s+k[\s\S]*for\s+i/.test(t) || (k >= 0 && t.indexOf('for i') > k); }, hint: 'for k = 1 to n, then i, then j'},
     {label: 'Updates D[i, j] through k', w: 2, test: lgRx(/d\s*\[\s*i\s*(,|\]\s*\[)\s*k\s*\]\s*\+\s*d\s*\[\s*k\s*(,|\]\s*\[)\s*j\s*\]/), hint: 'if D[i, k] + D[k, j] < D[i, j]'},
     {label: 'Next hop through k is next[i, k]', w: 2, test: lgRx(/next\s*\[\s*i\s*(,|\]\s*\[)\s*j\s*\]\s*=\s*next\s*\[\s*i\s*(,|\]\s*\[)\s*k\s*\]/), hint: 'next[i, j] = next[i, k]'},
     {label: 'PRINT-ROUTE walks next[] until j', w: 1, test: lgIn('printroute', /while[^\n]*!=\s*j|i\s*=\s*next/), hint: 'while i ≠ j: i = next[i, j]; print i'}],
    efficiency: [
     {label: 'Exactly three nested loops: Θ(n³)', w: 5, test: (t, P) => P.maxLoop === 3, hint: 'k, i, j.'},
     {label: 'Route printing is O(path length), not a new search', w: 5, test: (t, P) => P.hasFn('printroute') && !/dijkstra|bfs|for\s+k/.test(P.body('printroute')), hint: 'Just follow next[].'}],
    model: `FW-PATHS(W, n)                    // distances + next-hop memory; Θ(n³)
    D = copy of W
    for i = 1 to n
        for j = 1 to n
            if W[i, j] < ∞
                next[i, j] = j
            else next[i, j] = NIL
    for k = 1 to n                   // allow k as an intermediate
        for i = 1 to n
            for j = 1 to n
                if D[i, k] + D[k, j] < D[i, j]
                    D[i, j] = D[i, k] + D[k, j]
                    next[i, j] = next[i, k]   // first hop toward k
    return (D, next)

PRINT-ROUTE(next, i, j)            // O(path length)
    if next[i, j] == NIL
        print "no route"
        return
    print i
    while i != j
        i = next[i, j]
        print i`}),
  () => ({id: 'learn-closure', topic: 't19', title: 'Transitive closure: Floyd-Warshall on booleans',
    prompt: `For ${lgPick(['an access-control system ("can role i eventually reach resource j?")', 'a citation graph ("does paper i build on paper j?")', 'a flight network ("can I get from i to j at all?")'])} we only need <b>reachability</b>, not distances. Modify Floyd-Warshall to work on booleans: replace min with OR and + with AND, so it uses bits instead of numbers. Write <code>TRANSITIVE-CLOSURE(G, n)</code> that returns T[1..n, 1..n] in Θ(n³).`,
    starter: 'TRANSITIVE-CLOSURE(G, n)\n    \n', define: ['transitiveclosure'], call: [], maxLoop: 3,
    correctness: [
     {label: 'T[i, j] starts TRUE for i = j or an edge (i, j)', w: 3, test: lgRx(/i\s*==\s*j[^\n]*or|or[^\n]*i\s*==\s*j/), hint: 'T[i, j] = (i == j) or ((i, j) ∈ G.E)'},
     {label: 'k is the outermost loop', w: 2, test: t => { const k = t.search(/\bfor\b[^\n]*\bk\s*(=|in)/); return k >= 0 && /for\s+k[\s\S]*for\s+i[\s\S]*for\s+j/.test(t.slice(k)); }, hint: 'for k, then i, then j'},
     {label: 'Combines with OR and AND', w: 4, test: lgRx(/t\s*\[\s*i\s*(,|\]\s*\[)\s*j\s*\]\s*=\s*t\s*\[\s*i\s*(,|\]\s*\[)\s*j\s*\]\s*(or|\|\|)\s*\(?\s*t\s*\[\s*i\s*(,|\]\s*\[)\s*k\s*\]\s*(and|&&)\s*t\s*\[\s*k/), hint: 'T[i, j] = T[i, j] or (T[i, k] and T[k, j])'},
     {label: 'Returns T', w: 1, test: lgRx(/return\s+t\b/), hint: 'return T'}],
    efficiency: [
     {label: 'Three nested loops: Θ(n³) with 1-bit entries', w: 5, test: (t, P) => P.maxLoop === 3, hint: 'Same loop structure as Floyd-Warshall.'},
     {label: 'No numeric distances or +/min needed', w: 5, test: t => !/\bmin\s*\(|inf/.test(t), hint: 'Booleans only.'}],
    model: `TRANSITIVE-CLOSURE(G, n)          // boolean Floyd-Warshall; Θ(n³)
    for i = 1 to n
        for j = 1 to n
            T[i, j] = (i == j) or ((i, j) in G.E)
    for k = 1 to n                   // allow k as an intermediate stop
        for i = 1 to n
            for j = 1 to n
                T[i, j] = T[i, j] or (T[i, k] and T[k, j])
    return T`})
 ]
};

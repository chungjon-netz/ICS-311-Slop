Object.assign(LEARN, {
 t20:{goal:'Compute a maximum flow and prove it optimal with a minimum cut.',
  key:['A flow obeys capacity (0 ≤ f ≤ c) and conservation (in = out except at s and t) (CLRS 24.1).','The residual network G_f shows remaining capacity forward and cancellable flow backward.','Ford-Fulkerson: augment along any s→t path in G_f until none exists (CLRS 24.2).','Max-flow min-cut: |f| is maximum ⇔ no augmenting path ⇔ |f| = c(S, T) for some cut.','Edmonds-Karp picks shortest augmenting paths with BFS: O(VE²) (CLRS 24.2). Bipartite matching is max flow with unit capacities (CLRS 24.3).'],
  mistakes:['Forgetting backward residual edges, so flow can never be rerouted.','Counting edges from T back to S in a cut\'s capacity (only S→T edges count).','Assuming Ford-Fulkerson is polynomial with arbitrary path choice.'],
  prompts:[['If no s→t path exists in G_f, what cut proves f is maximum?','S = vertices reachable from s in G_f, T = the rest; every S→T edge is saturated.'],['Which earlier search does Edmonds-Karp reuse?','BFS (Topic 14A), to find the augmenting path with the fewest edges.']],
  eli5:{goal:'🚰 This is the water-through-pipes game: push as much as you can from the tap to the drain, then prove you cannot do better.',key:'💡 The rules of the game: every pipe has a size limit, what goes in must come out, and you can "unsend" water to make room for a smarter route.',mistakes:'⚠️ Easy to trip on: these pipes secretly work both ways — you can push water back to fix an earlier bad choice.',prompts:'🧠 Little brain-check questions. Try answering out loud first, then peek!'}},
 t24:{goal:'Classify problems as P, NP, NP-complete and prove hardness by reduction.',
  key:['P: solvable in polynomial time. NP: a proposed solution (certificate) can be checked in polynomial time (CLRS 34.1–34.2).','A ≤ₚ B: a poly-time transform maps yes-instances of A to yes-instances of B (CLRS 34.3).','NP-complete = in NP and NP-hard. If any NP-complete problem is in P, then P = NP.','CLRS proves CIRCUIT-SAT NP-complete first, then SAT and 3-CNF-SAT; further reductions give CLIQUE, VERTEX-COVER, HAM-CYCLE, TSP, SUBSET-SUM (CLRS 34.4–34.5).','To show B is NP-complete: show B ∈ NP, then reduce a known NP-complete A to B.'],
  mistakes:['Reducing in the wrong direction (reduce the known hard problem TO the new one).','Saying "NP means not polynomial".','Forgetting to show membership in NP.'],
  prompts:[['To prove CLIQUE is NP-hard, which direction is the reduction?','3-CNF-SAT ≤ₚ CLIQUE: transform any formula into a graph instance.'],['Why is subset sum NP-complete if Topic 12 solved it with DP?','The DP is O(nT), polynomial in the value T, not in the number of bits of T (pseudo-polynomial).']],
  eli5:{goal:'🧩 Some puzzles are easy to CHECK but super hard to SOLVE. This box is about how we know which puzzles are which.',key:'💡 The big ideas: "P" means fast to solve, "NP" means fast to check, and the hardest checkable puzzles are called NP-complete.',mistakes:'⚠️ Watch out: NP does not mean "not possible" — it just means "we are not sure how fast it is".',prompts:'🧠 Puzzle questions! Try each one yourself before looking at the answer.'}},
 t25:{goal:'Design approximation algorithms with provable ratio bounds.',
  key:['A ρ(n)-approximation always returns a cost within a factor ρ of optimal (CLRS 35 intro).','APPROX-VERTEX-COVER takes both ends of a maximal matching: a 2-approximation (CLRS 35.1).','Metric TSP: MST preorder walk gives cost ≤ 2·OPT, using the triangle inequality (CLRS 35.2).','General TSP has no constant approximation unless P = NP.','Greedy set cover is an H(max |S|) = O(ln n) approximation (CLRS 35.3).'],
  mistakes:['Comparing against an optimum you cannot compute instead of a lower bound (e.g. matching size, MST weight).','Applying the MST trick to TSP without the triangle inequality.'],
  prompts:[['Why is APPROX-VERTEX-COVER within 2× of optimal?','Any cover must include one end of each matching edge, so OPT ≥ |M|, and the algorithm uses 2|M|.'],['Which Topic 17 algorithm does metric TSP approximation use?','An MST (e.g. Prim) as the lower bound and the tour skeleton.']],
  eli5:{goal:'🎯 When the perfect answer takes forever, grab an answer that is guaranteed to be close — like "never more than double the best".',key:'💡 These are the tricks grown-ups use: guard both ends of a hallway, or walk the cheapest road map and skip towns you already saw.',mistakes:'⚠️ A sneaky mistake: comparing your answer to a guess instead of the real best can fool you.',prompts:'🧠 Check if the guarantees make sense — answer each one before peeking!'}},
 t22:{goal:'Analyze fork-join parallel algorithms using work, span and parallelism.',
  key:['spawn lets a child run in parallel; sync waits for spawned children; parallel for splits loops (CLRS 26.1).','Work T₁ = total operations; span T∞ = longest path in the computation DAG.','Work law T_P ≥ T₁/P; span law T_P ≥ T∞; parallelism = T₁/T∞.','A greedy scheduler achieves T_P ≤ T₁/P + T∞.','Determinacy races: parallel strands writing the same location give nondeterministic results.'],
  mistakes:['Adding spans of parallel branches (take the max) instead of serial ones (add).','Expecting speedup beyond the parallelism T₁/T∞.','Parallelizing a loop whose iterations write shared data.'],
  prompts:[['P-FIB(n): what are its work and span?','Work Θ(φⁿ) like serial Fibonacci; span T∞(n) = T∞(n−1) + Θ(1) = Θ(n).'],['How would you parallelize merge sort (Topic 7)?','Spawn the two recursive sorts; with a serial merge the span is Θ(n), so a parallel merge is needed for more parallelism.']],
  eli5:{goal:'🧵 Instead of one worker doing everything alone, use lots of friends at once. This is about counting the total chores and the longest must-do chain.',key:'💡 Two magic numbers: "work" is ALL the chores added up, and "span" is the longest chain of chores you cannot skip.',mistakes:'⚠️ Easy to mess up: when chores happen at the same time, add their work but take only the LONGER span.',prompts:'🧠 Try these questions out loud — they check if work and span make sense.'}}
});
REVIEW.final = {
 chain:[['t20','Max flow builds on graph search (BFS in Edmonds-Karp) and gives min cuts and matchings.'],
  ['t24','Steps back to ask which problems have efficient algorithms at all: P vs NP and reductions.'],
  ['t25','When a problem is NP-complete, approximate it with guarantees, often using earlier tools (matchings, MSTs, greedy).'],
  ['t22','Parallelism: rethinks the same algorithms (Fibonacci, merge sort, matrix multiply) in terms of work and span.']],
 checklist:['Run Ford-Fulkerson and find the min cut.','Write an NP-completeness proof outline (in NP + reduction from a known problem).','Prove the 2-approximation for vertex cover and metric TSP.','Compute work, span and parallelism for a fork-join algorithm.','For every earlier midterm: list its algorithms with running times from memory.'],
 eli5:{chain:'🗺️ These arrows show how each new lesson uses the ones before it — like building blocks stacking on top of each other.',checklist:'✅ Tick a box only when you can really do it without peeking at the notes!',plan:'🗓️ Your game plan for studying: a little bit every day beats one giant cram session at the end!'},
 plan:['Week before: one midterm tab per day, using its review chain and “Practice” quiz.','Then the new topics here: one day for flows, one for NP-completeness plus approximation, one for parallelism.','Mix it up: run “Practice the whole course” daily and redo any topic under 80%.','Day before: sleep, then a final mixed quiz. Spacing beats cramming.']};

// ======================= DUMMY MODE: DEEPER-DIVE REWRITES =======================
// KIDDEEP[id][i] is the 5-year-old rewrite of DEEP[id].deep[i] (base items first,
// then Professor's Corner items appended by PROF/PROF2, in that order).
const KIDDEEP = {
 t01: [
  '⚡ Two ways to count a huge pile of toys. A super-fast computer still loses to the smarter way, because the smart way asks way fewer questions — that is why we count steps, not seconds.',
  '🚏 A circular queue is like a Ferris wheel of seats: when you reach the end you wrap back to the start. One seat stays empty so we can tell "full" from "empty".',
  '🛡️ A sentinel is a fake player standing at the edge of the game so real players never have to ask "am I at the end?" — the rules just work.',
  '🌳 Some trees have any number of branches. Each node just points to its first kid and to its next little brother — two arrows total, no wasted space.',
  '📋 An ADT is the menu of things you can order; a data structure is the kitchen that cooks them. You can swap the kitchen without changing the menu.',
  '🪜 Proof by induction is like dominoes: knock over the first one and each one knocks the next. Show the first is true, and that each truth pushes the next.',
  '🔬 Analyzing an algorithm is two jobs: prove it always gives the right answer, and count its steps as the pile of toys grows.'
 ],
 t03: [
  '📏 Saying a recipe is "about n²" means: never faster than one speed, never slower than another, once the input is big enough.',
  '⚖️ The limit test is a race: divide the two speeds and watch who wins as n gets huge. The bigger winner means the other recipe is slower.',
  '🤫 You can hide small stuff inside big-O — "n² + crumbs = n²". But hide an n and the whole answer changes!',
  '🧰 A toolbox of number facts: logs grow super slowly, powers of 2 explode, and n! (trying every order) is the biggest of all.',
  '🏷️ Big-O describes the SHAPE of a speed, not whether it is the worst day. Insertion sort can be fast one day and slow the next — same shape.',
  '🧮 Count each line of the recipe and add it up. The trick: "where is x" is at most n, so the worst case is just n steps.',
  '🥊 To compare two speeds, ask: as n grows, does one pull away forever? If yes, it wins. Little-o is just "wins by a lot".'
 ],
 t02: [
  '🧾 Give every line a price tag and count how many times each line runs. Add it all up for the total cost.',
  '🔁 A loop invariant is a promise that stays true every lap around the loop — like "everything I checked so far was not x".',
  '🔀 An inversion is a pair of cards out of order. Insertion sort fixes exactly one per shift, so counting inversions counts the work.',
  '⏱️ One step is one tiny move: compare, add, point at a box. Big jobs like "sort" are NOT one step — they are many steps glued together.',
  '📝 The sorting problem in plain words: you get a messy line of numbers and must hand back the same numbers in order. "In place" means no extra boxes.',
  '✅ To prove a loop works: show the promise is true before the loop, stays true each lap, and gives you the answer when the loop stops.',
  '🔁 Loops inside loops multiply: outer runs n times, inner runs about n times — you get about n×n = n² steps.'
 ],
 t07: [
  '🤝 Merging two sorted lines: always pick the smaller front card. The promise "everything already placed is the smallest so far" stays true.',
  '🌳 A recursion tree shows the levels of split-in-half work. If every level costs the same, multiply by the number of levels.',
  '📐 The master theorem is a shortcut: compare the split work with the combine work and it tells you case 1, 2 or 3.',
  '🪤 When guessing an answer you must prove the EXACT guess — guessing "cn" and getting "cn + n" fails. Fix: guess cn − d instead.',
  '📈 Best stretch of numbers with the biggest total: split in half — the answer is all-left, all-right, or crosses the middle.',
  '🧮 stupid_sort splits into thirds and pays n² per level. Since n² beats the split work, the total is just n² — proven by guessing and checking.'
 ],
 t09: [
  '🧮 A heap is a pyramid stored in a row: kids of spot i sit at 2i and 2i+1. No pointers needed — math finds everyone.',
  '🌊 Most nodes are leaves near the bottom and barely move; only a few near the top sink far. That is why building costs n, not n lg n.',
  '🎟️ A priority queue on a heap: the biggest item is always at the top. Add or upgrade an item and it bubbles up.',
  '🏆 Heapsort is the only guaranteed-fast sort that uses no extra space. Merge sort needs a big scratch area; quicksort can be slow on unlucky input.',
  '🌳 A 3-ary heap has three kids per node instead of two, so it is shorter. Height is still log n, so heapify stays fast.'
 ],
 t08: [
  '➡️ The successor is the next bigger key. If there is a right subtree, it is the smallest there; otherwise climb up until you come from a left child.',
  '✂️ Deleting a tree node has three cases. With two kids, swap in the successor — the next bigger key — which is easy to remove.',
  '📏 Every BST job costs O(h), the tree height. A bushy tree is fast; a tall skinny one is a slow linked list.',
  '🚶 Three ways to walk a tree: left-node-right prints sorted, node-first copies it, children-first frees it. Each visits every node once.',
  '⚖️ A heap only promises "parent bigger than kids" — good for max. A BST promises "left smaller, right bigger" — good for search and sorting.',
  '🔍 Proof by elimination: the successor cannot be an ancestor, a cousin, or have a left child — so it sits in the right subtree with no left child.'
 ],
 t05a: [
  '💡 An indicator is a light switch: 1 if the event happened, 0 if not. Expected count = adding up all the chances.',
  '🎲 Two different "random": lucky inputs (analysis) vs the algorithm shuffling itself (randomized). Shuffling protects against EVERY bad input.',
  '🔀 To shuffle fairly, swap card i with a random card from i onward. Using 1..n instead gives some orders more chances — a sneaky bug.',
  '➕ H_n = 1 + 1/2 + 1/3 + … grows like ln n. The same sum shows up in quicksort and random trees.',
  '🎲 Expected value is a weighted average. Indicators let you add up chances event by event — even when the events are linked.'
 ],
 t05b: [
  '⚖️ Two cards get compared only if one is the first pivot picked between them. Sum those chances and you get n lg n on average.',
  '📊 Worst split (tiny vs huge) gives n²; best split (even halves) gives n lg n. Even a lopsided 99:1 split still averages out fast.',
  '⚠️ If every card is equal, quicksort splits badly every time. A three-way partition (less, equal, greater) fixes it in one pass.',
  '🏎️ Quicksort wins because it works in place, scans memory nicely, and has a tiny inner loop — libraries patch its weak spots.',
  '🔍 In a shuffled list, the target sits at position (n+1)/2 on average. Randomized-select does the same trick: keep only the side with the answer.'
 ],
 t06: [
  '🗝️ A good hash spreads keys evenly. Division wants a prime table size; multiplication works anywhere; random hashing makes every input fair.',
  '⛓️ Chaining hangs colliding keys on a list. With load α = n/m, a search checks about 1 + α keys on average.',
  '🚶 Open addressing bumps to the next free slot. Linear probing clumps together; double hashing jumps around to avoid it.',
  '📈 Each probe probably hits an occupied slot with chance α, so expected probes = 1 + α + α² + … = 1/(1−α). Keep the table less than half full!',
  '🪦 Deleting in open addressing leaves a tombstone so search chains stay intact. But too many tombstones make inserts scan the whole table — time to rehash.'
 ],
 t11: [
  '📏 Red-black trees cannot get too tall: at least half the nodes on any path are black, and black nodes double the minimum size each level.',
  '🎭 Merge each red node into its black parent and you get a 2-3-4 tree. Recoloring is splitting a full box; rotations rearrange.',
  '🔄 A rotation just relinks three pointers — O(1). The in-order sequence of keys does not change, so search stays correct.',
  '🏁 The fix-up climbs two levels per step and the tree is only O(lg n) tall, so it stops quickly. Rotations happen at most twice.'
 ],
 t10a: [
  '🎯 Good pivots halve the problem; bad ones barely shrink it. On average the size shrinks by a factor each round, so total work is a short geometric series = linear.',
  '🛡️ To guarantee a good pivot: group into fives, find each median, pick the median of medians. It is provably near the middle — linear worst case.',
  '⚖️ Finding both min and max: compare pairs first, then each against its champion — 3 comparisons per 2 items beats 2n.',
  '🧰 Use selection for medians, percentiles, "k smallest", or a guaranteed pivot to make quicksort worst-case fast.',
  '🛢️ The pipeline problem answer is the median: any other spot costs extra pipe. And picking the true median as pivot makes quicksort always balanced.'
 ],
 t10b: [
  '🌳 Every comparison sort is a guessing tree with n! leaves, so it needs height lg(n!) = n lg n. No comparison sort can beat that.',
  '🚪 Counting and radix sort do not compare keys — they use the keys themselves as addresses. But they need special assumptions.',
  '🔢 Sort by ones digit, then tens, then hundreds. Stability keeps earlier digits order — like sorting by month then day.',
  '🪣 Scatter keys into n buckets by value, sort each tiny bucket, concatenate. Works great when keys are spread evenly.',
  '🏷️ To make a sort stable, sort pairs (value, original position) — ties break by position, preserving order. Costs one extra comparison and n words.',
  '✅ Radix invariant: "after pass i, sorted by the last i digits." Each pass is stable, so equal digits keep their old correct order — that is the whole proof.'
 ],
 t12s: [
  '🔙 Try a choice, recurse, and if it fails undo and try the next. The search tree of partial answers is usually exponential — pruning cuts bad branches early.',
  '🎒 Subset sum: for each item, try skipping it or taking it. The same (index, remaining target) appears many times — remember answers and it becomes a table.',
  '💡 If the same subproblem shows up over and over, cache it. Polynomial distinct subproblems = polynomial DP.',
  '✂️ Cutting a stick every possible way is 2^(n−1) answers, but the recursive algorithm recomputes them all — exponential. Memoize and it collapses.',
  '🌳 A "perfect" subtree has all leaves at the same depth. Compute heights bottom-up; the biggest qualifying height is the answer — one pass.'
 ],
 t12a: [
  '🧭 DP recipe: describe the best answer, write a formula for it, fill a table smallest-first, then read the answer back.',
  '🌿 Plain recursion recomputes the same lengths over and over — the tree explodes. A table computes each length once: n² instead of 2ⁿ.',
  '🔄 Memoized recursion computes only what is needed; bottom-up computes everything in order. Same answer — bottom-up is usually faster.',
  '❌ "Always cut the best-price piece first" sounds smart but can lose. DP tries every first cut, so it never misses the true best.',
  '🎉 Whether a kid can come depends only on their parent choice, so the state is just "best fun given I am in or out" — two numbers per node.'
 ],
 t12b: [
  '🧩 An LCS last letter is either matched at the ends or dropped from one side — so the big problem builds on smaller answers.',
  '🔤 Subsequence = keep order, skips allowed. Substring = must be contiguous. Different problems, different tables.',
  '🧬 Same grid trick solves edit distance, longest palindrome, and DNA alignment — change the recurrence, keep the table.',
  '⬅️ To rebuild the actual subsequence, walk back from the corner following the arrows — matches spell the answer.',
  '🌀 Longest palindromic subsequence: if ends match, keep both; else drop one end and take the better side. Fill by increasing length.'
 ],
 t13: [
  '✅ Greedy works when the first "obvious" pick can be proven safe — swap it into any best answer without making things worse.',
  '🗜️ Huffman merges the two rarest letters first. You can prove any best code can be rearranged to match — so greedy never loses.',
  '🔤 A prefix code means no codeword starts another, so decoding is unambiguous: read bits, walk the tree, output at a leaf.',
  '🚧 Greedy is not magic: coin change, 0-1 knapsack and interval scheduling all have counterexamples. Prove it or find the counterexample.',
  '⚖️ Some greedy picks win (earliest finish, latest start), some lose (shortest activity, fewest overlaps). Each needs a proof or a counterexample.',
  '⚖️ To prove a greedy pick is safe: take the best answer, swap in the greedy pick, and show it still works and costs no more — like trading for a piece that fits better.',
  '🌳 Huffman merges the two rarest letters until one tree remains. Two lemmas make it safe: the rarest pair can always sit deepest, and merging them is like giving them a shared parent.',
  '🔤 A prefix code means no code starts with another code — read bits, walk the tree, done. Coin-change greedy works because each big coin beats all small ones combined.'
 ],
 t14a: [
  '🌊 BFS waves out ring by ring; the first time you reach a vertex is via the fewest hops — that is a shortest path.',
  '🧭 DFS colors edges: tree (discovery), back (a cycle!), forward, cross. A back edge means the graph has a loop.',
  '🗺️ Sparse graph → adjacency lists (save space). Dense graph → matrix (instant edge checks). Pick by how many edges per vertex.',
  '🧰 BFS: shortest hops, maze solving. DFS: cycles, topo sort, connected groups — the two workhorses of graphs.',
  '🔀 Transposing (flipping all edges) is easy for a matrix, annoying for adjacency lists — the best trick copies while deleting, peaking at O(V) extra.',
  '🌊 BFS promise: "everyone in line was reached in order." When a spot pops out, its distance is final — a shorter path would have been found first.',
  '🧭 DFS paints spots three colors: white (new), gray (on the path now), black (done). A gray neighbor means a cycle; black ones are forward or cross edges.'
 ],
 t14b: [
  '🏁 In a DAG every edge points "finishes earlier → finishes later", so sorting by finish time puts every edge forward.',
  '🧩 SCCs are groups where everyone can reach everyone. DFS once, transpose the graph, DFS again in finish order — each tree is one group.',
  '📋 Topo order schedules tasks with prerequisites; DAG shortest paths and path counting reuse the same order.',
  '🧮 Doing SCC by hand is pure bookkeeping practice — every later graph algorithm depends on correct discovery/finish times. Kahn is the queue version of topo sort.',
  '🏁 In a no-cycle graph, whoever finishes LAST started EARLIEST — so listing vertices by finish time puts every arrow pointing forward.',
  '🧩 Flip every arrow and run DFS again, biggest finish time first. Each tree you get is exactly one "everyone reaches everyone" group.'
 ],
 t18: [
  '🛣️ Shortest paths have nice rules: a piece of a shortest path is itself shortest, and distances only shrink as you relax.',
  '🚫 Dijkstra assumes "done means best forever". A negative edge can teleport you cheaper later, breaking that promise.',
  '🌀 A negative cycle reachable from s makes distances −∞ — go around forever getting cheaper. Bellman-Ford detects it with one extra pass.',
  '🕸️ In a DAG there are no cycles, so relaxing edges in topo order solves it in one pass — even with negative weights. Flip signs for longest paths.',
  '🔁 Bellman-Ford promise after i rounds: "every guess is at most as good as the best path using i roads or fewer." One more round that changes nothing means done.',
  '🛣️ In a no-cycle graph, relax roads in order — each road once. Dijkstra settles the closest spot forever, but ONLY if no road has negative time.'
 ],
 t19: [
  '🧭 Ask: is i→j faster through k? d[i,j] = min(old, d[i,k] + d[k,j]). Repeat for every k — the whole chart updates in place.',
  '🗺️ Keep a "who points to j" table; whenever a path improves, update it. Walk it backwards to print the actual route.',
  '🪄 Add a fake source, run Bellman-Ford to get potentials h, then shift every edge by h(u)−h(v) so all weights go non-negative — Dijkstra works after that.',
  '🎯 Dense graph → Floyd-Warshall (simple n³). Sparse → Johnson or Dijkstra-from-each. Unweighted → BFS from each vertex.',
  '🧭 Floyd-Warshall: "best path using only towns 1..k as stops." Round k asks: is it faster to stop in town k? The whole chart updates in place.',
  '🪄 Negative roads break Dijkstra. Trick: add fake distances h to every road so all become non-negative, run Dijkstra, then subtract h back — shortest paths stay the same.'
 ],
 ds: [
  '🤝 Union by rank: always attach the shorter tree under the taller one; ties bump the rank. Rank is a height limit, not the real height.',
  '📊 m operations on n items cost about m·α(n) — α grows so slowly it is basically 4 forever. You need the result, not the proof.',
  '🌲 Static graph? Just DFS once. Union-Find wins when edges arrive one at a time — like Kruskal adding them.'
 ],
 mst: [
  '✂️ Safe edge proof: add the cheapest crossing edge, break the cycle it makes by removing an equal-or-heavier edge — still a tree, still cheapest.',
  '🧩 Every MST algorithm is just "find a safe edge across a cut." Kruskal scans globally, Prim grows one blob.',
  '⚖️ Three pretend algorithms judged: deleting heavy edges first is correct (mirror trick), ignoring weights is wrong, and "add then drop the heaviest on the cycle" is correct.'
 ],
 kruskal: [
  '🔢 Sort edges once, then one pass: take an edge only if its two ends are in different groups yet (union-find answers that fast).',
  '⏱️ Sorting costs E lg V and dominates; the union-find part is nearly free. Disconnected graph? You get a forest, still minimal.'
 ],
 prim: [
  '🎈 Prim grows one blob: always add the cheapest edge leaving the blob. key[v] = cheapest way into the blob so far.',
  '📐 Dense graph (like the island matrix)? Use the simple array version, Θ(n²) — a heap just adds a log factor for nothing.'
 ],
 fib: [
  '💤 Fibonacci heap is lazy: do not organize, just pile trees in a list and only sort them when you need the minimum. That makes decrease-key O(1).',
  '🏷️ The mark bit decides when a node lost two kids and must be cut loose. Pay a little potential now, save big work later.'
 ],
 t20: [
  '🚰 Pipes have capacity limits; water in = water out at every junction. The residual graph shows room left forward AND flow you could cancel backward.',
  '✂️ The most water you can push equals the smallest set of pipes you would have to cut to stop it. When no path remains, the reachable set proves it.',
  '🧭 Bad path choices can make Ford-Fulkerson take forever. Edmonds-Karp uses BFS paths: O(VE²), always finishes.',
  '🧩 Matching, edge-disjoint paths, vertex capacities — all become max flow with a source, sink and unit or split capacities.'
 ],
 t24: [
  '🧩 P = fast to solve. NP = fast to CHECK an answer. NP-complete = the hardest checkable puzzles; solve one fast and all of NP is fast.',
  '📝 Two steps: show B ∈ NP (a certificate you can check fast), then turn a known hard problem INTO B — the direction matters!',
  '🕸️ Each clause becomes 3 vertices; edges join non-contradicting literals. A k-clique = picking one true literal per clause = a satisfying assignment.',
  '⚖️ "Is there a tour ≤ k?" is NP-complete, but shortest path is easy while longest path is hard — small wording changes flip difficulty.'
 ],
 t25: [
  '📏 A ρ-approximation promises: your answer is never worse than ρ times the best possible. "2-approx" means at most double.',
  '🗺️ Build the cheapest road network (MST), walk around it twice-ish, skip repeats — triangle inequality keeps shortcuts cheap: ≤ 2× optimal.',
  '🧺 Repeatedly pick the set covering the most uncovered items. The charging argument gives O(lg n) — nearly the best possible.',
  '🎲 Random assignment satisfies 7/8 of 3-CNF clauses in expectation; LP rounding for vertex cover takes everyone with x ≥ 1/2 — both provably close.'
 ],
 t22: [
  '🧵 Work = total chores. Span = longest chore chain you cannot skip. Series: both add. Parallel: work adds, span takes the max.',
  '⚙️ A greedy scheduler either fills all processors (counts toward work/P) or runs every ready strand (shortens the critical path). Hence T_P ≤ T₁/P + T∞.',
  '🏁 parallel for splits the range with spawns. A race is two strands writing the same spot — give each its own output slot to stay deterministic.',
  '🚀 Speedup ≤ processors AND ≤ parallelism T₁/T∞. More processors than parallelism cannot help — that is the ceiling.'
 ]
};

// ======================= DUMMY MODE: PROFESSOR'S LECTURE REWRITES =======================
// KIDLEC[id][i] is the 5-year-old rewrite of LECTURE[id][i]; corner items reuse KIDDEEP.
const KIDLEC = {
 ds: [
  '👥 Groups that keep merging: the only question is "are we on the same team yet?" — and the trick is never rewriting the whole list.',
  '📖 The book\'s Chapter 19 teaches the same trick: point one team name at another, then flatten paths as you search.',
  '🔗 Tiny example: 8 kids each on their own team — merge always makes the smaller-rank team follow the bigger one.',
  '⚠️ Watch out: rank is a height-limit sticker, not the real height — and the α(n) number grows so slowly it is basically constant.'
 ],
 mst: [
  '🗺️ Cheapest way to connect every town with no loops — like laying the least pipe between all the houses.',
  '📖 Book Chapter 23 proves the safe-edge rule: the cheapest edge across any gap is always safe to use.',
  '✂️ Example: a cut with crossing costs 8, 2, 6 — the 2 is safe; swap it in and drop something heavier.',
  '⚠️ Ties mean many right answers with the same total cost — and the cut must respect edges you already picked.'
 ],
 kruskal: [
  '🧮 Sort every edge by price, then grab each one unless it would make a loop — union-find is the loop detector.',
  '📖 Book §23.2 writes it exactly this way; sorting costs E lg E and the union-find part is nearly free.',
  '🛤️ Tiny example: edges priced 1, 2, 3, 1 — take the 1s and the 2, skip the 3 that closes a loop.',
  '⚠️ Sort once, one pass only. A "loop" means same team, not nearby on the map — and a disconnected graph gives a forest.'
 ],
 prim: [
  '🎈 Grow one blob of connected towns; each step add the cheapest road leaving the blob.',
  '📖 Book §23.2: a priority queue hands you the cheapest crossing edge over and over.',
  '🚗 Example: start at s, cheapest exit is b (cost 3), then a drops to 2 through b — always take the min.',
  '⚠️ key[v] means "cheapest road INTO the blob", not cheapest overall — update only when the blob improves it.'
 ],
 fib: [
  '😴 Lazy heap: let a messy pile of tree-tops sit around; only tidy it when you need the smallest.',
  '📖 Book Chapter 20 (3rd edition): potential = trees + 2·marks pays for the tidying later.',
  '✂️ Example: lose one child → mark it; lose a second → snip it off and let it join the pile.',
  '⚠️ "O(1)" here means amortized — average over a whole bunch of ops, not guaranteed every single time.'
 ],
 t01: [
  '🧺 Different boxes for different jobs: a stack is last-in-first-out plates, a queue is a first-in-first-out line.',
  '📖 Book Chapters 1 & 10 list each box\'s price: stack pop is instant, list search may walk everything.',
  '📚 Example: a queue with head/tail pointers — enqueue writes at tail, dequeue reads at head, both instant, no shifting.',
  '⚠️ "Fast" depends on the job — no single box wins everything; pick by the operation you need most.'
 ],
 t03: [
  '📏 Big-O is about the SHAPE of growth, not exact counts — like saying "this recipe feeds a crowd" without counting bites.',
  '📖 Book Chapter 3 defines O, Ω, Θ and the little versions; logs grow slow, powers explode.',
  '🧮 Example: find-x costs fx(n) steps; since fx(n) ≤ n always, worst case = n steps = Θ(n), best = 1 step.',
  '⚠️ O only caps the top — for exact answers say Θ; log bases do not matter but exponents do.'
 ],
 t02: [
  '🔁 Loop invariant = a promise that stays true every lap: "everything I checked so far was not x".',
  '📖 Book §2.1–2.2 proves it for insertion sort: true before, kept true each round, useful at the end.',
  '🔍 Example: searching for 5 in a list — each failed check adds "not in the checked part" to the promise.',
  '⚠️ The promise must help at the finish line — "the loop is still running" proves nothing.'
 ],
 t07: [
  '✂️ Split the job in half, do each half, glue the results — like sorting a deck by splitting, sorting piles, merging.',
  '📖 Book Chapter 4: write the recurrence T(n) = 2T(n/2) + n, then solve by tree, guessing, or the Master rule.',
  '🌳 Example: stupid_sort does 3 sub-jobs of n/3 plus an n² combine — the n² wins, answer Θ(n²).',
  '⚠️ Master theorem needs combine cost vs n^(log_b a) — and case 3 needs the extra regularity check.'
 ],
 t09: [
  '⛰️ A heap is a mountain rule: every parent taller than its kids — tallest always on top.',
  '📖 Book Chapter 6: parent at ⌊i/2⌋, kids at 2i and 2i+1 inside a plain array; sift-down costs lg n.',
  '🧱 Example: building a heap bottom-up is O(n), not n lg n — most nodes sit near the bottom.',
  '⚠️ A heap is NOT sorted — only parent ≥ kids. Sorted order comes out one extract at a time.'
 ],
 t08: [
  '🌳 A BST keeps order by position: left = smaller, right = bigger — like a filing system.',
  '📖 Book Chapter 12: search, insert, successor, delete all cost O(h) — height is everything.',
  '🔀 Example: successor = go right once then all the way left; or climb until you come from a left branch.',
  '⚠️ "BST" alone does not promise lg n — sorted insert order makes a stick with h = n. Balance comes in Topic 11.'
 ],
 t11: [
  '⚖️ Red-black trees = 2-3-4 trees wearing a binary costume — same balance, different paint.',
  '📖 Book Chapter 13 (Sedgewick ch. 15 for 2-4 trees): a red node plus its red kids = one fat node.',
  '🔄 Example: insert into a full node → split it, push the middle key up; rotations fix colors in O(1).',
  '⚠️ Height is at most twice optimal — loose but guaranteed; the factor 2 is the price of binary.'
 ],
 t05a: [
  '🎲 Expected value = weighted average of outcomes — no need to actually roll the dice.',
  '📖 Book §5.1–5.3: E[X] = Σ x·Pr[X=x]; indicator variables turn counting into probabilities.',
  '🧮 Example: die rolled n times — each face expected n/s times, total expectation n(s+1)/2.',
  '⚠️ Linearity needs NO independence — sums always split; only products need independence.'
 ],
 t05b: [
  '🎲 Random pivot = the algorithm picks a random card to split by, so no input can trick it worst-case.',
  '📖 Book Ch. 7 & 9: RANDOMIZED-SELECT discards one side per round — expected O(n).',
  '📊 Example: k sits at position Y in a random permutation; E[Y] = (n+1)/2 — half the array on average.',
  '⚠️ "Expected O(n lg n)" still allows a rare O(n²) — always say which bound you mean.'
 ],
 t06: [
  '🗄️ Hash table = a mail sorter: compute the slot from the key, poke it in; collisions probe nearby.',
  '📖 Book §11.1–11.4: load factor α = n/m decides probe lengths; expected O(1) if α stays small.',
  '🪦 Example: deleting writes DELETED, not blank — blank would hide keys stored further down the probe chain.',
  '⚠️ Tombstones pile up: worst-case delete is Θ(m), not Θ(n) — rehash before the table clogs.'
 ],
 t10a: [
  '🏆 Selection = find the i-th smallest without sorting everything — cheaper than a full sort.',
  '📖 Book Chapter 9: Ω(n) lower bound (must look at every element); SELECT does it in O(n).',
  '⛽ Example: the pipeline height minimizing total spurs = the MEDIAN of the well heights.',
  '⚠️ Even n → the median is a range, not a point; median-of-medians guarantees a near-middle pivot.'
 ],
 t10b: [
  '🚧 Comparison sorting has a speed limit: about n lg n questions — proven by counting possible orders.',
  '📖 Book Chapter 8: decision trees need lg(n!) ≈ n lg n comparisons; counting/radix sort cheat the limit.',
  '🔢 Example: keys in 0..k → counting sort is Θ(n+k) = O(n) when k = O(n).',
  '⚠️ The limit only applies to comparison sorts — integer keys let you count instead of compare.'
 ],
 t12s: [
  '🧗 Backtracking = try a move, go deeper, undo if stuck — DFS over choices instead of vertices.',
  '📖 Erickson Ch. 2 (linked PDFs): pruning early is the whole art — check constraints ASAP.',
  '👑 Example: N-queens — place row by row, kill branches on column/diagonal conflicts immediately.',
  '⚠️ Still exponential worst case — exact search with early exit, not polynomial magic.'
 ],
 t12a: [
  '🧠 DP = recursion + a notebook: write answers down so you never solve the same subproblem twice.',
  '📖 Book Ch. 14: needs optimal substructure AND overlapping subproblems — rod cutting is the model.',
  '🪵 Example: cut(i) = best of price(j) + cut(i−j) — fill the table bottom-up, O(n²) vs 2ⁿ naive.',
  '⚠️ BOTH conditions required — recursion alone is not enough; watch the table fill order.'
 ],
 t12b: [
  '📜 LCS = longest shared subsequence — same items in same order, gaps allowed.',
  '📖 Book Ch. 14–15: c[i][j] = LCS of first i of X and first j of Y; match → diagonal +1, else max of neighbors.',
  '🧩 Example: X=ABCBDAB, Y=BDCABA → LCS length 4 (BCBA or BDAB).',
  '⚠️ Subsequence ≠ substring — no contiguity needed; and you must take max() when chars differ.'
 ],
 t13: [
  '⚡ Greedy = always grab the locally best piece — works only when you can prove it never hurts.',
  '📖 Book Ch. 16: activity selection (earliest finish) and Huffman coding are the provable cases.',
  '📅 Example: pick activities earliest-finishing first; Huffman merges the two rarest symbols each step.',
  '⚠️ Greedy without proof is a guess — coin change with bad coins breaks it instantly.'
 ],
 t14a: [
  '🕸️ Graphs = dots and lines; BFS spreads like a ripple (queue), DFS dives like a mole (stack).',
  '📖 Book §§20.1–20.3: BFS gives shortest paths unweighted; DFS gives finish times for later tricks.',
  '🌀 Example: BFS visits distance-1 neighbors first — first arrival IS the shortest path.',
  '⚠️ BFS needs a queue, DFS a stack — and O(V+E) assumes adjacency LISTS, not matrices.'
 ],
 t14b: [
  '📋 Topo sort = order tasks so prerequisites come first — only possible when there are no cycles.',
  '📖 Book §§20.4–20.5: reversed DFS finish times give the order; Kosaraju finds SCCs in two passes.',
  '🔁 Example: A→B, A→C, B→D, C→D — reversed finish order puts A first, D last.',
  '⚠️ Back edge to a gray vertex = cycle = no valid order; SCC ≠ weakly connected component.'
 ],
 t18: [
  '🛣️ Shortest paths: BFS for unweighted, Dijkstra for non-negative weights, Bellman-Ford if negatives lurk.',
  '📖 Book §§22.1–22.3: relaxation d[v] = min(d[v], d[u]+w) is the one mechanic everything shares.',
  '🏔️ Example: Dijkstra settles the smallest tentative distance next — settled means final (if w ≥ 0).',
  '⚠️ Negative edges break the "settled is final" idea — use Bellman-Ford; a V-th pass that still relaxes = negative cycle.'
 ],
 t19: [
  '🌐 All-pairs shortest paths = the full distance table between every pair of cities.',
  '📖 Book Ch. 23: Floyd-Warshall (DP, O(V³), negatives OK) vs Johnson (Bellman-Ford + V×Dijkstra, sparse wins).',
  '🧮 Example: FW updates d[i][j] = min(d[i][j], d[i][k]+d[k][j]) for each k — in-place is safe.',
  '⚠️ Negative cycle ⇒ distances are −∞ — detect first; FW needs O(V²) space, not O(V³).'
 ],
 t20: [
  '🚰 Max flow = push the most water through pipes without exceeding any pipe\'s width.',
  '📖 Book §§24.1–24.3: the residual network lets you undo flow; max-flow min-cut theorem certifies optimality.',
  '🔄 Example: BFS finds the shortest augmenting path each round until none remains — that is Edmonds-Karp.',
  '⚠️ Flow must balance at every middle vertex; the min cut is the PROOF your flow is maximum.'
 ],
 t24: [
  '🧩 NP-complete = puzzles where checking an answer is easy but finding one might be impossibly hard.',
  '📖 Book Chapter 34: prove NP-hardness by reduction — solve the known-hard one and you solve yours.',
  '🔗 Example: CLIQUE ≤ VERTEX-COVER — complement the graph; a k-clique becomes an (n−k)-cover.',
  '⚠️ The reduction must run in polynomial time; NP-complete = in NP AND NP-hard — both halves required.'
 ],
 t25: [
  '📐 Approximation = a provably-near-best answer in polynomial time when exact is too slow.',
  '📖 Book Chapter 35: vertex cover has a 2-approx via maximal matching; set cover is about ln n.',
  '🪢 Example: take both endpoints of each matched edge → |C| = 2|M| ≤ 2·OPT.',
  '⚠️ The ratio is a worst-case guarantee, not typical; metric TSP needs the triangle inequality.'
 ],
 t22: [
  '👯 Parallel = split chores across friends; speedup is limited by the longest dependency chain.',
  '📖 Work/span laws: T₁ = total work, T∞ = longest path; greedy scheduling gets within 2× of optimal.',
  '🌿 Example: P-FIB — work is φⁿ (huge), span is n (small) → parallelism φⁿ/n, tons of speedup available.',
  '⚠️ Two lower bounds: T_P ≥ T₁/P and T_P ≥ T∞; a race is two strands writing the same spot.'
 ]
};


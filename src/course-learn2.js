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
  '🧩 Every MST algorithm is just "find a safe edge across a cut." Kruskal scans globally, Prim grows one blob.'
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

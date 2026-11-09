// ======================= COURSE DATA · MIDTERM 3 =======================
COURSE.push(
{id:'t10a', num:'#10A', short:'Selection & Order Statistics', title:'Selection &amp;', grad:'Order Statistics', when:'Week 7 · Mon 10/05', icon:'🎯', color:'#f59e0b',
 blurb:'Min/max, RANDOMIZED-SELECT, worst-case linear SELECT (median of medians).',
 lead:'The <b>i-th order statistic</b> is the i-th smallest element. We can find it, including the median, in linear time, without sorting.',
 reading:'CLRS Chapter 9 (all)', notes:null,
 videos:[], mit:[['mR_RUjsJnV8','MIT Lecture 06: Order Statistics, Median']],
 prereq:[],
 html:`<h2>Minimum and maximum</h2>
 <div class="card"><ul class="clean"><li>Finding the min (or max) needs exactly n − 1 comparisons, and that is optimal.</li><li>Finding <b>both</b> min and max: process elements in pairs, compare the pair, then compare the smaller with min and the larger with max → at most 3⌊n/2⌋ comparisons.</li></ul></div>
 <h2>Selection</h2>
 <div class="grid g2"><pre><code><span class="fn">RANDOMIZED-SELECT</span>(A, p, r, i)
  <span class="kw">if</span> p == r  <span class="kw">return</span> A[p]
  q = <span class="fn">RANDOMIZED-PARTITION</span>(A, p, r)
  k = q - p + 1          <span class="cm">// rank of pivot</span>
  <span class="kw">if</span> i == k  <span class="kw">return</span> A[q]
  <span class="kw">elseif</span> i &lt; k
      <span class="kw">return</span> RANDOMIZED-SELECT(A, p, q - 1, i)
  <span class="kw">else</span> <span class="kw">return</span> RANDOMIZED-SELECT(A, q + 1, r, i - k)</code></pre>
 <div class="card"><h3>Costs</h3><table class="tbl"><tr><th>Algorithm</th><th>Expected</th><th>Worst</th></tr><tr><td>Sort then index</td><td>Θ(n lg n)</td><td>Θ(n lg n)</td></tr><tr><td>RANDOMIZED-SELECT</td><td>Θ(n)</td><td>Θ(n²)</td></tr><tr><td>SELECT (median of medians)</td><td>Θ(n)</td><td>Θ(n)</td></tr></table><p>Unlike quicksort, selection recurses on <b>only one side</b>, so the expected work is a geometric series.</p></div></div>
 <h2>Worst-case linear SELECT</h2>
 <div class="card"><ol><li>Divide the n elements into groups of 5 and find each group's median (insertion sort on 5 items).</li><li>Recursively SELECT the median x of those ⌈n/5⌉ medians.</li><li>Partition around x. At least about 3n/10 elements are smaller than x and about 3n/10 are larger.</li><li>Recurse into the side that contains the i-th element, which has at most about 7n/10 elements.</li></ol><p class="math">T(n) ≤ T(n/5) + T(7n/10 + 6) + O(n) = O(n), because 1/5 + 7/10 &lt; 1.</p></div>`,
 eli5:{title:'Finding the middle kid without lining everyone up',pts:['📏 Want the kid of middle height in a class? You could line everyone up (sorting), but that is a lot of work.','🎲 Trick: pick a random kid, split into shorter and taller groups, then only look in the group that must contain the middle kid.','🙅 You throw away the other group, so the work keeps shrinking fast.','🖐️ The super-safe version makes groups of 5, finds each group\'s middle, then the middle of those middles, to pick a good leader every time.']},
 diagram:()=>fig(D.svg(720,230,(()=>{let s='';const cols=7;for(let c=0;c<cols;c++){for(let r=0;r<5;r++){const med=r===2,isX=c===3&&r===2;const small=(c<3&&r<=2)||(c===3&&r<2),big=(c>3&&r>=2)||(c===3&&r>2);s+=`<circle cx="${130+c*70}" cy="${40+r*36}" r="13" fill="${isX?C.warn:small?C.good+'66':big?C.bad+'66':C.dim+'44'}" stroke="${med?C.warn:C.dim}" stroke-width="${med?3:1.5}"/>`;}}
   return s+D.text(360,225,'columns = groups of 5 (sorted). yellow ring = group median, gold = median of medians x',12,C.txt)+D.text(60,70,'≤ x',13,C.good,'middle',700)+D.text(660,150,'≥ x',13,C.bad,'middle',700);})()),
  'Median of medians: x is guaranteed to have about 3n/10 elements on each side, so the recursion shrinks by a constant fraction.','Each column is a team of 5. The middle of the middles is a "pretty good" leader, never too short or too tall.'),
 mc:[
  ['Expected running time of RANDOMIZED-SELECT:','Θ(n)',['Θ(n lg n)','Θ(lg n)','Θ(n²)'],'It recurses on one side only.'],
  ['Worst-case running time of RANDOMIZED-SELECT:','Θ(n²)',['Θ(n)','Θ(n lg n)','Θ(n³)'],'Unlucky pivots each remove only one element.'],
  ['The median-of-medians SELECT algorithm runs in worst-case:','O(n)',['O(n lg n)','O(n²)','O(lg n)'],'T(n) ≤ T(n/5) + T(7n/10) + O(n).'],
  ['Minimum number of comparisons to find the minimum of n elements:','n − 1',['n','n/2','lg n'],'Every non-minimum element must lose at least one comparison.'],
  ['Finding both min and max simultaneously needs at most about:','3n/2 comparisons',['2n − 2 comparisons','n lg n comparisons','n comparisons'],'Compare in pairs first.'],
  ['Why does SELECT use groups of 5?','So that the recursion sizes n/5 + 7n/10 sum to less than n',['Because 5 is prime','So each group can be hashed','To make it stable'],'Groups of 3 would not give linear time with this analysis.'],
  ['How does selection differ from quicksort after partitioning?','It recurses into only one side',['It recurses into both sides','It never partitions','It sorts each side'],'That is why it is linear instead of n lg n.']
 ]},

{id:'t10b', num:'#10B', short:'Lower Bounds & O(n) Sorts', title:'Theoretical Limits &amp;', grad:'O(n) Sorts', when:'Week 8 · Mon 10/12', icon:'📉', color:'#84cc16',
 blurb:'Decision trees, Ω(n lg n) comparison bound, counting sort, radix sort, bucket sort.',
 lead:'Every <b>comparison sort</b> needs Ω(n lg n) comparisons in the worst case. Sorts that use the <b>values</b> of keys (counting, radix, bucket) can beat that bound under extra assumptions.',
 reading:'CLRS Chapter 8', notes:'Topic 10',
 videos:[['gZmEYyqHefk','10C · Bounds on Sorting']], mit:[['0VqawRl3Xzs','MIT Lecture 05']],
 prereq:[],
 html:`<h2>The decision-tree lower bound</h2>
 <div class="grid g2"><div class="card"><ul class="clean"><li>Any comparison sort can be drawn as a <b>decision tree</b>: internal nodes compare a<sub>i</sub> : a<sub>j</sub>, leaves are permutations.</li><li>It must have at least <b>n!</b> reachable leaves (one per possible ordering).</li><li>A binary tree of height h has ≤ 2^h leaves, so 2^h ≥ n! ⇒ h ≥ lg(n!) = Ω(n lg n).</li><li>⇒ Merge sort and heapsort are <b>asymptotically optimal</b> comparison sorts.</li></ul></div>
 <pre><code><span class="fn">COUNTING-SORT</span>(A, B, n, k)   <span class="cm">// keys in 0..k</span>
  let C[0..k] be a new array of zeros
  <span class="kw">for</span> j = 1 <span class="kw">to</span> n
      C[A[j]] = C[A[j]] + 1     <span class="cm">// counts</span>
  <span class="kw">for</span> i = 1 <span class="kw">to</span> k
      C[i] = C[i] + C[i - 1]    <span class="cm">// # keys ≤ i</span>
  <span class="kw">for</span> j = n <span class="kw">downto</span> 1          <span class="cm">// backwards: stable</span>
      B[C[A[j]]] = A[j]
      C[A[j]] = C[A[j]] - 1</code></pre></div>
 <h2>Linear-time sorts</h2>
 <table class="tbl"><tr><th>Sort</th><th>Assumption</th><th>Time</th><th>Notes</th></tr>
 <tr><td>Counting sort</td><td>integer keys in 0..k</td><td>Θ(n + k)</td><td>stable; linear when k = O(n)</td></tr>
 <tr><td>Radix sort</td><td>d digits, each in 0..k</td><td>Θ(d(n + k))</td><td>sort by least significant digit first with a <b>stable</b> sort</td></tr>
 <tr><td>Bucket sort</td><td>keys uniform on [0, 1)</td><td>Θ(n) expected</td><td>n buckets, insertion sort each, concatenate</td></tr></table>`,
 eli5:{title:'The speed limit for sorting, and how to cheat it',pts:['❓ If you can only ask "is this one bigger than that one?", there is a speed limit: about n × log n questions.','🌳 That is because there are so many possible orders (n!), and each question only splits the possibilities in two.','🧮 But if you know keys are small numbers, you can just <b>count</b> them! "Three 2s, one 5…" Then write them out in order.','🔢 <b>Radix sort</b> sorts by the ones digit, then the tens digit, then the hundreds…','🪣 <b>Bucket sort</b> drops numbers into buckets by range, like sorting mail by zip code.']},
 diagram:()=>fig(D.svg(720,240,(()=>{const n=(x,y,l,c)=>`<rect x="${x-34}" y="${y-15}" width="68" height="30" rx="15" fill="${c}22" stroke="${c}" stroke-width="2"/>`+D.text(x,y+5,l,12,'#fff','middle',700);let s='';const L=[[360,30,'a₁ : a₂'],[200,95,'a₂ : a₃'],[520,95,'a₁ : a₃']];[[360,30,200,95],[360,30,520,95],[200,95,110,160],[200,95,290,160],[520,95,430,160],[520,95,610,160],[290,160,240,215],[290,160,340,215],[430,160,380,215],[430,160,480,215]].forEach(([a,b,c,d])=>s+=D.line(a,b+15,c,d-15,C.dim,2));L.forEach(([x,y,l])=>s+=n(x,y,l,C.acc));s+=n(290,160,'a₁ : a₃',C.acc)+n(430,160,'a₂ : a₃',C.acc);[[110,160,'⟨1,2,3⟩'],[610,160,'⟨3,2,1⟩'],[240,215,'⟨1,3,2⟩'],[340,215,'⟨3,1,2⟩'],[380,215,'⟨2,1,3⟩'],[480,215,'⟨2,3,1⟩']].forEach(([x,y,l])=>s+=n(x,y,l,C.good));return s+D.text(650,40,'3! = 6 leaves',13,C.good,'middle',700)+D.text(650,62,'height ≥ lg 6',12,C.mut);})()),
  'A decision tree for sorting 3 elements needs n! = 6 leaves, so its height is at least ⌈lg 6⌉ = 3.','Every question splits the possibilities in two. With 6 possible orders you need at least 3 questions.'),
 mc:[
  ['Any comparison sort requires, in the worst case:','Ω(n lg n) comparisons',['Ω(n) comparisons','Ω(n²) comparisons','Ω(lg n) comparisons'],'Decision tree with n! leaves has height ≥ lg(n!).'],
  ['A decision tree for sorting n elements must have at least:','n! leaves',['2ⁿ leaves','n² leaves','n leaves'],'One leaf per permutation.'],
  ['Counting sort on n keys in the range 0..k runs in:','Θ(n + k)',['Θ(n lg n)','Θ(nk)','Θ(k lg n)'],'Two passes over A and one over C.'],
  ['Why does counting sort place elements by iterating j from n down to 1?','To make it stable',['To make it in place','To reduce time to Θ(n)','To handle negative keys'],'Equal keys keep their relative order.'],
  ['Radix sort requires the per-digit sort to be:','Stable',['In place','Comparison based','Randomized'],'Otherwise earlier digit orderings are destroyed.'],
  ['Bucket sort runs in expected linear time when:','Inputs are uniformly distributed over [0, 1)',['Inputs are integers in 0..k','Inputs are already sorted','There are at most lg n distinct keys'],'Each bucket then has O(1) expected elements.'],
  ['Which sorts are asymptotically optimal comparison sorts?','Merge sort and heapsort',['Insertion sort and quicksort','Counting sort and radix sort','Bubble sort and selection sort'],'They achieve O(n lg n) worst case, matching the lower bound.'],
  ['Radix sort on n d-digit numbers with digits in 0..k takes:','Θ(d(n + k))',['Θ(n lg n)','Θ(dn lg n)','Θ(n + k + d)'],'d passes of counting sort.']
 ]},

{id:'t12s', num:'#12*', short:'Backtracking', title:'Backtracking &amp;', grad:'Recursion Review', when:'Week 8 · Wed 10/14', icon:'🧭', color:'#e879f9',
 blurb:'Recursive search: make a choice, recurse, undo. N-Queens, subset sum.',
 lead:'<b>Backtracking</b> builds a solution one decision at a time, recursing on each choice and <b>undoing</b> it when it leads to a dead end. It is the brute-force starting point for dynamic programming.',
 reading:'Jeff Erickson, <i>Algorithms</i>, Chapter 2 (sections 2.1, 2.3–2.4, 2.6, 2.8). If you are shaky on recursion, review Chapter 1 first.', notes:null,
 videos:[], extra:[['Jeff Erickson\'s Algorithms textbook (free online)','https://jeffe.cs.illinois.edu/teaching/algorithms/']],
 prereq:[],
 html:`<h2>The pattern</h2>
 <div class="grid g2"><div class="card"><ul class="clean"><li>A solution is a sequence of decisions x₁, x₂, …, x_n.</li><li>At each step, try every option for the next decision that is consistent with the choices so far.</li><li>Recurse. If the recursion fails, <b>undo</b> the choice and try the next option.</li><li>The recursive structure forms a <b>recursion tree</b> of partial solutions; pruning cuts off branches early.</li></ul></div>
 <pre><code><span class="fn">SUBSET-SUM</span>(X[1..n], T)   <span class="cm">// is there a subset summing to T?</span>
  <span class="kw">if</span> T == 0  <span class="kw">return</span> TRUE
  <span class="kw">if</span> T &lt; 0 <span class="kw">or</span> n == 0  <span class="kw">return</span> FALSE
  <span class="cm">// include X[n] or exclude it</span>
  <span class="kw">return</span> SUBSET-SUM(X[1..n-1], T - X[n])
      <span class="kw">or</span> SUBSET-SUM(X[1..n-1], T)</code></pre></div>
 <h2>Classic examples (Erickson ch. 2)</h2>
 <div class="grid g3"><div class="card"><h3>N-Queens</h3><p>Place queens row by row; for each row try every column that is not attacked. Backtrack when a row has no safe column.</p></div>
 <div class="card"><h3>Subset sum</h3><p>Each element is in or out: 2 branches per element ⇒ O(2ⁿ) time. Recurrence T(n) = 2T(n−1) + O(1).</p></div>
 <div class="card"><h3>Longest increasing subsequence</h3><p>Decide for each element whether to take it, remembering the last value taken. Exponential as written; memoizing gives DP (Topic 12).</p></div></div>
 <div class="callout cyan">Write the recursive procedure first, prove it correct by induction, then measure its cost with a recurrence. If subproblems repeat, that is a hint to use <b>dynamic programming</b>.</div>`,
 eli5:{title:'Exploring a maze: try a path, back up if stuck',pts:['🌽 Imagine walking a corn maze. At each fork you pick a path.','🧱 If you hit a dead end, you walk back to the last fork and try a different path. That is <b>backtracking</b>!','👑 N-Queens puzzle: put queens on a chess board one row at a time so none can attack another. Stuck? Move the last queen.','🌳 All the choices make a big tree. We skip whole branches as soon as we know they can\'t work.']},
 diagram:()=>fig(D.svg(720,220,(()=>{let s='';const nodes=[[360,30,'{ }',C.acc],[200,95,'take 3',C.acc],[520,95,'skip 3',C.acc],[120,160,'take 5',C.bad],[280,160,'skip 5',C.good],[440,160,'take 5',C.acc],[600,160,'skip 5',C.dim]];[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]].forEach(([a,b])=>s+=D.line(nodes[a][0],nodes[a][1]+14,nodes[b][0],nodes[b][1]-14,C.dim));nodes.forEach(([x,y,l,c])=>s+=`<rect x="${x-46}" y="${y-14}" width="92" height="28" rx="14" fill="${c}22" stroke="${c}" stroke-width="2"/>`+D.text(x,y+5,l,12,'#fff','middle',700));return s+D.text(120,195,'sum 8 > 7 ✗ prune',11.5,C.bad)+D.text(280,195,'sum 3 … continue',11.5,C.good)+D.text(360,215,'subset sum with X = {3, 5, 4}, target T = 7',12.5,C.txt);})()),
  'The recursion tree of SUBSET-SUM: each level decides one element; infeasible branches are pruned.','Each fork is "take it" or "skip it". Red branches go over the target, so we stop exploring there.'),
 mc:[
  ['Backtracking explores:','A recursion tree of partial solutions, undoing choices at dead ends',['Only the greedy choice at each step','A table of subproblems bottom-up','A random sample of solutions'],'Choose, recurse, un-choose.'],
  ['The naive recursive SUBSET-SUM on n elements runs in:','O(2ⁿ)',['O(n²)','O(n lg n)','O(n)'],'T(n) = 2T(n−1) + O(1).'],
  ['In the N-Queens backtracking algorithm, queens are typically placed:','One row at a time, trying each safe column',['All at once at random','Column by column with no checks','Only on the diagonal'],'Then backtrack when a row has no safe square.'],
  ['When a backtracking algorithm\'s subproblems repeat, it suggests:','Using dynamic programming (memoization)',['Using a greedy algorithm instead','Adding more recursion','Using a hash table of answers is never helpful'],'Store answers to repeated subproblems.'],
  ['What is "pruning" in backtracking?','Abandoning a branch as soon as it cannot lead to a valid solution',['Deleting nodes from a BST','Sorting the input first','Removing the base case'],'It shrinks the explored tree.'],
  ['The recurrence T(n) = 2T(n − 1) + O(1) solves to:','Θ(2ⁿ)',['Θ(n²)','Θ(n lg n)','Θ(n)'],'Doubling at every level for n levels.']
 ]},

{id:'t12a', num:'#12A', short:'Dynamic Programming', title:'Dynamic', grad:'Programming', when:'Week 9 · Mon 10/19', icon:'🧮', color:'#22c55e',
 blurb:'Overlapping subproblems, memoization vs bottom-up, rod cutting.',
 lead:'<b>Dynamic programming</b> solves problems with <b>optimal substructure</b> and <b>overlapping subproblems</b> by solving each subproblem once and storing the answer in a table.',
 reading:'CLRS Chapter 14.1–14.3 and Chapter 3 of Jeff Erickson\'s textbook (through Section 3.5)', notes:'Topic 12A',
 videos:[['RYPsOJmhwgE','12A · Dynamic Programming Intro'],['0tQ3ah0Fddw','12B · DP Steps (minutes 0:00–5:00)',0,300],['QzgqDJIJtNY','12D · DP Applications (0:00–6:16)',0,376],['QzgqDJIJtNY','12D · DP Applications (9:23–end)',563]],
 mit:[['V5hZoJ6uK-s','MIT Lecture 15: Dynamic Programming']],
 extra:[['Jeff Erickson\'s Algorithms, Chapter 3','https://jeffe.cs.illinois.edu/teaching/algorithms/']],
 prereq:[],
 html:`<h2>The four steps</h2>
 <div class="grid g2"><div class="card"><ol><li>Characterize the structure of an optimal solution.</li><li>Recursively define the value of an optimal solution.</li><li>Compute the value, usually <b>bottom-up</b> in a table.</li><li>Construct an optimal solution from the stored choices.</li></ol></div>
 <div class="card"><h3>Two ingredients</h3><ul class="clean"><li><b>Optimal substructure:</b> an optimal solution contains optimal solutions to subproblems.</li><li><b>Overlapping subproblems:</b> the naive recursion solves the same subproblems again and again.</li><li><b>Top-down memoization:</b> recursion + a lookup table. <b>Bottom-up:</b> fill the table in an order where dependencies are ready.</li></ul></div></div>
 <h2>Rod cutting</h2>
 <div class="grid g2"><pre><code><span class="fn">BOTTOM-UP-CUT-ROD</span>(p, n)
  let r[0..n] be a new array
  r[0] = 0
  <span class="kw">for</span> j = 1 <span class="kw">to</span> n
      q = -∞
      <span class="kw">for</span> i = 1 <span class="kw">to</span> j       <span class="cm">// first piece length i</span>
          q = max(q, p[i] + r[j - i])
      r[j] = q
  <span class="kw">return</span> r[n]</code></pre>
 <div class="card"><p class="math">r_n = max_{1 ≤ i ≤ n} (p_i + r_{n−i})</p><ul class="clean"><li>Naive recursion: T(n) = 1 + Σ T(j) = 2ⁿ. Exponential!</li><li>Bottom-up: n subproblems, each O(n) work ⇒ <b>Θ(n²)</b>.</li><li>Running time of DP ≈ (number of subproblems) × (choices per subproblem).</li></ul></div></div>
 <div class="callout"><b>Matrix-chain multiplication</b> (14.2): m[i,j] = min over i ≤ k &lt; j of m[i,k] + m[k+1,j] + p_{i−1}p_k p_j. Θ(n²) subproblems × O(n) choices = Θ(n³).</div>`,
 eli5:{title:'Don\'t solve the same puzzle twice: write it down!',pts:['📝 If your teacher asks "what is 7 × 8?" ten times, you work it out once and then just remember it.','🔁 Some problems break into smaller problems that repeat a LOT. Solving them again and again is wasteful.','📊 <b>Dynamic programming</b> keeps a chart. Every time you solve a small problem, write the answer in the chart.','🪵 Rod cutting: what is the best way to cut a candy bar to sell the pieces for the most money? Try each first cut and look up the best for what is left.']},
 diagram:()=>fig(D.svg(720,220,(()=>{let s=D.text(180,22,'naive recursion: fib(5)',13,C.txt,'middle',700);const T=[[180,50,'5'],[100,100,'4'],[260,100,'3'],[60,150,'3'],[140,150,'2'],[230,150,'2'],[290,150,'1'],[40,200,'2'],[80,200,'1']];[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,7],[3,8]].forEach(([a,b])=>s+=D.line(T[a][0],T[a][1],T[b][0],T[b][1],C.dim,1.8));T.forEach(([x,y,l])=>s+=D.node(x,y,l,['3','2'].includes(l)?C.bad:C.mut,14));
   s+=D.arrow(330,110,380,110,'mut',3);s+=D.text(550,22,'DP table: each value computed once',13,C.txt,'middle',700);[0,1,1,2,3,5].forEach((v,i)=>{s+=`<rect x="${400+i*50}" y="80" width="44" height="44" rx="8" fill="${C.good}22" stroke="${C.good}" stroke-width="2"/>`+D.text(422+i*50,108,v,16,'#fff','middle',700)+D.text(422+i*50,142,'f'+i,11,C.mut);if(i>1)s+=`<path d="M${422+(i-1)*50} 78 Q ${422+(i-0.5)*50} 58 ${422+i*50-6} 78" fill="none" stroke="${C.cy}" stroke-width="1.5" marker-end="url(#ar-cy)"/>`;});return s+D.text(550,185,'red nodes on the left are repeated work',12,C.bad);})()),
  'Naive recursion recomputes the same subproblems (red); a DP table computes each once.','The left tree does the same little problems over and over. The chart on the right does each one only once.'),
 mc:[
  ['Dynamic programming applies when a problem has:','Optimal substructure and overlapping subproblems',['Only independent subproblems','A greedy choice property only','No recursive structure'],'Divide & conquer handles independent subproblems.'],
  ['Memoization means:','Storing results of recursive calls in a table to reuse them',['Writing the algorithm bottom-up only','Sorting the subproblems','Using a greedy choice'],'Top-down DP.'],
  ['Bottom-up rod cutting for a rod of length n runs in:','Θ(n²)',['Θ(2ⁿ)','Θ(n)','Θ(n³)'],'n subproblems with up to n choices each.'],
  ['The naive recursive CUT-ROD makes how many calls for length n?','2ⁿ',['n²','n','n!'],'T(n) = 1 + Σ_{j<n} T(j).'],
  ['A rough formula for DP running time is:','(number of subproblems) × (choices per subproblem)',['(input size)²','2^(number of subproblems)','lg of the table size'],'Each subproblem is solved once.'],
  ['Matrix-chain multiplication with the DP algorithm runs in:','Θ(n³)',['Θ(n²)','Θ(2ⁿ)','Θ(n lg n)'],'Θ(n²) subproblems × O(n) split points.'],
  ['The last step of the DP method is:','Construct an optimal solution from stored information',['Prove the greedy choice','Sort the input','Guess the answer and verify by substitution'],'Keep "choice" tables (like s[j]) to rebuild the solution.']
 ]},

{id:'t12b', num:'#12B', short:'DP continued: LCS', title:'Dynamic Programming:', grad:'LCS &amp; More', when:'Week 9 · Wed 10/21', icon:'🔤', color:'#10b981',
 blurb:'Elements of DP, longest common subsequence, optimal BSTs.',
 lead:'More DP: when it applies, and the classic <b>longest common subsequence</b> (LCS) table, plus optimal binary search trees.',
 reading:'CLRS Chapter 14.4–14.5; more examples in Erickson Chapter 3 (sections 3.6–3.9)', notes:'Topic 12B',
 videos:[['0tQ3ah0Fddw','12B · DP Steps and LCS (from 5:00)',300],['dFObo5BeJ0k','12C · LCS Example Continued'],['QzgqDJIJtNY','12D · DP Applications Summary (from 6:17)',377]],
 mit:[['V5hZoJ6uK-s','MIT Lecture 15: Dynamic Programming']],
 prereq:[],
 html:`<h2>Longest common subsequence</h2>
 <div class="grid g2"><div class="card"><p>A <b>subsequence</b> keeps order but may skip characters. LCS("ABCBDAB", "BDCABA") has length 4 (e.g. "BCBA").</p>
 <p class="math">c[i, j] = 0 if i = 0 or j = 0<br>c[i, j] = c[i−1, j−1] + 1 if x_i = y_j<br>c[i, j] = max(c[i−1, j], c[i, j−1]) otherwise</p><p>Θ(mn) time and space. Store arrows (↖ ↑ ←) in table b to print the LCS in O(m + n).</p></div>
 <pre><code><span class="fn">LCS-LENGTH</span>(X, Y, m, n)
  let c[0..m, 0..n] be a new table
  <span class="kw">for</span> i = 0 <span class="kw">to</span> m   c[i, 0] = 0
  <span class="kw">for</span> j = 0 <span class="kw">to</span> n   c[0, j] = 0
  <span class="kw">for</span> i = 1 <span class="kw">to</span> m
      <span class="kw">for</span> j = 1 <span class="kw">to</span> n
          <span class="kw">if</span> X[i] == Y[j]
              c[i, j] = c[i-1, j-1] + 1
          <span class="kw">else</span>
              c[i, j] = max(c[i-1, j], c[i, j-1])
  <span class="kw">return</span> c[m, n]</code></pre></div>
 <h2>Elements of dynamic programming</h2>
 <div class="grid g3"><div class="card"><h3>Optimal substructure</h3><p>Show via cut-and-paste: if a sub-solution weren't optimal you could swap in a better one. Beware: <i>longest simple path</i> lacks it, <i>shortest path</i> has it.</p></div>
 <div class="card"><h3>Overlapping subproblems</h3><p>The space of distinct subproblems is small (polynomial) even though the recursion tree is exponential.</p></div>
 <div class="card"><h3>Optimal BST (14.5)</h3><p>Given search probabilities, minimize expected search cost. e[i,j] = min over roots r of e[i,r−1] + e[r+1,j] + w(i,j). Θ(n³).</p></div></div>`,
 eli5:{title:'Finding the longest shared pattern in two words',pts:['🔤 Take two words. What is the longest list of letters that appears in both, in the same order (you may skip letters)?','📊 Make a grid: one word across the top, one down the side.','✅ If the letters match, add 1 to the number diagonally up-left.','↔️ If they don\'t match, copy the bigger number from above or from the left.','🏁 The bottom-right box is the answer!']},
 diagram:()=>fig(D.svg(720,250,(()=>{const X='ABCB',Y='BDCAB';const c=[];for(let i=0;i<=4;i++){c[i]=[];for(let j=0;j<=5;j++)c[i][j]=(i&&j)?(X[i-1]===Y[j-1]?c[i-1][j-1]+1:Math.max(c[i-1][j],c[i][j-1])):0;}let s='';for(let j=0;j<5;j++)s+=D.text(250+(j+1)*50,30,Y[j],14,C.cy,'middle',700);for(let i=0;i<4;i++)s+=D.text(215,92+(i+1)*40-28,X[i],14,C.pink,'middle',700);for(let i=0;i<=4;i++)for(let j=0;j<=5;j++){const m=i&&j&&X[i-1]===Y[j-1];s+=`<rect x="${227+j*50}" y="${40+i*40}" width="46" height="36" rx="6" fill="${m?C.good+'44':C.dim+'22'}" stroke="${m?C.good:C.dim}"/>`+D.text(250+j*50,63+i*40,c[i][j],13,'#fff','middle',700);}
   return s+D.text(120,120,'match → ↖ + 1',12.5,C.good,'middle',700)+D.text(120,145,'else max(↑, ←)',12.5,C.mut)+D.text(600,240,'LCS length = '+c[4][5],13,C.warn,'end',700);})()),
  'The LCS table for X = ABCB and Y = BDCAB; green cells are character matches.','Green boxes are where the letters match. Numbers grow as we find more matching letters.'),
 mc:[
  ['The LCS-LENGTH algorithm on strings of length m and n runs in:','Θ(mn)',['Θ(m + n)','Θ(2^m)','Θ(mn lg n)'],'Each of the (m+1)(n+1) cells takes O(1).'],
  ['If x_i = y_j, then c[i, j] equals:','c[i−1, j−1] + 1',['max(c[i−1, j], c[i, j−1])','c[i−1, j] + 1','0'],'The matching character extends the LCS of the prefixes.'],
  ['The length of an LCS of "ABCBDAB" and "BDCABA" is:','4',['3','5','6'],'For example BCBA or BDAB.'],
  ['Which problem does NOT have optimal substructure?','Longest simple path in a general graph',['Shortest path','LCS','Rod cutting'],'Sub-paths of a longest simple path need not be longest.'],
  ['Printing the actual LCS from the arrow table takes:','O(m + n)',['O(mn)','O(m·n²)','O(1)'],'Each step moves up, left, or diagonally.'],
  ['A subsequence of a string:','Keeps the characters in order but may skip some',['Must be contiguous','Can reorder characters','Must start at the first character'],'"ACE" is a subsequence of "ABCDE".'],
  ['The optimal BST DP algorithm runs in:','Θ(n³)',['Θ(n²)','Θ(n lg n)','Θ(2ⁿ)'],'Θ(n²) subproblems × O(n) root choices.']
 ]}
);

// ======================= COURSE DATA · MIDTERM 2 =======================
COURSE.push(
{id:'t09', num:'#9', short:'Heaps & Priority Queues', title:'Heaps, Heapsort &amp;', grad:'Priority Queues', when:'Week 4 · Mon 09/14', icon:'⛰️', color:'#fb7185',
 blurb:'Max-heap property, MAX-HEAPIFY, BUILD-MAX-HEAP, heapsort, priority queues.',
 lead:'A binary <b>heap</b> is a nearly complete binary tree stored in an array. It gives an O(n lg n) in-place sort and an efficient <b>priority queue</b>.',
 reading:'CLRS Chapter 6', notes:'Topic 09',
 videos:[['0zh4IiKaVN0','09A · Heap Properties'],['oAfSx7aRkZM','09B · Building Heaps'],['gMwtzAPDupI','09C · Analyzing Heap Building'],['8O5iBigvDIw','09D · Applications of Heaps']],
 prereq:['ICS 211: Complex Sorting Algorithms'],
 html:`<h2>Heap structure</h2>
 <div class="grid g2"><div class="card"><h3>Array layout (1-indexed)</h3><ul class="clean"><li>PARENT(i) = ⌊i/2⌋, LEFT(i) = 2i, RIGHT(i) = 2i + 1</li><li><b>Max-heap property:</b> A[PARENT(i)] ≥ A[i], so the max is at the root A[1].</li><li>Height of an n-element heap is ⌊lg n⌋.</li><li>Leaves are at indices ⌊n/2⌋+1 … n.</li></ul></div>
 <pre><code><span class="fn">MAX-HEAPIFY</span>(A, i)        <span class="cm">// O(lg n)</span>
  l = LEFT(i); r = RIGHT(i)
  largest = i
  <span class="kw">if</span> l ≤ A.heap-size <span class="kw">and</span> A[l] &gt; A[largest]
      largest = l
  <span class="kw">if</span> r ≤ A.heap-size <span class="kw">and</span> A[r] &gt; A[largest]
      largest = r
  <span class="kw">if</span> largest ≠ i
      exchange A[i] with A[largest]
      <span class="fn">MAX-HEAPIFY</span>(A, largest)

<span class="fn">BUILD-MAX-HEAP</span>(A, n)      <span class="cm">// O(n)</span>
  A.heap-size = n
  <span class="kw">for</span> i = ⌊n/2⌋ <span class="kw">downto</span> 1
      <span class="fn">MAX-HEAPIFY</span>(A, i)</code></pre></div>
 <h2>Costs</h2>
 <table class="tbl"><tr><th>Operation</th><th>Time</th><th>Why</th></tr>
 <tr><td>MAX-HEAPIFY</td><td>O(lg n)</td><td>floats one value down one path</td></tr>
 <tr><td>BUILD-MAX-HEAP</td><td>O(n)</td><td>Σ (nodes at height h)·O(h) = O(n Σ h/2^h) = O(n)</td></tr>
 <tr><td>HEAPSORT</td><td>O(n lg n)</td><td>build, then n−1 times swap root to end and heapify</td></tr>
 <tr><td>MAXIMUM / EXTRACT-MAX</td><td>O(1) / O(lg n)</td><td>root; move last to root and heapify</td></tr>
 <tr><td>INCREASE-KEY / INSERT</td><td>O(lg n)</td><td>bubble up toward the root</td></tr></table>
 <div class="callout">Heapsort is <b>in place</b> but <b>not stable</b>. Priority queues power Prim, Dijkstra, event simulation and job scheduling.</div>`,
 eli5:{title:'A heap is a pyramid where bosses are bigger',pts:['🏔️ Picture a pyramid of people. Every boss is taller than the people right under them.','👑 So the tallest person is always at the very top. Finding them is instant!','⬇️ If someone short ends up on top, they swap with their taller helper and keep sinking until they fit (MAX-HEAPIFY).','📋 We can store the whole pyramid in a simple list: the kids of spot i live at 2i and 2i+1.','🎟️ A <b>priority queue</b> is like an ER waiting room: the most urgent patient goes first, not the first one who arrived.']},
 diagram:()=>fig(D.svg(720,240,(()=>{const v=[16,14,10,8,7,9,3,2,4,1];const pos=i=>{const d=Math.floor(Math.log2(i)),k=i-2**d,w=320/2**d;return [20+w*k+w/2,40+d*55];};let s='';for(let i=2;i<=10;i++){const [x,y]=pos(i),[px,py]=pos(i>>1);s+=D.line(x,y,px,py,C.dim);}for(let i=1;i<=10;i++){const [x,y]=pos(i);s+=D.node(x,y,v[i-1],i===1?C.warn:C.pink,17);s+=D.text(x+20,y-14,i,10,C.mut);}
   s+=D.text(530,40,'same heap as an array',12.5,C.txt,'middle',700);v.forEach((x,i)=>{s+=`<rect x="${370+i*32}" y="60" width="30" height="34" rx="6" fill="${(i===0?C.warn:C.pink)}22" stroke="${i===0?C.warn:C.pink}"/>`+D.text(385+i*32,82,x,12.5,'#fff','middle',700)+D.text(385+i*32,110,i+1,10.5,C.mut);});
   return s+D.text(530,150,'children of i: 2i and 2i + 1',13,C.cy,'middle',700)+D.text(530,175,'parent of i: ⌊i / 2⌋',13,C.cy,'middle',700)+D.text(530,205,'every parent ≥ its children',12.5,C.good);})()),
  'A max-heap drawn as a tree and stored as an array; index arithmetic replaces pointers.','The biggest number sits on top. Each parent is bigger than its kids. The list on the right is the same pyramid written in a row.'),
 mc:[
  ['In a 1-indexed heap array, the left child of index i is at:','2i',['2i + 1','⌊i/2⌋','i + 1'],'LEFT(i) = 2i, RIGHT(i) = 2i+1.'],
  ['The running time of BUILD-MAX-HEAP on n elements is:','O(n)',['O(n lg n)','O(lg n)','O(n²)'],'Most nodes are near the bottom, so the sum of heights is O(n).'],
  ['MAX-HEAPIFY on a node of height h takes:','O(h)',['O(1)','O(n)','O(h²)'],'It follows a single downward path.'],
  ['Why does BUILD-MAX-HEAP loop from ⌊n/2⌋ down to 1?','Nodes ⌊n/2⌋+1..n are leaves, already trivial heaps',['To visit nodes in sorted order','Because the root must be heapified first','To make heapsort stable'],'Heapify children before parents, skipping leaves.'],
  ['Heapsort is:','In place but not stable',['Stable and in place','Stable but not in place','Neither in place nor Θ(n lg n)'],'Swaps across the array break stability.'],
  ['EXTRACT-MAX on a max-heap of n elements costs:','O(lg n)',['O(1)','O(n)','O(n lg n)'],'Move the last element to the root, then MAX-HEAPIFY.'],
  ['Where can the smallest element of a max-heap be?','In any leaf',['At the root','At index 2','At index ⌊n/2⌋ always'],'It must have no children, so it is a leaf.'],
  ['The height of an n-element heap is:','⌊lg n⌋',['n/2','√n','⌈n/2⌉'],'A nearly complete binary tree.']
 ]},

{id:'t08', num:'#8', short:'Binary Search Trees', title:'Binary', grad:'Search Trees', when:'Week 4 · Wed 09/16', icon:'🌲', color:'#2dd4bf',
 blurb:'BST property, traversals, search, min/max, successor, insert, delete.',
 lead:'A <b>binary search tree</b> keeps keys ordered: everything in the left subtree is ≤ the node and everything in the right subtree is ≥ it. All dynamic-set operations take O(h) time, where h is the height.',
 reading:'CLRS Chapter 12', notes:'Topic 08',
 videos:[['bAxzRuu3Uy4','08A · Trees, Binary Trees, and basic facts'],['LDncFcNOr_I','08B · BST Queries'],['qJ7TyaKSf_0','08C · Modifying BST'],['vx0uWYHIRes','08D · Analyzing BST']],
 prereq:['ICS 241 Ch 11.2: Applications of Trees','ICS 241 Ch 11.3: Tree Traversal','ICS 211: Trees'],
 html:`<h2>Queries</h2>
 <div class="grid g2"><pre><code><span class="fn">TREE-SEARCH</span>(x, k)
  <span class="kw">while</span> x ≠ NIL <span class="kw">and</span> k ≠ x.key
      <span class="kw">if</span> k &lt; x.key  x = x.left
      <span class="kw">else</span> x = x.right
  <span class="kw">return</span> x

<span class="fn">INORDER-TREE-WALK</span>(x)      <span class="cm">// Θ(n), sorted order</span>
  <span class="kw">if</span> x ≠ NIL
      INORDER-TREE-WALK(x.left)
      print x.key
      INORDER-TREE-WALK(x.right)</code></pre>
 <div class="card"><h3>Other queries, all O(h)</h3><ul class="clean"><li><b>MINIMUM:</b> follow left pointers. <b>MAXIMUM:</b> follow right pointers.</li><li><b>SUCCESSOR(x):</b> if x has a right subtree, its minimum; otherwise go up until you come from a left child.</li><li>Preorder / postorder walks visit root before / after the subtrees.</li></ul></div></div>
 <h2>Modifying the tree</h2>
 <div class="grid g2"><div class="card"><h3>TREE-INSERT(T, z)</h3><p>Walk down from the root keeping a trailing pointer y, as if searching for z.key. Attach z as the left or right child of y (or as the root if the tree is empty). O(h).</p></div>
 <div class="card"><h3>TREE-DELETE(T, z)</h3><ul class="clean"><li>No left child: replace z by its right child (TRANSPLANT).</li><li>No right child: replace z by its left child.</li><li>Two children: find successor y = MINIMUM(z.right), splice y out, and put y in z's place.</li></ul></div></div>
 <div class="callout cyan">Height ranges from ⌊lg n⌋ (balanced) to n − 1 (a chain, e.g. inserting sorted keys). The expected height of a randomly built BST is O(lg n). Balanced trees (Topic 11) guarantee it.</div>`,
 eli5:{title:'A BST is a guessing game: higher or lower?',pts:['🔢 Think of the "guess my number" game. Each guess tells you to go higher or lower.','🌲 In a BST, smaller numbers go to the left, bigger numbers go to the right.','🔍 To find a number, start at the top and keep going left or right. You skip half the tree each time if it is bushy.','📏 Reading left-to-right (in-order) gives all numbers sorted!','⚠️ If you add numbers already in order, the tree becomes a long skinny line, and searching becomes slow.']},
 diagram:()=>fig(D.svg(720,230,(()=>{const N={15:[360,35],6:[230,95],18:[490,95],3:[160,155],7:[300,155],17:[440,155],20:[560,155],2:[120,210],4:[200,210],13:[340,210]};const E=[[15,6],[15,18],[6,3],[6,7],[18,17],[18,20],[3,2],[3,4],[7,13]];const path=['15-6','6-7','7-13'];return E.map(([a,b])=>D.line(...N[a],...N[b],path.includes(a+'-'+b)?C.warn:C.dim,path.includes(a+'-'+b)?4:2.5)).join('')+Object.entries(N).map(([k,[x,y]])=>D.node(x,y,k,[15,6,7,13].includes(+k)?C.warn:C.cy,17)).join('')+D.text(620,40,'search 13:',13,C.txt,'start',700)+D.text(620,62,'13 < 15 → left',12,C.mut,'start')+D.text(620,82,'13 > 6 → right',12,C.mut,'start')+D.text(620,102,'13 > 7 → right',12,C.mut,'start')+D.text(620,122,'found ✓',12.5,C.good,'start',700);})()),
  'TREE-SEARCH follows one root-to-leaf path, so it costs O(h).','To find 13: go left (smaller than 15), then right, then right. Found it in 4 steps!'),
 mc:[
  ['An inorder walk of a BST visits the keys in:','Sorted (non-decreasing) order',['Reverse sorted order','Level order','Random order'],'Left subtree, node, right subtree.'],
  ['TREE-SEARCH, MINIMUM, SUCCESSOR and INSERT all run in:','O(h) where h is the tree height',['O(1)','O(n lg n)','O(lg n) always'],'They follow a single path; h can be as large as n−1.'],
  ['Inserting 1, 2, 3, …, n into an empty BST produces a tree of height:','n − 1',['⌊lg n⌋','n/2','√n'],'Each new key becomes the right child of the previous: a chain.'],
  ['If node x has a right subtree, SUCCESSOR(x) is:','The minimum of x.right',['x.p','The maximum of x.left','The root'],'The smallest key larger than x lies in its right subtree.'],
  ['Deleting a node z with two children replaces z by:','Its successor (the minimum of z.right)',['Its left child','Its parent','Any leaf'],'The successor has no left child, so it is easy to splice out.'],
  ['The expected height of a randomly built BST on n distinct keys is:','O(lg n)',['O(n)','O(√n)','O(1)'],'CLRS 12.4.'],
  ['INORDER-TREE-WALK on n nodes takes:','Θ(n)',['Θ(lg n)','Θ(n lg n)','Θ(h)'],'Each node is visited exactly once.'],
  ['Where is the minimum key in a BST?','Follow left pointers from the root until NIL',['At the root','At the deepest leaf','Follow right pointers from the root'],'Everything smaller is always to the left.']
 ]},

{id:'t11', num:'#11', short:'2-3-4 & Red-Black Trees', title:'2-3-4 Trees &amp;', grad:'Red-Black Trees', when:'Week 5 · Mon 09/21', icon:'🔴', color:'#ef4444',
 blurb:'Balanced search trees: 2-3-4 nodes, splits, red-black properties, rotations.',
 lead:'Balanced search trees guarantee O(lg n) height. A <b>2-3-4 tree</b> keeps all leaves at the same depth, and a <b>red-black tree</b> is a binary encoding of a 2-3-4 tree.',
 reading:'Sedgewick Chapter 15: Balanced Trees (Google Drive Resources folder) &amp; CLRS Chapter 13', notes:'Topic 11', warn:'Allow extra time for this material!',
 videos:[['N-Sot-yf3As','11A · Balanced and 2-4 Trees'],['W49P7wqdIuE','11B · 2-4 Tree Mutation'],['a6LaiKa3ES0','11C · Red-Black Trees'],['HlwQ_n56MHQ','11D · RBT Mutation']],
 mit:[['O3hI9FdxFOM','MIT Lecture 10 (read Sedgewick first)']],
 prereq:[],
 html:`<h2>2-3-4 trees</h2>
 <div class="grid g2"><div class="card"><ul class="clean"><li>Nodes hold 1, 2 or 3 keys (2-, 3- or 4-nodes) with 2, 3 or 4 children.</li><li><b>All leaves have the same depth</b>, so height is Θ(lg n).</li><li><b>Insert:</b> on the way down, split every 4-node you meet: the middle key moves up to the parent. The tree only grows taller when the root splits.</li><li>Search, insert and delete are O(lg n).</li></ul></div>
 <div class="card"><h3>Red-black properties</h3><ol><li>Every node is red or black.</li><li>The root is black.</li><li>Every leaf (NIL) is black.</li><li>A red node has two black children (no red-red).</li><li>Every path from a node to its descendant leaves has the same number of black nodes (<b>black-height</b>).</li></ol><p>⇒ height ≤ 2 lg(n + 1).</p></div></div>
 <h2>Correspondence and fix-ups</h2>
 <table class="tbl"><tr><th>2-3-4 tree</th><th>Red-black tree</th></tr>
 <tr><td>2-node (1 key)</td><td>a black node</td></tr>
 <tr><td>3-node (2 keys)</td><td>black node with one red child</td></tr>
 <tr><td>4-node (3 keys)</td><td>black node with two red children</td></tr>
 <tr><td>splitting a 4-node</td><td>color flip: children → black, parent → red</td></tr></table>
 <div class="callout"><b>RB-INSERT:</b> insert as in a BST and color the new node red, then fix red-red violations with recoloring (uncle red) or one or two <b>rotations</b> (uncle black). Rotations are O(1) and keep the BST order. Insert does at most 2 rotations; delete at most 3.</div>`,
 eli5:{title:'Keeping the tree from getting lopsided',pts:['⚖️ A plain BST can get lopsided like a leaning tower. Balanced trees keep it even.','📦 In a <b>2-3-4 tree</b>, a box can hold up to 3 numbers. When a box gets too full, it splits and sends the middle number up.','📏 Every bottom box is at the same level, so the tree never gets too tall.','🔴⚫ A <b>red-black tree</b> is the same idea using red and black colors on a normal binary tree.','🔄 When colors break the rules, we recolor or <b>rotate</b> (twist) a few nodes to fix it.']},
 diagram:()=>fig(D.svg(720,220,
   D.text(170,24,'2-3-4 tree: a 4-node',13,C.txt,'middle',700)+`<rect x="95" y="45" width="150" height="40" rx="10" fill="${C.acc}22" stroke="${C.acc}" stroke-width="2"/>`+D.text(130,71,'10',14,'#fff','middle',700)+D.text(170,71,'20',14,'#fff','middle',700)+D.text(210,71,'30',14,'#fff','middle',700)+[0,1,2,3].map(i=>D.line(105+i*43,85,75+i*63,140,C.dim)+`<rect x="${55+i*63}" y="140" width="40" height="28" rx="7" fill="${C.dim}33" stroke="${C.dim}"/>`).join('')+
   D.arrow(300,100,370,100,'mut',3)+D.text(335,90,'same as',11.5,C.mut)+
   D.text(540,24,'red-black encoding',13,C.txt,'middle',700)+D.line(540,60,470,130,C.dim)+D.line(540,60,610,130,C.dim)+D.node(540,60,'20','#9ca3af',20,'#111827')+D.node(470,130,'10',C.bad,20)+D.node(610,130,'30',C.bad,20)+D.text(540,200,'black parent + two red children = one 4-node',12,C.txt)),
  'A 4-node {10, 20, 30} corresponds to a black node with two red children; splitting = color flip.','One box with three numbers is the same as one black dot holding hands with two red dots.'),
 mc:[
  ['In a 2-3-4 tree, all leaves:','Have the same depth',['Are red','Hold exactly 3 keys','Are at most 2 levels apart'],'Perfect balance is what bounds the height.'],
  ['The height of a red-black tree with n internal nodes is at most:','2 lg(n + 1)',['lg n','n/2','√n'],'Black-height argument (CLRS Lemma 13.1).'],
  ['Which is NOT a red-black property?','Every red node has a red parent',['The root is black','Every NIL leaf is black','All root-to-leaf paths have the same number of black nodes'],'Actually a red node must have black children: no two reds in a row.'],
  ['A 3-node in a 2-3-4 tree corresponds in a red-black tree to:','A black node with one red child',['A red node with two black children','Two black nodes','A black node with two red children'],'4-node = black with two red children.'],
  ['A newly inserted node in RB-INSERT is colored:','Red',['Black','The color of its parent','Red only if it is a left child'],'Red keeps black-heights equal; only red-red may need fixing.'],
  ['A rotation in a BST:','Takes O(1) time and preserves the BST property',['Takes O(lg n) time','Can break the inorder ordering','Changes the set of keys'],'It only relinks a constant number of pointers.'],
  ['When does a 2-3-4 tree grow in height?','Only when the root splits',['On every insertion','When a leaf becomes a 3-node','When a key is deleted'],'Height grows at the top, keeping leaves level.']
 ]},

{id:'t05a', num:'#5A', short:'Probabilistic Analysis', title:'Probabilistic', grad:'Analysis', when:'Week 5 · Wed 09/23', icon:'🎲', color:'#c084fc',
 blurb:'Hiring problem, indicator random variables, expected value, linearity.',
 lead:'<b>Probabilistic analysis</b> averages the running time over a distribution of inputs. <b>Indicator random variables</b> plus <b>linearity of expectation</b> turn hard counting problems into easy sums.',
 reading:'CLRS Chapter 5.1–5.3', notes:'Topic 05A',
 videos:[['MgnvWTZgqcA','05A · Indicator Random Variables'],['k-jusEhrRik','05B · Example: Expected Inversions']],
 prereq:['ICS 141 Ch 6.1: The Basics of Counting','ICS 141 Ch 6.2: The Pigeonhole Principle','ICS 141 Ch 6.3: Permutations and Combinations','ICS 141 Ch 6.5: Generalized Permutations and Combinations','ICS 141 Ch 7.1: Introduction to Discrete Probability','ICS 141 Ch 7.2: Probability Theory','ICS 141 Ch 7.4: Expected Value and Variance'],
 html:`<h2>The hiring problem</h2>
 <div class="grid g2"><pre><code><span class="fn">HIRE-ASSISTANT</span>(n)
  best = 0     <span class="cm">// dummy candidate</span>
  <span class="kw">for</span> i = 1 <span class="kw">to</span> n
      interview candidate i
      <span class="kw">if</span> candidate i is better than best
          best = i
          hire candidate i</code></pre>
 <div class="card"><h3>Expected number of hires</h3><p>Let X_i = I{candidate i is hired}. In random order, candidate i is the best of the first i with probability 1/i, so E[X_i] = 1/i.</p><p class="math">E[X] = Σ E[X_i] = Σ 1/i = H_n = ln n + O(1)</p><p>Worst case: n hires (candidates arrive in increasing quality).</p></div></div>
 <h2>Tools</h2>
 <div class="grid g3"><div class="card"><h3>Indicator variable</h3><p>I{A} = 1 if event A occurs, else 0. Key lemma: <b>E[I{A}] = Pr{A}</b>.</p></div>
 <div class="card"><h3>Linearity of expectation</h3><p>E[X + Y] = E[X] + E[Y] for <i>any</i> random variables, even dependent ones.</p></div>
 <div class="card"><h3>Randomize the input</h3><p>Shuffle first (RANDOMIZE-IN-PLACE swaps A[i] with A[RANDOM(i, n)]), so no specific input is always bad: expected cost holds for every input.</p></div></div>
 <div class="callout cyan"><b>Expected inversions</b> in a random permutation: there are C(n,2) pairs and each pair is inverted with probability 1/2, so E = n(n−1)/4.</div>`,
 eli5:{title:'Using "on average" thinking',pts:['🎲 Sometimes we can\'t know exactly what will happen, but we can guess what happens <b>on average</b>.','👔 Hiring game: you interview people in random order and hire anyone better than everyone before.','🤔 How many hires? The 1st person is always the best so far, the 2nd has a 1-in-2 chance, the 3rd a 1-in-3 chance…','➕ Add them up: 1 + 1/2 + 1/3 + … ≈ ln n. With 100 people, you only hire about 5!','💡 An <b>indicator</b> is a light switch: 1 if something happened, 0 if not. Averages of switches are easy to add up.']},
 diagram:()=>fig(D.svg(720,190,(()=>{const q=[3,1,5,2,7,4,6,9,8];let best=0;return q.map((v,i)=>{const hire=v>best;if(hire)best=v;const h=v*13;return `<rect x="${60+i*68}" y="${150-h}" width="44" height="${h}" rx="6" fill="${hire?C.good:C.dim}" opacity="${hire?.9:.5}"/>`+D.text(82+i*68,143-h,v,12,'#fff','middle',700)+(hire?D.text(82+i*68,172,'hire',11.5,C.good,'middle',700):D.text(82+i*68,172,'skip',11,C.mut));}).join('')+D.text(360,20,'candidate quality in arrival order: green = new best (hired)',12.5,C.txt);})()),
  'Only candidates better than everyone before them are hired: expected H_n ≈ ln n hires.','Green bars are new champions, so they get hired. Most people are skipped.'),
 mc:[
  ['For an indicator random variable X_A = I{A}, E[X_A] equals:','Pr{A}',['1','1 − Pr{A}','Pr{A}²'],'E[I{A}] = 1·Pr{A} + 0·Pr{not A}.'],
  ['Expected number of hires in the hiring problem with a random order of n candidates:','H_n = Θ(ln n)',['n/2','1','√n'],'Σ 1/i.'],
  ['Linearity of expectation requires the random variables to be:','Nothing: it holds even for dependent variables',['Independent','Identically distributed','Indicator variables only'],'That is what makes it so powerful.'],
  ['Expected number of inversions in a uniformly random permutation of n distinct elements:','n(n − 1)/4',['n(n − 1)/2','n/2','n lg n'],'C(n,2) pairs each inverted with probability 1/2.'],
  ['Candidate i (in random order) is hired with probability:','1/i',['1/n','i/n','1/2'],'They must be the best of the first i.'],
  ['Why randomize the input order (e.g. RANDOMIZE-IN-PLACE)?','So no particular input reliably triggers the worst case',['To make the algorithm deterministic','To reduce space usage','To guarantee the best case'],'The expectation then holds for every input.'],
  ['Worst-case number of hires in the hiring problem:','n',['1','ln n','n/2'],'If candidates arrive in increasing order of quality, everyone is hired.']
 ]},

{id:'t05b', num:'#5B', short:'Randomized Quicksort', title:'Randomized Algorithms &amp;', grad:'Quicksort', when:'Week 6 · Mon 09/28', icon:'⚡', color:'#facc15',
 blurb:'PARTITION, worst/best cases, randomized pivot, expected O(n lg n).',
 lead:'Quicksort partitions around a pivot and recurses on both sides. It sorts in place, is very fast in practice, and with a <b>random pivot</b> runs in expected O(n lg n) on every input.',
 reading:'CLRS Chapter 7 (all)', notes:'Topic 05B',
 videos:[['v1ghdc_hwMI','10A · Quicksort'],['qS9oMz4_kTU','10B · Quicksort Random Analysis']],
 prereq:[],
 html:`<h2>Algorithm</h2>
 <div class="grid g2"><pre><code><span class="fn">QUICKSORT</span>(A, p, r)
  <span class="kw">if</span> p &lt; r
      q = <span class="fn">PARTITION</span>(A, p, r)
      <span class="fn">QUICKSORT</span>(A, p, q - 1)
      <span class="fn">QUICKSORT</span>(A, q + 1, r)

<span class="fn">PARTITION</span>(A, p, r)          <span class="cm">// Lomuto, Θ(n)</span>
  x = A[r]                       <span class="cm">// pivot</span>
  i = p - 1
  <span class="kw">for</span> j = p <span class="kw">to</span> r - 1
      <span class="kw">if</span> A[j] ≤ x
          i = i + 1
          exchange A[i] with A[j]
  exchange A[i + 1] with A[r]
  <span class="kw">return</span> i + 1

<span class="fn">RANDOMIZED-PARTITION</span>(A, p, r)
  i = RANDOM(p, r)
  exchange A[r] with A[i]
  <span class="kw">return</span> <span class="fn">PARTITION</span>(A, p, r)</code></pre>
 <div class="card"><h3>Running time</h3><table class="tbl"><tr><th>Case</th><th>Split</th><th>Time</th></tr><tr><td>Worst</td><td>0 : n−1 (e.g. sorted input, last-element pivot)</td><td>Θ(n²)</td></tr><tr><td>Best</td><td>n/2 : n/2</td><td>Θ(n lg n)</td></tr><tr><td>Any constant split (9:1)</td><td>still O(lg n) depth</td><td>O(n lg n)</td></tr><tr><td>Randomized (expected)</td><td>random pivot</td><td>O(n lg n)</td></tr></table>
 <h3>Expected-time idea</h3><p>Count comparisons. z_i and z_j (the i-th and j-th smallest) are compared only if one of them is the first pivot chosen from {z_i..z_j}: probability 2/(j−i+1). Summing gives E[X] = O(n lg n).</p></div></div>
 <div class="callout">Quicksort is <b>in place</b> and <b>not stable</b>. Its loop invariant: A[p..i] ≤ x, A[i+1..j−1] &gt; x, A[r] = x.</div>`,
 eli5:{title:'Pick a leader, split into two teams',pts:['🙋 Pick one kid as the "pivot". Everyone shorter goes left, everyone taller goes right.','🔁 Now do the same thing inside each team, again and again, until every team has one kid.','✅ Now everyone is lined up from shortest to tallest!','😬 If you always pick the shortest kid as pivot, one team is empty every time. That is slow.','🎲 Picking the pivot <b>randomly</b> makes the bad case super unlikely, so it is fast on average.']},
 diagram:()=>fig(D.svg(720,190,(()=>{const a=[2,1,3,8,7,5,6,4];const col=i=>i<=2?C.good:i<=6?C.bad:i===7?C.warn:C.dim;return a.map((v,i)=>`<rect x="${70+i*72}" y="60" width="62" height="54" rx="10" fill="${col(i)}33" stroke="${col(i)}" stroke-width="2"/>`+D.text(101+i*72,94,v,19,'#fff','middle',700)).join('')+D.text(170,48,'≤ pivot (A[p..i])',12.5,C.good)+D.text(422,48,'> pivot (A[i+1..j−1])',12.5,C.bad)+D.text(605,48,'pivot x',12.5,C.warn)+D.text(360,150,'after the loop, swap the pivot into position i + 1, between the two regions',12.5,C.txt)+D.text(360,175,'then recurse on each side',12,C.mut);})()),
  'PARTITION maintains a ≤-pivot region and a >-pivot region, then drops the pivot between them.','Green numbers are smaller than the yellow leader, red ones are bigger. The leader goes in the middle.'),
 mc:[
  ['Worst-case running time of (deterministic) quicksort:','Θ(n²)',['Θ(n lg n)','Θ(n)','Θ(n³)'],'Happens with maximally unbalanced partitions.'],
  ['Expected running time of randomized quicksort on any input:','O(n lg n)',['O(n²)','O(n)','O(lg n)'],'Random pivots make bad splits unlikely.'],
  ['PARTITION on a subarray of n elements takes:','Θ(n)',['Θ(lg n)','Θ(n lg n)','Θ(1)'],'One pass over the subarray.'],
  ['With last-element pivot, which input gives deterministic quicksort its worst case?','An already sorted array',['A random array','An array with all distinct keys in random order','An array of size 2'],'Every split is 0 : n−1.'],
  ['A split that is always 9-to-1 gives running time:','O(n lg n)',['Θ(n²)','Θ(n)','O(n^1.5)'],'Depth is log_{10/9} n = O(lg n), with O(n) per level.'],
  ['In randomized quicksort, z_i and z_j are compared with probability:','2/(j − i + 1)',['1/n','1/2','1/(j − i)'],'One of them must be the first pivot among z_i..z_j.'],
  ['Quicksort is:','In place but not stable',['Stable and in place','Stable but not in place','Not in place and not stable'],'Swaps move equal keys past each other.']
 ]},

{id:'t06', num:'#6', short:'Hash Tables', title:'Hash', grad:'Tables', when:'Week 6 · Wed 09/30', icon:'#️⃣', color:'#38bdf8',
 blurb:'Direct addressing, chaining, load factor, hash functions, open addressing.',
 lead:'A <b>hash table</b> maps keys to slots with a hash function h, giving O(1) average-time INSERT, SEARCH and DELETE for dictionaries.',
 reading:'CLRS Sections 11.1–11.4', notes:'Topic 06',
 videos:[['NMm1BKomO_Y','06A · Hash Tables: Chaining'],['ei7T9Y97u0M','06B · Analysis of Chaining'],['jW4wCfz3DwE','06C · Hash Functions'],['SGGP_HJNUts','06D · Open Addressing']],
 mit:[['JZHBa-rLrBA','MIT Lecture 07'],['s7QSM_hlS1U','MIT Lecture 08 (through 11:02)',0,662]],
 prereq:['ICS 211: Hash Tables'],
 html:`<h2>Chaining</h2>
 <div class="grid g2"><div class="card"><ul class="clean"><li>Slot j holds a linked list of all keys with h(k) = j.</li><li>INSERT at the head: O(1). DELETE with a doubly linked list given the node: O(1).</li><li><b>Load factor</b> α = n/m (keys per slot).</li><li>Under <b>simple uniform hashing</b>, a search (hit or miss) takes Θ(1 + α) expected time. If m = Θ(n), that is O(1).</li></ul></div>
 <div class="card"><h3>Hash functions</h3><ul class="clean"><li><b>Division:</b> h(k) = k mod m. Pick m prime, not near a power of 2.</li><li><b>Multiplication:</b> h(k) = ⌊m (kA mod 1)⌋, 0 &lt; A &lt; 1 (Knuth: A ≈ 0.618).</li><li><b>Universal hashing:</b> pick h at random from a family so that Pr[collision] ≤ 1/m for any two keys. Defeats adversarial inputs.</li></ul></div></div>
 <h2>Open addressing</h2>
 <table class="tbl"><tr><th>Probe sequence</th><th>h(k, i)</th><th>Issue</th></tr>
 <tr><td>Linear probing</td><td>(h′(k) + i) mod m</td><td>primary clustering</td></tr>
 <tr><td>Quadratic probing</td><td>(h′(k) + c₁i + c₂i²) mod m</td><td>secondary clustering</td></tr>
 <tr><td>Double hashing</td><td>(h₁(k) + i·h₂(k)) mod m</td><td>best of the three; h₂(k) must be coprime to m</td></tr></table>
 <div class="callout">All keys live in the table itself, so α ≤ 1. Expected probes for an unsuccessful search are at most <b>1/(1 − α)</b> (uniform hashing). Deletion needs a special DELETED marker.</div>`,
 eli5:{title:'A hash table is a wall of mailboxes',pts:['📬 Imagine a wall of numbered mailboxes. A magic rule (the <b>hash function</b>) tells you which box each name goes into.','⚡ To find someone\'s mail, use the rule and go straight to that box. No searching!','💥 Sometimes two names go to the same box. That is a <b>collision</b>.','🔗 <b>Chaining:</b> that box just holds a little list of letters.','🚶 <b>Open addressing:</b> if the box is full, try the next box, and the next, until one is empty.']},
 diagram:()=>fig(D.svg(720,230,(()=>{const T={0:[],1:[22,8],2:[],3:[17],4:[11,4,25],5:[],6:[13]};let s=D.text(80,22,'h(k) = k mod 7',13,C.cy,'start',700);Object.entries(T).forEach(([j,l])=>{const y=40+j*26;s+=`<rect x="80" y="${y}" width="44" height="22" rx="5" fill="${C.cy}22" stroke="${C.cy}"/>`+D.text(102,y+16,j,12,'#fff','middle',700);let x=150;l.forEach(k=>{s+=D.arrow(x-22,y+11,x-3,y+11,'mut',1.8)+`<rect x="${x}" y="${y}" width="40" height="22" rx="11" fill="${C.acc}33" stroke="${C.acc}"/>`+D.text(x+20,y+16,k,12,'#fff','middle',700);x+=64;});if(!l.length)s+=D.text(150,y+16,'NIL',11,C.dim,'start');});
   return s+D.text(520,70,'chaining',14,C.txt,'middle',700)+D.text(520,98,'α = n / m = 7 / 7 = 1',13,C.mut)+D.text(520,126,'expected search: Θ(1 + α)',13,C.good,'middle',700)+D.text(520,160,'colliding keys share a list',12,C.mut);})()),
  'Chaining: each slot points to a list of keys that hash there; expected search time Θ(1 + α).','Each mailbox (number) holds a little chain of letters that landed in that same box.'),
 mc:[
  ['With chaining and simple uniform hashing, expected search time is:','Θ(1 + α)',['Θ(α²)','Θ(lg n)','Θ(n)'],'Compute h(k), then scan a list of expected length α.'],
  ['The load factor α of a hash table with n keys and m slots is:','n/m',['m/n','n·m','n − m'],'Average number of keys per slot.'],
  ['In open addressing, the load factor satisfies:','α ≤ 1',['α can exceed 1','α = 0 always','α ≥ 1'],'Every key occupies its own slot.'],
  ['Primary clustering is a problem of:','Linear probing',['Double hashing','Chaining','Universal hashing'],'Long runs of occupied slots grow.'],
  ['For the division method h(k) = k mod m, a good choice of m is:','A prime not too close to a power of 2',['A power of 2','A power of 10','Any even number'],'Powers of 2 just keep the low-order bits.'],
  ['Expected probes in an unsuccessful search with open addressing (uniform hashing) are at most:','1/(1 − α)',['1 + α','lg(1/α)','α/2'],'CLRS Theorem 11.6.'],
  ['Universal hashing guarantees that for any two distinct keys:','Pr[h(k) = h(l)] ≤ 1/m over the random choice of h',['They never collide','h is a bijection','The table never needs resizing'],'Randomizing the function defeats adversarial inputs.'],
  ['Worst-case search time in a hash table with chaining:','Θ(n)',['Θ(1)','Θ(lg n)','Θ(α)'],'All keys might hash to one slot.']
 ]}
);

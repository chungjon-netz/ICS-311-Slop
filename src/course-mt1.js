// ======================= COURSE DATA · MIDTERM 1 =======================
const COURSE = [];
COURSE.push(
{id:'t01', num:'#1 & #4', short:'Intro & Basic Data Structures', title:'Course Intro &amp;', grad:'Basic Data Structures', when:'Week 1 · Mon 08/24', icon:'📦', color:'#60a5fa',
 blurb:'What an algorithm is, plus stacks, queues, linked lists, trees and dynamic sets.',
 lead:'An <b>algorithm</b> is a well-defined procedure that turns input into output. We analyze algorithms for <b>correctness</b> and <b>efficiency</b>, and we build them on top of basic data structures: stacks, queues, linked lists and rooted trees.',
 reading:'CLRS Chapters 1 &amp; 10', notes:'Topic 01, Topic 04',
 videos:[['86QY8mBX7Ks','04A · Stacks, Queues, Lists'],['eECZ_lKXsHs','04B · Trees and Dynamic Sets']],
 extra:[['Appendix I of Jeff Erickson\'s textbook (PDF)','http://jeffe.cs.illinois.edu/teaching/algorithms/notes/98-induction.pdf']],
 prereq:['ICS 141 Ch 1.7: Introduction to Proofs','ICS 141 Ch 1.8: Proof Methods and Strategy','ICS 141 Ch 2.4: Sequences and Summations','ICS 141 Appendix 2: Exponential and Logarithmic Functions','ICS 141 Ch 3.1: Algorithms','ICS 141 Ch 5.1 &amp; 5.2: Mathematical Induction','ICS 241 Ch 11.1: Introduction to Trees','ICS 211: Stacks','ICS 211: Queues','ICS 211: Lists','ICS 211: Trees'],
 html:`<h2>Algorithms and problems</h2>
 <div class="grid g2"><div class="card"><h3>What is an algorithm?</h3><ul class="clean"><li>A finite sequence of unambiguous steps that solves a <b>computational problem</b> (input → required output).</li><li>An <b>instance</b> is one particular input. An algorithm is <b>correct</b> if it halts with the right output on <i>every</i> instance.</li><li>We compare algorithms by how their running time grows with input size <span class="math">n</span>, independent of hardware.</li></ul></div>
 <div class="card"><h3>Abstract Data Types (ADTs)</h3><ul class="clean"><li>An ADT says <b>what</b> operations do (e.g. PUSH, POP), not <b>how</b>.</li><li>A <b>data structure</b> is a concrete implementation (array, linked list…) with specific costs.</li><li><b>Dynamic sets</b> support SEARCH, INSERT, DELETE, MINIMUM, MAXIMUM, SUCCESSOR, PREDECESSOR.</li></ul></div></div>
 <h2>Stacks, queues and linked lists</h2>
 <table class="tbl"><tr><th>Structure</th><th>Policy</th><th>Key operations</th><th>Cost</th></tr>
 <tr><td>Stack</td><td>LIFO (last in, first out)</td><td>PUSH, POP, STACK-EMPTY</td><td>O(1)</td></tr>
 <tr><td>Queue</td><td>FIFO (first in, first out)</td><td>ENQUEUE, DEQUEUE (head/tail indices wrap around)</td><td>O(1)</td></tr>
 <tr><td>Doubly linked list</td><td>prev / next pointers</td><td>LIST-INSERT O(1), LIST-DELETE O(1) given node, LIST-SEARCH O(n)</td><td>varies</td></tr>
 <tr><td>Sentinel list</td><td>dummy node L.nil</td><td>removes boundary special cases</td><td>same</td></tr></table>
 <pre><code><span class="fn">PUSH</span>(S, x)              <span class="fn">ENQUEUE</span>(Q, x)
  S.top = S.top + 1        Q[Q.tail] = x
  S[S.top] = x             <span class="kw">if</span> Q.tail == Q.length
                               Q.tail = 1
<span class="fn">POP</span>(S)                    <span class="kw">else</span> Q.tail = Q.tail + 1
  <span class="kw">if</span> STACK-EMPTY(S) <span class="kw">error</span> "underflow"
  S.top = S.top - 1
  <span class="kw">return</span> S[S.top + 1]</code></pre>
 <h2>Rooted trees</h2>
 <div class="card"><ul class="clean"><li>Binary tree nodes store <code>p</code>, <code>left</code>, <code>right</code>.</li><li>Unbounded branching can use the <b>left-child, right-sibling</b> representation: O(n) space for any rooted tree.</li><li><b>Depth</b> = edges from the root; <b>height</b> = longest downward path to a leaf.</li></ul></div>`,
 eli5:{title:'Data structures are containers with rules', pts:['🍽️ A <b>stack</b> is a pile of plates: you add and remove from the top.','🎢 A <b>queue</b> is a line at a ride: first person in line goes first.','🔗 A <b>linked list</b> is a chain of paper clips: each one holds on to the next.','🌳 A <b>tree</b> is like a family tree: one person at the top, children below.','🧾 An <b>algorithm</b> is a recipe: clear steps that always give the right answer.']},
 diagram:()=>fig(D.svg(720,200,
   D.text(110,24,'Stack (LIFO)',13,C.txt,'middle',700)+[0,1,2,3].map(i=>`<rect x="70" y="${150-i*30}" width="80" height="26" rx="6" fill="${C.acc}${i==3?'66':'22'}" stroke="${C.acc}"/>`+D.text(110,168-i*30,['a','b','c','d'][i],13,'#fff')).join('')+D.arrow(175,75,155,75,'acc')+D.text(205,79,'top',12,C.acc)+
   D.text(380,24,'Queue (FIFO)',13,C.txt,'middle',700)+[0,1,2,3].map(i=>`<rect x="${280+i*50}" y="90" width="44" height="34" rx="6" fill="${C.cy}22" stroke="${C.cy}"/>`+D.text(302+i*50,112,['a','b','c','d'][i],13,'#fff')).join('')+D.text(302,150,'head ↑ out',11.5,C.cy)+D.text(452,150,'in ↑ tail',11.5,C.cy)+
   D.text(620,24,'Linked list',13,C.txt,'middle',700)+[0,1,2].map(i=>D.node(550+i*65,105,['3','8','5'][i],C.good,18)+(i<2?D.arrow(570+i*65,105,593+i*65,105,'good'):'')).join('')+D.text(620,150,'head → … → NIL',11.5,C.good)),
   'Stacks remove the newest item, queues remove the oldest, and linked lists chain nodes with pointers.','Plates (stack), a lunch line (queue), and a paper-clip chain (linked list).'),
 mc:[
  ['Which data structure follows a LIFO policy?','Stack',['Queue','Priority queue','Hash table'],'Last in, first out: POP removes the most recently pushed item.'],
  ['What is the worst-case time of LIST-SEARCH on an unsorted linked list of n elements?','Θ(n)',['Θ(1)','Θ(lg n)','Θ(n lg n)'],'You may have to walk every node.'],
  ['Given a pointer to node x in a doubly linked list, LIST-DELETE runs in:','O(1)',['O(lg n)','O(n)','O(n²)'],'Just relink x.prev.next and x.next.prev.'],
  ['Why use a sentinel L.nil in a linked list?','To eliminate boundary-condition special cases',['To make search O(1)','To save memory','To keep the list sorted'],'The dummy node makes head/tail cases look like interior cases.'],
  ['The left-child, right-sibling representation of a rooted tree with n nodes uses:','O(n) space',['O(n²) space','O(lg n) space','O(n lg n) space'],'Each node stores just two child-related pointers regardless of degree.'],
  ['An algorithm is correct if:','It halts with the correct output on every input instance',['It works on the sample inputs','It runs in polynomial time','It never uses recursion'],'Correctness must hold for all instances.'],
  ['A queue implemented in an array of length n with head/tail wrap-around supports ENQUEUE in:','O(1)',['O(n)','O(lg n)','Amortized O(n)'],'Write at Q.tail and advance it modulo the array length.']
 ]},

{id:'t03', num:'#3', short:'Growth of Functions', title:'Growth of Functions &amp;', grad:'Asymptotic Notation', when:'Week 1 · Wed 08/26', icon:'📈', color:'#a3e635',
 blurb:'O, Ω, Θ, o, ω and how to compare running times.',
 lead:'Asymptotic notation describes how running time grows for large <span class="math">n</span>, ignoring constant factors and lower-order terms.',
 reading:'CLRS Chapter 3', notes:'Topic 03',
 videos:[['y86z2OrIYQQ','03A · Asymptotic Notations'],['4IL2Ir_O_vI','03B · Omega and Theta'],['uaqLI449XQw','03C · little-o, little-omega, properties'],['f2czg61AtQw','03D · Functions and Identities for Analysis']],
 mit:[['whjt_N9uYFI','MIT Lecture 02 (beginning–16:50)',0,1010]],
 prereq:['ICS 141 Ch 3.2: Growth of Functions'],
 html:`<h2>The five notations</h2>
 <table class="tbl"><tr><th>Notation</th><th>Meaning</th><th>Definition (∃ c, n₀ &gt; 0, ∀ n ≥ n₀)</th><th>Analogy</th></tr>
 <tr><td>f = O(g)</td><td>upper bound</td><td>0 ≤ f(n) ≤ c·g(n)</td><td>≤</td></tr>
 <tr><td>f = Ω(g)</td><td>lower bound</td><td>0 ≤ c·g(n) ≤ f(n)</td><td>≥</td></tr>
 <tr><td>f = Θ(g)</td><td>tight bound</td><td>c₁g(n) ≤ f(n) ≤ c₂g(n)</td><td>=</td></tr>
 <tr><td>f = o(g)</td><td>strictly smaller</td><td>for <i>every</i> c &gt; 0: f(n) &lt; c·g(n)</td><td>&lt;</td></tr>
 <tr><td>f = ω(g)</td><td>strictly larger</td><td>for <i>every</i> c &gt; 0: f(n) &gt; c·g(n)</td><td>&gt;</td></tr></table>
 <div class="callout"><b>Limit test:</b> if lim f(n)/g(n) = 0 then f = o(g); if it is a positive constant then f = Θ(g); if ∞ then f = ω(g).</div>
 <h2>Common growth rates</h2>
 <p class="lead" style="font-size:1rem">1 &lt; lg lg n &lt; lg n &lt; √n &lt; n &lt; n lg n &lt; n² &lt; n³ &lt; 2ⁿ &lt; n! &lt; nⁿ</p>
 <div class="grid g2"><div class="card"><h3>Useful facts</h3><ul class="clean"><li>Θ(g) = O(g) ∩ Ω(g).</li><li>Any polynomial of degree d is Θ(n^d).</li><li>log bases differ by a constant: log_a n = Θ(log_b n).</li><li>Any positive polynomial grows slower than any exponential: n^k = o(aⁿ) for a &gt; 1.</li><li>Any polylog grows slower than any polynomial: lg^k n = o(n^ε).</li><li>lg(n!) = Θ(n lg n) (Stirling).</li></ul></div>
 <div class="card"><h3>Properties</h3><ul class="clean"><li><b>Transitivity:</b> f = O(g), g = O(h) ⇒ f = O(h) (same for Ω, Θ, o, ω).</li><li><b>Reflexivity:</b> f = Θ(f).</li><li><b>Symmetry:</b> f = Θ(g) ⇔ g = Θ(f).</li><li><b>Transpose symmetry:</b> f = O(g) ⇔ g = Ω(f).</li><li>Not every pair is comparable (e.g. n and n^(1+sin n)).</li></ul></div></div>`,
 eli5:{title:'Big-O is about who wins a race in the long run',pts:['🏃 Imagine two runners. One starts faster, but the other speeds up more and more. Who wins a really long race?','📏 <b>Big-O</b> means "at most about this fast-growing" (like ≤).','🧱 <b>Big-Omega</b> means "at least this much" (like ≥).','🎯 <b>Big-Theta</b> means "exactly this kind of growth" (like =).','🐢🚀 Order from slow-growing to super fast-growing: log n, n, n log n, n², 2ⁿ.']},
 diagram:()=>fig(D.svg(720,260,(()=>{const X=x=>60+x*6.2,Y=y=>225-y*1.9;const f=(fn)=>{let p='';for(let x=1;x<=100;x+=1){const y=Math.min(105,fn(x));p+=(p?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1);if(fn(x)>105)break;}return p;};
   const L=[['lg n',x=>Math.log2(x)*4,C.good],['n',x=>x,C.cy],['n lg n',x=>x*Math.log2(x)/4,C.acc],['n²',x=>x*x/40,C.warn],['2ⁿ',x=>Math.pow(2,x/6),C.bad]];
   return D.line(60,225,690,225,C.dim,1.5)+D.line(60,225,60,20,C.dim,1.5)+D.text(690,245,'input size n →',12,C.mut,'end')+D.text(70,20,'time',12,C.mut,'start')+L.map(([l,fn,c],i)=>`<path d="${f(fn)}" fill="none" stroke="${c}" stroke-width="3"/>`+D.text(600,40+i*20,l,13,c,'start',700)).join('');})()),
   'For large n the ordering lg n &lt; n &lt; n lg n &lt; n² &lt; 2ⁿ always wins out, no matter the constants.','The red line (2ⁿ) shoots up like a rocket. The green line (log n) barely moves. We want slow-growing lines!'),
 mc:[
  ['If f(n) = 3n² + 10n + 7, then f(n) is:','Θ(n²)',['Θ(n)','Θ(n³)','Θ(n² lg n)'],'Drop lower-order terms and constants.'],
  ['Which statement is true?','n lg n = o(n²)',['n² = O(n lg n)','2ⁿ = O(n¹⁰⁰)','lg n = ω(n)'],'lim (n lg n)/n² = lim lg n / n = 0.'],
  ['f(n) = Θ(g(n)) if and only if:','f = O(g) and f = Ω(g)',['f = O(g) only','f = o(g) and f = ω(g)','f(n) = g(n) for all n'],'Θ is the intersection of O and Ω.'],
  ['log₂ n and log₁₀ n are related by:','They are Θ of each other (differ by a constant factor)',['log₂ n = o(log₁₀ n)','log₂ n = ω(log₁₀ n)','They are incomparable'],'log_a n = log_b n / log_b a.'],
  ['lg(n!) is:','Θ(n lg n)',['Θ(n)','Θ(n²)','Θ(lg n)'],'Stirling’s approximation.'],
  ['Which grows fastest?','n!',['2ⁿ','n³','n lg n'],'n! eventually dominates any cⁿ with constant c.'],
  ['If lim f(n)/g(n) = 5 as n → ∞, then:','f = Θ(g)',['f = o(g)','f = ω(g)','No conclusion'],'A positive finite limit means the same growth rate.'],
  ['f = O(g) is equivalent to:','g = Ω(f)',['g = O(f)','f = Ω(g)','g = o(f)'],'Transpose symmetry.']
 ]},

{id:'t02', num:'#2', short:'Correctness & Analysis', title:'Proving Correctness &amp;', grad:'Analyzing Algorithms', when:'Week 2 · Mon 08/31', icon:'✅', color:'#4ade80',
 blurb:'Loop invariants, insertion sort, best/worst-case analysis.',
 lead:'A <b>loop invariant</b> proves an iterative algorithm correct, and counting the cost of each line gives its running time. Insertion sort is the running example.',
 reading:'CLRS Chapters 2.1–2.2', notes:'Topic 02',
 videos:[['euEquYjVVcQ','02A · Insertion Sort'],['t1ranlQmofQ','02B · Loop Invariant of Insertion Sort'],['UtEMLcKHcGc','02C · Detailed Analysis of Insertion Sort']],
 mit:[['JPyuH4qXLZ0','MIT Lecture 01 (17:00–1:03:30)',1020,3810]],
 prereq:['ICS 141 Ch 2.4: Sequences and Summations','ICS 141 Ch 3.3: Complexity of Algorithms','ICS 141 Ch 5.5: Program Correctness','ICS 211: Simple Sorting Algorithms'],
 html:`<h2>Insertion sort</h2>
 <div class="grid g2"><pre><code><span class="fn">INSERTION-SORT</span>(A, n)
  <span class="kw">for</span> i = 2 <span class="kw">to</span> n
      key = A[i]
      <span class="cm">// insert A[i] into sorted A[1..i-1]</span>
      j = i - 1
      <span class="kw">while</span> j &gt; 0 <span class="kw">and</span> A[j] &gt; key
          A[j + 1] = A[j]
          j = j - 1
      A[j + 1] = key</code></pre>
 <div class="card"><h3>Loop invariant</h3><p>At the start of each iteration of the <b>for</b> loop, <code>A[1..i-1]</code> consists of the original first i−1 elements, in sorted order.</p><ul class="clean"><li><b>Initialization:</b> true before the first iteration (A[1..1] is trivially sorted).</li><li><b>Maintenance:</b> if true before an iteration, it stays true after it (key is shifted into place).</li><li><b>Termination:</b> when the loop ends (i = n+1), the invariant says A[1..n] is sorted.</li></ul></div></div>
 <h2>Analysis</h2>
 <table class="tbl"><tr><th>Case</th><th>Input</th><th>Inner loop runs</th><th>Time</th></tr>
 <tr><td>Best</td><td>already sorted</td><td>0 shifts per i</td><td>Θ(n)</td></tr>
 <tr><td>Worst</td><td>reverse sorted</td><td>i−1 shifts per i: Σ(i−1) = n(n−1)/2</td><td>Θ(n²)</td></tr>
 <tr><td>Average</td><td>random order</td><td>≈ (i−1)/2 shifts</td><td>Θ(n²)</td></tr></table>
 <div class="callout cyan">We use the <b>RAM model</b>: each primitive step costs constant time. We usually report the <b>worst case</b> because it is a guarantee, it happens often, and the average is frequently as bad.</div>`,
 eli5:{title:'Sorting cards in your hand',pts:['🃏 Insertion sort is how you sort playing cards: pick up one card at a time and slide it into the right spot.','✋ The cards already in your hand are always in order. That promise is the <b>loop invariant</b>.','✅ If the promise is true at the start, stays true each step, and is true at the end, the algorithm is correct!','⏱️ If the cards are already in order, it is super fast. If they are backwards, you slide every card all the way, which is slow (n²).']},
 diagram:()=>fig(D.svg(720,180,[5,2,4,6,1,3].map((v,i)=>{const sorted=i<3,key=i===3;return `<rect x="${60+i*80}" y="60" width="66" height="56" rx="10" fill="${key?C.warn+'44':sorted?C.good+'33':C.dim+'33'}" stroke="${key?C.warn:sorted?C.good:C.dim}" stroke-width="2"/>`+D.text(93+i*80,96,[2,4,5,6,1,3][i],20,'#fff','middle',700);}).join('')+D.text(170,48,'sorted prefix A[1..i−1]',12.5,C.good)+D.text(333,48,'key = A[i]',12.5,C.warn)+D.text(493,48,'not yet processed',12.5,C.mut)+`<path d="M333 125 Q 250 168 170 125" fill="none" stroke="${C.warn}" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#ar-warn)"/>`+D.text(250,170,'shift larger items right, drop key into the gap',12,C.txt)),
  'Insertion sort grows a sorted prefix: each new key is shifted left past larger elements.','Green cards are already sorted. The yellow card slides left until it fits.'),
 mc:[
  ['What is the loop invariant of insertion sort?','A[1..i−1] holds the original first i−1 elements in sorted order',['A[i..n] is sorted','A[1..i−1] holds the i−1 smallest elements of A','The key is always the minimum'],'It is the prefix that is sorted, not necessarily the smallest elements.'],
  ['Which part of a loop-invariant proof uses the loop condition becoming false?','Termination',['Initialization','Maintenance','Induction basis'],'Termination combines the invariant with the exit condition.'],
  ['Best-case running time of insertion sort:','Θ(n)',['Θ(1)','Θ(n lg n)','Θ(n²)'],'Sorted input: the while loop test fails immediately each time.'],
  ['Worst-case input for insertion sort:','Reverse-sorted array',['Sorted array','All equal keys','Random order'],'Every key must shift past all earlier elements.'],
  ['Σ_{i=2}^{n} (i − 1) equals:','n(n − 1)/2',['n²','n(n + 1)/2','n − 1'],'Arithmetic series 1 + 2 + … + (n−1).'],
  ['Why do we usually analyze the worst case?','It gives a guarantee on running time for every input',['It is always equal to the average case','It is easiest to measure experimentally','It ignores constant factors'],'Upper bound on any input; also often typical.'],
  ['Insertion sort is:','Stable and in place',['Stable but needs Θ(n) extra space','Unstable and in place','Unstable and not in place'],'It only uses O(1) extra space and never jumps equal keys past each other.']
 ]},

{id:'t07', num:'#7', short:'Divide & Conquer', title:'Divide &amp; Conquer and', grad:'Recurrences', when:'Week 2 · Wed 09/02', icon:'✂️', color:'#f97316',
 blurb:'Merge sort, recurrences, substitution, recursion trees, master method.',
 lead:'<b>Divide</b> the problem into subproblems, <b>conquer</b> them recursively, <b>combine</b> the results. The running time is a recurrence, which we solve with substitution, recursion trees, or the master method.',
 reading:'CLRS Sections 2.3, 4.1 &amp; 4.3–4.5', notes:'Topic 07',
 videos:[['9BI0Lw1kzkE','02D · Merge Sort'],['1JbqqmK7e5s','02E · Analysis of Merge Sort'],['W7rChliGE5M','07A · Divide & Conquer'],['X2D80jsS3sY','07B · Substitution'],['8F2OvQIlGiU','07C · Recursion Trees'],['h4Avr0byu1g','07D · Master Method']],
 mit:[['whjt_N9uYFI','MIT Lecture 02 (16:51–end)',1011],['-EQTVuAhSFY','MIT Lecture 03 (through ~13:07)',0,787]],
 prereq:['ICS 141 Ch 5.4: Recursive Algorithms','ICS 241 Ch 8.3: Divide-and-Conquer Algorithms and Recurrence Relations','ICS 211: Complex Sorting Algorithms'],
 html:`<h2>Merge sort</h2>
 <div class="grid g2"><pre><code><span class="fn">MERGE-SORT</span>(A, p, r)
  <span class="kw">if</span> p &lt; r
      q = ⌊(p + r) / 2⌋
      <span class="fn">MERGE-SORT</span>(A, p, q)
      <span class="fn">MERGE-SORT</span>(A, q + 1, r)
      <span class="fn">MERGE</span>(A, p, q, r)    <span class="cm">// Θ(n)</span></code></pre>
 <div class="card"><h3>Recurrence</h3><p class="math">T(n) = 2T(n/2) + Θ(n) ⇒ T(n) = Θ(n lg n)</p><p>MERGE copies the halves into L and R, then repeatedly moves the smaller front element into A. Each element is moved once, so MERGE is Θ(n). Merge sort is <b>stable</b> but needs Θ(n) extra space.</p></div></div>
 <h2>Solving recurrences</h2>
 <div class="grid g3"><div class="card"><h3>Substitution</h3><p>Guess the form (e.g. T(n) ≤ c n lg n), then prove it by induction, choosing constants that make it work. Watch out: you must prove the <i>exact</i> form of the hypothesis.</p></div>
 <div class="card"><h3>Recursion tree</h3><p>Draw the tree of costs: sum each level, then sum the levels. For 2T(n/2)+cn each of the lg n + 1 levels costs cn → Θ(n lg n). Often used to make a guess for substitution.</p></div>
 <div class="card"><h3>Master method</h3><p>For T(n) = aT(n/b) + f(n), compare f(n) with n^(log_b a):</p><ul class="clean"><li><b>Case 1:</b> f = O(n^(log_b a − ε)) ⇒ Θ(n^(log_b a))</li><li><b>Case 2:</b> f = Θ(n^(log_b a)) ⇒ Θ(n^(log_b a) lg n)</li><li><b>Case 3:</b> f = Ω(n^(log_b a + ε)) and af(n/b) ≤ cf(n) ⇒ Θ(f(n))</li></ul></div></div>
 <table class="tbl"><tr><th>Recurrence</th><th>n^(log_b a)</th><th>Case</th><th>Solution</th></tr>
 <tr><td>T(n) = 9T(n/3) + n</td><td>n²</td><td>1</td><td>Θ(n²)</td></tr>
 <tr><td>T(n) = T(2n/3) + 1</td><td>1</td><td>2</td><td>Θ(lg n)</td></tr>
 <tr><td>T(n) = 3T(n/4) + n lg n</td><td>n^0.79</td><td>3</td><td>Θ(n lg n)</td></tr>
 <tr><td>T(n) = 2T(n/2) + n lg n</td><td>n</td><td>none (gap)</td><td>Θ(n lg² n) by other methods</td></tr></table>`,
 eli5:{title:'Split the job, then glue the answers',pts:['🧹 Cleaning a huge messy room? Split it into halves, give each half to a helper, and they split again…','🧩 When the pieces are tiny, they are easy. Then you glue the answers back together.','📚 <b>Merge sort</b>: split the pile of cards in half, sort each half, then merge the two sorted piles by always taking the smaller top card.','🌲 A <b>recursion tree</b> is a drawing of all the helpers and how much work each one does.','⚡ Merge sort takes about n × log n steps, much faster than n² for big piles.']},
 diagram:()=>fig(D.svg(720,240,(()=>{let s='';const lv=[[1,'n'],[2,'n/2'],[4,'n/4'],[8,'n/8']];lv.forEach(([k,l],d)=>{for(let i=0;i<k;i++){const w=560/k,x=60+w*i+w/2,y=30+d*52;s+=`<rect x="${x-Math.min(30,w/2-4)}" y="${y}" width="${2*Math.min(30,w/2-4)}" height="28" rx="7" fill="${C.warn}22" stroke="${C.warn}"/>`+D.text(x,y+19,l,11.5,'#fff','middle',700);if(d<3){const w2=560/(2*k);[0,1].forEach(c=>{const x2=60+w2*(2*i+c)+w2/2;s+=D.line(x,y+28,x2,y+52,C.dim,1.5);});}}s+=D.text(680,49+d*52,'cn',13,C.good,'middle',700);});return s+D.text(360,232,'lg n + 1 levels × cn per level = Θ(n lg n)',13,C.txt,'middle',700)+D.text(680,20,'level cost',11.5,C.mut);})()),
  'Recursion tree for T(n) = 2T(n/2) + cn: every level costs cn and there are lg n + 1 levels.','Each row of helpers does the same total amount of work. There are only about log n rows, so it is fast.'),
 mc:[
  ['Solve T(n) = 2T(n/2) + Θ(n):','Θ(n lg n)',['Θ(n)','Θ(n²)','Θ(lg n)'],'Master case 2 with n^(log₂2) = n.'],
  ['Solve T(n) = 9T(n/3) + n:','Θ(n²)',['Θ(n)','Θ(n² lg n)','Θ(n³)'],'n^(log₃9) = n² dominates f(n) = n: case 1.'],
  ['Solve T(n) = T(n/2) + 1:','Θ(lg n)',['Θ(1)','Θ(n)','Θ(n lg n)'],'Binary search recurrence: case 2 with n⁰ = 1.'],
  ['Solve T(n) = 3T(n/4) + n lg n:','Θ(n lg n)',['Θ(n^log₄3)','Θ(n lg² n)','Θ(n)'],'Case 3: f dominates and the regularity condition holds.'],
  ['The master method does NOT directly apply to:','T(n) = 2T(n/2) + n lg n',['T(n) = 4T(n/2) + n','T(n) = T(n/2) + n','T(n) = 8T(n/2) + n²'],'n lg n is larger than n but not polynomially larger: it falls in the gap.'],
  ['The MERGE step of merge sort on n elements takes:','Θ(n)',['Θ(1)','Θ(lg n)','Θ(n²)'],'Each element is copied and placed once.'],
  ['Which is a drawback of merge sort compared with insertion sort?','It needs Θ(n) extra space',['It is unstable','Its worst case is Θ(n²)','It cannot sort integers'],'MERGE copies into auxiliary arrays.'],
  ['In the substitution method you must:','Prove the exact form of the inductive hypothesis',['Only check small n','Guess the answer from the master method','Ignore constants entirely'],'Proving a weaker or different form is a classic error.']
 ]}
);

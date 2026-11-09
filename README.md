# ICS 311 Algorithms Study Hub

**Live site:** https://chungjon-netz.github.io/ICS-311-Slop/

An interactive study site for ICS 311 (Algorithms, UH Mānoa). It covers every topic from Week 1 to the final: Topics 1–14, 16–20, 22, 24 and 25, plus a Fibonacci-heap supplement. Each topic has notes, the course screencasts, diagrams and an endless supply of randomized practice questions. Students can answer multiple-choice questions or write pseudocode that is graded automatically on **correctness, modularity and efficiency**.

## What's on the site

| Section | What it does |
|---|---|
| **Overview** | Progress stats, a semester **calendar** that switches to a **timeline** (lectures, holidays, midterms, course review, final), and topic cards grouped by week |
| **Sidebar** | Midterm headers (Midterm 1–4, Final) with week folders under each, following the exam rule below |
| **Topic pages** (29) | Notes, readings, lecture-note and prerequisite links, screencasts, diagram, Dummy mode, "Learn it on purpose" card, random questions |
| **Exam overview pages** (5) | The topics on each exam, a review chain showing how the topics connect, a "Can you…" checklist, a review plan and a one-click practice quiz |
| **All screencasts** | Every course video, grouped by exam |
| **Practice Arena** | Random questions from any mix of topics or exams, multiple choice or pseudocode |
| **Problem Sets** | Pseudocode exercises based on Problem Sets 1–11, each linked to its PDF |

**Exam rule:** a topic is on the next midterm if it was taught before that midterm's week. The topic taught on the Monday of an exam week moves to the following exam. For example, #10A (Mon 10/05) is on Midterm 3, not Midterm 2.

Other features: three color themes (Dark, Light, White & Green), a layout that works on phones and wide screens, and progress saved in the browser.

## How it was built

The site is plain HTML, CSS and JavaScript, with no framework, no backend and no build dependencies beyond Python 3. The source is a set of small files that a short Python script (`build.py`) joins into one self-contained `index.html`. That file is published on the `gh-pages` branch through GitHub Pages, and it also works when opened directly from disk.

| Source file | Contents |
|---|---|
| `index.html`, `styles.css` | Page shell, static pages and themes |
| `course-mt1.js`, `course-mt2.js`, `course-mt3.js`, `course-after.js`, `course-final.js` | Topic content for each exam: notes, readings, videos, Dummy-mode text, diagram and multiple-choice questions |
| `course-learn.js`, `course-learn2.js` | "Learn it on purpose" cards (`LEARN`) and exam review chains (`REVIEW`) |
| `links.js` | Lecture-note, prerequisite and reading URLs from the course schedule (`SCHED`) |
| `diagrams.js`, `graph.js` | SVG diagrams, simple explanations, and graph helpers for the visualizers |
| `questions.js` | Original MST-unit questions and the randomized question generators (`GEN`) |
| `grader.js`, `course-code.js` | The pseudocode grader and the Practice Arena challenges (`CODE`) |
| `course-ps.js` | Problem Set pages and challenges (`PS_CODE`) |
| `course.js` | Course engine: exam groups, sidebar, week grouping, calendar and timeline, topic and exam pages, screencasts, Practice Arena |
| `app.js` | Question rendering, quizzes, routing, saved progress, visualizers and theme switch |

**Where the content comes from:** the course schedule and lecture notes (topic order, dates, readings, screencasts and prerequisite PDFs), and CLRS 4th edition. Section and theorem numbers, and the key ideas on each card, were checked against the book. All notes are original summaries; no textbook text is copied.

**Testing:** before every deploy, headless-Chrome scripts (Playwright) open every page and check for script errors and sideways scrolling on a phone-sized screen. They also check that every model answer scores an A and a junk answer an F, and that the sidebar, themes, calendar and timeline work.

## Exercises

### Multiple choice
- **228 hand-written questions**, each tagged with a topic, with an explanation shown after you answer.
- **16 randomized generators** that build a new question with new numbers every time. Examples: run Kruskal or Dijkstra on a random graph, trace a heap operation, solve a recurrence, or pick a running time.
- The picker avoids repeating recent questions. Practice can draw from one topic, one exam's topics or the whole course.

### Pseudocode challenges (42)
There are 19 Practice Arena challenges (e.g. union-find, Kruskal, Prim, insertion sort, merge sort, heapify, BST insert, quicksort, counting sort, LCS, BFS, Dijkstra, Floyd–Warshall) and 23 Problem Set challenges (PS1–PS11). Each challenge has a prompt, starter code, hints and a model answer.

The grader (`gradeCode` in `grader.js`) does not run the code. It parses free-form pseudocode and accepts CLRS-style or Python-like syntax (`←`, `:=`, `=`, `∞`, `≠`, and so on). It finds the procedure headers and their bodies, then scores three areas out of 10:

| Area | Weight | What is checked |
|---|---|---|
| **Correctness** | 40% | Rubric items for that problem (e.g. "FIND-SET compresses the path", "relaxes every outgoing edge"). Answers that barely change the starter code are capped low. |
| **Modularity** | 30% | Defines the required procedures, calls helpers or ADT operations instead of copying them inline, keeps procedures short (≤ 20 lines), nests no more than 4 levels deep, uses descriptive names and includes at least one comment |
| **Efficiency** | 30% | Checks for that problem (e.g. uses a min-priority queue, builds the heap bottom-up, avoids a full sort for top-k). Points are taken off for known slow patterns or loops nested deeper than expected. The score is capped when the solution is mostly incomplete. |

`overall = 10 × (0.4·correctness + 0.3·modularity + 0.3·efficiency)`. Letter grades are A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, otherwise F. Every check is listed with ✓ or ✗ and a hint, so students can see what to fix.

### Problem Sets
Each Problem Set page lists the topics it covers (linked to their topic pages), its pseudocode problems and a link to the original PDF. The problem wording is a short rewrite, not the PDF's text. Proofs and runtime analyses can't be graded as pseudocode, so the page tells students to do those on paper. A "Random problem I haven't aced" button picks a problem the student hasn't yet scored 90% or higher on.

## Notes and active learning

Each topic page is set up so students study actively instead of just rereading:

- **Notes:** short original explanations of the topic, with the CLRS reading, the lecture-notes link and prerequisite PDFs at the top.
- **Picture it:** an SVG diagram for every topic. Kruskal and Prim also have step-through visualizers.
- **Dummy mode:** a switch at the bottom left that adds very simple explanations, written for a young student, to the current page.
- **🎯 Learn it on purpose:**
  - **Goal:** what you should be able to do after studying the topic.
  - **Key ideas** and **common mistakes**.
  - **Check yourself:** questions whose answers stay hidden until clicked, so students answer from memory first.
  - **Study habit:** write the key ideas from memory, then test again the next day and three days later.
- **🔗 Exam reviews:** each exam page has a topic chain showing what each topic hands to the next (e.g. greedy → MSTs → Dijkstra → Johnson), a "Can you…" checklist and a review plan.
- **Saved progress:** answer counts, scores and the best score for each pseudocode challenge are kept in the browser's `localStorage`, under `mstlab-v1`. There are no accounts and nothing is sent to a server.

## Running locally

Open `index.html` from the `gh-pages` branch in any browser. YouTube embeds work best when the page is served over HTTP, e.g. `python3 -m http.server`.

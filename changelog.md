# Changelog

Release notes for the ICS 311 Algorithms Study Hub. Entries are grouped by version and describe user-facing changes.

---

## v1.4 — Practice Feedback & Review (2026-11-09)

The practice experience now provides instructional feedback on every attempt.

- **Richer incorrect-answer feedback.** Multiple-choice misses now display the correct answer, an explanation of why it is correct, a "how to get there" strategy tip, a worked base example for the topic, and a step-by-step process of deduction (define the question, test each option, eliminate detail-level distractors, sanity-check on a small case).
- **Reinforcement for correct answers.** Rotating study-habit messages encourage retrieval practice and self-explanation.
- **Automatic references.** Every response links to the relevant topic page and lecture notes for follow-up review.
- **Missed-question review on results.** The Practice Arena results screen includes a toggle that lists all missed or skipped questions with deeper explanations — including full grading feedback and model answers for pseudocode — and a retest button that re-serves the question inline.
- **Problem-set parity.** Each problem set page now includes a Q&A section covering all question types (multiple choice, generated, and pseudocode) for its topics, plus a review panel listing problems below 90% with model answers and one-click retest links. Reviews refresh automatically after each submission.
- **Green theme contrast fix.** Incorrect-answer indicators (feedback boxes, wrong options, grading marks) now use a stronger red treatment so they are unambiguous against the green color scheme.

## v1.3 — Problem Set Practice

Instantly graded pseudocode practice drawn from the course problem sets.

- **11 problem sets** covering roughly 20 pseudocode problems, each mapped to the topics it assesses.
- **Automated rubric grading** weighted at Correctness 40%, Modularity 30%, and Efficiency 30%, with per-item feedback and hints.
- **Best-score tracking** per problem and a "random unaced problem" button for targeted review.
- **Heuristic pseudocode parser** accepting CLRS-style, Python-like, and C-like syntax, including common operator variants.

## v1.2 — Practice Arena

A randomized quiz mode for drill sessions.

- **Configurable sessions**: topic selection (by midterm group or individual topic), question type (mixed, multiple choice, or pseudocode), and session length.
- **Generated questions**: randomized graphs for Kruskal/Prim traces, Union-Find simulations, and Fibonacci heap degree bounds produce a different quiz each session.
- **Shuffled answer options** and per-topic score breakdowns on the results screen.
- **Progress persistence** via browser local storage.

## v1.1 — Visualizations & Accessibility

- **Step-through visualizers** for Kruskal's and Prim's algorithms, showing accepted/rejected edges, disjoint-set state, and priority-queue keys.
- **SVG diagrams** on topic pages illustrating stacks, queues, heaps, trees, and graph cuts.
- **"Dummy mode" toggle**: adds grade-school-level explanations to every page.
- **Three color themes**: dark, light, and green.

## v1.0 — Initial Release

- Interactive topic notes for the full course, organized by midterm (Midterms 1–4 and the cumulative final).
- Embedded course screencasts, lazy-loaded and grouped by exam.
- Topic-level Q&A widgets with multiple-choice and pseudocode questions.
- Coverage of Disjoint Sets (Union-Find), Minimum Spanning Trees, Kruskal's and Prim's algorithms, and Fibonacci heap degree bounds, including the safe-edge theorem and its proof.

---

*Convention going forward: each release lists what changed, why it matters, and where to find it. Bug fixes and content corrections are noted under the version they ship in.*

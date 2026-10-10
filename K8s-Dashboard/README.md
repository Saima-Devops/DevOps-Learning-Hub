# Kubernetes Learning Dashboard

The selected source is `K8s-Learning-Dashboard-v12.tsx`, the newest supplied version
(17 May 2026). It contains 14 topics, 15 labs, 24 scenarios, 45 assessment questions,
a 130-question CKA mock exam bank, 90 glossary entries and seven cheatsheet tabs.
Older versions and the unused JavaScript stub have been removed.

Each level's tabs run in study order: Topics, Labs, Scenarios, Assessment.

## Mock exams

The **Mock Exam** button in the header (or the `#k8s-exam` URL hash) opens the
Mock Exam Centre, built on the same engine as the AZ-900 dashboard:

- Full Mock Exam: 50 questions, 75 minutes, weighted like the CKA curriculum
  (Cluster Architecture 25%, Workloads & Scheduling 15%, Services & Networking 20%,
  Storage 10%, Troubleshooting 30%).
- Quick Check: 20 weighted questions, 30 minutes.
- Five Domain Drills: 10 questions, 15 minutes each.
- Weak-Area Practice: built from the lessons scored below the 66% pass mark in the
  last attempt.

Results show a readiness percentage against the 66% pass mark, a score per CKA
domain, the lessons to revisit (each links back to its topic), and a full answer
review. The last 10 attempts are saved in the browser's localStorage under
`cka-mock-history`.

To add questions, append `Q(domain, phaseIndex, topicIndex, question, right,
[3 wrong answers], explanation)` entries to `QUESTION_BANK` in the source. The
domain drills need at least 10 questions per domain.

## Final files

- `index.html`: runnable dashboard and GitHub Pages entry point.
- `dashboard.css`: Kubernetes layout and responsive styling.
- `K8s-Learning-Dashboard-v12.tsx`: final editable dashboard source.
- `build-index.cjs`: regenerates the HTML from the final source.
- `README.md`: usage and maintenance notes.

## Open the dashboard

Open `index.html` in a browser. It also works as the `K8s-Dashboard/index.html`
route of the complete GitHub Pages site. Its logo returns to the Learning Hub.
Keep the parent `assets` directory alongside this folder for the shared header
styling and back-to-top control. React, Babel, fonts and icons load from CDNs,
so an internet connection is required.

## Maintain the source

Edit `K8s-Learning-Dashboard-v12.tsx` and `dashboard.css`. Then regenerate the
standalone browser entry point:

```sh
node build-index.cjs
```

This is a static dashboard: commands and lab solutions are study material,
not executed by the page. Quiz answers and scenario progress last for the
browser session until the page is reloaded; only mock exam history is stored.

The logo-only sticky header, 1180px content area, responsive side gutters,
copyright footer and floating back-to-top control match the Azure dashboard.

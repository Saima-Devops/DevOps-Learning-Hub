# Linux Administration Dashboard (LFCS Prep)

`Linux-Admin-Dashboard-v1.tsx` is the editable source. It targets the Linux
Foundation Certified System Administrator (LFCS) exam and contains 15 topics,
15 labs, 16 scenarios, 45 assessment questions, a 126-question mock exam bank,
98 glossary entries and seven cheatsheet tabs. Content is distribution-neutral
and shows both RHEL-family (dnf, firewalld, SELinux) and Debian-family (apt,
UFW, Netplan) commands where they differ.

Each level's tabs run in study order: Topics, Labs, Scenarios, Assessment.

| Level | Topics |
| --- | --- |
| L1 Foundation | Shell & FHS · Files, Links & Text · Users, Groups & sudo · Permissions & ACLs · Processes |
| L2 Core Administration | systemd & Logging · Packages & Scheduling · Disks, Filesystems & Swap · LVM, NFS & autofs · Networking |
| L3 Production Grade | SSH, Firewalls & Traffic · SELinux & Hardening · Performance & Recovery · Containers & VMs · Bash, Git & TLS |

## Files

- `index.html`: runnable dashboard and GitHub Pages entry point.
- `dashboard.css`: layout and responsive styling.
- `Linux-Admin-Dashboard-v1.tsx`: dashboard source.
- `build-index.cjs`: regenerates the HTML from the source.
- `README.md`: usage and maintenance notes.

## Open the dashboard

Open `index.html` in a browser. It works as the `Linux-Dashboard/index.html`
route of the Learning Hub, and its logo returns to the hub. Keep the parent
`assets` directory alongside this folder for the shared header styling and
back-to-top control. React, Babel, fonts and icons load from CDNs, so an
internet connection is required.

## Mock exams

The **Mock Exam** button in the header (or the `#lnx-exam` URL hash) opens the
Mock Exam Centre, built on the same engine as the AZ-900 and CKA dashboards:

- Full Mock Exam: 50 questions, 75 minutes, weighted like the LFCS curriculum
  (Operations Deployment 25%, Networking 25%, Storage 20%, Essential Commands 20%,
  Users and Groups 10%).
- Quick Check: 20 weighted questions, 30 minutes.
- Five Domain Drills: 10 questions, 15 minutes each.
- Weak-Area Practice: built from the lessons scored below the 67% pass mark in the
  last attempt.

Results show readiness against the 67% pass mark, a score per LFCS domain, the
lessons to revisit (each links back to its topic) and a full answer review. The
last 10 attempts are saved in localStorage under `lfcs-mock-history`.

To add questions, append `Q(domain, phaseIndex, topicIndex, question, right,
[3 wrong answers], explanation)` entries to `QUESTION_BANK`. Domain drills need
at least 10 questions per domain.

## Maintain the source

Edit `Linux-Admin-Dashboard-v1.tsx` and `dashboard.css`, then regenerate:

```sh
node build-index.cjs
```

Topic `keywords` must exactly match a `GLOSSARY` key and appear in that topic's
explanation text to become clickable.

This is a static dashboard: commands and lab solutions are study material, not
executed by the page. Quiz answers and scenario progress last until the page is
reloaded; only mock exam history is stored.

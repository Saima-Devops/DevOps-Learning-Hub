# AWS Solutions Architect Associate Dashboard (SAA-C03 Prep)

`AWS-SAA-Dashboard-v1.tsx` is the editable source. It targets the AWS Certified
Solutions Architect – Associate exam (SAA-C03) and contains 15 topics, 15 labs,
16 architecture scenarios, 45 assessment questions, a 156-question mock exam bank
(14 of them "choose two"), 138 glossary entries and seven AWS CLI cheatsheet tabs.

Each level's tabs run in study order: Topics, Labs, Scenarios, Assessment.

| Level | Topics |
| --- | --- |
| L1 Cloud Foundations | Global Infrastructure & Well-Architected · IAM & Account Security · EC2 & Pricing · S3, EBS & EFS · VPC Fundamentals |
| L2 Resilient & High-Performing | ELB & Auto Scaling · RDS, Aurora & DynamoDB · Route 53, CloudFront & Global Accelerator · SQS, SNS, EventBridge & Kinesis · Serverless & Containers |
| L3 Secure, Hybrid & Cost-Optimised | KMS, Secrets & Security Services · Endpoints, Transit Gateway, VPN & Direct Connect · DR, Backup & Migration · Analytics & Caching · Cost, Monitoring & Governance |

## Files

- `index.html`: runnable dashboard and GitHub Pages entry point.
- `dashboard.css`: layout and responsive styling.
- `AWS-SAA-Dashboard-v1.tsx`: dashboard source.
- `build-index.cjs`: regenerates the HTML from the source.
- `README.md`: usage and maintenance notes.

## Open the dashboard

Open `index.html` in a browser. It works as the `AWS-SAA-Dashboard/index.html`
route of the Learning Hub, and its logo returns to the hub. Keep the parent
`assets` directory alongside this folder for the shared header styling and
back-to-top control. React, Babel, fonts and icons load from CDNs, so an
internet connection is required.

The main Hub's AWS card links to this entry point. The sticky logo returns to
the Hub, and the footer name links to the portfolio. Footer links stay
underline-free and turn cyan on hover or keyboard focus, matching the other
learning dashboards. The shared content width is 1180px with responsive gutters.

## Mock exams

The **Mock Exam** button in the header (or the `#saa-exam` URL hash) opens the
Mock Exam Centre, built on the same engine as the AZ-900, CKA and LFCS dashboards:

- Full Mock Exam: 65 questions in 130 minutes, the real SAA-C03 length and time,
  weighted by domain (Secure 30%, Resilient 26%, High-Performing 24%,
  Cost-Optimized 20%).
- Quick Check: 20 weighted questions, 40 minutes.
- Four Domain Drills: 15 questions, 30 minutes each.
- Weak-Area Practice: built from the lessons scored below the pass mark in the
  last attempt.

Multiple-response ("choose two") questions use checkboxes and score as correct
only when every right option is selected, as on the real exam. The real exam is
scaled from 100 to 1000 with 720 to pass; the dashboard uses 72% as the
equivalent. The last 10 attempts are saved in localStorage under
`saa-mock-history`.

To add questions, append to `QUESTION_BANK`:

- `Q(domain, phaseIndex, topicIndex, question, right, [3 wrong], explanation)`
- `QM(domain, phaseIndex, topicIndex, question, [2 right], [3 wrong], explanation)`

Domain drills need at least 15 questions per domain, and the Full Mock needs at
least 20 in Domain 1.

## Maintain the source

Edit `AWS-SAA-Dashboard-v1.tsx` and `dashboard.css`, then regenerate:

```sh
node build-index.cjs
```

Topic `keywords` must exactly match a `GLOSSARY` key and appear in that topic's
explanation text to become clickable.

Labs and scenarios use real AWS CLI commands that create billable resources.
Practise in a sandbox account, keep an eye on the Free Tier, and delete what you
create. Quiz answers and scenario progress last until the page is reloaded; only
mock exam history is stored.

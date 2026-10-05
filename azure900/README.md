# AZ-900: Microsoft Azure Fundamentals

**AZ-900: Zero to Certified** is an interactive exam-preparation dashboard within the DevOps Learning Hub. It provides lessons, labs, hands-on scenarios, per-level quizzes and timed mock exams with readiness results and domain-level feedback.

[Open the Azure dashboard](./index.html) | [Return to the Learning Hub](../index.html)

## Files

- `index.html`: runnable single-page dashboard; no install or build step.
- `AZ900-Learning-Dashboard.tsx`: editable source retained for development.
- `README.md`: module documentation.

The HTML includes the application code. Changes to the TSX source do not automatically update the published HTML; keep the runnable `index.html` synchronized when making source changes.

## Local Preview

Open `index.html` in a browser, or launch it from the Azure card on the root Learning Hub page. An internet connection is required for React, React DOM, Babel and Google Fonts loaded from CDNs.

Mock exam history is stored in the visitor's browser using `localStorage`; it is not sent to a server. Clearing browser storage removes that history. History may differ between local previews, browsers and the published site.

## Publish With the Learning Hub

Keep this directory named `azure900` beside the root Learning Hub `index.html`. The homepage card links to `./azure900/index.html`.

Publish the repository root through GitHub Pages using the instructions in the [main README](../README.md#publishing-on-github-pages). No separate Azure repository or build is needed. The expected URL, once the hub is published, is [DevOps Learning Hub / Azure](https://saima-devops.github.io/DevOps-Learning-Hub/azure900/).

Include the entire hub's required page and asset folders in the same deployment so cross-page links remain valid. See [GitHub Pages publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Verification

After publishing, open the Azure card from the hub and check that the dashboard renders, a lesson opens, and the Mock Exam Centre is accessible. Verify the page on desktop and mobile and confirm that CDN resources load.

## Usage

The copyright and usage restrictions in the [main README](../README.md) apply to this dashboard. It is an independent learning resource, not an official Microsoft certification or exam product.

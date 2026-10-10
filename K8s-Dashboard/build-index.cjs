const fs = require("node:fs");
const path = require("node:path");

// Keep the browser entry point synchronized with the selected v12 source.
const source = fs.readFileSync(path.join(__dirname, "K8s-Learning-Dashboard-v12.tsx"), "utf8")
  .replace(/^import \{ useEffect, useState \} from "react";\r?\n/, "const { useEffect, useState } = React;\n")
  .replace("export default function K8sDashboard()", "function K8sDashboard()");
if (/^import |^export /m.test(source)) throw new Error("Unexpected module dependency; review browser generation.");
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kubernetes: Zero to Champion | Learn with Sam</title>
  <meta name="description" content="Kubernetes learning dashboard: three levels of lessons, hands-on scenarios, labs, quizzes and CKA study resources." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/site-navigation.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
  <link rel="stylesheet" href="./dashboard.css" />
  <script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
  <script src="../assets/js/site-navigation.js" defer></script>
</head>
<body>
  <div id="root"></div>
  <button class="page-back-to-top" data-back-to-top type="button" hidden aria-label="Back to top" title="Back to top"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i></button>
  <!-- Generated from K8s-Learning-Dashboard-v12.tsx by build-index.cjs. -->
  <script type="text/babel">
${source.replace(/<\/script/gi, "<\\/script")}
ReactDOM.createRoot(document.getElementById("root")).render(<K8sDashboard />);
  </script>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log("Generated K8s-Dashboard/index.html from v12.");

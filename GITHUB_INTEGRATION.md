# Rendering ChordPro Files on GitHub

This document outlines several approaches to render ChordPro files on GitHub, similar to how GitHub renders Markdown files.

## Background

GitHub automatically renders certain file types like Markdown (.md), but doesn't natively support ChordPro (.chopro, .cho) files. The ChordproJSParser project provides functionality to parse and render ChordPro files as HTML, which we can leverage to create a GitHub integration.

## Approaches

### 1. Browser Extension

**Description:**
Create a browser extension that detects ChordPro files on GitHub and renders them using ChordproJSParser.

**Implementation:**

1. Develop a browser extension for Chrome/Firefox/Edge
2. Detect when a user is viewing a .chopro or .cho file on GitHub
3. Intercept the raw file content
4. Use ChordproJSParser to render it as HTML
5. Replace the GitHub file view with the rendered HTML

**Pros:**

- Works directly within GitHub's interface
- No server-side components needed
- User can toggle between raw and rendered views

**Example Code:**

```javascript
// Background script for the extension
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.match(/github\.com\/.*\.(chopro|cho)$/)) {
    chrome.scripting.executeScript({
      target: { tabId },
      function: renderChordProFile
    });
  }
});

function renderChordProFile() {
  // Get the raw file content from GitHub's interface
  const fileContent = document.querySelector(".blob-code-inner").textContent;

  // Create a container for the rendered content
  const container = document.createElement("div");
  container.id = "chordpro-rendered";

  // Load ChordproJS (could be bundled with the extension)
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("chordprojs.min.js");
  script.onload = () => {
    // Render the ChordPro content
    const chordpro = ChordproJS();
    chordpro.renderToElement(fileContent, "#chordpro-rendered");

    // Replace GitHub's file view with our rendered content
    const fileView = document.querySelector(".blob-wrapper");
    fileView.parentNode.replaceChild(container, fileView);

    // Add a toggle button to switch between raw and rendered views
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "View Raw";
    toggleButton.onclick = toggleView;
    document.querySelector(".file-actions").appendChild(toggleButton);
  };
  document.head.appendChild(script);
}

function toggleView() {
  // Toggle between raw and rendered views
  const fileView = document.querySelector(".blob-wrapper");
  const renderedView = document.querySelector("#chordpro-rendered");

  if (fileView.style.display === "none") {
    fileView.style.display = "block";
    renderedView.style.display = "none";
    this.textContent = "View Rendered";
  } else {
    fileView.style.display = "none";
    renderedView.style.display = "block";
    this.textContent = "View Raw";
  }
}
```

### 2. GitHub Pages Integration

**Description:**
Create a GitHub Pages site that can render ChordPro files from your repository.

**Implementation:**

1. Set up GitHub Pages for your repository
2. Create an index.html file that uses ChordproJSParser
3. Use JavaScript to fetch ChordPro files from your repository
4. Render them using ChordproJSParser
5. Add links in your README.md to the rendered versions

**Pros:**

- No browser extension required
- Works for anyone visiting your GitHub Pages site
- Can be styled to match your preferences

**Example Setup:**

```html
<!-- index.html for GitHub Pages -->
<!DOCTYPE html>
<html>
  <head>
    <title>ChordPro Viewer</title>
    <script src="dist/chordprojs.min.js"></script>
    <link rel="stylesheet" href="style.css" />
    <style>
      /* Additional styles for the viewer */
      body {
        font-family: sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      #file-selector {
        margin-bottom: 20px;
      }
      #song-container {
        border: 1px solid #ddd;
        padding: 20px;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <h1>ChordPro Viewer</h1>

    <div id="file-selector">
      <label for="file-select">Select a song:</label>
      <select id="file-select">
        <option value="">-- Select a song --</option>
      </select>
    </div>

    <div id="song-container"></div>

    <script>
      // List of ChordPro files in your repository
      const chordproFiles = [
        "example.chopro",
        "songs/amazing_grace.chopro",
        "songs/hallelujah.chopro"
      ];

      // Populate the file selector
      const fileSelect = document.getElementById("file-select");
      chordproFiles.forEach((file) => {
        const option = document.createElement("option");
        option.value = file;
        option.textContent = file.split("/").pop().replace(".chopro", "");
        fileSelect.appendChild(option);
      });

      // Initialize ChordproJS
      const chordpro = ChordproJS();

      // Handle file selection
      fileSelect.addEventListener("change", async () => {
        const selectedFile = fileSelect.value;
        if (!selectedFile) return;

        try {
          // Fetch the ChordPro file from the repository
          const response = await fetch(selectedFile);
          const chordproText = await response.text();

          // Render the ChordPro content
          chordpro.renderToElement(chordproText, "#song-container");
        } catch (error) {
          console.error("Error loading ChordPro file:", error);
          document.getElementById("song-container").innerHTML =
            `<p style="color: red">Error loading file: ${error.message}</p>`;
        }
      });
    </script>
  </body>
</html>
```

### 3. GitHub Actions for Automatic HTML Generation

**Description:**
Use GitHub Actions to automatically generate HTML versions of ChordPro files when they're pushed to the repository.

**Implementation:**

1. Create a GitHub Action workflow
2. When ChordPro files are pushed, run a script that uses ChordproJSParser
3. Generate HTML files for each ChordPro file
4. Commit these HTML files to a specific branch or directory
5. Link to these HTML files from your README.md

**Pros:**

- Automatic generation of HTML files
- No client-side rendering required
- Works for anyone viewing your repository

**Example GitHub Action Workflow:**

```yaml
# .github/workflows/render-chordpro.yml
name: Render ChordPro Files

on:
  push:
    paths:
      - "**.chopro"
      - "**.cho"

jobs:
  render:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16"

      - name: Install dependencies
        run: npm install

      - name: Render ChordPro files
        run: node scripts/render-chordpro.js

      - name: Commit rendered files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add rendered/
          git commit -m "Render ChordPro files" || echo "No changes to commit"
          git push
```

**Example Rendering Script:**

```javascript
// scripts/render-chordpro.js
import fs from "fs";
import path from "path";
import { createChordproJS } from "../src/index.js";

// Initialize ChordproJS
const chordpro = createChordproJS();

// Create the rendered directory if it doesn't exist
const renderedDir = path.join(process.cwd(), "rendered");
if (!fs.existsSync(renderedDir)) {
  fs.mkdirSync(renderedDir);
}

// Find all ChordPro files
function findChordProFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== "rendered") {
      files.push(...findChordProFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith(".chopro") || entry.name.endsWith(".cho"))) {
      files.push(fullPath);
    }
  }

  return files;
}

// Render each ChordPro file to HTML
const chordproFiles = findChordProFiles(process.cwd());
console.log(`Found ${chordproFiles.length} ChordPro files`);

for (const file of chordproFiles) {
  try {
    const content = fs.readFileSync(file, "utf8");
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${path.basename(file)}</title>
  <style>
    body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    pre.chord-line { color: #c00; font-weight: bold; font-family: monospace; margin: 0; line-height: 1.1; }
    pre.lyric-line { margin: 0 0 8px 0; font-family: monospace; line-height: 1.1; }
    .comment { font-style: italic; color: gray; margin: 8px 0; }
    h1, h2 { margin: 5px 0; }
    .section.chorus { border-left: 3px solid #c00; padding-left: 10px; background-color: #f9f9f9; }
    .section.bridge { border-left: 3px solid #00c; padding-left: 10px; background-color: #f0f0ff; }
  </style>
</head>
<body>
  <div id="song-container">
    ${chordpro.renderToHTML(content)}
  </div>
  <p><a href="${file}">View raw ChordPro file</a></p>
</body>
</html>
    `;

    const outputFile = path.join(renderedDir, `${path.basename(file, path.extname(file))}.html`);
    fs.writeFileSync(outputFile, html);
    console.log(`Rendered ${file} to ${outputFile}`);
  } catch (error) {
    console.error(`Error rendering ${file}:`, error);
  }
}

// Generate an index file
const indexHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>ChordPro Songs</title>
  <style>
    body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    ul { list-style-type: none; padding: 0; }
    li { margin: 10px 0; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>ChordPro Songs</h1>
  <ul>
    ${chordproFiles
      .map((file) => {
        const basename = path.basename(file, path.extname(file));
        return `<li><a href="${basename}.html">${basename}</a></li>`;
      })
      .join("\n    ")}
  </ul>
</body>
</html>
`;

fs.writeFileSync(path.join(renderedDir, "index.html"), indexHtml);
console.log("Generated index.html");
```

### 4. Custom Web Service

**Description:**
Create a web service that renders ChordPro files on demand, which can be linked from GitHub.

**Implementation:**

1. Build a simple web service using Node.js, Express, etc.
2. Accept ChordPro content as input (via URL parameter or file upload)
3. Use ChordproJSParser to render it as HTML
4. Return the rendered HTML
5. Host this service on a platform like Vercel, Netlify, or Heroku
6. Link to this service from your GitHub repository

**Pros:**

- Works for any ChordPro file, not just those in your repository
- Can be extended with additional features
- Can be used outside of GitHub

**Example Web Service:**

```javascript
// server.js
import express from "express";
import { createChordproJS } from "./src/index.js";

const app = express();
const port = process.env.PORT || 3000;

// Initialize ChordproJS
const chordpro = createChordproJS();

// Serve static files
app.use(express.static("public"));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Handle GET requests with a URL parameter
app.get("/render", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing URL parameter");
  }

  fetch(url)
    .then((response) => response.text())
    .then((content) => {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>ChordPro Renderer</title>
  <style>
    body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    pre.chord-line { color: #c00; font-weight: bold; font-family: monospace; margin: 0; line-height: 1.1; }
    pre.lyric-line { margin: 0 0 8px 0; font-family: monospace; line-height: 1.1; }
    .comment { font-style: italic; color: gray; margin: 8px 0; }
    h1, h2 { margin: 5px 0; }
    .section.chorus { border-left: 3px solid #c00; padding-left: 10px; background-color: #f9f9f9; }
    .section.bridge { border-left: 3px solid #00c; padding-left: 10px; background-color: #f0f0ff; }
  </style>
</head>
<body>
  <div id="song-container">
    ${chordpro.renderToHTML(content)}
  </div>
  <p><a href="${url}">View raw ChordPro file</a></p>
</body>
</html>
      `;

      res.send(html);
    })
    .catch((error) => {
      res.status(500).send(`Error: ${error.message}`);
    });
});

// Handle file uploads
app.post("/upload", express.raw({ type: "text/plain", limit: "1mb" }), (req, res) => {
  try {
    const content = req.body.toString();
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>ChordPro Renderer</title>
  <style>
    body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    pre.chord-line { color: #c00; font-weight: bold; font-family: monospace; margin: 0; line-height: 1.1; }
    pre.lyric-line { margin: 0 0 8px 0; font-family: monospace; line-height: 1.1; }
    .comment { font-style: italic; color: gray; margin: 8px 0; }
    h1, h2 { margin: 5px 0; }
    .section.chorus { border-left: 3px solid #c00; padding-left: 10px; background-color: #f9f9f9; }
    .section.bridge { border-left: 3px solid #00c; padding-left: 10px; background-color: #f0f0ff; }
  </style>
</head>
<body>
  <div id="song-container">
    ${chordpro.renderToHTML(content)}
  </div>
</body>
</html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Serve the home page
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(port, () => {
  console.log(`ChordPro renderer listening at http://localhost:${port}`);
});
```

## Recommendation

For the best user experience and ease of implementation, I recommend the **Browser Extension** approach. This allows for seamless integration with GitHub's interface and doesn't require any server-side components.

For a more permanent solution that works for all users without requiring a browser extension, the **GitHub Pages Integration** or **GitHub Actions** approaches are recommended.

## Next Steps

1. Choose the approach that best fits your needs
2. Implement the solution using the provided examples as a starting point
3. Test the solution with various ChordPro files
4. Share the solution with the community

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Browser Extensions Development](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [Express.js Documentation](https://expressjs.com/)

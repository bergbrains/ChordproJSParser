# ChordPro JS Renderer Documentation

## Overview

The ChordPro JS Renderer is a JavaScript module designed to easily integrate ChordPro-formatted song files into any web application. It parses standard ChordPro files and dynamically renders them into HTML, allowing customizable styling through CSS.

---

## Features

- Parses standard ChordPro syntax:
  - Titles, artists, comments, and environment tags (chorus, verse, etc.)
  - Chords rendered clearly above corresponding lyrics
- Flexible rendering into any specified HTML container (`div`)
- Customizable appearance via standard CSS

---

## Installation and Usage

### 1. Include Module

Copy `chordpro-renderer.js` into your project directory.

```html
<script type="module">
  import { renderChordPro } from "./chordpro-renderer.js";
</script>
```

### 2. HTML Setup

Include these elements in your HTML:

```html
<input type="file" id="filePicker" accept=".cho,.chopro,.txt" />
<input type="text" id="filePath" placeholder="Or enter file URL" />
<button id="loadBtn">Load ChordPro File</button>
<div id="chordproTarget"></div>
```

### 3. JavaScript Integration

Here's how to connect user interaction with the renderer:

```html
<script type="module">
  import { renderChordPro } from "./chordpro-renderer.js";

  const target = document.getElementById("chordproTarget");
  const filePicker = document.getElementById("filePicker");
  const filePath = document.getElementById("filePath");
  const loadBtn = document.getElementById("loadBtn");

  filePicker.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      renderChordPro(e.target.result, target);
    };

    reader.readAsText(file);
  });

  loadBtn.addEventListener("click", function () {
    fetch(filePath.value)
      .then((response) => response.text())
      .then((text) => renderChordPro(text, target))
      .catch((err) => alert("Failed to load file: " + err));
  });
</script>
```

---

## Styling (CSS)

Include basic CSS for readability:

```css
#chordproTarget {
  border: 1px solid #ccc;
  padding: 15px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
}

pre.chord-line {
  color: #c00;
  font-weight: bold;
  font-family: monospace;
  margin: 0;
  line-height: 1.1;
}

pre.lyric-line {
  margin: 0 0 8px 0;
  font-family: monospace;
  line-height: 1.1;
}

.comment {
  font-style: italic;
  color: gray;
  margin: 8px 0;
}

h1,
h2 {
  margin: 5px 0;
}
```

---

## Module Architecture and Internal Logic

The module (`chordpro-renderer.js`) exports a single JavaScript function:

```javascript
renderChordPro(text, targetElement);
```

### How It Works

The parser works line-by-line:

- **Directives**: Detects and processes ChordPro directives (title, artist, comments, chorus/verse blocks).
- **Chord & Lyrics**: Extracts chords from bracket notation (`[Chord]`) and places them above their corresponding
  lyrics, ensuring chords align correctly via monospace fonts.

### Rendering Logic Flow

```plaintext
ChordPro File Input
          ↓
 Split into lines
          ↓
For each line:
 ├── If directive → handle directive (title, artist, etc.)
 ├── If chords present → separate chords & lyrics, render chord line above lyric line
 └── Render empty lines or spaces appropriately
          ↓
Compose final HTML
          ↓
Insert into target HTML element
```

### Diagram

```plaintext
ChordPro Text Input
       │
```

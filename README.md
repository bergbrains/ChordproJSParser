# ChordPro JS Renderer Documentation

## Overview

The ChordPro JS Renderer is a JavaScript module designed to easily integrate ChordPro-formatted song files into any web
application. It parses standard ChordPro files and dynamically renders them into HTML, allowing customizable styling
through CSS.

---

## Features

- Parses standard ChordPro syntax:
  - Metadata directives: title, subtitle, artist, key, capo, tempo, time, year, album, composer, copyright
  - Environment directives: chorus, verse, bridge
  - Comment directives
  - Font directives: textfont, chordfont, textsize, chordsize, textcolour/textcolor, chordcolour/chordcolor
  - Chords rendered clearly above corresponding lyrics
- Flexible rendering into any specified HTML container (`div`)
- Customizable appearance via standard CSS

## ChordPro Specification

ChordPro is a text file format for representing lyrics with chords. The format uses directives (commands that start with {) to define song structure and metadata.

For comprehensive information about the ChordPro specification, refer to these resources:

- [WorshipTools ChordPro Directives Documentation](https://www.worshiptools.com/en-us/docs/125-cp-directives)
- [SongBook Pro ChordPro Manual](https://songbook-pro.com/docs/manual/chordpro/)

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

/* Chord and lyric lines */
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

/* Section types */
.section {
  margin-bottom: 15px;
}

.section.chorus {
  border-left: 3px solid #c00;
  padding-left: 10px;
  background-color: #f9f9f9;
}

.section.bridge {
  border-left: 3px solid #00c;
  padding-left: 10px;
  background-color: #f0f0ff;
}

/* Comments */
.comment {
  font-style: italic;
  color: gray;
  margin: 8px 0;
}

/* Metadata */
h1,
h2 {
  margin: 5px 0;
}

.artist,
.key,
.capo,
.tempo,
.time,
.year,
.album,
.composer,
.copyright {
  font-size: 0.9em;
  color: #666;
  margin: 2px 0;
}
```

---

## Font Directives

The ChordPro JS Renderer now supports font directives according to the ChordPro specification. These directives allow you to customize the appearance of text and chords:

```chordpro
{title: My Song}
{artist: Artist Name}

{textfont: Arial, sans-serif}
{textsize: 16px}
{textcolour: #333333}
{chordfont: "Courier New", monospace}
{chordsize: 14px}
{chordcolour: #cc0000}

{start_of_verse}
This is a verse with [C]custom font [G]styling
The text will use Arial, 16px, dark gray
The chords will use Courier New, 14px, red
{end_of_verse}
```

### Supported Font Directives

- **textfont**: Font family for lyrics text
- **chordfont**: Font family for chord text
- **textsize**: Font size for lyrics text
- **chordsize**: Font size for chord text
- **textcolour** / **textcolor**: Color for lyrics text (supports both UK and US spelling)
- **chordcolour** / **chordcolor**: Color for chord text (supports both UK and US spelling)

The font directives generate CSS styles that are automatically applied to the rendered HTML output.

---

## Module Architecture and Internal Logic

The module (`chordpro-renderer.js`) exports a single JavaScript function:

```javascript
renderChordPro(text, targetElement);
```

### How It Works

The parser works line-by-line:

- **Directives**: Detects and processes ChordPro directives:
  - **Metadata directives**: title, subtitle, artist, key, capo, tempo, time, year, album, composer, copyright
  - **Environment directives**: start_of_chorus/end_of_chorus, start_of_verse/end_of_verse, start_of_bridge/end_of_bridge (and their aliases)
  - **Comment directives**: comment (and its alias)
  - **Font directives**: textfont, chordfont, textsize, chordsize, textcolour/textcolor, chordcolour/chordcolor
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

```
ChordPro Text Input
       │
       ▼
 ┌─────────────┐
 │ Line Parser │───┐
 └─────────────┘   │
       │           ▼
       ▼    ┌─────────────────┐
 ┌────────┐ │ Directive Logic │
 │ Chords │ └─────────────────┘
 │  and   │          │
 │ Lyrics │          ▼
 └────────┘  ┌───────────────┐
      │      │  Render HTML  │
      └─────▶└───────────────┘
                    │
                    ▼
              HTML Output
```

---

## Extending the Module

The module already supports many ChordPro directives, including metadata, environment, and comment directives. It can be further extended to support:

- Additional ChordPro directives from the specification
- Chord diagrams and fingering charts
- Advanced formatting options
- Custom section types

The module includes a plugin system that allows extending its functionality. See the transpose plugin in `src/plugins/transpose.js` for an example of how to create plugins.

---

## GitHub Integration

Want to render ChordPro files directly on GitHub, similar to how GitHub renders Markdown files? Check out the [GitHub Integration Guide](GITHUB_INTEGRATION.md) for several approaches:

1. **Browser Extension**: Renders ChordPro files directly in GitHub's interface
2. **GitHub Pages**: Creates a web-based viewer for your ChordPro files
3. **GitHub Actions**: Automatically generates HTML versions of your ChordPro files
4. **Custom Web Service**: Provides a standalone service for rendering ChordPro files

A sample browser extension implementation is available in the `examples/github-extension` directory.

---

## License

MIT License. Free for commercial and private use.

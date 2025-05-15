# ChordproJS - JavaScript ChordPro Parser

## Overview

ChordproJS is a lightweight JavaScript library that parses and renders ChordPro-formatted song files into HTML. It
handles standard ChordPro syntax with zero dependencies, making it easy to integrate into any web application.

## Features

- Parses standard ChordPro syntax:
    - Title, subtitle, artist, key, and other directives
    - Environment tags (chorus, verse, etc.)
    - Chords in bracket notation `[C]` rendered above lyrics
    - Comments and other metadata
- Flexible rendering:
    - To DOM elements via selector or direct element reference
    - As HTML string for further processing
- Zero dependencies
- Available as ES module and UMD builds

## Installation

### npm

```bash
npm install chordprojs
```

## Direct include 

```html
<script src="https://cdn.jsdelivr.net/npm/chordprojs/dist/chordprojs.min.js"></script>
```

## Usage

```
// Create an instance
const chordpro = ChordproJS();

// Parse ChordPro text
const parsed = chordpro.parse(`
{title: Amazing Grace}
[G]Amazing [D]grace! How [G]sweet the [D]sound
`);

// Render to element
chordpro.renderToElement(chordproText, '#song-container');

// Get HTML string
const html = chordpro.renderToString(chordproText);
```
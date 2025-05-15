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
## Usage

### Direct include 

```html
<script src="https://cdn.jsdelivr.net/npm/chordprojs/dist/chordprojs.min.js"></script>
```

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

### Usage notes

_**See [DEVELOPMENT.md](DEVELOPMENT.md)**_

Include the library in your web page, for example:

```
<script src="https://cdn.jsdelivr.net/npm/chordprojs/dist/chordprojs.min.js"></script>
```
Add a container element in your HTML:
```
<div id="song-container"></div>
```
Use the above JavaScript to parse and render ChordPro text.

# Customizing Colors

You can change the colors of the page, text classes, and chords by overriding the default CSS. For example, in your HTML file or a custom stylesheet, add:

## Customizing Colors and Styling

You can easily customize the appearance of ChordproJS output by adding your own CSS styles. The library uses specific class names that you can target with your own style rules.

### Main CSS Classes

- `.chord-line` - Applied to chord lines (pre element)
- `.lyric-line` - Applied to lyric lines (pre element) 
- `.comment` - Applied to comment lines
- `.chorus` - Applied to the chorus container
- `.verse` - Applied to verse containers
- `.tab` - Applied to tab sections
- `.bridge` - Applied to bridge sections
- `.title` - Applied to the song title
- `.subtitle` - Applied to subtitles
- `.artist` - Applied to artist information

### Example: Basic Color Customization

```css
/* Custom chord color */
pre.chord-line {
    color: #0066cc;  /* Change chord color to blue */
    font-weight: bold;
}

/* Custom lyric styling */
pre.lyric-line {
    color: #333;  /* Darker text for lyrics */
    font-family: 'Arial', sans-serif;  /* Change font */
}

/* Custom styling for chorus sections */
.chorus {
    background-color: #f5f5f5;  /* Light gray background */
    border-left: 4px solid #0066cc;  /* Blue left border */
    padding-left: 10px;
    margin: 10px 0;
}

/* Custom styling for comments */
.comment {
    color: #6c757d;  /* Gray color for comments */
    font-style: italic;
}

/* Title styling */
.title {
    color: #d9534f;  /* Red color for title */
    font-size: 1.8em;
    font-weight: bold;
}

/* Artist styling */
.artist {
    color: #5cb85c;  /* Green for artist name */
    font-size: 1.2em;
}
```

### Example: Dark Theme

```
body {
    background-color: #282c34;
    color: #abb2bf;
}

pre.chord-line {
    color: #c678dd;  /* Purple for chords */
    font-weight: bold;
}

pre.lyric-line {
    color: #abb2bf;  /* Light gray for lyrics */
}

.chorus {
    background-color: #2c313a;
    border-left: 4px solid #61afef;  /* Blue highlight */
    padding: 8px 12px;
}

.comment {
    color: #98c379;  /* Green for comments */
}

.title {
    color: #e06c75;  /* Pink for title */
}

.subtitle {
    color: #d19a66;  /* Orange for subtitle */
}

#song-container {
    border: 1px solid #3e4451;
    padding: 20px;
}
```

### Advanced Example: Adding Hover Effects to Chords

```
pre.chord-line span {
    display: inline-block;
    padding: 0 4px;
    position: relative;
}

pre.chord-line span:hover {
    background-color: #ffeecc;
    border-radius: 3px;
    cursor: pointer;
    transform: translateY(-2px);
    transition: all 0.2s ease;
}

/* Add a tooltip with chord fingering information */
pre.chord-line span:hover::after {
    content: attr(data-chord);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 5px;
    border-radius: 3px;
    font-size: 0.8em;
    white-space: nowrap;
    z-index: 10;
}
```

## Applying Styles

You can add these styles to your page in various ways:

### In a \<style\> tag in your HTML:

```
<head>
    <style>
        pre.chord-line { color: #0066cc; font-weight: bold; }
        /* Additional styles... */
    </style>
</head>
```
### In an external CSS file:

```
<head>
    <link rel="stylesheet" href="my-chordpro-styles.css">
</head>
```

### Dynamically using JavaScript:

```
// After rendering
document.querySelectorAll('.chord-line').forEach(el => {
    el.style.color = '#0066cc';
});
```

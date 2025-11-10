# ChordproJS - JavaScript ChordPro Parser

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Supported ChordPro Directives](#supported-chordpro-directives)
- [Installation](#installation)
- [Usage](#usage)
  - [Direct Include](#direct-include)
  - [Usage Notes](#usage-notes)
- [Customizing Colors and Styling](#customizing-colors-and-styling)
  - [Main CSS Classes](#main-css-classes)
  - [Example: Basic Color Customization](#example-basic-color-customization)
  - [Example: Dark Theme](#example-dark-theme)
  - [Advanced Example: Adding Hover Effects to Chords](#advanced-example-adding-hover-effects-to-chords)
  - [Applying Styles](#applying-styles)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [Browser Support](#browser-support)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Support](#support)

## Overview

ChordproJS is a lightweight JavaScript library that parses and renders ChordPro-formatted song files into HTML. It
handles standard ChordPro syntax with zero dependencies, making it easy to integrate into any web application.

## Features

- Parses standard ChordPro syntax:
  - Title, subtitle, artist, key, and other directives
  - Environment tags (chorus, verse, bridge, tab, grid, etc.)
  - Chords in bracket notation `[C]` rendered above lyrics
  - Comments and other metadata
  - Chord diagrams and definitions
  - Transposition
  - Text formatting (highlight, italic, etc.)
  - Page and column breaks
- Flexible rendering:
  - To DOM elements via selector or direct element reference
  - As HTML string for further processing
- Full support for the ChordPro specification
- Zero dependencies
- Available as ES module and UMD builds

### Supported ChordPro Directives

This library provides comprehensive support for the ChordPro file format specification, including:

#### Meta-data directives

- `title` (short: `t`) - Song title
- `sorttitle` - Title for sorting purposes
- `subtitle` (short: `st`) - Song subtitle
- `artist` - Artist name
- `composer` - Composer name
- `lyricist` - Lyricist name
- `copyright` - Copyright information
- `album` - Album name
- `year` - Year of publication
- `key` - Song key
- `time` - Time signature
- `tempo` - Song tempo
- `duration` - Song duration
- `capo` - Capo position
- `meta` - Custom metadata

#### Formatting directives

- `comment` (short: `c`) - Plain comment
- `comment_italic` (short: `ci`) - Italic comment
- `comment_box` (short: `cb`) - Boxed comment
- `highlight` - Highlighted text
- `image` - Embedded image

#### Environment directives

- `start_of_chorus` (short: `soc`) / `end_of_chorus` (short: `eoc`) - Chorus section
- `chorus` - Reference to a previously defined chorus
- `start_of_verse` (short: `sov`) / `end_of_verse` (short: `eov`) - Verse section
- `start_of_bridge` (short: `sob`) / `end_of_bridge` (short: `eob`) - Bridge section
- `start_of_tab` (short: `sot`) / `end_of_tab` (short: `eot`) - Tab section
- `start_of_grid` (short: `sog`) / `end_of_grid` (short: `eog`) - Grid section

#### Delegated environment directives

- `start_of_abc` / `end_of_abc` - ABC notation
- `start_of_ly` / `end_of_ly` - LilyPond notation
- `start_of_svg` / `end_of_svg` - SVG content
- `start_of_textblock` / `end_of_textblock` - Text block

#### Chord diagrams

- `define` - Define a chord diagram
- `chord` - Display a chord diagram

#### Transposition

- `transpose` - Transpose chords by a number of semitones

#### Fonts, sizes and colours

- Various directives for controlling the appearance of different elements

#### Output related directives

- `new_page` (short: `np`) - Start a new page
- `new_physical_page` (short: `npp`) - Start a new physical page
- `column_break` (short: `colb`) - Start a new column
- `pagetype` - Set the page type
- `diagrams` - Show chord diagrams
- `grid` (short: `g`) - Show chord grid
- `no_grid` (short: `ng`) - Hide chord grid
- `titles` - Show titles
- `columns` (short: `col`) - Set number of columns

#### Conditional directives

- Support for directives with selectors (e.g., `{directive-selector: value}`)

#### Custom extensions

- Support for custom directives with the `x_` prefix

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

```javascript
// Create an instance
const chordpro = ChordproJS();

// Parse ChordPro text
const parsed = chordpro.parse(`
{title: Amazing Grace}
{subtitle: Traditional}
{artist: John Newton}
{key: G}
{capo: 2}

{start_of_verse: Verse 1}
[G]Amazing [D]grace! How [G]sweet the [D]sound
That [G]saved a [D]wretch like [G]me!
I [G]once was [D]lost, but [G]now am [D]found,
Was [G]blind, but [D]now I [G]see.
{end_of_verse}

{start_of_chorus}
[C]Praise [G]God, [D]praise [G]God,
[C]Praise God, [D]praise [G]God!
{end_of_chorus}
`);

// Render to element
chordpro.renderToElement(chordproText, "#song-container");

// Get HTML string
const html = chordpro.renderToHTML(chordproText);

// Using transposition
const transposedHtml = chordpro.parse(`
{title: Amazing Grace}
{transpose: 2}
[G]Amazing [D]grace! How [G]sweet the [D]sound
`);
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
- `.lyric-line-only` - Applied to lyric lines when chords are hidden
- `.comment` - Applied to comment lines
- `.comment-italic` - Applied to italic comment lines
- `.comment-box` - Applied to boxed comment lines
- `.highlight` - Applied to highlighted text
- `.section` - Applied to all section containers
- `.section-label` - Applied to section labels
- `.chorus` - Applied to chorus containers
- `.verse` - Applied to verse containers
- `.bridge` - Applied to bridge sections
- `.tab` - Applied to tab sections
- `.grid` - Applied to grid sections
- `.abc` - Applied to ABC notation sections
- `.ly` - Applied to LilyPond notation sections
- `.svg` - Applied to SVG content sections
- `.textblock` - Applied to text block sections
- `.chorus-ref` - Applied to chorus references
- `.chord-diagram` - Applied to chord diagrams
- `.chord-name` - Applied to chord names in diagrams
- `.chord-definition` - Applied to chord definitions in diagrams
- `.page-break` - Applied to page breaks
- `.physical-page-break` - Applied to physical page breaks
- `.column-break` - Applied to column breaks
- `.image` - Applied to image containers
- `.empty-line` - Applied to empty lines
- `.artist` - Applied to artist information
- `.key` - Applied to key information

### Example: Basic Color Customization

```css
/* Custom chord color */
pre.chord-line {
  color: #0066cc; /* Change chord color to blue */
  font-weight: bold;
}

/* Custom lyric styling */
pre.lyric-line {
  color: #333; /* Darker text for lyrics */
  font-family: "Arial", sans-serif; /* Change font */
}

/* Custom styling for chorus sections */
.chorus {
  background-color: #f5f5f5; /* Light gray background */
  border-left: 4px solid #0066cc; /* Blue left border */
  padding-left: 10px;
  margin: 10px 0;
}

/* Custom styling for comments */
.comment {
  color: #6c757d; /* Gray color for comments */
  font-style: italic;
}

/* Title styling */
.title {
  color: #d9534f; /* Red color for title */
  font-size: 1.8em;
  font-weight: bold;
}

/* Artist styling */
.artist {
  color: #5cb85c; /* Green for artist name */
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

## Contributing

We welcome contributions! Please see our [DEVELOPMENT.md](DEVELOPMENT.md) guide for detailed information on:

- Setting up your development environment
- Project architecture and design principles
- Coding standards and style guide
- Testing requirements
- Pull request process

### Quick Start for Contributors

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ChordproJSParser.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature`
5. Make your changes and add tests
6. Run tests: `npm test`
7. Run linter: `npm run lint`
8. Commit your changes with a descriptive message
9. Push to your fork and submit a pull request

### Reporting Issues

Found a bug or have a feature request? Please check [existing issues](https://github.com/bergbrains/ChordproJSParser/issues) first, then create a new issue with:

- Clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- ChordPro example that demonstrates the issue
- Your environment (browser, Node.js version, etc.)

## Documentation

- [API Documentation](API-index.md) - Complete API reference
- [Development Guide](DEVELOPMENT.md) - Architecture and contribution guidelines
- [Examples](examples/) - Working examples and demos
- [Changelog](CHANGELOG.md) - Version history and changes

## Browser Support

ChordproJS works in all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

For older browser support, transpile with Babel.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- ChordPro format specification: [https://www.chordpro.org/](https://www.chordpro.org/)
- Contributors and community members who help improve this library

## Support

- 📖 [Documentation](API-index.md)
- 💬 [Discussions](https://github.com/bergbrains/ChordproJSParser/discussions)
- 🐛 [Issue Tracker](https://github.com/bergbrains/ChordproJSParser/issues)
- 📧 Contact: [Create an issue](https://github.com/bergbrains/ChordproJSParser/issues/new)

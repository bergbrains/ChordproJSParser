# ChordproJS API Documentation

This document provides comprehensive API documentation for ChordproJS, a JavaScript library for parsing and rendering ChordPro-formatted song files.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Class: ChordproJS](#class-chordprojs)
  - [Constructor](#constructor)
  - [Methods](#methods)
- [Functions](#functions)
- [Plugins](#plugins)
- [Data Structures](#data-structures)
- [Examples](#examples)

## Installation

### npm

```bash
npm install chordprojs
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/chordprojs/dist/chordprojs.min.js"></script>
```

## Basic Usage

```javascript
// ES Module
import { ChordproJS } from 'chordprojs';
const chordpro = new ChordproJS();

// CommonJS
const { ChordproJS } = require('chordprojs');
const chordpro = new ChordproJS();

// Browser (UMD)
const chordpro = new ChordproJS();
```

## Class: ChordproJS

The main class for parsing and rendering ChordPro files.

### Constructor

```javascript
new ChordproJS([options])
```

Creates a new ChordproJS instance.

**Parameters:**

- `options` (Object, optional) - Configuration options
  - `showTitle` (Boolean, default: `true`) - Display song title
  - `showSubtitle` (Boolean, default: `true`) - Display song subtitle
  - `showChords` (Boolean, default: `true`) - Display chords above lyrics
  - `showComments` (Boolean, default: `true`) - Display comment lines
  - `transposeChords` (Function, optional) - Custom transpose function

**Returns:** ChordproJS instance

**Example:**

```javascript
const chordpro = new ChordproJS({
  showTitle: true,
  showChords: true,
  showComments: false
});
```

### Methods

#### parse(text)

Parse ChordPro formatted text into structured data.

**Parameters:**

- `text` (String) - ChordPro formatted text

**Returns:** Object - Parsed song data with structure:

```javascript
{
  title: String,
  subtitle: String,
  artist: String,
  key: String,
  sections: Array<Section>,
  metadata: Object
}
```

**Example:**

```javascript
const parsed = chordpro.parse(`
  {title: Amazing Grace}
  {artist: John Newton}
  {key: G}
  
  [G]Amazing [D]grace! How [G]sweet the sound
`);

console.log(parsed.title);  // "Amazing Grace"
console.log(parsed.artist); // "John Newton"
console.log(parsed.sections[0].lines[0].chords); // ["G", "D", "G"]
```

#### renderToElement(text, element)

Parse and render ChordPro text directly into a DOM element.

**Parameters:**

- `text` (String) - ChordPro formatted text
- `element` (HTMLElement | String) - Target DOM element or CSS selector

**Returns:** HTMLElement - The rendered element

**Throws:** Error - If the target element cannot be found

**Example:**

```javascript
// Using CSS selector
chordpro.renderToElement(chordproText, '#song-container');

// Using DOM element
const container = document.getElementById('song-container');
chordpro.renderToElement(chordproText, container);
```

#### renderToHTML(text)

Parse and render ChordPro text to an HTML string.

**Parameters:**

- `text` (String) - ChordPro formatted text

**Returns:** String - HTML representation of the song

**Example:**

```javascript
const html = chordpro.renderToHTML(`
  {title: My Song}
  [C]Hello [G]world
`);
console.log(html);
// Output: '<h1>My Song</h1><div class="section verse">...'
```

#### setOptions(options)

Update configuration options. Options are merged with existing options.

**Parameters:**

- `options` (Object) - New options to merge

**Returns:** ChordproJS - This instance for method chaining

**Example:**

```javascript
chordpro
  .setOptions({ showChords: false })
  .setOptions({ showComments: true })
  .renderToElement(text, '#container');
```

#### isChordPro(text)

Check if text appears to be in ChordPro format.

**Parameters:**

- `text` (String) - Text to check

**Returns:** Boolean - True if text appears to be ChordPro format

**Example:**

```javascript
chordpro.isChordPro('{title: My Song}'); // true
chordpro.isChordPro('[C]Hello world');   // true
chordpro.isChordPro('Plain text');       // false
```

#### use(pluginName[, options])

Apply a plugin to extend functionality.

**Parameters:**

- `pluginName` (String) - Name of registered plugin
- `options` (Object, optional) - Plugin-specific options

**Returns:** ChordproJS - This instance for method chaining

**Throws:** Error - If the plugin is not found

**Example:**

```javascript
ChordproJS.registerPlugin('transpose', transposePlugin);
chordpro.use('transpose');

// Now transpose is available
const transposed = chordpro.transpose('C', 2); // Returns 'D'
```

## Functions

### createChordproJS([options])

Factory function to create a ChordproJS instance without using `new`.

**Parameters:**

- `options` (Object, optional) - Configuration options (same as constructor)

**Returns:** ChordproJS instance

**Example:**

```javascript
import createChordproJS from 'chordprojs';

const chordpro = createChordproJS({ showChords: true });
```

### ChordproJS.registerPlugin(name, plugin)

Static method to register a plugin globally.

**Parameters:**

- `name` (String) - Plugin name (used with `.use()`)
- `plugin` (Object) - Plugin object
  - `install` (Function) - Installation function that receives `(chordproJS, options)`

**Example:**

```javascript
ChordproJS.registerPlugin('myPlugin', {
  install(chordproJS, options) {
    chordproJS.myMethod = function() {
      // Add functionality
    };
  }
});
```

## Plugins

### Transpose Plugin

The transpose plugin adds chord transposition functionality.

**Installation:**

```javascript
import { ChordproJS } from 'chordprojs';
import { transposePlugin } from 'chordprojs/plugins/transpose';

ChordproJS.registerPlugin('transpose', transposePlugin);
const chordpro = new ChordproJS();
chordpro.use('transpose');
```

**Methods Added:**

#### transpose(chord, semitones)

Transpose a chord by a specified number of semitones.

**Parameters:**

- `chord` (String) - The chord to transpose (e.g., "C", "Dm7", "Bb")
- `semitones` (Number) - Number of semitones to transpose (positive = up, negative = down)

**Returns:** String - The transposed chord

**Example:**

```javascript
chordpro.transpose('C', 2);   // Returns 'D'
chordpro.transpose('Am', 3);  // Returns 'Cm'
chordpro.transpose('G7', -2); // Returns 'F7'
```

**Using with {transpose} directive:**

```javascript
const html = chordpro.renderToHTML(`
  {title: My Song}
  {transpose: 2}
  [C]Hello [G]world
`);
// Chords will be automatically transposed to D and A
```

## Data Structures

### ParsedSong Object

The object returned by `parse()`:

```typescript
{
  title: string,           // Song title from {title} directive
  subtitle: string,        // Subtitle from {subtitle} directive
  artist: string,          // Artist from {artist} directive
  key: string,             // Musical key from {key} directive
  sections: Section[],     // Array of song sections
  metadata: {              // Additional metadata
    composer?: string,
    copyright?: string,
    capo?: string,
    transpose?: number,
    chords?: { [name: string]: string },
    // ... other metadata
  }
}
```

### Section Object

Each section in the `sections` array:

```typescript
{
  type: string,           // 'verse', 'chorus', 'bridge', 'tab', 'grid', etc.
  label?: string,         // Optional section label
  lines: Line[],          // Array of line objects
  content?: string,       // For delegated sections (abc, ly, svg, textblock)
}
```

### Line Object

Each line in a section's `lines` array can be one of:

**Chord Line:**
```typescript
{
  type: 'chordLine',
  lyrics: string,         // Lyrics with chords removed
  chords: string[],       // Array of chord names
  positions: number[]     // Position of each chord in lyrics
}
```

**Lyric Line:**
```typescript
{
  type: 'lyricLine',
  content: string         // Plain lyrics with no chords
}
```

**Comment:**
```typescript
{
  type: 'comment',
  content: string,
  format: 'plain' | 'italic' | 'box'
}
```

**Other line types:** `'empty'`, `'highlight'`, `'image'`, `'chorusRef'`, `'chord'`, `'pageBreak'`, `'physicalPageBreak'`, `'columnBreak'`

## Examples

### Complete Example

```javascript
import { ChordproJS } from 'chordprojs';

// Create instance
const chordpro = new ChordproJS({
  showChords: true,
  showComments: true
});

// Define ChordPro content
const content = `
{title: Amazing Grace}
{subtitle: Traditional}
{artist: John Newton}
{key: G}
{capo: 2}

{start_of_chorus}
[C]Amazing [G]grace! How [C]sweet the [G]sound
That [C]saved a [G]wretch like [C]me!
{end_of_chorus}

{start_of_verse: Verse 1}
I [C]once was [G]lost, but [C]now am [G]found,
Was [C]blind, but [G]now I [C]see.
{end_of_verse}
`;

// Render to DOM
chordpro.renderToElement(content, '#song-container');

// Or get HTML string
const html = chordpro.renderToHTML(content);
console.log(html);
```

### Transposition Example

```javascript
import { ChordproJS } from 'chordprojs';
import { transposePlugin } from 'chordprojs/plugins/transpose';

// Register and use transpose plugin
ChordproJS.registerPlugin('transpose', transposePlugin);
const chordpro = new ChordproJS();
chordpro.use('transpose');

// Transpose using directive
const content = `
{title: My Song}
{transpose: 2}
[C]Hello [G]world
`;

chordpro.renderToElement(content, '#song');
// Chords displayed as D and A

// Or transpose programmatically
const transposed = chordpro.transpose('C', 2);
console.log(transposed); // 'D'
```

### Custom Styling Example

```javascript
// Render song
chordpro.renderToElement(content, '#song-container');

// Add custom CSS
const style = document.createElement('style');
style.textContent = `
  .chord-line {
    color: #0066cc;
    font-weight: bold;
  }
  .chorus {
    background-color: #f5f5f5;
    border-left: 4px solid #0066cc;
    padding: 10px;
  }
`;
document.head.appendChild(style);
```

### Server-Side Rendering Example

```javascript
// Node.js server example
const { ChordproJS } = require('chordprojs');
const chordpro = new ChordproJS();

app.get('/song/:id', (req, res) => {
  const songContent = getSongFromDatabase(req.params.id);
  const html = chordpro.renderToHTML(songContent);
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="/chordpro-styles.css">
      </head>
      <body>
        <div id="song">${html}</div>
      </body>
    </html>
  `);
});
```

## CSS Classes

ChordproJS applies these CSS classes to rendered elements:

- `.chord-line` - Chord lines
- `.lyric-line` - Lyric lines
- `.lyric-line-only` - Lyrics when chords are hidden
- `.comment` - Comments
- `.comment-italic` - Italic comments
- `.comment-box` - Boxed comments
- `.highlight` - Highlighted text
- `.section` - All sections
- `.section-label` - Section labels
- `.chorus` - Chorus sections
- `.verse` - Verse sections
- `.bridge` - Bridge sections
- `.tab` - Tab sections
- `.grid` - Grid sections
- `.chorus-ref` - Chorus references
- `.chord-diagram` - Chord diagrams
- `.page-break` - Page breaks
- `.column-break` - Column breaks
- `.image` - Images
- `.artist` - Artist information
- `.key` - Key information

## Browser Support

ChordproJS supports all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

For older browser support, use a transpiler like Babel.

## License

See the main README for license information.

# AI Prompt to Generate the ChordproJS Parser Library

Use this prompt with an AI assistant to recreate the ChordproJS parser library:

---

**Prompt:**

Create a lightweight JavaScript ChordPro parser library called "ChordproJS" with the following specifications:

### Project Overview

- Develop a zero-dependency JavaScript library that parses and renders ChordPro-formatted text to HTML
- Create both ES module and UMD builds for maximum compatibility
- Design with modularity, allowing easy extension for advanced features
- Focus on clean, maintainable code with comprehensive documentation

### Core Features

1. **Parser functionality**:
   - Parse standard ChordPro directives including `{title}`, `{subtitle}`, `{artist}`, `{key}`, etc.
   - Support for chorus/verse sections with `{start_of_chorus}`, `{end_of_chorus}`, etc.
   - Handle chord notation in square brackets `[C]` placing them above lyrics
   - Parse comments and other metadata

2. **Rendering capabilities**:
   - Generate clean HTML with proper semantic structure
   - Support rendering to DOM elements via selector or direct element reference
   - Return HTML string for further processing
   - Use monospace font for chord/lyric alignment

3. **API design**:
   - Factory function pattern returning an object with methods
   - Simple API with core methods: `parse()`, `renderToElement()`, `renderToString()`
   - Support for configuration options

### Project Structure

```text
chordprojs/
├── dist/
│ ├── chordprojs.js
│ └── chordprojs.min.js
├── examples/
│ └── basic.html
├── src/
│ ├── index.js
│ ├── parser.js
│ └── renderer.js
├── tests/
│ └── chordprojs.test.js
├── package.json
├── README.md
├── DEVELOPMENT.md
└── LICENSE
```

### Build Setup

- Use Rollup for bundling both ES module and UMD formats
- Include Babel for transpilation
- Set up ESLint and Prettier for code consistency
- Add Jest for unit testing
- Configure npm scripts for development, testing and building

### Example API Usage

```javascript
// Create an instance
const chordpro = ChordproJS();

// Parse ChordPro text
const parsed = chordpro.parse(`
{title: Amazing Grace}
[G]Amazing [D]grace! How [G]sweet the [D]sound
`);

// Render to element
chordpro.renderToElement(chordproText, "#song-container");

// Get HTML string
const html = chordpro.renderToString(chordproText);
```

# CSS Styling

Provide basic styling with classes including:

- `.chord-line` for chord notation
- `.lyric-line` for lyrics
- `.comment` for comments
- Style headings for titles and metadata

## Documentation

Include detailed documentation covering:

- Installation methods
- API reference
- Usage examples
- Extension points for adding features like transposition
- Module architecture diagram showing parser/renderer flow

Please implement this library using modern JavaScript practices, focusing on clean code and excellent documentation. The final solution should be ready for direct use in web projects.

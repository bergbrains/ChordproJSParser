# AI Prompt to Generate the Complete ChordPro Renderer Project

Use this prompt with an AI assistant (like ChatGPT) to regenerate the entire ChordPro rendering solution from scratch:

---

**Prompt:**

Create a fully functional JavaScript-based ChordPro renderer web application with the following specifications:

### Project Overview

- Develop a lightweight, standalone JavaScript module to render ChordPro-formatted files dynamically into HTML.
- Ensure chords are aligned clearly above their corresponding lyrics using a monospace font.

### Core Features

- Parse and render essential ChordPro directives, including:
  - `{title}`, `{artist}`, `{comment}`, `{start_of_chorus}`, `{end_of_chorus}`, and similar common directives.
- Provide two methods for loading ChordPro files:
  - File picker to select local `.cho`, `.chopro`, or `.txt` files.
  - Text input to paste a URL and load remote ChordPro files via a button.
- Render output into a specified `div` or target HTML element.

### Files to Create

- `index.html`: Contains the file picker, URL input, load button, and target `div`.
- `chordpro-renderer.js`: JavaScript ES module implementing parsing and rendering logic.
- `style.css`: Default CSS to provide clean, readable formatting of rendered output.
- Comprehensive user documentation (`README.md`) clearly outlining usage and integration steps.
- Advanced customization documentation (`CUSTOMIZATION.md`) with details on tweaking parameters such as chord spacing,
  colors, and typography.

### Customization and Extensibility

- Ensure the solution allows easy CSS customization (chord colors, spacing, fonts).
- Provide clear guidelines for extending functionality (e.g., chord diagrams, additional ChordPro directives,
  transposition).
- Include diagrams or structured explanations illustrating internal logic and rendering flow.

### Technical Requirements

- Use plain JavaScript ES modules without external dependencies.
- Maintain clear, maintainable code with helpful comments and clean structure.
- Ensure compatibility with modern web browsers and easy integration into existing web projects.

### Output

- Provide complete and immediately usable HTML, JavaScript, CSS, and documentation files ready for integration and
  deployment.

Make the generated project production-ready, modular, and thoroughly documented for both end-users and developers.

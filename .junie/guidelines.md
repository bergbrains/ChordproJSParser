<!-- Source of truth: /Users/ericberg/work/Projects/global-ai-config/AGENTS.md -->
<!-- Apply global config first, then project-specific overrides below. -->
# Project Guidelines

This project is a ChordPro file parser and renderer for JavaScript. It supports standard ChordPro directives and renders them to HTML with CSS styling.

### 1. Build and Configuration Instructions

- **Main Build**: Use `npm run build` to generate the production bundles in the `dist/` directory. This project uses Rollup to create both Minified and ESM versions.
- **Development Mode**: Run `npm run dev` to start Rollup in watch mode for automatic rebuilding during development.
- **Serving Examples**: To test the library and examples (especially for Google Drive integration), run `npm run serve`. This starts a local web server (default port 3000) as required for security/authentication.
- **Linting**: Ensure code quality by running `npm run lint` (ESLint).

### 2. Testing Information

- **Test Framework**: The project uses **Jest** with `babel-jest` and `jest-environment-jsdom`.
- **Running Tests**:
  - Run all tests: `npm test`
  - Run specific test file: `npm test <path-to-test-file>`
  - Run in watch mode: `npx jest --watch`
- **Mocking**: CSS and style files are automatically mocked via `tests/mocks/styleMock.js`.
- **Test Structure**:
  - New tests should be placed in the `tests/` directory with the `.test.js` extension.
  - Since the renderer interacts with the DOM, tests usually require `jsdom` (already configured in `jest.config.js`).

#### Simple Test Example:
```javascript
// tests/demo.test.js
import { createChordproJS } from "../src/index";

describe("ChordproJS Demo", () => {
  test("should render a simple ChordPro title", () => {
    const chordpro = createChordproJS();
    const html = chordpro.renderToHTML("{title: Amazing Grace}");
    expect(html).toContain("<h1>Amazing Grace</h1>");
  });
});
```

### 3. Additional Development Information

- **Project Structure**:
  - `src/`: Contains core logic, parser, and renderer.
  - `src/core/parser.js`: Main ChordPro parsing logic.
  - `src/core/renderer.js`: Logic for generating HTML output.
  - `src/plugins/`: Extensible plugin system (e.g., transposition).
  - `dist/`: Build artifacts (not to be edited directly).
- **Code Style**:
  - The project uses **ES Modules** (`import`/`export`).
  - Follow existing patterns in `src/core/` for new features.
  - Use `createChordproJS()` factory for instantiating the main class.
- **Styling**: Rendered HTML relies on specific CSS classes (`chord-line`, `lyric-line`, `comment`). Refer to `style.css` for base styles.
- **Dependencies**: Keep dev dependencies updated via `package.json`. Major tools include Rollup, Babel, and Jest.

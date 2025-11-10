# ChordproJS Development Documentation

## Overview

This document provides development guidelines, architecture information, and contribution instructions for ChordproJS - a JavaScript library for parsing and rendering ChordPro-formatted song files.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Building](#building)
- [Contributing](#contributing)

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/bergbrains/ChordproJSParser.git
cd ChordproJSParser
npm install
```

### Development Server

Run the development server with hot reload:

```bash
npm run dev
```

This starts a local server at `http://localhost:3000` with live examples.

## Project Structure

```
ChordproJSParser/
├── src/
│   ├── core/
│   │   ├── parser.js       # ChordPro text parser
│   │   └── renderer.js     # HTML renderer
│   ├── plugins/
│   │   └── transpose.js    # Chord transposition plugin
│   └── index.js            # Main entry point and ChordproJS class
├── tests/
│   ├── parser.test.js      # Parser unit tests
│   ├── renderer.test.js    # Renderer unit tests
│   ├── transpose.test.js   # Transpose plugin tests
│   └── chordprojs.test.js  # Integration tests
├── examples/
│   ├── basic.html          # Basic usage example
│   ├── pick-files.html     # File picker example
│   └── songs/              # Example ChordPro files
├── dist/                   # Built distribution files
├── style.css               # Default styles
└── package.json

```

## Architecture

### Core Components

#### 1. Parser (`src/core/parser.js`)

The parser is responsible for converting ChordPro text into a structured JavaScript object.

**Key Functions:**
- `parseChordPro(text, options)` - Main parsing function

**Design Principles:**
- Pure function with no side effects
- Line-by-line processing for clarity
- Directive-based architecture matching ChordPro spec
- Handles all standard ChordPro directives

**Data Flow:**
```
ChordPro Text → Split Lines → Process Each Line → Structured Object
                                    ↓
                        ┌──────────────────────┐
                        │  Directive Handler   │
                        │  Chord Extractor     │
                        │  Section Manager     │
                        └──────────────────────┘
```

#### 2. Renderer (`src/core/renderer.js`)

The renderer converts parsed data into HTML.

**Key Functions:**
- `renderToElement(parsedData, element, options)` - Render to DOM
- `renderToHTML(parsedData, options)` - Render to HTML string
- `escapeHtml(text)` - Security sanitization

**Design Principles:**
- Separation of parsing and rendering concerns
- XSS protection via HTML escaping
- CSS class-based styling for flexibility
- Support for both DOM and string output

#### 3. Main Class (`src/index.js`)

The ChordproJS class provides the public API.

**Design Patterns:**
- Facade pattern - Simplified API over complex internals
- Plugin architecture for extensibility
- Method chaining for fluent API
- Factory function alternative to `new` keyword

### Plugin System

Plugins extend ChordproJS functionality without modifying core code.

**Plugin Structure:**
```javascript
export const myPlugin = {
  install(chordproJS, options) {
    // Add methods/properties to chordproJS instance
    chordproJS.myMethod = function() { ... };
    
    // Modify options
    chordproJS.options.myOption = options.myOption;
  }
};
```

**Registration:**
```javascript
ChordproJS.registerPlugin('myPlugin', myPlugin);
const chordpro = new ChordproJS();
chordpro.use('myPlugin', { myOption: true });
```

### Key Design Decisions

1. **Parser as Pure Function**: The parser doesn't mutate input and has no side effects, making it easier to test and reason about.

2. **Separate Transposition**: Transposition is handled in the renderer, not the parser. This keeps parsing deterministic and allows the same parsed data to be rendered with different transpositions.

3. **CSS-Based Styling**: The renderer applies semantic CSS classes instead of inline styles, giving users full control over appearance.

4. **Security First**: All user content is HTML-escaped before rendering to prevent XSS attacks.

5. **Zero Dependencies**: The core library has no runtime dependencies, keeping it lightweight and reducing security surface area.

## Development Workflow

### Code Style

The project uses ESLint for code quality:

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

**Code Style Guidelines:**
- Use ES6+ features (const/let, arrow functions, template literals)
- Prefer functional patterns over imperative
- Keep functions small and focused (single responsibility)
- Add JSDoc comments for all public APIs
- Write self-documenting code with clear variable names

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```
feat(parser): add support for custom directives
fix(renderer): escape HTML in chord diagrams
docs(api): update transpose plugin documentation
```

### Branch Strategy

- `main` - Stable releases
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

## Testing

### Running Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

### Test Structure

Tests are organized by module:

```javascript
// Example test structure
describe('ChordproJS', () => {
  describe('parse', () => {
    it('should parse title directive', () => {
      // Arrange
      const text = '{title: My Song}';
      const chordpro = new ChordproJS();
      
      // Act
      const result = chordpro.parse(text);
      
      // Assert
      expect(result.title).toBe('My Song');
    });
  });
});
```

### Writing Tests

**Testing Guidelines:**
1. Test behavior, not implementation
2. Use descriptive test names
3. Follow Arrange-Act-Assert pattern
4. Test edge cases and error conditions
5. Keep tests independent and isolated

**Coverage Goals:**
- Minimum 90% code coverage
- 100% coverage for security-critical functions (HTML escaping)
- Test all ChordPro directives

## Building

### Development Build

```bash
npm run build        # Build for production
npm run build:watch  # Watch mode for development
```

### Output Files

```
dist/
├── chordprojs.min.js     # UMD bundle (browser)
└── chordprojs.esm.js     # ES module bundle
```

### Build Configuration

The project uses Rollup for bundling:

```javascript
// rollup.config.js
export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/chordprojs.esm.js',
      format: 'es'
    },
    {
      file: 'dist/chordprojs.min.js',
      format: 'umd',
      name: 'ChordproJS'
    }
  ]
};
```

## Contributing

### Getting Help

- Check existing [issues](https://github.com/bergbrains/ChordproJSParser/issues)
- Read the [API documentation](API-index.md)
- Review [examples](examples/)

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Write tests for your changes
4. Implement your changes
5. Ensure all tests pass (`npm test`)
6. Lint your code (`npm run lint`)
7. Commit with conventional commit message
8. Push to your fork
9. Open a Pull Request

### PR Guidelines

**Good PR:**
- Focused on a single feature or fix
- Includes tests
- Updates documentation
- Passes all CI checks
- Has descriptive title and description

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
How were these changes tested?

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Lint checks pass
- [ ] All tests pass
```

### Code Review Process

1. Automated checks run (lint, test, build)
2. Maintainers review code
3. Address feedback
4. Approval and merge

## Debugging

### Common Issues

**Problem:** Tests failing after changes
```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

**Problem:** Build errors
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

**Problem:** Linting errors
```bash
# Auto-fix most issues
npm run lint:fix
```

### Debug Mode

Enable verbose logging:

```javascript
const chordpro = new ChordproJS({ debug: true });
```

## Performance

### Optimization Guidelines

1. **Parser Performance:**
   - Process lines sequentially (don't load entire file into memory multiple times)
   - Use regex sparingly and cache compiled patterns
   - Avoid deep object nesting

2. **Renderer Performance:**
   - Minimize DOM operations by building HTML string first
   - Use CSS classes instead of inline styles
   - Avoid layout thrashing in DOM rendering

3. **Bundle Size:**
   - Keep core library under 50KB minified
   - Use tree-shaking friendly exports
   - Avoid unnecessary dependencies

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Build distribution files
5. Create git tag
6. Publish to npm
7. Create GitHub release

```bash
npm version patch|minor|major
npm test
npm run build
git push --tags
npm publish
```

## Resources

- [ChordPro Specification](https://www.chordpro.org/chordpro/)
- [API Documentation](API-index.md)
- [Examples](examples/)
- [Issue Tracker](https://github.com/bergbrains/ChordproJSParser/issues)

## License

See [LICENSE](LICENSE) file for details.

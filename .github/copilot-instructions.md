# GitHub Copilot Instructions for ChordproJSParser

## Project Overview

ChordproJS is a lightweight JavaScript library that parses and renders ChordPro-formatted song files into HTML. It handles standard ChordPro syntax with zero dependencies, making it easy to integrate into any web application.

**Key Features:**
- Parses standard ChordPro syntax (directives, chords, lyrics, metadata)
- Flexible rendering (DOM elements or HTML strings)
- Full support for ChordPro specification
- Zero runtime dependencies
- Available as ES module and UMD builds

## Technology Stack

- **Language:** JavaScript (ES6+)
- **Build Tool:** Rollup
- **Testing Framework:** Jest
- **Linting:** ESLint with Prettier
- **Package Manager:** npm

## Repository Structure

```
src/
  core/           - Core parsing and rendering logic
    parser.js     - ChordPro format parser
    renderer.js   - HTML renderer
  plugins/        - Plugin modules (e.g., transpose)
  index.js        - Main entry point
tests/            - Jest test files
dist/             - Built files (do not edit directly)
examples/         - Example usage files
scripts/          - Build and utility scripts
```

## Development Workflow

### Setting Up

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Run linter: `npm run lint`
4. Build the project: `npm run build`

### Pre-commit Hooks

We use pre-commit hooks that automatically run:
- ESLint for JavaScript linting
- Prettier for code formatting
- Jest tests
- Basic file checks (size, merge conflicts, YAML/JSON validation)
- GitHub workflow validation

To install pre-commit hooks locally: `pip install pre-commit && pre-commit install`

## Code Style and Standards

### JavaScript Standards

- **Quotes:** Use single quotes for strings
- **Semicolons:** Always use semicolons
- **Indentation:** 2 spaces
- **Trailing Commas:** No trailing commas
- **Unused Variables:** Should be avoided (triggers warnings)
- **Console Statements:** Should be avoided in production code

### ESLint Configuration

We use ESLint with the recommended configuration and Prettier integration. Code should work across:
- Browser environments
- Node.js environments
- Jest test environments

## Testing Guidelines

- **Framework:** Jest
- **Location:** All tests go in the `tests/` directory with `.test.js` extension
- **Coverage:** We aim for high code coverage (currently ~97%)
- **New Features:** All new code MUST include appropriate tests
- **ChordPro Directives:** Each directive implementation must have a corresponding test

### Running Tests

```bash
npm test                 # Run all tests
npm test -- --coverage   # Run with coverage report
```

## ChordPro Specification

ChordPro is a text file format for representing lyrics with chords. Directives start with `{` and define song structure and metadata.

**Reference Documentation:**
- [WorshipTools ChordPro Directives](https://www.worshiptools.com/en-us/docs/125-cp-directives)
- [SongBook Pro ChordPro Manual](https://songbook-pro.com/docs/manual/chordpro/)

When implementing new ChordPro directives:
1. Consult the official specification
2. Add parsing logic in `src/core/parser.js`
3. Add rendering logic in `src/core/renderer.js`
4. Create comprehensive tests in `tests/`

## Build Process

### Build Configuration

- **Tool:** Rollup (configuration in `rollup.config.js`)
- **Entry Point:** `src/index.js`
- **Output Formats:**
  - UMD bundle: `dist/chordprojs.min.js`
  - ES module: `dist/chordprojs.esm.js`
  - CSS: `dist/chordprojs.min.css`
  - TypeScript types: `dist/types/index.d.ts`

### Build Commands

```bash
npm run build    # Build for production
npm run dev      # Build with watch mode
```

## Common Tasks

### Adding a New ChordPro Directive

1. Research the directive in the ChordPro specification
2. Add parsing logic in `src/core/parser.js`
3. Add rendering logic in `src/core/renderer.js`
4. Write tests in `tests/parser.test.js` and/or `tests/renderer.test.js`
5. Update documentation if it's a user-facing feature
6. Run `npm test` to verify
7. Run `npm run lint` to ensure code style

### Fixing a Bug

1. Write a failing test that demonstrates the bug
2. Fix the issue with minimal changes
3. Ensure all tests pass
4. Run linter to verify code style
5. Update documentation if behavior changes

### Improving Performance

1. Profile the code to identify bottlenecks
2. Make targeted improvements
3. Add or update tests to prevent regressions
4. Verify tests still pass
5. Document any API changes

## Important Notes

### What NOT to Commit

- `node_modules/` - Dependencies (excluded via .gitignore)
- Temporary files or build artifacts not in `dist/`
- IDE-specific configuration files
- Personal credentials or API keys

### Backward Compatibility

- Maintain backward compatibility when possible
- If breaking changes are necessary, document them clearly
- Consider deprecation warnings before removing features

### Dependencies

- **Runtime Dependencies:** Keep at zero (current: minimal)
- **Dev Dependencies:** Only add when necessary for development/testing
- **Justification:** Always provide a clear reason for new dependencies

## Documentation

### Files to Update

- `README.md` - User-facing features and usage examples
- `DEVELOPMENT.md` - Developer setup and internal architecture
- `API-index.md` - API reference (if applicable)
- `CHANGELOG.md` - Version history and changes

### Documentation Standards

- Use clear, concise language
- Include code examples for new features
- Keep formatting consistent with existing docs
- Update examples when APIs change

## CI/CD

### GitHub Actions

- **Workflow:** `.github/workflows/pre-commit.yml`
- **Triggers:** Pull requests and pushes to main
- **Checks:** Pre-commit hooks, tests, linting
- **Requirement:** All checks must pass before merging

## Getting Help

### Key Resources

- **Repository:** https://github.com/bergbrains/ChordproJSParser
- **Issues:** GitHub Issues for bug reports and feature requests
- **ChordPro Spec:** Reference documentation linked above

### Coding Questions

- Check existing tests for patterns and examples
- Review similar features in the codebase
- Consult the ChordPro specification for directive details

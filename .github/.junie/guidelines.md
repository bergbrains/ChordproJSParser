# ChordPro JS Renderer Development Guidelines

This document outlines the development guidelines and best practices for contributing to the ChordPro JS Renderer project.

## Project Overview

The ChordPro JS Renderer is a JavaScript module designed to easily integrate ChordPro-formatted song files into any web application. It parses standard ChordPro files and dynamically renders them into HTML, allowing customizable styling through CSS.

## ChordPro Specification

ChordPro is a text file format for representing lyrics with chords. The format uses directives (commands that start with {) to define song structure and metadata.

For comprehensive information about the ChordPro specification, refer to these resources:

- [WorshipTools ChordPro Directives Documentation](https://www.worshiptools.com/en-us/docs/125-cp-directives)
- [SongBook Pro ChordPro Manual](https://songbook-pro.com/docs/manual/chordpro/)

When implementing ChordPro directives in this project, ensure each directive has a corresponding test to verify its functionality.

## Development Environment Setup

1. Ensure you have Node.js installed (version specified in package.json)
2. Clone the repository
3. Install dependencies with `npm install`
4. Run tests with `npm test`
5. Build the project with `npm run build`

## Code Style and Standards

We follow specific coding standards to maintain consistency across the codebase:

### JavaScript

- We use ESLint with the recommended configuration and Prettier for code formatting
- Code should work in browser, Node.js, and Jest environments
- Follow these specific rules:
  - Use single quotes for strings
  - Always use semicolons
  - Use 2 spaces for indentation
  - No trailing commas
  - Unused variables and console statements should be avoided (will trigger warnings)

### Pre-commit Hooks

We use pre-commit hooks to ensure code quality. These hooks run automatically when you commit code and include:

- Basic checks (file size, merge conflicts, YAML/JSON validation)
- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- Jest tests
- GitHub workflow validation

To install pre-commit hooks locally, run:

```
pip install pre-commit
pre-commit install
```

## Testing

- All code should be tested using Jest
- Tests should be placed in the `tests` directory with the `.test.js` extension
- We aim for high code coverage - all new code should include appropriate tests
- Run tests with `npm test`

## Build Process

We use Rollup for bundling the project:

- Entry point: `src/index.js`
- Output formats:
  - UMD bundle: `dist/chordprojs.min.js`
  - ES module: `dist/chordprojs.esm.js`
  - CSS: `dist/chordprojs.min.css`

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request to the main branch
6. Wait for code review and address any feedback

## Continuous Integration

We use GitHub Actions for continuous integration:

- Pre-commit checks run on all pull requests and pushes to main
- Tests must pass before merging

## Project Structure

- `src/`: Source code
- `tests/`: Test files
- `dist/`: Built files (do not edit directly)
- `examples/`: Example usage
- `scripts/`: Build and utility scripts

## Feature Development

When developing new features:

1. Ensure they align with the project's purpose
2. Maintain backward compatibility when possible
3. Document new features thoroughly
4. Include appropriate tests

## License

This project is licensed under the MIT License. All contributions will be under the same license.

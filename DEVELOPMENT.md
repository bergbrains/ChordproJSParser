# ChordproJS Development Guide

This guide covers everything you need to know about developing, testing, and managing the ChordproJS application lifecycle.

## Environment Setup

1.  Ensure you have **Node.js (LTS)** installed.
2.  Install project dependencies:
    ```bash
    npm install
    ```

## Lifecycle Management

We use a `Makefile` to provide a unified interface for managing the application. You can run `make help` to see all available commands.

### Development Mode (Local)

To start the library in development mode with live reloading:
```bash
make dev
```
- **Port:** 3000
- **Watch:** Yes (Rollup watch)
- **Host:** http://localhost:3000/examples/

This uses `rollup-plugin-serve` and `rollup-plugin-livereload` to automatically rebuild and refresh your browser when changes are detected in `src/`.

### Production Preview (Local)

To build the production bundles and serve them locally:
```bash
make preview
```
- **Port:** 3000
- **Watch:** No
- **Host:** http://localhost:3000/examples/

### Containerized Execution (Docker)

To run the application inside a container (using Nginx):
```bash
make docker-up
```
- **Port:** 8080 (Mapped from 80)
- **Host:** http://localhost:8080/examples/

To stop and clean up:
```bash
make docker-down
```

### Stopping Processes

If you need to forcefully stop any processes running on the default ports:
```bash
make stop
```

## Build System

We use **Rollup** for building the project.
- `make build` generates:
  - `dist/chordprojs.min.js` (UMD bundle)
  - `dist/chordprojs.esm.js` (ES Module bundle)
  - `dist/chordprojs.min.css` (Extracted CSS)

## Testing and Quality

### Unit Tests
We use **Jest** for unit testing.
```bash
make test
```

### Linting
We use **ESLint** for code style and quality.
```bash
make lint
```

## Internal Architecture

The module exports a `ChordproJS` constructor that provides:
- `parse(text)`: Parses ChordPro text into an internal structure.
- `renderToElement(text, selectorOrElement)`: Renders directly into a DOM element.
- `renderToHTML(text)`: Returns the rendered HTML as a string.

For more details on the API, see the [README.md](README.md).

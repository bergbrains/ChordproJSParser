// tests/debug.js
import { parseChordPro } from "../src/core/parser.js";

// Test diagrams directive with empty value
const diagramsText = "{diagrams:}";
const diagramsResult = parseChordPro(diagramsText);
console.log("Diagrams test:", diagramsResult.metadata.diagrams);

// Test grid directive with empty value
const gridText = "{g:}";
const gridResult = parseChordPro(gridText);
console.log("Grid test:", gridResult.metadata.grid);

// Test no_grid directive
const noGridText = "{grid: true}\n{no_grid:}";
const noGridResult = parseChordPro(noGridText);
console.log("No grid test:", noGridResult.metadata.grid);

// Test abbreviated no_grid directive
const ngText = "{grid: true}\n{ng:}";
const ngResult = parseChordPro(ngText);
console.log("NG test:", ngResult.metadata.grid);

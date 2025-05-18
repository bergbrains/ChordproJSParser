// src/core/parser.js
/**
 * Parse ChordPro formatted text into structured data
 * @param {string} text - ChordPro formatted text
 * @param {object} options - Parsing options
 * @returns {object} Structured song data
 */
function parseChordPro(text, options = {}) {
  const lines = text.split("\n");
  const song = {
    title: "",
    subtitle: "",
    artist: "",
    key: "",
    sections: [],
    metadata: {},
  };

  let currentSection = {
    type: "verse",
    lines: [],
  };

  song.sections.push(currentSection);

  lines.forEach((line) => {
    // Process directives (metadata)
    if (line.trim().match(/^\{([^:}]+)(?::([^}]+))?\}$/)) {
      const matches = line.trim().match(/^\{([^:}]+)(?::([^}]+))?\}$/);
      const directive = matches[1].trim().toLowerCase();
      const value = matches[2] ? matches[2].trim() : "";

      // Parse directive attributes if present
      let attributes = {};
      if (value && value.includes("=")) {
        // Extract attributes in HTML-like format
        const attrRegex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(value)) !== null) {
          attributes[attrMatch[1]] = attrMatch[2];
        }
      }

      // Handle conditional directives
      let baseDirective = directive;
      if (directive.includes("-")) {
        const parts = directive.split("-");
        baseDirective = parts[0];
        parts[1];
        // For now, we'll process all conditional directives
        // In a full implementation, we would check the condition against config
      }

      switch (baseDirective) {
        // Meta-data directives
        case "title":
        case "t":
          song.title = value;
          break;
        case "sorttitle":
          song.metadata.sorttitle = value;
          break;
        case "subtitle":
        case "st":
          song.subtitle = value;
          break;
        case "artist":
          song.artist = value;
          break;
        case "composer":
          song.metadata.composer = value;
          break;
        case "lyricist":
          song.metadata.lyricist = value;
          break;
        case "copyright":
          song.metadata.copyright = value;
          break;
        case "album":
          song.metadata.album = value;
          break;
        case "year":
          song.metadata.year = value;
          break;
        case "key":
          song.key = value;
          break;
        case "time":
          song.metadata.time = value;
          break;
        case "tempo":
          song.metadata.tempo = value;
          break;
        case "duration":
          song.metadata.duration = value;
          break;
        case "capo":
          song.metadata.capo = value;
          break;
        case "meta":
          // Handle meta with attributes
          if (Object.keys(attributes).length > 0) {
            for (const [key, val] of Object.entries(attributes)) {
              song.metadata[key] = val;
            }
          }
          break;

        // Formatting directives
        case "comment":
        case "c":
          currentSection.lines.push({
            type: "comment",
            content: value,
            format: "plain",
          });
          break;
        case "comment_italic":
        case "ci":
          currentSection.lines.push({
            type: "comment",
            content: value,
            format: "italic",
          });
          break;
        case "comment_box":
        case "cb":
          currentSection.lines.push({
            type: "comment",
            content: value,
            format: "box",
          });
          break;
        case "highlight":
          currentSection.lines.push({
            type: "highlight",
            content: value,
          });
          break;
        case "image":
          currentSection.lines.push({
            type: "image",
            src: attributes.src || value,
            scale: attributes.scale || "100%",
          });
          break;

        // Environment directives
        case "start_of_chorus":
        case "soc":
          currentSection = {
            type: "chorus",
            lines: [],
            label: attributes.label || value || "",
          };
          song.sections.push(currentSection);
          break;
        case "end_of_chorus":
        case "eoc":
          currentSection = {
            type: "verse",
            lines: [],
          };
          song.sections.push(currentSection);
          break;
        case "chorus":
          // Reference to a previously defined chorus
          currentSection.lines.push({
            type: "chorusRef",
            label: value,
          });
          break;
        case "start_of_verse":
        case "sov":
          currentSection = {
            type: "verse",
            lines: [],
            label: attributes.label || value || "",
          };
          song.sections.push(currentSection);
          break;
        case "end_of_verse":
        case "eov":
          currentSection = {
            type: "verse",
            lines: [],
          };
          song.sections.push(currentSection);
          break;
        case "start_of_bridge":
        case "sob":
          currentSection = {
            type: "bridge",
            lines: [],
            label: attributes.label || value || "",
          };
          song.sections.push(currentSection);
          break;
        case "end_of_bridge":
        case "eob":
          currentSection = {
            type: "verse",
            lines: [],
          };
          song.sections.push(currentSection);
          break;
        case "start_of_tab":
        case "sot":
          currentSection = {
            type: "tab",
            lines: [],
            label: attributes.label || value || "",
          };
          song.sections.push(currentSection);
          break;
        case "end_of_tab":
        case "eot":
          currentSection = {
            type: "verse",
            lines: [],
          };
          song.sections.push(currentSection);
          break;
        case "start_of_grid":
        case "sog":
          currentSection = {
            type: "grid",
            lines: [],
            label: attributes.label || value || "",
          };
          song.sections.push(currentSection);
          break;
        case "end_of_grid":
        case "eog":
          currentSection = {
            type: "verse",
            lines: [],
          };
          song.sections.push(currentSection);
          break;

        // Delegated environment directives
        case "start_of_abc":
        case "start_of_ly":
        case "start_of_svg":
        case "start_of_textblock":
          currentSection = {
            type: baseDirective.replace("start_of_", ""),
            lines: [],
            content: "",
            inProgress: true,
          };
          song.sections.push(currentSection);
          break;
        case "end_of_abc":
        case "end_of_ly":
        case "end_of_svg":
        case "end_of_textblock":
          if (currentSection.inProgress) {
            currentSection.inProgress = false;
          }
          currentSection = {
            type: "verse",
            lines: [],
          };
          song.sections.push(currentSection);
          break;

        // Chord diagrams
        case "define":
          const chordMatch = value.match(/^(\S+)\s+(.*)$/);
          if (chordMatch) {
            const chordName = chordMatch[1];
            const chordDef = chordMatch[2];
            if (!song.metadata.chords) {
              song.metadata.chords = {};
            }
            song.metadata.chords[chordName] = chordDef;
          }
          break;
        case "chord":
          currentSection.lines.push({
            type: "chord",
            name: value,
          });
          break;

        // Transposition
        case "transpose":
          song.metadata.transpose = parseInt(value, 10) || 0;
          break;

        // Font, size, and color directives
        case "chordfont":
        case "cf":
        case "chordsize":
        case "cs":
        case "chordcolour":
        case "chorusfont":
        case "chorussize":
        case "choruscolour":
        case "footerfont":
        case "footersize":
        case "footercolour":
        case "gridfont":
        case "gridsize":
        case "gridcolour":
        case "tabfont":
        case "tabsize":
        case "tabcolour":
        case "labelfont":
        case "labelsize":
        case "labelcolour":
        case "tocfont":
        case "tocsize":
        case "toccolour":
        case "textfont":
        case "tf":
        case "textsize":
        case "ts":
        case "textcolour":
        case "titlefont":
        case "titlesize":
        case "titlecolour":
          // Store formatting directives in metadata
          const category = baseDirective.replace(/font|size|colour/g, "");
          const property = baseDirective.replace(category, "");
          if (!song.metadata.formatting) {
            song.metadata.formatting = {};
          }
          if (!song.metadata.formatting[category]) {
            song.metadata.formatting[category] = {};
          }
          song.metadata.formatting[category][property] = value;
          break;

        // Output related directives
        case "new_song":
        case "ns":
          // Start a new song - not handling multiple songs in one file for now
          break;
        case "new_page":
        case "np":
          currentSection.lines.push({
            type: "pageBreak",
          });
          break;
        case "new_physical_page":
        case "npp":
          currentSection.lines.push({
            type: "physicalPageBreak",
          });
          break;
        case "column_break":
        case "colb":
          currentSection.lines.push({
            type: "columnBreak",
          });
          break;
        case "pagetype":
          song.metadata.pagetype = value;
          break;
        case "diagrams":
          song.metadata.diagrams =
            value.toLowerCase() === "true" || value === "";
          break;
        case "grid":
        case "g":
          song.metadata.grid = value.toLowerCase() === "true" || value === "";
          break;
        case "no_grid":
        case "ng":
          song.metadata.grid = false;
          break;
        case "titles":
          song.metadata.titles = value.toLowerCase() === "true" || value === "";
          break;
        case "columns":
        case "col":
          song.metadata.columns = parseInt(value, 10) || 1;
          break;

        // Custom extensions
        default:
          // Handle x_ prefixed directives without warnings
          if (baseDirective.startsWith("x_")) {
            song.metadata[baseDirective] = value;
          } else {
            // Store unknown directives in metadata
            song.metadata[baseDirective] = value;
            // In a production environment, you might want to log a warning here
          }
      }
    }
    // Process chord lines
    else if (line.includes("[") && line.includes("]")) {
      const chords = [];
      const positions = [];

      // Extract chords and their positions
      let lyrics = line;
      const chordRegex = /\[([^\]]+)\]/g;
      let match;
      let offset = 0;

      while ((match = chordRegex.exec(line)) !== null) {
        chords.push(match[1]);
        positions.push(match.index - offset);
        offset += match[0].length;
        lyrics = lyrics.replace(match[0], "");
      }

      currentSection.lines.push({
        type: "chordLine",
        lyrics: lyrics,
        chords: chords,
        positions: positions,
      });
    }
    // Process empty lines
    else if (line.trim() === "") {
      currentSection.lines.push({
        type: "empty",
      });
    }
    // Process regular lyrics lines
    else {
      currentSection.lines.push({
        type: "lyricLine",
        content: line,
      });
    }
  });

  return song;
}

// src/core/renderer.js
/**
 * Render parsed ChordPro data to an HTML element
 * @param {object} parsedData - Data returned from parseChordPro
 * @param {HTMLElement|string} element - Target DOM element or selector
 * @param {object} options - Rendering options
 * @returns {HTMLElement} The rendered element
 */
function renderToElement(parsedData, element, options = {}) {
  if (typeof element === "string") {
    element = document.querySelector(element);
  }

  if (!element) {
    throw new Error("Invalid target element");
  }

  element.innerHTML = renderToHTML(parsedData, options);
  return element;
}

/**
 * Render parsed ChordPro data to HTML string
 * @param {object} parsedData - Data returned from parseChordPro
 * @param {object} options - Rendering options
 * @returns {string} HTML representation
 */
function renderToHTML(parsedData, options = {}) {
  const defaults = {
    showTitle: true,
    showSubtitle: true,
    showChords: true,
    showComments: true,
  };

  const settings = { ...defaults, ...options };
  let html = "";

  // Render title and subtitle
  if (settings.showTitle && parsedData.title) {
    html += `<h1>${escapeHtml(parsedData.title)}</h1>`;
  }

  if (settings.showSubtitle && parsedData.subtitle) {
    html += `<h2>${escapeHtml(parsedData.subtitle)}</h2>`;
  }

  if (parsedData.artist) {
    html += `<div class="artist">${escapeHtml(parsedData.artist)}</div>`;
  }

  if (parsedData.key) {
    html += `<div class="key">Key: ${escapeHtml(parsedData.key)}</div>`;
  }

  // Apply transposition if needed
  if (
    parsedData.metadata &&
    parsedData.metadata.transpose &&
    typeof settings.transposeChords === "function"
  ) {
    const transposeValue = parseInt(parsedData.metadata.transpose, 10);
    if (!isNaN(transposeValue)) {
      parsedData.sections.forEach((section) => {
        section.lines.forEach((line) => {
          if (line.type === "chordLine" && line.chords) {
            line.chords = line.chords.map((chord) =>
              settings.transposeChords(chord, transposeValue),
            );
          }
        });
      });
    }
  }

  // Render sections
  parsedData.sections.forEach((section) => {
    // Handle section type
    switch (section.type) {
      case "chorus":
        html += '<div class="section chorus">';
        if (section.label) {
          html += `<div class="section-label">${escapeHtml(
            section.label,
          )}</div>`;
        }
        break;
      case "bridge":
        html += '<div class="section bridge">';
        if (section.label) {
          html += `<div class="section-label">${escapeHtml(
            section.label,
          )}</div>`;
        }
        break;
      case "tab":
        html += '<div class="section tab">';
        if (section.label) {
          html += `<div class="section-label">${escapeHtml(
            section.label,
          )}</div>`;
        }
        break;
      case "grid":
        html += '<div class="section grid">';
        if (section.label) {
          html += `<div class="section-label">${escapeHtml(
            section.label,
          )}</div>`;
        }
        break;
      case "abc":
      case "ly":
      case "svg":
      case "textblock":
        html += `<div class="section ${section.type}">`;
        // For delegated environments, we would normally process the content
        // and embed the result. For now, we'll just display it as pre-formatted text.
        if (section.content) {
          html += `<pre class="${section.type}-content">${escapeHtml(
            section.content,
          )}</pre>`;
        }
        break;
      case "verse":
      default:
        html += '<div class="section verse">';
        if (section.label) {
          html += `<div class="section-label">${escapeHtml(
            section.label,
          )}</div>`;
        }
        break;
    }

    section.lines.forEach((line) => {
      switch (line.type) {
        case "comment":
          if (settings.showComments) {
            if (line.format === "italic") {
              html += `<div class="comment comment-italic">${escapeHtml(
                line.content,
              )}</div>`;
            } else if (line.format === "box") {
              html += `<div class="comment comment-box">${escapeHtml(
                line.content,
              )}</div>`;
            } else {
              html += `<div class="comment">${escapeHtml(line.content)}</div>`;
            }
          }
          break;

        case "highlight":
          html += `<div class="highlight">${escapeHtml(line.content)}</div>`;
          break;

        case "image":
          html += `<div class="image"><img src="${escapeHtml(
            line.src,
          )}" style="max-width: ${escapeHtml(
            line.scale,
          )};" alt="ChordPro Image" /></div>`;
          break;

        case "chordLine":
          if (settings.showChords) {
            // Create chord line
            let chordLine = "";
            line.lyrics;
            const chords = line.chords;
            const positions = line.positions;

            // Insert spaces before each chord position
            let lastPos = 0;
            for (let i = 0; i < chords.length; i++) {
              const spaces = positions[i] - lastPos;
              chordLine += " ".repeat(Math.max(0, spaces)) + chords[i];
              lastPos = positions[i] + chords[i].length;
            }

            html += `<pre class="chord-line">${escapeHtml(chordLine)}</pre>`;
            html += `<pre class="lyric-line">${escapeHtml(line.lyrics)}</pre>`;
          } else {
            html += `<div class="lyric-line-only">${escapeHtml(
              line.lyrics,
            )}</div>`;
          }
          break;

        case "lyricLine":
          html += `<div class="lyric-line">${escapeHtml(line.content)}</div>`;
          break;

        case "chorusRef":
          html += `<div class="chorus-ref">Chorus${
            line.label ? ": " + escapeHtml(line.label) : ""
          }</div>`;
          break;

        case "chord":
          if (
            parsedData.metadata &&
            parsedData.metadata.chords &&
            parsedData.metadata.chords[line.name]
          ) {
            html += `<div class="chord-diagram">
              <div class="chord-name">${escapeHtml(line.name)}</div>
              <div class="chord-definition">${escapeHtml(
                parsedData.metadata.chords[line.name],
              )}</div>
            </div>`;
          } else {
            html += `<div class="chord-diagram">
              <div class="chord-name">${escapeHtml(line.name)}</div>
            </div>`;
          }
          break;

        case "pageBreak":
          html += '<div class="page-break"></div>';
          break;

        case "physicalPageBreak":
          html += '<div class="physical-page-break"></div>';
          break;

        case "columnBreak":
          html += '<div class="column-break"></div>';
          break;

        case "empty":
          html += '<div class="empty-line">&nbsp;</div>';
          break;
      }
    });

    html += "</div>"; // End section
  });

  return html;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// src/index.js

/**
 * Main ChordproJS class
 */
class ChordproJS {
  /**
   * Create a ChordproJS instance
   * @param {object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      showTitle: true,
      showSubtitle: true,
      showChords: true,
      showComments: true,
      // Add transposeChords function placeholder
      transposeChords: null,
      ...options,
    };

    // Auto-register the transpose plugin if available
    if (ChordproJS.plugins.transpose) {
      this.use("transpose");
    }
  }

  /**
   * Parse ChordPro text into structured data
   * @param {string} text - ChordPro formatted text
   * @returns {object} Parsed song data
   */
  parse(text) {
    return parseChordPro(text, this.options);
  }

  /**
   * Render ChordPro text to an HTML element
   * @param {string} text - ChordPro formatted text
   * @param {HTMLElement|string} element - Target DOM element or selector
   * @returns {HTMLElement} The rendered element
   */
  renderToElement(text, element) {
    const parsed = this.parse(text);
    return renderToElement(parsed, element, this.options);
  }

  /**
   * Render ChordPro text to HTML string
   * @param {string} text - ChordPro formatted text
   * @returns {string} HTML representation
   */
  renderToHTML(text) {
    const parsed = this.parse(text);
    return renderToHTML(parsed, this.options);
  }

  /**
   * Update options
   * @param {object} options - New options
   * @returns {ChordproJS} This instance for chaining
   */
  setOptions(options) {
    this.options = { ...this.options, ...options };
    return this;
  }

  /**
   * Check if text is in ChordPro format
   * @param {string} text - Text to check
   * @returns {boolean} True if text appears to be ChordPro format
   */
  isChordPro(text) {
    // Look for directives or chord notation
    return /\{.*\}/.test(text) || /\[.*\]/.test(text);
  }

  /**
   * Apply a plugin
   * @param {string} pluginName - Name of registered plugin
   * @param {object} options - Plugin options
   * @returns {ChordproJS} This instance for chaining
   */
  use(pluginName, options = {}) {
    const plugin = ChordproJS.plugins[pluginName];
    if (!plugin) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }
    plugin.install(this, options);
    return this;
  }
}

// Static plugin registry
ChordproJS.plugins = {};

/**
 * Register a plugin
 * @param {string} name - Plugin name
 * @param {object} plugin - Plugin with install method
 */
ChordproJS.registerPlugin = function (name, plugin) {
  ChordproJS.plugins[name] = plugin;
};

/**
 * Factory function to create ChordproJS instance
 * @param {object} options - Configuration options
 * @returns {ChordproJS} New ChordproJS instance
 */
function createChordproJS(options = {}) {
  return new ChordproJS(options);
}

// For UMD use
if (typeof window !== "undefined") {
  window.ChordproJS = createChordproJS;
}

export { ChordproJS, createChordproJS, createChordproJS as default };

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

      switch (directive) {
        case "title":
          song.title = value;
          break;
        case "subtitle":
        case "st":
          song.subtitle = value;
          break;
        case "artist":
          song.artist = value;
          break;
        case "key":
          song.key = value;
          break;
        case "comment":
        case "c":
          currentSection.lines.push({
            type: "comment",
            content: value,
          });
          break;
        case "start_of_chorus":
        case "soc":
          currentSection = {
            type: "chorus",
            lines: [],
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
        default:
          song.metadata[directive] = value;
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

  // Render sections
  parsedData.sections.forEach((section) => {
    if (section.type === "chorus") {
      html += '<div class="section chorus">';
    } else {
      html += '<div class="section verse">';
    }

    section.lines.forEach((line) => {
      switch (line.type) {
        case "comment":
          if (settings.showComments) {
            html += `<div class="comment">${escapeHtml(line.content)}</div>`;
          }
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
      ...options,
    };
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

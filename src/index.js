// src/index.js
/* global window */
import { parseChordPro } from "./core/parser";
import { renderToElement, renderToHTML } from "./core/renderer";
import "../style.css";

/**
 * Main ChordproJS class
 * 
 * This is the primary interface for parsing and rendering ChordPro files.
 * It provides a fluent API for configuration and rendering, with support
 * for plugins and custom options.
 * 
 * @class
 * @example
 * // Create instance with default options
 * const chordpro = new ChordproJS();
 * 
 * @example
 * // Create instance with custom options
 * const chordpro = new ChordproJS({
 *   showChords: false,
 *   showComments: true
 * });
 */
class ChordproJS {
  /**
   * Create a ChordproJS instance
   * 
   * @param {object} [options={}] - Configuration options
   * @param {boolean} [options.showTitle=true] - Display song title
   * @param {boolean} [options.showSubtitle=true] - Display song subtitle
   * @param {boolean} [options.showChords=true] - Display chords above lyrics
   * @param {boolean} [options.showComments=true] - Display comment lines
   * @param {function} [options.transposeChords=null] - Custom transpose function
   * 
   * @example
   * const chordpro = new ChordproJS({
   *   showTitle: true,
   *   showChords: true
   * });
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
   * 
   * Converts ChordPro formatted text into a JavaScript object with
   * metadata, sections, and line-by-line parsed content. This does
   * not render to HTML - use renderToHTML or renderToElement for that.
   * 
   * @param {string} text - ChordPro formatted text
   * @returns {object} Parsed song data with title, sections, metadata, etc.
   * 
   * @example
   * const parsed = chordpro.parse(`
   *   {title: Amazing Grace}
   *   [G]Amazing [D]grace
   * `);
   * console.log(parsed.title); // "Amazing Grace"
   */
  parse(text) {
    return parseChordPro(text, this.options);
  }

  /**
   * Render ChordPro text to an HTML element in the DOM
   * 
   * Parses and renders ChordPro text directly into a DOM element.
   * This is a convenience method that combines parse() with rendering.
   * 
   * @param {string} text - ChordPro formatted text
   * @param {HTMLElement|string} element - Target DOM element or CSS selector
   * @returns {HTMLElement} The rendered element
   * @throws {Error} If the target element cannot be found
   * 
   * @example
   * chordpro.renderToElement(chordproText, '#song-container');
   * 
   * @example
   * const element = document.getElementById('container');
   * chordpro.renderToElement(chordproText, element);
   */
  renderToElement(text, element) {
    const parsed = this.parse(text);
    return renderToElement(parsed, element, this.options);
  }

  /**
   * Render ChordPro text to HTML string
   * 
   * Parses and renders ChordPro text to an HTML string without
   * modifying the DOM. Useful for server-side rendering or when
   * you need the HTML as a string for further processing.
   * 
   * @param {string} text - ChordPro formatted text
   * @returns {string} HTML representation of the song
   * 
   * @example
   * const html = chordpro.renderToHTML(chordproText);
   * console.log(html); // '<h1>Song Title</h1><div>...'
   */
  renderToHTML(text) {
    const parsed = this.parse(text);
    return renderToHTML(parsed, this.options);
  }

  /**
   * Update configuration options
   * 
   * Merges new options with existing options. This allows changing
   * rendering behavior after instance creation without replacing
   * the entire configuration.
   * 
   * @param {object} options - New options to merge
   * @returns {ChordproJS} This instance for method chaining
   * 
   * @example
   * chordpro
   *   .setOptions({ showChords: false })
   *   .setOptions({ showComments: true })
   *   .renderToElement(text, '#container');
   */
  setOptions(options) {
    this.options = { ...this.options, ...options };
    return this;
  }

  /**
   * Check if text appears to be in ChordPro format
   * 
   * Performs a simple heuristic check for ChordPro syntax by looking
   * for directive braces {} or chord brackets []. This is not a
   * comprehensive validation but useful for basic format detection.
   * 
   * @param {string} text - Text to check
   * @returns {boolean} True if text appears to be ChordPro format
   * 
   * @example
   * chordpro.isChordPro('{title: My Song}'); // true
   * chordpro.isChordPro('[C]Hello world');   // true
   * chordpro.isChordPro('Plain text');       // false
   */
  isChordPro(text) {
    // Look for directives or chord notation
    return /\{.*\}/.test(text) || /\[.*\]/.test(text);
  }

  /**
   * Apply a plugin to extend functionality
   * 
   * Plugins can add new methods, modify parsing behavior, or add
   * new features to ChordproJS. The plugin must be registered first
   * using ChordproJS.registerPlugin().
   * 
   * @param {string} pluginName - Name of registered plugin
   * @param {object} [options={}] - Plugin-specific options
   * @returns {ChordproJS} This instance for method chaining
   * @throws {Error} If the plugin is not found
   * 
   * @example
   * ChordproJS.registerPlugin('transpose', transposePlugin);
   * chordpro.use('transpose');
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
// Stores all registered plugins for use with the .use() method
ChordproJS.plugins = {};

/**
 * Register a plugin for use with ChordproJS instances
 * 
 * Plugins must have an install(chordproJS, options) method that
 * is called when the plugin is applied via .use(). This is a
 * static method for global plugin registration.
 * 
 * @param {string} name - Plugin name (used with .use())
 * @param {object} plugin - Plugin object with install method
 * @param {function} plugin.install - Function that receives (chordproJS, options)
 * 
 * @example
 * ChordproJS.registerPlugin('myPlugin', {
 *   install(chordproJS, options) {
 *     chordproJS.myMethod = function() { ... };
 *   }
 * });
 */
ChordproJS.registerPlugin = function (name, plugin) {
  ChordproJS.plugins[name] = plugin;
};

/**
 * Factory function to create ChordproJS instance
 * 
 * This is an alternative to using `new ChordproJS()`. It provides
 * a more functional style API without requiring the `new` keyword.
 * 
 * @param {object} [options={}] - Configuration options (same as constructor)
 * @returns {ChordproJS} New ChordproJS instance
 * 
 * @example
 * const chordpro = createChordproJS({ showChords: true });
 */
function createChordproJS(options = {}) {
  return new ChordproJS(options);
}

// Export both class and factory
export { ChordproJS, createChordproJS };
export default createChordproJS;

// For UMD use (browser <script> tags)
// Makes ChordproJS available as window.ChordproJS and window.createChordproJS
if (typeof window !== "undefined") {
  window.ChordproJS = ChordproJS;
  window.createChordproJS = createChordproJS;
}

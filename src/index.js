// src/index.js
/* global window */
import { parseChordPro } from './core/parser';
import { renderToElement, renderToHTML } from './core/renderer';
import '../style.css';

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
      ...options
    };

    // Auto-register the transpose plugin if available
    if (ChordproJS.plugins.transpose) {
      this.use('transpose');
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

// Export both class and factory
export { ChordproJS, createChordproJS };
export default createChordproJS;

// For UMD use
if (typeof window !== 'undefined') {
  window.ChordproJS = ChordproJS;
  window.createChordproJS = createChordproJS;
}

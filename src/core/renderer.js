// src/core/renderer.js
/**
 * Render parsed ChordPro data to an HTML element
 * @param {object} parsedData - Data returned from parseChordPro
 * @param {HTMLElement|string} element - Target DOM element or selector
 * @param {object} options - Rendering options
 * @returns {HTMLElement} The rendered element
 */
export function renderToElement(parsedData, element, options = {}) {
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
export function renderToHTML(parsedData, options = {}) {
  const defaults = {
    showTitle: true,
    showSubtitle: true,
    showChords: true,
    showComments: true
  };

  const settings = { ...defaults, ...options };
  let html = "";

  // Generate CSS styles from font configuration
  const fontStyles = generateFontStyles(parsedData.fonts);
  if (fontStyles) {
    html += `<style>${fontStyles}</style>`;
  }

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

  if (parsedData.capo) {
    html += `<div class="capo">Capo: ${escapeHtml(parsedData.capo)}</div>`;
  }

  if (parsedData.tempo) {
    html += `<div class="tempo">Tempo: ${escapeHtml(parsedData.tempo)}</div>`;
  }

  if (parsedData.time) {
    html += `<div class="time">Time: ${escapeHtml(parsedData.time)}</div>`;
  }

  if (parsedData.year) {
    html += `<div class="year">Year: ${escapeHtml(parsedData.year)}</div>`;
  }

  if (parsedData.album) {
    html += `<div class="album">Album: ${escapeHtml(parsedData.album)}</div>`;
  }

  if (parsedData.composer) {
    html += `<div class="composer">Composer: ${escapeHtml(parsedData.composer)}</div>`;
  }

  if (parsedData.copyright) {
    html += `<div class="copyright">Copyright: ${escapeHtml(parsedData.copyright)}</div>`;
  }

  // Render sections
  parsedData.sections.forEach((section) => {
    if (section.type === "chorus") {
      html += '<div class="section chorus">';
    } else if (section.type === "bridge") {
      html += '<div class="section bridge">';
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
            const lyrics = line.lyrics;
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
            html += `<div class="lyric-line-only">${escapeHtml(line.lyrics)}</div>`;
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
 * Generate CSS styles from font configuration
 * @param {object} fonts - Font configuration object
 * @returns {string} CSS styles
 */
function generateFontStyles(fonts) {
  if (!fonts) return "";

  let styles = "";

  // Text (lyrics) font styles
  const textStyles = [];
  if (fonts.textfont) {
    textStyles.push(`font-family: ${fonts.textfont}`);
  }
  if (fonts.textsize) {
    textStyles.push(`font-size: ${fonts.textsize}`);
  }
  if (fonts.textcolour) {
    textStyles.push(`color: ${fonts.textcolour}`);
  }

  if (textStyles.length > 0) {
    styles += `.lyric-line, .lyric-line-only { ${textStyles.join("; ")}; }\n`;
  }

  // Chord font styles
  const chordStyles = [];
  if (fonts.chordfont) {
    chordStyles.push(`font-family: ${fonts.chordfont}`);
  }
  if (fonts.chordsize) {
    chordStyles.push(`font-size: ${fonts.chordsize}`);
  }
  if (fonts.chordcolour) {
    chordStyles.push(`color: ${fonts.chordcolour}`);
  }

  if (chordStyles.length > 0) {
    styles += `.chord-line { ${chordStyles.join("; ")}; }\n`;
  }

  return styles;
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
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

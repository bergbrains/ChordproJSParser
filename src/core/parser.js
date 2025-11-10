// src/core/parser.js
/**
 * Parse ChordPro formatted text into structured data
 * @param {string} text - ChordPro formatted text
 * @returns {object} Structured song data
 */
export function parseChordPro(text) {
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
    if (line.trim().match(/^\{([^:}]+)(?::([^}]*))?\}$/)) {
      const matches = line.trim().match(/^\{([^:}]+)(?::([^}]*))?\}$/);
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
      case "define": {
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
      }
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
      case "titlecolour": {
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
      }

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

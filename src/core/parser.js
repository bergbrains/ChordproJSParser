// src/core/parser.js
/**
 * Parse ChordPro formatted text into structured data
 * @param {string} text - ChordPro formatted text
 * @param {object} options - Parsing options
 * @returns {object} Structured song data
 */
export function parseChordPro(text, options = {}) {
  const lines = text.split("\n");
  const song = {
    title: "",
    subtitle: "",
    artist: "",
    key: "",
    capo: "",
    tempo: "",
    time: "",
    year: "",
    album: "",
    composer: "",
    copyright: "",
    sections: [],
    metadata: {},
    fonts: {
      textfont: "",
      chordfont: "",
      textsize: "",
      chordsize: "",
      textcolour: "",
      chordcolour: ""
    }
  };

  let currentSection = {
    type: "verse",
    lines: []
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
        case "capo":
          song.capo = value;
          break;
        case "tempo":
          song.tempo = value;
          break;
        case "time":
          song.time = value;
          break;
        case "year":
          song.year = value;
          break;
        case "album":
          song.album = value;
          break;
        case "composer":
          song.composer = value;
          break;
        case "copyright":
          song.copyright = value;
          break;
        case "textfont":
          song.fonts.textfont = value;
          break;
        case "chordfont":
          song.fonts.chordfont = value;
          break;
        case "textsize":
          song.fonts.textsize = value;
          break;
        case "chordsize":
          song.fonts.chordsize = value;
          break;
        case "textcolour":
        case "textcolor":
          song.fonts.textcolour = value;
          break;
        case "chordcolour":
        case "chordcolor":
          song.fonts.chordcolour = value;
          break;
        case "comment":
        case "c":
          currentSection.lines.push({
            type: "comment",
            content: value
          });
          break;
        case "start_of_chorus":
        case "soc":
          currentSection = {
            type: "chorus",
            lines: []
          };
          song.sections.push(currentSection);
          break;
        case "end_of_chorus":
        case "eoc":
          currentSection = {
            type: "verse",
            lines: []
          };
          song.sections.push(currentSection);
          break;
        case "start_of_verse":
        case "sov":
          currentSection = {
            type: "verse",
            lines: []
          };
          song.sections.push(currentSection);
          break;
        case "end_of_verse":
        case "eov":
          currentSection = {
            type: "verse",
            lines: []
          };
          song.sections.push(currentSection);
          break;
        case "start_of_bridge":
        case "sob":
          currentSection = {
            type: "bridge",
            lines: []
          };
          song.sections.push(currentSection);
          break;
        case "end_of_bridge":
        case "eob":
          currentSection = {
            type: "verse",
            lines: []
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
        positions: positions
      });
    }
    // Process empty lines
    else if (line.trim() === "") {
      currentSection.lines.push({
        type: "empty"
      });
    }
    // Process regular lyrics lines
    else {
      currentSection.lines.push({
        type: "lyricLine",
        content: line
      });
    }
  });

  return song;
}

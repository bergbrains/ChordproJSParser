// src/plugins/transpose.js
/**
 * Plugin for transposing chords
 */
export const transposePlugin = {
  install(chordproJS, options = {}) {
    // Define chord mapping for transposition
    const chords = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];

    // Define transpose function
    const transposeChord = function (chordString, semitones) {
      // Handle flat notation
      chordString = chordString
        .replace(/Bb/g, "A#")
        .replace(/Db/g, "C#")
        .replace(/Eb/g, "D#")
        .replace(/Gb/g, "F#")
        .replace(/Ab/g, "G#");

      // Extract root note and suffix
      const regex = /^([A-G][#]?)(.*)$/;
      const match = chordString.match(regex);

      if (!match) return chordString; // Not a chord

      const [, root, suffix] = match;
      const index = chords.indexOf(root);

      if (index === -1) return chordString; // Not a valid chord

      // Calculate new index with wrapping
      const newIndex = (index + semitones + 12) % 12;
      return chords[newIndex] + suffix;
    };

    // Add transpose function to ChordproJS instance
    chordproJS.transpose = transposeChord;

    // Add transpose function to options for renderer to use
    chordproJS.options.transposeChords = transposeChord;

    // Extend parse method to support manual transposition
    const originalParse = chordproJS.parse;
    chordproJS.parse = function (text, transposeSteps = 0) {
      const parsed = originalParse.call(this, text);

      // If manual transpose steps are provided, apply them
      // (this is separate from the {transpose: N} directive)
      if (transposeSteps !== 0) {
        parsed.sections.forEach((section) => {
          section.lines.forEach((line) => {
            if (line.type === "chordLine" && line.chords) {
              line.chords = line.chords.map((chord) =>
                transposeChord(chord, transposeSteps),
              );
            }
          });
        });
      }

      return parsed;
    };
  },
};

// Register if in browser context
if (typeof window !== "undefined" && window.ChordproJS) {
  window.ChordproJS.registerPlugin("transpose", transposePlugin);
}

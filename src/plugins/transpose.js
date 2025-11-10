// src/plugins/transpose.js
/* global window */
/**
 * Transpose Plugin for ChordproJS
 * 
 * This plugin adds chord transposition functionality to ChordproJS instances.
 * It allows chords to be shifted up or down by a specified number of semitones,
 * which is useful for matching a song to a singer's vocal range or accommodating
 * different instruments.
 * 
 * The plugin handles:
 * - Conversion between sharp (#) and flat (b) notation
 * - Preservation of chord suffixes (m, 7, maj7, sus4, etc.)
 * - Wrapping around the 12-semitone chromatic scale
 * - Integration with the {transpose: N} directive
 * 
 * @example
 * const chordpro = new ChordproJS();
 * chordpro.use('transpose');
 * // Transpose C to D (up 2 semitones)
 * chordpro.transpose('C', 2); // Returns 'D'
 */
export const transposePlugin = {
  /**
   * Install the transpose plugin into a ChordproJS instance
   * 
   * This method is called automatically when using chordproJS.use('transpose').
   * It adds the transpose function to the instance and extends the parse method
   * to support manual transposition.
   * 
   * @param {ChordproJS} chordproJS - The ChordproJS instance to extend
   */
  install(chordproJS) {
    // Define chord mapping for transposition
    // Using sharp notation as the canonical form for internal processing
    // Chromatic scale: 12 semitones from C to B
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
    /**
     * Transpose a single chord by a specified number of semitones
     * 
     * @param {string} chordString - The chord to transpose (e.g., "C", "Dm7", "Bb")
     * @param {number} semitones - Number of semitones to transpose (positive = up, negative = down)
     * @returns {string} The transposed chord
     * 
     * @example
     * transposeChord('C', 2);   // Returns 'D'
     * transposeChord('Am', 3);  // Returns 'Cm'
     * transposeChord('G7', -2); // Returns 'F7'
     */
    const transposeChord = function (chordString, semitones) {
      // Handle flat notation by converting to sharp equivalents
      // This simplifies processing by using a single canonical form
      chordString = chordString
        .replace(/Bb/g, "A#")
        .replace(/Db/g, "C#")
        .replace(/Eb/g, "D#")
        .replace(/Gb/g, "F#")
        .replace(/Ab/g, "G#");

      // Extract root note and suffix (e.g., "Dm7" -> root="D", suffix="m7")
      // The root note determines transposition, suffix is preserved
      const regex = /^([A-G][#]?)(.*)$/;
      const match = chordString.match(regex);

      if (!match) return chordString; // Not a chord

      const [, root, suffix] = match;
      const index = chords.indexOf(root);

      if (index === -1) return chordString; // Not a valid chord

      // Calculate new index with wrapping
      // Adding 12 before modulo ensures negative transposes work correctly
      // Example: (0 + (-2) + 12) % 12 = 10 (C down 2 = A#)
      const newIndex = (index + semitones + 12) % 12;
      return chords[newIndex] + suffix;
    };

    // Add transpose function to ChordproJS instance
    // This makes it available as chordproJS.transpose('C', 2)
    chordproJS.transpose = transposeChord;

    // Add transpose function to options for renderer to use
    // The renderer checks for this when processing the {transpose: N} directive
    chordproJS.options.transposeChords = transposeChord;

    // Extend parse method to support manual transposition
    // This allows users to transpose programmatically: chordproJS.parse(text, 2)
    const originalParse = chordproJS.parse;
    chordproJS.parse = function (text, transposeSteps = 0) {
      const parsed = originalParse.call(this, text);

      // If manual transpose steps are provided, apply them to all chords
      // This is separate from the {transpose: N} directive which is processed during rendering
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
// This allows the plugin to be automatically available when loaded via <script> tag
if (typeof window !== "undefined" && window.ChordproJS) {
  window.ChordproJS.registerPlugin("transpose", transposePlugin);
}

// tests/transpose.test.js
import { ChordproJS, createChordproJS } from '../src/index';
import { transposePlugin } from '../src/plugins/transpose';

describe('Transpose Plugin', () => {
  let chordpro;

  beforeEach(() => {
    // Reset plugins registry to avoid test interference
    ChordproJS.plugins = {};
    ChordproJS.registerPlugin('transpose', transposePlugin);
    chordpro = createChordproJS();
  });

  test('should register the transpose plugin', () => {
    expect(ChordproJS.plugins.transpose).toBe(transposePlugin);
  });

  test('should auto-register the transpose plugin on instance creation', () => {
    expect(chordpro.options.transposeChords).toBeInstanceOf(Function);
  });

  describe('transposeChord function', () => {
    test('should transpose C to D (up 2 semitones)', () => {
      expect(chordpro.transpose('C', 2)).toBe('D');
    });

    test('should transpose C to B (down 1 semitone)', () => {
      expect(chordpro.transpose('C', -1)).toBe('B');
    });

    test('should transpose G to C (up 5 semitones)', () => {
      expect(chordpro.transpose('G', 5)).toBe('C');
    });

    test('should handle chord suffixes', () => {
      expect(chordpro.transpose('Cmaj7', 2)).toBe('Dmaj7');
      expect(chordpro.transpose('Gm', 3)).toBe('A#m');
    });

    test('should convert flat notation to sharp notation', () => {
      expect(chordpro.transpose('Bb', 0)).toBe('A#');
      expect(chordpro.transpose('Eb', 2)).toBe('F');
    });

    test('should return original string for non-chord input', () => {
      expect(chordpro.transpose('Hello', 2)).toBe('Hello');
      expect(chordpro.transpose('X', 3)).toBe('X');
    });
  });

  describe('parse with transpose directive', () => {
    test('should transpose chords based on transpose directive', () => {
      const text = '{transpose: 2}\n[C]This is a [G]chord line';
      const result = chordpro.parse(text);

      // The transpose directive should be stored in metadata
      expect(result.metadata.transpose).toBe(2);

      // But the chords in the parsed data should not be transposed yet
      // (transposition happens during rendering)
      expect(result.sections[0].lines[0].chords).toEqual(['C', 'G']);
    });
  });

  describe('renderToHTML with transposition', () => {
    test('should transpose chords during rendering', () => {
      const text = '{transpose: 2}\n[C]This is a [G]chord line';
      const html = chordpro.renderToHTML(text);

      // The rendered HTML should contain the transposed chords
      expect(html).toContain('<pre class="chord-line">D            A</pre>');
    });
  });

  describe('manual transposition', () => {
    test('should apply manual transposition when parsing', () => {
      const text = '[C]This is a [G]chord line';
      const result = chordpro.parse(text, 2); // Transpose up 2 semitones

      // The chords in the parsed data should be transposed
      expect(result.sections[0].lines[0].chords).toEqual(['D', 'A']);
    });

    test('should not affect original chord data when not transposing', () => {
      const text = '[C]This is a [G]chord line';
      const result = chordpro.parse(text, 0); // No transposition

      // The chords should remain unchanged
      expect(result.sections[0].lines[0].chords).toEqual(['C', 'G']);
    });

    test('should handle negative transposition', () => {
      const text = '[C]This is a [G]chord line';
      const result = chordpro.parse(text, -1); // Transpose down 1 semitone

      // The chords should be transposed down
      expect(result.sections[0].lines[0].chords).toEqual(['B', 'F#']);
    });

    test('should handle complex chords in manual transposition', () => {
      const text = '[Cmaj7]This is a [Gm7]chord line';
      const result = chordpro.parse(text, 2); // Transpose up 2 semitones

      // The complex chords should be transposed correctly
      expect(result.sections[0].lines[0].chords).toEqual(['Dmaj7', 'Am7']);
    });
  });
});

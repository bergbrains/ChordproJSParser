// tests/parser.test.js
import { parseChordPro } from '../src/core/parser';

describe('ChordPro Parser', () => {
  describe('Metadata directives', () => {
    test('should parse title directive', () => {
      const text = '{title: My Song}';
      const result = parseChordPro(text);
      expect(result.title).toBe('My Song');
    });

    test('should parse abbreviated title directive', () => {
      const text = '{t: My Song}';
      const result = parseChordPro(text);
      expect(result.title).toBe('My Song');
    });

    test('should parse subtitle directive', () => {
      const text = '{subtitle: A great song}';
      const result = parseChordPro(text);
      expect(result.subtitle).toBe('A great song');
    });

    test('should parse artist directive', () => {
      const text = '{artist: John Doe}';
      const result = parseChordPro(text);
      expect(result.artist).toBe('John Doe');
    });

    test('should parse key directive', () => {
      const text = '{key: C}';
      const result = parseChordPro(text);
      expect(result.key).toBe('C');
    });

    test('should parse multiple directives', () => {
      const text = '{title: My Song}\n{artist: John Doe}\n{key: C}';
      const result = parseChordPro(text);
      expect(result.title).toBe('My Song');
      expect(result.artist).toBe('John Doe');
      expect(result.key).toBe('C');
    });

    test('should store other metadata in metadata object', () => {
      const text = '{album: Greatest Hits}\n{year: 2023}';
      const result = parseChordPro(text);
      expect(result.metadata.album).toBe('Greatest Hits');
      expect(result.metadata.year).toBe('2023');
    });
  });

  describe('Section directives', () => {
    test('should parse chorus section', () => {
      const text = '{start_of_chorus}\nThis is a chorus\n{end_of_chorus}';
      const result = parseChordPro(text);
      expect(result.sections[1].type).toBe('chorus');
      expect(result.sections[1].lines[0].content).toBe('This is a chorus');
    });

    test('should parse abbreviated chorus section', () => {
      const text = '{soc}\nThis is a chorus\n{eoc}';
      const result = parseChordPro(text);
      expect(result.sections[1].type).toBe('chorus');
      expect(result.sections[1].lines[0].content).toBe('This is a chorus');
    });

    test('should parse verse section', () => {
      const text = '{start_of_verse}\nThis is a verse\n{end_of_verse}';
      const result = parseChordPro(text);
      expect(result.sections[1].type).toBe('verse');
      expect(result.sections[1].lines[0].content).toBe('This is a verse');
    });

    test('should parse bridge section', () => {
      const text = '{start_of_bridge}\nThis is a bridge\n{end_of_bridge}';
      const result = parseChordPro(text);
      expect(result.sections[1].type).toBe('bridge');
      expect(result.sections[1].lines[0].content).toBe('This is a bridge');
    });

    test('should parse section with label', () => {
      const text = '{start_of_chorus: Chorus 1}\nThis is chorus 1\n{end_of_chorus}';
      const result = parseChordPro(text);
      expect(result.sections[1].type).toBe('chorus');
      expect(result.sections[1].label).toBe('Chorus 1');
    });
  });

  describe('Comment directives', () => {
    test('should parse comment directive', () => {
      const text = '{comment: This is a comment}';
      const result = parseChordPro(text);
      expect(result.sections[0].lines[0].type).toBe('comment');
      expect(result.sections[0].lines[0].content).toBe('This is a comment');
      expect(result.sections[0].lines[0].format).toBe('plain');
    });

    test('should parse abbreviated comment directive', () => {
      const text = '{c: This is a comment}';
      const result = parseChordPro(text);
      expect(result.sections[0].lines[0].type).toBe('comment');
      expect(result.sections[0].lines[0].content).toBe('This is a comment');
    });

    test('should parse italic comment directive', () => {
      const text = '{comment_italic: This is an italic comment}';
      const result = parseChordPro(text);
      expect(result.sections[0].lines[0].type).toBe('comment');
      expect(result.sections[0].lines[0].format).toBe('italic');
    });

    test('should parse box comment directive', () => {
      const text = '{comment_box: This is a boxed comment}';
      const result = parseChordPro(text);
      expect(result.sections[0].lines[0].type).toBe('comment');
      expect(result.sections[0].lines[0].format).toBe('box');
    });
  });

  describe('Chord lines', () => {
    test('should parse chord line', () => {
      const text = '[C]This is a [G]chord line';
      const result = parseChordPro(text);
      expect(result.sections[0].lines[0].type).toBe('chordLine');
      expect(result.sections[0].lines[0].chords).toEqual(['C', 'G']);
      expect(result.sections[0].lines[0].lyrics).toBe('This is a chord line');
      expect(result.sections[0].lines[0].positions).toEqual([0, 10]);
    });

    test('should parse chord line with multiple chords', () => {
      const text = '[C]This [Dm]is [G]a [F]chord [Am]line';
      const result = parseChordPro(text);
      expect(result.sections[0].lines[0].type).toBe('chordLine');
      expect(result.sections[0].lines[0].chords).toEqual(['C', 'Dm', 'G', 'F', 'Am']);
      expect(result.sections[0].lines[0].lyrics).toBe('This is a chord line');
    });

    test('should parse chord line with complex chords', () => {
      const text = '[Cmaj7]Complex [G7sus4]chords';
      const result = parseChordPro(text);
      expect(result.sections[0].lines[0].chords).toEqual(['Cmaj7', 'G7sus4']);
      expect(result.sections[0].lines[0].lyrics).toBe('Complex chords');
    });
  });

  describe('Empty lines and regular lyrics', () => {
    test('should parse empty lines', () => {
      const text = 'Line 1\n\nLine 2';
      const result = parseChordPro(text);
      expect(result.sections[0].lines[0].type).toBe('lyricLine');
      expect(result.sections[0].lines[1].type).toBe('empty');
      expect(result.sections[0].lines[2].type).toBe('lyricLine');
    });

    test('should parse regular lyric lines', () => {
      const text = 'This is a regular lyric line';
      const result = parseChordPro(text);
      expect(result.sections[0].lines[0].type).toBe('lyricLine');
      expect(result.sections[0].lines[0].content).toBe('This is a regular lyric line');
    });
  });
});
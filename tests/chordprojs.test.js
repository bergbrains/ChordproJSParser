// tests/chordprojs.test.js
import { ChordproJS, createChordproJS } from '../src/index';

describe('ChordproJS', () => {
  let chordpro;

  beforeEach(() => {
    chordpro = createChordproJS();
  });

  describe('Constructor', () => {
    test('should create an instance with default options', () => {
      expect(chordpro).toBeInstanceOf(ChordproJS);
      expect(chordpro.options).toEqual(expect.objectContaining({
        showTitle: true,
        showSubtitle: true,
        showChords: true,
        showComments: true,
      }));
    });

    test('should override default options', () => {
      const customChordpro = createChordproJS({
        showTitle: false,
        showChords: false,
      });
      expect(customChordpro.options).toEqual(expect.objectContaining({
        showTitle: false,
        showSubtitle: true,
        showChords: false,
        showComments: true,
      }));
    });
  });

  describe('isChordPro', () => {
    test('should detect ChordPro format with directives', () => {
      const text = '{title: My Song}';
      expect(chordpro.isChordPro(text)).toBe(true);
    });

    test('should detect ChordPro format with chords', () => {
      const text = 'This is a [C]chord line';
      expect(chordpro.isChordPro(text)).toBe(true);
    });

    test('should return false for plain text', () => {
      const text = 'This is just plain text';
      expect(chordpro.isChordPro(text)).toBe(false);
    });
  });

  describe('parse', () => {
    test('should parse title directive', () => {
      const text = '{title: My Song}';
      const result = chordpro.parse(text);
      expect(result.title).toBe('My Song');
    });

    test('should parse artist directive', () => {
      const text = '{artist: John Doe}';
      const result = chordpro.parse(text);
      expect(result.artist).toBe('John Doe');
    });

    test('should parse chord lines', () => {
      const text = '[C]This is a [G]chord line';
      const result = chordpro.parse(text);
      expect(result.sections[0].lines[0].type).toBe('chordLine');
      expect(result.sections[0].lines[0].chords).toEqual(['C', 'G']);
      expect(result.sections[0].lines[0].lyrics).toBe('This is a chord line');
    });
  });

  describe('renderToHTML', () => {
    test('should render title', () => {
      const text = '{title: My Song}';
      const html = chordpro.renderToHTML(text);
      expect(html).toContain('<h1>My Song</h1>');
    });

    test('should render chord lines', () => {
      const text = '[C]This is a [G]chord line';
      const html = chordpro.renderToHTML(text);
      expect(html).toContain('<pre class="chord-line">C            G</pre>');
      expect(html).toContain('<pre class="lyric-line">This is a chord line</pre>');
    });

    test('should not render chords when showChords is false', () => {
      const text = '[C]This is a [G]chord line';
      chordpro.setOptions({ showChords: false });
      const html = chordpro.renderToHTML(text);
      expect(html).not.toContain('<pre class="chord-line">');
      expect(html).toContain('<div class="lyric-line-only">This is a chord line</div>');
    });
  });

  describe('plugins', () => {
    test('should register and use a plugin', () => {
      const mockPlugin = {
        install: jest.fn(),
      };
      ChordproJS.registerPlugin('mockPlugin', mockPlugin);
      
      const instance = createChordproJS();
      instance.use('mockPlugin', { option1: 'value1' });
      
      expect(mockPlugin.install).toHaveBeenCalledWith(
        expect.any(ChordproJS),
        { option1: 'value1' }
      );
    });

    test('should throw error for non-existent plugin', () => {
      expect(() => {
        chordpro.use('nonExistentPlugin');
      }).toThrow("Plugin 'nonExistentPlugin' not found");
    });
  });
});
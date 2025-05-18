// tests/renderer.test.js
import { renderToHTML } from '../src/core/renderer';
import { parseChordPro } from '../src/core/parser';

describe('ChordPro Renderer', () => {
  describe('renderToHTML', () => {
    test('should render title and subtitle', () => {
      const parsed = parseChordPro('{title: My Song}\n{subtitle: A great song}');
      const html = renderToHTML(parsed);
      expect(html).toContain('<h1>My Song</h1>');
      expect(html).toContain('<h2>A great song</h2>');
    });

    test('should not render title when showTitle is false', () => {
      const parsed = parseChordPro('{title: My Song}');
      const html = renderToHTML(parsed, { showTitle: false });
      expect(html).not.toContain('<h1>My Song</h1>');
    });

    test('should render artist and key', () => {
      const parsed = parseChordPro('{artist: John Doe}\n{key: C}');
      const html = renderToHTML(parsed);
      expect(html).toContain('<div class="artist">John Doe</div>');
      expect(html).toContain('<div class="key">Key: C</div>');
    });

    test('should render chord lines', () => {
      const parsed = parseChordPro('[C]This is a [G]chord line');
      const html = renderToHTML(parsed);
      expect(html).toContain('<pre class="chord-line">C            G</pre>');
      expect(html).toContain('<pre class="lyric-line">This is a chord line</pre>');
    });

    test('should not render chords when showChords is false', () => {
      const parsed = parseChordPro('[C]This is a [G]chord line');
      const html = renderToHTML(parsed, { showChords: false });
      expect(html).not.toContain('<pre class="chord-line">');
      expect(html).toContain('<div class="lyric-line-only">This is a chord line</div>');
    });

    test('should render comments', () => {
      const parsed = parseChordPro('{comment: This is a comment}');
      const html = renderToHTML(parsed);
      expect(html).toContain('<div class="comment">This is a comment</div>');
    });

    test('should not render comments when showComments is false', () => {
      const parsed = parseChordPro('{comment: This is a comment}');
      const html = renderToHTML(parsed, { showComments: false });
      expect(html).not.toContain('<div class="comment">');
    });

    test('should render italic comments', () => {
      const parsed = parseChordPro('{comment_italic: This is an italic comment}');
      const html = renderToHTML(parsed);
      expect(html).toContain('<div class="comment comment-italic">This is an italic comment</div>');
    });

    test('should render box comments', () => {
      const parsed = parseChordPro('{comment_box: This is a boxed comment}');
      const html = renderToHTML(parsed);
      expect(html).toContain('<div class="comment comment-box">This is a boxed comment</div>');
    });

    test('should render chorus sections', () => {
      const parsed = parseChordPro('{start_of_chorus}\nThis is a chorus\n{end_of_chorus}');
      const html = renderToHTML(parsed);
      expect(html).toContain('<div class="section chorus">');
      expect(html).toContain('<div class="lyric-line">This is a chorus</div>');
    });

    test('should render chorus sections with labels', () => {
      const parsed = parseChordPro('{start_of_chorus: Chorus 1}\nThis is chorus 1\n{end_of_chorus}');
      const html = renderToHTML(parsed);
      expect(html).toContain('<div class="section chorus">');
      expect(html).toContain('<div class="section-label">Chorus 1</div>');
    });

    test('should render verse sections', () => {
      const parsed = parseChordPro('{start_of_verse}\nThis is a verse\n{end_of_verse}');
      const html = renderToHTML(parsed);
      expect(html).toContain('<div class="section verse">');
      expect(html).toContain('<div class="lyric-line">This is a verse</div>');
    });

    test('should render bridge sections', () => {
      const parsed = parseChordPro('{start_of_bridge}\nThis is a bridge\n{end_of_bridge}');
      const html = renderToHTML(parsed);
      expect(html).toContain('<div class="section bridge">');
      expect(html).toContain('<div class="lyric-line">This is a bridge</div>');
    });

    test('should render empty lines', () => {
      const parsed = parseChordPro('Line 1\n\nLine 2');
      const html = renderToHTML(parsed);
      expect(html).toContain('<div class="lyric-line">Line 1</div>');
      expect(html).toContain('<div class="empty-line">&nbsp;</div>');
      expect(html).toContain('<div class="lyric-line">Line 2</div>');
    });

    test('should escape HTML in content', () => {
      const parsed = parseChordPro('{title: <script>alert("XSS")</script>}');
      const html = renderToHTML(parsed);
      expect(html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
      expect(html).not.toContain('<script>');
    });

    test('should apply transposition if transposeChords function is provided', () => {
      const parsed = parseChordPro('{transpose: 2}\n[C]This is a [G]chord line');
      const options = {
        transposeChords: (chord, semitones) => {
          const chords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
          const index = chords.indexOf(chord);
          if (index === -1) return chord;
          const newIndex = (index + semitones + 12) % 12;
          return chords[newIndex];
        }
      };
      const html = renderToHTML(parsed, options);
      expect(html).toContain('<pre class="chord-line">D            A</pre>');
    });
  });
});
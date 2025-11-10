// tests/renderer.test.js
import { ChordproJS } from "../src/index";

describe("ChordPro Renderer", () => {
  let chordpro;
  let mockElement;

  beforeEach(() => {
    chordpro = new ChordproJS();

    // Create a mock DOM element
    mockElement = {
      innerHTML: ""
    };
  });

  test("renders metadata fields", () => {
    const input = `
{title: My Song}
{subtitle: My Subtitle}
{artist: John Doe}
{key: C}
{capo: 2}
{tempo: 120}
{time: 4/4}
{year: 2023}
{album: My Album}
{composer: John Doe}
{copyright: 2023 John Doe}
`;

    const html = chordpro.renderToHTML(input);

    // Check that all metadata fields are rendered
    expect(html).toContain("<h1>My Song</h1>");
    expect(html).toContain("<h2>My Subtitle</h2>");
    expect(html).toContain('<div class="artist">John Doe</div>');
    expect(html).toContain('<div class="key">Key: C</div>');
    expect(html).toContain('<div class="capo">Capo: 2</div>');
    expect(html).toContain('<div class="tempo">Tempo: 120</div>');
    expect(html).toContain('<div class="time">Time: 4/4</div>');
    expect(html).toContain('<div class="year">Year: 2023</div>');
    expect(html).toContain('<div class="album">Album: My Album</div>');
    expect(html).toContain('<div class="composer">Composer: John Doe</div>');
    expect(html).toContain('<div class="copyright">Copyright: 2023 John Doe</div>');
  });

  test("renders different section types", () => {
    const input = `
{title: My Song}
This is a verse

{start_of_chorus}
This is a chorus
{end_of_chorus}

{start_of_bridge}
This is a bridge
{end_of_bridge}
`;

    const html = chordpro.renderToHTML(input);

    // Check that all section types are rendered with the correct class
    expect(html).toContain('<div class="section verse">');
    expect(html).toContain('<div class="section chorus">');
    expect(html).toContain('<div class="section bridge">');
  });

  test("renders chord lines", () => {
    const input = `
{title: My Song}
[C]This is a [G]chord line
`;

    const html = chordpro.renderToHTML(input);

    // Check that chord lines are rendered correctly
    expect(html).toContain('<pre class="chord-line">C         G</pre>');
    expect(html).toContain('<pre class="lyric-line">This is a chord line</pre>');
  });

  test("renders comments", () => {
    const input = `
{title: My Song}
{comment: This is a comment}
`;

    const html = chordpro.renderToHTML(input);

    // Check that comments are rendered correctly
    expect(html).toContain('<div class="comment">This is a comment</div>');
  });

  test("renderToElement updates the element innerHTML", () => {
    const input = "{title: My Song}";

    chordpro.renderToElement(input, mockElement);

    // Check that the element's innerHTML was updated
    expect(mockElement.innerHTML).toContain("<h1>My Song</h1>");
  });

  // Font styling tests
  describe("Font styling", () => {
    test("renders text font styles", () => {
      const input = `
{textfont: Arial}
{textsize: 16px}
{textcolour: blue}
This is a lyric line
`;

      const html = chordpro.renderToHTML(input);

      // Check that CSS styles are generated
      expect(html).toContain("<style>");
      expect(html).toContain(
        ".lyric-line, .lyric-line-only { font-family: Arial; font-size: 16px; color: blue; }"
      );
    });

    test("renders chord font styles", () => {
      const input = `
{chordfont: Courier New}
{chordsize: 14px}
{chordcolour: red}
[C]This is a chord line
`;

      const html = chordpro.renderToHTML(input);

      // Check that CSS styles are generated
      expect(html).toContain("<style>");
      expect(html).toContain(
        ".chord-line { font-family: Courier New; font-size: 14px; color: red; }"
      );
    });

    test("renders both text and chord font styles", () => {
      const input = `
{textfont: Arial}
{textsize: 16px}
{textcolour: #333}
{chordfont: monospace}
{chordsize: 12px}
{chordcolour: #c00}
[C]This is a [G]chord line
`;

      const html = chordpro.renderToHTML(input);

      // Check that both CSS styles are generated
      expect(html).toContain("<style>");
      expect(html).toContain(
        ".lyric-line, .lyric-line-only { font-family: Arial; font-size: 16px; color: #333; }"
      );
      expect(html).toContain(
        ".chord-line { font-family: monospace; font-size: 12px; color: #c00; }"
      );
    });

    test("handles US spelling variants", () => {
      const input = `
{textcolor: green}
{chordcolor: purple}
[C]This is a chord line
`;

      const html = chordpro.renderToHTML(input);

      // Check that US spelling variants work
      expect(html).toContain("<style>");
      expect(html).toContain(".lyric-line, .lyric-line-only { color: green; }");
      expect(html).toContain(".chord-line { color: purple; }");
    });

    test("renders partial font configurations", () => {
      const input = `
{textfont: Arial}
{chordsize: 14px}
This is a lyric line
[C]This is a chord line
`;

      const html = chordpro.renderToHTML(input);

      // Check that partial configurations work
      expect(html).toContain("<style>");
      expect(html).toContain(".lyric-line, .lyric-line-only { font-family: Arial; }");
      expect(html).toContain(".chord-line { font-size: 14px; }");
    });

    test("does not render styles when no font directives are present", () => {
      const input = `
{title: My Song}
This is a lyric line
`;

      const html = chordpro.renderToHTML(input);

      // Check that no style tag is generated when no font directives are present
      expect(html).not.toContain("<style>");
    });
  });
});

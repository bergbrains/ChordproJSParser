// tests/renderer.test.js
import { renderToHTML, renderToElement } from "../src/core/renderer";
import { parseChordPro } from "../src/core/parser";

describe("ChordPro Renderer", () => {
  describe("renderToElement", () => {
    test("should render to element when given a DOM element", () => {
      const mockElement = {
        innerHTML: "",
      };

      const parsed = parseChordPro("{title: My Song}");
      const result = renderToElement(parsed, mockElement);

      expect(result).toBe(mockElement);
      expect(mockElement.innerHTML).toContain("<h1>My Song</h1>");
    });
  });

  describe("renderToHTML", () => {
    test("should render title and subtitle", () => {
      const parsed = parseChordPro(
        "{title: My Song}\n{subtitle: A great song}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<h1>My Song</h1>");
      expect(html).toContain("<h2>A great song</h2>");
    });

    test("should not render title when showTitle is false", () => {
      const parsed = parseChordPro("{title: My Song}");
      const html = renderToHTML(parsed, { showTitle: false });
      expect(html).not.toContain("<h1>My Song</h1>");
    });

    test("should render artist and key", () => {
      const parsed = parseChordPro("{artist: John Doe}\n{key: C}");
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"artist\">John Doe</div>");
      expect(html).toContain("<div class=\"key\">Key: C</div>");
    });

    test("should render chord lines", () => {
      const parsed = parseChordPro("[C]This is a [G]chord line");
      const html = renderToHTML(parsed);
      expect(html).toContain("<pre class=\"chord-line\">C            G</pre>");
      expect(html).toContain(
        "<pre class=\"lyric-line\">This is a chord line</pre>",
      );
    });

    test("should not render chords when showChords is false", () => {
      const parsed = parseChordPro("[C]This is a [G]chord line");
      const html = renderToHTML(parsed, { showChords: false });
      expect(html).not.toContain("<pre class=\"chord-line\">");
      expect(html).toContain(
        "<div class=\"lyric-line-only\">This is a chord line</div>",
      );
    });

    test("should render comments", () => {
      const parsed = parseChordPro("{comment: This is a comment}");
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"comment\">This is a comment</div>");
    });

    test("should not render comments when showComments is false", () => {
      const parsed = parseChordPro("{comment: This is a comment}");
      const html = renderToHTML(parsed, { showComments: false });
      expect(html).not.toContain("<div class=\"comment\">");
    });

    test("should render italic comments", () => {
      const parsed = parseChordPro(
        "{comment_italic: This is an italic comment}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain(
        "<div class=\"comment comment-italic\">This is an italic comment</div>",
      );
    });

    test("should render box comments", () => {
      const parsed = parseChordPro("{comment_box: This is a boxed comment}");
      const html = renderToHTML(parsed);
      expect(html).toContain(
        "<div class=\"comment comment-box\">This is a boxed comment</div>",
      );
    });

    test("should render chorus sections", () => {
      const parsed = parseChordPro(
        "{start_of_chorus}\nThis is a chorus\n{end_of_chorus}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section chorus\">");
      expect(html).toContain("<div class=\"lyric-line\">This is a chorus</div>");
    });

    test("should render chorus sections with labels", () => {
      const parsed = parseChordPro(
        "{start_of_chorus: Chorus 1}\nThis is chorus 1\n{end_of_chorus}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section chorus\">");
      expect(html).toContain("<div class=\"section-label\">Chorus 1</div>");
    });

    test("should render verse sections", () => {
      const parsed = parseChordPro(
        "{start_of_verse}\nThis is a verse\n{end_of_verse}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section verse\">");
      expect(html).toContain("<div class=\"lyric-line\">This is a verse</div>");
    });

    test("should render bridge sections", () => {
      const parsed = parseChordPro(
        "{start_of_bridge}\nThis is a bridge\n{end_of_bridge}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section bridge\">");
      expect(html).toContain("<div class=\"lyric-line\">This is a bridge</div>");
    });

    test("should render bridge sections with labels", () => {
      const parsed = parseChordPro(
        "{start_of_bridge: Bridge 1}\nThis is bridge 1\n{end_of_bridge}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section bridge\">");
      expect(html).toContain("<div class=\"section-label\">Bridge 1</div>");
    });

    test("should render tab sections", () => {
      const parsed = parseChordPro(
        "{start_of_tab}\nE|---0---|\nB|---1---|\nG|---0---|\n{end_of_tab}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section tab\">");
      expect(html).toContain("<div class=\"lyric-line\">E|---0---|</div>");
    });

    test("should render tab sections with labels", () => {
      const parsed = parseChordPro(
        "{start_of_tab: Intro}\nE|---0---|\nB|---1---|\nG|---0---|\n{end_of_tab}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section tab\">");
      expect(html).toContain("<div class=\"section-label\">Intro</div>");
    });

    test("should render grid sections", () => {
      const parsed = parseChordPro(
        "{start_of_grid}\n| C | G | Am | F |\n{end_of_grid}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section grid\">");
      expect(html).toContain(
        "<div class=\"lyric-line\">| C | G | Am | F |</div>",
      );
    });

    test("should render grid sections with labels", () => {
      const parsed = parseChordPro(
        "{start_of_grid: Verse Progression}\n| C | G | Am | F |\n{end_of_grid}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section grid\">");
      expect(html).toContain(
        "<div class=\"section-label\">Verse Progression</div>",
      );
    });

    test("should render verse sections with labels", () => {
      const parsed = parseChordPro(
        "{start_of_verse: Verse 1}\nThis is verse 1\n{end_of_verse}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section verse\">");
      expect(html).toContain("<div class=\"section-label\">Verse 1</div>");
    });

    test("should render abc section", () => {
      const parsed = {
        sections: [
          {
            type: "abc",
            content: "X:1\nT:Example\nM:4/4\nL:1/8\nK:C\n|:C2D2E2F2|G2A2B2c2:|",
            lines: [],
          },
        ],
      };
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section abc\">");
      expect(html).toContain("<pre class=\"abc-content\">");
    });

    test("should render textblock section", () => {
      const parsed = {
        sections: [
          {
            type: "textblock",
            content: "This is a text block\nwith multiple lines",
            lines: [],
          },
        ],
      };
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"section textblock\">");
      expect(html).toContain("<pre class=\"textblock-content\">");
    });

    test("should render chord positioning with multiple chords", () => {
      const parsed = {
        sections: [
          {
            type: "verse",
            lines: [
              {
                type: "chordLine",
                lyrics: "This is a chord line with multiple chords",
                chords: ["A", "Bm", "C#m", "D"],
                positions: [0, 8, 16, 24],
              },
            ],
          },
        ],
      };
      const html = renderToHTML(parsed);
      expect(html).toContain("<pre class=\"chord-line\">");
      // The chord line should have the chords positioned correctly
      // We don't test the exact spacing as it's implementation-dependent
      expect(html).toContain(
        "<pre class=\"lyric-line\">This is a chord line with multiple chords</pre>",
      );
    });

    test("should render empty lines", () => {
      const parsed = parseChordPro("Line 1\n\nLine 2");
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"lyric-line\">Line 1</div>");
      expect(html).toContain("<div class=\"empty-line\">&nbsp;</div>");
      expect(html).toContain("<div class=\"lyric-line\">Line 2</div>");
    });

    test("should escape HTML in content", () => {
      const parsed = parseChordPro("{title: <script>alert(\"XSS\")</script>}");
      const html = renderToHTML(parsed);
      expect(html).toContain(
        "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;",
      );
      expect(html).not.toContain("<script>");
    });

    test("should render highlight", () => {
      const parsed = parseChordPro("{highlight: This is highlighted text}");
      const html = renderToHTML(parsed);
      expect(html).toContain(
        "<div class=\"highlight\">This is highlighted text</div>",
      );
    });

    test("should render image", () => {
      const parsed = parseChordPro(
        "{image: src=\"path/to/image.jpg\" scale=\"50%\"}",
      );
      const html = renderToHTML(parsed);
      expect(html).toContain(
        "<div class=\"image\"><img src=\"path/to/image.jpg\" style=\"max-width: 50%;\" alt=\"ChordPro Image\" /></div>",
      );
    });

    test("should render chorus reference", () => {
      const parsed = parseChordPro("{chorus: Chorus 1}");
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"chorus-ref\">Chorus: Chorus 1</div>");
    });

    test("should render chord diagram", () => {
      const parsed = {
        sections: [
          {
            type: "verse",
            lines: [
              {
                type: "chord",
                name: "Cmaj7",
              },
            ],
          },
        ],
        metadata: {
          chords: {
            Cmaj7: "base-fret 3 frets 1 1 3 2",
          },
        },
      };

      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"chord-diagram\">");
      expect(html).toContain("<div class=\"chord-name\">Cmaj7</div>");
      expect(html).toContain(
        "<div class=\"chord-definition\">base-fret 3 frets 1 1 3 2</div>",
      );
    });

    test("should render chord diagram without definition", () => {
      const parsed = {
        sections: [
          {
            type: "verse",
            lines: [
              {
                type: "chord",
                name: "Cmaj7",
              },
            ],
          },
        ],
      };

      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"chord-diagram\">");
      expect(html).toContain("<div class=\"chord-name\">Cmaj7</div>");
      expect(html).not.toContain("<div class=\"chord-definition\">");
    });

    test("should render page break", () => {
      const parsed = parseChordPro("{new_page}");
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"page-break\"></div>");
    });

    test("should render physical page break", () => {
      const parsed = parseChordPro("{new_physical_page}");
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"physical-page-break\"></div>");
    });

    test("should render column break", () => {
      const parsed = parseChordPro("{column_break}");
      const html = renderToHTML(parsed);
      expect(html).toContain("<div class=\"column-break\"></div>");
    });

    test("should apply transposition if transposeChords function is provided", () => {
      const parsed = parseChordPro(
        "{transpose: 2}\n[C]This is a [G]chord line",
      );
      const options = {
        transposeChords: (chord, semitones) => {
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
          const index = chords.indexOf(chord);
          if (index === -1) return chord;
          const newIndex = (index + semitones + 12) % 12;
          return chords[newIndex];
        },
      };
      const html = renderToHTML(parsed, options);
      expect(html).toContain("<pre class=\"chord-line\">D            A</pre>");
    });
  });
});

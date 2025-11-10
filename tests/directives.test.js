// tests/directives.test.js
import { ChordproJS } from "../src/index";

describe("ChordPro Directives", () => {
  let chordpro;

  beforeEach(() => {
    chordpro = new ChordproJS();
  });

  // Meta-data directives
  describe("Meta-data directives", () => {
    test("title directive", () => {
      const input = "{title: My Song}";
      const result = chordpro.parse(input);
      expect(result.title).toBe("My Song");
    });

    test("subtitle directive", () => {
      const input = "{subtitle: My Subtitle}";
      const result = chordpro.parse(input);
      expect(result.subtitle).toBe("My Subtitle");
    });

    test("artist directive", () => {
      const input = "{artist: John Doe}";
      const result = chordpro.parse(input);
      expect(result.artist).toBe("John Doe");
    });

    test("key directive", () => {
      const input = "{key: C}";
      const result = chordpro.parse(input);
      expect(result.key).toBe("C");
    });
  });

  // Environment directives
  describe("Environment directives", () => {
    test("start_of_chorus and end_of_chorus directives", () => {
      const input = "{start_of_chorus}\nChorus line\n{end_of_chorus}";
      const result = chordpro.parse(input);

      // Should have two sections: an empty verse (created by default) and a chorus
      expect(result.sections.length).toBe(3);
      expect(result.sections[1].type).toBe("chorus");
      expect(result.sections[1].lines[0].type).toBe("lyricLine");
      expect(result.sections[1].lines[0].content).toBe("Chorus line");
      expect(result.sections[2].type).toBe("verse");
    });

    test("soc and eoc directives (aliases)", () => {
      const input = "{soc}\nChorus line\n{eoc}";
      const result = chordpro.parse(input);

      expect(result.sections.length).toBe(3);
      expect(result.sections[1].type).toBe("chorus");
      expect(result.sections[1].lines[0].type).toBe("lyricLine");
      expect(result.sections[1].lines[0].content).toBe("Chorus line");
      expect(result.sections[2].type).toBe("verse");
    });
  });

  // Comment directive
  describe("Comment directive", () => {
    test("comment directive", () => {
      const input = "{comment: This is a comment}";
      const result = chordpro.parse(input);

      expect(result.sections[0].lines[0].type).toBe("comment");
      expect(result.sections[0].lines[0].content).toBe("This is a comment");
    });

    test("c directive (alias)", () => {
      const input = "{c: This is a comment}";
      const result = chordpro.parse(input);

      expect(result.sections[0].lines[0].type).toBe("comment");
      expect(result.sections[0].lines[0].content).toBe("This is a comment");
    });
  });

  // Chord lines
  describe("Chord lines", () => {
    test("chord line parsing", () => {
      const input = "[C]This is a [G]chord line";
      const result = chordpro.parse(input);

      expect(result.sections[0].lines[0].type).toBe("chordLine");
      expect(result.sections[0].lines[0].lyrics).toBe("This is a chord line");
      expect(result.sections[0].lines[0].chords).toEqual(["C", "G"]);
      expect(result.sections[0].lines[0].positions).toEqual([0, 10]);
    });
  });

  // Additional directives to implement and test
  describe("Additional directives to implement", () => {
    // These tests will initially fail and should be implemented

    test("start_of_verse and end_of_verse directives", () => {
      const input = "{start_of_verse}\nVerse line\n{end_of_verse}";
      const result = chordpro.parse(input);

      expect(result.sections.length).toBe(3);
      expect(result.sections[1].type).toBe("verse");
      expect(result.sections[1].lines[0].type).toBe("lyricLine");
      expect(result.sections[1].lines[0].content).toBe("Verse line");
    });

    test("sov and eov directives (aliases)", () => {
      const input = "{sov}\nVerse line\n{eov}";
      const result = chordpro.parse(input);

      expect(result.sections.length).toBe(3);
      expect(result.sections[1].type).toBe("verse");
      expect(result.sections[1].lines[0].type).toBe("lyricLine");
      expect(result.sections[1].lines[0].content).toBe("Verse line");
    });

    test("start_of_bridge and end_of_bridge directives", () => {
      const input = "{start_of_bridge}\nBridge line\n{end_of_bridge}";
      const result = chordpro.parse(input);

      expect(result.sections.length).toBe(3);
      expect(result.sections[1].type).toBe("bridge");
      expect(result.sections[1].lines[0].type).toBe("lyricLine");
      expect(result.sections[1].lines[0].content).toBe("Bridge line");
    });

    test("sob and eob directives (aliases)", () => {
      const input = "{sob}\nBridge line\n{eob}";
      const result = chordpro.parse(input);

      expect(result.sections.length).toBe(3);
      expect(result.sections[1].type).toBe("bridge");
      expect(result.sections[1].lines[0].type).toBe("lyricLine");
      expect(result.sections[1].lines[0].content).toBe("Bridge line");
    });

    test("capo directive", () => {
      const input = "{capo: 2}";
      const result = chordpro.parse(input);

      expect(result.capo).toBe("2");
    });

    test("tempo directive", () => {
      const input = "{tempo: 120}";
      const result = chordpro.parse(input);

      expect(result.tempo).toBe("120");
    });

    test("time directive", () => {
      const input = "{time: 4/4}";
      const result = chordpro.parse(input);

      expect(result.time).toBe("4/4");
    });

    test("year directive", () => {
      const input = "{year: 2023}";
      const result = chordpro.parse(input);

      expect(result.year).toBe("2023");
    });

    test("album directive", () => {
      const input = "{album: My Album}";
      const result = chordpro.parse(input);

      expect(result.album).toBe("My Album");
    });

    test("composer directive", () => {
      const input = "{composer: John Doe}";
      const result = chordpro.parse(input);

      expect(result.composer).toBe("John Doe");
    });

    test("copyright directive", () => {
      const input = "{copyright: 2023 John Doe}";
      const result = chordpro.parse(input);

      expect(result.copyright).toBe("2023 John Doe");
    });
  });

  // Font directives
  describe("Font directives", () => {
    test("textfont directive", () => {
      const input = "{textfont: Arial}";
      const result = chordpro.parse(input);

      expect(result.fonts.textfont).toBe("Arial");
    });

    test("chordfont directive", () => {
      const input = "{chordfont: Times New Roman}";
      const result = chordpro.parse(input);

      expect(result.fonts.chordfont).toBe("Times New Roman");
    });

    test("textsize directive", () => {
      const input = "{textsize: 14px}";
      const result = chordpro.parse(input);

      expect(result.fonts.textsize).toBe("14px");
    });

    test("chordsize directive", () => {
      const input = "{chordsize: 12px}";
      const result = chordpro.parse(input);

      expect(result.fonts.chordsize).toBe("12px");
    });

    test("textcolour directive", () => {
      const input = "{textcolour: blue}";
      const result = chordpro.parse(input);

      expect(result.fonts.textcolour).toBe("blue");
    });

    test("textcolor directive (US spelling)", () => {
      const input = "{textcolor: red}";
      const result = chordpro.parse(input);

      expect(result.fonts.textcolour).toBe("red");
    });

    test("chordcolour directive", () => {
      const input = "{chordcolour: green}";
      const result = chordpro.parse(input);

      expect(result.fonts.chordcolour).toBe("green");
    });

    test("chordcolor directive (US spelling)", () => {
      const input = "{chordcolor: purple}";
      const result = chordpro.parse(input);

      expect(result.fonts.chordcolour).toBe("purple");
    });

    test("multiple font directives", () => {
      const input = `{textfont: Arial}
{chordfont: Courier New}
{textsize: 16px}
{chordsize: 14px}
{textcolour: #333}
{chordcolour: #c00}`;
      const result = chordpro.parse(input);

      expect(result.fonts.textfont).toBe("Arial");
      expect(result.fonts.chordfont).toBe("Courier New");
      expect(result.fonts.textsize).toBe("16px");
      expect(result.fonts.chordsize).toBe("14px");
      expect(result.fonts.textcolour).toBe("#333");
      expect(result.fonts.chordcolour).toBe("#c00");
    });
  });
});

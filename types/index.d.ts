declare module "chordprojs" {
  export interface ChordproOptions {
    showTitle?: boolean;
    showSubtitle?: boolean;
    showComments?: boolean;
    showChords?: boolean;
    [key: string]: any;
  }

  export interface ParsedSong {
    title: string;
    subtitle: string;
    artist: string;
    sections: Section[];
    metadata: Record<string, string>;
  }

  export interface Section {
    type: string;
    lines: Line[];
  }

  export interface Line {
    type: "comment" | "chordLine" | "empty";
    content?: string;
    lyrics?: string;
    chords?: string[];
    positions?: number[];
  }

  export class ChordproJS {
    constructor(options?: ChordproOptions);
    parse(text: string): ParsedSong;
    renderToElement(text: string, element: HTMLElement | string): HTMLElement;
    renderToHTML(text: string): string;
    setOptions(options: ChordproOptions): ChordproJS;
    isChordPro(text: string): boolean;
    use(pluginName: string, options?: any): ChordproJS;

    static plugins: Record<string, any>;
    static registerPlugin(name: string, plugin: { install: Function }): void;
  }

  export function createChordproJS(options?: ChordproOptions): ChordproJS;
  export default createChordproJS;
}

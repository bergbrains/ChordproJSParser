import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/chordprojs.min.js",
      format: "umd",
      name: "ChordproJS",
      plugins: [terser()],
    },
    {
      file: "dist/chordprojs.esm.js",
      format: "es",
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extract: "dist/chordprojs.min.css",
      minimize: true,
    }),
  ],
};

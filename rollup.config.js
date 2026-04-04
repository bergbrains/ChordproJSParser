import  terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const isDev = process.env.ROLLUP_WATCH;

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/chordprojs.min.js",
      format: "umd",
      name: "ChordproJS",
      plugins: [terser()]
    },
    {
      file: "dist/chordprojs.esm.js",
      format: "es"
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    terser(),
    postcss({
      extract: "dist/chordprojs.min.css",
      minimize: true
    }),
    isDev && serve({
      contentBase: ["", "examples"],
      open: true,
      port: 3000,
      host: "localhost"
    }),
    isDev && livereload("dist")
  ]
};

// eslint.config.js
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  prettier,
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "tests/mocks/**",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        localStorage: "readonly",
        console: "readonly",
        JSON: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["error", "warn"] }],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      indent: ["error", 2],
      "comma-dangle": "off",
    },
  },
  {
    files: ["**/tests/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
];

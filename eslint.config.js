// eslint.config.js
import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  eslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      quotes: ["error", "single"],
      semi: ["error", "always"],
      indent: ["error", 2],
      "comma-dangle": ["error", "never"],
    },
  },
];

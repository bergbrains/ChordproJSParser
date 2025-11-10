// eslint.config.js
import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        window: "readonly",
        document: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        module: "readonly",
        define: "readonly",
        self: "readonly",
        exports: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      quotes: ["error", "double"],
      semi: ["error", "always"]
    }
  },
  prettier // This must be the last configuration in the array
];

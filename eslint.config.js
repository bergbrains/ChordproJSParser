// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
    quotes: ["error", "single"],
    semi: ["error", "always"],
    indent: ["error", 2],
    "comma-dangle": ["error", "never"],
  },
};

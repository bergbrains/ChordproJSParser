// eslint.config.js
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  prettier,
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'babel.config.js',
      'jest.config.js',
      'tests/mocks/**'
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
        describe: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2],
      'comma-dangle': ['error', 'never']
    }
  },
  {
    files: ['**/tests/**/*.js'],
    rules: {
      'no-console': 'off'
    }
  }
];

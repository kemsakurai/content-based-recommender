import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        console: 'readonly',
        // Mocha globals
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    rules: {
      'no-console': 0,
      'no-underscore-dangle': 0,
      'class-methods-use-this': 0,
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        console: 'readonly',
        // Mocha globals
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      'no-console': 0,
      'no-underscore-dangle': 0,
      'class-methods-use-this': 0,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'off' // TypeScriptでは型チェックでundefined変数を検出するため
    }
  },
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'dist/**'
    ]
  }
];

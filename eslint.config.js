const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
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
    ignores: [
      'node_modules/**',
      'coverage/**',
      'dist/**'
    ]
  }
];

const eslintPluginJest = require('eslint-plugin-jest');

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:vue/recommended', 'airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    $: true,
    _: true,
    Vue: true,
    Json: true,
    axios: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        paths: [
          './resources/js/',
          './vendor/fanswoo/framework-core/resources/js/',
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        moduleDirectory: ['node_modules'],
      },
      node: {
        paths: [
          './resources/js/',
          './vendor/fanswoo/framework-core/resources/js/',
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        moduleDirectory: ['node_modules'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.ts'],
      env: { jest: true },
      plugins: ['jest'],
      ...eslintPluginJest.configs.recommended,
    },
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'vue/html-indent': [
      'warn',
      2,
      {
        ignores: ['VAttribute', 'VElement'],
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    indent: 'off',
    'brace-style': 'off',
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-alert': 'off',
    'no-continue': 'off',
    'object-curly-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'operator-linebreak': 'off',
    'vue/attribute-hyphenation': ['warn', 'never'],
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 'off',
  },
};

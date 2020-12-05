module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-restricted-syntax': 0,
    'no-continue': 0,
    'no-param-reassign': 0,
  },
};

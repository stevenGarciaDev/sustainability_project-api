module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:prettier/recommended',
    'prettier/babel',
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    'prefer-destructuring': 'off',
    'no-shadow': 'off',
    radix: 'off',
  },
};

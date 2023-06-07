const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': isProd ? 'error' : 'off',
    'no-debugger': isProd ? 'error' : 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-async-promise-executor': 'off',
    'no-inner-declarations': 'off',
    'no-case-declarations': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)'],
    },
  ],
}
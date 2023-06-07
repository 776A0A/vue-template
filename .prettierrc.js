module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  printWidth: 80,
  jsxSingleQuote: true,
  overrides: [{ files: ['*.ts', '*.tsx'], options: { parser: 'typescript' } }],
  plugins: [require('prettier-plugin-tailwindcss')],
}

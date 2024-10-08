/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    curly: 'off',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    indent: ['warn', 2]
  }
}

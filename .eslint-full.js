module.exports = {
  plugins: [
    'jsdoc'
  ],
  extends: [
    '.eslintrc.js',
    'plugin:jsdoc/recommended',
  ],
  rules: {
    // no undefined type
    // https://github.com/gajus/eslint-plugin-jsdoc#user-content-eslint-plugin-jsdoc-rules-no-undefined-types
    'jsdoc/no-undefined-types': 'off',
    // tag lines
    // https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-tag-lines
    'jsdoc/tag-lines': ['error', 'any', {'startLines': 1}]
  }
};

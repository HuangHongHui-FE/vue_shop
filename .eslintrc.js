module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-tabs': 'off',
    'no-mixed-spaces-and-tabs':'off',
    'no-trailing-spaces':'off',
    'no-multiple-empty-lines':'off',
    'indent':'off',
    'space-before-function-paren':'off',
    'space-before-blocks':'off',
    'quotes': 'off',
    'spaced-comment':'off',
    'semi': 'off',
    'no-multi-spaces': 'off',
    'object-curly-spacing': 'off',
    'padded-blocks': 'off',
    'keyword-spacing': 'off',
    'eol-last': 'off'
  }
}

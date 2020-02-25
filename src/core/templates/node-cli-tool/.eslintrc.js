module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    'no-console': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
  },
}

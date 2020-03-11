module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    jest: true,
  },
  rules: {
    'no-console': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    'prefer-const': 0,
  },
}

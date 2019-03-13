module.exports = {
  extends: ['joblift/base', 'joblift/react', 'joblift/flowtype'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    PROD: false,
    SERVER: false,
  },
  rules: {
    'no-use-before-define': 0,
    'no-shadow': 0,
    'import/no-unresolved': 2,
  },
  settings: {
    'import/resolver': 'webpack',
  },
};

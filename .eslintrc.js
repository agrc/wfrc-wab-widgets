module.exports = {
  extends: 'agrc',
  rules: {
    indent: ['error', 2],
    'no-magic-numbers': 'off'
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  },
  env: {
    es6: true
  },
  ignorePatterns: [
    'widgets/LayerSelector/layer-selector/',
    'widgets/Sherlock/sherlock/',
    'widgets/Sherlock/spinjs/',
    'widgets/Sherlock/bootstrap/',
    'widgets/BetterAbout/setting/nls/',
    'widgets/BetterAbout/nls/',
    'widgets/BetterAbout/About/'
  ]
};

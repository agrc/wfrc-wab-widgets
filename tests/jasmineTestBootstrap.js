/* global JasmineFaviconReporter */
var dojoConfig = { // eslint-disable-line no-unused-vars
  baseUrl: '/node_modules',
  packages: ['dojo', 'dijit', {
    name: 'spec',
    location: '../dist/tests/spec'
  }, {
    name: 'widgets',
    location: '../dist/widgets'
  }]
};

// for jasmine-favicon-reporter
jasmine.getEnv().addReporter(new JasmineFaviconReporter());

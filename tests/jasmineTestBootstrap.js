/* global JasmineFaviconReporter */
var dojoConfig = { // eslint-disable-line no-unused-vars
  baseUrl: '/node_modules',
  packages: ['dojo', 'dijit', 'dojox', {
    name: 'spec',
    location: '../dist/tests/spec'
  }, {
    name: 'widgets',
    location: '../dist/widgets'
  }, {
    name: 'esri',
    location: 'arcgis-js-api'
  }]
};

// for jasmine-favicon-reporter
jasmine.getEnv().addReporter(new JasmineFaviconReporter());

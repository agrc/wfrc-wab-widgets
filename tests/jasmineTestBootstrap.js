/* global JasmineFaviconReporter */
var dojoConfig = { // eslint-disable-line no-unused-vars
  baseUrl: '/node_modules',
  packages: ['dojo', 'dijit', 'dojox', 'moment', {
    name: 'tests',
    location: '../dist/tests'
  }, {
    name: 'widgets',
    location: '../dist/widgets'
  }, {
    name: 'esri',
    location: 'arcgis-js-api'
  }]
};

// so that this will run on generic test pages such as DetailsTests.html
if (window.jasmine) {
  jasmine.getEnv().addReporter(new JasmineFaviconReporter());
}

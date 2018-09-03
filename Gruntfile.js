module.exports = function (grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);

  var appDir = '/Users/stdavis/WebAppBuilderForArcGIS/server/apps/2';
  var stemappDir = '/Users/stdavis/WebAppBuilderForArcGIS/client/stemapp';
  grunt.initConfig({
    babel: {
      main: {
        files: [{
          expand: true,
          src: [
            'widgets/*.js',
            'widgets/**/*.js',
            'widgets/**/**/*.js',
            'widgets/!**/**/nls/*.js',
            'themes/*.js',
            'themes/**/*.js',
            'themes/**/**/*.js',
            'themes/!**/**/nls/*.js',
            'tests/spec/**/*.js'
          ],
          dest: 'dist/'
        }]
      }
    },
    clean: {
      dist: {
        src: 'dist/*'
      }
    },
    connect: {
      uses_defaults: {} // eslint-disable-line camelcase
    },
    copy: {
      main: {
        src: [
          'widgets/**/**.html',
          'widgets/**/**.json',
          'widgets/**/**.css',
          'widgets/**/images/**',
          'widgets/**/nls/**',
          'themes/**/**.html',
          'themes/**/**.json',
          'themes/**/**.css',
          'themes/**/images/**',
          'themes/**/nls/**'
        ],
        dest: 'dist/',
        expand: true
      }
    },
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      main: {
        src: ['Gruntfile.js', 'widgets/**/*.js']
      }
    },
    jasmine: {
      main: {
        options: {
          specs: ['dist/tests/spec/Spec*.js'],
          vendor: [
            'node_modules/jasmine-favicon-reporter/vendor/favico.js',
            'node_modules/jasmine-favicon-reporter/jasmine-favicon-reporter.js',
            'tests/jasmineTestBootstrap.js',
            'node_modules/dojo/dojo.js',
            'tests/jasmineAMDErrorChecking.js'
          ],
          host: 'http://localhost:8000',
          keepRunner: true
        }
      }
    },
    sass: {
      dist: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          src: ['widgets/**/*.scss'],
          rename: function (dest, src) {
            return src.replace('scss', 'css');
          }
        }]
      }
    },
    sync: {
      main: {
        verbose: true,
        files: [{
          cwd: 'dist/',
          src: '**',
          dest: stemappDir
        }, {
          cwd: 'dist/',
          src: '**',
          dest: appDir
        }]
      }
    },
    watch: {
      main: {
        files: [
          'widgets/**',
          'themes/**',
          'tests/**'
        ],
        tasks: [
          'eslint',
          'clean',
          'sass',
          'babel',
          'copy',
          'jasmine:main:build',
          'sync'
        ],
        options: {
          spawn: false,
          atBegin: true,
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', ['connect', 'watch']);

  grunt.registerTask('test', ['clean', 'sass', 'babel', 'copy', 'connect', 'jasmine']);

  grunt.registerTask('travis', [
    'eslint',
    'test'
  ]);
};

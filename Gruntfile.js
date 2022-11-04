const sass = require('node-sass');

module.exports = function (grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);

  const appDir = '/Users/scottdavis/ArcGISWebAppBuilder/server/apps/2';
  const stemappDir = '/Users/scottdavis/ArcGISWebAppBuilder/client/stemapp';

  grunt.initConfig({
    babel: {
      main: {
        options: {
          sourceMap: true,
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: false,
                modules: false
              }
            ]
          ],
          plugins: [
            'transform-es2015-modules-simple-amd'
          ]
        },
        files: [{
          expand: true,
          src: [
            'widgets/*.js',
            'widgets/**/*.js',
            'widgets/**/**/*.js',
            '!widgets/**/**/nls/*.js',
            'themes/*.js',
            'themes/**/*.js',
            'themes/**/**/*.js',
            'themes/!**/**/nls/*.js',
            'tests/spec/**/*.js',
            '!widgets/BetterAbout/About/**',
            '!widgets/LayerSelector/layer-selector/**',
            '!widgets/Sherlock/sherlock/**',
            '!widgets/Sherlock/spinjs/**',
            '!widgets/Sherlock/bootstrap/**'
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
    compress: {
      BetterAbout: {
        options: {
          archive: 'BetterAbout.zip'
        },
        files: [{
          src: 'widgets/BetterAbout/**/**.*',
          dest: './',
          cwd: 'dist/',
          expand: true
        }]
      },
      ProjectInfo: {
        options: {
          archive: 'ProjectInfo.zip'
        },
        files: [{
          src: 'widgets/ProjectInfo/**/**.*',
          dest: './',
          cwd: 'dist/',
          expand: true
        }]
      },
      URLParams: {
        options: {
          archive: 'URLParams.zip'
        },
        files: [{
          src: 'widgets/URLParams/**/**.*',
          dest: './',
          cwd: 'dist/',
          expand: true
        }]
      },
      LayerSelector: {
        options: {
          archive: 'LayerSelector.zip'
        },
        files: [{
          src: 'widgets/LayerSelector/**/**.*',
          dest: './',
          cwd: 'dist/',
          expand: true
        }]
      },
      WFRCFilter: {
        options: {
          archive: 'WFRCFilter.zip'
        },
        files: [{
          src: 'widgets/WFRCFilter/**/**.*',
          dest: './',
          cwd: 'dist/',
          expand: true
        }]
      },
      Sherlock: {
        options: {
          archive: 'Sherlock.zip'
        },
        files: [{
          src: 'widgets/Sherlock/**/**.*',
          dest: './',
          cwd: 'dist/',
          expand: true
        }]
      }
    },
    connect: {
      uses_defaults: {} // eslint-disable-line camelcase
    },
    copy: {
      main: {
        src: [
          'widgets/BetterAbout/About/**/*.*',
          'widgets/LayerSelector/layer-selector/**',
          'widgets/Sherlock/sherlock/**',
          'widgets/Sherlock/spinjs/**',
          'widgets/Sherlock/bootstrap/**',
          'widgets/**/**.html',
          'widgets/**/**.json',
          'widgets/**/**.css',
          'widgets/**/images/**',
          'widgets/**/nls/**',
          'themes/**/**.html',
          'themes/**/**.json',
          'themes/**/**.css',
          'themes/**/images/**',
          'themes/**/nls/**',
          'tests/*.js',
          'tests/**/*.html',
          'tests/data/**/**.*'
        ],
        dest: 'dist/',
        expand: true
      }
    },
    eslint: {
      options: {
        overrideConfigFile: '.eslintrc'
      },
      main: {
        src: [
          'Gruntfile.js',
          'widgets/**/*.js',
          '!widgets/BetterAbout/About/**',
          '!widgets/BetterAbout/nls/**',
          '!widgets/BetterAbout/setting/nls/**',
          '!widgets/LayerSelector/layer-selector/**',
          '!widgets/Sherlock/sherlock/**',
          '!widgets/Sherlock/spinjs/**',
          '!widgets/Sherlock/bootstrap/**'
        ]
      }
    },
    jasmine: {
      main: {
        options: {
          specs: ['dist/tests/spec/SpecAll.js'],
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
          implementation: sass,
          sourceMap: true
        },
        files: [{
          expand: true,
          src: ['widgets/**/*.scss', '!widgets/BetterAbout/About/**/*.*'],
          rename: function (dest, src) {
            return src.replace('scss', 'css');
          }
        }]
      }
    },
    sync: {
      main: {
        files: [{
          cwd: 'dist/',
          src: '**',
          dest: stemappDir
        }, {
          cwd: 'dist/',
          src: '**',
          dest: appDir
        }]
      },
      layerSelector: {
        files: [{
          cwd: 'node_modules/layer-selector',
          src: ['*.js', 'resources/**', 'templates/**'],
          dest: 'widgets/LayerSelector/layer-selector/'
        }],
        compareUsing: 'md5'
      },
      sherlock: {
        files: [{
          cwd: 'node_modules/@agrc/sherlock',
          src: ['**/*.js', 'resources/**', 'templates/**'],
          dest: 'widgets/Sherlock/sherlock/'
        }],
        compareUsing: 'md5'
      },
      spinjs: {
        files: [{
          cwd: 'node_modules/spin.js',
          src: ['*.js', '*.css'],
          dest: 'widgets/Sherlock/spinjs/'
        }],
        compareUsing: 'md5'
      },
      bootstrap: {
        files: [{
          cwd: 'node_modules/bootstrap/dist',
          src: ['**/*.*'],
          dest: 'widgets/Sherlock/bootstrap/'
        }],
        compareUsing: 'md5'
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

  grunt.registerTask('default', ['connect', 'sync:layerSelector', 'sync:sherlock', 'watch']);

  grunt.registerTask('test', ['clean', 'sass', 'babel', 'copy', 'connect', 'jasmine']);

  grunt.registerTask('test-ci', [
    'eslint',
    'test'
  ]);

  grunt.registerTask('deploy', ['copy', 'compress']);
};

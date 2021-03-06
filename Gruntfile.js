module.exports = function (grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);

  const appDir = '/Users/stdavis/WebAppBuilderForArcGIS/server/apps/6';
  const stemappDir = '/Users/stdavis/WebAppBuilderForArcGIS/client/stemapp';
  const bumpFiles = ['package.json', 'package-lock.json', 'widgets/*/manifest.json'];

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
    bump: {
      options: {
        files: bumpFiles,
        commitFiles: bumpFiles.concat([
          'ProjectInfo.zip',
          'BetterAbout.zip',
          'URLParams.zip',
          'LayerSelector.zip',
          'WFRCFilter.zip',
          'Sherlock.zip'
        ]),
        pushTo: 'origin'
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
    conventionalGithubReleaser: {
      options: {
        auth: {
          type: 'oauth',
          token: process.env.CONVENTIONAL_GITHUB_RELEASER_TOKEN
        },
        changelogOpts: {
          preset: 'angular',
          draft: true
        }
      },
      main: {}
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
        configFile: '.eslintrc'
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

  grunt.registerTask('travis', [
    'eslint',
    'test'
  ]);

  grunt.registerTask('release', function (bumpType) {
    grunt.task.run('test');
    grunt.task.run(`bump-only:${bumpType || 'patch'}`);
    grunt.task.run(['copy', 'compress', 'bump-commit', 'conventionalGithubReleaser']);
  });
};

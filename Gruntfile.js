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
            'themes/!**/**/nls/*.js'
          ],
          dest: 'dist/'
        }]
      }
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
    clean: {
      dist: {
        src: 'dist/*'
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
          'themes/**'
        ],
        tasks: [
          'eslint',
          'clean',
          'sass',
          'babel',
          'copy',
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
  grunt.registerTask('default', ['watch']);
};

/*
 * grunt-htmlrender
 * https://github.com/skuligowski/grunt-htmlrender
 *
 * Copyright (c) 2014 Sebastian Kuligowski
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    htmlrender: {
      render_vars: {
        options: {
          src: ['test/fixtures/render_vars/**/*.html'],
          vars: {
            myVar: 'OK var',
            myVarFn: function() {
              return 'OK function';
            }
          }
        },
        files: {
          'tmp/render_vars/vars.html': 'test/fixtures/render_vars/vars.html',
          'tmp/render_vars/fn.html': 'test/fixtures/render_vars/fn.html'
        }
      },
      include: {
        options: {
          src: ['test/fixtures/include/**/*.html'],
          vars: {}
        },
        files: {
          'tmp/include/include_flat.html': 'test/fixtures/include/include_flat.html'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'htmlrender', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};

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
          'tmp/render_vars/render_vars.html': 'test/fixtures/render_vars/render_vars.html',
          'tmp/render_vars/render_fn.html': 'test/fixtures/render_vars/render_fn.html',
          'tmp/render_vars/render_in_partials.html': 'test/fixtures/render_vars/render_in_partials.html'
        }
      },
      include: {
        options: {
          src: ['test/fixtures/include/**/*.html'],
          vars: {}
        },
        files: {
          'tmp/include/include_flat.html': 'test/fixtures/include/include_flat.html',
          'tmp/include/include_relative.html': 'test/fixtures/include/include_relative.html',
          'tmp/include/include_multiple.html': 'test/fixtures/include/include_multiple.html'
        }
      },
      include_nested: {
        options: {
          src: ['test/fixtures/include_nested/**/*.html'],
          vars: {}
        },
        files: {
          'tmp/include_nested/nested_partials.html': 'test/fixtures/include_nested/nested_partials.html',
          'tmp/include_nested/include_back.html': 'test/fixtures/include_nested/include_back.html'
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

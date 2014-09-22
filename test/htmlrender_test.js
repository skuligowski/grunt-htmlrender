'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var begin = function(test, fixture) {
  var testObj = {
    assert: function(file, info) {
      var actual = grunt.file.read('tmp/' + fixture + '/' + file);
      var expected = grunt.file.read('test/expected/' + fixture + '/' + file);
      test.equal(actual, expected, info);
      return testObj; 
    },
    done: function() {
      test.done();
    }
  };
  return testObj;
};

exports.htmlrender = {
  render_vars: function(test) {
    begin(test, 'render_vars')
      .assert('render_vars.html', 'should render simple variable')
      .assert('render_fn.html', 'should render fn result')
      .assert('render_in_partials.html', 'should render simple variable in partial')
      .done();    
  },
  include: function(test) {
    begin(test, 'include')
      .assert('include_flat.html', 'should include the file in the same directory')
      .assert('include_relative.html', 'should include the file from partials directory')
      .assert('include_multiple.html', 'should include multiple partials')
      .done();    
  },
  include_nested: function(test) {
    begin(test, 'include_nested')
      .assert('nested_partials.html', 'should include partials that include other partials')
      .assert('include_back.html', 'should include partials that are relative')
      .done();    
  }
};

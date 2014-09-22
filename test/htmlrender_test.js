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
      .assert('vars.html', 'should render simple variable')
      .assert('fn.html', 'should render fn result')
      .done();    
  },
  include: function(test) {
    begin(test, 'include')
      .assert('include_flat.html', 'should include the file in the same directory')
      .done();    
  }
};

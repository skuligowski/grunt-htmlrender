/*
 * grunt-htmlrender
 * https://github.com/skuligowski/grunt-htmlrender
 *
 * Copyright (c) 2014 Sebastian Kuligowski
 * Licensed under the MIT license.
 */

'use strict';


module.exports = function(grunt) {

  var fs = require('fs'),
      path = require('path'),
      _ = require('lodash-node');
  
  var varsCache = {},
      partialsCache = {},
      
      includeRegExp = new RegExp("<%include([^>]+)%>", "gim"),
      templateRegExp = new RegExp("<%template([^>]+)%>", "gim");

  var getAttr = function(attr, content) {
    var regExp = new RegExp(attr + '="([0-9a-zA-Z\/_.-]+)"');
    var attrMatch = content.match(regExp);
    if (!attrMatch) {
      return null;
    }
    
    return attrMatch[1];          
  };

  var renderTemplates = function(html) {
    return html.replace(templateRegExp, function(all, content) {
      var id = getAttr('id', content),
        src = getAttr('src', content);
      
      return '<script id="' + id + '" type="text/ng-template"><%include src="' + src + '"%></script>';
    });   
  };

  var renderData = function(html) {
    _.forEach(varsCache, function(value, prop) {
      var re = new RegExp('<%=\\s*'+prop+'\\s*%>', 'g');          
      html = html.replace(re, value);
    });
    return html;
  };

  var refreshPartials = function(files) {
    var modifiedPartials = [];
    _.forEach(files, function(partialPath) {
      var mtime = fs.statSync(partialPath).mtime,
        currentPartial = partialsCache[partialPath];

      if (!currentPartial || currentPartial.mtime < mtime) {
        var partial = fs.readFileSync(partialPath);
        partialsCache[partialPath] = {
          content: renderTemplates(renderData(partial.toString())),
          mtime: mtime
        };
        modifiedPartials.push(partialPath);
        grunt.log.writeln('Refreshing ' + partialPath);       
      }
    });
    return modifiedPartials.length > 0;
  };
  
  var includeFile = function(dir, html) {
    var matches = html.match(includeRegExp);

    if (!matches) {
      return html;
    }

    for(var i = 0, max = matches.length; i < max; i++) {
      var src = getAttr('src', matches[i]),
        partialPath = path.join(dir, src),
        partial = partialsCache[partialPath];
      
      if (typeof partial !== "undefined") {     
        var partialContent = includeFile(path.dirname(partialPath), partial.content);
        html = html.replace(matches[i], partialContent);
      } else {
        grunt.log.warn('Partial not found: ' + partialPath);
      }
    }

    return html;
  };

  var renderPartial = function(partialPath) {
    var partial = partialsCache[partialPath];
    if (!partial) {
      grunt.fail.fatal('Partial ' + partialPath + ' not found!');
    }
    return includeFile(path.dirname(partialPath), partial.content);
  };

  var evaluateVars = function(vars) {
    var oldVars = _.clone(varsCache);
    varsCache = {};
    _.forEach(vars, function(value, paramName) {
      varsCache[paramName] = _.isFunction(value) ? value() : value;
    });
    return !_.isEqual(oldVars, varsCache);
  };


  grunt.registerMultiTask('htmlrender', 'Renders html by including its partials', function() {
    var options = this.options({
      src: '*.html',
      vars: {}    
    });
    
    var varsChanged = evaluateVars(options.vars);
    if (varsChanged) {
      partialsCache = {};
    }

    var partialsChanged = refreshPartials(grunt.file.expand(options.src));
    if (!partialsChanged) {
      grunt.log.ok('Nothing changed, exiting...');
      return;
    }

    this.files.forEach(function(f) {
      if (f.src.length > 1) {
        grunt.fail.fatal('Only one file can be rendered, ' + f.orig.src + ' found.');
      }

      if (f.src.length === 0) {
        grunt.fail.fatal(f.orig.src + ' not found!');
      }

      grunt.file.write(f.dest, renderPartial(f.src[0]));
      grunt.log.ok(f.src[0] + ' was successfuly rendered.');
    });
  });
};

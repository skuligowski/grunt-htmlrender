/*
 * grunt-htmlrender
 * https://github.com/skuligowski/grunt-htmlrender
 *
 * Copyright (c) 2014 Sebastian Kuligowski
 * Licensed under the MIT license.
 */

'use strict';


var fs = require('fs'),
  path = require('path'),
  _ = require('lodash-node'),
  data = {},
  srcDir = path.join('src'), 
  partialExt = '.html',
  partialsCache = {};


var includeRegExp = new RegExp("<%include([^>]+)%>", "gim");
var templateRegExp = new RegExp("<%template([^>]+)%>", "gim");

var getAttr = function(attr, content) {
  var regExp = new RegExp(attr + '="([0-9a-zA-Z\/_.-]+)"');
  var attrMatch = content.match(regExp);
  if (!attrMatch) {
    return null;
  }
  
  return attrMatch[1];          
};

var renderData = function(html, data) {
  if (!data) {
    return html;
  }

  for(var prop in data) {
    if (data.hasOwnProperty(prop)) {
      var re = new RegExp('<%=\\s*'+prop+'\\s*%>', 'g'),
          value = data[prop];

      html = html.replace(re, typeof value === 'function' ? value() : value);
    }
  }
  return html;
};

var renderTemplates = function(html) {
  return html.replace(templateRegExp, function(all, content) {
    var id = getAttr('id', content),
      src = getAttr('src', content);
    
    return '<script id="' + id + '" type="text/ng-template"><%include src="' + src + '"%></script>';
  });   
};



var evaluateData = function(data) {
  var outData = {};
  _.forEach(data, function(value, paramName) {
    outData[paramName] = _.isFunction(value) ? value() : value;
  });
  return outData;
};










module.exports = function(grunt) {

  var refreshPartials = function(files) {
    var modifiedPartials = [];
    _.forEach(files, function(partialPath) {
      var mtime = fs.statSync(partialPath).mtime,
        currentPartial = partialsCache[partialPath];

      if (!currentPartial || currentPartial.mtime < mtime) {
        var partial = fs.readFileSync(partialPath);
        partialsCache[partialPath] = {
          content: renderTemplates(renderData(partial.toString(), data)),
          mtime: mtime
        };
        modifiedPartials.push(partialPath);
        grunt.log.writeln('Refreshing ' + partialPath);       
      }
    });
    return modifiedPartials;
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



  grunt.registerMultiTask('htmlrender', 'Renders html by including its partials', function() {
    
    var options = this.options({
      src: '*.html'      
    });

    var partials = grunt.file.expand(options.src);
    refreshPartials(partials);

    this.files.forEach(function(f) {

      if (f.src.length !== 1) {
        grunt.fail.fatal('Only one file can be rendered, ' + f.orig.src + ' found.');
      }

      grunt.file.write(f.dest, renderPartial(f.orig.src[0]));
      grunt.log.ok(f.orig.src[0] + ' was successfuly rendered.');

    });
  });

};

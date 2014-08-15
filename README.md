# grunt-htmlrender

> Renders html by including its partials

## About
Organize your project by creating small partials (html files). Then compose your output html file by including those partials into that one. This is the common way how server-side templating engines (eg. PHP, JSP, Freemarker etc.) work. Now the same thing you can do on the client side. 

## Getting started
Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-htmlrender');
```

## The "htmlrender" task

### Overview
In your project's Gruntfile, add a section named `htmlrender` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  htmlrender: {
    build: {
      options: {
        src: ['src/**/*.html'],
        vars: {
          myVariable: 'someValue'
        }
      },
      files: [{
        expand: true,
        cwd: 'src',
        src: ['*.html'],
        dest: 'dist',
        ext: '.html'
      }]
    },
  },
});
```

### Options

#### options.src
Type: `String`
Default value: `*.html`

All partials that should be used to compose output html file.

#### options.vars
Type: `Object`
Default value: `{}`

Variaiables that you can put inside your partial files. After rendering output html those variables will be interpolated with values from the object.

```js
vars: {
  myVariable: 'someValue'
}
```

```html
<div><%=myVariable%></div>
```

will generate:

```html
<div>someValue</div>
```

The interpolation of variables is usually used to replace some paths inside of the html file (such as scripts path, css path etc).


### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  htmlrender: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  htmlrender: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

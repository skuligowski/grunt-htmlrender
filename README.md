# grunt-htmlrender

> Renders html by including its partials

## About
Organize your project by creating small partials (html files). Then include those partials into the one html output file by using `<%include src="path/to/partial.html"%>` macro. This is the common way how a server-side templating engines  work (eg. PHP, JSP, Freemarker etc.). Now the same thing you can do on the client side, just after saving your document.

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

Variables that you can put inside your partial files: `<%=myVariable%>`. After rendering the output html those variables will be interpolated with the values from defined `vars` object.

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

Instead of any hardcoded value you can use a function for the interpolation process:

```js
vars: {
  lastChange: function() {
    return formatCurrentDate(new Date());
  }
}
```

#### options.files
Type: `List`

The list of output files that this task should generate in their destinations.

### Usage Examples

#### Default Options
In this example, there is `index.html` file and one partial file `tpl/partial.html`. 

```html
<div>Hello world</div>
<div>
  <%include src="tpl/partal.html"%>
</div>
```

```html
<div class="partial">Hello, I'm the partial</div>
```

```js
grunt.initConfig({
  htmlrender: {
    build: {
      options: {
        src: ['tpl/*.html']
      },
      files: [{
        expand: true,
        cwd: 'src',
        src: ['index.html'],
        dest: 'dist',
        ext: '.html'
      }]
    },
  },
});
```

After interpolation you will find `dist/index.html` with the following content:

```html
<div>Hello world</div>
<div>
  <div class="partial">Hello, I'm the partial</div>
</div>
```


## Release History
_(Nothing yet)_

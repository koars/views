koars-views
===========
[![Build Status](https://img.shields.io/travis/koars/views.svg?style=flat)](https://travis-ci.org/koars/views)

This module provides the server-side view component of the `koars` framework.

Concept
-------
This module assumes a view consist of two components, a template and some data to render into this template. If we define both of these independently, we can render the view on either the server or the client.

In addition it allows to define a static frame for your webpage which will not change (such as the `<html></html>` tags etc.) as well as a layout which wraps all views (header, footer etc.).

By doing all of this, a client may request a rendered page, only the templates, only data or a combination of them.

Implementation
--------------
To achieve this, we first define a folder to read our views from:

	var app = require('koa')();
	var views = require('koars-views');
	app.use(views('path/to/views'));

Now you can render a view like this:

	app.use(function *() {
		yield this.view('myView');
	});

The used template engine is [handlebars](https://github.com/wycats/handlebars.js).

### Definitions
#### Frame
To define a frame (everything that is outside your body and therefore static), you should create a file named `frame.hbs` inside your views folder. The layout will be rendered into the frames body tag.

You may supply an optional `frame.js` file, whose exported data will be rendered into the template. This data has to be static and can be used for things like a root path to your application or the title of your app.

This frame will also not be rerendered on the client side, so keep this in mind when constructing your sites templates.

#### Layout
To define a layout, you should create a `layout.hbs` file in your views folder. This file should contain an html comment `<!-- view -->` into which we will render your views.

Similarly to your frame, you may also supply a `layout.js` file, to provide data used by your layout or all your views (e.g. the current login status). This file should export a yieldable, so we can reload this data on each request.

#### View
Views are defined almost identical to your layout, with the exception that they get their own folder and the file names for template and data provider should be `template.hbs` and `data.js` respectively.

You may access the layouts data from your view via `{{../someProperty}}` and the frames can be reached via `{{../../someFrameProperty}}`. Similarly the layout has to reach up only one level to get the frames data.

### Rendering
By default, the `.view()` method will render templates into each other and serve them to the client as html. To override this behaviour, the client may set the 'Accepts' header to the following values:

* `application/json`: Returns the data as a json string
* `text/x-handlebars-template`: Returns a json

### Quirks
#### Request-Path
Due to the fact, that browsers do not inform ajax requests about redirects, you may run into problems when redirecting on the server side.
To help against this, the middleware assigns a `Request-Path` header to all responses which simply contains the requested path.
The client can then check the requested path against the header to detect any redirects

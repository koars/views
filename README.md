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

The used template engine is [handlebars](https://github.com/wycats/handlebars).

### Definitions
#### Frame
To define a frame (everything that is outside your body and therefore static), you should create a file named `frame.hbs` inside your views folder.
This frame should contain a `{{{body}}}` tag into which the layout as well as the view will be rendered into.

You may supply an optional `frame.js` file, whose exported data will be rendered into the template.

#### Layout
To define a layout, you should create a `layout.hbs` file in your views folder. This file should also contain a `{{{body}}}` tag to later render the view into.

Similarly to your frame, you may also supply a `layout.js` file, to provide data used by your layout or all your views (e.g. the current login status). This file should export a yieldable, so we can reload this data on each request.

#### View
Views are defined almost identical to your layout, with the exception that they get their own folder and the file names for template and data provider should be `template.hbs` and `data.js` respectively.

To allow access to the layouts and frames data, to your view, he properties `layout` and `frame` of your data have their values set to the corresponding objects.

	The following outputs data from your view:
	{{name}}
	This comes from your layout:
	{{layout.name}}
	And this from your frame:
	{{frame.name}}

Similarly, the frames data is available to the layout.

### Rendering
By default, the `.view()` method will render templates into each other and serve them to the client as html. To override this behaviour, the client may provide a `format` query parameter consisting of any combination of the following letters:

* `d`: Data
* `f`: Frame Template
* `l`: Layout Template
* `v`: View Template

This will prompt the middleware to send a json object with the corresponding data, so `format=dflv` would yield the following response:

	{
		data: {
			view: {},
			frame: {},
			layout: {}
		},
		frame: '',
		layout: '',
		view: ''
	}

### Quirks
#### Request-Path
Due to the fact, that browsers do not inform ajax requests about redirects, but you may need to utilize redirects server side, this middleware also assigns a `Request-Path` header to all responses which contains the requests path.
This allows the client to simply check the requested path against the header to detect any redirects.

#### `format` and redirects
Another problem regarding redirects is, that we lose our `format` parameter and therefore also our output format. To alleviate this, our middleware also monkey-patches koa's `.redirect()` method to transition the parameter.

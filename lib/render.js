var _ = require('lodash');
var koars = require('koars-utils')({module: 'views'});

module.exports = function *renderView(load, name, params) {
	var format = this.request.query.format;
	var view = yield load.view(name);
	var layout = yield load.layout();
	var frame = yield load.frame();

	var page = '{{#with layout}}' + layout.template.replace('<!-- view -->', '{{#with view}}' + view.template + '{{/with}}') + '{{/with}}';

	function *compileData() {
		var viewData = yield view.data.apply(this, params);
		var layoutData = yield layout.data.call(this);

		layoutData.view = _.merge({}, frame.data, layoutData, viewData);
		frame.data.layout = layoutData;

		return frame.data;
	}

	if(this.accepts('html')) {
		var data = yield compileData();

		page = frame.template.replace(/<body>[\s\S]*<\/body>/, '<body>' + page + '</body>');

		this.body = koars.hbs.compile(page)(data);
	} else if (this.accepts('json')) {
		this.body = yield compileData();
	} else if (this.accepts('text/x-handlebars-template')) {
		this.body = page;
	} else {
		this.status = 406;
	}

	koars.log.debug('Rendered View', {name: name, format: format});
};

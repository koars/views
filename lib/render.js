var koars = require('koars-utils')({module: 'views'});

module.exports = function *renderView(load, name, params) {
	var format = this.request.query.format;
	var view = yield load.view(name);
	var layout = yield load.layout();
	var frame = yield load.frame();

	if(!format || format.length === 0) {
		var dataView = yield view.data.apply(this, params);
		var dataLayout = yield layout.data.call(this);
		var dataFrame = frame.data;

		dataLayout.frame = dataFrame;
		dataView.layout = dataLayout;

		dataLayout.body = koars.hbs.compile(view.template)(dataView);
		dataFrame.body = koars.hbs.compile(layout.template)(dataLayout);

		this.body = koars.hbs.compile(frame.template)(dataFrame);
	} else {
		var data = {};

		if(format.indexOf('d') !== -1) {
			data.data = {
				view: yield view.data.apply(this, params),
				layout: yield layout.data.call(this),
				frame: frame.data
			};
		}

		if(format.indexOf('t') !== -1) {
			data.template = view.template;
		}

		if(format.indexOf('l') !== -1) {
			data.layout = layout.template;
		}

		if(format.indexOf('f') !== -1) {
			data.frame = frame.template;
		}

		this.body = data;
	}

	koars.log.debug('Rendered View', {name: name, format: format});
};

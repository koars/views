var loadView = require('./lib/load.js');
var renderView = require('./lib/render.js');

module.exports = function(folder) {
    var load = loadView(folder);

    return function *(next) {
		var redirect = this.redirect;

		//Monkeypatch redirect to preserve our format parameter
		this.redirect = function(path, alt) {
            var uri = url.parse(path);
            delete uri.search;

            uri.query = querystring.parse(url.query);
            uri.query.format = this.request.query.format;

			redirect.call(this, url.format(url), alt);
		};

        //Set a Request-Path header, so the client side code can track redirects
		this.set('Request-Path', this.path);
        this.view = renderView.bind(this, load);

        yield next;
    };
};

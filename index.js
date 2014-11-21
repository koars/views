var loadView = require('./lib/load.js');
var renderView = require('./lib/render.js');

module.exports = function(folder) {
    var load = loadView(folder);

    return function *(next) {
        //Set a Request-Path header, so the client side code can track redirects
		this.set('Request-Path', this.path);
        this.view = renderView.bind(this, load);

        yield next;
    };
};

var bluebird = require('bluebird');
var path = require('path');
var fs = bluebird.promisifyAll(require('fs'));
var koars = require('koars-utils')({module: 'views'});

module.exports = function(folder) {
    var cache = {};

    return {
        view: function *loadView(name) {
            if(koars.dev() || !cache[name]) {
                var data, template = yield fs.readFileAsync(path.join(folder, name, 'template.hbs'), 'utf8');
                try {
                    data = require(path.join(process.cwd(), folder, name, 'data.js'));
                } catch(e) {
                    if(e.code === 'MODULE_NOT_FOUND') {
                        data = function *() {return {};};
                    } else {
                        throw e;
                    }
                }

                cache[name] = {
                    template: template,
                    data: data
                };
            }

            return cache[name];
        },
        layout: function *loadLayout() {
            if(koars.dev() || !cache.layout) {
                var data, template = yield fs.readFileAsync(path.join(folder, 'layout.hbs'), 'utf8');
                try {
                    data = require(path.join(process.cwd(), folder, 'layout.js'));
                } catch(e) {
                    if(e.code === 'MODULE_NOT_FOUND') {
                        data = function *() {return {};};
                    } else {
                        throw e;
                    }
                }

                cache.layout = {
                    template: template,
                    data: data
                };
            }

            return cache.layout;
        },
        frame: function *loadFrame() {
            if(koars.dev() || !cache.frame) {
                var data, template = yield fs.readFileAsync(path.join(folder, 'frame.hbs'), 'utf8');
                try {
                    data = require(path.join(process.cwd(), folder, 'frame.js'));
                } catch(e) {
                    if(e.code === 'MODULE_NOT_FOUND') {
                        data = function *() {return {};};
                    } else {
                        throw e;
                    }
                }

                cache.frame = {
                    template: template,
                    data: data
                };
            }

            return cache.frame;
        }
    };
};

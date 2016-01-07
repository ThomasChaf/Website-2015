'use strict';

/*jslint bitwise: true */
/* global Raytracer, AjaxForm */
window.Raytracer = {

    Object: function(selector) {
        var self = this;
        self.selector = selector;
        self.drawer = new Raytracer.Drawer(selector.mainCanvas);
        self.websocket = null;

        self.init = function() {
            self.form = AjaxForm.create('http://localhost:4000/scene', self.onformresponse, self.onformerror);
        };

        self.resolve = function(scene) {
            self.form.submit(scene);
        };

        self.onformresponse = function() {
            self.websocket = new Raytracer.Websocket('ws://localhost:4000/websocket', {
                onmessage : self.onwsmessage,
                onclose : self.onwsclose
            });
        };

        self.onformerror = function(result) {
            console.log('Error server side:');
            console.log(result.detail.error);
        };

        self.onwsmessage = function(data) {
            console.log(data);
            for (var j = 0; j < data.length; j += 7) {
                var index = 0;
                for (var i = 0; i < 4; i++) {
                    index = index << 8;
                    index += data[j + i];
                }
                self.drawer.setPixel(index, data[j + 4], data[j + 5], data[j + 6]);
            }
            self.drawer.draw();
        };

        self.init();
    },

    create: function(selector) {
        return new window.Raytracer.Object(selector);
    }
};

'use strict';

/*jslint bitwise: true */
/* global Raytracer */
window.Raytracer = {

    Object: function(url, selector) {
        var self = this;
        self.drawer = new Raytracer.Drawer(selector.mainCanvas);
        self.selector = selector;
        self.websocket = null;

        self.resolve = function() {
            var send = false;
            self.selector.form.submit();
            self.selector.form.addEventListener('iron-form-response', function() {
                if (send === false) {
                    self.websocket = new Raytracer.Websocket(url, {
                        onmessage : self.onmessage,
                        onclose : self.onclose
                    });
                }
                send = true;
            });
        };

        self.onmessage = function(data) {
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
    },

    create: function(url, selector) {
        return new window.Raytracer.Object(url, selector);
    }
};

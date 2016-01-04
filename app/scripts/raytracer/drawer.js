/* global Canvas */
var Drawer = function(mainCanvas) {
    'use strict';
    var self = this;

    self.init = function(mainCanvas) {
        self.mainCanvas = Canvas.createFromElem(mainCanvas);
    };

    self.setPixel = function(index, r, g, b) {
        self.mainCanvas.setRGBPixel(index * 4, r, g, b);
    };

    self.draw = function() {
        self.mainCanvas.putImageData(0, 0);
    };

    self.init(mainCanvas);
};

window.Raytracer.Drawer = Drawer;

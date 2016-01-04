'use strict';

/* global Canvas */
window.Canvas = {

    Object: function(context, width, height) {
        var self = this;

        self.init = function (context, width, height) {
            self.context = context;
            self.width = width;
            self.height = height;
            self.imageData = self.context.createImageData(width, height);
        };

        self.setImageData = function(imageData) {
            self.imageData = imageData;
        };

        self.setRGBPixel = function(index, r, g, b) {
            self.imageData.data[index + 0] = r;
            self.imageData.data[index + 1] = g;
            self.imageData.data[index + 2] = b;
            self.imageData.data[index + 3] = 255;
        };

        self.getRGBPixel = function(x, y) {
            var index = (x + y * self.width) * 4;

            return [
                self.imageData.data[index + 0],
                self.imageData.data[index + 1],
                self.imageData.data[index + 2],
                self.imageData.data[index + 3]
            ];
        };

        self.fill = function(r, g, b) {
            var i = 0,
                j,
                index;

            while (i < self.height) {
                j = 0;
                while (j < self.width) {
                    index = (j + i * self.width) * 4;
                    self.setRGBPixel(index, r, g, b);
                    j += 1;
                }
                i += 1;
            }
        };

        self.putImageData = function(x, y) {
            self.context.putImageData(self.imageData, x, y);
        };

        self.init(context, width, height);

    },

    create: function(context, width, height) {
        return new Canvas.Object(context, width, height);
    },

    createFromElem: function(element) {
        return Canvas.create(
            element.getContext('2d'),
            element.width,
            element.height
        );
    }

};

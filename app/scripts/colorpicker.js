'use strict';

/* global MyImage */
window.MyImage = {

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
        return new MyImage.Object(context, width, height);
    }

};

/* global Colorpicker */
window.Colorpicker = {

    Object: function(selector) {
        var self = this;

        self.init = function(selector) {
            self.pixmap = selector.pixmap;
            self.picker = selector.picker;
            self.inputs = selector.inputs;
            self.ecolor = selector.ecolor;

            self.imagePicker = self.createImageByElem(self.picker);
            self.imagePixmap = self.createImageByElem(self.pixmap);
            self.imageEcolor = self.createImageByElem(self.ecolor);

            self.setPixmap();
            self.inputElem = {
                h : selector.hh,
                r : selector.rr,
                g : selector.gg,
                b : selector.bb
            };
        };

        self.setColor = function(r, g, b, isOnPicker) {
            var hexaColor = self.colorInHexa(r, g, b);

            if (!isOnPicker)
                self.setPicker(r, g, b);
            self.setEcolor(r, g, b);

            self.inputElem.r.set('value', r);
            self.inputElem.g.set('value', g);
            self.inputElem.b.set('value', b);
            self.inputElem.h.set('value', hexaColor);
        };

        self.createImageByElem = function(element) {
            return MyImage.create(
                element.getContext('2d'),
                element.width,
                element.height
            );
        };

        self.setPixmap = function() {
            var y = 0;
            var R = 255;
            var G = 0;
            var B = 0;
            var stateR = 4;
            var stateG = 2;
            var stateB = 0;
            var ar = [0, 0, 255 / (self.imagePixmap.height / 6), 0, 0, -255 / (self.imagePixmap.height / 6)];
            var index;

            while (y < self.imagePixmap.height) {
                var x = 0;
                while (x < self.imagePixmap.width) {
                    index = (x + y * self.imagePixmap.width) * 4;
                    self.imagePixmap.setRGBPixel(index, R, G, B);
                    x += 1;
                }
                R += ar[stateR];
                G += ar[stateG];
                B += ar[stateB];
                y += 1;
                if (y % (self.imagePixmap.height / 6) === 0) {
                    stateR = (stateR + 1) % 6;
                    stateG = (stateG + 1) % 6;
                    stateB = (stateB + 1) % 6;
                    R = stateR < 3 ? 0 : 255;
                    G = stateG < 3 ? 0 : 255;
                    B = stateB < 3 ? 0 : 255;
                }
            }
            self.imagePixmap.putImageData(0, 0);
        };

        self.setPicker = function(red, green, blue) {
            var R = 255, G = 255, B = 255,
                x = 0,
                RBlack, GBlack, BBlack,
                index;

            while (x < self.imagePicker.width) {
                var y = 0;

                RBlack = R; GBlack = G; BBlack = B;
                while (y < self.imagePicker.height) {
                    index = (x + y * self.imagePicker.width) * 4;
                    self.imagePicker.setRGBPixel(index, RBlack, GBlack, BBlack);
                    y += 1;
                    RBlack -= R / self.imagePicker.height;
                    GBlack -= G / self.imagePicker.height;
                    BBlack -= B / self.imagePicker.height;
                    }
                R -= (255 - red) / self.imagePicker.width;
                G -= (255 - green) / self.imagePicker.width;
                B -= (255 - blue) / self.imagePicker.width;
                x += 1;
            }
            self.imagePicker.putImageData(0, 0);
        };

        self.setEcolor = function(r, g, b) {
            self.imageEcolor.fill(r, g, b);
            self.imageEcolor.putImageData(0, 0);
        };

        self.convertToHexa = function(num) {
            var string = '0123456789ABCDEF';
            var convert = num > 15 ? '' : '0';
            while (num > 15) {
                var posLetter = Math.floor(num / 16);
                convert += string[posLetter];
                num = num - (posLetter * 16);
            }
            convert += string[num];
            return convert;
        };

        self.convertToDec = function(hexa) {
            var string = '0123456789ABCDEF';
            var index1 = string.indexOf(hexa[1]);
            var index0 = string.indexOf(hexa[0]);

            if (index0 === -1 || index1 === -1) {
                alert('bad');
                return (0);
            }
            return (16 * index1 + index0);
        };

        self.colorInHexa = function(r, g, b) {
            return self.convertToHexa(r) + self.convertToHexa(g) + self.convertToHexa(b);
        };

        self.colorInRgb = function(hexa) {
            var newColor;

            if (hexa.length === 7 && hexa[0] === '#') {
                newColor = [
                    self.convertToDec(hexa[2] + hexa[1]),
                    self.convertToDec(hexa[4] + hexa[3]),
                    self.convertToDec(hexa[6] + hexa[5])
                ];
            } else if (hexa.length === 6) {
                newColor = [
                    self.convertToDec(hexa[1] + hexa[0]),
                    self.convertToDec(hexa[3] + hexa[2]),
                    self.convertToDec(hexa[5] + hexa[4])
                ];
            } else {
                return [0, 0, 0];
            }
            return newColor;
        };

        self.init(selector);

    },

    create: function(selector) {
        return new Colorpicker.Object(selector);
    }
};

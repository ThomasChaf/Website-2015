'use strict';

/* global Bomber */
window.Bomber = {

    properties : {
        gap : 30,
        difficulty : 10,
        backgroundColor : '#8E9190'
    },

    CaseType: {
        BOMB: -1,
        EMPTY: 0
    },

    Case: function() {
        var self = this;

        self.init = function() {
            self.type = Bomber.CaseType.EMPTY;
            self.isReveal = false;
        };

        self.isBomb = function() {
            return self.type === Bomber.CaseType.BOMB;
        };

        self.isEmpty = function() {
            return self.type !== Bomber.CaseType.BOMB;
        };

        self.setNeighboor = function() {
            if (self.type !== Bomber.CaseType.BOMB) {
                return self.type += 1;
            }
        };

        self.hasNeighboor = function() {
            return self.type > 0;
        };

        self.setBomb = function() {
            self.type = Bomber.CaseType.BOMB;
        };

        self.getType = function() {
            return self.type;
        };

        self.setReveal = function() {
            self.isReveal = true;
            return self.type;
        };

        self.init();
        return self;
    },

    BomberMap: function(x, y, difficulty) {
        var self = this;

        self.init = function(width, height, difficulty) {
            self.width = width;
            self.height = height;
            self.content = [];
            self.nbBomb = Math.round(difficulty * (width * height) / 100);
            self.toReveal = width * height;
            var y = 0;
            while (y < height) {
                var x = 0;
                while (x < width) {
                    self.content.push(new Bomber.Case());
                    x += 1;
                }
                y += 1;
            }
            return self.disperseBomb(self.nbBomb);
        };

        //TODO check x, y
        self.disperseBomb = function(nbBomb) {
            var x0, y0, _results;
            _results = [];
            while (nbBomb > 0) {
                x0 = Math.floor(Math.random() * x);
                y0 = Math.floor(Math.random() * y);
                if (!self.isBomb(x0, y0)) {
                    self.setBomb(x0, y0);
                    _results.push(nbBomb -= 1);
                } else {
                    _results.push(void 0);
                }
            }
            return _results;
        };

        self.__reveal = function(x0, y0, squares) {
            var type, _results, _x, _y;
            type = self.setReveal(x0, y0);
            squares.push([x0, y0]);
            if (type === 0) {
                _y = y0 - 1;
                _results = [];
                while (_y <= y0 + 1) {
                    _x = x0 - 1;
                    while (_x <= x0 + 1) {
                        if ((_x !== x0 || _y !== y0) && (_y >= 0 && _x >= 0 && _y < self.height && _x < self.width)) {
                            if (!self.isReveal(_x, _y) && !self.isBomb(_x, _y)) {
                                self.__reveal(_x, _y, squares);
                            }
                        }
                        _x += 1;
                    }
                    _results.push(_y += 1);
                }
                return _results;
            }
        };

        self.reveal = function(x, y) {
            var squares;

            if (self.isBomb(x, y)) {
                return {
                    action: 'end',
                    params: {
                        _1: false
                    }
                };
            }
            squares = [];
            self.__reveal(x, y, squares);
            return {
                action: 'drawSquares',
                params: {
                    _1: squares
                }
            };
        };

        self.isBomb = function(x, y) {
            return self.content[y * self.width + x].isBomb();
        };

        self.isReveal = function(x, y) {
            return self.content[y * self.width + x].isReveal;
        };

        self.isEmpty = function(x, y) {
            return self.content[y * self.width + x].isEmpty();
        };

        self.getType = function(x, y) {
            return self.content[y * self.width + x].getType();
        };

        self.setBomb = function(x, y) {
            var x0;
            var y0 = y - 1;
            var _results = [];

            self.content[y * self.width + x].setBomb();
            while (y0 <= y + 1) {
                x0 = x - 1;
                while (x0 <= x + 1) {
                    if ((x0 !== x || y0 !== y) && (y0 >= 0 && x0 >= 0 && y0 < self.height && x0 < self.width)) {
                        self.content[y0 * self.width + x0].setNeighboor();
                    }
                    x0 += 1;
                }
                _results.push(y0 += 1);
            }
            return _results;
        };

        self.setReveal = function(x, y) {
            self.toReveal -= 1;
            return self.content[y * self.width + x].setReveal();
        };

        self.isClean = function() {
            return self.toReveal === self.nbBomb;
        };

        self.init(x, y, difficulty);
        return self;
    },

    EndGame: function(selector) {
        var self = this;

        self.init = function(selector) {
            self.elem = selector.endGame;
            self.message = selector.message;
            self.againButton = selector.againButton;
        };

        self.newGame = function() {
            self.elem.style.display = 'none';
        };

        self.loose = function() {
            self.message.textContent = 'Game Over !';
            self.elem.style.backgroundColor = 'rgba(51, 68, 101, 0.75)';
            self.againButton.style.backgroundColor = '#EB5959';
        };

        self.win = function() {
            self.message.textContent = 'Win !';
            self.elem.style.backgroundColor = 'rgba(51, 68, 101, 0.75)';
            self.againButton.style.backgroundColor = '#82CD87';
        };

        self.active = function(win) {
            if (win) {
                self.win();
            } else {
                self.loose();
            }
            self.elem.style.display = '';
            self.elem.click(function(e) {
                e.stopPropagation();
            });
        };

        self.init(selector);
        return self;
    },

    Object: function(selector) {
        var self = this;

        self.init = function(selector) {
            self.canvas = selector.bomber;
            self.context = self.canvas.getContext('2d');
            self.endGame = new Bomber.EndGame(selector);
            self.setClick(self.canvas);
            self.bombImage = new Image();
            self.bombImage.src = '/images/demineur.png';
            selector.againButton.onclick = self.newGame;
        };

        self.resize = function(width, height) {
            var x = width;
            var y = height;

            self.context.canvas.width = x - (x % Bomber.properties.gap);
            self.context.canvas.height = y - (y % Bomber.properties.gap);
            self.margeX = (width - self.context.canvas.width) / 2;
            self.margeY = (height - self.context.canvas.height) / 2;
            self.canvas.style.marginLeft = self.margeX + 'px';
            self.canvas.style.marginTop = self.margeY + 'px';
        };

        self.newGame = function(width, height) {
            self.endGame.newGame();
            if (width && height)
                self.resize(width, height);
            self.bomberMap = new Bomber.BomberMap(
                self.context.canvas.width / Bomber.properties.gap,
                self.context.canvas.height / Bomber.properties.gap,
                Bomber.properties.difficulty
            );
            self.draw();
        };

        self.onClick = function(e) {
            var action;
            var x = e.offsetX;
            var y = e.offsetY - 2;
            var x0 = Math.floor(x / Bomber.properties.gap);
            var y0 = Math.floor(y / Bomber.properties.gap);

            if (self.bomberMap.isReveal(x0, y0)) {
                return;
            }
            action = self.bomberMap.reveal(x0, y0);
            self[action.action](action.params._1, action.params._2);
            if (self.bomberMap.isClean()) {
                self.end(true);
            }
        };

        self.setClick = function(canvas) {
            canvas.onclick = self.onClick;
        };

        self.end = function(win) {
            var x = 0;
            var y;

            while (x < self.context.canvas.width) {
                y = 0;
                while (y < self.context.canvas.height) {
                    self.drawSquare(x / Bomber.properties.gap, y / Bomber.properties.gap);
                    y += Bomber.properties.gap;
                }
                x += Bomber.properties.gap;
            }
            self.endGame.active(win);
        };

        self.drawSquare = function(x, y, hasBegin) {
            var type = self.bomberMap.getType(x, y);
            var x0 = x * Bomber.properties.gap;
            var y0 = y * Bomber.properties.gap;

            if (type === Bomber.CaseType.BOMB) {
                return self.context.drawImage(self.bombImage, x0 + 2, y0 + 2);
            }
            if (!hasBegin) {
                self.context.beginPath();
            }
            self.context.rect(x0, y0, Bomber.properties.gap, Bomber.properties.gap);
            self.context.fillStyle = 'grey';
            self.context.lineWidth = 1;
            self.context.strokeStyle = 'black';
            self.context.fill();
            if (type > 0) {
                self.context.font = 'normal 13pt Arial';
                self.context.fillStyle = 'blue';
                self.context.fillText(type, x0 + 10, y0 + 22);
            }
            if (!hasBegin) {
                return self.context.stroke();
            }
        };

        self.drawSquares = function(squares) {
            var i = 0;
            var results = [];

            while (i < squares.length) {
                self.context.beginPath();
                self.drawSquare(squares[i][0], squares[i][1], true);
                self.context.stroke();
                results.push(i += 1);
            }
            return results;
        };

        self.drawLine = function(x0, y0, x1, y1) {
            self.context.moveTo(x0, y0);
            self.context.lineTo(x1, y1);
        };

        self.drawGrid = function() {
            var i = 0;

            self.context.beginPath();
            while (i <= self.context.canvas.height) {
                self.drawLine(0, i, self.context.canvas.width, i);
                i += Bomber.properties.gap;
            }
            i = 0;
            while (i <= self.context.canvas.width) {
                self.drawLine(i, 0, i, self.context.canvas.height);
                i += Bomber.properties.gap;
            }
            return self.context.stroke();
        };

        self.draw = function() {
            self.context.beginPath();
            self.context.rect(0, 0, self.context.canvas.width, self.context.canvas.height);
            self.context.fillStyle = Bomber.properties.backgroundColor;
            self.context.fill();
            self.context.stroke();
            return self.drawGrid();
        };

        self.init(selector);
        return self;
    },

    create : function(canvas, endGame) {
        return new Bomber.Object(canvas, endGame);
    }

};

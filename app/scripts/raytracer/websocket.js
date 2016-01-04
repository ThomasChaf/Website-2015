var Websocket = function(url, callbacks) {
    'use strict';
    var self = this;

    self.init = function(url, callbacks) {
        console.log('INIT SOCKET');
        self.socket = new WebSocket(url);
        self.socket.binaryType = 'arraybuffer';
        self.socket.onerror = self.onerror.bind(self);
        self.socket.onmessage = self.onmessage.bind(self);
        self.socket.onclose = self.onclose.bind(self);
        self.callbacks = callbacks;
    };

    self.onerror = function (error) {
        console.log('Error: Je recois une erreur:');
        console.log(error);
    };

    self.onmessage = function (event) {
        self.callbacks.onmessage(
            new Uint8Array(event.data)
        );
    };

    self.onclose = function() {
        console.log('Je close ouuuf\n');
        self.socket.close();
    };

    self.send = function (message) {
        self.socket.send(message);
    };

    self.close = function () {
        self.socket.close();
    };

    self.init(url, callbacks);
};

window.Raytracer.Websocket = Websocket;

'use strict';

/* global AjaxForm */
window.AjaxForm = {

    Object: function(url, onresponse, onerror) {
        var self = this;
        self.request = document.createElement('iron-ajax');
        self.request.url = url;
        self.request.method = 'POST';
        self.request.contentType = 'application/json';
        self.request.addEventListener('response', onresponse);
        self.request.addEventListener('error', onerror);

        self.submit = function(body) {
            self.request.body = JSON.stringify(body);
            self.request.generateRequest();
        };

        return this;
    },

    create: function(url, onresponse, onerror) {
        return new AjaxForm.Object(url, onresponse, onerror);
    }
};

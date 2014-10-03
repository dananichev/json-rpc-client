define([], function() {
    "use strict";

    var service = {
        id: 0,
        options: {
            serviceUrl: "",
            token: null,
            packets: {}
        },
        events: {},

        init: function() {
            var self = this;

            self.addEventListener('success', function (e) {
                self.onSuccess(e);
            });
            self.addEventListener('error', function (e) {
                self.onError(e);
            });
        },

        token: function(token) {
            if (token) {
                this.options.token = token;
            }
            return this.options.token;
        },

        serviceUrl: function(url) {
            if (url) {
                this.options.serviceUrl = url;
            }
            return this.options.serviceUrl;
        },

        sendPacket: function(method, params, notasync) {
            var result, response;
            var self = this;
            var async = true;
            var xhr = new XMLHttpRequest();
            var packet = self.computePacket(method, params);
            self.id++;

            var requestBody = JSON.stringify(packet);

            if (notasync) {
                async = false;
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    response = JSON.parse(xhr.responseText);

                    if (async) {
                        self.dispatchEvent('success', {"response": response});
                    } else {
                        result = response;
                    }
                } else if (xhr.readyState == 4) {
                    self.dispatchEvent('error', {"xhr": xhr});
                }
            };

            xhr.open("POST", self.serviceUrl(), async);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(requestBody);

            if (!async) {
                return result;
            }
        },

        computePacket: function(method, params) {
            var packet = {};
            packet.id = this.id;
            packet.method = method;
            packet.params = params;
            packet.params.token = this.token();

            return packet;
        },

        onError: function(xhr) {
            console.error("JSON-RPC Error: ", xhr);
        },

        onSuccess: function(response) {
            console.log("JSON-RPC Response: ", response);
        },

        addEventListener: function(name, handler) {
            if (this.events.hasOwnProperty(name))
                this.events[name].push(handler);
            else
                this.events[name] = [handler];
        },
        removeEventListener: function(name, handler) {
            if (!this.events.hasOwnProperty(name))
                return;

            var index = this.events[name].indexOf(handler);
            if (index != -1)
                this.events[name].splice(index, 1);
        },
        dispatchEvent: function(name, args) {
            if (!this.events.hasOwnProperty(name))
                return;

            if (!args)
                args = [];

            var evs = this.events[name], l = evs.length;
            for (var i = 0; i < l; i++) {
                evs[i].call(null, args);
            }
        }
    };

    return service;
});

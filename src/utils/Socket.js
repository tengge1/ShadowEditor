import {
    dispatch
} from '../third_party';

function Socket(options) {
    this.url = options.url;
    this.reconnectTime = options.reconnectTime || 5000;

    this.socket = new WebSocket(this.url);

    this.dispatch = dispatch('open', 'message', 'error', 'close');

    var _this = this;
    this.socket.onopen = function (evt) {
        _this.dispatch.call.apply(_this.dispatch, arguments);
    };

    this.socket.onmessage = function (evt) {
        _this.dispatch.call.apply(_this.dispatch, arguments);
    };

    this.socket.onerror = function (evt) {
        _this.dispatch.call.apply(_this.dispatch, arguments);
    };

    this.socket.onclose = function (evt) {
        _this.dispatch.call.apply(_this.dispatch, arguments);
        if (this.reconnectTime != null) {
            setTimeout(function () {
                _this.socket = new WebSocket(this.url);
            }, this.reconnectTime);
        }
    };
}

Socket.prototype.on = function (eventName, callback) {
    this.dispatch.on.apply(this.dispatch, arguments);
};

export {
    Socket
};
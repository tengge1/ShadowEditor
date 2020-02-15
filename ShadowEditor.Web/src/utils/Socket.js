import { dispatch } from '../third_party';

/**
 * Socket工具类
 * @author tengge / https://github.com/tengge1
 * @param {*} url Socket服务器地址 
 */
function Socket(url) {
    this.url = url;
    this.reconnectTime = 5000; // 重新连接时间

    this.socket = new WebSocket(this.url);

    this.dispatch = dispatch('open', 'message', 'error', 'close');

    var _this = this;
    this.socket.onopen = function (event) {
        _this.dispatch.call.apply(_this.dispatch, event);
    };

    this.socket.onmessage = function (event) {
        _this.dispatch.call.apply(_this.dispatch, event);
    };

    this.socket.onerror = function (event) {
        _this.dispatch.call.apply(_this.dispatch, event);
    };

    this.socket.onclose = function (event) {
        _this.dispatch.call.apply(_this.dispatch, event);
        if (this.reconnectTime !== null) {
            setTimeout(function () {
                _this.socket = new WebSocket(this.url);
            }, this.reconnectTime);
        }
    };
}

Socket.prototype.on = function (eventName, callback) {
    this.dispatch.on(eventName, callback);
};

export default Socket;
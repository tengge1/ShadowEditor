import BaseEvent from '../BaseEvent';

/**
 * 窗口大小改变事件
 * @param {*} app 
 */
function MessageEvent(app) {
    BaseEvent.call(this, app);
}

MessageEvent.prototype = Object.create(BaseEvent.prototype);
MessageEvent.prototype.constructor = MessageEvent;

MessageEvent.prototype.start = function () {
    var _this = this;
    this.app.on('message.' + this.id, function (event) {
        _this.onMessage(event);
    });
};

MessageEvent.prototype.stop = function () {
    this.app.on('message.' + this.id, null);
};

MessageEvent.prototype.onMessage = function (event) {

    var editor = this.app.editor;

    editor.clear();
    editor.fromJSON(event.data);

};

export default MessageEvent;
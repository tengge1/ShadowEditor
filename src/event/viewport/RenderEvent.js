import BaseEvent from '../BaseEvent';

/**
 * 渲染事件
 * @param {*} app 
 */
function RenderEvent(app) {
    BaseEvent.call(this, app);
}

RenderEvent.prototype = Object.create(BaseEvent.prototype);
RenderEvent.prototype.constructor = RenderEvent;

RenderEvent.prototype.start = function () {
    var _this = this;
    this.app.on('render.' + this.id, function () {
        _this.onRender();
    });
};

RenderEvent.prototype.stop = function () {
    this.app.on('render.' + this.id, null);
};

RenderEvent.prototype.onRender = function () {
    var editor = this.app.editor;
};

export default RenderEvent;
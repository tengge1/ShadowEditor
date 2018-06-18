import BaseEvent from '../BaseEvent';

/**
 * 窗口大小改变事件
 * @param {*} app 
 */
function ResizeEvent(app) {
    BaseEvent.call(this, app);
}

ResizeEvent.prototype = Object.create(BaseEvent.prototype);
ResizeEvent.prototype.constructor = ResizeEvent;

ResizeEvent.prototype.start = function () {
    var _this = this;
    this.app.on('resize.' + this.id, function (event) {
        _this.onResize(event);
    });
};

ResizeEvent.prototype.stop = function () {
    this.app.on('resize.' + this.id, null);
};

ResizeEvent.prototype.onResize = function (event) {
    this.app.call('windowResize', this);
};

export default ResizeEvent;
import BaseEvent from '../BaseEvent';

/**
 * 变形控件事件
 * @param {*} app 
 */
function TransformControlsEvent(app) {
    BaseEvent.call(this, app);
}

TransformControlsEvent.prototype = Object.create(BaseEvent.prototype);
TransformControlsEvent.prototype.constructor = TransformControlsEvent;

TransformControlsEvent.prototype.start = function () {
    var _this = this;
    this.app.on('transformControlsChange.' + this.id, function () {
        _this.onChange();
    });
    this.app.on('transformControlsMouseDown.' + this.id, function () {
        _this.onMouseDown();
    });
    this.app.on('transformControlsMouseUp.' + this.id, function () {
        _this.onMouseUp();
    });
};

TransformControlsEvent.prototype.stop = function () {
    this.app.on('transformControlsChange.' + this.id, null);
    this.app.on('transformControlsMouseDown.' + this.id, null);
    this.app.on('transformControlsMouseUp.' + this.id, null);
};

TransformControlsEvent.prototype.onChange = function () {
    var editor = this.app.editor;
};

TransformControlsEvent.prototype.onMouseDown = function () {

};

TransformControlsEvent.prototype.onMouseUp = function () {

};

export default TransformControlsEvent;
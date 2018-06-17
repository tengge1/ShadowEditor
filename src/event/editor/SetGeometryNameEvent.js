import BaseEvent from '../BaseEvent';

/**
 * 设置几何体名称事件
 * @param {*} app 
 */
function SetGeometryNameEvent(app) {
    BaseEvent.call(this, app);
}

SetGeometryNameEvent.prototype = Object.create(BaseEvent.prototype);
SetGeometryNameEvent.prototype.constructor = SetGeometryNameEvent;

SetGeometryNameEvent.prototype.start = function () {
    var _this = this;
    this.app.on('setGeometryName.' + this.id, function (geometry, name) {
        _this.onSetGeometryName(geometry, name);
    });
};

SetGeometryNameEvent.prototype.stop = function () {
    this.app.on('setGeometryName.' + this.id, null);
};

SetGeometryNameEvent.prototype.onSetGeometryName = function (geometry, name) {
    var editor = this.app.editor;
    geometry.name = name;
    editor.signals.sceneGraphChanged.dispatch();
};

export default SetGeometryNameEvent;
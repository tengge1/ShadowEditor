import BaseEvent from '../BaseEvent';

/**
 * 添加几何体事件
 * @param {*} app 
 */
function AddGeometryEvent(app) {
    BaseEvent.call(this, app);
}

AddGeometryEvent.prototype = Object.create(BaseEvent.prototype);
AddGeometryEvent.prototype.constructor = AddGeometryEvent;

AddGeometryEvent.prototype.start = function () {
    var _this = this;
    this.app.on('addGeometry.' + this.id, function (geometry) {
        _this.onAddGeometry(geometry);
    });
};

AddGeometryEvent.prototype.stop = function () {
    this.app.on('addGeometry.' + this.id, null);
};

AddGeometryEvent.prototype.onAddGeometry = function (geometry) {
    var editor = this.app.editor;
    editor.geometries[geometry.uuid] = geometry;
};

export default AddGeometryEvent;
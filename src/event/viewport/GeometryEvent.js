import BaseEvent from '../BaseEvent';

/**
 * 几何体改变事件
 * @param {*} app 
 */
function GeometryEvent(app) {
    BaseEvent.call(this, app);
}

GeometryEvent.prototype = Object.create(BaseEvent.prototype);
GeometryEvent.prototype.constructor = GeometryEvent;

GeometryEvent.prototype.start = function () {
    var _this = this;
    this.app.on('geometryChanged.' + this.id, function (object) {
        _this.onGeometryChanged(object);
    });
};

GeometryEvent.prototype.stop = function () {
    this.app.on('geometryChanged.' + this.id, null);
};

GeometryEvent.prototype.onGeometryChanged = function (object) {
    var selectionBox = this.app.editor.selectionBox;

    if (object !== undefined && object.useSelectionBox !== false) {
        selectionBox.setFromObject(object);
    }

    this.app.call('render');
};

export default GeometryEvent;
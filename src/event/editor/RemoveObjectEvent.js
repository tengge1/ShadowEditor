import BaseEvent from '../BaseEvent';

/**
 * 删除物体事件
 * @param {*} app 
 */
function RemoveObjectEvent(app) {
    BaseEvent.call(this, app);
}

RemoveObjectEvent.prototype = Object.create(BaseEvent.prototype);
RemoveObjectEvent.prototype.constructor = RemoveObjectEvent;

RemoveObjectEvent.prototype.start = function () {
    var _this = this;
    this.app.on('removeObject.' + this.id, function (object) {
        _this.onRemoveObject(object);
    });
};

RemoveObjectEvent.prototype.stop = function () {
    this.app.on('removeObject.' + this.id, null);
};

RemoveObjectEvent.prototype.onRemoveObject = function (object) {
    var editor = this.app.editor;

    if (object.parent === null) return; // 避免删除相机或场景

    object.traverse(function (child) {
        editor.removeHelper(child);
    });

    object.parent.remove(object);

    editor.signals.objectRemoved.dispatch(object);
    editor.signals.sceneGraphChanged.dispatch();
};

export default RemoveObjectEvent;
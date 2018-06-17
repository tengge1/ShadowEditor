import BaseEvent from '../BaseEvent';

/**
 * 移动物体事件
 * @param {*} app 
 */
function MoveObjectEvent(app) {
    BaseEvent.call(this, app);
}

MoveObjectEvent.prototype = Object.create(BaseEvent.prototype);
MoveObjectEvent.prototype.constructor = MoveObjectEvent;

MoveObjectEvent.prototype.start = function () {
    var _this = this;
    this.app.on('moveObject.' + this.id, function (object, parent, before) {
        _this.onMoveObject(object, parent, before);
    });
};

MoveObjectEvent.prototype.stop = function () {
    this.app.on('moveObject.' + this.id, null);
};

MoveObjectEvent.prototype.onMoveObject = function (object, parent, before) {
    var editor = this.app.editor;

    if (parent === undefined) {
        parent = editor.scene;
    }

    parent.add(object);

    // sort children array
    if (before !== undefined) {
        var index = parent.children.indexOf(before);
        parent.children.splice(index, 0, object);
        parent.children.pop();
    }

    editor.signals.sceneGraphChanged.dispatch();
};

export default MoveObjectEvent;
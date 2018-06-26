import BaseEvent from '../BaseEvent';

/**
 * 物体事件
 * @param {*} app 
 */
function ObjectEvent(app) {
    BaseEvent.call(this, app);
}

ObjectEvent.prototype = Object.create(BaseEvent.prototype);
ObjectEvent.prototype.constructor = ObjectEvent;

ObjectEvent.prototype.start = function () {
    var _this = this;
    this.app.on('objectAdded.' + this.id, function (object) {
        _this.onObjectAdded(object);
    });
    this.app.on('objectChanged.' + this.id, function (object) {
        _this.onObjectChanged(object);
    });
    this.app.on('objectRemoved.' + this.id, function (object) {
        _this.onObjectRemoved(object);
    });
};

ObjectEvent.prototype.stop = function () {
    this.app.on('objectAdded.' + this.id, null);
    this.app.on('objectChanged.' + this.id, null);
    this.app.on('objectRemoved.' + this.id, null);
};

ObjectEvent.prototype.onObjectAdded = function (object) {
    var objects = this.app.editor.objects;

    object.traverse(function (child) {
        objects.push(child);
    });
};

ObjectEvent.prototype.onObjectChanged = function (object) {
    var editor = this.app.editor;
    var selectionBox = editor.selectionBox;
    var transformControls = editor.transformControls;

    if (editor.selected === object) {
        selectionBox.setFromObject(object);
        transformControls.update();
    }

    if (object instanceof THREE.PerspectiveCamera) {
        object.updateProjectionMatrix();
    }

    if (editor.helpers[object.id] !== undefined) {
        editor.helpers[object.id].update();
    }

    this.app.call('render');
};

ObjectEvent.prototype.onObjectRemoved = function (object) {
    var objects = this.app.editor.objects;

    object.traverse(function (child) {
        objects.splice(objects.indexOf(child), 1);
    });
};

export default ObjectEvent;
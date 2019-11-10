import BaseEvent from './BaseEvent';

/**
 * 物体事件
 * @author tengge / https://github.com/tengge1
 */
function ObjectEvent() {
    BaseEvent.call(this);
    this.box = new THREE.Box3();
}

ObjectEvent.prototype = Object.create(BaseEvent.prototype);
ObjectEvent.prototype.constructor = ObjectEvent;

ObjectEvent.prototype.start = function () {
    app.on('objectAdded.' + this.id, this.onObjectAdded.bind(this));
    app.on('objectChanged.' + this.id, this.onObjectChanged.bind(this));
    app.on('objectRemoved.' + this.id, this.onObjectRemoved.bind(this));
    app.on('objectFocused.' + this.id, this.onObjectFocused.bind(this));
};

ObjectEvent.prototype.stop = function () {
    app.on('objectAdded.' + this.id, null);
    app.on('objectChanged.' + this.id, null);
    app.on('objectRemoved.' + this.id, null);
    app.on('objectFocused.' + this.id, null);
};

ObjectEvent.prototype.onObjectAdded = function (object) {
    var objects = app.editor.objects;

    object.traverse(function (child) {
        objects.push(child);
    });
};

ObjectEvent.prototype.onObjectChanged = function (object) {
    if (object instanceof THREE.PerspectiveCamera) {
        object.updateProjectionMatrix();
    }
};

ObjectEvent.prototype.onObjectRemoved = function (object) {
    var objects = app.editor.objects;

    object.traverse(function (child) {
        objects.splice(objects.indexOf(child), 1);
    });
};

ObjectEvent.prototype.onObjectFocused = function (object) {
    var controls = app.editor.controls;

    controls.focus(object);
};

export default ObjectEvent;
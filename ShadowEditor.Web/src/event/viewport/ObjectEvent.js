import BaseEvent from '../BaseEvent';

/**
 * 物体事件
 * @param {*} app 
 */
function ObjectEvent(app) {
    BaseEvent.call(this, app);
    this.box = new THREE.Box3();
}

ObjectEvent.prototype = Object.create(BaseEvent.prototype);
ObjectEvent.prototype.constructor = ObjectEvent;

ObjectEvent.prototype.start = function () {
    this.app.on('objectAdded.' + this.id, this.onObjectAdded.bind(this));
    this.app.on('objectChanged.' + this.id, this.onObjectChanged.bind(this));
    this.app.on('objectRemoved.' + this.id, this.onObjectRemoved.bind(this));
    this.app.on('objectSelected.' + this.id, this.onObjectSelected.bind(this));
    this.app.on('objectFocused.' + this.id, this.onObjectFocused.bind(this));
};

ObjectEvent.prototype.stop = function () {
    this.app.on('objectAdded.' + this.id, null);
    this.app.on('objectChanged.' + this.id, null);
    this.app.on('objectRemoved.' + this.id, null);
    this.app.on('objectSelected.' + this.id, null);
    this.app.on('objectFocused.' + this.id, null);
};

ObjectEvent.prototype.onObjectAdded = function (object) {
    var objects = this.app.editor.objects;

    object.traverse(function (child) {
        objects.push(child);
    });
};

ObjectEvent.prototype.onObjectChanged = function (object) {
    var editor = this.app.editor;
    var transformControls = editor.transformControls;

    if (editor.selected === object) {
        transformControls.update();
    }

    if (object instanceof THREE.PerspectiveCamera) {
        object.updateProjectionMatrix();
    }

    if (editor.helpers[object.id] !== undefined && !(editor.helpers[object.id] instanceof THREE.SkeletonHelper)) {
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

ObjectEvent.prototype.onObjectSelected = function (object) {
    var editor = this.app.editor;
    var scene = editor.scene;
    var box = this.box;

    this.app.call('render');
};

ObjectEvent.prototype.onObjectFocused = function (object) {
    var controls = this.app.editor.controls;

    controls.focus(object);
};

export default ObjectEvent;
/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseEvent from './BaseEvent';
import global from '../global';

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
    global.app.on('objectAdded.' + this.id, this.onObjectAdded.bind(this));
    global.app.on('objectChanged.' + this.id, this.onObjectChanged.bind(this));
    global.app.on('objectRemoved.' + this.id, this.onObjectRemoved.bind(this));
    global.app.on('objectFocused.' + this.id, this.onObjectFocused.bind(this));
};

ObjectEvent.prototype.stop = function () {
    global.app.on('objectAdded.' + this.id, null);
    global.app.on('objectChanged.' + this.id, null);
    global.app.on('objectRemoved.' + this.id, null);
    global.app.on('objectFocused.' + this.id, null);
};

ObjectEvent.prototype.onObjectAdded = function (object) {
    var objects = global.app.editor.objects;

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
    var objects = global.app.editor.objects;

    object.traverse(function (child) {
        objects.splice(objects.indexOf(child), 1);
    });
};

ObjectEvent.prototype.onObjectFocused = function (object) {
    global.app.editor.controls.focus(object);
};

export default ObjectEvent;
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
class ObjectEvent extends BaseEvent {
    constructor() {
        super();
        this.box = new THREE.Box3();
    }

    start() {
        global.app.on('objectAdded.' + this.id, this.onObjectAdded.bind(this));
        global.app.on('objectChanged.' + this.id, this.onObjectChanged.bind(this));
        global.app.on('objectRemoved.' + this.id, this.onObjectRemoved.bind(this));
        global.app.on('objectFocused.' + this.id, this.onObjectFocused.bind(this));
    }

    stop() {
        global.app.on('objectAdded.' + this.id, null);
        global.app.on('objectChanged.' + this.id, null);
        global.app.on('objectRemoved.' + this.id, null);
        global.app.on('objectFocused.' + this.id, null);
    }

    onObjectAdded(object) {
        var objects = global.app.editor.objects;

        object.traverse(function (child) {
            objects.push(child);
        });
    }

    onObjectChanged(object) {
        if (object instanceof THREE.PerspectiveCamera) {
            object.updateProjectionMatrix();
        }
    }

    onObjectRemoved(object) {
        var objects = global.app.editor.objects;

        object.traverse(function (child) {
            objects.splice(objects.indexOf(child), 1);
        });
    }

    onObjectFocused(object) {
        global.app.editor.controls.focus(object);
    }
}

export default ObjectEvent;
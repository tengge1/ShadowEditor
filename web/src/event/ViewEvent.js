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
import OrthographicCameraControls from '../controls/OrthographicCameraControls';
import global from '../global';

/**
 * 视图事件
 * @author tengge / https://github.com/tengge1
 */
function ViewEvent() {
    BaseEvent.call(this);

    this.changeView = this.changeView.bind(this);
}

ViewEvent.prototype = Object.create(BaseEvent.prototype);
ViewEvent.prototype.constructor = ViewEvent;

ViewEvent.prototype.start = function () {
    global.app.on(`changeView.${this.id}`, this.changeView);
};

ViewEvent.prototype.stop = function () {
    global.app.on(`changeView.${this.id}`, null);
};

ViewEvent.prototype.changeView = function (view) {
    if (view === global.app.editor.view) {
        return;
    }

    global.app.editor.view = view;

    if (this.controls === undefined) {
        this.controls = new OrthographicCameraControls(global.app.editor.orthCamera, global.app.editor.renderer.domElement);
    }

    if (view === 'perspective') {
        global.app.editor.controls.enable();
        global.app.editor.showViewHelper = true;
        this.controls.disable();
        global.app.call(`viewChanged`, this, view);
        return;
    }

    let camera = global.app.editor.orthCamera;

    // 使用透视相机离原点最远距离设置正交相机
    let distance = Math.max(
        global.app.editor.camera.position.x,
        global.app.editor.camera.position.y,
        global.app.editor.camera.position.z
    );

    switch (view) {
        case 'front':
            camera.position.set(distance, 0, 0);
            camera.lookAt(new THREE.Vector3());
            break;
        case 'side':
            camera.position.set(0, 0, distance);
            camera.lookAt(new THREE.Vector3());
            break;
        case 'top':
            camera.position.set(0, distance, 0);
            camera.lookAt(new THREE.Vector3());
            break;
    }

    global.app.editor.select(null);

    global.app.editor.controls.disable();
    global.app.editor.showViewHelper = false;
    this.controls.enable();
    global.app.call(`viewChanged`, this, view);
};

export default ViewEvent;
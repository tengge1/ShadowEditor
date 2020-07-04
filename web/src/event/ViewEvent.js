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
    app.on(`changeView.${this.id}`, this.changeView);
};

ViewEvent.prototype.stop = function () {
    app.on(`changeView.${this.id}`, null);
};

ViewEvent.prototype.changeView = function (view) {
    if (view === app.editor.view) {
        return;
    }

    app.editor.view = view;

    if (this.controls === undefined) {
        this.controls = new OrthographicCameraControls(app.editor.orthCamera, app.editor.renderer.domElement);
    }

    if (view === 'perspective') {
        app.editor.controls.enable();
        app.editor.showViewHelper = true;
        this.controls.disable();
        app.call(`viewChanged`, this, view);
        return;
    }

    let camera = app.editor.orthCamera;

    // 使用透视相机离原点最远距离设置正交相机
    let distance = Math.max(
        app.editor.camera.position.x,
        app.editor.camera.position.y,
        app.editor.camera.position.z
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

    app.editor.select(null);

    app.editor.controls.disable();
    app.editor.showViewHelper = false;
    this.controls.enable();
    app.call(`viewChanged`, this, view);
};

export default ViewEvent;
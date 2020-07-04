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

/**
 * 光线投射事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 应用程序
 */
function RaycastEvent(app) {
    BaseEvent.call(this, app);

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
}

RaycastEvent.prototype = Object.create(BaseEvent.prototype);
RaycastEvent.prototype.constructor = RaycastEvent;

RaycastEvent.prototype.start = function () {
    app.on(`mousedown.${this.id}`, this.onMouseDown.bind(this));
    app.on(`mouseup.${this.id}`, this.onMouseUp.bind(this));
};

RaycastEvent.prototype.stop = function () {
    app.on(`mousedown.${this.id}`, null);
    app.on(`mouseup.${this.id}`, null);
};

RaycastEvent.prototype.onMouseDown = function (event) {
    if (event.target !== app.editor.renderer.domElement) {
        return;
    }

    this.isDown = true;
    this.x = event.offsetX;
    this.y = event.offsetY;
};

RaycastEvent.prototype.onMouseUp = function (event) {
    if (event.target !== app.editor.renderer.domElement) {
        return;
    }

    if (!this.isDown || this.x !== event.offsetX || this.y !== event.offsetY) {
        return;
    }

    let domElement = app.editor.renderer.domElement;

    this.mouse.x = event.offsetX / domElement.clientWidth * 2 - 1;
    this.mouse.y = -event.offsetY / domElement.clientHeight * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, app.editor.view === 'perspective' ? app.editor.camera : app.editor.orthCamera);

    let intersects = this.raycaster.intersectObjects(app.editor.scene.children, true);

    if (intersects.length > 0) {
        app.call('raycast', this, intersects[0], event);
        app.call('intersect', this, intersects[0], event, intersects);
    } else {
        // 没有碰撞到任何物体，则跟y=0的平面碰撞
        let plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), new THREE.Vector3());
        let target = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, target);

        app.call('raycast', this, {
            point: target,
            distance: this.raycaster.ray.distanceSqToPoint(target),
            object: null
        }, event);
    }
};

export default RaycastEvent;
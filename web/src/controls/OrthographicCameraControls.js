/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 正交相机控制器
 * @author tengge / https://github.com/tengge1
 * @param {THREE.OrthographicCamera} camera 正交相机
 * @param {HTMLElement} domElement DOM
 */
function OrthographicCameraControls(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.enabled = false;
    this.isDown = false;
    this.offsetXY = new THREE.Vector2();

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
}

OrthographicCameraControls.prototype.enable = function () {
    if (this.enabled) {
        return;
    }

    this.enabled = true;

    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('mousemove', this.onMouseMove);
    this.domElement.addEventListener('mouseup', this.onMouseUp);
    this.domElement.addEventListener('mousewheel', this.onMouseWheel);
};

OrthographicCameraControls.prototype.disable = function () {
    if (!this.enabled) {
        return;
    }

    this.enabled = false;

    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('mousewheel', this.onMouseWheel);
};

OrthographicCameraControls.prototype.onMouseDown = function (event) {
    this.isDown = true;

    this.offsetXY.set(event.offsetX, event.offsetY);
};

OrthographicCameraControls.prototype.onMouseMove = function (event) {
    if (!this.isDown) {
        return;
    }

    // let camera = this.camera;

    let width = this.domElement.clientWidth;
    let height = this.domElement.clientHeight;

    let dx = (event.offsetX - this.offsetXY.x) * (this.camera.right - this.camera.left) / width;
    let dy = (event.offsetY - this.offsetXY.y) * (this.camera.top - this.camera.bottom) / height;

    this.camera.left -= dx;
    this.camera.right -= dx;
    this.camera.top += dy;
    this.camera.bottom += dy;

    this.camera.updateProjectionMatrix();

    this.offsetXY.set(event.offsetX, event.offsetY);
};

OrthographicCameraControls.prototype.onMouseUp = function () {
    this.isDown = false;
};

OrthographicCameraControls.prototype.onMouseWheel = function (event) {
    const delta = -event.wheelDelta / 1000;

    let camera = this.camera;

    let width = this.domElement.clientWidth;
    let height = this.domElement.clientHeight;

    let pointerX = camera.left + (camera.right - camera.left) * event.offsetX / width;
    let pointerY = camera.top - (camera.top - camera.bottom) * event.offsetY / height;

    camera.left = camera.left - Math.abs(pointerX - camera.left) * delta;
    camera.right = camera.right + Math.abs(camera.right - pointerX) * delta;
    camera.top = camera.top + Math.abs(camera.top - pointerY) * delta;
    camera.bottom = camera.bottom - Math.abs(pointerY - camera.bottom) * delta;

    camera.updateProjectionMatrix();
};

export default OrthographicCameraControls;
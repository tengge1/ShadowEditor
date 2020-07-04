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
 * 窗口大小改变事件
 * @author tengge / https://github.com/tengge1
 */
function ResizeEvent() {
    BaseEvent.call(this);
}

ResizeEvent.prototype = Object.create(BaseEvent.prototype);
ResizeEvent.prototype.constructor = ResizeEvent;

ResizeEvent.prototype.start = function () {
    app.on(`resize.${this.id}`, this.onResize.bind(this));
};

ResizeEvent.prototype.stop = function () {
    app.on(`resize.${this.id}`, null);
};

ResizeEvent.prototype.onResize = function () {
    let { editor, viewport } = app;
    let { DEFAULT_CAMERA, camera, orthCamera, renderer } = editor;

    const width = viewport.clientWidth;
    const height = viewport.clientHeight;

    if (this.width === undefined || this.height === undefined) {
        this.width = width;
        this.height = height;
    }

    DEFAULT_CAMERA.aspect = width / height;
    DEFAULT_CAMERA.updateProjectionMatrix();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (width !== this.width) {
        let dwidth = (orthCamera.right - orthCamera.left) * (width / this.width - 1);

        orthCamera.left -= dwidth / 2;
        orthCamera.right += dwidth / 2;

        this.width = width;
    }

    if (height !== this.height) {
        let dheight = (orthCamera.top - orthCamera.bottom) * (height / this.height - 1);

        orthCamera.top += dheight / 2;
        orthCamera.bottom -= dheight / 2;

        this.height = height;
    }

    orthCamera.updateProjectionMatrix();

    renderer.setSize(width, height);
};

export default ResizeEvent;
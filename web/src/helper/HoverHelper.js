/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseHelper from './BaseHelper';
import global from '../global';

/**
 * 鼠标移入帮助器
 * @author tengge / https://github.com/tengge1
 */
function HoverHelper() {
    BaseHelper.call(this);

    this.hoverEnabled = global.app.storage.hoverEnabled;
    this.hoveredColor = global.app.storage.hoveredColor;

    this.onGpuPick = this.onGpuPick.bind(this);
    this.onObjectRemoved = this.onObjectRemoved.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.onStorageChanged = this.onStorageChanged.bind(this);
}

HoverHelper.prototype = Object.create(BaseHelper.prototype);
HoverHelper.prototype.constructor = HoverHelper;

HoverHelper.prototype.start = function () {
    this.time = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.object = null;
    this.scene = new THREE.Scene();
    this.scene.autoUpdate = false; // 避免场景自动更新物体的matrixWorld，否则会导致物体旋转后，高亮不准的bug。
    this.scene.overrideMaterial = new THREE.MeshBasicMaterial({
        color: this.hoveredColor,
        transparent: true,
        opacity: 0.5
    });

    global.app.on(`gpuPick.${this.id}`, this.onGpuPick);
    global.app.on(`objectRemoved.${this.id}`, this.onObjectRemoved);
    global.app.on(`afterRender.${this.id}`, this.onAfterRender);
    global.app.on(`storageChanged.${this.id}`, this.onStorageChanged);
};

HoverHelper.prototype.stop = function () {
    global.app.on(`gpuPick.${this.id}`, null);
    global.app.on(`objectRemoved.${this.id}`, null);
    global.app.on(`afterRender.${this.id}`, null);
};

HoverHelper.prototype.onGpuPick = function (obj) {
    let object = obj.object;

    if (!object) {
        this.object = null;
        return;
    }

    // 不允许对文字产生hover效果
    if (object.userData && object.userData.type === 'text') {
        return;
    }

    this.object = object;
};

HoverHelper.prototype.onObjectRemoved = function (object) {
    if (object === this.object) {
        this.object = null;
    }
};

HoverHelper.prototype.onAfterRender = function () {
    if (!this.hoverEnabled || !this.object || !this.object.parent) {
        // TODO: this.object.parent为null时表示该物体被移除
        return;
    }

    const renderer = global.app.editor.renderer;
    const camera = global.app.editor.view === 'perspective' ? global.app.editor.camera : global.app.editor.orthCamera;

    const parent = this.object.parent;
    const index = parent.children.indexOf(this.object);

    this.scene.add(this.object);
    renderer.render(this.scene, camera);
    this.scene.remove(this.object);

    this.object.parent = parent;
    parent.children.splice(index, 0, this.object);
};

HoverHelper.prototype.onStorageChanged = function (key, value) {
    if (key === 'hoverEnabled') {
        this.hoverEnabled = value;
    } else if (key === 'hoveredColor') {
        this.hoveredColor = value;
        if (this.scene) {
            this.scene.overrideMaterial.color.set(value);
        }
    }
};

export default HoverHelper;
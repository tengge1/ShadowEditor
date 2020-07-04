/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseControls from './BaseControls';

import EditorControls from './EditorControls';
import FreeControls from './FreeControls';
import FirstPersonControls from './FirstPersonControls';

const Controls = {
    EditorControls,
    FreeControls,
    FirstPersonControls
};

/**
 * 控制器管理器
 * @author tengge1 / https://github.com/tengge1
 */
class ControlsManager extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleEnd = this.handleEnd.bind(this);

        const mode = app.storage.controlMode;
        this.changeMode(mode);

        // 记录上次控制器，以便按Esc退出第一视角，返回原来的模式。
        this.lastControl = this.current;

        // 记录上次相机的平移、旋转和缩放
        this.lastCamera = new THREE.Object3D();

        app.on(`animate.${this.id}`, this.update.bind(this));
        app.on(`gpuPick.${this.id}`, this.onGPUPick.bind(this));
    }

    /**
     * 改变控制器模式
     * @param {String} modeName 模式
     */
    changeMode(modeName) {
        if (!Controls[modeName]) {
            console.warn(`ControlsManager: ${modeName} is not defined.`);
            return;
        }
        this.changeControl(new Controls[modeName](this.camera, this.domElement));
    }

    changeControl(control) {
        if (this.current) {
            let camera = app.editor.camera;

            // 第一视角模式不能作为原来的模式
            if (!(this.current instanceof FirstPersonControls)) {
                this.lastControl = this.current;
                this.lastCamera.position.copy(camera.position);
                this.lastCamera.rotation.copy(camera.rotation);
                this.lastCamera.scale.copy(camera.scale);
            }

            this.current.disable();
            this.current.on(`update.${this.id}`, null);
            this.current.on(`end.${this.id}`, null);
            this.call('change', this, false, this.current.constructor.name, this.current); // enabled, controlName, control
        }

        this.current = control;
        this.current.enable();
        this.current.on(`update.${this.id}`, this.handleUpdate);
        this.current.on(`end.${this.id}`, this.handleEnd);
        this.call('change', this, true, this.current.constructor.name, this.current);
    }

    enable() {
        this.enabled = true;
        this.current && this.current.enable();
    }

    disable() {
        this.enabled = false;
        this.current && this.current.disable();
    }

    focus(target) {
        this.current && this.current.focus(target);
    }

    update(clock, deltaTime) {
        this.current && this.current.update(clock, deltaTime);
    }

    setPickPosition(position) {
        this.current && this.current.setPickPosition(position);
    }

    onGPUPick(obj) {
        if (obj.point) {
            this.setPickPosition(obj.point);
        }
    }

    handleUpdate() {
        // TODO: 太卡，待优化。
        // app.call('cameraChanged', this, app.editor.camera);
    }

    /**
     * 退出第一视角，返回原来的模式
     */
    handleEnd() {
        this.changeControl(this.lastControl);

        let camera = app.editor.camera;

        camera.position.copy(this.lastCamera.position);
        camera.rotation.copy(this.lastCamera.rotation);
        camera.scale.copy(this.lastCamera.scale);
    }

    dispose() {
        this.current && this.current.dispose();
    }
}

export default ControlsManager;
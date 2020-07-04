/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { dispatch } from '../third_party';

let ID = -1;

/**
 * 控制器基类
 * @author tengge1 / https://github.com/tengge1
 */
class BaseControls {
    /**
     * 创建一个控制器
     * @param {THREE.Camera} camera 相机
     * @param {HTMLElement} domElement HTML文档
     */
    constructor(camera, domElement) {
        this.id = `${this.constructor.name}${ID--}`;

        this.camera = camera;
        this.domElement = domElement;

        this.enabled = true;

        this.dispatch = dispatch('change', 'update', 'end');
        // change(enabled, controlName, control)，控制器改变
        // update()，相机位置改变
        // end()，控制器内部退出当前模式，主要用于按Esc退出第一视角模式。

        this.call = this.dispatch.call.bind(this.dispatch);
        this.on = this.dispatch.on.bind(this.dispatch);
    }

    /**
     * 启用控制器
     */
    enable() {
        this.enabled = true;
    }

    /**
     * 禁用控制器
     */
    disable() {
        this.enabled = false;
    }

    /**
     * 转到某个物体的视角
     * @param {THREE.Object3D} target 目标
     */
    focus(target) { // eslint-disable-line

    }

    /**
     * 不断循环调用，以便实现动画效果
     * @param {THREE.Clock} clock 时钟
     * @param {Number} deltaTime 间隔时间
     */
    update(clock, deltaTime) { // eslint-disable-line

    }

    /**
     * 当前鼠标所在位置碰撞点世界坐标
     * @param {THREE.Vector3} position 世界坐标
     */
    setPickPosition(position) { // eslint-disable-line

    }

    /**
     * 析构控制器
     */
    dispose() {
        this.camera = null;
        this.domElement = null;
    }
}

export default BaseControls;
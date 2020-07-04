/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
var ID = -1;

/**
 * 播放器组件
 * @param {Shadow.Player} app 播放器
 */
function PlayerComponent(app) {
    this.id = `${this.constructor.name}${ID--}`;
    this.app = app;
}

/**
 * 创建
 * @param {THREE.Scene} scene 场景
 * @param {THREE.PersPectiveCamera} camera 透视相机
 * @param {THREE.WebGLRenderer} renderer 渲染器
 * @param {Object} others 其他参数
 * @returns {Promise} 任务Promise
 */
PlayerComponent.prototype.create = function (scene, camera, renderer, others) { // eslint-disable-line
    return new Promise(resolve => {
        resolve();
    });
};

/**
 * 更新
 * @param {THREE.Clock} clock 时钟
 * @param {Number} deltaTime 间隔时间
 */
PlayerComponent.prototype.update = function (clock, deltaTime) { // eslint-disable-line

};

/**
 * 析构
 * @param {THREE.Scene} scene 场景
 * @param {THREE.PersPectiveCamera} camera 透视相机
 * @param {THREE.WebGLRenderer} renderer 渲染器
 * @param {Object} others 其他参数
 */
PlayerComponent.prototype.dispose = function (scene, camera, renderer, others) { // eslint-disable-line

};

export default PlayerComponent;
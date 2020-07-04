/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import PlayerComponent from './PlayerComponent';
import PackageManager from '../../package/PackageManager';

/**
 * 播放器场景控制
 * @param {*} app 播放器
 */
function PlayerControl(app) {
    PlayerComponent.call(this, app);

    this.packageManager = new PackageManager();
    this.require = this.packageManager.require.bind(this.packageManager);

    this.control = null;
}

PlayerControl.prototype = Object.create(PlayerComponent.prototype);
PlayerControl.prototype.constructor = PlayerControl;

PlayerControl.prototype.create = function (scene, camera, renderer) {
    var type = camera.userData.control;

    var promise = new Promise(resolve => {
        resolve();
    });

    if (type === 'FirstPersonControls') { // 第一视角控制器
        promise = this.require('FirstPersonControls');
    } else if (type === 'FlyControls') { // 飞行控制器
        promise = this.require('FlyControls');
    } else if (type === 'OrbitControls') { // 轨道控制器
        promise = this.require('OrbitControls');
    } else if (type === 'PointerLockControls') { // 指针锁定控制器
        promise = this.require('PointerLockControls');
    } else if (type === 'TrackballControls') { // 轨迹球控制器
        promise = this.require('TrackballControls');
    }

    return promise.then(() => {
        this._createControl(scene, camera, renderer);
        return new Promise(resolve => {
            resolve();
        });
    });
};

PlayerControl.prototype._createControl = function (scene, camera, renderer) {
    var type = camera.userData.control;

    if (type === 'FirstPersonControls') { // 第一视角控制器
        this.control = new THREE.FirstPersonControls(camera, renderer.domElement);
        if (camera.userData.firstPersonOptions) {
            Object.assign(this.control, camera.userData.firstPersonOptions);
        }
    } else if (type === 'FlyControls') { // 飞行控制器
        this.control = new THREE.FlyControls(camera, renderer.domElement);
        if (camera.userData.flyOptions) {
            Object.assign(this.control, camera.userData.flyOptions);
        }
    } else if (type === 'OrbitControls') { // 轨道控制器
        this.control = new THREE.OrbitControls(camera, renderer.domElement);
        if (camera.userData.orbitOptions) {
            Object.assign(this.control, camera.userData.orbitOptions);
        }
    } else if (type === 'PointerLockControls') { // 指针锁定控制器
        this.control = new THREE.PointerLockControls(camera, renderer.domElement);
        if (camera.userData.pointerLockOptions) {
            Object.assign(this.control, camera.userData.pointerLockOptions);

            if (this.control.isLocked) {
                this.control.lock();
            } else {
                this.control.unlock();
            }
        }
    } else if (type === 'TrackballControls') { // 轨迹球控制器
        this.control = new THREE.TrackballControls(camera, renderer.domElement);
        if (camera.userData.trackballOptions) {
            Object.assign(this.control, camera.userData.trackballOptions);
        }
    }
};

PlayerControl.prototype.update = function (clock, deltaTime) {
    if (this.control && this.control.update) {
        this.control.update(deltaTime);
    }
};

PlayerControl.prototype.dispose = function () {
    if (this.control) {
        this.control.dispose();
        this.control = null;
    }
};

export default PlayerControl;
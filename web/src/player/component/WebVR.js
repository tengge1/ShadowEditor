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
import VRButton from '../../webvr/VRButton';
import XRControllerModelFactory from '../../webvr/XRControllerModelFactory';

function buildController(data) {

    let geometry, material;

    switch (data.targetRayMode) {
        case 'tracked-pointer':
            geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

            material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

            return new THREE.Line(geometry, material);

        case 'gaze':
            geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, -1);
            material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
            return new THREE.Mesh(geometry, material);
    }
}

/**
 * 虚拟现实
 * @param {*} app 播放器
 */
function WebVR(app) {
    PlayerComponent.call(this, app);

    this.negZ = new THREE.Vector3(0, 0, -1);
    this.forward = new THREE.Vector3();

    this.camera = null;
    this.mesh = null;

    this.onConnected = this.onConnected.bind(this);
    this.onDisconnected = this.onDisconnected.bind(this);
    this.onSelectStart = this.onSelectStart.bind(this);
    this.onSelectEnd = this.onSelectEnd.bind(this);
}

WebVR.prototype = Object.create(PlayerComponent.prototype);
WebVR.prototype.constructor = WebVR;

WebVR.prototype.create = function (scene, camera, renderer) {
    if (!this.app.options.enableVR) {
        return;
    }
    if (!this.vrButton) {
        this.vrButton = VRButton.createButton(renderer);
    }
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    renderer.xr.enabled = true;
    this.app.container.appendChild(this.vrButton);

    var controller = renderer.xr.getController(0);
    controller.addEventListener('connected', this.onConnected);
    controller.addEventListener('disconnected', this.onDisconnected);
    controller.addEventListener('selectstart', this.onSelectStart);
    controller.addEventListener('selectend', this.onSelectEnd);
    scene.add(controller);

    return new Promise(resolve => {
        this.app.require('GLTFLoader').then(() => {
            const controllerModelFactory = new XRControllerModelFactory();

            const controllerGrip = renderer.xr.getControllerGrip(0);
            controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
            scene.add(controllerGrip);
            resolve();
        });
    });
};

WebVR.prototype.onConnected = function (event) {
    this.mesh = buildController(event.data);
    this.scene.add(this.mesh);

    // var setting = this.app.options.vrSetting;
    // var vrCamera = this.app.renderer.xr.getCamera(this.app.camera);
    // vrCamera.position.set(setting.cameraPosX, setting.cameraPosY, setting.cameraPosZ);
    // vrCamera.cameras.forEach(camera => {
    //     camera.position.copy(vrCamera.position);
    // });
    this.app.call('vrConnected', this, event);
};

WebVR.prototype.onDisconnected = function (event) {
    this.app.call('vrDisconnected', this, event);
    if (this.mesh) {
        this.scene.remove(this.mesh);
        this.mesh = null;
    }
};

WebVR.prototype.onSelectStart = function (event) {
    this.app.call('vrSelectStart', this, event);
};

WebVR.prototype.onSelectEnd = function (event) {
    this.app.call('vrSelectEnd', this, event);
};

WebVR.prototype.update = function () {
    if (!this.mesh) {
        return;
    }
    this.forward.copy(this.negZ)
        .applyQuaternion(this.camera.quaternion)
        .add(this.camera.position);

    this.mesh.position.copy(this.forward);
    this.mesh.lookAt(this.camera.position);
};

WebVR.prototype.dispose = function () {
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    if (this.vrButton) {
        this.app.container.removeChild(this.vrButton);
        delete this.vrButton;
    }
};

export default WebVR;
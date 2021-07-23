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
import {XRHandModelFactory} from '../../webvr/XRHandModelFactory';

/**
 * 虚拟现实
 * @param {*} app 播放器
 */
class WebVR extends PlayerComponent {
    constructor(app) {
        super(app);
        this.onConnected = this.onConnected.bind(this);
        this.onDisconnected = this.onDisconnected.bind(this);
        this.onSelectStart = this.onSelectStart.bind(this);
        this.onSelectEnd = this.onSelectEnd.bind(this);
    }

    create(scene, camera, renderer) {
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

        // group
        const group = new THREE.Group();
        group.name = 'vr-controls';
        scene.add(group);

        // controllers
        const controller1 = renderer.xr.getController(0);
        controller1.addEventListener('connected', this.onConnected);
        controller1.addEventListener('disconnected', this.onDisconnected);
        controller1.addEventListener('selectstart', this.onSelectStart);
        controller1.addEventListener('selectend', this.onSelectEnd);
        group.add(controller1);

        const controller2 = renderer.xr.getController(1);
        controller2.addEventListener('selectstart', this.onSelectStart);
        controller2.addEventListener('selectend', this.onSelectEnd);
        group.add(controller2);

        // Line
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        ]);

        const line = new THREE.Line(geometry);
        line.name = 'line';
        line.scale.z = 5;

        controller1.add(line.clone());
        controller2.add(line.clone());

        return new Promise(resolve => {
            this.app.require(['GLTFLoader', 'FBXLoader']).then(() => {
                const controllerModelFactory = new XRControllerModelFactory();
                const handModelFactory = new XRHandModelFactory().setPath("./models/fbx/");

                // Hand 1
                const controllerGrip1 = renderer.xr.getControllerGrip(0);
                controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
                group.add(controllerGrip1);

                const hand1 = renderer.xr.getHand(0);
                hand1.add(handModelFactory.createHandModel(hand1, 'oculus')); // spheres, boxes, oculus
                group.add(hand1);

                // Hand 2
                const controllerGrip2 = renderer.xr.getControllerGrip(1);
                controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
                group.add(controllerGrip2);

                const hand2 = renderer.xr.getHand(1);
                hand2.add(handModelFactory.createHandModel(hand2, 'oculus')); // spheres, boxes, oculus
                group.add(hand2);
                resolve();
            });
        });
    }

    onConnected(event) {
        // var setting = this.app.options.vrSetting;
        // var vrCamera = this.app.renderer.xr.getCamera(this.app.camera);
        // vrCamera.position.set(setting.cameraPosX, setting.cameraPosY, setting.cameraPosZ);
        // vrCamera.cameras.forEach(camera => {
        //     camera.position.copy(vrCamera.position);
        // });
        this.app.call('vrConnected', this, event);
    }

    onDisconnected(event) {
        this.app.call('vrDisconnected', this, event);
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh = null;
        }
    }

    onSelectStart(event) {
        this.app.call('vrSelectStart', this, event);
    }

    onSelectEnd(event) {
        this.app.call('vrSelectEnd', this, event);
    }

    update() {
    }

    dispose() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        if (this.vrButton) {
            this.app.container.removeChild(this.vrButton);
            delete this.vrButton;
        }
    }
}

export default WebVR;
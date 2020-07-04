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

const STATE = {
    Forward: 1, // 前进
    Backward: 2, // 后退
    Left: 3, // 向左移动
    Right: 4 // 向右移动
};

const UP = new THREE.Vector3(0, 1, 0);
const FORWARD = new THREE.Vector3(0, 0, -1);
const RIGHT = new THREE.Vector3(1, 0, 0);

/**
 * 第一视角控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FirstPersonControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.height = camera.position.y;
        camera.lookAt(new THREE.Vector3(0, this.height, 0));

        this.panSpeed = 0.1;
        this.rotationSpeed = 0.1 * Math.PI / 180;

        this.state = null;

        // 临时变量
        this.up = new THREE.Vector3(); // 上方
        this.forward = new THREE.Vector3(); // 前方
        this.right = new THREE.Vector3(); // 右侧

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onPointerlockChange = this.onPointerlockChange.bind(this);

        this.isLocked = true;
        this.domElement.requestPointerLock();

        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
        document.addEventListener('mousemove', this.onMouseMove, false);
        document.addEventListener('pointerlockchange', this.onPointerlockChange, false);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.state = STATE.Forward;
                break;
            case 40: // down
            case 83: // s
                this.state = STATE.Backward;
                break;
            case 37: // left
            case 65: // a
                this.state = STATE.Left;
                break;
            case 39: // right
            case 68: // d
                this.state = STATE.Right;
                break;
        }
    }

    onKeyUp() {
        this.state = null;
    }

    onMouseMove(event) {
        if (!this.isLocked) {
            return;
        }

        if (!this.quaternion1) {
            this.quaternion1 = new THREE.Quaternion();
        }

        if (!this.quaternion2) {
            this.quaternion2 = new THREE.Quaternion();
        }

        let camera = this.camera;

        this.forward.copy(FORWARD).applyQuaternion(camera.quaternion).normalize();
        this.right.copy(RIGHT).applyQuaternion(camera.quaternion).normalize();

        const dx = -event.movementX * this.rotationSpeed;
        const dy = -event.movementY * this.rotationSpeed;

        this.quaternion1.setFromAxisAngle(UP, dx);
        this.quaternion2.setFromAxisAngle(this.right, dy);

        this.forward.applyQuaternion(this.quaternion1).applyQuaternion(this.quaternion2).add(camera.position);

        camera.lookAt(this.forward);
    }

    onPointerlockChange() {
        if (document.pointerLockElement === this.domElement) {
            this.isLocked = true;
        } else {
            this.isLocked = false;

            // 按Esc可以强制退出第一视角模式。
            this.call('end', this);
        }
    }

    update() {
        if (!this.state) {
            return;
        }

        let camera = this.camera;

        this.forward.copy(FORWARD).applyQuaternion(camera.quaternion).projectOnPlane(UP).normalize();
        this.right.copy(RIGHT).applyQuaternion(camera.quaternion).projectOnPlane(UP).normalize();

        this.forward.multiplyScalar(this.panSpeed);
        this.right.multiplyScalar(this.panSpeed);

        if (this.state === STATE.Forward) {
            camera.position.add(this.forward);
        } else if (this.state === STATE.Backward) {
            camera.position.sub(this.forward);
        } else if (this.state === STATE.Left) {
            camera.position.sub(this.right);
        } else if (this.state === STATE.Right) {
            camera.position.add(this.right);
        }
    }

    dispose() {
        this.isLocked = false;
        document.exitPointerLock();

        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('pointerlockchange', this.onPointerlockChange);
        this.camera = null;
        this.domElement = null;
    }
}

export default FirstPersonControls;
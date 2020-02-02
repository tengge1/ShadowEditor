import BaseControls from './BaseControls';

const STATE = {
    Forward: 1, // 前进
    Backward: 2, // 后退
    Left: 3, // 向左移动
    Right: 4 // 向右移动
};

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
        this.rotationSpeed = 0.01;

        this.state = null;

        this.forward = new THREE.Vector3(); // 前方
        this.right = new THREE.Vector3(); // 右侧

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onPointerlockChange = this.onPointerlockChange.bind(this);

        this.domElement.addEventListener('keydown', this.onKeyDown, false);
        this.domElement.addEventListener('keyup', this.onKeyUp, false);
        this.domElement.addEventListener('mousemove', this.onMouseMove, false);
        this.domElement.addEventListener('pointerlockchange', this.onPointerlockChange, false);
    }

    focus(target) {
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
        // if (scope.isLocked === false) return;

        // var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        // var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        // euler.setFromQuaternion(camera.quaternion);

        // euler.y -= movementX * 0.002;
        // euler.x -= movementY * 0.002;

        // euler.x = Math.max(- PI_2, Math.min(PI_2, euler.x));

        // camera.quaternion.setFromEuler(euler);

        // scope.dispatchEvent(changeEvent);
    }

    onPointerlockChange(event) {

    }

    update() {
        if (!this.state) {
            return;
        }

        let camera = this.camera;

        this.forward.copy(FORWARD).applyQuaternion(camera.quaternion).normalize();
        this.right.copy(RIGHT).applyQuaternion(camera.quaternion).normalize();

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
        this.domElement.removeEventListener('keydown', this.onKeyDown);
        this.domElement.removeEventListener('keyup', this.onKeyUp);
        this.domElement.removeEventListener('mousemove', this.onMouseMove);
        this.domElement.removeEventListener('pointerlockchange', this.onPointerlockChange);
        this.camera = null;
        this.domElement = null;
    }
}

export default FirstPersonControls;
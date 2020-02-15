import BaseControls from './BaseControls';
import Ease from '../utils/Ease';
import CoordinateUtils from '../utils/CoordinateUtils';

const STATE = {
    NONE: -1,
    PAN: 1,
    ROTATE: 2,
    ZOOM: 3
};

const UP = new THREE.Vector3(0, 1, 0);
const FORWARD = new THREE.Vector3(0, 0, -1);
const RIGHT = new THREE.Vector3(1, 0, 0);

/**
 * 自由控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FreeControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.panVelocity = 0.002;
        this.rotateVelocity = 0.005;
        this.zoomVelocity = 1;

        this.zoomTime = 0.5;

        this.minHeight = 1;

        this.center = new THREE.Vector3();
        this.pickPosition = new THREE.Vector3();

        this.time = 0;

        this.offsetXY = new THREE.Vector3();
        this.mouse = new THREE.Vector2(); // 鼠标碰撞点世界坐标
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane();
        this.target = new THREE.Vector3();

        this.state = STATE.NONE;
        this.velocity = new THREE.Vector3(); // 速度：m/s
        this.acceleration = 100; // 加速度：m/s^2
        this.velocityThreshold = 0.1; // 速度阈值

        // pan
        this.screenPosition = new THREE.Vector3();
        this.displacement = new THREE.Vector3(); // 位移：m

        // rotate
        this.from = new THREE.Vector3();
        this.to = new THREE.Vector3();
        this.quaternion1 = new THREE.Quaternion();
        this.quaternion2 = new THREE.Quaternion();
        this.lookDirection = new THREE.Vector3();
        this.forward = new THREE.Vector3();
        this.right = new THREE.Vector3();
        this.project = new THREE.Vector3();

        this.update = this.update.bind(this);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);

        this.domElement.addEventListener('mousedown', this.onMouseDown, false);
        this.domElement.addEventListener('mousemove', this.onMouseMove, false);
        this.domElement.addEventListener('mouseup', this.onMouseUp, false);
        this.domElement.addEventListener('mouseout', this.onMouseUp, false);
        this.domElement.addEventListener('dblclick', this.onMouseUp, false);
        this.domElement.addEventListener('wheel', this.onMouseWheel, false);

        // this.helper = new THREE.ArrowHelper(UP, this.center, 10);
        // app.editor.sceneHelpers.add(this.helper);
    }

    focus(target) { // eslint-disable-line

    }

    pan(dx1, dy1) { // eslint-disable-line
        // this.screenPosition.copy(this.pickPosition)
        //     .applyMatrix4(this.camera.matrixWorldInverse)
        //     .applyMatrix4(this.camera.projectionMatrix);

        // CoordinateUtils.screenToDevice(this.offsetXY.x, this.offsetXY.y, )


        // CoordinateUtils.deviceToScreen(this.screenPosition.x, this.screenPosition.y, this.domElement.clientWidth, this.domElement.clientHeight, this.screenPosition);
        // console.log(this.screenPosition, this.offsetXY);
        const dx = this.target.x - this.pickPosition.x;
        const dz = this.target.z - this.pickPosition.z;
        this.camera.position.x -= dx;
        this.camera.position.z -= dz;
        this.center.x -= dx;
        this.center.z -= dz;
        // this.helper.position.copy(this.center);
    }

    rotate(dx, dy) {
        // theta
        this.from.subVectors(this.pickPosition, this.center).setY(0).normalize();
        this.to.subVectors(this.target, this.center).setY(0).normalize();
        this.quaternion1.setFromUnitVectors(this.from, this.to);

        // phi
        this.forward.copy(FORWARD).applyQuaternion(this.camera.quaternion).normalize();
        this.right.copy(RIGHT).applyQuaternion(this.camera.quaternion).normalize();

        this.project.copy(this.forward).projectOnPlane(this.plane.normal);

        let angle = this.forward.angleTo(this.project);
        let dangle = dy * 0.01;

        if (angle + dangle <= 5 * Math.PI / 180) {
            dangle = 0;
        }
        if (angle + dangle >= 85 * Math.PI / 180) {
            dangle = 0;
        }

        this.quaternion2.setFromAxisAngle(this.right, dangle);
        this.quaternion1.multiply(this.quaternion2);

        this.quaternion1.inverse();

        this.lookDirection.copy(this.camera.position).sub(this.center).normalize();
        this.lookDirection.applyQuaternion(this.quaternion1).normalize();

        const distance = this.camera.position.distanceTo(this.center);
        this.camera.position.copy(this.lookDirection).multiplyScalar(distance).add(this.center);
        this.camera.lookAt(this.center);
    }

    zoom(dy) {
        const cameraPosition = this.camera.position;
        const pickPosition = this.pickPosition;

        this.state = STATE.ZOOM;

        let factor = 0.2 + Math.log(cameraPosition.distanceTo(pickPosition)) * 0.1;

        this.velocity.subVectors(cameraPosition, pickPosition).normalize()
            .multiplyScalar(this.zoomVelocity * dy * factor);
    }

    update() {
        if (this.state !== STATE.ZOOM) {
            this.time = new Date().getTime();
            return;
        }
        const now = new Date().getTime();
        const deltaTime = (now - this.time) / 1000;

        this.updateVelocity(deltaTime);

        this.time = now;
    }

    updateVelocity(deltaTime) {
        let velocity = this.velocity;

        if (velocity.x === 0 && velocity.y === 0 && velocity.z === 0) {
            this.state = STATE.NONE;
            return;
        }

        this.displacement.copy(this.velocity).multiplyScalar(deltaTime).multiplyScalar(-1);
        this.camera.position.add(this.displacement);

        if (this.camera.position.y <= this.minHeight) {
            this.camera.position.y = this.minHeight;
            this.velocity.y = 0;
        }

        const dv = this.acceleration * deltaTime / velocity.length();

        if (velocity.x !== 0) {
            velocity.x = this.calVelocityX(velocity.x, Math.abs(dv * velocity.x));
        }
        if (velocity.y !== 0) {
            velocity.y = this.calVelocityX(velocity.y, Math.abs(dv * velocity.y));
        }
        if (velocity.z !== 0) {
            velocity.z = this.calVelocityX(velocity.z, Math.abs(dv * velocity.z));
        }
    }

    calVelocityX(v, dv) {
        const sv = Math.sign(v);
        const vv = Math.abs(v) - dv;
        return vv < this.velocityThreshold ? 0 : sv * vv;
    }

    onMouseDown(event) {
        if (!this.enabled) {
            return;
        }
        if (event.button === 0) { // 左键
            this.state = STATE.ROTATE;
        } else if (event.button === 2) { // 右键
            this.state = STATE.PAN;
        }
        this.offsetXY.set(event.offsetX, event.offsetY);
        this.plane.setFromNormalAndCoplanarPoint(UP, this.pickPosition);
    }

    onMouseMove(event) {
        if (this.enabled && this.state !== STATE.ROTATE && this.state !== STATE.PAN) {
            return;
        }
        if (!this.pick(event.offsetX, event.offsetY)) {
            return;
        }
        const dx = event.offsetX - this.offsetXY.x;
        const dy = event.offsetY - this.offsetXY.y;
        this.offsetXY.set(event.offsetX, event.offsetY);

        if (this.state === STATE.ROTATE) {
            this.rotate(dx, dy);
        } else if (this.state === STATE.PAN) {
            this.pan(dx, dy);
        }
    }

    onMouseUp() {
        if (!this.enabled) {
            return;
        }
        this.state = STATE.NONE;
    }

    onMouseWheel(event) {
        if (!this.enabled) {
            return;
        }
        this.zoom(-event.deltaY);
    }

    /**
     * 判断鼠标所在位置与平面交点
     * @param {Number} offsetX 偏移X
     * @param {Number} offsetY 偏移Y
     * @returns {Boolean} 是否相交
     */
    pick(offsetX, offsetY) {
        CoordinateUtils.screenToDevice(offsetX, offsetY, this.domElement.clientWidth, this.domElement.clientHeight, this.mouse);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.raycaster.ray.intersectPlane(this.plane, this.target);
    }

    setPickPosition(position) {
        this.pickPosition.copy(position);
    }

    dispose() {
        // if (this.helper) {
        //     app.editor.sceneHelpers.remove(this.helper);
        //     this.helper = null;
        // }
        this.domElement.removeEventListener('mousedown', this.onMouseDown);
        this.domElement.removeEventListener('mousemove', this.onMouseMove);
        this.domElement.removeEventListener('mouseup', this.onMouseUp);
        this.domElement.removeEventListener('mouseout', this.onMouseUp);
        this.domElement.removeEventListener('dblclick', this.onMouseUp);
        this.domElement.removeEventListener('wheel', this.onMouseWheel);
        this.camera = null;
        this.domElement = null;
    }
}

export default FreeControls;
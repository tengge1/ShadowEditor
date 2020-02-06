import BaseControls from './BaseControls';

const STATE = {
    NONE: - 1,
    ROTATE: 0,
    ZOOM: 1,
    PAN: 2
};

const UP = new THREE.Vector3(0, 1, 0);

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

        this.minVelocity = 1;
        this.maxVelocity = 10;

        this.minHeight = 1;

        this.center = new THREE.Vector3();
        this.pickPosition = new THREE.Vector3();

        this.time = 0;
        this.isLeftDown = false;
        this.isRightDown = false;

        this.mouse = new THREE.Vector2(); // 鼠标碰撞点世界坐标
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane();
        this.target = new THREE.Vector3();

        this.state = STATE.NONE;
        this.velocity = new THREE.Vector3(); // 速度：m/s
        this.angularVelocity = new THREE.Euler(); // 角速度：rad/s
        this.acceleration = 100; // 加速度：m/s^2
        this.angularAcceleration = 0.01; // 角加速度：rad/s^2
        this.velocityThreshold = 0; // 速度阈值
        this.angularVelocityThreshold = 0; // 角速度阈值

        this.moveTime = 0;
        this.displacement = new THREE.Vector3(); // 位移：m

        this.rotation = new THREE.Euler(); // 旋转：rad
        this.from = new THREE.Vector3();
        this.to = new THREE.Vector3();
        this.quaternion = new THREE.Quaternion();

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
    }

    focus(target) { // eslint-disable-line
    }

    pan(dx, dy) {
        let camera = this.camera;
        this.mouse.set(
            dx / this.domElement.clientWidth * 2 - 1,
            -(dy / this.domElement.clientHeight) * 2 + 1
        );
        this.raycaster.setFromCamera(this.mouse, camera);

        let now = new Date().getTime();

        if (this.raycaster.ray.intersectPlane(this.plane, this.target)) {
            let dx = this.target.x - this.pickPosition.x;
            let dz = this.target.z - this.pickPosition.z;
            camera.position.x -= dx;
            camera.position.z -= dz;
            this.center.x += dx;
            this.center.z += dz;

            let deltaTime = (now - this.moveTime) / 1000;

            if(deltaTime === 0) {
                return;
            }

            this.velocity.set(
                dx / deltaTime,
                0,
                dz / deltaTime
            );
        }

        this.moveTime = now;
    }

    rotate(dx, dy) {
        let camera = this.camera;
        this.mouse.set(
            dx / this.domElement.clientWidth * 2 - 1,
            -(dy / this.domElement.clientHeight) * 2 + 1
        );
        this.raycaster.setFromCamera(this.mouse, camera);

        let now = new Date().getTime();

        if (this.raycaster.ray.intersectPlane(this.plane, this.target)) {
            this.from.subVectors(this.pickPosition, this.center).normalize();
            this.to.subVectors(this.target, this.center).normalize();
            this.quaternion.setFromUnitVectors(this.from, this.to);

            let deltaTime = (now - this.moveTime) / 1000;
            this.camera.quaternion.multiply(this.quaternion);
        }

        this.moveTime = now;
    }

    zoom(dy) {
        let cameraPosition = this.camera.position;
        let pickPosition = this.pickPosition;

        this.state = STATE.ZOOM;

        let factor = 0.2 + Math.log(cameraPosition.distanceTo(pickPosition)) * 0.1;

        this.velocity.subVectors(cameraPosition, pickPosition).normalize()
            .multiplyScalar(this.zoomVelocity * dy * factor);
    }

    update() {
        if (this.state === STATE.NONE) {
            this.time = new Date().getTime();
            return;
        }
        let now = new Date().getTime();
        let deltaTime = (now - this.time) / 1000;

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

        const dv = this.acceleration * deltaTime;
        const len = velocity.length();

        if (velocity.x !== 0) {
            velocity.x = this.calVelocityX(velocity.x, Math.abs(dv * velocity.x / len));
        }
        if (velocity.y !== 0) {
            velocity.y = this.calVelocityX(velocity.y, Math.abs(dv * velocity.y / len));
        }
        if (velocity.z !== 0) {
            velocity.z = this.calVelocityX(velocity.z, Math.abs(dv * velocity.z / len));
        }
    }

    calVelocityX(v, dv) {
        let sv = Math.sign(v);
        let vv = Math.abs(v) - dv;
        return vv < this.velocityThreshold ? 0 : sv * vv;
    }

    onMouseDown(event) {
        if (!this.enabled) {
            return;
        }
        if (event.button === 0) { // 左键
            this.isLeftDown = true;
        } else if (event.button === 2) { // 右键
            this.isRightDown = true;
        }
        this.moveTime = new Date().getTime();
        this.plane.setFromNormalAndCoplanarPoint(UP, this.pickPosition);
    }

    onMouseMove(event) {
        if (this.isLeftDown) {
            this.rotate(event.offsetX, event.offsetY);
        } else if(this.isRightDown) {
            this.pan(event.offsetX, event.offsetY);
        }
    }

    onMouseUp(event) {
        if (event.button === 0) {
            this.isLeftDown = false;
            this.state = STATE.ROTATE;
        } else if (event.button === 2) {
            this.isRightDown = false;
            this.state = STATE.PAN;
        }
    }

    onMouseWheel(event) {
        if (!this.enabled) {
            return;
        }
        this.zoom(-event.deltaY);
    }

    setPickPosition(position) {
        this.pickPosition.copy(position);
    }

    dispose() {
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
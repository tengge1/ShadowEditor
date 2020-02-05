import BaseControls from './BaseControls';

const UP = new THREE.Vector3(0, 1, 0);

/**
 * 自由控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FreeControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.panSpeed = 0.002;
        this.rotateSpeed = 0.005;
        this.zoomSpeed = 0.1;

        this.center = new THREE.Vector3();
        this.pickPosition = new THREE.Vector3();

        this.time = 0;
        this.isLeftDown = false;
        this.isRightDown = false;

        this.mouse = new THREE.Vector2(); // 鼠标碰撞点世界坐标
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane();
        this.target = new THREE.Vector3();

        this.isPanning = false; // 是否正在移动
        this.isRotating = false; // 是否正在旋转
        this.velocity = new THREE.Vector3(); // 速度：m/s
        this.minVelocity = 1;
        this.maxVelocity = 10;
        this.angularVelocity = new THREE.Euler(); // 角速度：rad/s
        this.acceleration = 50; // 加速度：m/s^2
        this.angularAcceleration = 0.01; // 角加速度：rad/s^2
        this.velocityThreshold = 0; // 速度阈值
        this.angularVelocityThreshold = 0; // 角速度阈值

        this.displacement = new THREE.Vector3(); // 位移：m
        this.rotation = new THREE.Euler(); // 旋转：rad

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

    pan(delta) {
        if (this.enabled === false) {
            return;
        }
    }

    rotate(delta) {
        if (this.enabled === false) {
            return;
        }
    }

    zoom(delta) {
        if (this.enabled === false) {
            return;
        }

        this.resetState();

        let cameraPosition = this.camera.position;
        let pickPosition = this.pickPosition;

        this.isPanning = true;
        let distance = cameraPosition.distanceTo(pickPosition);
        this.velocity.subVectors(cameraPosition, pickPosition)
            .multiplyScalar(this.zoomSpeed * delta * distance);
    }

    update() {
        if (!this.isPanning && !this.isRotating) {
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
            this.isPanning = false;
            return;
        }

        this.displacement.copy(this.velocity).multiplyScalar(deltaTime).multiplyScalar(-1);
        this.camera.position.add(this.displacement);

        let dv = this.acceleration * deltaTime;

        if (velocity.x !== 0) {
            velocity.x = this.calVelocityX(velocity.x, dv);
        }
        if (velocity.y !== 0) {
            velocity.y = this.calVelocityX(velocity.y, dv);
        }
        if (velocity.z !== 0) {
            velocity.z = this.calVelocityX(velocity.z, dv);
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
        this.plane.setFromNormalAndCoplanarPoint(UP, this.pickPosition);
    }

    onMouseMove(event) {
        if (!this.isRightDown) {
            return;
        }
        let camera = this.camera;
        this.mouse.set(
            event.offsetX / this.domElement.clientWidth * 2 - 1, 
            -(event.offsetY / this.domElement.clientHeight) * 2 + 1
        );
        this.raycaster.setFromCamera(this.mouse, camera);
        if(this.raycaster.ray.intersectPlane(this.plane, this.target)) {
            let dx = this.target.x - this.pickPosition.x;
            let dz = this.target.z - this.pickPosition.z;
            camera.position.x -= dx;
            camera.position.z -= dz;
            this.center.x += dx;
            this.center.z += dz;
        }
    }

    onMouseUp(event) {
        if (event.button === 0) {
            this.isLeftDown = false;
        } else if (event.button === 2) {
            this.isRightDown = false;
        }
        this.mouse.set(0, 0);
    }

    onMouseWheel(event) {
        this.zoom(-event.deltaY);
    }

    setPickPosition(position) {
        this.pickPosition.copy(position);
    }

    resetState() {
        this.isPanning = false;
        this.isRotating = false;
        this.velocity.set(0, 0, 0);
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
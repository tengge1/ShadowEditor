import BaseControls from './BaseControls';

/**
 * 运行状态
 */
const STATE = {
    NONE: -1,
    ROTATE: 0,
    ZOOM: 1,
    PAN: 2
};

/**
 * 自由控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FreeControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.center = new THREE.Vector3();

        this.panSpeed = 0.002;
        this.zoomSpeed = 0.1;
        this.rotationSpeed = 0.005;

        // internals
        this.vector = new THREE.Vector3();
        this.delta = new THREE.Vector3();
        this.box = new THREE.Box3();

        // state
        this.state = STATE.NONE;

        this.normalMatrix = new THREE.Matrix3();

        this.pointer = new THREE.Vector2(); // 鼠标位置

        this.spherical = new THREE.Spherical();
        this.sphere = new THREE.Sphere();

        // touch
        this.touches = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
        this.prevTouches = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
        this.prevDistance = null;

        // animation
        this.isPanning = false;
        this.isRotating = false;
        this.isZooming = false;

        // time
        this.beginTime = 0; // 鼠标按下时间
        this.endTime = 0; // 鼠标抬起时间

        // position
        this.deltaQuaternion = new THREE.Quaternion();

        // force
        this.mass = 10; // kg
        this.friction = -1000; // N，沿着运动反方向

        // velocity
        this.panVelocity = new THREE.Vector3(); // (x, 0, z)
        this.rotateVelocity = new THREE.Vector3(); // (tile, heading, 0)
        this.zoomVelocity = 0; // zoom

        // event
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.update = this.update.bind(this);

        this.domElement.addEventListener('mousedown', this.onMouseDown, false);
        this.domElement.addEventListener('wheel', this.onMouseWheel, false);
        this.domElement.addEventListener('touchstart', this.onTouchStart, false);
        this.domElement.addEventListener('touchmove', this.onTouchMove, false);
    }

    focus(target) {
        let distance;

        this.box.setFromObject(target);

        if (this.box.isEmpty() === false) {
            this.box.getCenter(this.center);
            distance = this.box.getBoundingSphere(this.sphere).radius;
        } else {
            // Focusing on an Group, AmbientLight, etc
            this.center.setFromMatrixPosition(target.matrixWorld);
            distance = 0.1;
        }

        this.delta.set(0, 0, 1);
        this.delta.applyQuaternion(this.camera.quaternion);
        this.delta.multiplyScalar(distance * 4);

        this.camera.position.copy(this.center).add(this.delta);

        this.call('update', this);
    }

    dispose() {
        this.domElement.removeEventListener('mousedown', this.onMouseDown);
        this.domElement.removeEventListener('wheel', this.onMouseWheel);
        this.domElement.removeEventListener('touchstart', this.onTouchStart);
        this.domElement.removeEventListener('touchmove', this.onTouchMove);
        this.camera = null;
        this.domElement = null;
    }

    pan(delta) {
        let distance = this.camera.position.distanceTo(this.center);

        delta.multiplyScalar(distance * this.panSpeed);
        delta.applyMatrix3(this.normalMatrix.getNormalMatrix(this.camera.matrix));

        this.camera.position.add(delta);
        this.center.add(delta);
        this.panVelocity.add(delta);

        this.call('update', this);
    }

    rotate(delta) {
        this.vector.copy(this.camera.position).sub(this.center);

        this.spherical.setFromVector3(this.vector);

        this.spherical.theta += delta.x * this.rotationSpeed;
        this.spherical.phi += delta.y * this.rotationSpeed;

        this.spherical.makeSafe();

        this.vector.setFromSpherical(this.spherical);

        this.camera.position.copy(this.center).add(this.vector);

        this.camera.lookAt(this.center);

        this.call('update', this);
    }

    zoom(delta) {
        let distance = this.camera.position.distanceTo(this.center);
        delta.multiplyScalar(distance * this.zoomSpeed);

        if (delta.length() > distance) {
            return;
        }

        delta.applyMatrix3(this.normalMatrix.getNormalMatrix(this.camera.matrix));

        this.camera.position.add(delta);

        this.call('update', this);
    }

    update() {
        if (!this.isPanning && !this.isRotating && !this.isZooming) {
            return;
        }

        let now = new Date().getTime();
        let dt = (now - this.endTime) / 1000;

        let a = this.friction / this.mass;
        let position = this.camera.position;

        if (this.isPanning) { // 平移
            let len = this.panVelocity.length();

            if (this.panVelocity.x !== 0) {
                position.x += this.panVelocity.x * dt;

                let dvx = a * dt * this.panVelocity.x / len;
                let vx = this.panVelocity.x + dvx;

                if (Math.sign(vx) !== Math.sign(this.panVelocity.x)) {
                    this.panVelocity.x = 0;
                } else {
                    this.panVelocity.x = vx;
                }
            }

            if (this.panVelocity.z !== 0) {
                position.z += this.panVelocity.z * dt;

                let dvz = a * dt * this.panVelocity.z / len;
                let vz = this.panVelocity.y + dvz;

                if (Math.sign(vz) !== Math.sign(this.panVelocity.z)) {
                    this.panVelocity.z = 0;
                } else {
                    this.panVelocity.z = vz;
                }
            }

            if (this.panVelocity.x === 0 && this.panVelocity.z === 0) {
                this.isPanning = false;
            }
        }

        this.endTime = now;
    }

    onMouseDown(event) {
        if (this.enabled === false) {
            return;
        }

        if (event.button === 0) {
            this.state = STATE.ROTATE;
        } else if (event.button === 1) {
            this.state = STATE.ZOOM;
        } else if (event.button === 2) {
            this.state = STATE.PAN;
        }

        this.beginTime = new Date().getTime();
        this.pointer.set(event.clientX, event.clientY);
        this.panVelocity.set(0, 0, 0);

        this.domElement.addEventListener('mousemove', this.onMouseMove, false);
        this.domElement.addEventListener('mouseup', this.onMouseUp, false);
        this.domElement.addEventListener('mouseout', this.onMouseUp, false);
        this.domElement.addEventListener('dblclick', this.onMouseUp, false);
    }

    onMouseMove(event) {
        if (this.enabled === false) {
            return;
        }

        let movementX = event.clientX - this.pointer.x;
        let movementY = event.clientY - this.pointer.y;

        if (this.state === STATE.ROTATE) {
            this.rotate(this.delta.set(- movementX, - movementY, 0));
        } else if (this.state === STATE.ZOOM) {
            this.zoom(this.delta.set(0, 0, this.movementY));
        } else if (this.state === STATE.PAN) {
            this.pan(this.delta.set(-movementX, 0, -movementY));
        }

        this.pointer.set(event.clientX, event.clientY);
    }

    onMouseUp() {
        this.domElement.removeEventListener('mousemove', this.onMouseMove, false);
        this.domElement.removeEventListener('mouseup', this.onMouseUp, false);
        this.domElement.removeEventListener('mouseout', this.onMouseUp, false);
        this.domElement.removeEventListener('dblclick', this.onMouseUp, false);

        this.endTime = new Date().getTime();

        if (this.endTime === this.beginTime) {
            this.state = STATE.NONE;
            return;
        }

        let dt = (this.endTime - this.beginTime) / 1000;

        if (this.state === STATE.PAN) {
            this.panVelocity.multiplyScalar(1 / dt);
            if (this.panVelocity.lengthSq() > 0) {
                this.isPanning = true;
            }
        } else if (this.state === STATE.ROTATE) {

        } else if (this.state === STATE.ZOOM) {

        }

        this.state = STATE.NONE;
    }

    onMouseWheel(event) {
        event.preventDefault();

        // Normalize deltaY due to https://bugzilla.mozilla.org/show_bug.cgi?id=1392460
        this.zoom(this.delta.set(0, 0, event.deltaY > 0 ? 1 : - 1));
    }

    // touch
    onTouchStart(event) {
        if (this.enabled === false) {
            return;
        }

        switch (event.touches.length) {
            case 1:
                this.touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0).divideScalar(window.devicePixelRatio);
                this.touches[1].set(event.touches[0].pageX, event.touches[0].pageY, 0).divideScalar(window.devicePixelRatio);
                break;
            case 2:
                this.touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0).divideScalar(window.devicePixelRatio);
                this.touches[1].set(event.touches[1].pageX, event.touches[1].pageY, 0).divideScalar(window.devicePixelRatio);
                this.prevDistance = this.touches[0].distanceTo(this.touches[1]);
                break;
        }

        this.prevTouches[0].copy(this.touches[0]);
        this.prevTouches[1].copy(this.touches[1]);
    }

    onTouchMove(event) {
        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        let distance, offset0, offset1;

        switch (event.touches.length) {
            case 1:
                this.touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0).divideScalar(window.devicePixelRatio);
                this.touches[1].set(event.touches[0].pageX, event.touches[0].pageY, 0).divideScalar(window.devicePixelRatio);
                this.rotate(this.touches[0].sub(this.getClosest(this.touches[0], this.prevTouches)).multiplyScalar(- 1));
                break;

            case 2:
                this.touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0).divideScalar(window.devicePixelRatio);
                this.touches[1].set(event.touches[1].pageX, event.touches[1].pageY, 0).divideScalar(window.devicePixelRatio);
                distance = this.touches[0].distanceTo(this.touches[1]);
                this.zoom(this.delta.set(0, 0, this.prevDistance - distance));
                this.prevDistance = distance;

                offset0 = this.touches[0].clone().sub(this.getClosest(this.touches[0], this.prevTouches));
                offset1 = this.touches[1].clone().sub(this.getClosest(this.touches[1], this.prevTouches));
                offset0.x = - offset0.x;
                offset1.x = - offset1.x;

                this.pan(offset0.add(offset1));

                break;
        }

        this.prevTouches[0].copy(this.touches[0]);
        this.prevTouches[1].copy(this.touches[1]);
    }

    getClosest(touch, touches) {
        let closest = touches[0];

        for (let i in touches) {
            if (closest.distanceTo(touch) > touches[i].distanceTo(touch)) {
                closest = touches[i];
            }
        }

        return closest;
    }
}

export default FreeControls;
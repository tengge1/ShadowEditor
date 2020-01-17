import BaseControls from './BaseControls';

/**
 * 自由控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FreeControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.enabled = true;
        this.center = new THREE.Vector3();

        this.panSpeed = 0.002;
        this.zoomSpeed = 0.1;
        this.rotationSpeed = 0.005;

        // internals
        this.vector = new THREE.Vector3();
        this.delta = new THREE.Vector3();
        this.box = new THREE.Box3();

        this.STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2 };
        this.state = this.STATE.NONE;

        this.normalMatrix = new THREE.Matrix3();
        this.pointer = new THREE.Vector2();
        this.pointerOld = new THREE.Vector2();
        this.spherical = new THREE.Spherical();
        this.sphere = new THREE.Sphere();

        // touch
        this.touches = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
        this.prevTouches = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
        this.prevDistance = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);

        this.domElement.addEventListener('mousedown', this.onMouseDown, false);
        this.domElement.addEventListener('wheel', this.onMouseWheel, false);
        this.domElement.addEventListener('touchstart', this.onTouchStart, false);
        this.domElement.addEventListener('touchmove', this.onTouchMove, false);
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
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

        this.dispatchEvent(this.changeEvent);
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
        var distance = this.camera.position.distanceTo(this.center);

        delta.multiplyScalar(distance * this.panSpeed);
        delta.applyMatrix3(this.normalMatrix.getNormalMatrix(this.camera.matrix));

        this.camera.position.add(delta);
        this.center.add(delta);

        this.dispatchEvent(this.changeEvent);
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

        this.dispatchEvent(this.changeEvent);
    }

    zoom(delta) {
        var distance = this.camera.position.distanceTo(this.center);
        delta.multiplyScalar(distance * this.zoomSpeed);

        if (delta.length() > distance) {
            return;
        }

        delta.applyMatrix3(this.normalMatrix.getNormalMatrix(this.camera.matrix));

        this.camera.position.add(delta);

        this.dispatchEvent(this.changeEvent);
    }

    onMouseDown(event) {
        if (this.enabled === false) {
            return;
        }

        if (event.button === 0) {
            this.state = this.STATE.ROTATE;
        } else if (event.button === 1) {
            this.state = this.STATE.ZOOM;
        } else if (event.button === 2) {
            this.state = this.STATE.PAN;
        }

        this.pointerOld.set(event.clientX, event.clientY);

        this.domElement.addEventListener('mousemove', this.onMouseMove, false);
        this.domElement.addEventListener('mouseup', this.onMouseUp, false);
        this.domElement.addEventListener('mouseout', this.onMouseUp, false);
        this.domElement.addEventListener('dblclick', this.onMouseUp, false);
    }

    onMouseMove(event) {
        if (this.enabled === false) {
            return;
        }

        this.pointer.set(event.clientX, event.clientY);

        var movementX = this.pointer.x - this.pointerOld.x;
        var movementY = this.pointer.y - this.pointerOld.y;

        if (this.state === this.STATE.ROTATE) {
            this.rotate(this.delta.set(- movementX, - movementY, 0));
        } else if (this.state === this.STATE.ZOOM) {
            this.zoom(this.delta.set(0, 0, this.movementY));
        } else if (this.state === this.STATE.PAN) {
            this.pan(this.delta.set(- movementX, movementY, 0));
        }

        this.pointerOld.set(event.clientX, event.clientY);
    }

    onMouseUp() {
        this.domElement.removeEventListener('mousemove', this.onMouseMove, false);
        this.domElement.removeEventListener('mouseup', this.onMouseUp, false);
        this.domElement.removeEventListener('mouseout', this.onMouseUp, false);
        this.domElement.removeEventListener('dblclick', this.onMouseUp, false);

        this.state = this.STATE.NONE;
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

        switch (event.touches.length) {
            case 1:
                this.touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0).divideScalar(window.devicePixelRatio);
                this.touches[1].set(event.touches[0].pageX, event.touches[0].pageY, 0).divideScalar(window.devicePixelRatio);
                this.rotate(this.touches[0].sub(this.getClosest(this.touches[0], this.prevTouches)).multiplyScalar(- 1));
                break;

            case 2:
                this.touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0).divideScalar(window.devicePixelRatio);
                this.touches[1].set(event.touches[1].pageX, event.touches[1].pageY, 0).divideScalar(window.devicePixelRatio);
                var distance = this.touches[0].distanceTo(this.touches[1]);
                this.zoom(this.delta.set(0, 0, this.prevDistance - distance));
                this.prevDistance = distance;

                var offset0 = this.touches[0].clone().sub(this.getClosest(this.touches[0], this.prevTouches));
                var offset1 = this.touches[1].clone().sub(this.getClosest(this.touches[1], this.prevTouches));
                offset0.x = - offset0.x;
                offset1.x = - offset1.x;

                this.pan(offset0.add(offset1));

                break;
        }

        this.prevTouches[0].copy(this.touches[0]);
        this.prevTouches[1].copy(this.touches[1]);
    }

    getClosest(touch, touches) {
        var closest = touches[0];

        for (var i in touches) {
            if (closest.distanceTo(touch) > touches[i].distanceTo(touch)) {
                closest = touches[i];
            }
        }

        return closest;
    }
}

export default FreeControls;
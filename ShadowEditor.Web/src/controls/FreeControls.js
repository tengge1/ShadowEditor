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

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);

        this.domElement.addEventListener('mousedown', this.onMouseDown, false);
        this.domElement.addEventListener('wheel', this.onMouseWheel, false);
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
            this.center.setFromMatrixPosition(this.target.matrixWorld);
            distance = 0.1;
        }

        this.delta.set(0, 0, 1);
        this.delta.applyQuaternion(this.camera.quaternion);
        this.delta.multiplyScalar(distance * 4);

        this.camera.position.copy(this.center).add(this.delta);

        this.dispatchEvent(this.changeEvent);
    }

    setCenter(center) {

    }

    dispose() {
        this.camera = null;
        this.domElement = null;
        this.domElement.removeEventListener('mousedown', this.onMouseDown);
        this.domElement.removeEventListener('wheel', this.onMouseWheel);
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
}

export default FreeControls;
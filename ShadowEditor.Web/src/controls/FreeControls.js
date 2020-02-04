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
        this.pickPosition = new THREE.Vector3();

        this.panSpeed = 0.002;
        this.rotationSpeed = 0.005;
        this.zoomSpeed = 0.1;

        this.state = STATE.NONE;
        this.pickPosition = new THREE.Vector3();

        // animation
        this.isPanning = false;
        this.isRotating = false;
        this.isZooming = false;

        // time
        this.beginTime = 0; // 鼠标按下时间
        this.endTime = 0; // 鼠标抬起时间

        // force
        this.mass = 10; // kg
        this.friction = -1000; // N，沿着运动反方向

        // velocity
        this.panVelocity = new THREE.Vector3(); // (x, 0, z)
        this.rotateVelocity = new THREE.Vector3(); // (tile, heading, 0)
        this.zoomVelocity = 0; // zoom

        // event
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
        // 保证鼠标点的位置不变
    }

    rotate(delta) {

    }

    zoom(delta) {

    }

    update() {
    }

    onMouseDown(event) {
        if (this.enabled === false) {
            return;
        }

        if (event.button === 0) { // 左键
            this.state = STATE.ROTATE;
        } else if (event.button === 1) { // 中键
            this.state = STATE.ZOOM;
        } else if (event.button === 2) { // 右键
            this.state = STATE.PAN;
        }
    }

    onMouseMove(event) {
        if (this.enabled === false) {
            return;
        }
    }

    onMouseUp() {
        this.state = STATE.NONE;
    }

    onMouseWheel(event) {

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
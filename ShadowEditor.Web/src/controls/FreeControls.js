import BaseControls from './BaseControls';
// import { TWEEN } from '../third_party';

/**
 * 自由控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FreeControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.controls = new THREE.OrbitControls(camera, domElement);

        this.controls.enableZoom = true;
        this.controls.maxPolarAngle = 85 * Math.PI / 180; // 85°

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;

        this.controls.panSpeed = 1.6;
    }

    enable() {
        this.enabled = true;
        this.controls.enabled = true;
    }

    disable() {
        this.enabled = false;
        this.controls.enabled = false;
    }

    focus(target) { // eslint-disable-line

    }

    update() {
        this.controls.update();
    }

    dispose() {
        this.controls.dispose();
        this.camera = null;
        this.domElement = null;
    }
}

export default FreeControls;
import BaseControls from './BaseControls';
import { TWEEN } from '../third_party';

/**
 * 自由控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FreeControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.controls = new THREE.OrbitControls(camera, domElement);

        this.controls.maxPolarAngle = Math.PI / 2;

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.controls.panSpeed = 2.0;

        // this.handleStart = this.handleStart.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.handleEnd = this.handleEnd.bind(this);

        // this.controls.addEventListener('start', this.handleStart);
        // this.controls.addEventListener('change', this.handleChange);
        // this.controls.addEventListener('end', this.handleEnd);
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

    setPickPosition(position) { // eslint-disable-line

    }

    // handleStart() {
    //     console.log('start');
    // }

    // handleChange() {
    //     console.log('change');
    // }

    // handleEnd() {
    //     console.log('end');
    // }

    dispose() {
        // this.controls.removeEventListener('start', this.handleStart);
        // this.controls.removeEventListener('change', this.handleChange);
        // this.controls.removeEventListener('end', this.handleEnd);
        this.controls.dispose();
        this.camera = null;
        this.domElement = null;
    }
}

export default FreeControls;
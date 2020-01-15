import BaseControls from './BaseControls';

/**
 * 自由控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FreeControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.enabled = true;
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    focus(target) {

    }

    setCenter(center) {

    }

    dispose() {

    }
}

export default FreeControls;
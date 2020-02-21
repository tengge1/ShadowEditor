import BaseControls from './BaseControls';

/**
 * 编辑器控制器
 * @author tengge1 / https://github.com/tengge1
 */
class EditorControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);
        this.controls = new THREE.EditorControls(camera, domElement);
    }

    enable() {
        this.enabled = true;
        this.controls.enabled = true;
    }

    disable() {
        this.enabled = false;
        this.controls.enabled = false;
    }

    focus(target) {
        this.controls.focus(target);
    }

    dispose() {
        this.controls.dispose();
        this.camera = null;
        this.domElement = null;
    }
}

export default EditorControls;
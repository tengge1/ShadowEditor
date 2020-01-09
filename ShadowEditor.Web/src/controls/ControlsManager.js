import BaseControls from './BaseControls';

import EditorControls from './EditorControls';
import FreeControls from './FreeControls';

const Controls = {
    EditorControls,
    FreeControls
};

/**
 * 控制器管理器
 */
class ControlsManager extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.current = new EditorControls();
    }

    /**
     * 改变控制器模式
     * @param {String} modeName 模式
     */
    changeMode(modeName) {
        if (!Controls[modeName]) {
            console.warn(`ControlsManager: ${modeName} is not defined.`);
            return;
        }
        this.current.disable();
        this.current = Controls[modeName];
        this.current.enable();
    }

    enable() {
        this.current && this.current.enabled();
    }

    disable() {
        this.current && this.current.disable();
    }

    focus(target) {
        this.current && this.current.focus(target);
    }

    dispose() {
        this.current && this.current.disable();
    }
}

export default ControlsManager;
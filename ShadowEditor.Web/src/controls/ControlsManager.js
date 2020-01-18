import BaseControls from './BaseControls';

import EditorControls from './EditorControls';
import FreeControls from './FreeControls';
import FirstPersonControls from './FirstPersonControls';

const Controls = {
    EditorControls,
    FreeControls,
    FirstPersonControls
};

/**
 * 控制器管理器
 * @author tengge1 / https://github.com/tengge1
 */
class ControlsManager extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this._handleChange = this._handleChange.bind(this);

        const mode = app.storage.get('controlMode') || 'EditorControls';
        this.changeMode(mode);
        app.on(`animate.${this.id}`, this.update.bind(this));
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
        if (this.current) {
            this.current.disable();
            this.current.removeEventListener('change', this._handleChange);
        }

        this.current = new Controls[modeName](this.camera, this.domElement);
        this.current.enable();
        this.current.addEventListener('change', this._handleChange);
    }

    enable() {
        this.enabled = true;
        this.current && this.current.enable();
    }

    disable() {
        this.enabled = false;
        this.current && this.current.disable();
    }

    focus(target) {
        this.current && this.current.focus(target);
    }

    update(clock, deltaTime) {
        this.current && this.current.update(clock, deltaTime);
    }

    _handleChange() {
        this.dispatchEvent(this.changeEvent);
        app.call('cameraChanged', this, app.editor.camera);
    }

    dispose() {
        this.current && this.current.dispose();
    }
}

export default ControlsManager;
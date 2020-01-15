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

        this._handleChange = this._handleChange.bind(this);
        this._handleCleared = this._handleCleared.bind(this);

        let mode = app.storage.get('controlMode') || 'EditorControls';
        this.changeMode(mode);

        app.on(`editorCleared.${this.id}`, this._handleCleared);
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
        this.current && this.current.enable();
    }

    disable() {
        this.current && this.current.disable();
    }

    focus(target) {
        this.current && this.current.focus(target);
    }

    setCenter(center) {
        this.current && this.current.setCenter(center);
    }

    _handleChange() {
        this.dispatchEvent(this.changeEvent);
        app.call('cameraChanged', this, app.editor.camera);
    }

    _handleCleared() {
        this.setCenter(new THREE.Vector3());
    }

    dispose() {
        this.current && this.current.dispose();
    }
}

export default ControlsManager;
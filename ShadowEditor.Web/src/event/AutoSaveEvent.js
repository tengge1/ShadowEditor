import BaseEvent from './BaseEvent';
import Converter from '../serialization/Converter';
import TimeUtils from '../utils/TimeUtils';

/**
 * 自动保存事件
 * @author tengge / https://github.com/tengge1
 */
class AutoSaveEvent extends BaseEvent {
    constructor() {
        super();

        this.autoSave = true;
        this.autoSaveTime = 10000; // 自动保存时间
        this.saveProcess = null;

        this.handleSave = this.handleSave.bind(this);
        this.handleLoad = this.handleLoad.bind(this);

        this.handleStorageChange = this.handleStorageChange.bind(this);
    }

    start() {
        this.autoSave = app.storage.autoSave;
        app.on(`storageChanged.${this.id}`, this.handleStorageChange);

        if (this.autoSave) {
            this.saveProcess = setTimeout(this.handleSave, this.autoSaveTime);
        }
    }

    stop() {
        app.on(`storageChanged.${this.id}`, null);
    }

    handleSave() {
        if (this.saveProcess) {
            clearTimeout(this.saveProcess);
        }

        const editor = app.editor;
        const obj = new Converter().toJSON({
            options: app.options,
            camera: editor.camera,
            renderer: editor.renderer,
            scripts: editor.scripts,
            animations: editor.animations,
            scene: editor.scene,
            visual: editor.visual
        });

        const now = TimeUtils.getDateTime('yyyy-MM-dd HH:mm:ss');

        window.localStorage.setItem('autoSaveData', JSON.stringify(obj));
        window.localStorage.setItem('autoSaveTime', now);

        console.log(`${now}, scene auto saved.`);

        if (this.autoSave) {
            this.saveProcess = setTimeout(this.handleSave, this.autoSaveTime);
        }
    }

    handleLoad() {

    }

    handleStorageChange(name, value) {
        if (name !== 'autoSave') {
            return;
        }
        this.autoSave = value;

        if (this.autoSave) {
            if (this.saveProcess) {
                clearTimeout(this.saveProcess);
            }
            this.saveProcess = setTimeout(this.handleSave, this.autoSaveTime);
        }
    }
}

export default AutoSaveEvent;
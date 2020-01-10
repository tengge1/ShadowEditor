import BaseEvent from './BaseEvent';

/**
 * 编辑器控件事件
 * @author tengge / https://github.com/tengge1
 */
function EditorControlsEvent() {
    BaseEvent.call(this);
}

EditorControlsEvent.prototype = Object.create(BaseEvent.prototype);
EditorControlsEvent.prototype.constructor = EditorControlsEvent;

EditorControlsEvent.prototype.start = function () {
    app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
    app.on(`editorCleared.${this.id}`, this.onEditorCleared.bind(this));
};

EditorControlsEvent.prototype.onAppStarted = function () {
    app.editor.controls.addEventListener('change', this.onChange.bind(this));
};

EditorControlsEvent.prototype.onChange = function () {
    app.call('cameraChanged', this, app.editor.camera);
};

EditorControlsEvent.prototype.onEditorCleared = function () {
    app.editor.controls.setCenter(new THREE.Vector3());
};

export default EditorControlsEvent;
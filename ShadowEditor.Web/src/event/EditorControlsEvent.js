import BaseEvent from './BaseEvent';

/**
 * 编辑器控件事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function EditorControlsEvent(app) {
    BaseEvent.call(this, app);
}

EditorControlsEvent.prototype = Object.create(BaseEvent.prototype);
EditorControlsEvent.prototype.constructor = EditorControlsEvent;

EditorControlsEvent.prototype.start = function () {
    var controls = app.editor.controls;

    controls.addEventListener('change', this.onChange.bind(this));

    app.on('editorCleared.' + this.id, this.onEditorCleared.bind(this));
};

EditorControlsEvent.prototype.stop = function () {
    var controls = app.editor.controls;

    controls.removeEventListener('change', this.onChange);

    app.on('editorCleared.' + this.id, null);
};

EditorControlsEvent.prototype.onChange = function () {
    app.call('cameraChanged', this, app.editor.camera);
};

EditorControlsEvent.prototype.onEditorCleared = function () {
    var controls = app.editor.controls;

    controls.center.set(0, 0, 0);

    app.call('render');
};

export default EditorControlsEvent;
import BaseEvent from './BaseEvent';

/**
 * 窗口大小改变事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ResizeEvent(app) {
    BaseEvent.call(this, app);
}

ResizeEvent.prototype = Object.create(BaseEvent.prototype);
ResizeEvent.prototype.constructor = ResizeEvent;

ResizeEvent.prototype.start = function () {
    app.on(`resize.${this.id}`, this.onResize.bind(this));
};

ResizeEvent.prototype.stop = function () {
    app.on(`resize.${this.id}`, null);
};

ResizeEvent.prototype.onResize = function () {
    var editor = app.editor;
    var viewport = app.viewport;
    var camera = editor.camera;
    var renderer = editor.renderer;

    var width = viewport.clientWidth;
    var height = viewport.clientHeight;

    editor.DEFAULT_CAMERA.aspect = width / height;
    editor.DEFAULT_CAMERA.updateProjectionMatrix();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
};

export default ResizeEvent;
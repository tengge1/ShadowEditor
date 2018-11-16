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
    this.app.on(`resize.${this.id}`, this.onResize.bind(this));
};

ResizeEvent.prototype.stop = function () {
    this.app.on(`resize.${this.id}`, null);
};

ResizeEvent.prototype.onResize = function () {
    var editor = this.app.editor;
    var container = this.app.viewport.container;
    var camera = editor.camera;
    var renderer = editor.renderer;

    editor.DEFAULT_CAMERA.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
    editor.DEFAULT_CAMERA.updateProjectionMatrix();

    camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

    this.app.call('render', this);
};

export default ResizeEvent;
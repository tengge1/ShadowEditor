import BaseEvent from '../BaseEvent';

/**
 * 渲染事件
 * @param {*} app 
 */
function WindowResizeEvent(app) {
    BaseEvent.call(this, app);
}

WindowResizeEvent.prototype = Object.create(BaseEvent.prototype);
WindowResizeEvent.prototype.constructor = WindowResizeEvent;

WindowResizeEvent.prototype.start = function () {
    this.app.on('resize.' + this.id, this.onResize.bind(this));
};

WindowResizeEvent.prototype.stop = function () {
    this.app.on('resize.' + this.id, null);
};

WindowResizeEvent.prototype.onResize = function () {
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

export default WindowResizeEvent;
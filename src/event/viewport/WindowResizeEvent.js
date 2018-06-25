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
    var _this = this;
    this.app.on('windowResize.' + this.id, function () {
        _this.onWindowResize();
    });
};

WindowResizeEvent.prototype.stop = function () {
    this.app.on('windowResize.' + this.id, null);
};

WindowResizeEvent.prototype.onWindowResize = function () {
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
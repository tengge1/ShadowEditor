import BaseEvent from '../BaseEvent';

/**
 * 渲染器改变事件
 * @param {*} app 
 */
function RendererChangedEvent(app) {
    BaseEvent.call(this, app);
}

RendererChangedEvent.prototype = Object.create(BaseEvent.prototype);
RendererChangedEvent.prototype.constructor = RendererChangedEvent;

RendererChangedEvent.prototype.start = function () {
    this.app.on('rendererChanged.' + this.id, this.onRendererChanged.bind(this));
};

RendererChangedEvent.prototype.stop = function () {
    this.app.on('rendererChanged.' + this.id, null);
};

RendererChangedEvent.prototype.onRendererChanged = function (newRenderer) {
    var editor = this.app.editor;
    var renderer = this.app.editor.renderer;
    var container = this.app.viewport.container;

    if (renderer != null) {
        container.dom.removeChild(renderer.domElement);
    }

    renderer = newRenderer;
    this.app.editor.renderer = renderer;

    renderer.autoClear = false;
    renderer.autoUpdateScene = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

    container.dom.appendChild(renderer.domElement);

    this.app.call('render');
};

export default RendererChangedEvent;
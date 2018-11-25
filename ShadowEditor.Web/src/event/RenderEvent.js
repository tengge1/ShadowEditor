import BaseEvent from './BaseEvent';
import OutlineEffect from '../effect/OutlineEffect';

/**
 * 渲染事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function RenderEvent(app) {
    BaseEvent.call(this, app);
}

RenderEvent.prototype = Object.create(BaseEvent.prototype);
RenderEvent.prototype.constructor = RenderEvent;

RenderEvent.prototype.start = function () {
    this.app.on(`render.${this.id}`, this.onRender.bind(this));
    this.app.on(`materialChanged.${this.id}`, this.onRender.bind(this));
    this.app.on(`sceneGraphChanged.${this.id}`, this.onRender.bind(this));
    this.app.on(`cameraChanged.${this.id}`, this.onRender.bind(this));
};

RenderEvent.prototype.stop = function () {
    this.app.on(`render.${this.id}`, null);
    this.app.on(`materialChanged.${this.id}`, null);
    this.app.on(`sceneGraphChanged.${this.id}`, null);
    this.app.on(`cameraChanged.${this.id}`, null);
};

RenderEvent.prototype.onRender = function () {
    var editor = this.app.editor;
    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;

    scene.updateMatrixWorld();
    sceneHelpers.updateMatrixWorld();

    if (this.outlineEffect === undefined) {
        this.outlineEffect = new OutlineEffect(this.app);
    }

    this.outlineEffect.render();
};

export default RenderEvent;
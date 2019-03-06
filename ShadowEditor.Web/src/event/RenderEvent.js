import BaseEvent from './BaseEvent';
import EffectRenderer from '../render/EffectRenderer';

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
    var camera = editor.camera;
    var renderer = editor.renderer;

    scene.updateMatrixWorld();
    sceneHelpers.updateMatrixWorld();

    this.app.editor.renderer.clear();

    this.app.call('beforeRender', this);

    renderer.render(scene, camera);
    renderer.render(sceneHelpers, camera);

    if (this.renderer === undefined) {
        this.createRenderer().then(() => {
            this.app.call('render');
        });
        this.app.on(`sceneLoaded.${this.id}`, this.createRenderer.bind(this));
        this.app.on(`postProcessingChanged.${this.id}`, this.createRenderer.bind(this));
    } else {
        this.renderer.render();
    }

    this.app.call('afterRender', this);
};

RenderEvent.prototype.createRenderer = function () {
    var editor = this.app.editor;
    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;
    var camera = editor.camera;
    var renderer = editor.renderer;

    this.renderer = new EffectRenderer();

    return this.renderer.create(
        [scene, sceneHelpers],
        camera,
        renderer
    );
};

export default RenderEvent;
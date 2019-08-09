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
    app.on(`render.${this.id}`, this.onRender.bind(this));
    app.on(`materialChanged.${this.id}`, this.onRender.bind(this));
    app.on(`sceneGraphChanged.${this.id}`, this.onRender.bind(this));
    app.on(`cameraChanged.${this.id}`, this.onRender.bind(this));
};

RenderEvent.prototype.stop = function () {
    app.on(`render.${this.id}`, null);
    app.on(`materialChanged.${this.id}`, null);
    app.on(`sceneGraphChanged.${this.id}`, null);
    app.on(`cameraChanged.${this.id}`, null);
};

RenderEvent.prototype.onRender = function () {
    var editor = app.editor;
    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;
    var camera = editor.camera;
    var renderer = editor.renderer;

    app.stats.begin();

    scene.updateMatrixWorld();
    sceneHelpers.updateMatrixWorld();

    app.editor.renderer.clear();

    app.call('beforeRender', this);

    if (this.renderer === undefined) {
        this.createRenderer().then(() => {
            app.call('render');
        });
        app.on(`sceneLoaded.${this.id}`, this.createRenderer.bind(this));
        app.on(`postProcessingChanged.${this.id}`, this.createRenderer.bind(this));
    } else {
        this.renderer.render();
    }

    app.call('afterRender', this);

    app.stats.end();
};

RenderEvent.prototype.createRenderer = function () {
    var editor = app.editor;
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
import BaseEvent from '../BaseEvent';

/**
 * 渲染事件
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
    var sceneHelpers = editor.sceneHelpers;
    var scene = editor.scene;
    var camera = editor.camera;
    var renderer = editor.renderer;

    sceneHelpers.updateMatrixWorld();
    scene.updateMatrixWorld();

    // 渲染场景
    renderer.render(scene, camera);

    // 渲染外轮廓（有个黑边，不好看）
    // var effect = new THREE.OutlineEffect(renderer);
    // effect.render(scene, camera);

    // 渲染帮助器
    renderer.render(sceneHelpers, camera);
};

export default RenderEvent;
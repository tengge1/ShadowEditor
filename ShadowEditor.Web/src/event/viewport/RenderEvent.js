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
    var _this = this;
    this.app.on('render.' + this.id, function () {
        _this.onRender();
    });
    this.app.on('materialChanged.' + this.id, function (material) {
        _this.onRender();
    });
    this.app.on('sceneGraphChanged.' + this.id, function () {
        _this.onRender();
    });
    this.app.on('cameraChanged.' + this.id, function () {
        _this.onRender();
    });
};

RenderEvent.prototype.stop = function () {
    this.app.on('render.' + this.id, null);
    this.app.on('materialChanged.' + this.id, null);
    this.app.on('sceneGraphChanged.' + this.id, null);
    this.app.on('cameraChanged.' + this.id, null);
};

RenderEvent.prototype.onRender = function () {
    var editor = this.app.editor;
    var sceneHelpers = editor.sceneHelpers;
    var scene = editor.scene;
    var camera = editor.camera;
    var renderer = editor.renderer;

    sceneHelpers.updateMatrixWorld();
    scene.updateMatrixWorld();

    renderer.render(scene, camera);

    if (renderer instanceof THREE.RaytracingRenderer === false) {
        renderer.render(sceneHelpers, camera);
    }
};

export default RenderEvent;
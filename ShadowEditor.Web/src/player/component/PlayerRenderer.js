import PlayerComponent from './PlayerComponent';

/**
 * 播放器渲染器
 * @param {*} app 应用
 */
function PlayerRenderer(app) {
    PlayerComponent.call(this, app);
}

PlayerRenderer.prototype = Object.create(PlayerComponent.prototype);
PlayerRenderer.prototype.constructor = PlayerRenderer;

PlayerRenderer.prototype.create = function (scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
};

PlayerRenderer.prototype.update = function (clock, deltaTime) {
    this.renderer.render(this.scene, this.camera);
};

PlayerRenderer.prototype.dispose = function () {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
};

export default PlayerRenderer;
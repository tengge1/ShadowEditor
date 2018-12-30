import PlayerComponent from './PlayerComponent';
import EffectRenderer from '../../render/EffectRenderer';

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
    this.renderer = new EffectRenderer();
    return this.renderer.create(scene, camera, renderer);
};

PlayerRenderer.prototype.update = function (clock, deltaTime) {
    this.renderer.render();
};

PlayerRenderer.prototype.dispose = function () {
    this.renderer.dispose();
    this.renderer = null;
};

export default PlayerRenderer;
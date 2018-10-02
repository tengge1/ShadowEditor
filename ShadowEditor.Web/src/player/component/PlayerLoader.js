import PlayerComponent from './PlayerComponent';

/**
 * 播放器事件
 * @param {*} app 应用
 */
function PlayerLoader(app) {
    PlayerComponent.call(this, app);
}

PlayerLoader.prototype = Object.create(PlayerComponent.prototype);
PlayerLoader.prototype.constructor = PlayerLoader;

PlayerLoader.prototype.create = function (scene, camera, renderer) {

};

PlayerLoader.prototype.update = function (clock, deltaTime) {

};

PlayerLoader.prototype.dispose = function () {

};

export default PlayerLoader;
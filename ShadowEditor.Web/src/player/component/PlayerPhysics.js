import PlayerComponent from './PlayerComponent';

/**
 * 播放器物理
 * @param {*} app 应用
 */
function PlayerPhysics(app) {
    PlayerComponent.call(this, app);
}

PlayerPhysics.prototype = Object.create(PlayerComponent.prototype);
PlayerPhysics.prototype.constructor = PlayerPhysics;

PlayerPhysics.prototype.create = function (scene, camera, renderer) {

};

PlayerPhysics.prototype.update = function (clock, deltaTime) {

};

PlayerPhysics.prototype.dispose = function () {

};

export default PlayerPhysics;
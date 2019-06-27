import PlayerComponent from './PlayerComponent';
import Converter from '../../serialization/Converter';

/**
 * 播放器下载事件
 * @param {*} app 播放器
 */
function PlayerLoader(app) {
    PlayerComponent.call(this, app);
}

PlayerLoader.prototype = Object.create(PlayerComponent.prototype);
PlayerLoader.prototype.constructor = PlayerLoader;

PlayerLoader.prototype.create = function (jsons) {
    return (new Converter()).fromJson(jsons, {
        server: app.options.server
    }).then(obj => {
        this.scene = obj.scene;
        return new Promise(resolve => {
            resolve(obj);
        });
    });
};

PlayerLoader.prototype.dispose = function () {
    // TODO: 彻底清空下载的模型资源

    this.scene = null;
};

export default PlayerLoader;
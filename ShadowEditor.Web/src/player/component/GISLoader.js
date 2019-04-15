import PlayerComponent from './PlayerComponent';
import Converter from '../../serialization/Converter';

/**
 * 播放器下载事件
 * @param {*} app 播放器
 */
function GISLoader(app) {
    PlayerComponent.call(this, app);
}

GISLoader.prototype = Object.create(PlayerComponent.prototype);
GISLoader.prototype.constructor = GISLoader;

GISLoader.prototype.create = function (jsons) {
    
};

GISLoader.prototype.dispose = function () {

};

export default GISLoader;
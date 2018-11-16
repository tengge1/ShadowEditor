import PlayerComponent from './PlayerComponent';
import Converter from '../../serialization/Converter';

/**
 * 播放器事件
 * @param {*} app 应用
 */
function PlayerLoader(app) {
    PlayerComponent.call(this, app);

    this.assets = {};
}

PlayerLoader.prototype = Object.create(PlayerComponent.prototype);
PlayerLoader.prototype.constructor = PlayerLoader;

PlayerLoader.prototype.create = function (jsons) {
    var promise = (new Converter()).fromJson(jsons, {
        server: this.app.options.server
    });

    return new Promise(resolve => {
        promise.then(obj => {
            this.scene = obj.scene || new THREE.Scene();
            this.load().then(() => {
                resolve(obj);
            });
        });
    });
};

PlayerLoader.prototype.load = function () {
    this.assets = {};
    var promises = [];

    this.scene.traverse(n => {
        if (n instanceof THREE.Audio) {
            promises.push(new Promise(resolve => {
                var loader = new THREE.AudioLoader();

                loader.load(this.app.options.server + n.userData.Url, buffer => {
                    this.assets[n.userData.Url] = buffer;
                    resolve();
                }, undefined, () => {
                    this.app.error(`PlayerLoader: ${n.userData.Url}下载失败。`);
                    resolve();
                });
            }));
        }
    });

    if (promises.length > 0) {
        return Promise.all(promises);
    } else {
        return new Promise(resolve => {
            resolve();
        });
    }
};

PlayerLoader.prototype.getAsset = function (url) {
    return this.assets[url];
};

PlayerLoader.prototype.dispose = function () {
    this.assets = {};
    this.scene = null;
};

export default PlayerLoader;
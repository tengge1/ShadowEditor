import PlayerComponent from './PlayerComponent';

/**
 * 播放器音频
 * @param {*} app 应用
 */
function PlayerAudio(app) {
    PlayerComponent.call(this, app);

    this.audios = [];
}

PlayerAudio.prototype = Object.create(PlayerComponent.prototype);
PlayerAudio.prototype.constructor = PlayerAudio;

PlayerAudio.prototype.create = function (scene, camera, renderer) {
    this.audios.length = 0;

    scene.traverse(n => {
        if (n instanceof THREE.Audio) {
            this.audios.push(n);
        }
    });

    var loader = new THREE.AudioLoader();

    var promises = this.audios.map(n => {
        return new Promise(resolve => {
            loader.load(this.app.options.server + n.userData.Url, buffer => {
                n.setBuffer(buffer);

                if (n.userData.autoplay) {
                    n.autoplay = n.userData.autoplay;
                    n.play();
                }

                resolve();
            }, undefined, () => {
                this.app.error(`PlayerLoader: ${n.userData.Url} loaded failed.`);
                resolve();
            });
        });
    });

    return Promise.all(promises);
};

PlayerAudio.prototype.dispose = function () {
    this.audios.forEach(n => {
        if (n.isPlaying) {
            n.stop();
        }
    });

    this.audios.length = 0;
};

export default PlayerAudio;
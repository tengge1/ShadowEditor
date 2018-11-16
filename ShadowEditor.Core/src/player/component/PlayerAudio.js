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

PlayerAudio.prototype.create = function (scene, camera, renderer, loader) {
    this.audios = [];

    scene.traverse(n => {
        if (n instanceof THREE.Audio) {
            var buffer = loader.getAsset(n.userData.Url);

            if (buffer === undefined) {
                this.app.error(`PlayerAudio: 加载背景音乐失败。`);
                return;
            }

            n.setBuffer(buffer);

            if (n.userData.autoplay) {
                n.autoplay = n.userData.autoplay;
                n.play();
            }

            this.audios.push(n);
        }
    });
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
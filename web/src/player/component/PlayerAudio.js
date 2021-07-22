/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import PlayerComponent from './PlayerComponent';
import global from '../../global';

/**
 * 播放器音频
 * @param {*} app 播放器
 */
class PlayerAudio extends PlayerComponent {
    constructor(app) {
        super(app);
        this.audios = [];
    }

    create(scene, camera, renderer) { // eslint-disable-line
        this.audios.length = 0;

        scene.traverse(n => {
            if (n instanceof THREE.Audio) {
                this.audios.push(n);
            }
        });

        var loader = new THREE.AudioLoader();

        var promises = this.audios.map(n => {
            return new Promise(resolve => {
                // TODO: global.app.options.server is not a player config
                loader.load(global.app.options.server + n.userData.Url, buffer => {
                    n.setBuffer(buffer);

                    if (n.userData.autoplay) {
                        n.autoplay = n.userData.autoplay;
                        n.play();
                    }

                    resolve();
                }, undefined, () => {
                    console.warn(`PlayerLoader: ${n.userData.Url} loaded failed.`);
                    resolve();
                });
            });
        });

        return Promise.all(promises);
    }

    dispose() {
        this.audios.forEach(n => {
            if (n.isPlaying) {
                n.stop();
            }
        });

        this.audios.length = 0;
    }
}

export default PlayerAudio;
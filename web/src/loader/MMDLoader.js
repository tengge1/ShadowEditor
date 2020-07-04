/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseLoader from './BaseLoader';

/**
 * MMDLoader
 * @author tengge / https://github.com/tengge1
 */
function MMDLoader() {
    BaseLoader.call(this);
}

MMDLoader.prototype = Object.create(BaseLoader.prototype);
MMDLoader.prototype.constructor = MMDLoader;

MMDLoader.prototype.load = function (url, options, environment) {
    return new Promise(resolve => {
        this.require('MMD').then(() => {
            var loader = new THREE.MMDLoader();

            var promise1 = options.Animation && options.Animation.Url ?
                this.loadWithAnimation(url, options, environment, loader) :
                this.loadModel(url, options, environment, loader);
            var promise2 = this.loadCameraAnimation(url, options, environment, loader);
            var promise3 = this.loadAudio(url, options, environment, loader);

            Promise.all([promise1, promise2, promise3]).then(obj => {
                var mesh = obj[0].mesh;
                var animation = obj[0].animation;
                var cameraAnimation = obj[1];
                var audio = obj[2];

                // 修复播放MMD报错的bug
                mesh._animation = animation;
                mesh._cameraAnimation = cameraAnimation;
                mesh._audio = audio;

                resolve(mesh);
            });
        });
    });
};

MMDLoader.prototype.loadModel = function (url, options, environment, loader) {
    return new Promise(resolve => {
        loader.load(url, mesh => {
            resolve({
                mesh: mesh,
                animation: null
            });
        }, undefined, () => {
            // 某个图片下载失败会导致返回null
            // resolve(null);
        });
    });
};

MMDLoader.prototype.loadWithAnimation = function (url, options, environment, loader) {
    if (!options.Animation || !options.Animation.Url) {
        return new Promise(resolve => {
            resolve(null);
        });
    }

    return new Promise(resolve => {
        loader.loadWithAnimation(url, [environment.server + options.Animation.Url], mmd => {
            resolve(mmd);
        }, undefined, () => {
            resolve(null);
        });
    });
};

MMDLoader.prototype.loadCameraAnimation = function (url, options, environment, loader) {
    if (!options.CameraAnimation || !options.CameraAnimation.Url) {
        return new Promise(resolve => {
            resolve(null);
        });
    }

    return new Promise(resolve => {
        loader.loadAnimation([environment.server + options.CameraAnimation.Url], environment.camera, vmd => {
            resolve(vmd);
        }, undefined, () => {
            resolve(null);
        });
    });
};

MMDLoader.prototype.loadAudio = function (url, options, environment, loader) { // eslint-disable-line
    if (!options.Audio || !options.Audio.Url) {
        return new Promise(resolve => {
            resolve(null);
        });
    }

    return new Promise(resolve => {
        var loader = new THREE.AudioLoader();
        loader.load(environment.server + options.Audio.Url, buffer => {
            var audio = new THREE.Audio(environment.audioListener).setBuffer(buffer);
            Object.assign(audio.userData, options.Audio);
            resolve(audio);
        });
    });
};

export default MMDLoader;
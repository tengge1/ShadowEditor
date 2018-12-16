import BaseLoader from './BaseLoader';

/**
 * PMDLoader
 * @author tengge / https://github.com/tengge1
 */
function PMDLoader() {
    BaseLoader.call(this);
}

PMDLoader.prototype = Object.create(BaseLoader.prototype);
PMDLoader.prototype.constructor = PMDLoader;

PMDLoader.prototype.load = function (url, options, environment) {
    return new Promise(resolve => {
        var loader = new THREE.MMDLoader();
        var helper = new THREE.MMDHelper();

        Promise.all([
            this.loadModel(url, options, environment, loader),
            this.loadAnimation(url, options, environment, loader),
            this.loadCameraAnimation(url, options, environment, loader),
            this.loadAudio(url, options, environment, loader),
        ]).then(obj => {
            var mesh = obj[0];
            var animation = obj[1];
            var cameraAnimation = obj[2];
            var audio = obj[3];

            helper.add(mesh);

            if (animation) {
                loader.pourVmdIntoModel(mesh, animation);
            }

            if (cameraAnimation) {
                loader.pourVmdIntoCamera(environment.camera, cameraAnimation);
            }

            helper.setCamera(environment.camera);
            helper.setAnimation(mesh);
            helper.setPhysics(mesh);

            if (cameraAnimation) {
                helper.setCameraAnimation(environment.camera);
            }

            if (audio) {
                var audioParams = { delayTime: 160 * 1 / 30 };
                helper.setAudio(audio, environment.audioListener, audioParams);
            }

            var obj3d = new THREE.Object3D();
            obj3d.add(mesh);

            if (audio) {
                obj3d.add(audio);
            }

            obj3d.name = options.Name;

            helper.unifyAnimationDuration();

            Object.assign(obj3d.userData, {
                helper: helper
            });

            resolve(obj3d);
        });
    });
};

PMDLoader.prototype.loadModel = function (url, options, environment, loader) {
    return new Promise(resolve => {
        loader.loadModel(url, mesh => {
            resolve(mesh);
        }, undefined, () => {
            // 某个图片下载失败会导致返回null
            // resolve(null);
        });
    });
};

PMDLoader.prototype.loadAnimation = function (url, options, environment, loader) {
    if (!options.Animation || !options.Animation.Url) {
        return new Promise(resolve => {
            resolve(null);
        });
    }

    return new Promise(resolve => {
        loader.loadVmd(options.Animation.Url, vmd => {
            resolve(vmd);
        }, undefined, () => {
            resolve(null);
        });
    });
};

PMDLoader.prototype.loadCameraAnimation = function (url, options, environment, loader) {
    if (!options.CameraAnimation || !options.CameraAnimation.Url) {
        return new Promise(resolve => {
            resolve(null);
        });
    }

    return new Promise(resolve => {
        loader.loadVmd(options.CameraAnimation.Url, vmd => {
            resolve(vmd);
        }, undefined, () => {
            resolve(null);
        });
    });
};

PMDLoader.prototype.loadAudio = function (url, options, environment, loader) {
    if (!options.Audio || !options.Audio.Url) {
        return new Promise(resolve => {
            resolve(null);
        });
    }

    return new Promise(resolve => {
        var loader = new THREE.AudioLoader();
        loader.load(options.Audio.Url, buffer => {
            var audio = new THREE.Audio(environment.audioListener).setBuffer(buffer);
            audio.name = 'MMD音频';
            Object.assign(audio.userData, options.Audio);
            resolve(audio);
        });
    });
};

export default PMDLoader;
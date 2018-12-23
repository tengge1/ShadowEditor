import PlayerComponent from '../component/PlayerComponent';

/**
 * MMD动画控制器
 * @param {*} app 应用
 */
function MMDAnimator(app) {
    PlayerComponent.call(this, app);

    this.time = 0.0; // 当前动画播放时间
    this.delayTime = 160 * 1 / 30; // 动画比音频提前执行时间
}

MMDAnimator.prototype = Object.create(PlayerComponent.prototype);
MMDAnimator.prototype.constructor = MMDAnimator;

MMDAnimator.prototype.create = function (scene, camera, renderer, animations) {
    var mmds = [];

    scene.traverse(mesh => {
        if (mesh.userData.Type === 'pmd' || mesh.userData.Type === 'pmx') {
            mmds.push(mesh);
        }
    });

    if (mmds.length === 0) {
        return;
    }

    if (this.helper === undefined) {
        this.helper = new THREE.MMDAnimationHelper();
    }

    var helper = this.helper;

    mmds.forEach(mesh => {
        let {
            animation,
            cameraAnimation,
            audio
        } = mesh.userData.obj;

        if (animation) {
            helper.add(mesh, {
                animation: animation,
                physics: true
            });
        } else {
            helper.add(mesh, {
                physics: true
            });
        }

        if (cameraAnimation) {
            helper.add(camera, {
                animation: cameraAnimation
            });
        }

        if (audio) {
            var audioParams = {
                delayTime: this.delayTime
            };
            helper.add(audio, audioParams);
        }
    });

    this.time = 0.0;

    return new Promise(resolve => {
        resolve();
    });
};

MMDAnimator.prototype.update = function (clock, deltaTime) {
    if (!this.helper) {
        return;
    }

    if (this.helper.audio) { // 如果有音频，使用音频时间比较准确
        var currentTime = this.helper.audio.context.currentTime;
        if (currentTime < this.delayTime) {
            this.time += deltaTime;
        } else {
            var time = this.delayTime + currentTime;
            deltaTime = time - this.time;
            this.time = time;
        }
    }

    this.helper.update(deltaTime);
};

MMDAnimator.prototype.dispose = function () {
    if (!this.helper) {
        return;
    }

    var helper = this.helper;

    helper.meshes.forEach(n => {
        helper.remove(n);
    });

    if (helper.camera) {
        helper.remove(helper.camera);
    }

    if (helper.audio) {
        if (helper.audio.isPlaying) {
            helper.audio.stop();
        }
        helper.remove(helper.audio);
    }
};

export default MMDAnimator;
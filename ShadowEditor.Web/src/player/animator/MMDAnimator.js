import PlayerComponent from '../component/PlayerComponent';

/**
 * MMD动画控制器
 * @param {*} app 应用
 */
function MMDAnimator(app) {
    PlayerComponent.call(this, app);

    this.helper = new THREE.MMDAnimationHelper();
}

MMDAnimator.prototype = Object.create(PlayerComponent.prototype);
MMDAnimator.prototype.constructor = MMDAnimator;

MMDAnimator.prototype.create = function (scene, camera, renderer, animations) {
    var helper = this.helper;

    scene.traverse(mesh => {
        if (mesh.userData.Type === 'pmd' || mesh.userData.Type === 'pmx') {
            let { animation, cameraAnimation, audio } = mesh.userData.obj;

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
                    delayTime: 160 * 1 / 30
                };
                helper.add(audio, audioParams);
            }
        }
    });
};

MMDAnimator.prototype.update = function (clock, deltaTime) {
    this.helper.update(deltaTime);
};

MMDAnimator.prototype.dispose = function () {
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
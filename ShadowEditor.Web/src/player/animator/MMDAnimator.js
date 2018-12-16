import PlayerComponent from '../component/PlayerComponent';

/**
 * MMD动画控制器
 * @param {*} app 应用
 */
function MMDAnimator(app) {
    PlayerComponent.call(this, app);
    this.meshes = [];
}

MMDAnimator.prototype = Object.create(PlayerComponent.prototype);
MMDAnimator.prototype.constructor = MMDAnimator;

MMDAnimator.prototype.create = function (scene, camera, renderer, animations) {
    scene.traverse(n => {
        if (n.userData.Type === 'pmd' || n.userData.Type === 'pmx') {
            this.meshes.push(n);
        }
    });
};

MMDAnimator.prototype.update = function (clock, deltaTime) {
    this.meshes.forEach(n => {
        n.userData.helper.animate(deltaTime);
    });
};

MMDAnimator.prototype.dispose = function () {
    this.meshes.length = 0;
};

export default MMDAnimator;
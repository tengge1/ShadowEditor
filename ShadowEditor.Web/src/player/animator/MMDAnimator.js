import PlayerComponent from '../component/PlayerComponent';
import Ease from '../../animation/Ease';

/**
 * MMD动画控制器
 * @param {*} app 应用
 */
function MMDAnimator(app) {
    PlayerComponent.call(this, app);

    this.helper = new THREE.MMDHelper();
}

MMDAnimator.prototype = Object.create(PlayerComponent.prototype);
MMDAnimator.prototype.constructor = MMDAnimator;

MMDAnimator.prototype.create = function (scene, camera, renderer, animations) {
    scene.traverse(n => {
        if (n instanceof THREE.SkinnedMesh && (n.userData.Type === 'pmd' || n.userData.Type === 'pmx')) {
            this.helper.add(n);
            this.helper.setAnimation(n);
            this.helper.setPhysics(n);
            this.helper.unifyAnimationDuration();
        }
    });
};

MMDAnimator.prototype.update = function (clock, deltaTime) {
    this.helper.animate(deltaTime);
};

MMDAnimator.prototype.dispose = function () {
    this.helper.meshes.length = 0;
};

export default MMDAnimator;
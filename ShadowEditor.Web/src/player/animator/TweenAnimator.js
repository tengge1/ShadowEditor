import PlayerComponent from '../component/PlayerComponent';
import Ease from '../../animation/Ease';

/**
 * 补间动画控制器
 * @param {*} app 应用
 */
function TweenAnimator(app) {
    PlayerComponent.call(this, app);
}

TweenAnimator.prototype = Object.create(PlayerComponent.prototype);
TweenAnimator.prototype.constructor = TweenAnimator;

TweenAnimator.prototype.create = function (scene, camera, renderer, animations) {

};

TweenAnimator.prototype.update = function (clock, deltaTime) {

};

TweenAnimator.prototype.dispose = function () {

};

export default TweenAnimator;
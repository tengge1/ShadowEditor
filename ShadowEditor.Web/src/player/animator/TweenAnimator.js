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
    this.scene = scene;
    this.animations = animations;
};

TweenAnimator.prototype.update = function (clock, deltaTime, time) {
    this.animations.forEach(n => {
        n.animations.forEach(m => {
            this.tweenObject(m, time);
        });
    });
};

TweenAnimator.prototype.tweenObject = function (animation, time) {
    // 条件判断
    if (animation.type !== 'Tween' || time < animation.beginTime || time > animation.endTime || animation.target == null) {
        return;
    }

    // 获取对象
    var target = this.scene.getObjectByProperty('uuid', animation.target);
    if (target == null) {
        console.warn(`Player: 场景中不存在uuid为${animation.target}的物体。`);
        return;
    }

    // 获取插值函数
    var ease = Ease[animation.ease];
    if (ease == null) {
        console.warn(`Player: 不存在名称为${animation.ease}的插值函数。`);
        return;
    }

    var result = ease((time - animation.beginTime) / (animation.endTime - animation.beginTime));

    var positionX = animation.beginPositionX + (animation.endPositionX - animation.beginPositionX) * result;
    var positionY = animation.beginPositionY + (animation.endPositionY - animation.beginPositionY) * result;
    var positionZ = animation.beginPositionZ + (animation.endPositionZ - animation.beginPositionZ) * result;

    var rotationX = animation.beginRotationX + (animation.endRotationX - animation.beginRotationX) * result;
    var rotationY = animation.beginRotationY + (animation.endRotationY - animation.beginRotationY) * result;
    var rotationZ = animation.beginRotationZ + (animation.endRotationZ - animation.beginRotationZ) * result;

    var scaleX = animation.beginScaleX + (animation.endScaleX - animation.beginScaleX) * result;
    var scaleY = animation.beginScaleY + (animation.endScaleY - animation.beginScaleY) * result;
    var scaleZ = animation.beginScaleZ + (animation.endScaleZ - animation.beginScaleZ) * result;

    target.position.x = positionX;
    target.position.y = positionY;
    target.position.z = positionZ;

    target.rotation.x = rotationX;
    target.rotation.y = rotationY;
    target.rotation.z = rotationZ;

    target.scale.x = scaleX;
    target.scale.y = scaleY;
    target.scale.z = scaleZ;
};

TweenAnimator.prototype.dispose = function () {
    this.scene = null;
    this.animations = null;
};

export default TweenAnimator;
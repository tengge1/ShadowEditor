import PlayerComponent from './PlayerComponent';
import Ease from '../animation/Ease';

/**
 * 播放器动画
 * @param {*} app 应用
 */
function PlayerAnimation(app) {
    PlayerComponent.call(this, app);

    this.maxTime = 0; // 最大动画时间（单位：秒）
    this.currentTime = 0; // 当前动画时间（单位：秒）
    this.animations = null;

    this.mmdHelper = new THREE.MMDHelper();
}

PlayerAnimation.prototype = Object.create(PlayerComponent.prototype);
PlayerAnimation.prototype.constructor = PlayerAnimation;

PlayerAnimation.prototype.init = function (scene, camera, renderer, animations) {
    this.maxTime = 0;
    this.currentTime = 0;
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.animations = animations;

    animations.forEach(n => {
        n.animations.forEach(m => {
            if (m.endTime > this.maxTime) {
                this.maxTime = m.endTime;
            }
        });
    });

    scene.traverse(n => {
        if (n instanceof THREE.SkinnedMesh && (n.userData.Type === 'pmd' || n.userData.Type === 'pmx')) {
            this.mmdHelper.add(n);
            this.mmdHelper.setAnimation(n);
            this.mmdHelper.setPhysics(n);
            this.mmdHelper.unifyAnimationDuration();
        }
    });

    this.app.call(`resetAnimation`, this);
    this.app.call(`startAnimation`, this);
    this.app.on(`animationTime.${this.id}`, this.updateTime.bind(this));
};

PlayerAnimation.prototype.updateTime = function (time) {
    this.currentTime = time;
};

PlayerAnimation.prototype.update = function (clock, deltaTime) {
    this.animations.forEach(n => {
        n.animations.forEach(m => {
            this.tweenObject(m);
        });
    });

    // 超过最大动画时间，重置动画
    if (this.currentTime > this.maxTime) {
        this.app.call(`resetAnimation`, this.id);
        this.app.call(`startAnimation`, this.id);
    }

    this.mmdHelper.animate(deltaTime);
};

/**
 * 补间动画处理
 * @param {*} animation 
 */
PlayerAnimation.prototype.tweenObject = function (animation) {
    var time = this.currentTime;

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

PlayerAnimation.prototype.dispose = function () {
    this.maxTime = 0;
    this.currentTime = 0;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animations = null;

    this.app.on(`animationTime.${this.id}`, null);
    this.app.call(`resetAnimation`, this);
};

export default PlayerAnimation;
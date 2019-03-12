import PlayerComponent from './PlayerComponent';
import TweenAnimator from '../animator/TweenAnimator';
import MMDAnimator from '../animator/MMDAnimator';
import ParticleAnimator from '../animator/ParticleAnimator';

/**
 * 播放器动画
 * @param {*} app 播放器
 */
function PlayerAnimation(app) {
    PlayerComponent.call(this, app);

    this.maxTime = 0; // 最大动画时间（单位：秒）
    this.currentTime = 0; // 当前动画时间（单位：秒）
    this.animations = null;

    this.animators = [
        new TweenAnimator(this.app),
        new MMDAnimator(this.app),
        new ParticleAnimator(this.app)
    ];
}

PlayerAnimation.prototype = Object.create(PlayerComponent.prototype);
PlayerAnimation.prototype.constructor = PlayerAnimation;

PlayerAnimation.prototype.create = function (scene, camera, renderer, animations) {
    this.maxTime = 0;
    this.currentTime = 0;
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.animations = animations;

    this.maxTime = this.calculateMaxTime();

    // this.app.call(`resetAnimation`, this);
    // this.app.call(`startAnimation`, this);
    // this.app.on(`animationTime.${this.id}`, this.updateTime.bind(this));

    var promises = this.animators.map(n => {
        return n.create(scene, camera, renderer, animations);
    });

    return Promise.all(promises);
};

PlayerAnimation.prototype.calculateMaxTime = function () {
    var maxTime = 0;

    this.animations.forEach(n => {
        n.animations.forEach(m => {
            if (m.endTime > maxTime) {
                maxTime = m.endTime;
            }
        });
    });

    return maxTime;
};

PlayerAnimation.prototype.updateTime = function (time) {
    this.currentTime = time;
};

PlayerAnimation.prototype.update = function (clock, deltaTime) {
    this.animators.forEach(n => {
        n.update(clock, deltaTime, this.currentTime);
    });

    // // 超过最大动画时间，重置动画
    // if (this.currentTime > this.maxTime) {
    //     this.app.call(`resetAnimation`, this.id);
    //     this.app.call(`startAnimation`, this.id);
    // }
};

PlayerAnimation.prototype.dispose = function () {
    this.maxTime = 0;
    this.currentTime = 0;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animations = null;

    this.animators.forEach(n => {
        n.dispose();
    });

    // this.app.on(`animationTime.${this.id}`, null);
    // this.app.call(`resetAnimation`, this);
};

export default PlayerAnimation;
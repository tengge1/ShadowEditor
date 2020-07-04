/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import PlayerComponent from '../component/PlayerComponent';
import Ease from '../../utils/Ease';

/**
 * 补间动画控制器
 * @param {*} app 播放器
 */
function TweenAnimator(app) {
    PlayerComponent.call(this, app);
}

TweenAnimator.prototype = Object.create(PlayerComponent.prototype);
TweenAnimator.prototype.constructor = TweenAnimator;

TweenAnimator.prototype.create = function (scene, camera, renderer, animations) {
    this.scene = scene;
    this.animations = animations;

    return new Promise(resolve => {
        resolve();
    });
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
    if (animation.type !== 'Tween' || time < animation.beginTime || time > animation.endTime || !animation.target) {
        return;
    }

    // 获取对象
    var target = this.scene.getObjectByProperty('uuid', animation.target);
    if (!target) {
        console.warn(`Player: There is no object that uuid equals to ${animation.target}.`);
        return;
    }

    // 获取插值函数
    var data = animation.data;

    var ease = Ease[data.ease];
    if (!ease) {
        console.warn(`Player: There is no ease function named ${data.ease}.`);
        return;
    }

    var result = ease((time - animation.beginTime) / (animation.endTime - animation.beginTime));

    var positionX = data.beginPositionX + (data.endPositionX - data.beginPositionX) * result;
    var positionY = data.beginPositionY + (data.endPositionY - data.beginPositionY) * result;
    var positionZ = data.beginPositionZ + (data.endPositionZ - data.beginPositionZ) * result;

    var rotationX = data.beginRotationX + (data.endRotationX - data.beginRotationX) * result;
    var rotationY = data.beginRotationY + (data.endRotationY - data.beginRotationY) * result;
    var rotationZ = data.beginRotationZ + (data.endRotationZ - data.beginRotationZ) * result;

    var scaleX = data.beginScaleX + (data.endScaleX - data.beginScaleX) * result;
    var scaleY = data.beginScaleY + (data.endScaleY - data.beginScaleY) * result;
    var scaleZ = data.beginScaleZ + (data.endScaleZ - data.beginScaleZ) * result;

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
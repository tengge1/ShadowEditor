/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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
        new TweenAnimator(app),
        new MMDAnimator(app),
        new ParticleAnimator(app)
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

PlayerAnimation.prototype.update = function (clock, deltaTime) {
    if (this.maxTime > 0) {
        this.currentTime = clock.elapsedTime % this.maxTime;
    }

    this.animators.forEach(n => {
        n.update(clock, deltaTime, this.currentTime);
    });
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
};

export default PlayerAnimation;
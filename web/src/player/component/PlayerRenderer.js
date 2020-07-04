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
import EffectRenderer from '../../render/EffectRenderer';

/**
 * 播放器渲染器
 * @param {*} app 播放器
 */
function PlayerRenderer(app) {
    PlayerComponent.call(this, app);
}

PlayerRenderer.prototype = Object.create(PlayerComponent.prototype);
PlayerRenderer.prototype.constructor = PlayerRenderer;

PlayerRenderer.prototype.create = function (scene, camera, renderer) {
    this.renderer = new EffectRenderer();
    return this.renderer.create(scene, camera, renderer);
};

PlayerRenderer.prototype.update = function (clock, deltaTime) { // eslint-disable-line
    this.renderer.render();
};

PlayerRenderer.prototype.dispose = function () {
    this.renderer.dispose();
    this.renderer = null;
};

export default PlayerRenderer;
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

/**
 * 虚拟现实
 * @param {*} app 播放器
 */
function WebVR(app) {
    PlayerComponent.call(this, app);
}

WebVR.prototype = Object.create(PlayerComponent.prototype);
WebVR.prototype.constructor = WebVR;

WebVR.prototype.create = function (scene, camera, renderer) {

};

WebVR.prototype.dispose = function () {

};

export default WebVR;
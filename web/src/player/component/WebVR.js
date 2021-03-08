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
import VRButton from '../../webvr/VRButton';

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
    if (!this.app.options.enableVR) {
        return;
    }
    if (!this.vrButton) {
        this.vrButton = VRButton.createButton(renderer);
    }
    renderer.xr.enabled = true;
    this.app.container.appendChild(this.vrButton);

    // var position = camera.position.clone();
    // var vrCamera = renderer.xr.getCamera(camera);
    // vrCamera.position.copy(position);

    var controller = renderer.xr.getController(0);
    controller.matrix.copy(camera.matrix);
    scene.add(controller);
};

WebVR.prototype.dispose = function () {
    if (this.vrButton) {
        this.app.container.removeChild(this.vrButton);
        delete this.vrButton;
    }
};

export default WebVR;
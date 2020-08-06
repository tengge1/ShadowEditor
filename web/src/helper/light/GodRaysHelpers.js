/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseHelper from '../BaseHelper';
import GodRays from '../../postprocessing/GodRays';
import global from '../../global';

/**
 * 神光帮助器
 * @author tengge / https://github.com/tengge1
 */
function GodRaysHelpers() {
    BaseHelper.call(this);
}

GodRaysHelpers.prototype = Object.create(BaseHelper.prototype);
GodRaysHelpers.prototype.constructor = GodRaysHelpers;

GodRaysHelpers.prototype.start = function () {
    this.ready = false;
    this.ray = new GodRays();
    this.ray.init(global.app.editor.scene, global.app.editor.camera, global.app.editor.renderer).then(() => {
        this.ready = true;
    });
    global.app.on(`afterRender.${this.id}`, this.onAfterRender.bind(this));
};

GodRaysHelpers.prototype.stop = function () {
    this.ready = false;
    this.ray.dispose();
    global.app.on(`afterRender.${this.id}`, null);
};

GodRaysHelpers.prototype.onAfterRender = function () {
    if (!this.ready) {
        return;
    }
    this.ray.render();
};

export default GodRaysHelpers;
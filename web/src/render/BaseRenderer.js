/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
var ID = -1;

/**
 * 基本渲染器
 * @author tengge / https://github.com/tengge1
 */
function BaseRenderer() {
    this.id = `${this.constructor.name}${ID--}`;
}

// eslint-disable-next-line
BaseRenderer.prototype.create = function (scenes, camera, renderer, selected) {
    return new Promise(resolve => {
        resolve();
    });
};

BaseRenderer.prototype.render = function () {

};

BaseRenderer.prototype.dispose = function () {

};

export default BaseRenderer;
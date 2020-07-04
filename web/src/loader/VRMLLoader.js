/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseLoader from './BaseLoader';

/**
 * VRMLLoader
 * @author tengge / https://github.com/tengge1
 */
function VRMLLoader() {
    BaseLoader.call(this);
}

VRMLLoader.prototype = Object.create(BaseLoader.prototype);
VRMLLoader.prototype.constructor = VRMLLoader;

VRMLLoader.prototype.load = function (url, options) { // eslint-disable-line
    return new Promise(resolve => {
        this.require(['chevrotain', 'VRMLLoader']).then(() => {
            var loader = new THREE.VRMLLoader();
            loader.load(url, obj => {
                resolve(obj);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default VRMLLoader;
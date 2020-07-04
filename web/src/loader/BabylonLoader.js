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
 * BabylonLoader
 * @author tengge / https://github.com/tengge1
 */
function BabylonLoader() {
    BaseLoader.call(this);
}

BabylonLoader.prototype = Object.create(BaseLoader.prototype);
BabylonLoader.prototype.constructor = BabylonLoader;

BabylonLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('BabylonLoader').then(() => {
            var loader = new THREE.BabylonLoader();

            loader.load(url, scene => {
                var obj3d = new THREE.Object3D();
                obj3d.children = scene.children;
                resolve(obj3d);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default BabylonLoader;
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
 * BinaryLoader
 * @author tengge / https://github.com/tengge1
 */
function BinaryLoader() {
    BaseLoader.call(this);
}

BinaryLoader.prototype = Object.create(BaseLoader.prototype);
BinaryLoader.prototype.constructor = BinaryLoader;

BinaryLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('BinaryLoader').then(() => {
            var loader = new THREE.BinaryLoader();

            loader.load(url, (geometry, materials) => {
                var mesh = new THREE.Mesh(geometry, materials);
                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default BinaryLoader;
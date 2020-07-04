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
 * VTKLoader
 * @author tengge / https://github.com/tengge1
 */
function VTKLoader() {
    BaseLoader.call(this);
}

VTKLoader.prototype = Object.create(BaseLoader.prototype);
VTKLoader.prototype.constructor = VTKLoader;

VTKLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('VTKLoader').then(() => {
            var loader = new THREE.VTKLoader();

            loader.load(url, geometry => {
                var material = new THREE.MeshStandardMaterial();
                var mesh = new THREE.Mesh(geometry, material);
                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default VTKLoader;
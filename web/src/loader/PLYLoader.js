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
 * PLYLoader
 * @author tengge / https://github.com/tengge1
 */
function PLYLoader() {
    BaseLoader.call(this);
}

PLYLoader.prototype = Object.create(BaseLoader.prototype);
PLYLoader.prototype.constructor = PLYLoader;

PLYLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('PLYLoader').then(() => {
            var loader = new THREE.PLYLoader();

            loader.load(url, geometry => {
                geometry.computeVertexNormals();
                var material = new THREE.MeshStandardMaterial();
                var mesh = new THREE.Mesh(geometry, material);
                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default PLYLoader;
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
 * MD2Loader
 * @author tengge / https://github.com/tengge1
 */
function MD2Loader() {
    BaseLoader.call(this);
}

MD2Loader.prototype = Object.create(BaseLoader.prototype);
MD2Loader.prototype.constructor = MD2Loader;

MD2Loader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('MD2Loader').then(() => {
            var loader = new THREE.MD2Loader();

            loader.load(url, geometry => {
                var material = new THREE.MeshStandardMaterial({
                    morphTargets: true,
                    morphNormals: true
                });

                var mesh = new THREE.Mesh(geometry, material);
                mesh.mixer = new THREE.AnimationMixer(mesh);

                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default MD2Loader;
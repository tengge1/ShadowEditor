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
 * PRWMLoader
 * @author tengge / https://github.com/tengge1
 */
function PRWMLoader() {
    BaseLoader.call(this);
}

PRWMLoader.prototype = Object.create(BaseLoader.prototype);
PRWMLoader.prototype.constructor = PRWMLoader;

PRWMLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('PRWMLoader').then(() => {
            var loader = new THREE.PRWMLoader();

            loader.load(url, geometry => {
                var material = new THREE.MeshPhongMaterial();
                var mesh = new THREE.Mesh(geometry, material);
                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default PRWMLoader;
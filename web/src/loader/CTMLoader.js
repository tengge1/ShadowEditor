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
 * CTMLoader
 * @author tengge / https://github.com/tengge1
 */
function CTMLoader() {
    BaseLoader.call(this);
}

CTMLoader.prototype = Object.create(BaseLoader.prototype);
CTMLoader.prototype.constructor = CTMLoader;

CTMLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require([
            'lzma',
            'CTMLoader'
        ]).then(() => {
            var loader = new THREE.CTMLoader();

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

export default CTMLoader;
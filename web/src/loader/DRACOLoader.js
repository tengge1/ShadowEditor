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
 * DRACOLoader
 * @author tengge / https://github.com/tengge1
 */
function DRACOLoader() {
    BaseLoader.call(this);
}

DRACOLoader.prototype = Object.create(BaseLoader.prototype);
DRACOLoader.prototype.constructor = DRACOLoader;

DRACOLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('DRACOLoader').then(() => {
            var loader = new THREE.DRACOLoader();
            loader.setDecoderPath('assets/js/libs/draco/');

            loader.load(url, geometry => {
                geometry.computeVertexNormals();

                var material = new THREE.MeshStandardMaterial();
                var mesh = new THREE.Mesh(geometry, material);

                // TODO: 取消注释不能加载模型，不知道为什么。
                // loader.releaseDecoderModule();

                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default DRACOLoader;
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
 * KMZLoader
 * @author tengge / https://github.com/tengge1
 */
function KMZLoader() {
    BaseLoader.call(this);
}

KMZLoader.prototype = Object.create(BaseLoader.prototype);
KMZLoader.prototype.constructor = KMZLoader;

KMZLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require([
            'ColladaLoader',
            'KMZLoader'
        ]).then(() => {
            var loader = new THREE.KMZLoader();

            loader.load(url, collada => {
                var obj3d = collada.scene;
                resolve(obj3d);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default KMZLoader;
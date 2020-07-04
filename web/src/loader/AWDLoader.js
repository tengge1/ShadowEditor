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
 * AWDLoader
 * @author tengge / https://github.com/tengge1
 */
function AWDLoader() {
    BaseLoader.call(this);
}

AWDLoader.prototype = Object.create(BaseLoader.prototype);
AWDLoader.prototype.constructor = AWDLoader;

AWDLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('AWDLoader').then(() => {
            var loader = new THREE.AWDLoader();

            loader.load(url, obj3d => {
                resolve(obj3d);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default AWDLoader;
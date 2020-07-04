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
 * PCDLoader
 * @author tengge / https://github.com/tengge1
 */
function PCDLoader() {
    BaseLoader.call(this);
}

PCDLoader.prototype = Object.create(BaseLoader.prototype);
PCDLoader.prototype.constructor = PCDLoader;

PCDLoader.prototype.load = function (url, options) { // eslint-disable-line
    return new Promise(resolve => {
        this.require('PCDLoader').then(() => {
            var loader = new THREE.PCDLoader();
            loader.load(url, mesh => {
                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default PCDLoader;
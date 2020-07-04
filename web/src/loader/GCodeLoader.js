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
 * GCodeLoader
 * @author tengge / https://github.com/tengge1
 */
function GCodeLoader() {
    BaseLoader.call(this);
}

GCodeLoader.prototype = Object.create(BaseLoader.prototype);
GCodeLoader.prototype.constructor = GCodeLoader;

GCodeLoader.prototype.load = function (url, options) { // eslint-disable-line
    return new Promise(resolve => {
        this.require('GCodeLoader').then(() => {
            var loader = new THREE.GCodeLoader();

            loader.load(url, obj3d => {
                resolve(obj3d);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default GCodeLoader;
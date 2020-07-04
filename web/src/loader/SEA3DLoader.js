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
 * SEA3DLoader
 * @author tengge / https://github.com/tengge1
 */
function SEA3DLoader() {
    BaseLoader.call(this);
}

SEA3DLoader.prototype = Object.create(BaseLoader.prototype);
SEA3DLoader.prototype.constructor = SEA3DLoader;

SEA3DLoader.prototype.load = function (url, options) {
    var obj = new THREE.Object3D();

    return new Promise(resolve => {
        this.require('SEA3D').then(() => {
            var loader = new THREE.SEA3D({
                autoPlay: true, // Auto play animations
                container: obj, // Container to add models
                progressive: true // Progressive download
            });

            loader.onComplete = function () {
                resolve(obj);
            };

            loader.load(url);

            Object.assign(obj.userData, {
                animNames: ['Animation1'],
                scripts: [{
                    id: null,
                    name: `${options.Name}${_t('Animation')}`,
                    type: 'javascript',
                    source: this.createScripts(options.Name),
                    uuid: THREE.Math.generateUUID()
                }]
            });
        });
    });
};

SEA3DLoader.prototype.createScripts = function (name) { // eslint-disable-line
    return `function update(clock, deltaTime) { \n    THREE.SEA3D.AnimationHandler.update(deltaTime); \n}`;
};

export default SEA3DLoader;
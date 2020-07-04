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
 * AssimpLoader
 * @author tengge / https://github.com/tengge1
 */
function AssimpLoader() {
    BaseLoader.call(this);
}

AssimpLoader.prototype = Object.create(BaseLoader.prototype);
AssimpLoader.prototype.constructor = AssimpLoader;

AssimpLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        this.require('AssimpLoader').then(() => {
            var loader = new THREE.AssimpLoader();
            loader.load(url, result => {
                var obj = result.object;

                obj._obj = result;
                obj._root = obj;

                if (result.animation) {
                    Object.assign(obj.userData, {
                        animNames: 'Animation1',
                        scripts: [{
                            id: null,
                            name: `${options.Name}${_t('Animation')}`,
                            type: 'javascript',
                            source: this.createScripts(options.Name),
                            uuid: THREE.Math.generateUUID()
                        }]
                    });
                }

                resolve(obj);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

AssimpLoader.prototype.createScripts = function (name) {
    return `var mesh = this.getObjectByName('${name}');\n\n` +
        `var animation = mesh._obj.animation;\n\n` +
        `function update(clock, deltaTime) { \n  if(animation) {\n     animation.setTime( performance.now() / 1000 ); \n    } \n}`;
};

export default AssimpLoader;
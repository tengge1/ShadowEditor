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
 * FBXLoader
 * @author tengge / https://github.com/tengge1
 */
function FBXLoader() {
    BaseLoader.call(this);
}

FBXLoader.prototype = Object.create(BaseLoader.prototype);
FBXLoader.prototype.constructor = FBXLoader;

FBXLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        this.require('FBXLoader').then(() => {
            var loader = new THREE.FBXLoader();

            loader.load(url, obj3d => {
                obj3d._obj = obj3d;
                obj3d._root = obj3d;

                if (obj3d.animations && obj3d.animations.length > 0) {
                    Object.assign(obj3d.userData, {
                        animNames: obj3d.animations.map(n => n.name),
                        scripts: [{
                            id: null,
                            name: `${options.Name}${_t('Animation')}`,
                            type: 'javascript',
                            source: this.createScripts(options.Name),
                            uuid: THREE.Math.generateUUID()
                        }]
                    });
                }

                resolve(obj3d);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

FBXLoader.prototype.createScripts = function (name) {
    return `var mesh = this.getObjectByName('${name}');\n\n` +
        `var obj = mesh._obj;\n\n` +
        `var root = mesh._root;\n\n` +
        `var mixer = new THREE.AnimationMixer(root);\n\n` +
        `mixer.clipAction(obj.animations[0]).play();\n\n` +
        `function update(clock, deltaTime) { \n    mixer.update(deltaTime); \n}`;
};

export default FBXLoader;
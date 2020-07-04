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
 * ColladaLoader
 * @author tengge / https://github.com/tengge1
 */
function ColladaLoader() {
    BaseLoader.call(this);
}

ColladaLoader.prototype = Object.create(BaseLoader.prototype);
ColladaLoader.prototype.constructor = ColladaLoader;

ColladaLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        this.require('ColladaLoader').then(() => {
            var loader = new THREE.ColladaLoader();

            loader.load(url, collada => {
                var dae = collada.scene;

                dae.traverse(child => {
                    if (child instanceof THREE.Mesh) {
                        child.material.flatShading = true;
                    }
                    if (child.isSkinnedMesh) {
                        child.frustumCulled = false;
                    }
                });

                if (isNaN(dae.scale.x) || isNaN(dae.scale.y) || isNaN(dae.scale.z)) {
                    dae.scale.x = dae.scale.y = dae.scale.z = 10.0;
                    dae.updateMatrix();
                }

                dae._obj = collada;
                dae._root = dae;

                if (collada.animations && collada.animations.length > 0) {
                    Object.assign(dae.userData, {
                        animNames: collada.animations.map(n => n.name),
                        scripts: [{
                            id: null,
                            name: `${options.Name}${_t('Animation')}`,
                            type: 'javascript',
                            source: this.createScripts(options.Name),
                            uuid: THREE.Math.generateUUID()
                        }]
                    });
                }

                resolve(dae);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

ColladaLoader.prototype.createScripts = function (name) {
    return `var mesh = this.getObjectByName('${name}');\n\n` +
        `var obj = mesh._obj;\n\n` +
        `var root = mesh._root;\n\n` +
        `var mixer = new THREE.AnimationMixer(root);\n\n` +
        `mixer.clipAction(obj.animations[0]).play();\n\n` +
        `function update(clock, deltaTime) { \n    mixer.update(deltaTime); \n}`;
};

export default ColladaLoader;
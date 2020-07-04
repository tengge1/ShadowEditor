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
 * JsonLoader
 * @author tengge / https://github.com/tengge1
 */
function JsonLoader() {
    BaseLoader.call(this);
}

JsonLoader.prototype = Object.create(BaseLoader.prototype);
JsonLoader.prototype.constructor = JsonLoader;

JsonLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        this.require([
            'LegacyJSONLoader'
        ]).then(() => {
            var loader = new THREE.LegacyJSONLoader();

            loader.load(url, (geometry, materials) => {
                for (var i = 0; i < materials.length; i++) {
                    var m = materials[i];
                    m.skinning = true;
                    m.morphTargets = true;
                }

                var mesh = new THREE.SkinnedMesh(geometry, materials);

                // TODO: 最新版three.js不再支持了
                if (!mesh.skeleton) {
                    mesh.skeleton = {
                        update: function () {

                        }
                    };
                }

                mesh._obj = [geometry, materials];
                mesh._root = mesh;

                Object.assign(mesh.userData, {
                    scripts: [{
                        id: null,
                        name: `${options.Name}${_t('Animation')}`,
                        type: 'javascript',
                        source: this.createScripts(options.Name),
                        uuid: THREE.Math.generateUUID()
                    }]
                });

                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

JsonLoader.prototype.createScripts = function (name) {
    return `var mesh = this.getObjectByName('${name}');\n` +
        `var mixer = new THREE.AnimationMixer(mesh)\n` +
        `mixer.clipAction(mesh.geometry.animations[0]).play();\n\n` +
        `function update(clock, deltaTime) { \n    mixer.update(deltaTime); \n}`;
};

export default JsonLoader;
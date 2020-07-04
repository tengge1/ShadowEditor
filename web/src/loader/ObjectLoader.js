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
 * ObjectLoader（json文件加载器）
 * @author tengge / https://github.com/tengge1
 */
function ObjectLoader() {
    BaseLoader.call(this);
}

ObjectLoader.prototype = Object.create(BaseLoader.prototype);
ObjectLoader.prototype.constructor = ObjectLoader;

ObjectLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        this.require([
            'LegacyJSONLoader'
        ]).then(() => {
            var loader = new THREE.ObjectLoader();

            loader.load(url, obj => {
                if (obj.traverse) {
                    obj.traverse(n => {
                        // bug: 由于导出的json格式的模型文件，可能带有Server: true信息，
                        // 会导致同一个模型下载两次。
                        if (n.userData && n.userData.Server === true) {
                            delete n.userData.Server;
                            delete n.userData.Url;
                        }
                    });
                }

                if (obj instanceof THREE.Scene && obj.children.length > 0 && obj.children[0] instanceof THREE.SkinnedMesh) {
                    resolve(this.loadSkinnedMesh(obj, options));
                } else {
                    resolve(obj);
                }
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

ObjectLoader.prototype.loadSkinnedMesh = function (scene, options) {
    var mesh = null;

    scene.traverse(child => {
        if (child instanceof THREE.SkinnedMesh) {
            mesh = child;
        }
    });

    var animations = mesh.geometry.animations;

    if (options.Name && animations && animations.length > 0) {

        var names = animations.map(n => n.name);

        var source1 = `var mesh = this.getObjectByName('${options.Name}');\nvar mixer = new THREE.AnimationMixer(mesh);\n\n`;

        var source2 = ``;

        names.forEach(n => {
            source2 += `var ${n}Animation = mixer.clipAction('${n}');\n`;
        });

        var source3 = `\n${names[0]}Animation.play();\n\n`;

        var source4 = `function update(clock, deltaTime) { \n    mixer.update(deltaTime); \n}`;

        var source = source1 + source2 + source3 + source4;

        mesh.userData.scripts = [{
            id: null,
            name: `${options.Name}${_t('Animation')}`,
            type: 'javascript',
            source: source,
            uuid: THREE.Math.generateUUID()
        }];
    }

    return mesh;
};

export default ObjectLoader;
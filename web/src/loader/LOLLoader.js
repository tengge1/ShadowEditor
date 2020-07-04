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
import LolModel from './lol/Model';

/**
 * LOLLoader
 * @author tengge / https://github.com/tengge1
 */
function LOLLoader() {
    BaseLoader.call(this);
}

LOLLoader.prototype = Object.create(BaseLoader.prototype);
LOLLoader.prototype.constructor = LOLLoader;

LOLLoader.prototype.load = function (url, options) {
    if (!Array.isArray(url) || url.length < 3) {
        console.warn(`LOLLoader: url must be an array, and contains .lmesh,.lanim and .png three urls.`);
        return new Promise(resolve => {
            resolve(null);
        });
    }

    var lmesh = url.filter(n => n.endsWith('.lmesh'))[0];
    var lanim = url.filter(n => n.endsWith('.lanim'))[0];
    var png = url.filter(n => n.endsWith('.png'))[0];

    if (lmesh === undefined) {
        console.warn(`LOLLoader: url doesn't contain .lmesh url.`);
        return new Promise(resolve => {
            resolve(null);
        });
    }

    if (lanim === undefined) {
        console.warn(`LOLLoader: url doesn't contain .lanim url.`);
        return new Promise(resolve => {
            resolve(null);
        });
    }

    if (png === undefined) {
        console.warn(`LOLLoader: url doesn't contain .png url.`);
        return new Promise(resolve => {
            resolve(null);
        });
    }

    var fileName = lmesh.split('/')[lmesh.split('/').length - 1];
    var fileNameNoExt = fileName.split('.')[0];
    var champion = fileNameNoExt.split('_')[0];
    var skin = fileNameNoExt.split('_')[1];

    return new Promise(resolve => {
        this.require(['gl-matrix', 'pako']).then(() => {
            var model = new LolModel({
                champion: champion,
                skin: parseInt(skin),
                meshUrl: lmesh,
                animUrl: lanim,
                textureUrl: png
            });
            model.load();
            model.on('load.LOLLoader', () => {
                var geometry = model.geometry;
                var material = model.material;

                var mesh = new THREE.Mesh(geometry, material);
                mesh.name = options.Name;

                mesh.userData.type = 'lol';
                mesh.userData.model = model;
                mesh.userData.scripts = [{
                    id: null,
                    name: `${options.Name}${_t('Animation')}`,
                    type: 'javascript',
                    source: this.createScripts(options.Name, model),
                    uuid: THREE.Math.generateUUID()
                }];

                resolve(mesh);
            });
        });
    });
};

LOLLoader.prototype.createScripts = function (name, model) {
    var animations = model.getAnimations();

    return `var mesh = this.getObjectByName('${name}');\n` +
        `var model = mesh.userData.model;\n\n` +
        `// animNames: ${animations.join(',')}\n` +
        `model.setAnimation('${animations[0]}');\n\n` +
        `function update(clock, deltaTime) { \n    model.update(clock.elapsedTime * 1000); \n}`;
};

export default LOLLoader;
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

                Object.assign(dae.userData, {
                    obj: collada,
                    root: dae
                });

                if (collada.animations && collada.animations.length > 0) {
                    Object.assign(dae.userData, {
                        animNames: collada.animations.map(n => n.name),
                        scripts: [{
                            id: null,
                            name: `${options.Name}动画`,
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
        `var obj = mesh.userData.obj;\n\n` +
        `var root = mesh.userData.root;\n\n` +
        `var mixer = new THREE.AnimationMixer(root);\n\n` +
        `mixer.clipAction(obj.animations[0]).play();\n\n` +
        `function update(clock, deltaTime) { \n    mixer.update(deltaTime); \n}`;
};

export default ColladaLoader;
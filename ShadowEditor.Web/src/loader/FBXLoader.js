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
                Object.assign(obj3d.userData, {
                    obj: obj3d,
                    root: obj3d,
                });

                if (obj3d.animations && obj3d.animations.length > 0) {
                    Object.assign(obj3d.userData, {
                        animNames: obj3d.animations.map(n => n.name),
                        scripts: [{
                            id: null,
                            name: `${options.Name}动画`,
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
        `var obj = mesh.userData.obj;\n\n` +
        `var root = mesh.userData.root;\n\n` +
        `var mixer = new THREE.AnimationMixer(root);\n\n` +
        `mixer.clipAction(obj.animations[0]).play();\n\n` +
        `function update(clock, deltaTime) { \n    mixer.update(deltaTime); \n}`;
};

export default FBXLoader;
import BaseLoader from './BaseLoader';

/**
 * JsLoader
 * @author tengge / https://github.com/tengge1
 */
function JsLoader() {
    BaseLoader.call(this);
}

JsLoader.prototype = Object.create(BaseLoader.prototype);
JsLoader.prototype.constructor = JsLoader;

JsLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        var loader = new THREE.JSONLoader();

        loader.load(url, (geometry, materials) => {
            for (var i = 0; i < materials.length; i++) {
                var m = materials[i];
                m.skinning = true;
                m.morphTargets = true;
            }

            var mesh = new THREE.SkinnedMesh(geometry, materials);

            Object.assign(mesh.userData, {
                obj: [geometry, materials],
                root: mesh,
                scripts: [{
                    id: null,
                    name: `${options.Name}动画`,
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
};

JsLoader.prototype.createScripts = function (name) {
    return `var mesh = this.getObjectByName('${name}');\n` +
        `var mixer = new THREE.AnimationMixer(mesh)\n` +
        `mixer.clipAction(mesh.geometry.animations[0]).play();\n\n` +
        `function update(clock, deltaTime) { \n    mixer.update(deltaTime); \n}`;
};

export default JsLoader;
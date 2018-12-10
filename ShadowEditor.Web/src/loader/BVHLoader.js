import BaseLoader from './BaseLoader';

/**
 * BVHLoader
 * @author tengge / https://github.com/tengge1
 */
function BVHLoader() {
    BaseLoader.call(this);
}

BVHLoader.prototype = Object.create(BaseLoader.prototype);
BVHLoader.prototype.constructor = BVHLoader;

BVHLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        this.require('BVHLoader').then(() => {
            var loader = new THREE.BVHLoader();
            loader.load(url, result => {
                var skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);
                skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly

                var boneContainer = new THREE.Group();
                boneContainer.add(result.skeleton.bones[0]);

                var obj3d = new THREE.Object3D();
                obj3d.add(skeletonHelper);
                obj3d.add(boneContainer);

                Object.assign(obj3d.userData, {
                    obj: result,
                    root: skeletonHelper
                });

                Object.assign(obj3d.userData, {
                    animNames: 'Animation1',
                    scripts: [{
                        id: null,
                        name: `${options.Name}动画`,
                        type: 'javascript',
                        source: this.createScripts(options.Name),
                        uuid: THREE.Math.generateUUID()
                    }]
                });

                resolve(obj3d);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

BVHLoader.prototype.createScripts = function (name) {
    return `var mesh = this.getObjectByName('${name}');\n\n` +
        `var mixer = new THREE.AnimationMixer(mesh.userData.root);\n\n` +
        `mixer.clipAction(mesh.userData.obj.clip).setEffectiveWeight(1.0).play();` +
        `function update(clock, deltaTime) { \n     mixer.update(deltaTime); \n}`;
};

export default BVHLoader;
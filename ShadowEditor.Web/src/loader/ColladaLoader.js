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
        var loader = new THREE.ColladaLoader();

        loader.load(url, collada => {
            var dae = collada.scene;

            dae.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.material.flatShading = true;
                }
            });

            dae.scale.x = dae.scale.y = dae.scale.z = 10.0;

            dae.updateMatrix();

            Object.assign(dae.userData, {
                obj: collada,
                root: dae
            });

            resolve(dae);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default ColladaLoader;
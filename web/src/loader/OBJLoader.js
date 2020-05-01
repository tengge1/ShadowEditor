import BaseLoader from './BaseLoader';

/**
 * OBJLoader
 * @author tengge / https://github.com/tengge1
 */
function OBJLoader() {
    BaseLoader.call(this);
}

OBJLoader.prototype = Object.create(BaseLoader.prototype);
OBJLoader.prototype.constructor = OBJLoader;

OBJLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require(['LoaderSupport', 'OBJLoader2', 'MTLLoader']).then(() => {
            var objLoader = new THREE.OBJLoader2();
            var mtlLoader = new THREE.MTLLoader();

            var promise = new Promise(resolve1 => {
                mtlLoader.load(url.replace('.obj', '.mtl'), obj => {
                    resolve1(obj);
                }, undefined, () => {
                    resolve1(null);
                });

            });

            promise.then(mtl => {
                if (mtl) {
                    mtl.preload();
                    objLoader.setMaterials(mtl.materials);
                }

                objLoader.load(url, obj => {
                    resolve(obj.detail.loaderRootNode);
                }, undefined, () => {
                    resolve(null);
                });
            });
        });
    });
};

export default OBJLoader;
import BaseLoader from './BaseLoader';

/**
 * PMDLoader
 * @author tengge / https://github.com/tengge1
 */
function PMDLoader() {
    BaseLoader.call(this);
}

PMDLoader.prototype = Object.create(BaseLoader.prototype);
PMDLoader.prototype.constructor = PMDLoader;

PMDLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        var loader = new THREE.MMDLoader();

        loader.loadModel(url, mesh => {
            mesh.name = options.name;
            resolve(mesh);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default PMDLoader;
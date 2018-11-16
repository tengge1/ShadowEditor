import BaseLoader from './BaseLoader';

/**
 * CTMLoader
 * @author tengge / https://github.com/tengge1
 */
function CTMLoader() {
    BaseLoader.call(this);
}

CTMLoader.prototype = Object.create(BaseLoader.prototype);
CTMLoader.prototype.constructor = CTMLoader;

CTMLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.CTMLoader();

        loader.load(url, geometry => {
            var material = new THREE.MeshStandardMaterial();
            var mesh = new THREE.Mesh(geometry, material);
            resolve(mesh);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default CTMLoader;
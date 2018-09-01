import BaseLoader from './BaseLoader';

/**
 * STLLoader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function STLLoader(app) {
    BaseLoader.call(this, app);
}

STLLoader.prototype = Object.create(BaseLoader.prototype);
STLLoader.prototype.constructor = STLLoader;

STLLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.STLLoader();

        loader.load(url, geometry => {
            var material = new THREE.MeshStandardMaterial();
            var mesh = new THREE.Mesh(geometry, material);
            resolve(mesh);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default STLLoader;
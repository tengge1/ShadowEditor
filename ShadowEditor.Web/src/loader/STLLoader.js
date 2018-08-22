import BaseLoader from './BaseLoader';

/**
 * STLLoader
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
        });
    });
};

export default STLLoader;
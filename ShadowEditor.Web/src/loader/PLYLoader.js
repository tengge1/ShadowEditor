import BaseLoader from './BaseLoader';

/**
 * PLYLoader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function PLYLoader(app) {
    BaseLoader.call(this, app);
}

PLYLoader.prototype = Object.create(BaseLoader.prototype);
PLYLoader.prototype.constructor = PLYLoader;

PLYLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.PLYLoader();

        loader.load(url, geometry => {
            var material = new THREE.MeshStandardMaterial();
            var mesh = new THREE.Mesh(geometry, material);
            resolve(mesh);
        });
    });
};

export default PLYLoader;
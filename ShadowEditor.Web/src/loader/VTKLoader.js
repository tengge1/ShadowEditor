import BaseLoader from './BaseLoader';

/**
 * VTKLoader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function VTKLoader(app) {
    BaseLoader.call(this, app);
}

VTKLoader.prototype = Object.create(BaseLoader.prototype);
VTKLoader.prototype.constructor = VTKLoader;

VTKLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.VTKLoader();

        loader.load(url, geometry => {
            var material = new THREE.MeshStandardMaterial();
            var mesh = new THREE.Mesh(geometry, material);
            resolve(mesh);
        });
    });
};

export default VTKLoader;
import BaseLoader from './BaseLoader';

/**
 * MD2Loader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function MD2Loader(app) {
    BaseLoader.call(this, app);
}

MD2Loader.prototype = Object.create(BaseLoader.prototype);
MD2Loader.prototype.constructor = MD2Loader;

MD2Loader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.MD2Loader();

        loader.load(url, geometry => {
            var material = new THREE.MeshStandardMaterial({
                morphTargets: true,
                morphNormals: true
            });

            var mesh = new THREE.Mesh(geometry, material);
            mesh.mixer = new THREE.AnimationMixer(mesh);

            resolve(mesh);
        });
    });
};

export default MD2Loader;
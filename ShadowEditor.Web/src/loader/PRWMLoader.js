import BaseLoader from './BaseLoader';

/**
 * PRWMLoader
 * @author tengge / https://github.com/tengge1
 */
function PRWMLoader() {
    BaseLoader.call(this);
}

PRWMLoader.prototype = Object.create(BaseLoader.prototype);
PRWMLoader.prototype.constructor = PRWMLoader;

PRWMLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('PRWMLoader').then(() => {
            var loader = new THREE.PRWMLoader();

            loader.load(url, geometry => {
                var material = new THREE.MeshPhongMaterial();
                var mesh = new THREE.Mesh(geometry, material);
                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default PRWMLoader;
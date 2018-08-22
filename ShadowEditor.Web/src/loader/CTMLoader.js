import BaseLoader from './BaseLoader';

/**
 * CTMLoader
 * @param {*} app 
 */
function CTMLoader(app) {
    BaseLoader.call(this, app);
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
        });
    });
};

export default CTMLoader;
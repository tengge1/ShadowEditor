import BaseLoader from './BaseLoader';

/**
 * BinaryLoader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function BinaryLoader(app) {
    BaseLoader.call(this, app);
}

BinaryLoader.prototype = Object.create(BaseLoader.prototype);
BinaryLoader.prototype.constructor = BinaryLoader;

BinaryLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.BinaryLoader();

        loader.load(url, (geometry, materials) => {
            var mesh = new THREE.Mesh(geometry, materials);
            resolve(mesh);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default BinaryLoader;
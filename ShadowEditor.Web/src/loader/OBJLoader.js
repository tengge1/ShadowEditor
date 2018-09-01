import BaseLoader from './BaseLoader';

/**
 * OBJLoader
 * @author tengge / https://github.com/tengge1
 */
function OBJLoader() {
    BaseLoader.call(this);
}

OBJLoader.prototype = Object.create(BaseLoader.prototype);
OBJLoader.prototype.constructor = OBJLoader;

OBJLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.OBJLoader();

        loader.load(url, obj => {
            resolve(obj);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default OBJLoader;
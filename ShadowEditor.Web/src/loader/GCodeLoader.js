import BaseLoader from './BaseLoader';

/**
 * GCodeLoader
 * @author tengge / https://github.com/tengge1
 */
function GCodeLoader() {
    BaseLoader.call(this);
}

GCodeLoader.prototype = Object.create(BaseLoader.prototype);
GCodeLoader.prototype.constructor = GCodeLoader;

GCodeLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        var loader = new THREE.GCodeLoader();

        loader.load(url, obj3d => {
            resolve(obj3d);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default GCodeLoader;
import BaseLoader from './BaseLoader';

/**
 * AWDLoader
 * @author tengge / https://github.com/tengge1
 */
function AWDLoader() {
    BaseLoader.call(this);
}

AWDLoader.prototype = Object.create(BaseLoader.prototype);
AWDLoader.prototype.constructor = AWDLoader;

AWDLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.AWDLoader();

        loader.load(url, (obj3d) => {
            resolve(obj3d);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default AWDLoader;
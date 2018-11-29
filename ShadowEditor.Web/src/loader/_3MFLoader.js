import BaseLoader from './BaseLoader';

/**
 * 3MFLoader
 * @author tengge / https://github.com/tengge1
 */
function _3MFLoader() {
    BaseLoader.call(this);
}

_3MFLoader.prototype = Object.create(BaseLoader.prototype);
_3MFLoader.prototype.constructor = _3MFLoader;

_3MFLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.ThreeMFLoader();
        loader.load(url, object => {
            resolve(object);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default _3MFLoader;
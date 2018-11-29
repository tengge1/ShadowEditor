import BaseLoader from './BaseLoader';

/**
 * 3DSLoader
 * @author tengge / https://github.com/tengge1
 */
function _3DSLoader() {
    BaseLoader.call(this);
}

_3DSLoader.prototype = Object.create(BaseLoader.prototype);
_3DSLoader.prototype.constructor = _3DSLoader;

_3DSLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.TDSLoader();
        loader.load(url, group => {
            debugger
            resolve(group);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default _3DSLoader;
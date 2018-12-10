import BaseLoader from './BaseLoader';

/**
 * AMFLoader
 * @author tengge / https://github.com/tengge1
 */
function AMFLoader() {
    BaseLoader.call(this);
}

AMFLoader.prototype = Object.create(BaseLoader.prototype);
AMFLoader.prototype.constructor = AMFLoader;

AMFLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('AMFLoader').then(() => {
            var loader = new THREE.AMFLoader();
            loader.load(url, group => {
                resolve(group);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default AMFLoader;
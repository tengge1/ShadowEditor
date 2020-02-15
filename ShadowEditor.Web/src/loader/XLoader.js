import BaseLoader from './BaseLoader';

/**
 * XLoader
 * @author tengge / https://github.com/tengge1
 */
function XLoader() {
    BaseLoader.call(this);
}

XLoader.prototype = Object.create(BaseLoader.prototype);
XLoader.prototype.constructor = XLoader;

XLoader.prototype.load = function (url, options) { // eslint-disable-line
    return new Promise(resolve => {
        this.require('XLoader').then(() => {
            var loader = new THREE.XLoader();
            loader.load([url], object => {
                var obj = new THREE.Object3D();

                for (var i = 0; i < object.models.length; i++) {
                    var model = object.models[i];
                    obj.add(model);
                }

                resolve(obj);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default XLoader;
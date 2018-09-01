import BaseLoader from './BaseLoader';

/**
 * ColladaLoader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ColladaLoader(app) {
    BaseLoader.call(this, app);
}

ColladaLoader.prototype = Object.create(BaseLoader.prototype);
ColladaLoader.prototype.constructor = ColladaLoader;

ColladaLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.ColladaLoader();

        loader.load(url, collada => {
            var obj3d = collada.scene;
            resolve(obj3d);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default ColladaLoader;
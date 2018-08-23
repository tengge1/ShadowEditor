import BaseLoader from './BaseLoader';

/**
 * BabylonLoader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function BabylonLoader(app) {
    BaseLoader.call(this, app);
}

BabylonLoader.prototype = Object.create(BaseLoader.prototype);
BabylonLoader.prototype.constructor = BabylonLoader;

BabylonLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.BabylonLoader();

        loader.load(url, (scene) => {
            var obj3d = new THREE.Object3D();
            obj3d.children = scene.children;
            resolve(obj3d);
        });
    });
};

export default BabylonLoader;
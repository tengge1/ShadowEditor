import BaseLoader from './BaseLoader';

/**
 * BabylonLoader
 * @param {*} app 
 */
function BabylonLoader(app) {
    BaseLoader.call(this, app);
}

BabylonLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.BabylonLoader();

        loader.load(this.app.options.server + model.Url, (scene) => {
            var obj3d = new THREE.Object3D();
            obj3d.children = scene.children;
            resolve(obj3d);
        });
    });
};

export default BabylonLoader;
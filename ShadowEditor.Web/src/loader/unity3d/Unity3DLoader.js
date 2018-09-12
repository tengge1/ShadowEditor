import BaseLoader from '../BaseLoader';

/**
 * Unity3DLoader
 * @author tengge / https://github.com/tengge1
 */
function Unity3DLoader() {
    BaseLoader.call(this);
}

Unity3DLoader.prototype = Object.create(BaseLoader.prototype);
Unity3DLoader.prototype.constructor = Unity3DLoader;

Unity3DLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        // var loader = new THREE.ColladaLoader();

        // loader.load(url, collada => {
        //     var obj3d = collada.scene;
        //     resolve(obj3d);
        // }, undefined, () => {
        //     resolve(null);
        // });
    });
};

export default Unity3DLoader;
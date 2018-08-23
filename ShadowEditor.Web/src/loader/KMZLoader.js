import BaseLoader from './BaseLoader';

/**
 * KMZLoader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function KMZLoader(app) {
    BaseLoader.call(this, app);
}

KMZLoader.prototype = Object.create(BaseLoader.prototype);
KMZLoader.prototype.constructor = KMZLoader;

KMZLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.KMZLoader();

        loader.load(url, collada => {
            var obj3d = collada.scene;
            resolve(obj3d);
        });
    });
};

export default KMZLoader;
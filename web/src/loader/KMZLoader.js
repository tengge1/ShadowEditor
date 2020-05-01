import BaseLoader from './BaseLoader';

/**
 * KMZLoader
 * @author tengge / https://github.com/tengge1
 */
function KMZLoader() {
    BaseLoader.call(this);
}

KMZLoader.prototype = Object.create(BaseLoader.prototype);
KMZLoader.prototype.constructor = KMZLoader;

KMZLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require([
            'ColladaLoader',
            'KMZLoader'
        ]).then(() => {
            var loader = new THREE.KMZLoader();

            loader.load(url, collada => {
                var obj3d = collada.scene;
                resolve(obj3d);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default KMZLoader;
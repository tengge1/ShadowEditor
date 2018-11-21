import BaseLoader from './BaseLoader';

/**
 * GLTFLoader
 * @author tengge / https://github.com/tengge1
 */
function GLTFLoader() {
    BaseLoader.call(this);
}

GLTFLoader.prototype = Object.create(BaseLoader.prototype);
GLTFLoader.prototype.constructor = GLTFLoader;

GLTFLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.GLTFLoader();

        THREE.DRACOLoader.setDecoderPath('assets/js/loaders/draco/gltf/');
        loader.setDRACOLoader(new THREE.DRACOLoader());

        loader.load(url, result => {
            var obj3d = result.scene;
            resolve(obj3d);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default GLTFLoader;
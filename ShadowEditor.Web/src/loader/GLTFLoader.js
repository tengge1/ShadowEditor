import BaseLoader from './BaseLoader';

/**
 * GLTFLoader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function GLTFLoader(app) {
    BaseLoader.call(this, app);
}

GLTFLoader.prototype = Object.create(BaseLoader.prototype);
GLTFLoader.prototype.constructor = GLTFLoader;

GLTFLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.GLTFLoader();

        loader.load(url, result => {
            var obj3d = result.scene;
            resolve(obj3d);
        });
    });
};

export default GLTFLoader;
import BaseLoader from './BaseLoader';

/**
 * FBXLoader
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function FBXLoader(app) {
    BaseLoader.call(this, app);
}

FBXLoader.prototype = Object.create(BaseLoader.prototype);
FBXLoader.prototype.constructor = FBXLoader;

FBXLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.FBXLoader();

        loader.load(url, obj3d => {
            resolve(obj3d);
        });
    });
};

export default FBXLoader;
import BaseLoader from './BaseLoader';

/**
 * FBXLoader
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
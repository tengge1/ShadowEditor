import BaseLoader from './BaseLoader';

/**
 * ColladaLoader
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
        });
    });
};

export default ColladaLoader;
import BaseLoader from './BaseLoader';

/**
 * Binary模型下载器
 * @param {*} app 
 */
function BinaryLoader(app) {
    BaseLoader.call(this, app);
}

BinaryLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.BinaryLoader();

        loader.load(this.app.options.server + model.Url, (geometry, materials) => {
            var mesh = new THREE.Mesh(geometry, materials);
            resolve(mesh);
        });
    });
};

export default BinaryLoader;
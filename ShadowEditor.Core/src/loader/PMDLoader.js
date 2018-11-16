import BaseLoader from './BaseLoader';

/**
 * PMDLoader
 * @author tengge / https://github.com/tengge1
 */
function PMDLoader() {
    BaseLoader.call(this);
}

PMDLoader.prototype = Object.create(BaseLoader.prototype);
PMDLoader.prototype.constructor = PMDLoader;

PMDLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        var loader = new THREE.MMDLoader();

        loader.loadModel(url, mesh => {
            mesh.name = options.Name;
            if (options.Animation) {
                this.loadAnimation(mesh, options.Animation).then(() => {
                    resolve(mesh);
                });
            } else {
                resolve(mesh);
            }
        }, undefined, () => {
            // 某个图片下载失败会导致返回null
            // resolve(null);
        });
    });
};

PMDLoader.prototype.loadAnimation = function (mesh, animation) {
    return new Promise(resolve => {
        var loader = new THREE.MMDLoader();
        loader.loadVmd(animation.Url, vmd => {
            loader.pourVmdIntoModel(mesh, vmd);
            resolve(mesh);
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default PMDLoader;
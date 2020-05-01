import PackageManager from '../package/PackageManager';

var ID = -1;

/**
 * BaseLoader
 * @author tengge / https://github.com/tengge1
 */
function BaseLoader() {
    this.id = `BaseLoader${ID--}`;

    this.packageManager = new PackageManager();
    this.require = this.packageManager.require.bind(this.packageManager);
}

BaseLoader.prototype.load = function (url, options) { // eslint-disable-line
    return new Promise(resolve => {
        resolve(null);
    });
};

export default BaseLoader;
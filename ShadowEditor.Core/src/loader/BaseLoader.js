var ID = -1;

/**
 * BaseLoader
 * @author tengge / https://github.com/tengge1
 */
function BaseLoader() {
    this.id = `BaseLoader${ID--}`;
}

BaseLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        resolve(null);
    });
};

export default BaseLoader;
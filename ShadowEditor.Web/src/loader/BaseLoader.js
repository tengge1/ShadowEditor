var ID = -1;

/**
 * 模型加载器基类
 * @param {*} app 
 */
function BaseLoader(app) {
    this.app = app;
    this.id = `BaseLoader${ID--}`;
}

BaseLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        resolve(null);
    });
};

export default BaseLoader;
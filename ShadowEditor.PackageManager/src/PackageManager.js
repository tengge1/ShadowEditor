/**
 * 包管理器
 * @author tengge / https://github.com/tengge1
 * @param {*} path 资源目录
 */
function PackageManager(path = 'packages') {
    this._path = path;
    this._packages = {};
};

/**
 * 获取资源目录
 */
PackageManager.prototype.getPath = function () {
    return this._path;
};

/**
 * 设置资源目录
 * @param {*} path 资源目录
 */
PackageManager.prototype.setPath = function (path) {
    this._path = path;
};

/**
 * 添加一个包
 * @param {*} name 包名
 * @param {*} assets 资源列表，例如[url1, url2, url3, ...]
 */
PackageManager.prototype.add = function (name, assets = []) {
    if (this._packages[name] !== undefined) {
        console.warn(`PackageManager: 包${name}已添加。`);
        return;
    }

    this._packages[name] = {
        name: name,
        assets: assets,
        loaded: false,
    };
};

/**
 * 移除一个包
 * @param {*} name 包名
 */
PackageManager.prototype.remove = function (name) {
    if (this._packages[name] !== undefined) {
        console.warn(`PackageManager: 包${name}不存在。`);
        return;
    }

    delete this._packages[name];
};

/**
 * 获取一个包
 * @param {*} name 包名
 */
PackageManager.prototype.get = function (name) {
    if (this._packages[name] !== undefined) {
        console.warn(`PackageManager: 包${name}不存在。`);
        return null;
    }

    return this._packages[name];
};

/**
 * 加载一个包
 * @param {*} name 
 * @param {*} scope 
 */
PackageManager.prototype.load = function (name, scope = "global") {

};

/**
 * 从文件中加载包
 * @param {*} path 文件路径
 */
PackageManager.prototype.loadFromFile = function (path) {

};

export default PackageManager;
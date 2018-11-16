import CssLoader from './loaders/CssLoader';
import JsLoader from './loaders/JsLoader';

/**
 * 包管理器
 * @author tengge / https://github.com/tengge1
 * @param {*} path 资源目录
 */
function Manager(path = 'packages') {
    this._path = path;
    this._packages = {};
    this._cssExtension = ['.css'];
    this._jsExtension = ['.js'];
};

/**
 * 获取资源目录
 */
Manager.prototype.getPath = function () {
    return this._path;
};

/**
 * 设置资源目录
 * @param {*} path 资源目录
 */
Manager.prototype.setPath = function (path) {
    this._path = path;
};

/**
 * 添加一个包
 * @param {*} name 包名
 * @param {*} assets 资源列表，例如[url1, url2, url3, ...]
 */
Manager.prototype.add = function (name, assets = []) {
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
 * 从文件批量添加包
 * @param {*} path 文件路径
 */
Manager.prototype.addFromFile = function (path) {
    return new Promise(resolve => {
        fetch(path).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    json.packages.forEach(n => {
                        this.add(n.name, n.assets);
                    });
                    resolve(this._packages);
                });
            } else {
                console.warn(`PackageManager: 获取${path}失败！`);
                resolve(null);
            }
        });
    });
};

/**
 * 移除一个包
 * @param {*} name 包名
 */
Manager.prototype.remove = function (name) {
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
Manager.prototype.get = function (name) {
    if (this._packages[name] === undefined) {
        console.warn(`PackageManager: 包${name}不存在。`);
        return null;
    }

    return this._packages[name];
};

/**
 * 加载一个包
 * @param {*} names 包名或包名列表
 */
Manager.prototype.load = function (names) {
    var assets = [];

    if (Array.isArray(names)) {
        names.forEach(n => {
            var pkg = this.get(n);
            if (pkg && !pkg.loaded) {
                pkg.loaded = true;
                pkg.assets.forEach(m => {
                    assets.push(m);
                });
            }
        });
    } else {
        var pkg = this.get(names);
        if (pkg && !pkg.loaded) {
            pkg.loaded = true;
            pkg.assets.forEach(m => {
                assets.push(m);
            });
        }
    }

    if (assets.length === 0) {
        return new Promise(resolve => {
            resolve();
        });
    }

    return this.require(assets);
};

/**
 * 加载所有包
 */
Manager.prototype.loadAll = function () {
    var assets = [];

    Object.values(this._packages).forEach(n => {
        if (n && !n.loaded) {
            n.loaded = true;
            n.assets.forEach(m => {
                assets.push(m);
            });
        }
    });

    if (assets.length === 0) {
        return new Promise(resolve => {
            resolve();
        });
    }

    return this.require(assets);
};

/**
 * 加载资源
 * @param {*} assets 资源列表
 */
Manager.prototype.require = function (assets = []) {
    var cssExtension = this._cssExtension;
    var jsExtension = this._jsExtension;

    var cssLoader = new CssLoader();
    var jsLoader = new JsLoader();

    if (!Array.isArray(assets)) {
        assets = [assets];
    }

    return Promise.all(assets.map(n => {
        var path = this._path.endsWith('/') ? this._path : (this._path + '/');

        var isCss = cssExtension.some(m => {
            return n.endsWith(m);
        });

        if (isCss) {
            return cssLoader.load(path + n);
        }

        var isJs = jsExtension.some(m => {
            return n.endsWith(m);
        });

        if (isJs) {
            return jsLoader.load(path + n);
        }

        return new Promise(resolve => {
            console.warn(`PackageManager: 未知资源类型${n}。`);
            resolve(null);
        });
    }));
};

export default Manager;
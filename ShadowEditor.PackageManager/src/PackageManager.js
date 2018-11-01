import CssLoader from './loaders/CssLoader';
import JsLoader from './loaders/JsLoader';

/**
 * 包管理器
 * @author tengge / https://github.com/tengge1
 * @param {*} path 资源目录
 */
function PackageManager(path = 'packages') {
    this._path = path;
    this._packages = {};
    this._cssExtension = ['.css'];
    this._jsExtension = ['.js'];
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
 * 从文件批量添加包
 * @param {*} path 文件路径
 */
PackageManager.prototype.addFromFile = function (path) {
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
    if (this._packages[name] === undefined) {
        console.warn(`PackageManager: 包${name}不存在。`);
        return null;
    }

    return this._packages[name];
};

/**
 * 加载一个包
 * @param {*} name 
 */
PackageManager.prototype.load = function (name) {
    var pkg = this.get(name);
    if (!pkg) {
        return;
    }

    var cssExtension = this._cssExtension;
    var jsExtension = this._jsExtension;

    var cssLoader = new CssLoader();
    var jsLoader = new JsLoader();

    return Promise.all(pkg.assets.map(n => {
        var isCss = cssExtension.some(m => {
            return n.endsWith(m);
        });

        if (isCss) {
            return cssLoader.load(this._path + n);
        }

        var isJs = jsExtension.some(m => {
            return n.endsWith(m);
        });

        if (isJs) {
            return jsLoader.load(this._path + n);
        }

        return new Promise(resolve => {
            console.warn(`PackageManager: 未知资源类型${n}。`);
            resolve(null);
        });
    }));
};

export default PackageManager;
import PackageList from './PackageList';
import CssLoader from '../utils/CssLoader';
import JsLoader from '../utils/JsLoader';

const loaded = new Map();

/**
 * 包管理器
 * @author tengge / https://github.com/tengge1
 */
function PackageManager() {

};

/**
 * 加载包
 * @param {*} names 包名或包名列表
 */
PackageManager.prototype.require = function (names) {
    names = Array.isArray(names) ? names : [names];

    // 获取前面请求正在下载的promise
    var promises = [];

    for (var i = 0; i < names.length; i++) {
        var name = names[i];

        if (loaded.has(name) && loaded.get(name).loading === true) {
            promises.push(loaded.get(name).promise);
        }
    }

    return Promise.all(promises).then(() => {
        // 下载本次请求所需资源
        var promises1 = [];

        for (var i = 0; i < names.length; i++) {
            var name = names[i];

            if (loaded.has(name) && loaded.get(name).loaded === true) {
                continue;
            }

            if (loaded.has(name) && loaded.get(name).loading === true) {
                throw 'PackageManager: 前面请求正在下载的promise未全部执行完成！';
            }

            // 获取所有包资源
            var packages = PackageList.filter(n => n.name === name);
            if (packages.length === 0) {
                console.warn(`PackageManager: 包${name}不存在！`);
                continue;
            } else if (packages.length > 1) {
                console.warn(`PackageManager: 包名${name}重复！`);
            }

            var assets = [];

            packages.forEach(n => {
                assets.push.apply(assets, n.assets);
            });

            var promise = this._load(assets).then(() => {
                loaded.set(name, {
                    loading: false,
                    loaded: true,
                    promise: null
                });
                return new Promise(resolve => {
                    resolve();
                });
            });

            loaded.set(name, {
                loading: true,
                loaded: false,
                promise: promise,
            });

            promises1.push(promise);
        }

        return Promise.all(promises1);
    });
};

PackageManager.prototype._load = function (assets = []) {
    var cssLoader = new CssLoader();
    var jsLoader = new JsLoader();

    var promises = assets.map(n => {
        if (n.toLowerCase().endsWith('.css')) {
            return cssLoader.load(n);
        } else if (n.toLowerCase().endsWith('.js')) {
            return jsLoader.load(n);
        } else {
            console.warn(`PackageManager: 未知资源类型${n}。`);
            return new Promise(resolve => {
                resolve();
            });
        }
    });

    return Promise.all(promises).then(() => {
        jsLoader.eval();
        return new Promise(resolve => {
            resolve();
        });
    });
};

export default PackageManager;
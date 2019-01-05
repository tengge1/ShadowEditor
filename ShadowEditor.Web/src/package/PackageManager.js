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

    var promises = [];

    names.forEach(n => {
        if (loaded.has(n) && loaded.get(n).loading === true) {
            promises.push(loaded.get(n).promise);
        } else if (!loaded.has(n)) {
            var promise = Promise.all(promises).then(() => {
                var packages = PackageList.filter(m => m.name === n);
                if (packages.length === 0) {
                    console.warn(`PackageManager: 包${n}不存在！`);
                    return;
                } else if (packages.length > 1) {
                    console.warn(`PackageManager: 包名${n}重复！`);
                }

                var assets = [];

                packages.forEach(m => {
                    assets.push.apply(assets, m.assets);
                });

                return this._load(assets).then(() => {
                    loaded.set(n, {
                        loading: false,
                        loaded: true,
                        promise: null,
                    });
                    return new Promise(resolve => {
                        resolve();
                    });
                });
            });
            loaded.set(n, {
                loading: true,
                loaded: false,
                promise: promise,
            });
            promises.push(promise);
        }
    });

    return Promise.all(promises);
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
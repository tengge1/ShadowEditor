/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import PackageList from './PackageList';
import CssLoader from '../utils/CssLoader';
import JsLoader from '../utils/JsLoader';

const loaded = new Map();

/**
 * 包管理器
 * @author tengge / https://github.com/tengge1
 */
function PackageManager() {

}

/**
 * 加载包
 * @param {Object} names 包名或包名列表
 * @returns {Promise} Promise
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
                    console.warn(`PackageManager: ${n} does not exist.`);
                    return;
                } else if (packages.length > 1) {
                    console.warn(`PackageManager: Package name ${n} duplicated.`);
                }

                var assets = [];

                packages.forEach(m => {
                    assets.push.apply(assets, m.assets);
                });

                return this._load(assets).then(() => {
                    loaded.set(n, {
                        loading: false,
                        loaded: true,
                        promise: null
                    });
                    return new Promise(resolve => {
                        resolve();
                    });
                });
            });
            loaded.set(n, {
                loading: true,
                loaded: false,
                promise: promise
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
            console.warn(`PackageManager: unknown assets ${n}.`);
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
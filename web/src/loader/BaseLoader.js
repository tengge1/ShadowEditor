/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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
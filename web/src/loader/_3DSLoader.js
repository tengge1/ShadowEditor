/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseLoader from './BaseLoader';

/**
 * 3DSLoader
 * @author tengge / https://github.com/tengge1
 */
class _3DSLoader extends BaseLoader {
    constructor() {
        super();
    }

    load(url) {
        return new Promise(resolve => {
            this.require('TDSLoader').then(() => {
                var loader = new THREE.TDSLoader();
                loader.load(url, group => {
                    resolve(group);
                }, undefined, () => {
                    resolve(null);
                });
            });
        });
    }
}

export default _3DSLoader;
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
 * 3MFLoader
 * @author tengge / https://github.com/tengge1
 */
class _3MFLoader extends BaseLoader {
    constructor() {
        super();
    }

    load(url) {
        return new Promise(resolve => {
            this.require('3MFLoader').then(() => {
                var loader = new THREE.ThreeMFLoader();
                loader.load(url, object => {
                    resolve(object);
                }, undefined, () => {
                    resolve(null);
                });
            });
        });
    }
}

export default _3MFLoader;
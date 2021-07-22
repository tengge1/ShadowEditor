/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 物体基类
 * @constructor
 * @description 物体不需要继承该类，该类仅仅用来说明物体上的通用方法。
 */
class BaseObject extends THREE.Object3D {
    /**
     * 创建类前调用，用于下载创建物体所需的类
     * @returns {Promise} 下载Promise
     */
    load() {
        return new Promise(resolve => {
            resolve();
        });
    }
}

export default BaseObject;
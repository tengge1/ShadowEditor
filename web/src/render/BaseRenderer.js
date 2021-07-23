/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
var ID = -1;

/**
 * 基本渲染器
 * @author tengge / https://github.com/tengge1
 */
class BaseRenderer {
    constructor() {
        this.id = `${this.constructor.name}${ID--}`;
    }

    create(scenes, camera, renderer, selected) {
        return new Promise(resolve => {
            resolve();
        });
    }

    render() {

    }

    dispose() {

    }
}

export default BaseRenderer;
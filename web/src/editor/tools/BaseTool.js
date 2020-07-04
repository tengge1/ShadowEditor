/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { dispatch } from '../../third_party';

var ID = -1;

/**
 * 工具基类
 * @author tengge / https://github.com/tengge1
 */
class BaseTool {
    constructor() {
        this.id = `EditorTool${ID--}`;
        this.dispatch = dispatch('end');
        this.call = this.dispatch.call.bind(this.dispatch);
        this.on = this.dispatch.on.bind(this.dispatch);
    }

    start() {

    }

    stop() {

    }

    clear() {

    }
}

export default BaseTool;
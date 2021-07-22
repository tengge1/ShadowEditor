/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseEvent from './BaseEvent';
import CssUtils from '../utils/CssUtils';
import global from '../global';

/**
 * 滤镜事件
 * @author tengge / https://github.com/tengge1
 */
class FilterEvent extends BaseEvent {
    constructor() {
        super();
    }

    start() {
        global.app.on(`editorCleared.${this.id}`, this.onEditorCleared.bind(this));
        global.app.on(`optionsChanged.${this.id}`, this.onOptionsChanged.bind(this));
    }

    stop() {
        global.app.on(`editorCleared.${this.id}`, null);
        global.app.on(`optionsChanged.${this.id}`, null);
    }

    onEditorCleared() {
        global.app.editor.renderer.domElement.style.filter = '';
    }

    onOptionsChanged() {
        global.app.editor.renderer.domElement.style.filter = CssUtils.serializeFilter(global.app.options);
    }
}

export default FilterEvent;
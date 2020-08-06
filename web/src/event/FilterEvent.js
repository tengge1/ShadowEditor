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
function FilterEvent() {
    BaseEvent.call(this);
}

FilterEvent.prototype = Object.create(BaseEvent.prototype);
FilterEvent.prototype.constructor = FilterEvent;

FilterEvent.prototype.start = function () {
    global.app.on(`editorCleared.${this.id}`, this.onEditorCleared.bind(this));
    global.app.on(`optionsChanged.${this.id}`, this.onOptionsChanged.bind(this));
};

FilterEvent.prototype.stop = function () {
    global.app.on(`editorCleared.${this.id}`, null);
    global.app.on(`optionsChanged.${this.id}`, null);
};

FilterEvent.prototype.onEditorCleared = function () {
    global.app.editor.renderer.domElement.style.filter = '';
};

FilterEvent.prototype.onOptionsChanged = function () {
    global.app.editor.renderer.domElement.style.filter = CssUtils.serializeFilter(global.app.options);
};

export default FilterEvent;
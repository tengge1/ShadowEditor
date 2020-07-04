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
 * 事件基类
 * @author tengge / https://github.com/tengge1
 */
function BaseEvent() {
    this.id = `${this.constructor.name}${ID--}`;
}

BaseEvent.prototype.start = function () {

};

BaseEvent.prototype.stop = function () {

};

export default BaseEvent;
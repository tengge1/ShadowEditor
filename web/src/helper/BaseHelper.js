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
 * 帮助器基类
 * @author tengge / https://github.com/tengge1
 */
function BaseHelper() {
    this.id = `${this.constructor.name}${ID--}`;
}

/**
 * 帮助器开始运行
 * @description 因为start是在`appStarted`事件中运行的，所以无法监听到`appStart`和`appStarted`事件
 */
BaseHelper.prototype.start = function () {

};

/**
 * 帮助器结束运行
 */
BaseHelper.prototype.stop = function () {

};

export default BaseHelper;
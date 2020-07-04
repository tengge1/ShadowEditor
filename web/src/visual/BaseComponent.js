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
 * 所有可视化组件基类
 * @author tengge / https://github.com/tengge1
 */
function BaseComponent() {
    this.id = `VisualComponent${ID--}`;
    this.type = 'VisualComponent'; // 根据此字段判断类型，进行反序列化
}

/**
 * 实现该函数，可以在编辑器中拖动该控件。
 * 原型:setTranslate(dx, dy)
 */
BaseComponent.prototype.setTranslate = null;

/**
 * 渲染组件
 * @param {SVGElement} parent 父组件
 */
BaseComponent.prototype.render = function (parent) { // eslint-disable-line

};

/**
 * 组件转json
 */
BaseComponent.prototype.toJSON = function () {

};

/**
 * json转组件
 * @param {Object} json JSON字符串反序列化后的对象
 */
BaseComponent.prototype.fromJSON = function (json) { // eslint-disable-line

};

/**
 * 清空组件
 */
BaseComponent.prototype.clear = function () {

};

export default BaseComponent;
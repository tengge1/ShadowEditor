var ID = -1;

/**
 * 所有可视化组件基类
 * @author tengge / https://github.com/tengge1
 */
function BaseComponent() {
    this.id = `${this.constructor.name}${ID--}`;
    this.type = this.constructor.name; // 根据此字段判断类型，进行反序列化
}

/**
 * 渲染组件
 * @param {SVGElement} parent 父组件
 */
BaseComponent.prototype.render = function (parent) {

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
BaseComponent.prototype.fromJSON = function (json) {

};

/**
 * 销毁组件
 */
BaseComponent.prototype.dispose = function () {

};

export default BaseComponent;
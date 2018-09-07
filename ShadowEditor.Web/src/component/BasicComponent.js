import BaseComponent from './BaseComponent';

/**
 * 基本信息组件
 * @param {*} options 
 */
function BasicComponent(options) {
    BaseComponent.call(this, options);
}

BasicComponent.prototype = Object.create(BaseComponent.prototype);
BasicComponent.prototype.constructor = BasicComponent;

BasicComponent.prototype.render = function () {

};

export default BasicComponent;
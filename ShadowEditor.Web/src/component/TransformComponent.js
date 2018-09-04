import BaseComponent from './BaseComponent';

/**
 * 位移组件
 * @param {*} options 
 */
function TransformComponent(options) {
    BaseComponent.call(this, options);
}

TransformComponent.prototype = Object.create(BaseComponent.prototype);
TransformComponent.prototype.constructor = TransformComponent;

TransformComponent.prototype.render = function () {

};

export default TransformComponent;
import UI from '../ui/UI';

/**
 * 所有组件基类
 * @param {*} options 
 */
function BaseComponent(options) {
    UI.Control.call(this, options);
    this.app = options.app
}

BaseComponent.prototype = Object.create(UI.Control.prototype);
BaseComponent.prototype.constructor = BaseComponent;

BaseComponent.prototype.render = function () {

};

export default BaseComponent;
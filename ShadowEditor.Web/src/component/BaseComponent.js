import UI from '../ui/UI';

/**
 * 所有组件基类
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function BaseComponent(options) {
    UI.Control.call(this, options);
    app = options.app
}

BaseComponent.prototype = Object.create(UI.Control.prototype);
BaseComponent.prototype.constructor = BaseComponent;

BaseComponent.prototype.render = function () {

};

export default BaseComponent;
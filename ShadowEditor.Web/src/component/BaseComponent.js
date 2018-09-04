import UI from '../ui/UI';

var ID = -1;

/**
 * 所有组件基类
 * @param {*} options 
 */
function BaseComponent(options) {
    UI.Control.call(this, options);
    this.id = `BaseComponent${ID--}`;
}

BaseComponent.prototype = Object.create(UI.Control.prototype);
BaseComponent.prototype.constructor = BaseComponent;

BaseComponent.prototype.render = function () {

};

export default BaseComponent;
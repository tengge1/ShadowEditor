import Control from './Control';

/**
 * 带有子要素的控件
 * @param {*} options 
 */
function Element(options) {
    Control.call(this, options);
    this.children = options.children || [];
}

Element.prototype = Object.create(Control.prototype);
Element.prototype.constructor = Element;

Element.prototype.render = function () {

};

export default Element;
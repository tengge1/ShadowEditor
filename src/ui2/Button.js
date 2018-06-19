import Control from './Control';

/**
 * 按钮
 * @param {*} options 
 */
function Button(options) {
    Control.call(this, options);
    options = options || {};
    this.text = options.text || 'Button';
};

Button.prototype = Object.create(Control.prototype);
Button.prototype.constructor = Button;

Button.prototype.render = function () {
    this.dom = document.createElement('button');
    this.dom.className = 'Button';
    this.dom.textContent = this.text;
    this.parent.appendChild(this.dom);
};

Button.prototype.setLabel = function (value) {
    this.dom.textContent = value;
    return this;
};

export default Button;
import Control from './Control';
import XType from './XType';

/**
 * 按钮
 * @param {*} options 
 */
function Button(options) {
    Control.call(this, options);
    options = options || {};

    this.id = options.id || null;
    this.text = options.text || 'Button';
    this.cls = options.cls || 'Button';
    this.style = options.style || null;
    this.title = options.title || null;

    this.onClick = options.onClick || null;
};

Button.prototype = Object.create(Control.prototype);
Button.prototype.constructor = Button;

Button.prototype.render = function () {
    this.dom = document.createElement('button');

    if (this.id) {
        this.dom.id = this.id;
    }

    this.dom.innerHTML = this.text;

    this.dom.className = this.cls;

    if (this.style) {
        this.dom.style = this.style;
    }

    if (this.title) {
        this.dom.title = this.title;
    }

    this.parent.appendChild(this.dom);

    if (this.onClick) {
        this.dom.addEventListener('click', this.onClick.bind(this), false);
    }
};

XType.add('button', Button);

export default Button;
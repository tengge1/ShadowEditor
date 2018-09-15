import Control from './Control';

/**
 * 按钮
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Button(options) {
    Control.call(this, options);
    options = options || {};

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

    this.dom.innerHTML = this.text;

    this.dom.className = this.cls;

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    if (this.title) {
        this.dom.title = this.title;
    }

    this.parent.appendChild(this.dom);

    if (this.onClick) {
        this.dom.addEventListener('click', this.onClick.bind(this), false);
    }
};

Button.prototype.setText = function (text) {
    this.text = text;
    this.dom.innerHTML = this.text;
};

Button.prototype.select = function () {
    this.dom.classList.add('selected');
};

Button.prototype.unselect = function () {
    this.dom.classList.remove('selected');
};

export default Button;
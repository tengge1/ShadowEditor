import Control from './Control';

/**
 * 输入框
 * @param {*} options 
 */
function Input(options) {
    Control.call(this, options);
    options = options || {};

    this.value = options.value || '';
    this.cls = options.cls || 'Input';
    this.style = options.style || null;
    this.disabled = options.disabled || false;

    this.onChange = options.onChange || null;
};

Input.prototype = Object.create(Control.prototype);
Input.prototype.constructor = Input;

Input.prototype.render = function () {
    this.dom = document.createElement('input');

    this.dom.className = this.cls;

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    if (this.disabled) {
        this.dom.disabled = 'disabled';
    }

    this.dom.addEventListener('keydown', function (event) {
        event.stopPropagation();
    }, false);

    this.parent.appendChild(this.dom);

    if (this.onChange) {
        this.dom.addEventListener('change', this.onChange.bind(this));
    }

    this.setValue(this.value);
};

Input.prototype.getValue = function () {
    return this.dom.value;
};

Input.prototype.setValue = function (value) {
    this.dom.value = value;
    return this;
};

export default Input;
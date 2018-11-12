import { Control, UI } from '../third_party';

/**
 * 输入框
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Input(options) {
    Control.call(this, options);
    options = options || {};

    this.value = options.value || '';
    this.cls = options.cls || 'Input';
    this.style = options.style || null;
    this.disabled = options.disabled || false;
    this.placeholder = options.placeholder || null;

    this.onChange = options.onChange || null;
    this.onInput = options.onInput || null;
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

    if (this.placeholder) {
        this.dom.placeholder = this.placeholder;
    }

    this.dom.addEventListener('keydown', function (event) {
        event.stopPropagation();
    }, false);

    this.parent.appendChild(this.dom);

    if (this.onChange) {
        this.dom.addEventListener('change', this.onChange.bind(this));
    }

    if (this.onInput) {
        this.dom.addEventListener('input', this.onInput.bind(this));
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
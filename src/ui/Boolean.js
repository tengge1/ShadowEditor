import Control from './Control';

/**
 * 布尔值
 * @param {*} options 
 */
function Boolean(options) {
    Control.call(this, options);
    options = options || {};

    this.id = options.id || null;
    this.text = options.text || 'Boolean';
    this.value = options.value || false;
    this.cls = options.cls || 'Checkbox';
    this.style = options.style || null;

    this.onChange = options.onChange || null;
};

Boolean.prototype = Object.create(Control.prototype);
Boolean.prototype.constructor = Boolean;

Boolean.prototype.render = function () {
    this.dom = document.createElement('span');

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        this.dom.style = this.style;
    }

    this.parent.appendChild(this.dom);

    this.input = document.createElement('input');
    this.input.type = 'checkbox';
    this.dom.appendChild(this.input);

    this.span = document.createElement('span');
    this.span.innerHTML = this.text;
    this.dom.appendChild(this.span);

    this.setValue(this.value);

    if (this.onChange) {
        this.input.addEventListener('change', this.onChange.bind(this), false);
    }
};

Boolean.prototype.getValue = function () {
    return this.input.checked;
};

Boolean.prototype.setValue = function (value) {
    this.input.checked = value;
};

export default Boolean;
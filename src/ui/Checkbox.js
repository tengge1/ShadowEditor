import Control from './Control';

/**
 * 复选框
 * @param {*} options 
 */
function Checkbox(options) {
    Control.call(this, options);
    options = options || {};
    this.value = options.value || false;
    this.cls = options.cls || null;
    this.style = options.style || null;
    this.onChange = options.onChange || null;
};

Checkbox.prototype = Object.create(Control.prototype);
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.render = function () {
    this.dom = document.createElement('input');

    this.dom.type = 'checkbox';

    if (this.cls) {
        this.dom.className = this.cls;
    } else {
        this.dom.className = 'Checkbox';
    }

    if (this.style) {
        this.dom.style = this.style;
    }

    this.parent.appendChild(this.dom);

    if (this.onChange) {
        this.dom.addEventListener('change', this.onChange.bind(this));
    }

    this.setValue(this.value);
};

Checkbox.prototype.getValue = function () {
    return this.dom.checked;
};

Checkbox.prototype.setValue = function (value) {

    if (value !== undefined) {
        this.dom.checked = value;
    }

    return this;
};

export default Checkbox;
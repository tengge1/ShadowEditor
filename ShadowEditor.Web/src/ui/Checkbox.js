import Control from './Control';
import UI from './Manager';

/**
 * 复选框
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Checkbox(options) {
    Control.call(this, options);
    options = options || {};

    this.value = options.value || false;
    this.cls = options.cls || 'Checkbox';
    this.style = options.style || null;

    this.onChange = options.onChange || null;
};

Checkbox.prototype = Object.create(Control.prototype);
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.render = function () {
    this.dom = document.createElement('input');

    this.dom.type = 'checkbox';

    this.dom.className = this.cls;

    if (this.style) {
        Object.assign(this.dom.style, this.style);
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

UI.addXType('checkbox', Checkbox);

export default Checkbox;
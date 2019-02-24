import Control from './Control';
import UI from './Manager';

/**
 * 选择列表
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Select(options) {
    Control.call(this, options);
    options = options || {};

    this.options = options.options || [];
    this.value = options.value || '';
    this.cls = options.cls || 'Select';
    this.style = options.style || null;
    this.multiple = options.multiple || false;
    this.disabled = options.disabled || false;

    this.onChange = options.onChange || null;
};

Select.prototype = Object.create(Control.prototype);
Select.prototype.constructor = Select;

Select.prototype.render = function () {
    this.dom = document.createElement('select');

    this.dom.className = this.cls;

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    if (this.multiple) {
        this.dom.multiple = this.multiple;
    }

    if (this.disabled) {
        this.dom.disabled = 'disabled';
    }

    var _this = this;

    if (this.options) {
        Object.keys(this.options).forEach(n => {
            var option = document.createElement('option');
            option.value = n;
            option.innerHTML = this.options[n];

            if (this.value === n) {
                option.selected = 'selected';
            }

            this.dom.appendChild(option);
        });
    }

    if (this.onChange) {
        this.dom.addEventListener('change', this.onChange.bind(this));
    }

    this.parent.appendChild(this.dom);
};

Select.prototype.setMultiple = function (boolean) {
    this.dom.multiple = boolean;
    return this;
};

Select.prototype.setOptions = function (options) {
    var selected = this.dom.value;
    while (this.dom.children.length > 0) {
        this.dom.removeChild(this.dom.firstChild);
    }

    for (var key in options) {
        var option = document.createElement('option');
        option.value = key;
        option.innerHTML = options[key];
        this.dom.appendChild(option);
    }

    this.dom.value = selected;

    return this;

};

Select.prototype.getValue = function () {
    return this.dom.value;
};

Select.prototype.setValue = function (value) {
    value = String(value);

    if (this.dom.value !== value) {
        this.dom.value = value;
    }

    return this;
};

UI.addXType('select', Select);

export default Select;
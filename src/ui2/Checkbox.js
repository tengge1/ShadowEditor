import Control from './Control';

/**
 * 复选框
 * @param {*} options 
 */
function Checkbox(options) {
    Control.call(this, options);

    options = options || {};
    this.value = options.value || false;
};

Checkbox.prototype = Object.create(Control.prototype);
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.render = function () {
    this.dom = document.createElement('input');
    this.dom.className = 'Checkbox';
    this.dom.type = 'checkbox';

    this.parent.appendChild(this.dom);

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
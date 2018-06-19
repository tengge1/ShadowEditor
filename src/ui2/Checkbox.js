import Control from './Control';

/**
 * 复选框
 * @param {*} options 
 */
function Checkbox(options) {
    Control.call(this, options);
};

Checkbox.prototype = Object.create(Control.prototype);
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.render = function () {
    this.dom = document.createElement('input');
    this.dom.className = 'Checkbox';
    this.dom.type = 'checkbox';
    this.parent.appendChild(this.dom);
};

export default Checkbox;
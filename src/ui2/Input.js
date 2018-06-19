import Control from './Control';

/**
 * 输入框
 * @param {*} options 
 */
function Input(options) {
    Control.call(this, options);
};

Input.prototype = Object.create(Control.prototype);
Input.prototype.constructor = Input;

Input.prototype.render = function () {
    this.dom = document.createElement('input');
    this.dom.className = 'Input';
    this.dom.style.padding = '2px';
    this.dom.style.border = '1px solid transparent';

    this.dom.addEventListener('keydown', function (event) {
        event.stopPropagation();
    }, false);

    this.parent.appendChild(this.dom);
};

export default Input;
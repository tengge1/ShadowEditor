import { Control, UI } from '../third_party';

/**
 * Input
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Input(options = {}) {
    Control.call(this, options);
}

Input.prototype = Object.create(Control.prototype);
Input.prototype.constructor = Input;

Input.prototype.render = function () {
    this.renderDom(this.createElement('input'));
};

UI.addXType('input', Input);

export default Input;
import { Control, UI } from '../third_party';

/**
 * Button
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Button(options = {}) {
    Control.call(this, options);
}

Button.prototype = Object.create(Control.prototype);
Button.prototype.constructor = Button;

Button.prototype.render = function () {
    this.renderDom(this.createElement('button'));
};

UI.addXType('button', Button);

export default Button;
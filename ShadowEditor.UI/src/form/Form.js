import { Control, UI } from '../third_party';

/**
 * Form
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Form(options = {}) {
    Control.call(this, options);
}

Form.prototype = Object.create(Control.prototype);
Form.prototype.constructor = Form;

Form.prototype.render = function () {
    this.renderDom(this.createElement('form'));
};

UI.addXType('form', Form);

export default Form;
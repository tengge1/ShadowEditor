import { Control, UI } from '../third_party';

/**
 * Select
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Select(options = {}) {
    Control.call(this, options);
}

Select.prototype = Object.create(Control.prototype);
Select.prototype.constructor = Select;

Select.prototype.render = function () {
    this.renderDom(this.createElement('select'));
};

UI.addXType('select', Select);

export default Select;
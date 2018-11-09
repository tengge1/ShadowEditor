import { Control, UI } from '../third_party';

/**
 * Option
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Option(options = {}) {
    Control.call(this, options);
}

Option.prototype = Object.create(Control.prototype);
Option.prototype.constructor = Option;

Option.prototype.render = function () {
    this.renderDom(this.createElement('option'));
};

UI.addXType('option', Option);

export default Option;
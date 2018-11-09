import { Control, UI } from '../third_party';

/**
 * FieldSet
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function FieldSet(options = {}) {
    Control.call(this, options);
}

FieldSet.prototype = Object.create(Control.prototype);
FieldSet.prototype.constructor = FieldSet;

FieldSet.prototype.render = function () {
    this.renderDom(this.createElement('fieldset'));
};

UI.addXType('fieldset', FieldSet);

export default FieldSet;
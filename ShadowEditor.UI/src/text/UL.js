import { Control, UI } from '../third_party';

/**
 * UL
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function UL(options = {}) {
    Control.call(this, options);
}

UL.prototype = Object.create(Control.prototype);
UL.prototype.constructor = UL;

UL.prototype.render = function () {
    this.renderDom(this.createElement('ul'));
};

UI.addXType('ul', UL);

export default UL;
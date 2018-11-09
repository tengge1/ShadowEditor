import { Control, UI } from '../third_party';

/**
 * A
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function A(options = {}) {
    Control.call(this, options);
}

A.prototype = Object.create(Control.prototype);
A.prototype.constructor = A;

A.prototype.render = function () {
    this.renderDom(this.createElement('a'));
};

UI.addXType('a', A);

export default A;
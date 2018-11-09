import { Control, UI } from '../third_party';

/**
 * B
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function B(options = {}) {
    Control.call(this, options);
}

B.prototype = Object.create(Control.prototype);
B.prototype.constructor = B;

B.prototype.render = function () {
    this.renderDom(this.createElement('b'));
};

UI.addXType('b', B);

export default B;
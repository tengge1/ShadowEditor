import { Control, UI } from '../third_party';

/**
 * H2
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function H2(options = {}) {
    Control.call(this, options);
}

H2.prototype = Object.create(Control.prototype);
H2.prototype.constructor = H2;

H2.prototype.render = function () {
    this.renderDom(this.createElement('h2'));
};

UI.addXType('h2', H2);

export default H2;
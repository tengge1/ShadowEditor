import { Control, UI } from '../third_party';

/**
 * P
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function P(options = {}) {
    Control.call(this, options);
}

P.prototype = Object.create(Control.prototype);
P.prototype.constructor = P;

P.prototype.render = function () {
    this.renderDom(this.createElement('p'));
};

UI.addXType('p', P);

export default P;
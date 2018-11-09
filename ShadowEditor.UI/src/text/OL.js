import { Control, UI } from '../third_party';

/**
 * OL
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function OL(options = {}) {
    Control.call(this, options);
}

OL.prototype = Object.create(Control.prototype);
OL.prototype.constructor = OL;

OL.prototype.render = function () {
    this.renderDom(this.createElement('ol'));
};

UI.addXType('ol', OL);

export default OL;
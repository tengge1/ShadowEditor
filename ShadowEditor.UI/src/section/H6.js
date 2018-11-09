import { Control, UI } from '../third_party';

/**
 * H6
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function H6(options = {}) {
    Control.call(this, options);
}

H6.prototype = Object.create(Control.prototype);
H6.prototype.constructor = H6;

H6.prototype.render = function () {
    this.renderDom(this.createElement('h6'));
};

UI.addXType('h6', H6);

export default H6;
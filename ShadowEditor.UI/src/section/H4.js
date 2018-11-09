import { Control, UI } from '../third_party';

/**
 * H4
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function H4(options = {}) {
    Control.call(this, options);
}

H4.prototype = Object.create(Control.prototype);
H4.prototype.constructor = H4;

H4.prototype.render = function () {
    this.renderDom(this.createElement('h4'));
};

UI.addXType('h4', H4);

export default H4;
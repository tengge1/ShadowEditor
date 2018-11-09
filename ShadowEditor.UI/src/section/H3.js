import { Control, UI } from '../third_party';

/**
 * H3
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function H3(options = {}) {
    Control.call(this, options);
}

H3.prototype = Object.create(Control.prototype);
H3.prototype.constructor = H3;

H3.prototype.render = function () {
    this.renderDom(this.createElement('h3'));
};

UI.addXType('h3', H3);

export default H3;
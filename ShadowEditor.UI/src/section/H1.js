import { Control, UI } from '../third_party';

/**
 * H1
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function H1(options = {}) {
    Control.call(this, options);
}

H1.prototype = Object.create(Control.prototype);
H1.prototype.constructor = H1;

H1.prototype.render = function () {
    this.renderDom(this.createElement('h1'));
};

UI.addXType('h1', H1);

export default H1;
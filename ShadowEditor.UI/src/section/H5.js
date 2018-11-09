import { Control, UI } from '../third_party';

/**
 * H5
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function H5(options = {}) {
    Control.call(this, options);
}

H5.prototype = Object.create(Control.prototype);
H5.prototype.constructor = H5;

H5.prototype.render = function () {
    this.renderDom(this.createElement('h5'));
};

UI.addXType('h5', H5);

export default H5;
import { Control, UI } from '../third_party';

/**
 * TD
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TD(options = {}) {
    Control.call(this, options);
}

TD.prototype = Object.create(Control.prototype);
TD.prototype.constructor = TD;

TD.prototype.render = function () {
    this.renderDom(this.createElement('td'));
};

UI.addXType('td', TD);

export default TD;
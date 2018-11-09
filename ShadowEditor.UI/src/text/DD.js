import { Control, UI } from '../third_party';

/**
 * DD
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function DD(options = {}) {
    Control.call(this, options);
}

DD.prototype = Object.create(Control.prototype);
DD.prototype.constructor = DD;

DD.prototype.render = function () {
    this.renderDom(this.createElement('dd'));
};

UI.addXType('dd', DD);

export default DD;
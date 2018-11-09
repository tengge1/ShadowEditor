import { Control, UI } from '../third_party';

/**
 * Li
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Li(options = {}) {
    Control.call(this, options);
}

Li.prototype = Object.create(Control.prototype);
Li.prototype.constructor = Li;

Li.prototype.render = function () {
    this.renderDom(this.createElement('li'));
};

UI.addXType('li', Li);

export default Li;
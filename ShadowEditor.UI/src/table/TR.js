import { Control, UI } from '../third_party';

/**
 * TR
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TR(options = {}) {
    Control.call(this, options);
}

TR.prototype = Object.create(Control.prototype);
TR.prototype.constructor = TR;

TR.prototype.render = function () {
    this.renderDom(this.createElement('tr'));
};

UI.addXType('tr', TR);

export default TR;
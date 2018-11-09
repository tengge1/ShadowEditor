import { Control, UI } from '../third_party';

/**
 * Code
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Code(options = {}) {
    Control.call(this, options);
}

Code.prototype = Object.create(Control.prototype);
Code.prototype.constructor = Code;

Code.prototype.render = function () {
    this.renderDom(this.createElement('code'));
};

UI.addXType('code', Code);

export default Code;
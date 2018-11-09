import { Control, UI } from '../third_party';

/**
 * DL
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function DL(options = {}) {
    Control.call(this, options);
}

DL.prototype = Object.create(Control.prototype);
DL.prototype.constructor = DL;

DL.prototype.render = function () {
    this.renderDom(this.createElement('dl'));
};

UI.addXType('dl', DL);

export default DL;
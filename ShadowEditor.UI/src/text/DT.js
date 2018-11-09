import { Control, UI } from '../third_party';

/**
 * DT
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function DT(options = {}) {
    Control.call(this, options);
}

DT.prototype = Object.create(Control.prototype);
DT.prototype.constructor = DT;

DT.prototype.render = function () {
    this.renderDom(this.createElement('dt'));
};

UI.addXType('dt', DT);

export default DT;
import { Control, UI } from '../third_party';

/**
 * TH
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TH(options = {}) {
    Control.call(this, options);
}

TH.prototype = Object.create(Control.prototype);
TH.prototype.constructor = TH;

TH.prototype.render = function () {
    this.renderDom(this.createElement('th'));
};

UI.addXType('th', TH);

export default TH;
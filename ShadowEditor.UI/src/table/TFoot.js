import { Control, UI } from '../third_party';

/**
 * TFoot
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TFoot(options = {}) {
    Control.call(this, options);
}

TFoot.prototype = Object.create(Control.prototype);
TFoot.prototype.constructor = TFoot;

TFoot.prototype.render = function () {
    this.renderDom(this.createElement('tfoot'));
};

UI.addXType('tfoot', TFoot);

export default TFoot;
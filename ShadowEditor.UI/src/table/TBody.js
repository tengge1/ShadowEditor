import { Control, UI } from '../third_party';

/**
 * TBody
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TBody(options = {}) {
    Control.call(this, options);
}

TBody.prototype = Object.create(Control.prototype);
TBody.prototype.constructor = TBody;

TBody.prototype.render = function () {
    this.renderDom(this.createElement('tbody'));
};

UI.addXType('tbody', TBody);

export default TBody;
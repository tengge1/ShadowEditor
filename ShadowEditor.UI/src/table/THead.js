import { Control, UI } from '../third_party';

/**
 * THead
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function THead(options = {}) {
    Control.call(this, options);
}

THead.prototype = Object.create(Control.prototype);
THead.prototype.constructor = THead;

THead.prototype.render = function () {
    this.renderDom(this.createElement('thead'));
};

UI.addXType('thead', THead);

export default THead;
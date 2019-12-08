import { SvgControl, SVG } from '../third_party';

/**
 * feDropShadow
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feDropShadow(options = {}) {
    SvgControl.call(this, options);
}

feDropShadow.prototype = Object.create(SvgControl.prototype);
feDropShadow.prototype.constructor = feDropShadow;

feDropShadow.prototype.render = function () {
    this.renderDom(this.createElement('feDropShadow'));
};

SVG.addXType('fedropshadow', feDropShadow);

export default feDropShadow;
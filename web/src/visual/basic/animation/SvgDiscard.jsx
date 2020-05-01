import { SvgControl, SVG } from '../third_party';

/**
 * Discard
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Discard(options = {}) {
    SvgControl.call(this, options);
}

Discard.prototype = Object.create(SvgControl.prototype);
Discard.prototype.constructor = Discard;

Discard.prototype.render = function () {
    this.renderDom(this.createElement('discard'));
};

SVG.addXType('discard', Discard);

export default Discard;
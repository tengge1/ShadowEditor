import { SvgControl, SVG } from '../third_party';

/**
 * 蒙版
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Mask(options = {}) {
    SvgControl.call(this, options);
}

Mask.prototype = Object.create(SvgControl.prototype);
Mask.prototype.constructor = Mask;

Mask.prototype.render = function () {
    this.renderDom(this.createElement('mask'));
};

SVG.addXType('mask', Mask);

export default Mask;
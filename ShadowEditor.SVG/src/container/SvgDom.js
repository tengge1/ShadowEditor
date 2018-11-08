import { SvgControl, SVG } from '../third_party';

/**
 * SvgDom
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgDom(options = {}) {
    SvgControl.call(this, options);
}

SvgDom.prototype = Object.create(SvgControl.prototype);
SvgDom.prototype.constructor = SvgDom;

SvgDom.prototype.render = function () {
    this.renderDom(this.createElement('svg'));
};

SVG.addXType('svg', SvgDom);

export default SvgDom;
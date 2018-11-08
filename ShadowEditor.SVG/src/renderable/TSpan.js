import { SvgControl, SVG } from '../third_party';

/**
 * TSpan
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TSpan(options = {}) {
    SvgControl.call(this, options);
}

TSpan.prototype = Object.create(SvgControl.prototype);
TSpan.prototype.constructor = TSpan;

TSpan.prototype.render = function () {
    this.renderDom(this.createElement('tspan'));
};

SVG.addXType('tspan', TSpan);

export default TSpan;
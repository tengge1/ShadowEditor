import { SvgControl, SVG } from '../third_party';

/**
 * 径向渐变
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function RadialGradient(options = {}) {
    SvgControl.call(this, options);
}

RadialGradient.prototype = Object.create(SvgControl.prototype);
RadialGradient.prototype.constructor = RadialGradient;

RadialGradient.prototype.render = function () {
    this.renderDom(this.createElement('radialGradient'));
};

SVG.addXType('radialgradient', RadialGradient);

export default RadialGradient;
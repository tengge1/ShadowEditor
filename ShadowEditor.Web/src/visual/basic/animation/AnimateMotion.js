import { SvgControl, SVG } from '../third_party';

/**
 * AnimateMotion
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AnimateMotion(options = {}) {
    SvgControl.call(this, options);
}

AnimateMotion.prototype = Object.create(SvgControl.prototype);
AnimateMotion.prototype.constructor = AnimateMotion;

AnimateMotion.prototype.render = function () {
    this.renderDom(this.createElement('animateMotion'));
};

SVG.addXType('animatemotion', AnimateMotion);

export default AnimateMotion;
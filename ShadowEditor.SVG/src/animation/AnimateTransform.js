import { SvgControl, SVG } from '../third_party';

/**
 * AnimateTransform
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AnimateTransform(options = {}) {
    SvgControl.call(this, options);
}

AnimateTransform.prototype = Object.create(SvgControl.prototype);
AnimateTransform.prototype.constructor = AnimateTransform;

AnimateTransform.prototype.render = function () {
    this.renderDom(this.createElement('animateTransform'));
};

SVG.addXType('animateTransform', AnimateTransform);

export default AnimateTransform;
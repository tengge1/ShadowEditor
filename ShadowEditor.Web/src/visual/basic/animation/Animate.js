import { SvgControl, SVG } from '../third_party';

/**
 * Animate
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Animate(options = {}) {
    SvgControl.call(this, options);
}

Animate.prototype = Object.create(SvgControl.prototype);
Animate.prototype.constructor = Animate;

Animate.prototype.render = function () {
    this.renderDom(this.createElement('animate'));
};

SVG.addXType('animate', Animate);

export default Animate;
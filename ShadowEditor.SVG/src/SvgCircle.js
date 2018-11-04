import { Control, UI } from './third_party';

/**
 * SVG圆
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgCircle(options = {}) {
    Control.call(this, options);
}

SvgCircle.prototype = Object.create(Control.prototype);
SvgCircle.prototype.constructor = SvgCircle;

SvgCircle.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.renderDom(dom);
};

UI.addXType('svgcircle', SvgCircle);

export default SvgCircle;
import { Control, UI } from './third_party';

/**
 * SVG椭圆
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgEllipse(options = {}) {
    Control.call(this, options);
}

SvgEllipse.prototype = Object.create(Control.prototype);
SvgEllipse.prototype.constructor = SvgEllipse;

SvgEllipse.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    this.renderDom(dom);
};

UI.addXType('svgellipse', SvgEllipse);

export default SvgEllipse;
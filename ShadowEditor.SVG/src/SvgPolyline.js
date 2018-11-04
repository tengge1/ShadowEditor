import { Control, UI } from './third_party';

/**
 * SVG曲线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgPolyline(options = {}) {
    Control.call(this, options);
}

SvgPolyline.prototype = Object.create(Control.prototype);
SvgPolyline.prototype.constructor = SvgPolyline;

SvgPolyline.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    this.renderDom(dom);
};

UI.addXType('svgpolyline', SvgPolyline);

export default SvgPolyline;
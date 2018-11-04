import { Control, UI } from './third_party';

/**
 * SVG面
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgPolygon(options = {}) {
    Control.call(this, options);
}

SvgPolygon.prototype = Object.create(Control.prototype);
SvgPolygon.prototype.constructor = SvgPolygon;

SvgPolygon.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    this.renderDom(dom);
};

UI.addXType('svgpolygon', SvgPolygon);

export default SvgPolygon;
import { Control, UI } from './third_party';

/**
 * SVG面
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Polygon(options = {}) {
    Control.call(this, options);
}

Polygon.prototype = Object.create(Control.prototype);
Polygon.prototype.constructor = Polygon;

Polygon.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    this.renderDom(dom);
};

UI.addXType('svgpolygon', Polygon);

export default Polygon;
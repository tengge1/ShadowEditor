import { SvgControl, SVG } from '../third_party';

/**
 * SVG面
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Polygon(options = {}) {
    SvgControl.call(this, options);
}

Polygon.prototype = Object.create(SvgControl.prototype);
Polygon.prototype.constructor = Polygon;

Polygon.prototype.render = function () {
    this.renderDom(this.createElement('polygon'));
};

SVG.addXType('polygon', Polygon);

export default Polygon;
import { Control, UI } from './third_party';

/**
 * SVG曲线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Polyline(options = {}) {
    Control.call(this, options);
}

Polyline.prototype = Object.create(Control.prototype);
Polyline.prototype.constructor = Polyline;

Polyline.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    this.renderDom(dom);
};

UI.addXType('svgpolyline', Polyline);

export default Polyline;
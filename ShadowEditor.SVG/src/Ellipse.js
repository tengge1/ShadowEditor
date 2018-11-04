import { Control, UI } from './third_party';

/**
 * SVG椭圆
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Ellipse(options = {}) {
    Control.call(this, options);
}

Ellipse.prototype = Object.create(Control.prototype);
Ellipse.prototype.constructor = Ellipse;

Ellipse.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    this.renderDom(dom);
};

UI.addXType('svgellipse', Ellipse);

export default Ellipse;
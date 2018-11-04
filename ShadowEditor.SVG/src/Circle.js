import { Control, UI } from './third_party';

/**
 * SVG圆
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Circle(options = {}) {
    Control.call(this, options);
}

Circle.prototype = Object.create(Control.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.renderDom(dom);
};

UI.addXType('svgcircle', Circle);

export default Circle;
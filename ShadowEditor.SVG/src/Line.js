import { Control, UI } from './third_party';

/**
 * SVG线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Line(options = {}) {
    Control.call(this, options);
}

Line.prototype = Object.create(Control.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    this.renderDom(dom);
};

UI.addXType('svgline', Line);

export default Line;
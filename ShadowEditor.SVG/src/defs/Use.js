import { Control, UI } from '../third_party';

/**
 * SVG Use
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Use(options = {}) {
    Control.call(this, options);
}

Use.prototype = Object.create(Control.prototype);
Use.prototype.constructor = Use;

Use.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    this.renderDom(dom);
};

UI.addXType('svguse', Use);

export default Use;
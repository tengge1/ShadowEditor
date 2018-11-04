import { Control, UI } from './third_party';

/**
 * SVG线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgLine(options = {}) {
    Control.call(this, options);
}

SvgLine.prototype = Object.create(Control.prototype);
SvgLine.prototype.constructor = SvgLine;

SvgLine.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    this.renderDom(dom);
};

UI.addXType('svgline', SvgLine);

export default SvgLine;
import { Control, UI } from '../third_party';

/**
 * SVG Use
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgUse(options = {}) {
    Control.call(this, options);
}

SvgUse.prototype = Object.create(Control.prototype);
SvgUse.prototype.constructor = SvgUse;

SvgUse.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    this.renderDom(dom);
};

UI.addXType('svguse', SvgUse);

export default SvgUse;
import { Control, UI } from './third_party';

/**
 * SVG文档
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgDom(options = {}) {
    Control.call(this, options);
}

SvgDom.prototype = Object.create(Control.prototype);
SvgDom.prototype.constructor = SvgDom;

SvgDom.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.renderDom(dom);
};

UI.addXType('svgdom', SvgDom);

export default SvgDom;
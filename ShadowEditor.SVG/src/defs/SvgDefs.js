import { Control, UI } from '../third_party';

/**
 * SVG定义
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgDefs(options = {}) {
    Control.call(this, options);
}

SvgDefs.prototype = Object.create(Control.prototype);
SvgDefs.prototype.constructor = SvgDefs;

SvgDefs.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.renderDom(dom);
};

UI.addXType('svgdefs', SvgDefs);

export default SvgDefs;
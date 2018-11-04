import { Control, UI } from '../third_party';

/**
 * SVG滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgFilter(options = {}) {
    Control.call(this, options);
}

SvgFilter.prototype = Object.create(Control.prototype);
SvgFilter.prototype.constructor = SvgFilter;

SvgFilter.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    this.renderDom(dom);
};

UI.addXType('svgfilter', SvgFilter);

export default SvgFilter;
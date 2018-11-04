import { Control, UI } from './third_party';

/**
 * SVG线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgPath(options = {}) {
    Control.call(this, options);
}

SvgPath.prototype = Object.create(Control.prototype);
SvgPath.prototype.constructor = SvgPath;

SvgPath.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.renderDom(dom);
};

UI.addXType('svgpath', SvgPath);

export default SvgPath;
import { Control, UI } from './third_party';

/**
 * SVG链接
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgAnchor(options = {}) {
    Control.call(this, options);
}

SvgAnchor.prototype = Object.create(Control.prototype);
SvgAnchor.prototype.constructor = SvgAnchor;

SvgAnchor.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'a');
    this.renderDom(dom);
};

UI.addXType('svga', SvgAnchor);

export default SvgAnchor;
import { Control, UI } from './third_party';

/**
 * SVG矩形
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgRect(options = {}) {
    Control.call(this, options);
}

SvgRect.prototype = Object.create(Control.prototype);
SvgRect.prototype.constructor = SvgRect;

SvgRect.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.renderDom(dom);
};

UI.addXType('svgrect', SvgRect);

export default SvgRect;
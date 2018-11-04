import { Control, UI } from './third_party';

/**
 * SVG文本
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgText(options = {}) {
    Control.call(this, options);

    this.text = options.text || null;
}

SvgText.prototype = Object.create(Control.prototype);
SvgText.prototype.constructor = SvgText;

SvgText.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.renderDom(dom);
};

UI.addXType('svgtext', SvgText);

export default SvgText;
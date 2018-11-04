import { Control, UI } from './third_party';

/**
 * SVG文本路径
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgTextPath(options = {}) {
    Control.call(this, options);

    this.text = options.text || null;
}

SvgTextPath.prototype = Object.create(Control.prototype);
SvgTextPath.prototype.constructor = SvgTextPath;

SvgTextPath.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    this.renderDom(dom);
};

UI.addXType('svgtextpath', SvgTextPath);

export default SvgTextPath;
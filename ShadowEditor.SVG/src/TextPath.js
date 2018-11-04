import { Control, UI } from './third_party';

/**
 * SVG文本路径
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TextPath(options = {}) {
    Control.call(this, options);

    this.text = options.text || null;
}

TextPath.prototype = Object.create(Control.prototype);
TextPath.prototype.constructor = TextPath;

TextPath.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    this.renderDom(dom);
};

UI.addXType('svgtextpath', TextPath);

export default TextPath;
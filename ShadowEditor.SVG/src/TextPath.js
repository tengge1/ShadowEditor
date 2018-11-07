import { SvgControl } from './third_party';

/**
 * SVG文本路径
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TextPath(options = {}) {
    SvgControl.call(this, options);
}

TextPath.prototype = Object.create(SvgControl.prototype);
TextPath.prototype.constructor = TextPath;

TextPath.prototype.render = function () {
    this.renderDom(this.createElement('textPath'));
};

window.SVG.addXType('textpath', TextPath);

export default TextPath;
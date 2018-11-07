import { SvgControl, SVG } from './third_party';

/**
 * SVG文本
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Text(options = {}) {
    SvgControl.call(this, options);
}

Text.prototype = Object.create(SvgControl.prototype);
Text.prototype.constructor = Text;

Text.prototype.render = function () {
    this.renderDom(this.createElement('text'));
};

SVG.addXType('text', Text);

export default Text;
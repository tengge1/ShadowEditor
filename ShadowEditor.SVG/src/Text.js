import { SvgControl } from './third_party';

/**
 * SVG文本
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Text(options = {}) {
    SvgControl.call(this, options);

    this.text = options.text || null;
}

Text.prototype = Object.create(SvgControl.prototype);
Text.prototype.constructor = Text;

Text.prototype.render = function () {
    this.renderDom(this.createElement('text'));
};

window.SVG.addXType('text', Text);

export default Text;
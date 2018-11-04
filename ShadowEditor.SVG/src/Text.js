import { Control, UI } from './third_party';

/**
 * SVG文本
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Text(options = {}) {
    Control.call(this, options);

    this.text = options.text || null;
}

Text.prototype = Object.create(Control.prototype);
Text.prototype.constructor = Text;

Text.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.renderDom(dom);
};

UI.addXType('svgtext', Text);

export default Text;
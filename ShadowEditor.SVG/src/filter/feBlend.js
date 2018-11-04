import { Control, UI } from '../third_party';

/**
 * SVG融合滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feBlend(options = {}) {
    Control.call(this, options);
}

feBlend.prototype = Object.create(Control.prototype);
feBlend.prototype.constructor = feBlend;

feBlend.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
    this.renderDom(dom);
};

UI.addXType('svgfeblend', feBlend);

export default feBlend;
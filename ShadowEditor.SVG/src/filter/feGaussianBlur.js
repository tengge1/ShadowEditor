import { Control, UI } from '../third_party';

/**
 * SVG高斯滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feGaussianBlur(options = {}) {
    Control.call(this, options);
}

feGaussianBlur.prototype = Object.create(Control.prototype);
feGaussianBlur.prototype.constructor = feGaussianBlur;

feGaussianBlur.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    this.renderDom(dom);
};

UI.addXType('svgfegaussianblur', feGaussianBlur);

export default feGaussianBlur;
import { SvgControl, SVG } from '../third_party';

/**
 * SVG高斯滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feGaussianBlur(options = {}) {
    SvgControl.call(this, options);
}

feGaussianBlur.prototype = Object.create(SvgControl.prototype);
feGaussianBlur.prototype.constructor = feGaussianBlur;

feGaussianBlur.prototype.render = function () {
    this.renderDom(this.createElement('feGaussianBlur'));
};

SVG.addXType('fegaussianblur', feGaussianBlur);

export default feGaussianBlur;
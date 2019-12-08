import { SvgControl, SVG } from '../third_party';

/**
 * 图片
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Image(options = {}) {
    SvgControl.call(this, options);
}

Image.prototype = Object.create(SvgControl.prototype);
Image.prototype.constructor = Image;

Image.prototype.render = function () {
    this.renderDom(this.createElement('image'));
};

SVG.addXType('image', Image);

export default Image;
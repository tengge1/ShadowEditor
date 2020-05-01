import { SvgControl, SVG } from '../third_party';

/**
 * feImage
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feImage(options = {}) {
    SvgControl.call(this, options);
}

feImage.prototype = Object.create(SvgControl.prototype);
feImage.prototype.constructor = feImage;

feImage.prototype.render = function () {
    this.renderDom(this.createElement('feImage'));
};

SVG.addXType('feimage', feImage);

export default feImage;
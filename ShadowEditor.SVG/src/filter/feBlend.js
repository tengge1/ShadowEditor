import { SvgControl } from '../third_party';

/**
 * SVG融合滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feBlend(options = {}) {
    SvgControl.call(this, options);
}

feBlend.prototype = Object.create(SvgControl.prototype);
feBlend.prototype.constructor = feBlend;

feBlend.prototype.render = function () {
    this.renderDom(this.createElement('feBlend'));
};

window.SVG.addXType('feblend', feBlend);

export default feBlend;
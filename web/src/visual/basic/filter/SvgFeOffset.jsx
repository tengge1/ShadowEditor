import { SvgControl, SVG } from '../third_party';

/**
 * SVG偏移滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feOffset(options = {}) {
    SvgControl.call(this, options);
}

feOffset.prototype = Object.create(SvgControl.prototype);
feOffset.prototype.constructor = feOffset;

feOffset.prototype.render = function () {
    this.renderDom(this.createElement('feOffset'));
};

SVG.addXType('feoffset', feOffset);

export default feOffset;
import { SvgControl } from '../third_party';

/**
 * SVG融合滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feColorMatrix(options = {}) {
    SvgControl.call(this, options);
}

feColorMatrix.prototype = Object.create(SvgControl.prototype);
feColorMatrix.prototype.constructor = feColorMatrix;

feColorMatrix.prototype.render = function () {
    this.renderDom(this.createElement('feColorMatrix'));
};

window.SVG.addXType('fecolormatrix', feColorMatrix);

export default feColorMatrix;
import { SvgControl, SVG } from '../third_party';

/**
 * feConvolveMatrix
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feConvolveMatrix(options = {}) {
    SvgControl.call(this, options);
}

feConvolveMatrix.prototype = Object.create(SvgControl.prototype);
feConvolveMatrix.prototype.constructor = feConvolveMatrix;

feConvolveMatrix.prototype.render = function () {
    this.renderDom(this.createElement('feConvolveMatrix'));
};

SVG.addXType('feconvolvematrix', feConvolveMatrix);

export default feConvolveMatrix;
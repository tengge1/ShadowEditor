import { SvgControl } from '../third_party';

/**
 * 线性渐变
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function linearGradient(options = {}) {
    SvgControl.call(this, options);
}

linearGradient.prototype = Object.create(SvgControl.prototype);
linearGradient.prototype.constructor = linearGradient;

linearGradient.prototype.render = function () {
    this.renderDom(this.createElement('linearGradient'));
};

window.SVG.addXType('lineargradient', linearGradient);

export default linearGradient;
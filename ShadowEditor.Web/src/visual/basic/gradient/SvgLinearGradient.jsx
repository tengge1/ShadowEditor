import { SvgControl, SVG } from '../third_party';

/**
 * 线性渐变
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function LinearGradient(options = {}) {
    SvgControl.call(this, options);
}

LinearGradient.prototype = Object.create(SvgControl.prototype);
LinearGradient.prototype.constructor = LinearGradient;

LinearGradient.prototype.render = function () {
    this.renderDom(this.createElement('linearGradient'));
};

SVG.addXType('lineargradient', LinearGradient);

export default LinearGradient;
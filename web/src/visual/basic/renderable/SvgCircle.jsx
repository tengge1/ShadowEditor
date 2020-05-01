import { SvgControl, SVG } from '../third_party';

/**
 * SVG圆
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Circle(options = {}) {
    SvgControl.call(this, options);
}

Circle.prototype = Object.create(SvgControl.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function () {
    this.renderDom(this.createElement('circle'));
};

SVG.addXType('circle', Circle);

export default Circle;
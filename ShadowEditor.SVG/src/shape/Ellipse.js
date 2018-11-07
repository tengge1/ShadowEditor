import { SvgControl } from '../third_party';

/**
 * SVG椭圆
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Ellipse(options = {}) {
    SvgControl.call(this, options);
}

Ellipse.prototype = Object.create(SvgControl.prototype);
Ellipse.prototype.constructor = Ellipse;

Ellipse.prototype.render = function () {
    this.renderDom(this.createElement('ellipse'));
};

window.SVG.addXType('ellipse', Ellipse);

export default Ellipse;
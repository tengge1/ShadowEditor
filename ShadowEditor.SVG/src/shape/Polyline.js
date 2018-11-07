import { SvgControl } from '../third_party';

/**
 * SVG曲线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Polyline(options = {}) {
    SvgControl.call(this, options);
}

Polyline.prototype = Object.create(SvgControl.prototype);
Polyline.prototype.constructor = Polyline;

Polyline.prototype.render = function () {
    this.renderDom(this.createElement('polyline'));
};

window.SVG.addXType('polyline', Polyline);

export default Polyline;
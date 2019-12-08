import { SvgControl, SVG } from '../third_party';

/**
 * 箭头
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Marker(options = {}) {
    SvgControl.call(this, options);
}

Marker.prototype = Object.create(SvgControl.prototype);
Marker.prototype.constructor = Marker;

Marker.prototype.render = function () {
    this.renderDom(this.createElement('marker'));
};

SVG.addXType('marker', Marker);

export default Marker;
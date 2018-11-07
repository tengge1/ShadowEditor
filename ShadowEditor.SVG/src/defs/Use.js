import { SvgControl } from '../third_party';

/**
 * SVG Use
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Use(options = {}) {
    SvgControl.call(this, options);
}

Use.prototype = Object.create(SvgControl.prototype);
Use.prototype.constructor = Use;

Use.prototype.render = function () {
    this.renderDom(this.createElement('use'));
};

window.SVG.addXType('use', Use);

export default Use;
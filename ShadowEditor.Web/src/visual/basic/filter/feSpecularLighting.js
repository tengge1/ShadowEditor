import { SvgControl, SVG } from '../third_party';

/**
 * feSpecularLighting
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feSpecularLighting(options = {}) {
    SvgControl.call(this, options);
}

feSpecularLighting.prototype = Object.create(SvgControl.prototype);
feSpecularLighting.prototype.constructor = feSpecularLighting;

feSpecularLighting.prototype.render = function () {
    this.renderDom(this.createElement('feSpecularLighting'));
};

SVG.addXType('fespecularlighting', feSpecularLighting);

export default feSpecularLighting;
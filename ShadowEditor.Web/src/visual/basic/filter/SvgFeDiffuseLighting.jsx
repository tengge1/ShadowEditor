import { SvgControl, SVG } from '../third_party';

/**
 * feDiffuseLighting
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feDiffuseLighting(options = {}) {
    SvgControl.call(this, options);
}

feDiffuseLighting.prototype = Object.create(SvgControl.prototype);
feDiffuseLighting.prototype.constructor = feDiffuseLighting;

feDiffuseLighting.prototype.render = function () {
    this.renderDom(this.createElement('feDiffuseLighting'));
};

SVG.addXType('fediffuselighting', feDiffuseLighting);

export default feDiffuseLighting;
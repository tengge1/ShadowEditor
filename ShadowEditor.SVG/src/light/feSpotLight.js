import { SvgControl, SVG } from '../third_party';

/**
 * feSpotLight
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feSpotLight(options = {}) {
    SvgControl.call(this, options);
}

feSpotLight.prototype = Object.create(SvgControl.prototype);
feSpotLight.prototype.constructor = feSpotLight;

feSpotLight.prototype.render = function () {
    this.renderDom(this.createElement('feSpotLight'));
};

SVG.addXType('fespotlight', feSpotLight);

export default feSpotLight;
import { SvgControl, SVG } from '../third_party';

/**
 * fePointLight
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function fePointLight(options = {}) {
    SvgControl.call(this, options);
}

fePointLight.prototype = Object.create(SvgControl.prototype);
fePointLight.prototype.constructor = fePointLight;

fePointLight.prototype.render = function () {
    this.renderDom(this.createElement('fePointLight'));
};

SVG.addXType('fePointLight', fePointLight);

export default fePointLight;
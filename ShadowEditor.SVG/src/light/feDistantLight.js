import { SvgControl, SVG } from '../third_party';

/**
 * feDistantLight
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feDistantLight(options = {}) {
    SvgControl.call(this, options);
}

feDistantLight.prototype = Object.create(SvgControl.prototype);
feDistantLight.prototype.constructor = feDistantLight;

feDistantLight.prototype.render = function () {
    this.renderDom(this.createElement('feDistantLight'));
};

SVG.addXType('feDistantLight', feDistantLight);

export default feDistantLight;
import { SvgControl, SVG } from './third_party';

/**
 * ColorProfile
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ColorProfile(options = {}) {
    SvgControl.call(this, options);
}

ColorProfile.prototype = Object.create(SvgControl.prototype);
ColorProfile.prototype.constructor = ColorProfile;

ColorProfile.prototype.render = function () {
    this.renderDom(this.createElement('color-profile'));
};

SVG.addXType('colorprofile', ColorProfile);

export default ColorProfile;
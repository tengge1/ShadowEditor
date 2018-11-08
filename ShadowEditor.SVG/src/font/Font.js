import { SvgControl, SVG } from '../third_party';

/**
 * Font
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Font(options = {}) {
    SvgControl.call(this, options);
}

Font.prototype = Object.create(SvgControl.prototype);
Font.prototype.constructor = Font;

Font.prototype.render = function () {
    this.renderDom(this.createElement('font'));
};

SVG.addXType('font', Font);

export default Font;
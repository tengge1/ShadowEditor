import { SvgControl, SVG } from './third_party';

/**
 * Style
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Style(options = {}) {
    SvgControl.call(this, options);
}

Style.prototype = Object.create(SvgControl.prototype);
Style.prototype.constructor = Style;

Style.prototype.render = function () {
    this.renderDom(this.createElement('style'));
};

SVG.addXType('style', Style);

export default Style;
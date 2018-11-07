import { SvgControl, SVG } from '../third_party';

/**
 * SVG链接
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Anchor(options = {}) {
    SvgControl.call(this, options);
}

Anchor.prototype = Object.create(SvgControl.prototype);
Anchor.prototype.constructor = Anchor;

Anchor.prototype.render = function () {
    this.renderDom(this.createElement('a'));
};

SVG.addXType('a', Anchor);

export default Anchor;
import { SvgControl, SVG } from '../third_party';

/**
 * feFuncG
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feFuncG(options = {}) {
    SvgControl.call(this, options);
}

feFuncG.prototype = Object.create(SvgControl.prototype);
feFuncG.prototype.constructor = feFuncG;

feFuncG.prototype.render = function () {
    this.renderDom(this.createElement('feFuncG'));
};

SVG.addXType('fefuncg', feFuncG);

export default feFuncG;
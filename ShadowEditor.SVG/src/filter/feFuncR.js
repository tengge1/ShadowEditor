import { SvgControl, SVG } from '../third_party';

/**
 * feFuncR
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feFuncR(options = {}) {
    SvgControl.call(this, options);
}

feFuncR.prototype = Object.create(SvgControl.prototype);
feFuncR.prototype.constructor = feFuncR;

feFuncR.prototype.render = function () {
    this.renderDom(this.createElement('feFuncR'));
};

SVG.addXType('fefuncr', feFuncR);

export default feFuncR;
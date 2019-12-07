import { SvgControl, SVG } from '../third_party';

/**
 * feFuncB
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feFuncB(options = {}) {
    SvgControl.call(this, options);
}

feFuncB.prototype = Object.create(SvgControl.prototype);
feFuncB.prototype.constructor = feFuncB;

feFuncB.prototype.render = function () {
    this.renderDom(this.createElement('feFuncB'));
};

SVG.addXType('fefuncb', feFuncB);

export default feFuncB;
import { SvgControl, SVG } from '../third_party';

/**
 * feFuncA
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feFuncA(options = {}) {
    SvgControl.call(this, options);
}

feFuncA.prototype = Object.create(SvgControl.prototype);
feFuncA.prototype.constructor = feFuncA;

feFuncA.prototype.render = function () {
    this.renderDom(this.createElement('feFuncA'));
};

SVG.addXType('fefunca', feFuncA);

export default feFuncA;
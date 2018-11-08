import { SvgControl, SVG } from '../third_party';

/**
 * 标记
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Symbol(options = {}) {
    SvgControl.call(this, options);
}

Symbol.prototype = Object.create(SvgControl.prototype);
Symbol.prototype.constructor = Symbol;

Symbol.prototype.render = function () {
    this.renderDom(this.createElement('symbol'));
};

SVG.addXType('symbol', Symbol);

export default Symbol;
import { SvgControl, SVG } from '../third_party';

/**
 * feMerge
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feMerge(options = {}) {
    SvgControl.call(this, options);
}

feMerge.prototype = Object.create(SvgControl.prototype);
feMerge.prototype.constructor = feMerge;

feMerge.prototype.render = function () {
    this.renderDom(this.createElement('feMerge'));
};

SVG.addXType('femerge', feMerge);

export default feMerge;
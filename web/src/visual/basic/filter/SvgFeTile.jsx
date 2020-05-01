import { SvgControl, SVG } from '../third_party';

/**
 * feTile
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feTile(options = {}) {
    SvgControl.call(this, options);
}

feTile.prototype = Object.create(SvgControl.prototype);
feTile.prototype.constructor = feTile;

feTile.prototype.render = function () {
    this.renderDom(this.createElement('feTile'));
};

SVG.addXType('fetile', feTile);

export default feTile;
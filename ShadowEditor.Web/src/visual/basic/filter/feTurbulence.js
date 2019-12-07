import { SvgControl, SVG } from '../third_party';

/**
 * feTurbulence
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feTurbulence(options = {}) {
    SvgControl.call(this, options);
}

feTurbulence.prototype = Object.create(SvgControl.prototype);
feTurbulence.prototype.constructor = feTurbulence;

feTurbulence.prototype.render = function () {
    this.renderDom(this.createElement('feTurbulence'));
};

SVG.addXType('feturbulence', feTurbulence);

export default feTurbulence;
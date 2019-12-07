import { SvgControl, SVG } from '../third_party';

/**
 * feMorphology
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feMorphology(options = {}) {
    SvgControl.call(this, options);
}

feMorphology.prototype = Object.create(SvgControl.prototype);
feMorphology.prototype.constructor = feMorphology;

feMorphology.prototype.render = function () {
    this.renderDom(this.createElement('feMorphology'));
};

SVG.addXType('femorphology', feMorphology);

export default feMorphology;
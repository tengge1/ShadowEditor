import { SvgControl, SVG } from '../third_party';

/**
 * feComposite
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feComposite(options = {}) {
    SvgControl.call(this, options);
}

feComposite.prototype = Object.create(SvgControl.prototype);
feComposite.prototype.constructor = feComposite;

feComposite.prototype.render = function () {
    this.renderDom(this.createElement('feComposite'));
};

SVG.addXType('fecomposite', feComposite);

export default feComposite;
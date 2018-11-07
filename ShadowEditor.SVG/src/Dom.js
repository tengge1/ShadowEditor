import { SvgControl } from './third_party';

/**
 * SVG文档
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Dom(options = {}) {
    SvgControl.call(this, options);
}

Dom.prototype = Object.create(SvgControl.prototype);
Dom.prototype.constructor = Dom;

Dom.prototype.render = function () {
    this.renderDom(this.createElement('svg'));
};

window.SVG.addXType('dom', Dom);

export default Dom;
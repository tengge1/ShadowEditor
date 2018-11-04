import { Control, UI } from './third_party';

/**
 * SVG文档
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Dom(options = {}) {
    Control.call(this, options);
}

Dom.prototype = Object.create(Control.prototype);
Dom.prototype.constructor = Dom;

Dom.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.renderDom(dom);
};

UI.addXType('svgdom', Dom);

export default Dom;
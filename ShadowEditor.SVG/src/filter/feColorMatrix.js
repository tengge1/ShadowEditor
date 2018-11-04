import { Control, UI } from '../third_party';

/**
 * SVG融合滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feColorMatrix(options = {}) {
    Control.call(this, options);
}

feColorMatrix.prototype = Object.create(Control.prototype);
feColorMatrix.prototype.constructor = feColorMatrix;

feColorMatrix.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    this.renderDom(dom);
};

UI.addXType('svgfecolormatrix', feColorMatrix);

export default feColorMatrix;
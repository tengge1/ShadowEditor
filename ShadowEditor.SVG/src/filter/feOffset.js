import { Control, UI } from '../third_party';

/**
 * SVG偏移滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feOffset(options = {}) {
    Control.call(this, options);
}

feOffset.prototype = Object.create(Control.prototype);
feOffset.prototype.constructor = feOffset;

feOffset.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
    this.renderDom(dom);
};

UI.addXType('svgfeoffset', feOffset);

export default feOffset;
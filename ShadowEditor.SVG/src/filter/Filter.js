import { Control, UI } from '../third_party';

/**
 * SVG滤镜
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Filter(options = {}) {
    Control.call(this, options);
}

Filter.prototype = Object.create(Control.prototype);
Filter.prototype.constructor = Filter;

Filter.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    this.renderDom(dom);
};

UI.addXType('svgfilter', Filter);

export default Filter;
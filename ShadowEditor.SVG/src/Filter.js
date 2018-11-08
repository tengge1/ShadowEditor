import { SvgControl, SVG } from './third_party';

/**
 * Filter
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Filter(options = {}) {
    SvgControl.call(this, options);
}

Filter.prototype = Object.create(SvgControl.prototype);
Filter.prototype.constructor = Filter;

Filter.prototype.render = function () {
    this.renderDom(this.createElement('filter'));
};

SVG.addXType('filter', Filter);

export default Filter;
import { SvgControl } from './third_party';

/**
 * SVG线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Line(options = {}) {
    SvgControl.call(this, options);
}

Line.prototype = Object.create(SvgControl.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function () {
    this.renderDom(this.createElement('line'));
};

window.SVG.addXType('line', Line);

export default Line;
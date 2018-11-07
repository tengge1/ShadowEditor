import { SvgControl } from './third_party';

/**
 * SVG矩形
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Rect(options = {}) {
    SvgControl.call(this, options);
}

Rect.prototype = Object.create(SvgControl.prototype);
Rect.prototype.constructor = Rect;

Rect.prototype.render = function () {
    this.renderDom(this.createElement('rect'));
};

window.SVG.addXType('rect', Rect);

export default Rect;
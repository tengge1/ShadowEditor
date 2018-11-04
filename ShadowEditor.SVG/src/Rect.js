import { Control, UI } from './third_party';

/**
 * SVG矩形
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Rect(options = {}) {
    Control.call(this, options);
}

Rect.prototype = Object.create(Control.prototype);
Rect.prototype.constructor = Rect;

Rect.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.renderDom(dom);
};

UI.addXType('svgrect', Rect);

export default Rect;
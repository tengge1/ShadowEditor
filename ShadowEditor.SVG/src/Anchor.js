import { Control, UI } from './third_party';

/**
 * SVG链接
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Anchor(options = {}) {
    Control.call(this, options);
}

Anchor.prototype = Object.create(Control.prototype);
Anchor.prototype.constructor = Anchor;

Anchor.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'a');
    this.renderDom(dom);
};

UI.addXType('svga', Anchor);

export default Anchor;
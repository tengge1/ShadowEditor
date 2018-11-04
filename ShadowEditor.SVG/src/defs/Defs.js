import { Control, UI } from '../third_party';

/**
 * SVG定义
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Defs(options = {}) {
    Control.call(this, options);
}

Defs.prototype = Object.create(Control.prototype);
Defs.prototype.constructor = Defs;

Defs.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.renderDom(dom);
};

UI.addXType('svgdefs', Defs);

export default Defs;
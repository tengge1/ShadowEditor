import { SvgControl } from '../third_party';

/**
 * SVG定义
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Defs(options = {}) {
    SvgControl.call(this, options);
}

Defs.prototype = Object.create(SvgControl.prototype);
Defs.prototype.constructor = Defs;

Defs.prototype.render = function () {
    this.renderDom(this.createElement('defs'));
};

window.SVG.addXType('defs', Defs);

export default Defs;
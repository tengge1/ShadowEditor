import { SvgControl, SVG } from '../third_party';

/**
 * 选择
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Switch(options = {}) {
    SvgControl.call(this, options);
}

Switch.prototype = Object.create(SvgControl.prototype);
Switch.prototype.constructor = Switch;

Switch.prototype.render = function () {
    this.renderDom(this.createElement('switch'));
};

SVG.addXType('switch', Switch);

export default Switch;
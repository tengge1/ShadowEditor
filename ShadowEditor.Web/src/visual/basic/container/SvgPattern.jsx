import { SvgControl, SVG } from '../third_party';

/**
 * 模式
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Pattern(options = {}) {
    SvgControl.call(this, options);
}

Pattern.prototype = Object.create(SvgControl.prototype);
Pattern.prototype.constructor = Pattern;

Pattern.prototype.render = function () {
    this.renderDom(this.createElement('pattern'));
};

SVG.addXType('pattern', Pattern);

export default Pattern;
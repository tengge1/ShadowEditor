import { SvgControl, SVG } from '../third_party';

/**
 * 停止渐变
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Stop(options = {}) {
    SvgControl.call(this, options);
}

Stop.prototype = Object.create(SvgControl.prototype);
Stop.prototype.constructor = Stop;

Stop.prototype.render = function () {
    this.renderDom(this.createElement('stop'));
};

SVG.addXType('stop', Stop);

export default Stop;
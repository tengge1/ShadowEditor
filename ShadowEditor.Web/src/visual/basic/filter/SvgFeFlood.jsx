import { SvgControl, SVG } from '../third_party';

/**
 * feFlood
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feFlood(options = {}) {
    SvgControl.call(this, options);
}

feFlood.prototype = Object.create(SvgControl.prototype);
feFlood.prototype.constructor = feFlood;

feFlood.prototype.render = function () {
    this.renderDom(this.createElement('feFlood'));
};

SVG.addXType('feflood', feFlood);

export default feFlood;
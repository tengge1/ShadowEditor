import { SvgControl, SVG } from '../third_party';

/**
 * feComponentTransfer
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feComponentTransfer(options = {}) {
    SvgControl.call(this, options);
}

feComponentTransfer.prototype = Object.create(SvgControl.prototype);
feComponentTransfer.prototype.constructor = feComponentTransfer;

feComponentTransfer.prototype.render = function () {
    this.renderDom(this.createElement('feComponentTransfer'));
};

SVG.addXType('fecomponenttransfer', feComponentTransfer);

export default feComponentTransfer;
import { SvgControl, SVG } from '../third_party';

/**
 * Mpath
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Mpath(options = {}) {
    SvgControl.call(this, options);
}

Mpath.prototype = Object.create(SvgControl.prototype);
Mpath.prototype.constructor = Mpath;

Mpath.prototype.render = function () {
    this.renderDom(this.createElement('mpath'));
};

SVG.addXType('mpath', Mpath);

export default Mpath;
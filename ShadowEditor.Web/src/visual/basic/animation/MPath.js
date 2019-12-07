import { SvgControl, SVG } from '../third_party';

/**
 * MPath
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function MPath(options = {}) {
    SvgControl.call(this, options);
}

MPath.prototype = Object.create(SvgControl.prototype);
MPath.prototype.constructor = MPath;

MPath.prototype.render = function () {
    this.renderDom(this.createElement('mpath'));
};

SVG.addXType('mpath', MPath);

export default MPath;
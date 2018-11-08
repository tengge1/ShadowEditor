import { SvgControl, SVG } from './third_party';

/**
 * ClipPath
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ClipPath(options = {}) {
    SvgControl.call(this, options);
}

ClipPath.prototype = Object.create(SvgControl.prototype);
ClipPath.prototype.constructor = ClipPath;

ClipPath.prototype.render = function () {
    this.renderDom(this.createElement('clipPath'));
};

SVG.addXType('clippath', ClipPath);

export default ClipPath;
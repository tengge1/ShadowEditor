import { SvgControl, SVG } from '../third_party';

/**
 * 线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Path(options = {}) {
    SvgControl.call(this, options);
}

Path.prototype = Object.create(SvgControl.prototype);
Path.prototype.constructor = Path;

Path.prototype.render = function () {
    this.renderDom(this.createElement('path'));
};

SVG.addXType('path', Path);

export default Path;
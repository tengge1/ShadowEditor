import { SvgControl, SVG } from '../third_party';

/**
 * TextPath
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TextPath(options = {}) {
    SvgControl.call(this, options);
}

TextPath.prototype = Object.create(SvgControl.prototype);
TextPath.prototype.constructor = TextPath;

TextPath.prototype.render = function () {
    this.renderDom(this.createElement('textPath'));
};

SVG.addXType('textpath', TextPath);

export default TextPath;
import { SvgControl, SVG } from '../third_party';

/**
 * Title
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Title(options = {}) {
    SvgControl.call(this, options);
}

Title.prototype = Object.create(SvgControl.prototype);
Title.prototype.constructor = Title;

Title.prototype.render = function () {
    this.renderDom(this.createElement('title'));
};

SVG.addXType('title', Title);

export default Title;
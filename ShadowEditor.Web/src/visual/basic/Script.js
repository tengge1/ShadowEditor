import { SvgControl, SVG } from './third_party';

/**
 * Script
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Script(options = {}) {
    SvgControl.call(this, options);
}

Script.prototype = Object.create(SvgControl.prototype);
Script.prototype.constructor = Script;

Script.prototype.render = function () {
    this.renderDom(this.createElement('script'));
};

SVG.addXType('script', Script);

export default Script;
import { SvgControl, SVG } from './third_party';

/**
 * View
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function View(options = {}) {
    SvgControl.call(this, options);
}

View.prototype = Object.create(SvgControl.prototype);
View.prototype.constructor = View;

View.prototype.render = function () {
    this.renderDom(this.createElement('view'));
};

SVG.addXType('view', View);

export default View;
import { Control, UI } from '../third_party';

/**
 * HtmlDom
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function HtmlDom(options = {}) {
    Control.call(this, options);
}

HtmlDom.prototype = Object.create(Control.prototype);
HtmlDom.prototype.constructor = HtmlDom;

HtmlDom.prototype.render = function () {
    this.renderDom(this.createElement('html'));
};

UI.addXType('dom', HtmlDom);

export default HtmlDom;
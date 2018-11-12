import { Control, UI } from '../third_party';

/**
 * 容器
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Html(options = {}) {
    Control.call(this, options);
}

Html.prototype = Object.create(Control.prototype);
Html.prototype.constructor = Html;

Html.prototype.render = function () {
    this.renderDom(document.createTextNode(this.html));
};

UI.addXType('html', Html);

export default Html;
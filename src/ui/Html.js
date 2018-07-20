import Control from './Control';

/**
 * 原生html
 * @param {*} options 选项
 */
function Html(options) {
    Control.call(this, options);
    options = options || {};
    this.html = options.html || null;
}

Html.prototype = Object.create(Control.prototype);
Html.prototype.constructor = Html;

/**
 * 渲染控件
 */
Html.prototype.render = function () {
    if (this.html) {
        this.parent.innerHTML += this.html;
    }
};

export default Html;
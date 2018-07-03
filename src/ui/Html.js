import Control from './Control';
import XType from './XType';

/**
 * 原生html
 * @param {*} options 选项
 */
function Html(options) {
    Control.call(this, options);
    options = options || {};
    this.html = options.html || null;
}

/**
 * 渲染控件
 */
Html.prototype.render = function () {
    if (this.html) {
        this.parent.innerHTML += this.html;
    }
};

XType.add('html', Html);

export default Html;
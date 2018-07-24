import Control from './Control';

/**
 * 图片
 * @param {*} options 选项
 */
function Image(options) {
    Control.call(this, options);
    options = options || {};

    this.src = options.src || '';
    this.title = options.title || null;
    this.alt = options.alt || null;
    this.cls = options.cls || null;
    this.style = options.style || null;
}

Image.prototype = Object.create(Control.prototype);
Image.prototype.constructor = Image;

Image.prototype.render = function () {
    this.dom = document.createElement('img');
    this.dom.src = this.src;

    if (this.title) {
        this.dom.title = this.title;
    }

    if (this.alt) {
        this.dom.alt = this.alt;
    }

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        this.dom.style = this.style;
    }

    this.parent.appendChild(this.dom);
};

export default Image;
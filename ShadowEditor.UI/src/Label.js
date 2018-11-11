import Control from './Control';

/**
 * 标签控件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Label(options) {
    Control.call(this, options);
    options = options || {};

    this.text = options.text || '';
    this.cls = options.cls || null;
    this.style = options.style || null;
};

Label.prototype = Object.create(Control.prototype);
Label.prototype.constructor = Label;

Label.prototype.render = function () {
    this.dom = document.createElement('label');

    if (this.text) {
        this.setValue(this.text);
    }

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.parent.appendChild(this.dom);
};

Label.prototype.getValue = function () {
    return this.dom.textContent;
};

Label.prototype.setValue = function (value) {
    if (value !== undefined) {
        this.dom.textContent = value;
    }
    return this;
};

export default Label;
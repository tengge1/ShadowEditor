import Control from './Control';

/**
 * 文本框
 * @param {*} options 
 */
function Text(options) {
    Control.call(this, options);
    options = options || {};

    this.id = options.id || null;
    this.text = options.text || '';
    this.cls = options.cls || 'Text';
    this.style = options.style || null;

    this.onClick = options.onClick || null;
};

Text.prototype = Object.create(Control.prototype);
Text.prototype.constructor = Text;

Text.prototype.render = function () {
    this.dom = document.createElement('span');

    this.dom.className = this.cls;

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.setValue(this.text);

    if (this.onClick) {
        this.dom.addEventListener('click', this.onClick.bind(this));
    }

    this.parent.appendChild(this.dom);
};

Text.prototype.getValue = function () {
    return this.dom.textContent;
};

Text.prototype.setValue = function (value) {
    if (value !== undefined) {
        this.dom.textContent = value;
    }
    return this;
};

export default Text;
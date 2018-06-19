import Control from './Control';

/**
 * 文本框
 * @param {*} options 
 */
function Text(options) {
    Control.call(this, options);
    options = options || {};
    this.text = options.text || 'Text';
};

Text.prototype = Object.create(Control.prototype);
Text.prototype.constructor = Text;

Text.prototype.render = function () {
    this.dom = document.createElement('span');
    this.dom.className = 'Text';
    this.dom.style.cursor = 'default';
    this.dom.style.display = 'inline-block';
    this.dom.style.verticalAlign = 'middle';
    this.setValue(this.text);

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
import Control from './Control';

var ID = -1;

/**
 * 文本框
 * @param {*} options 
 */
function Text(options) {
    Control.call(this, options);
    options = options || {};
    this.id = options.id || 'Text' + ID--;
    this.text = options.text || 'Text';
    this.cls = options.cls || 'Text';
    this.style = options.style || null;
};

Text.prototype = Object.create(Control.prototype);
Text.prototype.constructor = Text;

Text.prototype.render = function () {
    this.dom = document.createElement('span');
    this.dom.className = this.cls;
    if (this.style) {
        this.dom.style = this.style;
    }
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
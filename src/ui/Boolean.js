import Control from './Control';
import XType from './XType';

var ID = -1;

/**
 * 布尔值
 * @param {*} options 
 */
function Boolean(options) {
    Control.call(this, options);
    options = options || {};

    this.id = options.id || null;
    this.text = options.text || 'Boolean';
    this.value = options.value || false;
    this.cls = options.cls || null;
    this.style = options.style || null;

    this.onChange = options.onChange || null;
};

Boolean.prototype = Object.create(Control.prototype);
Boolean.prototype.constructor = Boolean;

Boolean.prototype.render = function () {
    this.dom = document.createElement('span');

    if (this.id) {
        this.dom.id = this.id;
    }

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        this.dom.style = this.style;
    }
    this.dom.style.marginRight = '10px';

    this.parent.appendChild(this.dom);

    this.input = document.createElement('input');
    this.input.type = 'checkbox';
    this.input.className = 'Checkbox';
    this.dom.appendChild(this.input);

    this.span = document.createElement('span');
    this.span.className = 'Text';
    this.span.style = 'cursor: default; display: inline-block; vertical-align: middle; margin-left: 3px; color: rgb(136, 136, 136);';
    this.span.innerHTML = this.text;
    this.dom.appendChild(this.span);

    this.setValue(this.value);

    if (this.onChange) {
        this.input.addEventListener('change', this.onChange.bind(this), false);
    }
};

Boolean.prototype.getValue = function () {
    return this.input.checked;
};

Boolean.prototype.setValue = function (value) {
    this.input.checked = value;
};

XType.add('boolean', Boolean);

export default Boolean;
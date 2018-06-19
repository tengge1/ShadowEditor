import Control from './Control';
import Span from './Span';
import Checkbox from './Checkbox';
import Text from './Text';

/**
 * 布尔值
 * @param {*} options 
 */
function Boolean(options) {
    Control.call(this, options);
    options = options || {};
};

Boolean.prototype = Object.create(Control.prototype);
Boolean.prototype.constructor = Boolean;

Boolean.prototype.render = function () {
    // this.setMarginRight('10px');

    this.checkbox = new Checkbox(boolean);
    this.text = new Text(text).setMarginLeft('3px');
    this.parent.appendChild(this.checkbox);
    this.parent.appendChild(this.text);
};

Boolean.prototype.getValue = function () {
    return this.checkbox.getValue();
};

Boolean.prototype.setValue = function (value) {
    return this.checkbox.setValue(value);
};

export default Boolean;
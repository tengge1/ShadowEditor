import Span from './Span';
import Checkbox from './Checkbox';
import Text from './Text';

function Boolean(boolean, text) {

    Span.call(this);

    this.setMarginRight('10px');

    this.checkbox = new Checkbox(boolean);
    this.text = new Text(text).setMarginLeft('3px');

    this.add(this.checkbox);
    this.add(this.text);

};

Boolean.prototype = Object.create(Span.prototype);
Boolean.prototype.constructor = Boolean;

Boolean.prototype.getValue = function () {

    return this.checkbox.getValue();

};

Boolean.prototype.setValue = function (value) {

    return this.checkbox.setValue(value);

};

export default Boolean;
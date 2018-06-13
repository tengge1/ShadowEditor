import Element from './Element';

// Checkbox

function Checkbox(boolean) {

    Element.call(this);

    var scope = this;

    var dom = document.createElement('input');
    dom.className = 'Checkbox';
    dom.type = 'checkbox';

    this.dom = dom;
    this.setValue(boolean);

    return this;

};

Checkbox.prototype = Object.create(Element.prototype);
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.getValue = function () {

    return this.dom.checked;

};

Checkbox.prototype.setValue = function (value) {

    if (value !== undefined) {

        this.dom.checked = value;

    }

    return this;

};

export default Checkbox;
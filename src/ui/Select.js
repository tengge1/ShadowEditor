import Element from './Element';

// Select

function Select() {

    Element.call(this);

    var scope = this;

    var dom = document.createElement('select');
    dom.className = 'Select';
    dom.style.padding = '2px';

    this.dom = dom;

    return this;

};

Select.prototype = Object.create(Element.prototype);
Select.prototype.constructor = Select;

Select.prototype.setMultiple = function (boolean) {

    this.dom.multiple = boolean;

    return this;

};

Select.prototype.setOptions = function (options) {

    var selected = this.dom.value;

    while (this.dom.children.length > 0) {

        this.dom.removeChild(this.dom.firstChild);

    }

    for (var key in options) {

        var option = document.createElement('option');
        option.value = key;
        option.innerHTML = options[key];
        this.dom.appendChild(option);

    }

    this.dom.value = selected;

    return this;

};

Select.prototype.getValue = function () {

    return this.dom.value;

};

Select.prototype.setValue = function (value) {

    value = String(value);

    if (this.dom.value !== value) {

        this.dom.value = value;

    }

    return this;

};

export default Select;
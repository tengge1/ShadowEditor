import Element from './Element';

// Input

function Input(text) {

    Element.call(this);

    var scope = this;

    var dom = document.createElement('input');
    dom.className = 'Input';
    dom.style.padding = '2px';
    dom.style.border = '1px solid transparent';

    dom.addEventListener('keydown', function (event) {

        event.stopPropagation();

    }, false);

    this.dom = dom;
    this.setValue(text);

    return this;

};

Input.prototype = Object.create(Element.prototype);
Input.prototype.constructor = Input;

Input.prototype.getValue = function () {

    return this.dom.value;

};

Input.prototype.setValue = function (value) {

    this.dom.value = value;

    return this;

};

export default Input;
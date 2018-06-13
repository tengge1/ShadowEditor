import Element from './Element';

// Button

function Button(value) {

    Element.call(this);

    var dom = document.createElement('button');
    dom.className = 'Button';

    this.dom = dom;
    this.dom.textContent = value;

    return this;

};

Button.prototype = Object.create(Element.prototype);
Button.prototype.constructor = Button;

Button.prototype.setLabel = function (value) {

    this.dom.textContent = value;

    return this;

};

export default Button;
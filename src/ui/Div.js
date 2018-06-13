import Element from './Element';

// Div

function Div() {

    Element.call(this);

    this.dom = document.createElement('div');

    return this;

};

Div.prototype = Object.create(Element.prototype);
Div.prototype.constructor = Div;

export default Div;
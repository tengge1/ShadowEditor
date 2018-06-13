import Element from './Element';

// Span

function Span() {

    Element.call(this);

    this.dom = document.createElement('span');

    return this;

};

Span.prototype = Object.create(Element.prototype);
Span.prototype.constructor = Span;

export default Span;
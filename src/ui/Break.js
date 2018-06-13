import Element from './Element';

// Break

function Break() {

    Element.call(this);

    var dom = document.createElement('br');
    dom.className = 'Break';

    this.dom = dom;

    return this;

};

Break.prototype = Object.create(Element.prototype);
Break.prototype.constructor = Break;

export default Break;
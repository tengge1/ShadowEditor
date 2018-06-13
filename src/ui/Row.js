import Element from './Element';

// Row
function Row() {

    Element.call(this);

    var dom = document.createElement('div');
    dom.className = 'Row';

    this.dom = dom;

    return this;

};

Row.prototype = Object.create(Element.prototype);
Row.prototype.constructor = Row;

export default Row;
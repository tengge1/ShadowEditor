import Element from './Element';

// Panel

function Panel() {

    Element.call(this);

    var dom = document.createElement('div');
    dom.className = 'Panel';

    this.dom = dom;

    return this;

};

Panel.prototype = Object.create(Element.prototype);
Panel.prototype.constructor = Panel;

export default Panel;
import Element from './Element';

// Text

function Text(text) {

    Element.call(this);

    var dom = document.createElement('span');
    dom.className = 'Text';
    dom.style.cursor = 'default';
    dom.style.display = 'inline-block';
    dom.style.verticalAlign = 'middle';

    this.dom = dom;
    this.setValue(text);

    return this;

};

Text.prototype = Object.create(Element.prototype);
Text.prototype.constructor = Text;

Text.prototype.getValue = function () {

    return this.dom.textContent;

};

Text.prototype.setValue = function (value) {

    if (value !== undefined) {

        this.dom.textContent = value;

    }

    return this;

};

export default Text;
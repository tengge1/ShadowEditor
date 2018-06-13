import Element from './Element';

// TextArea

function TextArea() {

    Element.call(this);

    var scope = this;

    var dom = document.createElement('textarea');
    dom.className = 'TextArea';
    dom.style.padding = '2px';
    dom.spellcheck = false;

    dom.addEventListener('keydown', function (event) {

        event.stopPropagation();

        if (event.keyCode === 9) {

            event.preventDefault();

            var cursor = dom.selectionStart;

            dom.value = dom.value.substring(0, cursor) + '\t' + dom.value.substring(cursor);
            dom.selectionStart = cursor + 1;
            dom.selectionEnd = dom.selectionStart;

        }

    }, false);

    this.dom = dom;

    return this;

};

TextArea.prototype = Object.create(Element.prototype);
TextArea.prototype.constructor = TextArea;

TextArea.prototype.getValue = function () {

    return this.dom.value;

};

TextArea.prototype.setValue = function (value) {

    this.dom.value = value;

    return this;

};

export default TextArea;
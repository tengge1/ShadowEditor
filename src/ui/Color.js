import Element from './Element';

// Color

function Color() {

    Element.call(this);

    var scope = this;

    var dom = document.createElement('input');
    dom.className = 'Color';
    dom.style.width = '64px';
    dom.style.height = '17px';
    dom.style.border = '0px';
    dom.style.padding = '2px';
    dom.style.backgroundColor = 'transparent';

    try {

        dom.type = 'color';
        dom.value = '#ffffff';

    } catch (exception) { }

    this.dom = dom;

    return this;

};

Color.prototype = Object.create(Element.prototype);
Color.prototype.constructor = Color;

Color.prototype.getValue = function () {

    return this.dom.value;

};

Color.prototype.getHexValue = function () {

    return parseInt(this.dom.value.substr(1), 16);

};

Color.prototype.setValue = function (value) {

    this.dom.value = value;

    return this;

};

Color.prototype.setHexValue = function (hex) {

    this.dom.value = '#' + ('000000' + hex.toString(16)).slice(- 6);

    return this;

};

export default Color;
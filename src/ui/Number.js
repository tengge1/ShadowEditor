import Element from './Element';

// Number

function Number(number) {

    Element.call(this);

    var scope = this;

    var dom = document.createElement('input');
    dom.className = 'Number';
    dom.value = '0.00';

    dom.addEventListener('keydown', function (event) {

        event.stopPropagation();

        if (event.keyCode === 13) dom.blur();

    }, false);

    this.value = 0;

    this.min = - Infinity;
    this.max = Infinity;

    this.precision = 2;
    this.step = 1;
    this.unit = '';

    this.dom = dom;

    this.setValue(number);

    var changeEvent = document.createEvent('HTMLEvents');
    changeEvent.initEvent('change', true, true);

    var distance = 0;
    var onMouseDownValue = 0;

    var pointer = [0, 0];
    var prevPointer = [0, 0];

    function onMouseDown(event) {

        event.preventDefault();

        distance = 0;

        onMouseDownValue = scope.value;

        prevPointer = [event.clientX, event.clientY];

        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseup', onMouseUp, false);

    }

    function onMouseMove(event) {

        var currentValue = scope.value;

        pointer = [event.clientX, event.clientY];

        distance += (pointer[0] - prevPointer[0]) - (pointer[1] - prevPointer[1]);

        var value = onMouseDownValue + (distance / (event.shiftKey ? 5 : 50)) * scope.step;
        value = Math.min(scope.max, Math.max(scope.min, value));

        if (currentValue !== value) {

            scope.setValue(value);
            dom.dispatchEvent(changeEvent);

        }

        prevPointer = [event.clientX, event.clientY];

    }

    function onMouseUp(event) {

        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);

        if (Math.abs(distance) < 2) {

            dom.focus();
            dom.select();

        }

    }

    function onChange(event) {

        scope.setValue(dom.value);

    }

    function onFocus(event) {

        dom.style.backgroundColor = '';
        dom.style.cursor = '';

    }

    function onBlur(event) {

        dom.style.backgroundColor = 'transparent';
        dom.style.cursor = 'col-resize';

    }

    onBlur();

    dom.addEventListener('mousedown', onMouseDown, false);
    dom.addEventListener('change', onChange, false);
    dom.addEventListener('focus', onFocus, false);
    dom.addEventListener('blur', onBlur, false);

    return this;

};

Number.prototype = Object.create(Element.prototype);
Number.prototype.constructor = Number;

Number.prototype.getValue = function () {

    return this.value;

};

Number.prototype.setValue = function (value) {

    if (value !== undefined) {

        value = parseFloat(value);

        if (value < this.min) value = this.min;
        if (value > this.max) value = this.max;

        this.value = value;
        this.dom.value = value.toFixed(this.precision);

        if (this.unit !== '') this.dom.value += ' ' + this.unit;

    }

    return this;

};

Number.prototype.setPrecision = function (precision) {

    this.precision = precision;

    return this;

};

Number.prototype.setStep = function (step) {

    this.step = step;

    return this;

};

Number.prototype.setRange = function (min, max) {

    this.min = min;
    this.max = max;

    return this;

};

Number.prototype.setUnit = function (unit) {

    this.unit = unit;

    return this;

};

export default Number;
import Control from './Control';

/**
 * 数字
 * @param {*} options 
 */
function Number(options) {
    Control.call(this, options);
    options = options || {};

    this.value = options.value || 0;

    this.min = - Infinity;
    this.max = Infinity;

    this.precision = 2;
    this.step = 1;
    this.unit = '';
};

Number.prototype = Object.create(Control.prototype);
Number.prototype.constructor = Number;

Number.prototype.render = function () {
    this.dom = document.createElement('input');
    this.dom.className = 'Number';
    this.dom.value = '0.00';

    var _this = this;

    this.dom.addEventListener('keydown', function (event) {
        event.stopPropagation();

        if (event.keyCode === 13) {
            _this.dom.blur();
        }
    }, false);

    this.setValue(this.value);

    var changeEvent = document.createEvent('HTMLEvents');
    changeEvent.initEvent('change', true, true);

    var distance = 0;
    var onMouseDownValue = 0;

    var pointer = [0, 0];
    var prevPointer = [0, 0];

    function onMouseDown(event) {
        event.preventDefault();
        distance = 0;
        onMouseDownValue = _this.value;
        prevPointer = [event.clientX, event.clientY];
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseup', onMouseUp, false);
    }

    function onMouseMove(event) {
        var currentValue = _this.value;
        pointer = [event.clientX, event.clientY];
        distance += (pointer[0] - prevPointer[0]) - (pointer[1] - prevPointer[1]);
        var value = onMouseDownValue + (distance / (event.shiftKey ? 5 : 50)) * _this.step;
        value = Math.min(_this.max, Math.max(_this.min, value));

        if (currentValue !== value) {
            _this.setValue(value);
            _this.dom.dispatchEvent(changeEvent);
        }

        prevPointer = [event.clientX, event.clientY];
    }

    function onMouseUp(event) {
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);

        if (Math.abs(distance) < 2) {
            _this.dom.focus();
            _this.dom.select();
        }
    }

    function onChange(event) {
        _this.setValue(_this.dom.value);
    }

    function onFocus(event) {
        _this.dom.style.backgroundColor = '';
        _this.dom.style.cursor = '';
    }

    function onBlur(event) {
        _this.dom.style.backgroundColor = 'transparent';
        _this.dom.style.cursor = 'col-resize';
    }

    onBlur();

    this.dom.addEventListener('mousedown', onMouseDown, false);
    this.dom.addEventListener('change', onChange, false);
    this.dom.addEventListener('focus', onFocus, false);
    this.dom.addEventListener('blur', onBlur, false);

    this.parent.appendChild(this.dom);
};

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
import Control from './Control';

/**
 * 整数
 * @param {*} options 
 */
function Integer(options) {
    Control.call(this, options);
    options = options || {};

    this.id = options.id || null;
    this.value = options.value || 0;
    this.min = options.range ? options.range[0] : -Infinity;
    this.max = options.range ? options.range[1] : Infinity;
    this.step = options.step || 1; // TODO: step无效
    this.cls = options.cls || 'Number';
    this.style = options.style || null;

    this.onChange = options.onChange || null;
};

Integer.prototype = Object.create(Control.prototype);
Integer.prototype.constructor = Integer;

Integer.prototype.render = function () {
    this.dom = document.createElement('input');

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.dom.className = this.cls;
    this.dom.value = '0';

    this.dom.addEventListener('keydown', function (event) {
        event.stopPropagation();
    }, false);

    this.setValue(this.value);

    var changeEvent = document.createEvent('HTMLEvents');
    changeEvent.initEvent('change', true, true);

    var distance = 0;
    var onMouseDownValue = 0;

    var pointer = [0, 0];
    var prevPointer = [0, 0];

    var _this = this;

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
        value = Math.min(_this.max, Math.max(_this.min, value)) | 0;

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
        if (_this.onChange) {
            _this.onChange.call(_this, _this.dom.value);
        }
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

Integer.prototype.getValue = function () {
    return this.value;
};

Integer.prototype.setValue = function (value) {
    if (value !== undefined) {
        value = parseInt(value);

        this.value = value;
        this.dom.value = value;
    }

    return this;
};

Integer.prototype.setStep = function (step) {
    this.step = parseInt(step);
    return this;
};

Integer.prototype.setRange = function (min, max) {
    this.min = min;
    this.max = max;

    return this;
};

export default Integer;
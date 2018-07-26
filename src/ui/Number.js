import Control from './Control';

/**
 * 数字
 * @param {*} options 
 */
function Number(options) {
    Control.call(this, options);
    options = options || {};

    this.id = options.id || null;
    this.value = options.value === undefined ? 0 : options.value;
    this.min = options.min === undefined ? -Infinity : options.min;
    this.max = options.max === undefined ? Infinity : options.max;
    this.precision = options.precision === undefined ? 2 : options.precision; // 显示时保留几位小数
    this.step = options.step === undefined ? 1 : options.step; // 步长
    this.unit = options.unit === undefined ? '' : options.unit; // 单位（显示时跟在数字后面）
    this.cls = options.cls || 'Number';
    this.style = options.style || null;

    this.onChange = options.onChange || null;
};

Number.prototype = Object.create(Control.prototype);
Number.prototype.constructor = Number;

Number.prototype.render = function () {
    this.dom = document.createElement('input');

    this.dom.className = this.cls;

    this.dom.value = '0.00';

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    var _this = this;

    // 回车事件
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

Number.prototype.getValue = function () {
    return this.value;
};

Number.prototype.setValue = function (value) {
    value = parseFloat(value);

    if (value < this.min) {
        value = this.min;
    }

    if (value > this.max) {
        value = this.max;
    }

    this.value = value;
    this.dom.value = value.toFixed(this.precision) + this.unit;
};

export default Number;
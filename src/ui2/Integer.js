import Control from './Control';

/**
 * Div
 * @param {*} options 
 */
function Div(options) {
    Control.call(this, options);
};

Div.prototype = Object.create(Control.prototype);
Div.prototype.constructor = Div;

Div.prototype.render = function () {
    var _this = this;

    this.dom = document.createElement('input');
    this.dom.className = 'Number';
    this.dom.value = '0';

    this.dom.addEventListener('keydown', function (event) {
        event.stopPropagation();
    }, false);

    this.value = 0;

    this.min = - Infinity;
    this.max = Infinity;

    this.step = 1;

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
        value = Math.min(scope.max, Math.max(scope.min, value)) | 0;

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
    
    this.parent.appendChild(this.dom);
};

export default Div;
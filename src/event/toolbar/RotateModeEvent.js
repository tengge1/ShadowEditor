import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';

/**
 * 旋转模式事件
 * @param {*} app 
 */
function RotateModeEvent(app) {
    BaseEvent.call(this, app);
}

RotateModeEvent.prototype = Object.create(BaseEvent.prototype);
RotateModeEvent.prototype.constructor = RotateModeEvent;

RotateModeEvent.prototype.start = function () {
    var btn = XType.getControl('rotateBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

RotateModeEvent.prototype.stop = function () {
    var btn = XType.getControl('rotateBtn');
    btn.dom.removeEventListener('click', this.onClick);
    this.app.on(`changeMode.${this.id}`, null);
};

RotateModeEvent.prototype.onClick = function () {
    this.app.call('changeMode', this, 'rotate');
};

RotateModeEvent.prototype.onChangeMode = function (mode) {
    var btn = XType.getControl('rotateBtn');

    if (mode === 'rotate') {
        btn.select();
        this.app.call('transformModeChanged', this, 'rotate');
    } else {
        btn.unselect();
    }
};

export default RotateModeEvent;
import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';

/**
 * 旋转模式事件
 * @param {*} app 
 */
function SelectModeEvent(app) {
    BaseEvent.call(this, app);
}

SelectModeEvent.prototype = Object.create(BaseEvent.prototype);
SelectModeEvent.prototype.constructor = SelectModeEvent;

SelectModeEvent.prototype.start = function () {
    var btn = XType.getControl('selectBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

SelectModeEvent.prototype.stop = function () {
    var btn = XType.getControl('selectBtn');
    btn.dom.removeEventListener('click', this.onClick);
    this.app.on(`changeMode.${this.id}`, null);
};

SelectModeEvent.prototype.onClick = function () {
    this.app.call('changeMode', this, 'select');
};

SelectModeEvent.prototype.onChangeMode = function (mode) {
    var btn = XType.getControl('selectBtn');

    if (mode === 'select') {
        btn.select();
    } else {
        btn.unselect();
    }
};

export default SelectModeEvent;
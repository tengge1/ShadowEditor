import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 旋转模式事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function SelectModeEvent(app) {
    BaseEvent.call(this, app);
}

SelectModeEvent.prototype = Object.create(BaseEvent.prototype);
SelectModeEvent.prototype.constructor = SelectModeEvent;

SelectModeEvent.prototype.start = function () {
    var btn = UI.get('selectBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

SelectModeEvent.prototype.stop = function () {
    var btn = UI.get('selectBtn');
    btn.dom.removeEventListener('click', this.onClick);
    this.app.on(`changeMode.${this.id}`, null);
};

SelectModeEvent.prototype.onClick = function () {
    this.app.call('changeMode', this, 'select');
};

SelectModeEvent.prototype.onChangeMode = function (mode) {
    var btn = UI.get('selectBtn');

    if (mode === 'select') {
        btn.select();
    } else {
        btn.unselect();
    }
};

export default SelectModeEvent;
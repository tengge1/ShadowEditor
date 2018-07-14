import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';

/**
 * 平移模式事件
 * @param {*} app 
 */
function TranslateModeEvent(app) {
    BaseEvent.call(this, app);
}

TranslateModeEvent.prototype = Object.create(BaseEvent.prototype);
TranslateModeEvent.prototype.constructor = TranslateModeEvent;

TranslateModeEvent.prototype.start = function () {
    var btn = XType.getControl('translateBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

TranslateModeEvent.prototype.stop = function () {
    var btn = XType.getControl('translateBtn');
    btn.dom.removeEventListener('click', this.onClick);
    this.app.on(`changeMode.${this.id}`, null);
};

TranslateModeEvent.prototype.onClick = function () {
    this.app.call('changeMode', this, 'translate');
};

TranslateModeEvent.prototype.onChangeMode = function (mode) {
    var btn = XType.getControl('translateBtn');

    if (mode === 'translate') {
        btn.select();
        this.app.call('transformModeChanged', this, 'translate');
    } else {
        btn.unselect();
    }
};

export default TranslateModeEvent;
import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 平移模式事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function TranslateModeEvent(app) {
    BaseEvent.call(this, app);
}

TranslateModeEvent.prototype = Object.create(BaseEvent.prototype);
TranslateModeEvent.prototype.constructor = TranslateModeEvent;

TranslateModeEvent.prototype.start = function () {
    var btn = UI.get('translateBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

TranslateModeEvent.prototype.stop = function () {
    var btn = UI.get('translateBtn');
    btn.dom.removeEventListener('click', this.onClick);
    this.app.on(`changeMode.${this.id}`, null);
};

TranslateModeEvent.prototype.onClick = function () {
    this.app.call('changeMode', this, 'translate');
};

TranslateModeEvent.prototype.onChangeMode = function (mode) {
    var btn = UI.get('translateBtn');

    if (mode === 'translate') {
        btn.select();
    } else {
        btn.unselect();
    }
};

export default TranslateModeEvent;
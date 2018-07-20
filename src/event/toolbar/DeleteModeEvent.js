import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 删除模式事件
 * @param {*} app 
 */
function DeleteModeEvent(app) {
    BaseEvent.call(this, app);
}

DeleteModeEvent.prototype = Object.create(BaseEvent.prototype);
DeleteModeEvent.prototype.constructor = DeleteModeEvent;

DeleteModeEvent.prototype.start = function () {
    var btn = UI.get('deleteBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

DeleteModeEvent.prototype.stop = function () {
    var btn = UI.get('deleteBtn');
    btn.dom.removeEventListener('click', this.onClick);
    this.app.on(`changeMode.${this.id}`, null);
};

DeleteModeEvent.prototype.onClick = function () {
    this.app.call('changeMode', this, 'delete');
};

DeleteModeEvent.prototype.onChangeMode = function (mode) {
    var btn = UI.get('deleteBtn');

    if (mode === 'delete') {
        btn.select();
    } else {
        btn.unselect();
    }
};

export default DeleteModeEvent;
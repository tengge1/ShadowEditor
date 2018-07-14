import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';

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
    var btn = XType.getControl('deleteBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

DeleteModeEvent.prototype.stop = function () {
    var btn = XType.getControl('deleteBtn');
    btn.dom.removeEventListener('click', this.onClick);
    this.app.on(`changeMode.${this.id}`, null);
};

DeleteModeEvent.prototype.onClick = function () {
    this.app.call('changeMode', 'this', 'delete');
};

DeleteModeEvent.prototype.onChangeMode = function (mode) {
    var btn = XType.getControl('deleteBtn');

    if (mode === 'delete') {
        btn.select();
    } else {
        btn.unselect();
    }

    this.app.call('transformModeChanged', this, 'delete');
};

export default DeleteModeEvent;
import BaseEvent from '../BaseEvent';

/**
 * 选中事件
 * @param {*} app 
 */
function SelectEvent(app) {
    BaseEvent.call(this, app);
}

SelectEvent.prototype = Object.create(BaseEvent.prototype);
SelectEvent.prototype.constructor = SelectEvent;

SelectEvent.prototype.start = function () {
    var _this = this;
    this.app.on('select.' + this.id, function (object) {
        _this.onSelect(object);
    });
};

SelectEvent.prototype.stop = function () {
    this.app.on('select.' + this.id, null);
};

SelectEvent.prototype.onSelect = function (object) {
    var editor = this.app.editor;

    if (editor.selected === object) return;

    var uuid = null;

    if (object !== null) {
        uuid = object.uuid;
    }

    editor.selected = object;

    editor.config.setKey('selected', uuid);
    this.app.call('objectSelected', this, object);
};

export default SelectEvent;
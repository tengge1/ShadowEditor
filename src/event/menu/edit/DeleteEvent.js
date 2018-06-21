import MenuEvent from '../MenuEvent';
import RemoveObjectCommand from '../../../command/RemoveObjectCommand';

/**
 * 删除事件
 * @param {*} app 
 */
function DeleteEvent(app) {
    MenuEvent.call(this, app);
}

DeleteEvent.prototype = Object.create(MenuEvent.prototype);
DeleteEvent.prototype.constructor = DeleteEvent;

DeleteEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mDelete.' + this.id, function () {
        _this.onDelete();
    });
};

DeleteEvent.prototype.stop = function () {
    this.app.on('mDelete.' + this.id, null);
};

DeleteEvent.prototype.onDelete = function () {
    var editor = this.app.editor;

    var object = editor.selected;

    if (confirm('删除 ' + object.name + '?') === false) return;

    var parent = object.parent;
    if (parent === undefined) return; // avoid deleting the camera or scene

    editor.execute(new RemoveObjectCommand(object));
};

export default DeleteEvent;
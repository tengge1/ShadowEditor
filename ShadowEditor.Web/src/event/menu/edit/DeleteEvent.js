import MenuEvent from '../MenuEvent';
import RemoveObjectCommand from '../../../command/RemoveObjectCommand';
import UI from '../../../ui/UI';

/**
 * 删除事件
 * @author tengge / https://github.com/tengge1
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

    UI.confirm('询问', '删除 ' + object.name + '?', function (event, btn) {
        if (btn === 'ok') {
            var parent = object.parent;
            if (parent === undefined) return; // avoid deleting the camera or scene

            editor.execute(new RemoveObjectCommand(object));
        }
    });
};

export default DeleteEvent;
import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

/**
 * 拷贝事件
 * @param {*} app 
 */
function CloneEvent(app) {
    MenuEvent.call(this, app);
}

CloneEvent.prototype = Object.create(MenuEvent.prototype);
CloneEvent.prototype.constructor = CloneEvent;

CloneEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mClone.' + this.id, function () {
        _this.onClone();
    });
};

CloneEvent.prototype.stop = function () {
    this.app.on('mClone.' + this.id, null);
};

CloneEvent.prototype.onClone = function () {
    var editor = this.app.editor;

    var object = editor.selected;

    if (object.parent === null) return; // avoid cloning the camera or scene

    object = object.clone();

    editor.execute(new AddObjectCommand(object));
};

export default CloneEvent;
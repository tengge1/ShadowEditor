import MenuEvent from '../MenuEvent';

/**
 * 撤销事件
 * @param {*} app 
 */
function UndoEvent(app) {
    MenuEvent.call(this, app);
}

UndoEvent.prototype = Object.create(MenuEvent.prototype);
UndoEvent.prototype.constructor = UndoEvent;

UndoEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mUndo.' + this.id, function () {
        _this.onUndo();
    });
};

UndoEvent.prototype.stop = function () {
    this.app.on('mUndo.' + this.id, null);
};

UndoEvent.prototype.onUndo = function () {
    var editor = this.app.editor;

    editor.undo();
};

export default UndoEvent;
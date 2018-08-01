import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';

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
    this.app.on('historyChanged.' + this.id, function () {
        _this.onHistoryChanged();
    });
};

UndoEvent.prototype.stop = function () {
    this.app.on('mUndo.' + this.id, null);
    this.app.on('historyChanged.' + this.id, null);
};

UndoEvent.prototype.onUndo = function () {
    var editor = this.app.editor;

    editor.undo();
};

UndoEvent.prototype.onHistoryChanged = function () {
    var history = this.app.editor.history;
    var dom = UI.get('mUndo').dom;

    if (history.undos.length === 0) {
        if (!dom.classList.contains('inactive')) {
            dom.classList.add('inactive');
        }
    } else {
        if (dom.classList.contains('inactive')) {
            dom.classList.remove('inactive');
        }
    }
};

export default UndoEvent;
import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';

/**
 * 重做事件
 * @param {*} app 
 */
function RedoEvent(app) {
    MenuEvent.call(this, app);
}

RedoEvent.prototype = Object.create(MenuEvent.prototype);
RedoEvent.prototype.constructor = RedoEvent;

RedoEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mRedo.' + this.id, function () {
        _this.onRedo();
    });
    this.app.on('historyChanged.' + this.id, function () {
        _this.onHistoryChanged();
    });
};

RedoEvent.prototype.stop = function () {
    this.app.on('mRedo.' + this.id, null);
    this.app.on('historyChanged.' + this.id, null);
};

RedoEvent.prototype.onRedo = function () {
    var editor = this.app.editor;

    editor.redo();
};

RedoEvent.prototype.onHistoryChanged = function () {
    var history = this.app.editor.history;
    var dom = UI.get('mRedo').dom;

    if (history.redos.length === 0) {
        if (!dom.classList.contains('inactive')) {
            dom.classList.add('inactive');
        }
    } else {
        if (dom.classList.contains('inactive')) {
            dom.classList.remove('inactive');
        }
    }
};

export default RedoEvent;
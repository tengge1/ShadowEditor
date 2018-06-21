import MenuEvent from '../MenuEvent';

/**
 * 重做事件
 * @param {*} app 
 */
function ClearHistoryEvent(app) {
    MenuEvent.call(this, app);
}

ClearHistoryEvent.prototype = Object.create(MenuEvent.prototype);
ClearHistoryEvent.prototype.constructor = ClearHistoryEvent;

ClearHistoryEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mClearHistory.' + this.id, function () {
        _this.onClearHistory();
    });
};

ClearHistoryEvent.prototype.stop = function () {
    this.app.on('mClearHistory.' + this.id, null);
};

ClearHistoryEvent.prototype.onClearHistory = function () {
    var editor = this.app.editor;

    if (confirm('撤销/重做历史纪录将被清空。确定吗？')) {
        editor.history.clear();
    }
};

export default ClearHistoryEvent;
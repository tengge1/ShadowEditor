import MenuEvent from '../MenuEvent';
import UI from '../../../ui/UI';

/**
 * 重做事件
 * @author tengge / https://github.com/tengge1
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

    UI.confirm('询问', '撤销/重做历史纪录将被清空。确定吗？', function (event, btn) {
        if (btn === 'ok') {
            editor.history.clear();
        }
    });
};

export default ClearHistoryEvent;
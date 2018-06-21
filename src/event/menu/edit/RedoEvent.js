import MenuEvent from '../MenuEvent';

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
};

RedoEvent.prototype.stop = function () {
    this.app.on('mRedo.' + this.id, null);
};

RedoEvent.prototype.onRedo = function () {
    var editor = this.app.editor;

    editor.redo();
};

export default RedoEvent;
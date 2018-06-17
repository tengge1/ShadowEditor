import BaseEvent from '../BaseEvent';

/**
 * 移除脚本事件
 * @param {*} app 
 */
function RemoveScriptEvent(app) {
    BaseEvent.call(this, app);
}

RemoveScriptEvent.prototype = Object.create(BaseEvent.prototype);
RemoveScriptEvent.prototype.constructor = RemoveScriptEvent;

RemoveScriptEvent.prototype.start = function () {
    var _this = this;
    this.app.on('removeScript.' + this.id, function (object, script) {
        _this.onRemoveScript(object, script);
    });
};

RemoveScriptEvent.prototype.stop = function () {
    this.app.on('removeScript.' + this.id, null);
};

RemoveScriptEvent.prototype.onRemoveScript = function (object, script) {
    var editor = this.app.editor;

    if (editor.scripts[object.uuid] === undefined) return;

    var index = editor.scripts[object.uuid].indexOf(script);

    if (index !== -1) {

        editor.scripts[object.uuid].splice(index, 1);

    }

    editor.signals.scriptRemoved.dispatch(script);
};

export default RemoveScriptEvent;
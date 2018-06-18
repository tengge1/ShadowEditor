import BaseEvent from '../BaseEvent';

/**
 * 添加脚本事件
 * @param {*} app 
 */
function AddScriptEvent(app) {
    BaseEvent.call(this, app);
}

AddScriptEvent.prototype = Object.create(BaseEvent.prototype);
AddScriptEvent.prototype.constructor = AddScriptEvent;

AddScriptEvent.prototype.start = function () {
    var _this = this;
    this.app.on('addScript.' + this.id, function (object, script) {
        _this.onAddScript(object, script);
    });
};

AddScriptEvent.prototype.stop = function () {
    this.app.on('addScript.' + this.id, null);
};

AddScriptEvent.prototype.onAddScript = function (object, script) {
    var editor = this.app.editor;

    if (editor.scripts[object.uuid] === undefined) {

        editor.scripts[object.uuid] = [];

    }

    editor.scripts[object.uuid].push(script);

    editor.app.call('scriptAdded', this, script);
};

export default AddScriptEvent;
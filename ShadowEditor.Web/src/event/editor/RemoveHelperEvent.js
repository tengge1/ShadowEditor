import BaseEvent from '../BaseEvent';

/**
 * 移除帮助事件
 * @param {*} app 
 */
function RemoveHelperEvent(app) {
    BaseEvent.call(this, app);
}

RemoveHelperEvent.prototype = Object.create(BaseEvent.prototype);
RemoveHelperEvent.prototype.constructor = RemoveHelperEvent;

RemoveHelperEvent.prototype.start = function () {
    var _this = this;
    this.app.on(`removeHelper.${this.id}`, this.onRemoveHelper.bind(this));
};

RemoveHelperEvent.prototype.stop = function () {
    this.app.on(`removeHelper.${this.id}`, null);
};

RemoveHelperEvent.prototype.onRemoveHelper = function (object) {
    var editor = this.app.editor;

    if (editor.helpers[object.id] !== undefined) {

        var helper = editor.helpers[object.id];
        helper.parent.remove(helper);
        delete editor.helpers[object.id];

        var objects = editor.objects;
        objects.splice(objects.indexOf(helper.getObjectByName('picker')), 1);
    }
};

export default RemoveHelperEvent;
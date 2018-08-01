import BaseEvent from '../BaseEvent';

/**
 * 帮助工具事件
 * @param {*} app 
 */
function HelperEvent(app) {
    BaseEvent.call(this, app);
}

HelperEvent.prototype = Object.create(BaseEvent.prototype);
HelperEvent.prototype.constructor = HelperEvent;

HelperEvent.prototype.start = function () {
    var _this = this;
    this.app.on('helperAdded.' + this.id, function (object) {
        _this.onHelperAdded(object);
    });
    this.app.on('helperRemoved.' + this.id, function (object) {
        _this.onHelperRemoved(object);
    });
};

HelperEvent.prototype.stop = function () {
    this.app.on('helperAdded.' + this.id, null);
    this.app.on('helperRemoved.' + this.id, null);
};

HelperEvent.prototype.onHelperAdded = function (object) {
    var objects = this.app.editor.objects;

    objects.push(object.getObjectByName('picker'));
};

HelperEvent.prototype.onHelperRemoved = function (object) {
    var objects = this.app.editor.objects;

    objects.splice(objects.indexOf(object.getObjectByName('picker')), 1);
};

export default HelperEvent;
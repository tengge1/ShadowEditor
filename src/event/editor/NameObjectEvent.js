import BaseEvent from '../BaseEvent';

/**
 * 重命名物体事件
 * @param {*} app 
 */
function NameObjectEvent(app) {
    BaseEvent.call(this, app);
}

NameObjectEvent.prototype = Object.create(BaseEvent.prototype);
NameObjectEvent.prototype.constructor = NameObjectEvent;

NameObjectEvent.prototype.start = function () {
    var _this = this;
    this.app.on('nameObject.' + this.id, function (object, name) {
        _this.onNameObject(object);
    });
};

NameObjectEvent.prototype.stop = function () {
    this.app.on('nameObject.' + this.id, null);
};

NameObjectEvent.prototype.onNameObject = function (object, name) {
    var editor = this.app.editor;

    object.name = name;
    editor.app.call('sceneGraphChanged', this);
};

export default NameObjectEvent;
import BaseEvent from '../BaseEvent';

/**
 * 设置材质名称事件
 * @param {*} app 
 */
function SetMaterialNameEvent(app) {
    BaseEvent.call(this, app);
}

SetMaterialNameEvent.prototype = Object.create(BaseEvent.prototype);
SetMaterialNameEvent.prototype.constructor = SetMaterialNameEvent;

SetMaterialNameEvent.prototype.start = function () {
    var _this = this;
    this.app.on('setMaterialName.' + this.id, function (material, name) {
        _this.onSetMaterialName(material, name);
    });
};

SetMaterialNameEvent.prototype.stop = function () {
    this.app.on('setMaterialName.' + this.id, null);
};

SetMaterialNameEvent.prototype.onSetMaterialName = function (material, name) {
    var editor = this.app.editor;

    material.name = name;
    editor.signals.sceneGraphChanged.dispatch();
};

export default SetMaterialNameEvent;
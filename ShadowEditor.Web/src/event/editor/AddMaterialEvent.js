import BaseEvent from '../BaseEvent';

/**
 * 添加材质事件
 * @param {*} app 
 */
function AddMaterialEvent(app) {
    BaseEvent.call(this, app);
}

AddMaterialEvent.prototype = Object.create(BaseEvent.prototype);
AddMaterialEvent.prototype.constructor = AddMaterialEvent;

AddMaterialEvent.prototype.start = function () {
    var _this = this;
    this.app.on('addMaterial.' + this.id, function (material) {
        _this.onAddMaterial(material);
    });
};

AddMaterialEvent.prototype.stop = function () {
    this.app.on('addMaterial.' + this.id, null);
};

AddMaterialEvent.prototype.onAddMaterial = function (material) {
    var editor = this.app.editor;

    editor.materials[material.uuid] = material;
};

export default AddMaterialEvent;
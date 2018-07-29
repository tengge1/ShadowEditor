import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加环境光事件
 * @param {*} app 
 */
function AddAmbientLightEvent(app) {
    MenuEvent.call(this, app);
}

AddAmbientLightEvent.prototype = Object.create(MenuEvent.prototype);
AddAmbientLightEvent.prototype.constructor = AddAmbientLightEvent;

AddAmbientLightEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddAmbientLight.' + this.id, function () {
        _this.onAddAmbientLightEvent();
    });
};

AddAmbientLightEvent.prototype.stop = function () {
    this.app.on('mAddAmbientLight.' + this.id, null);
};

AddAmbientLightEvent.prototype.onAddAmbientLightEvent = function () {
    var editor = this.app.editor;

    var color = 0xaaaaaa;

    var light = new THREE.AmbientLight(color);
    light.name = '环境光' + ID++;

    editor.execute(new AddObjectCommand(light));
};

export default AddAmbientLightEvent;
import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加聚光灯事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddSpotLightEvent(app) {
    MenuEvent.call(this, app);
}

AddSpotLightEvent.prototype = Object.create(MenuEvent.prototype);
AddSpotLightEvent.prototype.constructor = AddSpotLightEvent;

AddSpotLightEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddSpotLight.' + this.id, function () {
        _this.onAddSpotLight();
    });
};

AddSpotLightEvent.prototype.stop = function () {
    this.app.on('mAddSpotLight.' + this.id, null);
};

AddSpotLightEvent.prototype.onAddSpotLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;
    var distance = 0;
    var angle = Math.PI * 0.1;
    var penumbra = 0;

    var light = new THREE.SpotLight(color, intensity, distance, angle, penumbra);

    light.name = '聚光灯' + ID;
    light.target.name = 'SpotLight ' + (ID++) + ' Target';
    light.castShadow = true;

    light.position.set(5, 10, 7.5);

    editor.execute(new AddObjectCommand(light));
};

export default AddSpotLightEvent;
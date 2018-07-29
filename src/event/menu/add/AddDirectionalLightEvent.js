import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加平行光源事件
 * @param {*} app 
 */
function AddDirectionalLightEvent(app) {
    MenuEvent.call(this, app);
}

AddDirectionalLightEvent.prototype = Object.create(MenuEvent.prototype);
AddDirectionalLightEvent.prototype.constructor = AddDirectionalLightEvent;

AddDirectionalLightEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddDirectionalLight.' + this.id, function () {
        _this.onAddDirectionalLight();
    });
};

AddDirectionalLightEvent.prototype.stop = function () {
    this.app.on('mAddDirectionalLight.' + this.id, null);
};

AddDirectionalLightEvent.prototype.onAddDirectionalLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;

    var light = new THREE.DirectionalLight(color, intensity);
    light.name = '平行光' + ID;
    light.target.name = 'DirectionalLight ' + (ID++) + ' Target';

    light.position.set(5, 10, 7.5);

    editor.execute(new AddObjectCommand(light));
};

export default AddDirectionalLightEvent;
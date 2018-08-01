import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加点光源事件
 * @param {*} app 
 */
function AddPointLightEvent(app) {
    MenuEvent.call(this, app);
}

AddPointLightEvent.prototype = Object.create(MenuEvent.prototype);
AddPointLightEvent.prototype.constructor = AddPointLightEvent;

AddPointLightEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddPointLight.' + this.id, function () {
        _this.onAddPointLight();
    });
};

AddPointLightEvent.prototype.stop = function () {
    this.app.on('mAddPointLight.' + this.id, null);
};

AddPointLightEvent.prototype.onAddPointLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;
    var distance = 0;

    var light = new THREE.PointLight(color, intensity, distance);
    light.name = '点光源' + ID++;

    editor.execute(new AddObjectCommand(light));
};

export default AddPointLightEvent;
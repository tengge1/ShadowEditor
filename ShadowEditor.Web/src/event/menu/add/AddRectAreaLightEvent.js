import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加矩形光事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddRectAreaLightEvent(app) {
    MenuEvent.call(this, app);
}

AddRectAreaLightEvent.prototype = Object.create(MenuEvent.prototype);
AddRectAreaLightEvent.prototype.constructor = AddRectAreaLightEvent;

AddRectAreaLightEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddRectAreaLight.' + this.id, function () {
        _this.onAddHemisphereLight();
    });
};

AddRectAreaLightEvent.prototype.stop = function () {
    this.app.on('mAddRectAreaLight.' + this.id, null);
};

AddRectAreaLightEvent.prototype.onAddHemisphereLight = function () {
    var editor = this.app.editor;

    var color = 0xffffff;
    var intensity = 1;
    var width = 20;
    var height = 10;

    var light = new THREE.RectAreaLight(color, intensity, width, height);
    light.name = '矩形光' + ID++;

    light.position.set(0, 6, 0);

    editor.execute(new AddObjectCommand(light));
};

export default AddRectAreaLightEvent;
import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加半球光事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddHemisphereLightEvent(app) {
    MenuEvent.call(this, app);
}

AddHemisphereLightEvent.prototype = Object.create(MenuEvent.prototype);
AddHemisphereLightEvent.prototype.constructor = AddHemisphereLightEvent;

AddHemisphereLightEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddHemisphereLight.' + this.id, function () {
        _this.onAddHemisphereLight();
    });
};

AddHemisphereLightEvent.prototype.stop = function () {
    this.app.on('mAddHemisphereLight.' + this.id, null);
};

AddHemisphereLightEvent.prototype.onAddHemisphereLight = function () {
    var editor = this.app.editor;

    var skyColor = 0x00aaff;
    var groundColor = 0xffaa00;
    var intensity = 1;

    var light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    light.name = '半球光' + ID++;

    light.position.set(0, 10, 0);

    editor.execute(new AddObjectCommand(light));
};

export default AddHemisphereLightEvent;
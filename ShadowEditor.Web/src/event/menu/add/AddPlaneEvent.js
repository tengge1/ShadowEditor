import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加平板事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddPlaneEvent(app) {
    MenuEvent.call(this, app);
}

AddPlaneEvent.prototype = Object.create(MenuEvent.prototype);
AddPlaneEvent.prototype.constructor = AddPlaneEvent;

AddPlaneEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddPlane.' + this.id, function () {
        _this.onAddPlane();
    });
};

AddPlaneEvent.prototype.stop = function () {
    this.app.on('mAddPlane.' + this.id, null);
};

AddPlaneEvent.prototype.onAddPlane = function () {
    var editor = this.app.editor;

    var geometry = new THREE.PlaneBufferGeometry(50, 50);
    var material = new THREE.MeshStandardMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = '平板' + ID++;
    mesh.rotation.x = -Math.PI / 2;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddPlaneEvent;
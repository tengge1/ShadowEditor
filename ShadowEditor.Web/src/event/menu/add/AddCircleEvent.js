import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加圆事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddCircleEvent(app) {
    MenuEvent.call(this, app);
}

AddCircleEvent.prototype = Object.create(MenuEvent.prototype);
AddCircleEvent.prototype.constructor = AddCircleEvent;

AddCircleEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddCircle.' + this.id, function () {
        _this.onAddCircle();
    });
};

AddCircleEvent.prototype.stop = function () {
    this.app.on('mAddCircle.' + this.id, null);
};

AddCircleEvent.prototype.onAddCircle = function () {
    var editor = this.app.editor;

    var radius = 1;
    var segments = 32;

    var geometry = new THREE.CircleBufferGeometry(radius, segments);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    mesh.name = '圆' + ID++;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddCircleEvent;
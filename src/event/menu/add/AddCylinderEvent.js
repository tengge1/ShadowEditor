import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加圆柱体事件
 * @param {*} app 
 */
function AddCylinderEvent(app) {
    MenuEvent.call(this, app);
}

AddCylinderEvent.prototype = Object.create(MenuEvent.prototype);
AddCylinderEvent.prototype.constructor = AddCylinderEvent;

AddCylinderEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddCylinder.' + this.id, function () {
        _this.onAddCylinder();
    });
};

AddCylinderEvent.prototype.stop = function () {
    this.app.on('mAddCylinder.' + this.id, null);
};

AddCylinderEvent.prototype.onAddCylinder = function () {
    var editor = this.app.editor;

    var radiusTop = 1;
    var radiusBottom = 1;
    var height = 2;
    var radiusSegments = 32;
    var heightSegments = 1;
    var openEnded = false;

    var geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    mesh.name = '圆柱体 ' + ID++;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddCylinderEvent;
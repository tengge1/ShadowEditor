import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加二十面体事件
 * @param {*} app 
 */
function AddIcosahedronEvent(app) {
    MenuEvent.call(this, app);
}

AddIcosahedronEvent.prototype = Object.create(MenuEvent.prototype);
AddIcosahedronEvent.prototype.constructor = AddIcosahedronEvent;

AddIcosahedronEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddIcosahedron.' + this.id, function () {
        _this.onAddIcosahedron();
    });
};

AddIcosahedronEvent.prototype.stop = function () {
    this.app.on('mAddIcosahedron.' + this.id, null);
};

AddIcosahedronEvent.prototype.onAddIcosahedron = function () {
    var editor = this.app.editor;

    var radius = 1;
    var detail = 2;

    var geometry = new THREE.IcosahedronGeometry(radius, detail);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    mesh.name = '二十面体 ' + ID++;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddIcosahedronEvent;
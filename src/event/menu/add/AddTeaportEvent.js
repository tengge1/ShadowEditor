import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加茶壶事件
 * @param {*} app 
 */
function AddTeaportEvent(app) {
    MenuEvent.call(this, app);
}

AddTeaportEvent.prototype = Object.create(MenuEvent.prototype);
AddTeaportEvent.prototype.constructor = AddTeaportEvent;

AddTeaportEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddTeaport.' + this.id, function () {
        _this.onAddTeaport();
    });
};

AddTeaportEvent.prototype.stop = function () {
    this.app.on('mAddTeaport.' + this.id, null);
};

AddTeaportEvent.prototype.onAddTeaport = function () {
    var editor = this.app.editor;

    var size = 3;
    var segments = 10;
    var bottom = true;
    var lid = true;
    var body = true;
    var fitLid = true;
    var blinn = true;

    var geometry = new THREE.TeapotBufferGeometry(size, segments, bottom, lid, body, fitLid, blinn);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    mesh.name = 'Teaport ' + ID++;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddTeaportEvent;
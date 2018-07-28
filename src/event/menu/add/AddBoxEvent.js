import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加正方体事件
 * @param {*} app 
 */
function AddBoxEvent(app) {
    MenuEvent.call(this, app);
}

AddBoxEvent.prototype = Object.create(MenuEvent.prototype);
AddBoxEvent.prototype.constructor = AddBoxEvent;

AddBoxEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddBox.' + this.id, function () {
        _this.onAddBox();
    });
};

AddBoxEvent.prototype.stop = function () {
    this.app.on('mAddBox.' + this.id, null);
};

AddBoxEvent.prototype.onAddBox = function () {
    var editor = this.app.editor;

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    mesh.name = '正方体 ' + ID++;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddBoxEvent;
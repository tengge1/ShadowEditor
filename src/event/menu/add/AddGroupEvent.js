import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加组事件
 * @param {*} app 
 */
function AddGroupEvent(app) {
    MenuEvent.call(this, app);
}

AddGroupEvent.prototype = Object.create(MenuEvent.prototype);
AddGroupEvent.prototype.constructor = AddGroupEvent;

AddGroupEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddGroup.' + this.id, function () {
        _this.onAddGroup();
    });
};

AddGroupEvent.prototype.stop = function () {
    this.app.on('mAddGroup.' + this.id, null);
};

AddGroupEvent.prototype.onAddGroup = function () {
    var editor = this.app.editor;

    var mesh = new THREE.Group();
    mesh.name = 'Group ' + ID++;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddGroupEvent;
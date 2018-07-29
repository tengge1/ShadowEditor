import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加轮胎事件
 * @param {*} app 
 */
function AddTorusEvent(app) {
    MenuEvent.call(this, app);
}

AddTorusEvent.prototype = Object.create(MenuEvent.prototype);
AddTorusEvent.prototype.constructor = AddTorusEvent;

AddTorusEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddTorus.' + this.id, function () {
        _this.onAddTorus();
    });
};

AddTorusEvent.prototype.stop = function () {
    this.app.on('mAddTorus.' + this.id, null);
};

AddTorusEvent.prototype.onAddTorus = function () {
    var editor = this.app.editor;

    var radius = 2;
    var tube = 1;
    var radialSegments = 32;
    var tubularSegments = 12;
    var arc = Math.PI * 2;

    var geometry = new THREE.TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    mesh.name = '轮胎' + ID++;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddTorusEvent;
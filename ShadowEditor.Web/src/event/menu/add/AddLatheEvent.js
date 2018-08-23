import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加花瓶事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddLatheEvent(app) {
    MenuEvent.call(this, app);
}

AddLatheEvent.prototype = Object.create(MenuEvent.prototype);
AddLatheEvent.prototype.constructor = AddLatheEvent;

AddLatheEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddLathe.' + this.id, function () {
        _this.onAddLathe();
    });
};

AddLatheEvent.prototype.stop = function () {
    this.app.on('mAddLathe.' + this.id, null);
};

AddLatheEvent.prototype.onAddLathe = function () {
    var editor = this.app.editor;

    var points = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(4, 0),
        new THREE.Vector2(3.5, 0.5),
        new THREE.Vector2(1, 0.75),
        new THREE.Vector2(0.8, 1),
        new THREE.Vector2(0.8, 4),
        new THREE.Vector2(1, 4.2),
        new THREE.Vector2(1.4, 4.8),
        new THREE.Vector2(2, 5),
        new THREE.Vector2(2.5, 5.4),
        new THREE.Vector2(3, 12)
    ];
    var segments = 20;
    var phiStart = 0;
    var phiLength = 2 * Math.PI;

    var geometry = new THREE.LatheBufferGeometry(points, segments, phiStart, phiLength);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }));
    mesh.name = '花瓶' + ID++;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddLatheEvent;
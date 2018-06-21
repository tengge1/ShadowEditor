import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加球体事件
 * @param {*} app 
 */
function AddSphereEvent(app) {
    MenuEvent.call(this, app);
}

AddSphereEvent.prototype = Object.create(MenuEvent.prototype);
AddSphereEvent.prototype.constructor = AddSphereEvent;

AddSphereEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddSphere.' + this.id, function () {
        _this.onAddSphere();
    });
};

AddSphereEvent.prototype.stop = function () {
    this.app.on('mAddSphere.' + this.id, null);
};

AddSphereEvent.prototype.onAddSphere = function () {
    var editor = this.app.editor;

    var radius = 1;
    var widthSegments = 32;
    var heightSegments = 16;
    var phiStart = 0;
    var phiLength = Math.PI * 2;
    var thetaStart = 0;
    var thetaLength = Math.PI;

    var geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    mesh.name = 'Sphere ' + ID++;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddSphereEvent;
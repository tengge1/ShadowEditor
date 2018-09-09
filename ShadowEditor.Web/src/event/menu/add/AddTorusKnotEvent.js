import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加纽结事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddTorusKnotEvent(app) {
    MenuEvent.call(this, app);
}

AddTorusKnotEvent.prototype = Object.create(MenuEvent.prototype);
AddTorusKnotEvent.prototype.constructor = AddTorusKnotEvent;

AddTorusKnotEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddTorusKnot.' + this.id, function () {
        _this.onAddTorusKnot();
    });
};

AddTorusKnotEvent.prototype.stop = function () {
    this.app.on('mAddTorusKnot.' + this.id, null);
};

AddTorusKnotEvent.prototype.onAddTorusKnot = function () {
    var editor = this.app.editor;

    var radius = 2;
    var tube = 0.8;
    var tubularSegments = 64;
    var radialSegments = 12;
    var p = 2;
    var q = 3;

    var geometry = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    mesh.name = '纽结' + ID++;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddTorusKnotEvent;
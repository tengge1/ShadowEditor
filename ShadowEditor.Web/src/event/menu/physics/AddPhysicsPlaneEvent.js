import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = -1;

/**
 * 添加物理平板
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddPhysicsPlaneEvent(app) {
    MenuEvent.call(this, app);
}

AddPhysicsPlaneEvent.prototype = Object.create(MenuEvent.prototype);
AddPhysicsPlaneEvent.prototype.constructor = AddPhysicsPlaneEvent;

AddPhysicsPlaneEvent.prototype.start = function () {
    this.app.on(`mAddPhysicsPlane.${this.id}`, this.onAddPlane.bind(this));
};

AddPhysicsPlaneEvent.prototype.stop = function () {
    this.app.on(`mAddPhysicsPlane.${this.id}`, null);
};

AddPhysicsPlaneEvent.prototype.onAddPlane = function () {
    var pos = new THREE.Vector3(0, -0.5, 0);
    var quat = new THREE.Quaternion();

    var ground = this.app.physics.createParalellepiped(40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
    ground.name = '物理平板' + ID--;
    ground.castShadow = true;
    ground.receiveShadow = true;

    this.app.editor.execute(new AddObjectCommand(ground));

    var loader = new THREE.TextureLoader();
    loader.load("assets/textures/grid.png", function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(40, 40);
        ground.material.map = texture;
        ground.material.needsUpdate = true;
    });
};

export default AddPhysicsPlaneEvent;
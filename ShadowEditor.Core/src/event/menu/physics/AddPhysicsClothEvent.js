import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

/**
 * 添加物理布料
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddPhysicsClothEvent(app) {
    MenuEvent.call(this, app);
}

AddPhysicsClothEvent.prototype = Object.create(MenuEvent.prototype);
AddPhysicsClothEvent.prototype.constructor = AddPhysicsClothEvent;

AddPhysicsClothEvent.prototype.start = function () {
    this.app.on(`mAddPhysicsCloth.${this.id}`, this.onAddCloth.bind(this));
};

AddPhysicsClothEvent.prototype.stop = function () {
    this.app.on(`mAddPhysicsCloth.${this.id}`, null);
};

AddPhysicsClothEvent.prototype.onAddCloth = function () {
    // The cloth
    // Cloth graphic object
    var clothWidth = 4;
    var clothHeight = 3;
    var clothNumSegmentsZ = clothWidth * 5;
    var clothNumSegmentsY = clothHeight * 5;
    var clothSegmentLengthZ = clothWidth / clothNumSegmentsZ;
    var clothSegmentLengthY = clothHeight / clothNumSegmentsY;
    var clothPos = new THREE.Vector3(-3, 3, 2);
    //var clothGeometry = new THREE.BufferGeometry();
    var clothGeometry = new THREE.PlaneBufferGeometry(clothWidth, clothHeight, clothNumSegmentsZ, clothNumSegmentsY);
    clothGeometry.rotateY(Math.PI * 0.5);
    clothGeometry.translate(clothPos.x, clothPos.y + clothHeight * 0.5, clothPos.z - clothWidth * 0.5);
    //var clothMaterial = new THREE.MeshLambertMaterial( { color: 0x0030A0, side: THREE.DoubleSide } );
    var clothMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
    var cloth = new THREE.Mesh(clothGeometry, clothMaterial);
    cloth.name = '布';
    cloth.castShadow = true;
    cloth.receiveShadow = false;

    this.app.editor.execute(new AddObjectCommand(cloth));

    new THREE.TextureLoader().load("assets/textures/grid.png", function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(clothNumSegmentsZ, clothNumSegmentsY);
        cloth.material.map = texture;
        cloth.material.needsUpdate = true;
    });
    // Cloth physic object
    var softBodyHelpers = new Ammo.btSoftBodyHelpers();
    var clothCorner00 = new Ammo.btVector3(clothPos.x, clothPos.y + clothHeight, clothPos.z);
    var clothCorner01 = new Ammo.btVector3(clothPos.x, clothPos.y + clothHeight, clothPos.z - clothWidth);
    var clothCorner10 = new Ammo.btVector3(clothPos.x, clothPos.y, clothPos.z);
    var clothCorner11 = new Ammo.btVector3(clothPos.x, clothPos.y, clothPos.z - clothWidth);
    var clothSoftBody = softBodyHelpers.CreatePatch(this.app.physics.world.getWorldInfo(), clothCorner00, clothCorner01, clothCorner10, clothCorner11, clothNumSegmentsZ + 1, clothNumSegmentsY + 1, 0, true);
    var sbConfig = clothSoftBody.get_m_cfg();
    sbConfig.set_viterations(10);
    sbConfig.set_piterations(10);
    clothSoftBody.setTotalMass(0.9, false);
    Ammo.castObject(clothSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(this.app.physics.margin * 3);

    this.app.physics.world.addSoftBody(clothSoftBody, 1, -1);

    cloth.userData.physicsBody = clothSoftBody;
    // Disable deactivation
    clothSoftBody.setActivationState(4);

    // The base
    var armMass = 2;
    var armLength = 3 + clothWidth;
    var pylonHeight = clothPos.y + clothHeight;
    var baseMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
    var pos = new THREE.Vector3();
    pos.set(clothPos.x, 0.1, clothPos.z - armLength);
    var quat = new THREE.Quaternion();
    quat.set(0, 0, 0, 1);

    var base = this.app.physics.createParalellepiped(1, 0.2, 1, 0, pos, quat, baseMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    pos.set(clothPos.x, 0.5 * pylonHeight, clothPos.z - armLength);

    this.app.editor.execute(new AddObjectCommand(base));

    var pylon = this.app.physics.createParalellepiped(0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial);
    pylon.castShadow = true;
    pylon.receiveShadow = true;
    pos.set(clothPos.x, pylonHeight + 0.2, clothPos.z - 0.5 * armLength);

    this.app.editor.execute(new AddObjectCommand(pylon));

    var arm = this.app.physics.createParalellepiped(0.4, 0.4, armLength + 0.4, 0, pos, quat, baseMaterial);
    arm.castShadow = true;
    arm.receiveShadow = true;

    this.app.editor.execute(new AddObjectCommand(arm));

    // Glue the cloth to the arm
    var influence = 0.5;
    clothSoftBody.appendAnchor(0, arm.userData.physicsBody, false, influence);
    clothSoftBody.appendAnchor(clothNumSegmentsZ, arm.userData.physicsBody, false, influence);

    // Hinge constraint to move the arm
    var pivotA = new Ammo.btVector3(0, pylonHeight * 0.5, 0);
    var pivotB = new Ammo.btVector3(0, -0.2, - armLength * 0.5);
    var axis = new Ammo.btVector3(0, 1, 0);
    var hinge = new Ammo.btHingeConstraint(pylon.userData.physicsBody, arm.userData.physicsBody, pivotA, pivotB, axis, axis, true);
    this.app.physics.world.addConstraint(hinge, true);

    this.cloth = cloth;

    this.app.on(`animate`, this.onAnimate.bind(this));
};

AddPhysicsClothEvent.prototype.onAnimate = function (clock, deltaTime) {
    if (this.cloth == null) {
        return;
    }

    var cloth = this.cloth;

    // Update cloth
    var softBody = cloth.userData.physicsBody;
    var clothPositions = cloth.geometry.attributes.position.array;
    var numVerts = clothPositions.length / 3;
    var nodes = softBody.get_m_nodes();
    var indexFloat = 0;
    for (var i = 0; i < numVerts; i++) {
        var node = nodes.at(i);
        var nodePos = node.get_m_x();
        clothPositions[indexFloat++] = nodePos.x();
        clothPositions[indexFloat++] = nodePos.y();
        clothPositions[indexFloat++] = nodePos.z();
    }
    cloth.geometry.computeVertexNormals();
    cloth.geometry.attributes.position.needsUpdate = true;
    cloth.geometry.attributes.normal.needsUpdate = true;
};

export default AddPhysicsClothEvent;
import MenuEvent from '../MenuEvent';

/**
 * 添加物理布料
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
    return;

    var pos = new THREE.Vector3();
    var quat = new THREE.Quaternion();
    // Ground
    pos.set(0, - 0.5, 0);
    quat.set(0, 0, 0, 1);
    var ground = createParalellepiped(40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
    ground.castShadow = true;
    ground.receiveShadow = true;
    textureLoader.load("textures/grid.png", function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(40, 40);
        ground.material.map = texture;
        ground.material.needsUpdate = true;
    });
    // Wall
    var brickMass = 0.5;
    var brickLength = 1.2;
    var brickDepth = 0.6;
    var brickHeight = brickLength * 0.5;
    var numBricksLength = 6;
    var numBricksHeight = 8;
    var z0 = - numBricksLength * brickLength * 0.5;
    pos.set(0, brickHeight * 0.5, z0);
    quat.set(0, 0, 0, 1);
    for (var j = 0; j < numBricksHeight; j++) {
        var oddRow = (j % 2) == 1;
        pos.z = z0;
        if (oddRow) {
            pos.z -= 0.25 * brickLength;
        }
        var nRow = oddRow ? numBricksLength + 1 : numBricksLength;
        for (var i = 0; i < nRow; i++) {
            var brickLengthCurrent = brickLength;
            var brickMassCurrent = brickMass;
            if (oddRow && (i == 0 || i == nRow - 1)) {
                brickLengthCurrent *= 0.5;
                brickMassCurrent *= 0.5;
            }
            var brick = createParalellepiped(brickDepth, brickHeight, brickLengthCurrent, brickMassCurrent, pos, quat, createMaterial());
            brick.castShadow = true;
            brick.receiveShadow = true;
            if (oddRow && (i == 0 || i == nRow - 2)) {
                pos.z += 0.75 * brickLength;
            }
            else {
                pos.z += brickLength;
            }
        }
        pos.y += brickHeight;
    }
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
    cloth = new THREE.Mesh(clothGeometry, clothMaterial);
    cloth.castShadow = true;
    cloth.receiveShadow = true;
    scene.add(cloth);
    textureLoader.load("textures/grid.png", function (texture) {
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
    var clothSoftBody = softBodyHelpers.CreatePatch(physicsWorld.getWorldInfo(), clothCorner00, clothCorner01, clothCorner10, clothCorner11, clothNumSegmentsZ + 1, clothNumSegmentsY + 1, 0, true);
    var sbConfig = clothSoftBody.get_m_cfg();
    sbConfig.set_viterations(10);
    sbConfig.set_piterations(10);
    clothSoftBody.setTotalMass(0.9, false);
    Ammo.castObject(clothSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(margin * 3);
    physicsWorld.addSoftBody(clothSoftBody, 1, -1);
    cloth.userData.physicsBody = clothSoftBody;
    // Disable deactivation
    clothSoftBody.setActivationState(4);
    // The base
    var armMass = 2;
    var armLength = 3 + clothWidth;
    var pylonHeight = clothPos.y + clothHeight;
    var baseMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
    pos.set(clothPos.x, 0.1, clothPos.z - armLength);
    quat.set(0, 0, 0, 1);
    var base = createParalellepiped(1, 0.2, 1, 0, pos, quat, baseMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    pos.set(clothPos.x, 0.5 * pylonHeight, clothPos.z - armLength);
    var pylon = createParalellepiped(0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial);
    pylon.castShadow = true;
    pylon.receiveShadow = true;
    pos.set(clothPos.x, pylonHeight + 0.2, clothPos.z - 0.5 * armLength);
    var arm = createParalellepiped(0.4, 0.4, armLength + 0.4, armMass, pos, quat, baseMaterial);
    arm.castShadow = true;
    arm.receiveShadow = true;
    // Glue the cloth to the arm
    var influence = 0.5;
    clothSoftBody.appendAnchor(0, arm.userData.physicsBody, false, influence);
    clothSoftBody.appendAnchor(clothNumSegmentsZ, arm.userData.physicsBody, false, influence);
    // Hinge constraint to move the arm
    var pivotA = new Ammo.btVector3(0, pylonHeight * 0.5, 0);
    var pivotB = new Ammo.btVector3(0, -0.2, - armLength * 0.5);
    var axis = new Ammo.btVector3(0, 1, 0);
    hinge = new Ammo.btHingeConstraint(pylon.userData.physicsBody, arm.userData.physicsBody, pivotA, pivotB, axis, axis, true);
    physicsWorld.addConstraint(hinge, true);
};

export default AddPhysicsClothEvent;
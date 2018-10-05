import PhysicsData from '../../physics/PhysicsData';

/**
 * 正方体
 * @param {*} geometry 几何体
 * @param {*} material 材质
 */
function Box(geometry = new THREE.BoxBufferGeometry(1, 1, 1), material = new THREE.MeshStandardMaterial()) {
    THREE.Mesh.call(this, geometry, material);

    this.name = '正方体';
    this.castShadow = true;
    this.receiveShadow = true;

    this.userData.physics = Object.assign({}, PhysicsData, {
        shape: 'btBoxShape',
    });

    // 物理
    // var position = this.position;
    // var quaternion = this.quaternion;
    // var mass = 1.0;

    // var transform = new Ammo.btTransform();
    // transform.setIdentity();
    // transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    // transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
    // var motionState = new Ammo.btDefaultMotionState(transform);

    // var localInertia = new Ammo.btVector3(0, 0, 0);
    // var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
    // shape.setMargin(0.05);
    // shape.calculateLocalInertia(mass, localInertia);

    // var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    // var body = new Ammo.btRigidBody(rbInfo);

    // this.userData.physicsBody = body;
}

Box.prototype = Object.create(THREE.Mesh.prototype);
Box.prototype.constructor = Box;

export default Box;
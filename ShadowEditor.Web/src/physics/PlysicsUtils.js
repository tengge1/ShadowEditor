/**
 * 物理工具
 */
var PlysicsUtils = {
    createRigidBody: function (obj, margin = 0.05) {
        var position = obj.position;
        var quaternion = obj.quaternion;
        var shape = obj.userData.physics.shape;
        var mass = obj.userData.physics.mass;
        var inertia = obj.userData.physics.inertia;

        var sx = 0;
        var sy = 0;
        var sz = 0;

        if (obj.geometry instanceof THREE.PlaneBufferGeometry) {
            sx = obj.geometry.parameters.width;
            sy = obj.geometry.parameters.height;
            sz = 1;
        } else if (obj.geometry instanceof THREE.BoxBufferGeometry) {
            sx = obj.geometry.parameters.width;
            sy = obj.geometry.parameters.height;
            sz = obj.geometry.parameters.depth;
        } else {
            console.warn(`PlysicsUtils: 无法为${obj.name}创建刚体组件。`);
            return null;
        }

        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
        transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
        var motionState = new Ammo.btDefaultMotionState(transform);

        var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
        shape.setMargin(margin);
        var localInertia = new Ammo.btVector3(inertia.x, inertia.y, inertia.z);
        shape.calculateLocalInertia(mass, localInertia);

        var info = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        return new Ammo.btRigidBody(info);
    }
};

export default PlysicsUtils;
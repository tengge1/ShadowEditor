/**
 * 物理工具
 */
var PlysicsUtils = {
    createRigidBody: function (obj, margin = 0.05) {
        var position = obj.position;
        var quaternion = obj.quaternion;
        var scale = obj.scale;

        var mass = obj.userData.physics.mass;
        var inertia = obj.userData.physics.inertia;

        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
        transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
        var motionState = new Ammo.btDefaultMotionState(transform);

        var shape = null;
        if (obj.geometry instanceof THREE.PlaneBufferGeometry) {
            var x = obj.geometry.parameters.width * scale.x;
            var y = obj.geometry.parameters.height * scale.y;
            shape = new Ammo.btBoxShape(new Ammo.btVector3(x * 0.5, y * 0.5, 0));
        } else if (obj.geometry instanceof THREE.BoxBufferGeometry) {
            var x = obj.geometry.parameters.width * scale.x;
            var y = obj.geometry.parameters.height * scale.y;
            var z = obj.geometry.parameters.depth * scale.z;
            shape = new Ammo.btBoxShape(new Ammo.btVector3(x * 0.5, y * 0.5, z * 0.5));
        } else if (obj.geometry instanceof THREE.SphereBufferGeometry) {
            var radius = obj.geometry.parameters.radius;
            shape = new Ammo.btSphereShape(radius);
        } else {
            console.warn(`PlysicsUtils: 无法为${obj.name}创建刚体组件。`);
            return null;
        }

        shape.setMargin(margin);
        var localInertia = new Ammo.btVector3(inertia.x, inertia.y, inertia.z);
        shape.calculateLocalInertia(mass, localInertia);

        var info = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        return new Ammo.btRigidBody(info);
    }
};

export default PlysicsUtils;
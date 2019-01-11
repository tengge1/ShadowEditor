import PlayerComponent from './PlayerComponent';
import ThrowBallEvent from './physics/ThrowBallEvent';

const shape = {
    btBoxShape: Ammo.btBoxShape, // 正方体
    btBvhTriangleMeshShape: Ammo.btBvhTriangleMeshShape, // 三角形
    btCapsuleShape: Ammo.btCapsuleShape, // 胶囊
    btCapsuleShapeX: Ammo.btCapsuleShapeX, // x轴胶囊
    btCapsuleShapeZ: Ammo.btCapsuleShapeZ, // z轴胶囊
    btCollisionShape: Ammo.btCollisionShape, // 碰撞体
    btCompoundShape: Ammo.btCompoundShape, // 复合形状
    btConcaveShape: Ammo.btConcaveShape, // 
    btConeShape: Ammo.btConeShape, // 圆锥体
    btConeShapeX: Ammo.btConeShapeX, // x轴圆椎体
    btConeShapeZ: Ammo.btConeShapeZ, // z轴圆椎体
    btConvexHullShape: Ammo.btConvexHullShape, // 凸包
    btConvexShape: Ammo.btConvexShape, // 
    btConvexTriangleMeshShape: Ammo.btConvexTriangleMeshShape, // 凸三角形
    btCylinderShape: Ammo.btCylinderShape, // 圆柱体
    btCylinderShapeX: Ammo.btCylinderShapeX, // x轴圆柱体
    btCylinderShapeZ: Ammo.btCylinderShapeZ, // z轴圆柱体
    btHeightfieldTerrainShape: Ammo.btHeightfieldTerrainShape, // 灰阶高程地形
    btSphereShape: Ammo.btSphereShape, // 球体
    btStaticPlaneShape: Ammo.btStaticPlaneShape, // 静态平板
    btTriangleMeshShape: Ammo.btTriangleMeshShape, // 三角网格
};

/**
 * 播放器物理
 * @param {*} app 应用
 */
function PlayerPhysics(app) {
    PlayerComponent.call(this, app);

    // 各种参数
    var gravityConstant = -9.8; // 重力常数
    this.margin = 0.05; // 两个物体之间最小间距

    // 物理环境配置
    var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration(); // 软体刚体碰撞配置
    var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration); // 碰撞调度器
    var broadphase = new Ammo.btDbvtBroadphase(); // dbvt粗测
    var solver = new Ammo.btSequentialImpulseConstraintSolver(); // 顺序脉冲约束求解器
    var softBodySolver = new Ammo.btDefaultSoftBodySolver(); // 默认软体求解器

    this.world = new Ammo.btSoftRigidDynamicsWorld(
        dispatcher,
        broadphase,
        solver,
        collisionConfiguration,
        softBodySolver
    );

    var gravity = new Ammo.btVector3(0, gravityConstant, 0);
    this.world.setGravity(gravity);
    this.world.getWorldInfo().set_m_gravity(gravity);

    this.transformAux1 = new Ammo.btTransform();
    this.rigidBodies = [];

    this.events = [
        new ThrowBallEvent(this.app, this.world, this.rigidBodies)
    ];

    // api函数
    Object.assign(app, {
        addPhysicsObject: this.addPhysicsObject.bind(this)
    });
}

PlayerPhysics.prototype = Object.create(PlayerComponent.prototype);
PlayerPhysics.prototype.constructor = PlayerPhysics;

PlayerPhysics.prototype.create = function (scene, camera, renderer) {
    this.scene = scene;

    this.scene.traverse(n => {
        if (n.userData && n.userData.physics && n.userData.physics.enabled) {
            var body = this.createRigidBody(n);
            if (body) {
                n.userData.physics.body = body;
                this.world.addRigidBody(body);

                if (n.userData.physics.mass > 0) {
                    this.rigidBodies.push(n);
                    body.setActivationState(4);
                }
            }
        }
    });

    this.events.forEach(n => {
        n.create(scene, camera, renderer);
    });

    return new Promise(resolve => {
        resolve();
    });
};

PlayerPhysics.prototype.update = function (clock, deltaTime) {
    var rigidBodies = this.rigidBodies;

    this.world.stepSimulation(deltaTime, 0);

    for (var i = 0, l = rigidBodies.length; i < l; i++) {
        var objThree = rigidBodies[i];
        var objPhys = objThree.userData.physics.body;
        if (!objPhys) {
            continue;
        }
        var ms = objPhys.getMotionState();
        if (ms) {
            ms.getWorldTransform(this.transformAux1);
            var p = this.transformAux1.getOrigin();
            var q = this.transformAux1.getRotation();
            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
    }

    this.events.forEach(n => {
        n.update(clock, deltaTime);
    });
};

PlayerPhysics.prototype.dispose = function () {
    this.events.forEach(n => {
        n.dispose();
    });

    this.rigidBodies.forEach(n => {
        var body = n.userData.physics.body;
        this.world.removeRigidBody(body);
    });

    this.rigidBodies.length = 0;

    this.scene.traverse(n => {
        if (n.userData && n.userData.physics && n.userData.physics) {
            n.userData.physics.body = null;
        }
    });

    this.scene = null;
};

// ------------------------------------ 创建刚体 ------------------------------------

PlayerPhysics.prototype.createRigidBody = function (obj) {
    var position = obj.position;
    var quaternion = obj.quaternion;
    var scale = obj.scale;

    var physics = obj.userData.physics;
    var shape = physics.shape;
    var mass = physics.mass;
    var inertia = physics.inertia;

    // 形状
    var physicsShape = null;

    if (shape === 'btBoxShape') {
        var geometry = obj.geometry;
        geometry.computeBoundingBox();

        var box = geometry.boundingBox;

        var x = box.max.x - box.min.x;
        var y = box.max.y - box.min.y;
        var z = box.max.z - box.min.z;

        // var center = new THREE.Vector3();
        // box.getCenter(center);
        // box.translate(center);

        physicsShape = new Ammo.btBoxShape(new Ammo.btVector3(x * 0.5, y * 0.5, z * 0.5));
    } else if (shape === 'btSphereShape') {
        var geometry = obj.geometry;
        geometry.computeBoundingSphere();

        var sphere = geometry.boundingSphere;
        physicsShape = new Ammo.btSphereShape(sphere.radius);
    } else {
        console.warn(`PlayerPhysics: 无法创建形状${shape}。`);
        return null;
    }

    // 位移
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

    var defaultState = new Ammo.btDefaultMotionState(transform);

    var localInertia = new Ammo.btVector3(inertia.x, inertia.y, inertia.z);
    physicsShape.calculateLocalInertia(mass, localInertia);

    var info = new Ammo.btRigidBodyConstructionInfo(mass, defaultState, physicsShape, localInertia);
    return new Ammo.btRigidBody(info);
};

// --------------------------------- API函数 ------------------------------------------------

/**
 * 添加一个物理物体
 * @param {*} obj 
 */
PlayerPhysics.prototype.addPhysicsObject = function (obj) {
    this.scene.add(obj);
    if (obj.userData && obj.userData.physics && obj.userData.physics.enabled) {
        var body = this.createRigidBody(obj);
        if (body) {
            obj.userData.physics.body = body;
            this.world.addRigidBody(body);

            if (obj.userData.physics.mass > 0) {
                this.rigidBodies.push(obj);
                body.setActivationState(4);
            }
        }
    }
};

export default PlayerPhysics;
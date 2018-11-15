import PlayerComponent from './PlayerComponent';
import PlysicsUtils from '../../physics/PlysicsUtils';

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
}

PlayerPhysics.prototype = Object.create(PlayerComponent.prototype);
PlayerPhysics.prototype.constructor = PlayerPhysics;

PlayerPhysics.prototype.create = function (scene, camera, renderer) {
    this.scene = scene;

    this.scene.traverse(n => {
        if (n.userData && n.userData.physics) {
            var body = PlysicsUtils.createRigidBody(n, this.margin);
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
};

PlayerPhysics.prototype.update = function (clock, deltaTime) {
    var rigidBodies = this.rigidBodies;

    this.world.stepSimulation(deltaTime, 100);

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
};

PlayerPhysics.prototype.dispose = function () {
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

export default PlayerPhysics;
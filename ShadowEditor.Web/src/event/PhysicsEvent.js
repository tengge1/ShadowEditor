import BaseEvent from './BaseEvent';

/**
 * 物理事件
 */
function PhysicsEngine() {
    BaseEvent.call(this);

    this.enabled = false;
    this.init = false;

    this.rigidBodies = [];
    this.softBodies = [];

    this.onOptionChange = this.onOptionChange.bind(this);
}

PhysicsEngine.prototype = Object.create(BaseEvent.prototype);
PhysicsEngine.prototype.constructor = PhysicsEngine;

PhysicsEngine.prototype.start = function () {
    app.on(`optionChange.${this.id}`, this.onOptionChange);
};

PhysicsEngine.prototype.stop = function () {
    app.on(`optionChange.${this.id}`, null);
};

PhysicsEngine.prototype.onOptionChange = function (name, value) {
    if (name !== 'enablePhysics') {
        return;
    }
    if (value) {
        this.enablePhysics();
    } else {
        this.disablePhysics();
    }
};

PhysicsEngine.prototype.enablePhysics = function () {
    this.enabled = true;

    if (!this.init) {
        this.init = true;
        this.initPhysicsWorld();
    }

    this.createScene();
};

PhysicsEngine.prototype.disablePhysics = function () {
    this.enabled = false;
};

PhysicsEngine.prototype.initPhysicsWorld = function () {
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
    this.softBodyHelpers = new Ammo.btSoftBodyHelpers();
};

PhysicsEngine.prototype.createScene = function () {
    app.editor.scene;
};

PhysicsEngine.prototype.traverseObject = function() {
    
};

PhysicsEngine.prototype.initScene = function (scene, camera, renderer) {
    var body = null;

    this.scene.traverse(n => {
        if (n.userData &&
            n.userData.physics &&
            n.userData.physics.enabled
        ) {
            if (n.userData.physics.type === 'rigidBody') {
                body = this.createRigidBody(n);
                if (body) {
                    n.userData.physics.body = body;
                    this.world.addRigidBody(body);

                    if (n.userData.physics.mass > 0) {
                        this.rigidBodies.push(n);
                        body.setActivationState(4);
                    }
                }
            } else if (n.userData.physics.type === 'softVolume') {
                body = this.createSoftVolume(n);
                if (body) {
                    n.userData.physics.body = body;
                    this.world.addSoftBody(body, 1, -1);

                    this.softBodies.push(n);

                    if (n.userData.physics.mass > 0) {
                        body.setActivationState(4);
                    }
                }
            } else {
                console.warn(`PlayerPhysics: unknown physics type ${n.userData.physics.type}.`);
            }
        }
    });
};

PhysicsEngine.prototype.update = function (clock, deltaTime) {
    if (!this.world) {
        return;
    }

    this.world.stepSimulation(deltaTime, 10);

    // 更新柔软体
    var softBodies = this.softBodies;
    var i = 0;

    for (i = 0, il = softBodies.length; i < il; i++) {
        var volume = softBodies[i];

        var geometry = volume.geometry;
        var body = volume.userData.physics.body;

        var volumePositions = geometry.attributes.position.array;
        var volumeNormals = geometry.attributes.normal.array;
        var association = geometry.ammoIndexAssociation;

        var numVerts = association.length;
        var nodes = body.get_m_nodes();

        for (var j = 0; j < numVerts; j++) {
            var node = nodes.at(j);
            var nodePos = node.get_m_x();
            var x = nodePos.x();
            var y = nodePos.y();
            var z = nodePos.z();
            var nodeNormal = node.get_m_n();
            var nx = nodeNormal.x();
            var ny = nodeNormal.y();
            var nz = nodeNormal.z();
            var assocVertex = association[j];

            for (var k = 0, kl = assocVertex.length; k < kl; k++) {
                var indexVertex = assocVertex[k];
                volumePositions[indexVertex] = x;
                volumeNormals[indexVertex] = nx;
                indexVertex++;
                volumePositions[indexVertex] = y;
                volumeNormals[indexVertex] = ny;
                indexVertex++;
                volumePositions[indexVertex] = z;
                volumeNormals[indexVertex] = nz;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;
    }

    // 更新刚体
    var rigidBodies = this.rigidBodies;

    for (i = 0, l = rigidBodies.length; i < l; i++) {
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

PhysicsEngine.prototype.dispose = function () {
    this.events && this.events.forEach(n => {
        n.dispose();
    });

    if (this.rigidBodies) {
        this.rigidBodies.forEach(n => {
            var body = n.userData.physics.body;
            this.world.removeRigidBody(body);
        });

        this.rigidBodies.length = 0;
    }

    if (this.softBodies) {
        this.softBodies.forEach(n => {
            var body = n.userData.physics.body;
            this.world.removeRigidBody(body);
        });

        this.softBodies.length = 0;
    }

    this.scene.traverse(n => {
        if (n.userData && n.userData.physics) {
            n.userData.physics.body = null;
        }
    });

    this.scene = null;
};

// ------------------------------------ 创建刚体 ------------------------------------

PhysicsEngine.prototype.createRigidBody = function (obj) {
    var position = obj.position;
    var quaternion = obj.quaternion;
    var scale = obj.scale;

    var physics = obj.userData.physics;
    var shape = physics.shape;
    var mass = physics.mass;
    var inertia = physics.inertia;

    // 形状
    var geometry = null;
    var physicsShape = null;

    if (shape === 'btBoxShape') {
        geometry = obj.geometry;
        geometry.computeBoundingBox();

        var box = geometry.boundingBox;

        var x = box.max.x - box.min.x;
        var y = box.max.y - box.min.y;
        var z = box.max.z - box.min.z;

        var center = new THREE.Vector3();
        box.getCenter(center);

        position = position.clone();
        position.add(center);

        physicsShape = new Ammo.btBoxShape(new Ammo.btVector3(x * 0.5, y * 0.5, z * 0.5));
    } else if (shape === 'btSphereShape') {
        geometry = obj.geometry;
        geometry.computeBoundingSphere();

        var sphere = geometry.boundingSphere;
        physicsShape = new Ammo.btSphereShape(sphere.radius);
    } else {
        console.warn(`PlayerPhysics: cannot create shape ${shape}.`);
        return null;
    }

    physicsShape.setMargin(0.05);

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

/**
 * 添加一个物理物体
 * @param {*} obj 几何体
 */
PhysicsEngine.prototype.addPhysicsObject = function (obj) {
    this.scene.add(obj);
    if (obj.userData && obj.userData.physics && obj.userData.physics.enabled) {
        if (obj.userData.physics.type === 'rigidBody') {
            var body = this.createRigidBody(obj);
            if (body) {
                obj.userData.physics.body = body;
                this.world.addRigidBody(body);

                if (obj.userData.physics.mass > 0) {
                    this.rigidBodies.push(obj);
                    body.setActivationState(4);
                }
            }
        } else if (obj.userData.physics.type === 'softVolume') {
            console.warn(_t('SoftVolume is not supported.'));
        }
    }
};

export default PhysicsEngine;